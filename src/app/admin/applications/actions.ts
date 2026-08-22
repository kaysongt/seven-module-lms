"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";
import { createOpaqueToken, hashToken } from "@/lib/tokens";

export async function approveApplication(applicationId: string) {
  const admin = await requireAdmin();
  const application = await db.application.findUnique({ where: { id: applicationId } });
  if (!application || application.status !== "PENDING") throw new Error("Application is not pending");

  let user = await db.user.findUnique({ where: { email: application.email } });
  if (!user) user = await db.user.create({ data: { email: application.email, fullName: application.fullName } });
  await db.$transaction([
    db.application.update({ where: { id: application.id }, data: { status: "APPROVED", reviewedAt: new Date() } }),
    db.enrollment.upsert({ where: { userId_programId: { userId: user.id, programId: application.programId } }, update: { status: "ACTIVE" }, create: { userId: user.id, programId: application.programId, status: "ACTIVE" } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "application.approved", entityType: "Application", entityId: application.id, metadata: { email: application.email } } }),
  ]);

  if (user.passwordHash) redirect("/admin/applications?approved=1");
  const token = createOpaqueToken();
  await db.invitation.create({ data: { userId: user.id, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + SITE_CONFIG.invitationDays * 24 * 60 * 60 * 1000) } });
  redirect(`/admin/applications?invite=${encodeURIComponent(token)}&email=${encodeURIComponent(user.email)}`);
}

export async function declineApplication(applicationId: string, formData: FormData) {
  const admin = await requireAdmin();
  const notes = String(formData.get("adminNotes") ?? "").trim().slice(0, 2000);
  await db.$transaction([
    db.application.update({ where: { id: applicationId }, data: { status: "DECLINED", adminNotes: notes || null, reviewedAt: new Date() } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "application.declined", entityType: "Application", entityId: applicationId } }),
  ]);
  revalidatePath("/admin/applications");
}
