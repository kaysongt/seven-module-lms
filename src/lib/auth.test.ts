import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ cookie: vi.fn(), session: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: async () => ({ get: mocks.cookie }) }));
vi.mock("next/navigation", () => ({ redirect: (path: string) => { throw new Error("redirect:" + path); } }));
vi.mock("@/lib/db", () => ({ db: { session: { findUnique: mocks.session } } }));
import { getCurrentUser, requireAdmin } from "@/lib/auth";

describe("temporary password access", () => {
  beforeEach(() => { vi.clearAllMocks(); mocks.cookie.mockReturnValue({ value: "session-token" }); });
  const session = (mustChangePassword: boolean, role = "ADMIN") => ({ expiresAt: new Date(Date.now() + 60000), user: { id: "user", role, mustChangePassword } });
  it("blocks admin access before a temporary password is replaced", async () => {
    mocks.session.mockResolvedValue(session(true));
    await expect(requireAdmin()).rejects.toThrow("redirect:/change-password");
  });
  it("blocks direct current-user consumers such as private file downloads", async () => {
    mocks.session.mockResolvedValue(session(true));
    await expect(getCurrentUser()).rejects.toThrow("redirect:/change-password");
  });
  it("allows only the explicit password-change flow to read the restricted account", async () => {
    mocks.session.mockResolvedValue(session(true));
    expect(await getCurrentUser({ allowPasswordChange: true })).toMatchObject({ mustChangePassword: true });
  });
  it("restores admin access after replacement", async () => {
    mocks.session.mockResolvedValue(session(false));
    expect(await requireAdmin()).toMatchObject({ role: "ADMIN" });
  });
  it("still denies non-admin accounts", async () => {
    mocks.session.mockResolvedValue(session(false, "STUDENT"));
    await expect(requireAdmin()).rejects.toThrow("redirect:/dashboard");
  });
  it("does not allow missing or expired sessions into the reset flow", async () => {
    mocks.cookie.mockReturnValue(undefined);
    expect(await getCurrentUser({ allowPasswordChange: true })).toBeNull();
    mocks.cookie.mockReturnValue({ value: "session-token" });
    mocks.session.mockResolvedValue({ ...session(true), expiresAt: new Date(0) });
    expect(await getCurrentUser({ allowPasswordChange: true })).toBeNull();
  });
});
