"use server";

import { revalidatePath } from "next/cache";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";

export async function reviewSubmission(submissionId: string, formData: FormData) {
  const staff = await requireStaff();
  const status = String(formData.get("status"));
  if (status !== "REVIEWED" && status !== "NEEDS_REVISION") throw new Error("Invalid review status");
  const feedback = String(formData.get("feedback") ?? "").trim().slice(0, 5000);
  await db.assignmentSubmission.update({ where: { id: submissionId }, data: { status, feedback: feedback || null, reviewedById: staff.id, reviewedAt: new Date() } });
  revalidatePath("/admin/submissions");
}
