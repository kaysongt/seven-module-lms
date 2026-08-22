"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { lessonSchema, moduleSchema, questionSchema } from "@/lib/validations";

export async function updateModule(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = moduleSchema.parse(Object.fromEntries(formData));
  const availableAt = parsed.availableAt ? new Date(`${parsed.availableAt}T00:00:00`) : null;
  await db.$transaction([
    db.module.update({ where: { id: parsed.moduleId }, data: { title: parsed.title, eyebrow: parsed.eyebrow, summary: parsed.summary, description: parsed.description, objectives: parsed.objectives.split("\n").map((item) => item.trim()).filter(Boolean), estimatedMinutes: parsed.estimatedMinutes, availableAt, status: parsed.status } }),
    db.auditLog.create({ data: { actorId: admin.id, action: "module.updated", entityType: "Module", entityId: parsed.moduleId } }),
  ]);
  redirect(`/admin/curriculum/${parsed.moduleId}?saved=module`);
}

export async function updateLesson(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = lessonSchema.parse(Object.fromEntries(formData));
  const lesson = await db.lesson.update({ where: { id: parsed.lessonId }, data: { title: parsed.title, summary: parsed.summary, body: parsed.body, kind: parsed.kind, videoUrl: parsed.videoUrl || null, resourceUrl: parsed.resourceUrl || null, estimatedMinutes: parsed.estimatedMinutes, status: parsed.status }, include: { module: true } });
  await db.auditLog.create({ data: { actorId: admin.id, action: "lesson.updated", entityType: "Lesson", entityId: lesson.id } });
  redirect(`/admin/curriculum/${lesson.moduleId}?saved=lesson-${lesson.order}`);
}

export async function updateQuestion(formData: FormData) {
  const admin = await requireAdmin();
  const parsed = questionSchema.parse(Object.fromEntries(formData));
  const question = await db.assessmentQuestion.update({ where: { id: parsed.questionId }, data: { prompt: parsed.prompt, options: [parsed.option0, parsed.option1, parsed.option2, parsed.option3], correctIndex: parsed.correctIndex, explanation: parsed.explanation }, include: { assessment: true } });
  await db.auditLog.create({ data: { actorId: admin.id, action: "assessment_question.updated", entityType: "AssessmentQuestion", entityId: question.id } });
  revalidatePath(`/admin/curriculum/${question.assessment.moduleId}`);
}
