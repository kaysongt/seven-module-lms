"use server";

import { redirect } from "next/navigation";
import type { ActionState } from "@/lib/action-state";
import { createSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { SITE_CONFIG } from "@/lib/site-config";
import { signupSchema } from "@/lib/validations";

/**
 * Open enrolment: create the account, enrol it, sign it in, and land the person
 * on the first lesson.
 *
 * This is a second way in, not a replacement for the admissions queue. An admin
 * can still approve an application and hand out an activation link; that path is
 * for people the church invites. This path is for the person who found the site
 * at eleven at night and wants to start.
 *
 * The whole thing is one transaction. A user row without an enrolment would be
 * an account that can sign in and see an empty programme, which is a worse
 * failure than the signup simply erroring.
 */
export async function signUp(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = signupSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    website: formData.get("website"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // Honeypot filled: accept silently rather than telling a bot it was caught.
  if (parsed.data.website) redirect("/dashboard");

  const { fullName, email, password } = parsed.data;

  const existing = await db.user.findUnique({ where: { email }, select: { id: true } });
  if (existing) {
    // Deliberately not offering to set a password on an existing account. There
    // is no email verification in this application, so allowing that would let
    // anyone who knows an address claim an account that an administrator had
    // created and not yet activated.
    return {
      status: "error",
      message: "An account already exists for that email address. Sign in instead, or use your activation link if you have one.",
    };
  }

  const program = await db.program.findUnique({
    where: { slug: SITE_CONFIG.slug },
    select: { id: true, isPublished: true },
  });

  if (!program?.isPublished) {
    return {
      status: "error",
      message: "Enrolment is closed at the moment. Please contact the church office.",
    };
  }

  const passwordHash = await hashPassword(password);

  const user = await db.$transaction(async (tx) => {
    const created = await tx.user.create({
      data: { email, fullName, passwordHash, role: "STUDENT" },
      select: { id: true },
    });

    await tx.enrollment.create({
      data: { userId: created.id, programId: program.id, status: "ACTIVE" },
    });

    await tx.auditLog.create({
      data: {
        actorId: created.id,
        action: "enrollment.self_signup",
        entityType: "User",
        entityId: created.id,
        metadata: { email },
      },
    });

    return created;
  });

  await createSession(user.id);
  redirect("/dashboard");
}
