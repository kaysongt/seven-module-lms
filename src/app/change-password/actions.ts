"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getCurrentUser, createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import type { ActionState } from "@/lib/action-state";

const schema = z.object({
  currentPassword: z.string().min(1).max(128),
  password: z.string().min(12, "Use at least 12 characters.").max(128),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"], message: "Passwords do not match.",
}).refine((value) => value.password !== value.currentPassword, {
  path: ["password"], message: "Choose a different password.",
});

export async function changePassword(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const user = await getCurrentUser({ allowPasswordChange: true });
  if (!user) redirect("/login?next=/change-password");
  const parsed = schema.safeParse({ currentPassword: formData.get("currentPassword"), password: formData.get("password"), confirmPassword: formData.get("confirmPassword") });
  if (!parsed.success) return { status: "error", message: "Please check the password fields.", fieldErrors: parsed.error.flatten().fieldErrors };
  if (!user.passwordHash || !await verifyPassword(parsed.data.currentPassword, user.passwordHash)) return { status: "error", message: "Your current password is not correct." };
  const passwordHash = await hashPassword(parsed.data.password);
  const updated = await db.$transaction(async (tx) => {
    // Do not overwrite a password changed by a concurrent request.
    const changed = await tx.user.updateMany({ where: { id: user.id, passwordHash: user.passwordHash }, data: { passwordHash, mustChangePassword: false, failedLoginCount: 0, lockedUntil: null } });
    if (changed.count !== 1) return false;
    await tx.session.deleteMany({ where: { userId: user.id } });
    await tx.invitation.updateMany({ where: { userId: user.id, acceptedAt: null }, data: { expiresAt: new Date(0) } });
    await tx.auditLog.create({ data: { actorId: user.id, action: "account.password_changed", entityType: "User", entityId: user.id, metadata: { temporaryPasswordReplaced: user.mustChangePassword } } });
    return true;
  });
  if (!updated) return { status: "error", message: "Your account changed in another session. Sign in again and retry." };
  await createSession(user.id);
  redirect(user.role === "ADMIN" ? "/admin" : "/dashboard");
}
