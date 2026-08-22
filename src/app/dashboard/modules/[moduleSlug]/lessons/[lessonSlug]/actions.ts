"use server";

/* eslint-disable @next/next/no-assign-module-variable */

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assignmentSchema } from "@/lib/validations";
import { getStudentProgram, isLessonSequentiallyUnlocked } from "@/lib/student-data";

async function requireAccessibleLesson(userId: string, lessonId: string) {
  const data = await getStudentProgram(userId);
  if (!data) throw new Error("Active enrollment required");
  const module = data.modules.find((item) => item.lessons.some((lesson) => lesson.id === lessonId));
  const lesson = module?.lessons.find((item) => item.id === lessonId);
  if (!module || !lesson || !module.progressState.isUnlocked || !isLessonSequentiallyUnlocked(module.lessons, lesson.id)) throw new Error("Lesson is not available");
  return { module, lesson };
}

export async function markLessonComplete(lessonId: string) {
  const user = await requireUser();
  const { module, lesson } = await requireAccessibleLesson(user.id, lessonId);
  await db.lessonProgress.upsert({ where: { userId_lessonId: { userId: user.id, lessonId } }, update: { completedAt: new Date() }, create: { userId: user.id, lessonId } });
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/modules/${module.slug}`);
  revalidatePath(`/dashboard/modules/${module.slug}/lessons/${lesson.slug}`);
}

export async function submitAssignment(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = assignmentSchema.safeParse({ lessonId: formData.get("lessonId"), response: formData.get("response") });
  if (!parsed.success) return { status: "error", message: "Write a complete response before submitting.", fieldErrors: parsed.error.flatten().fieldErrors };
  const { module, lesson } = await requireAccessibleLesson(user.id, parsed.data.lessonId);
  await db.$transaction([
    db.assignmentSubmission.create({ data: { userId: user.id, lessonId: parsed.data.lessonId, response: parsed.data.response } }),
    db.lessonProgress.upsert({ where: { userId_lessonId: { userId: user.id, lessonId: parsed.data.lessonId } }, update: { completedAt: new Date() }, create: { userId: user.id, lessonId: parsed.data.lessonId } }),
  ]);
  revalidatePath(`/dashboard/modules/${module.slug}`);
  revalidatePath(`/dashboard/modules/${module.slug}/lessons/${lesson.slug}`);
  return { status: "success", message: "Your response was submitted for review and this lesson is marked complete." };
}
