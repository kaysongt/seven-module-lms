import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createOpaqueToken, hashToken } from "@/lib/tokens";

describe("credentials", () => {
  it("hashes and verifies passwords without storing the original value", async () => {
    const password = "a-long-test-password";
    const stored = await hashPassword(password);

    expect(stored).not.toContain(password);
    await expect(verifyPassword(password, stored)).resolves.toBe(true);
    await expect(verifyPassword("incorrect-password", stored)).resolves.toBe(false);
  });

  it("rejects malformed password records", async () => {
    await expect(verifyPassword("anything", "invalid-record")).resolves.toBe(false);
  });

  it("creates opaque tokens and hashes them deterministically", () => {
    const first = createOpaqueToken();
    const second = createOpaqueToken();

    expect(first).not.toBe(second);
    expect(first.length).toBeGreaterThanOrEqual(40);
    expect(hashToken(first)).toBe(hashToken(first));
    expect(hashToken(first)).not.toBe(first);
  });
});
