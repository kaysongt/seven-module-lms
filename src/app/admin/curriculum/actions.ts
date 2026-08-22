"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { programSchema } from "@/lib/validations";

export async function updateProgram(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = programSchema.parse(Object.fromEntries(formData));
  await db.$transaction([
    db.program.update({ where: { id: parsed.programId }, data: { name: parsed.name, shortName: parsed.shortName, eyebrow: parsed.eyebrow, tagline: parsed.tagline, description: parsed.description, certificateLabel: parsed.certificateLabel, passMark: parsed.passMark, isPublished: parsed.isPublished } }),
    db.assessment.updateMany({ where: { module: { programId: parsed.programId } }, data: { passMark: parsed.passMark } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "program.updated", entityType: "Program", entityId: parsed.programId } }),
  ]);
  redirect("/admin/curriculum?saved=program");
}
