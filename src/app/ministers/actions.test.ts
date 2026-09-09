import { beforeEach, describe, expect, it, vi } from "vitest";
import { INITIAL_ACTION_STATE } from "@/lib/action-state";

const mocks = vi.hoisted(() => ({
  admin: vi.fn(),
  user: vi.fn(),
  transaction: vi.fn(),
  existing: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  audit: vi.fn(),
  profile: vi.fn(),
  session: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({
  requireAdmin: mocks.admin,
  getCurrentUser: mocks.user,
  createSession: mocks.session,
  destroySession: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: (path: string) => {
    throw new Error(`redirect:${path}`);
  },
}));
vi.mock("@/lib/password", () => ({
  hashPassword: vi.fn(async () => "hashed-test-password"),
}));
vi.mock("@/lib/db", () => ({
  db: {
    $transaction: mocks.transaction,
    user: { findUnique: mocks.existing, create: mocks.create },
    ministerProfile: {
      findUnique: mocks.profile,
      updateMany: mocks.update,
      create: mocks.create,
    },
    auditLog: { create: mocks.audit },
    ministryRequestLimit: { upsert: vi.fn(), deleteMany: vi.fn() },
  },
}));
import { registerMinister, requestMinisterAccess } from "./actions";
import { reviewMinister } from "../admin/ministers/actions";
import {
  uploadMinistryFile,
  updateMinistryFile,
} from "../admin/ministry-files/actions";

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}
const details = {
  fullName: "Test Minister",
  email: "minister@example.test",
  phone: "+1 555 0100",
  church: "Test congregation",
  ministryRole: "Pastor",
  requestNote: "",
  password: "a-long-test-password",
  confirmPassword: "a-long-test-password",
};
const userId = "7b84619d-9403-4600-80f4-c851947120c1";

describe("minister account and administrator mutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.admin.mockResolvedValue({ id: "admin", role: "ADMIN" });
    mocks.user.mockResolvedValue({ id: userId, role: "STUDENT" });
    mocks.existing.mockResolvedValue(null);
    mocks.create.mockResolvedValue({ id: userId });
    mocks.profile.mockResolvedValue({ status: "PENDING", clearance: 0 });
    mocks.update.mockResolvedValue({ count: 1 });
    mocks.transaction.mockImplementation(async (input) =>
      typeof input === "function"
        ? input({
            user: { create: mocks.create },
            ministerProfile: {
              findUnique: mocks.profile,
              updateMany: mocks.update,
            },
            auditLog: { create: mocks.audit },
          })
        : [{ attempts: 1 }, { attempts: 1 }, { count: 0 }],
    );
  });
  it("creates a pending account and ignores forged admin privileges", async () => {
    await expect(
      registerMinister(
        INITIAL_ACTION_STATE,
        form({ ...details, role: "ADMIN", status: "APPROVED", clearance: "3" }),
      ),
    ).rejects.toThrow("redirect:/ministers");
    expect(mocks.create.mock.calls[0][0].data).toMatchObject({
      role: "STUDENT",
      passwordHash: "hashed-test-password",
      ministerProfile: { create: { status: "PENDING", clearance: 0 } },
    });
    expect(mocks.session).toHaveBeenCalledWith(userId);
  });
  it("does not replace an existing account or its password", async () => {
    mocks.existing.mockResolvedValue({ id: "existing" });
    expect(
      (await registerMinister(INITIAL_ACTION_STATE, form(details))).status,
    ).toBe("error");
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.session).not.toHaveBeenCalled();
  });
  it("requires a signed-in account to request access", async () => {
    mocks.user.mockResolvedValue(null);
    await expect(
      requestMinisterAccess(INITIAL_ACTION_STATE, form(details)),
    ).rejects.toThrow("redirect:/ministers/login");
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
  it.each([reviewMinister, uploadMinistryFile, updateMinistryFile])(
    "requires an administrator before any mutation",
    async (action) => {
      mocks.admin.mockRejectedValue(new Error("not-an-admin"));
      await expect(
        action(INITIAL_ACTION_STATE, new FormData()),
      ).rejects.toThrow("not-an-admin");
      expect(mocks.transaction).not.toHaveBeenCalled();
    },
  );
  it("suspension removes clearance even if the submitted level is Restricted", async () => {
    await reviewMinister(
      INITIAL_ACTION_STATE,
      form({
        userId,
        version: "2",
        status: "SUSPENDED",
        clearance: "3",
        adminNotes: "",
      }),
    );
    expect(mocks.update.mock.calls[0][0]).toMatchObject({
      where: { userId, version: 2 },
      data: { status: "SUSPENDED", clearance: 0 },
    });
  });
  it("does not record or report success for a stale approval decision", async () => {
    mocks.update.mockResolvedValue({ count: 0 });
    const result = await reviewMinister(
      INITIAL_ACTION_STATE,
      form({
        userId,
        version: "0",
        status: "APPROVED",
        clearance: "1",
        adminNotes: "",
      }),
    );
    expect(result.status).toBe("error");
    expect(mocks.audit).not.toHaveBeenCalled();
  });
});
