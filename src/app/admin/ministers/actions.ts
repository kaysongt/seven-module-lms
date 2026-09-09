"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { ministerReviewSchema } from "@/lib/ministry-policy";
import type { ActionState } from "@/lib/action-state";

export async function reviewMinister(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = ministerReviewSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message:
        "Choose a status and valid clearance level. Notes must be under 2,000 characters.",
    };
  const { userId, version, status, adminNotes } = parsed.data;
  const clearance = status === "APPROVED" ? parsed.data.clearance : 0;
  const updated = await db.$transaction(async (tx) => {
    const before = await tx.ministerProfile.findUnique({
      where: { userId },
      select: { status: true, clearance: true },
    });
    const result = await tx.ministerProfile.updateMany({
      where: { userId, version },
      data: {
        status,
        clearance,
        adminNotes: adminNotes || null,
        reviewedById: admin.id,
        reviewedAt: new Date(),
        version: { increment: 1 },
      },
    });
    if (!result.count) return false;
    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "minister.access_changed",
        entityType: "MinisterProfile",
        entityId: userId,
        metadata: { before, status, clearance },
      },
    });
    return true;
  });
  if (!updated)
    return {
      status: "error",
      message:
        "This request changed while you were reviewing it. Refresh the page and review the latest details.",
    };
  revalidatePath("/admin/ministers");
  revalidatePath("/ministers");
  return {
    status: "success",
    message:
      status === "APPROVED"
        ? "Access approved. The minister can now open files at the assigned clearance level."
        : "Access updated. Ministry downloads are blocked for this account.",
  };
}
