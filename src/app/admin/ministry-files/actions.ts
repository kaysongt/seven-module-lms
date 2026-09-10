"use server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  MAX_MINISTRY_FILE_BYTES,
  inspectMinistryFile,
  ministryFileSchema,
} from "@/lib/ministry-policy";
import type { ActionState } from "@/lib/action-state";
import { z } from "zod";

export async function uploadMinistryFile(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = ministryFileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message:
        "Enter a title, a valid clearance level and a publication status.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  const upload = formData.get("file");
  if (
    !(upload instanceof File) ||
    !upload.size ||
    upload.size > MAX_MINISTRY_FILE_BYTES
  )
    return {
      status: "error",
      message: "Choose a PDF, DOCX, XLSX or PPTX document up to 3 MB.",
    };
  const bytes = new Uint8Array(await upload.arrayBuffer());
  const file = inspectMinistryFile(upload.name, bytes);
  if (!file)
    return {
      status: "error",
      message:
        "The file must be a valid PDF, DOCX, XLSX or PPTX document, up to 3 MB.",
    };
  await db.$transaction(async (tx) => {
    const created = await tx.ministryFile.create({
      data: {
        ...parsed.data,
        ...file,
        byteSize: bytes.byteLength,
        uploadedById: admin.id,
        content: { create: { data: Buffer.from(bytes) } },
      },
      select: { id: true },
    });
    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "ministry_file.uploaded",
        entityType: "MinistryFile",
        entityId: created.id,
        metadata: {
          clearance: parsed.data.clearance,
          status: parsed.data.status,
        },
      },
    });
  });
  revalidatePath("/admin/ministry-files");
  revalidatePath("/ministers");
  return {
    status: "success",
    message:
      parsed.data.status === "PUBLISHED"
        ? "Document published to ministers with the required clearance."
        : "Document saved privately. Publish it when ready.",
  };
}

export async function updateMinistryFile(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = ministryFileSchema
    .extend({ id: z.string().uuid(), version: z.coerce.number().int().min(0) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Review the title, clearance and status before saving.",
    };
  const { id, version, ...data } = parsed.data;
  const updated = await db.$transaction(async (tx) => {
    const before = await tx.ministryFile.findUnique({
      where: { id },
      select: { status: true, clearance: true },
    });
    const result = await tx.ministryFile.updateMany({
      where: { id, version },
      data: { ...data, version: { increment: 1 } },
    });
    if (!result.count) return false;
    await tx.auditLog.create({
      data: {
        actorId: admin.id,
        action: "ministry_file.updated",
        entityType: "MinistryFile",
        entityId: id,
        metadata: { before, clearance: data.clearance, status: data.status },
      },
    });
    return true;
  });
  if (!updated)
    return {
      status: "error",
      message:
        "This document was updated by someone else. Refresh before saving again.",
    };
  revalidatePath("/admin/ministry-files");
  revalidatePath("/ministers");
  return { status: "success", message: "Document access and details updated." };
}
