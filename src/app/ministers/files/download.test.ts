import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  user: vi.fn(),
  profile: vi.fn(),
  file: vi.fn(),
  content: vi.fn(),
  audit: vi.fn(),
}));
vi.mock("@/lib/auth", () => ({ getCurrentUser: mocks.user }));
vi.mock("@/lib/db", () => ({
  db: {
    ministerProfile: { findUnique: mocks.profile },
    ministryFile: { findUnique: mocks.file },
    ministryFileContent: { findUnique: mocks.content },
    auditLog: { create: mocks.audit },
  },
}));
import { GET } from "./[id]/route";
const request = () =>
  GET(new Request("http://localhost/ministers/files/test"), {
    params: Promise.resolve({ id: "test" }),
  });

describe("private ministry download route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.user.mockResolvedValue({ id: "minister", role: "STUDENT" });
    mocks.profile.mockResolvedValue({ status: "APPROVED", clearance: 1 });
    mocks.file.mockResolvedValue({
      status: "PUBLISHED",
      clearance: 1,
      fileName: "notes.pdf",
      mimeType: "application/pdf",
    });
    mocks.content.mockResolvedValue({
      data: new TextEncoder().encode("%PDF-private"),
    });
    mocks.audit.mockResolvedValue({});
  });
  it("returns 401 without querying file data for a signed-out request", async () => {
    mocks.user.mockResolvedValue(null);
    expect((await request()).status).toBe(401);
    expect(mocks.file).not.toHaveBeenCalled();
    expect(mocks.content).not.toHaveBeenCalled();
  });
  it("denies a copied high-clearance URL without fetching its bytes", async () => {
    mocks.file.mockResolvedValue({ status: "PUBLISHED", clearance: 3 });
    const response = await request();
    expect(response.status).toBe(404);
    expect(await response.text()).toBe("Document not available.");
    expect(mocks.content).not.toHaveBeenCalled();
  });
  it("rechecks approval on each request after suspension", async () => {
    expect((await request()).status).toBe(200);
    mocks.content.mockClear();
    mocks.profile.mockResolvedValue({ status: "SUSPENDED", clearance: 0 });
    expect((await request()).status).toBe(404);
    expect(mocks.content).not.toHaveBeenCalled();
  });
  it("sends allowed files as private attachments and records the download", async () => {
    const response = await request();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(response.headers.get("content-disposition")).toContain(
      "attachment;",
    );
    expect(response.headers.get("x-content-type-options")).toBe("nosniff");
    expect(await response.text()).toBe("%PDF-private");
    expect(mocks.audit).toHaveBeenCalledOnce();
  });
  it("does not serve a document after it is archived", async () => {
    mocks.file.mockResolvedValue({ status: "ARCHIVED", clearance: 1 });
    expect((await request()).status).toBe(404);
    expect(mocks.content).not.toHaveBeenCalled();
  });
});
