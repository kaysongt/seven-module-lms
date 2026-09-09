import { z } from "zod";

export const CLEARANCE_LEVELS = [
  { value: 1, label: "General Ministry" },
  { value: 2, label: "Leadership" },
  { value: 3, label: "Restricted" },
] as const;
export const MAX_MINISTRY_FILE_BYTES = 3 * 1024 * 1024;
export const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};
export function clearanceLabel(level: number) {
  return (
    CLEARANCE_LEVELS.find((item) => item.value === level)?.label ??
    "Not assigned"
  );
}
export function canReadMinistryFile(
  user: { role: string } | null,
  profile: { status: string; clearance: number } | null,
  file: { status: string; clearance: number },
) {
  if (!user) return false;
  if (user.role === "ADMIN") return true;
  return (
    profile?.status === "APPROVED" &&
    Number.isInteger(profile.clearance) &&
    profile.clearance >= 1 &&
    profile.clearance <= 3 &&
    file.status === "PUBLISHED" &&
    Number.isInteger(file.clearance) &&
    file.clearance >= 1 &&
    file.clearance <= profile.clearance
  );
}
export const ministerDetailsSchema = z.object({
  phone: z.string().trim().min(5, "Enter a contact phone number").max(40),
  church: z
    .string()
    .trim()
    .min(2, "Enter your church or congregation")
    .max(160),
  ministryRole: z.string().trim().min(2, "Enter your ministry role").max(120),
  requestNote: z.string().trim().max(1500),
});
export const ministerSignupSchema = ministerDetailsSchema
  .extend({
    fullName: z.string().trim().min(2, "Enter your full name").max(120),
    email: z
      .string()
      .trim()
      .email("Enter a valid email address")
      .max(254)
      .transform((v) => v.toLowerCase()),
    password: z.string().min(12, "Use at least 12 characters").max(128),
    confirmPassword: z.string().max(128),
    website: z.string().max(0).optional(),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
export const ministryFileSchema = z.object({
  title: z.string().trim().min(2, "Enter a document title").max(160),
  description: z.string().trim().max(2000),
  clearance: z.coerce.number().int().min(1).max(3),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
});
export const ministerReviewSchema = z.object({
  userId: z.string().uuid(),
  version: z.coerce.number().int().min(0),
  status: z.enum(["APPROVED", "DECLINED", "SUSPENDED"]),
  clearance: z.coerce.number().int().min(1).max(3),
  adminNotes: z.string().trim().max(2000),
});
export function inspectMinistryFile(name: string, bytes: Uint8Array) {
  if (!bytes.byteLength || bytes.byteLength > MAX_MINISTRY_FILE_BYTES)
    return null;
  const extension = name.toLowerCase().split(".").pop() ?? "";
  const mimeType = FILE_TYPES[extension];
  if (!mimeType) return null;
  const validHeader =
    extension === "pdf"
      ? new TextDecoder().decode(bytes.subarray(0, 5)) === "%PDF-"
      : bytes[0] === 0x50 &&
        bytes[1] === 0x4b &&
        bytes[2] === 3 &&
        bytes[3] === 4;
  if (!validHeader) return null;
  // Never use the supplied filename as a filesystem path or raw HTTP header.
  const fileName = name
    .split(/[\\/]/)
    .pop()!
    .replace(/[\x00-\x1f\x7f"<>]/g, "_")
    .slice(-160);
  return { mimeType, fileName };
}
export function fileSizeLabel(bytes: number) {
  return bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
