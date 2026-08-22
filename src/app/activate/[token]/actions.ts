"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { hashToken } from "@/lib/tokens";
import { activationSchema } from "@/lib/validations";

export async function activateAccount(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = activationSchema.safeParse({ token: formData.get("token"), password: formData.get("password"), confirmPassword: formData.get("confirmPassword") });
  if (!parsed.success) return { status: "error", message: "Please review your password.", fieldErrors: parsed.error.flatten().fieldErrors };

  const invitation = await db.invitation.findUnique({ where: { tokenHash: hashToken(parsed.data.token) }, include: { user: true } });
  if (!invitation || invitation.acceptedAt || invitation.expiresAt <= new Date()) {
    return { status: "error", message: "This activation link is invalid or has expired. Ask the program administrator for a new link." };
  }

  await db.$transaction([
    db.user.update({ where: { id: invitation.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }),
    db.invitation.update({ where: { id: invitation.id }, data: { acceptedAt: new Date() } }),
  ]);
  await createSession(invitation.userId);
  redirect("/dashboard");
}
