import { describe, expect, it } from "vitest";
import {
  canReadMinistryFile,
  inspectMinistryFile,
  MAX_MINISTRY_FILE_BYTES,
  ministerSignupSchema,
} from "./ministry-policy";
import { safeReturnPath } from "./return-path";

describe("minister document clearance", () => {
  const user = { role: "STUDENT" };
  for (const status of ["PENDING", "DECLINED", "SUSPENDED"]) {
    it(`denies ${status} even with a forged high clearance`, () => {
      expect(
        canReadMinistryFile(
          user,
          { status, clearance: 3 },
          { status: "PUBLISHED", clearance: 1 },
        ),
      ).toBe(false);
    });
  }
  it("denies anonymous users and accounts without a minister profile", () => {
    expect(
      canReadMinistryFile(
        null,
        { status: "APPROVED", clearance: 3 },
        { status: "PUBLISHED", clearance: 1 },
      ),
    ).toBe(false);
    expect(
      canReadMinistryFile(user, null, { status: "PUBLISHED", clearance: 1 }),
    ).toBe(false);
    expect(
      canReadMinistryFile({ role: "INSTRUCTOR" }, null, {
        status: "PUBLISHED",
        clearance: 1,
      }),
    ).toBe(false);
  });
  it("enforces every combination of assigned and required clearance", () => {
    for (const assigned of [1, 2, 3])
      for (const required of [1, 2, 3]) {
        expect(
          canReadMinistryFile(
            user,
            { status: "APPROVED", clearance: assigned },
            { status: "PUBLISHED", clearance: required },
          ),
        ).toBe(assigned >= required);
      }
  });
  it("denies drafts, archived documents and invalid levels", () => {
    for (const status of ["DRAFT", "ARCHIVED"])
      expect(
        canReadMinistryFile(
          user,
          { status: "APPROVED", clearance: 3 },
          { status, clearance: 1 },
        ),
      ).toBe(false);
    for (const clearance of [0, 4, -1, 1.5, NaN])
      expect(
        canReadMinistryFile(
          user,
          { status: "APPROVED", clearance },
          { status: "PUBLISHED", clearance: 1 },
        ),
      ).toBe(false);
  });
  it("allows administrators to inspect unpublished originals", () => {
    expect(
      canReadMinistryFile({ role: "ADMIN" }, null, {
        status: "DRAFT",
        clearance: 3,
      }),
    ).toBe(true);
  });
});
describe("minister uploads and signup validation", () => {
  const pdf = new TextEncoder().encode("%PDF-1.7\nTest document");
  it("allows a PDF and strips path and header characters from its filename", () => {
    expect(inspectMinistryFile("../notes/briefing.pdf", pdf)).toEqual({
      mimeType: "application/pdf",
      fileName: "briefing.pdf",
    });
    expect(inspectMinistryFile('name\r\n".pdf', pdf)?.fileName).toBe(
      "name___.pdf",
    );
  });
  it("rejects executable extensions, mismatched signatures, empty and oversized files", () => {
    expect(inspectMinistryFile("x.html", pdf)).toBeNull();
    expect(
      inspectMinistryFile("x.pdf", new TextEncoder().encode("<html>")),
    ).toBeNull();
    expect(inspectMinistryFile("x.docx", pdf)).toBeNull();
    expect(inspectMinistryFile("x.pdf", new Uint8Array())).toBeNull();
    expect(
      inspectMinistryFile("x.pdf", new Uint8Array(MAX_MINISTRY_FILE_BYTES + 1)),
    ).toBeNull();
  });
  it("ignores self-assigned roles, status and clearance", () => {
    const parsed = ministerSignupSchema.parse({
      fullName: "Test Minister",
      email: "TEST@example.com",
      password: "correct-password-123",
      confirmPassword: "correct-password-123",
      phone: "5551234567",
      church: "Test Church",
      ministryRole: "Pastor",
      requestNote: "",
      website: "",
      status: "APPROVED",
      clearance: 3,
      role: "ADMIN",
    });
    expect(parsed.email).toBe("test@example.com");
    expect(parsed).not.toHaveProperty("status");
    expect(parsed).not.toHaveProperty("clearance");
    expect(parsed).not.toHaveProperty("role");
  });
});
describe("login return paths", () => {
  it("keeps internal minister navigation", () => {
    expect(safeReturnPath("/ministers?q=guide", "/dashboard")).toBe(
      "/ministers?q=guide",
    );
  });
  it("rejects protocol-relative and backslash external redirects", () => {
    for (const path of [
      "//evil.example",
      "/\\evil.example",
      "https://evil.example",
      "/\nevil.example",
    ])
      expect(safeReturnPath(path, "/dashboard")).toBe("/dashboard");
  });
});
