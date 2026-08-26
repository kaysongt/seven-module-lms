"use server";

import { revalidatePath } from "next/cache";
import { getAppUrl } from "@/lib/app-url";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { createOpaqueToken, hashToken } from "@/lib/tokens";
import { SITE_CONFIG } from "@/lib/site-config";

export async function setEnrollmentStatus(enrollmentId: string, status: "ACTIVE" | "PAUSED" | "REVOKED") {
  const admin = await requireAdmin();
  await db.$transaction([
    db.enrollment.update({ where: { id: enrollmentId }, data: { status } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "enrollment.status_changed", entityType: "Enrollment", entityId: enrollmentId, metadata: { status } } }),
  ]);
  revalidatePath("/admin/students");
}

export async function createNewInvitation(userId: string) {
  const admin = await requireAdmin();
  const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } });
  if (!user) throw new Error("Student not found");
  const token = createOpaqueToken();
  await db.$transaction([
    db.invitation.updateMany({ where: { userId, acceptedAt: null }, data: { expiresAt: new Date(0) } }),
    db.invitation.create({ data: { userId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + SITE_CONFIG.invitationDays * 24 * 60 * 60 * 1000) } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "invitation.created", entityType: "User", entityId: userId } }),
  ]);
  const appUrl = getAppUrl();
  return { email: user.email, url: `${appUrl}/activate/${token}` };
}

export async function issueCertificate(enrollmentId: string) {
  const admin = await requireAdmin();
  const enrollment = await db.enrollment.findUnique({ where: { id: enrollmentId } });
  if (!enrollment || enrollment.status !== "COMPLETED") throw new Error("Only completed enrollments can receive a certificate");
  const serial = `FP-${new Date().getFullYear()}-${createOpaqueToken().slice(0, 8).toUpperCase()}`;
  await db.$transaction([
    db.certificate.upsert({ where: { programId_studentId: { programId: enrollment.programId, studentId: enrollment.userId } }, update: {}, create: { serial, programId: enrollment.programId, studentId: enrollment.userId, issuedById: admin.id } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "certificate.issued", entityType: "Enrollment", entityId: enrollment.id } }),
  ]);
  revalidatePath("/admin/students");
}
