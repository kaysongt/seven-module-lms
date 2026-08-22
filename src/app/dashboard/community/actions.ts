"use server";

/* eslint-disable @next/next/no-assign-module-variable */

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStudentProgram } from "@/lib/student-data";
import { discussionSchema } from "@/lib/validations";

export async function createPost(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const user = await requireUser();
  const parsed = discussionSchema.safeParse({ moduleId: formData.get("moduleId"), body: formData.get("body"), parentId: formData.get("parentId") || undefined });
  if (!parsed.success) return { status: "error", message: "Write at least 10 characters before posting.", fieldErrors: parsed.error.flatten().fieldErrors };
  const data = await getStudentProgram(user.id);
  const module = data?.modules.find((item) => item.id === parsed.data.moduleId);
  if (!data || !module?.progressState.isUnlocked) return { status: "error", message: "This module discussion is not available yet." };
  if (parsed.data.parentId) {
    const parent = await db.discussionPost.findFirst({ where: { id: parsed.data.parentId, moduleId: module.id, status: "VISIBLE" } });
    if (!parent) return { status: "error", message: "The discussion you are replying to is no longer available." };
  }
  await db.discussionPost.create({ data: { moduleId: module.id, authorId: user.id, body: parsed.data.body, parentId: parsed.data.parentId } });
  revalidatePath("/dashboard/community");
  return { status: "success", message: "Your contribution is now part of the discussion." };
}
