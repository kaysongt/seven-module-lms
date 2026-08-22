"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";

export async function setPostVisibility(postId: string, status: "VISIBLE" | "HIDDEN") { const staff = await requireStaff(); await db.discussionPost.update({ where: { id: postId }, data: { status, moderatedById: staff.id, moderatedAt: new Date() } }); revalidatePath("/admin/community"); revalidatePath("/dashboard/community"); }
