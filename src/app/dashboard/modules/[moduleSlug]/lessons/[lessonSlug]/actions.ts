"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { assignmentSchema } from "@/lib/validations";
import { requireAccessibleLesson } from "@/lib/student-data";
import { requiresVideoCompletion } from "@/lib/video-progress";


export async function markLessonComplete(lessonId: string) {
  const user = await requireUser();
  const { module, lesson } = await requireAccessibleLesson(user.id, lessonId);
  if (requiresVideoCompletion(lesson) || lesson.kind === "ASSIGNMENT") throw new Error("Complete this lesson’s required activity first");
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
  if (lesson.kind !== "ASSIGNMENT" || requiresVideoCompletion(lesson)) return { status: "error", message: "This lesson does not accept an assignment response." };
  await db.$transaction([
    db.assignmentSubmission.create({ data: { userId: user.id, lessonId: parsed.data.lessonId, response: parsed.data.response } }),
    db.lessonProgress.upsert({ where: { userId_lessonId: { userId: user.id, lessonId: parsed.data.lessonId } }, update: { completedAt: new Date() }, create: { userId: user.id, lessonId: parsed.data.lessonId } }),
  ]);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/modules/${module.slug}`);
  revalidatePath(`/dashboard/modules/${module.slug}/lessons/${lesson.slug}`);
  return { status: "success", message: "Your response was submitted for review and this lesson is marked complete." };
}
