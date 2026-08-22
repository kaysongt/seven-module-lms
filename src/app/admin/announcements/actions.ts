"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/action-state";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";
import { announcementSchema } from "@/lib/validations";

export async function createAnnouncement(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const staff = await requireStaff();
  const parsed = announcementSchema.safeParse({ title: formData.get("title"), body: formData.get("body") });
  if (!parsed.success) return { status: "error", message: "Add a title and a complete announcement." };
  const program = await db.program.findUnique({ where: { slug: SITE_CONFIG.slug }, select: { id: true } });
  if (!program) return { status: "error", message: "Program not found." };
  await db.announcement.create({ data: { programId: program.id, authorId: staff.id, ...parsed.data } });
  revalidatePath("/admin/announcements"); revalidatePath("/dashboard");
  return { status: "success", message: "Announcement published to the student dashboard." };
}
