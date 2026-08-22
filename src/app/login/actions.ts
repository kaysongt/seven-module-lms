"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";
import { loginSchema } from "@/lib/validations";

const MAX_FAILURES = 5;
const LOCK_MINUTES = 15;

export async function login(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { status: "error", message: "Enter a valid email address and password.", fieldErrors: parsed.error.flatten().fieldErrors };

  const user = await db.user.findUnique({ where: { email: parsed.data.email } });
  const genericError = { status: "error" as const, message: "The email address or password is not correct." };
  if (!user?.passwordHash) return genericError;

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { status: "error", message: "Too many unsuccessful attempts. Try again in 15 minutes." };
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    const failures = user.failedLoginCount + 1;
    await db.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: failures >= MAX_FAILURES ? 0 : failures,
        lockedUntil: failures >= MAX_FAILURES ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000) : null,
      },
    });
    return genericError;
  }

  await db.user.update({ where: { id: user.id }, data: { failedLoginCount: 0, lockedUntil: null, lastLoginAt: new Date() } });
  await createSession(user.id);

  const requestedNext = String(formData.get("next") ?? "");
  const destination = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : user.role === "ADMIN" ? "/admin" : "/dashboard";
  redirect(destination);
}
