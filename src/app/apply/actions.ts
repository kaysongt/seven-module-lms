"use server";

import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { ActionState } from "@/lib/action-state";
import { SITE_CONFIG } from "@/lib/site-config";
import { applicationSchema } from "@/lib/validations";

export async function submitApplication(_previous: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = applicationSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    country: formData.get("country"),
    churchOrOrganization: formData.get("churchOrOrganization") || undefined,
    ministryRole: formData.get("ministryRole") || undefined,
    reason: formData.get("reason"),
    website: formData.get("website") || undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: "Please review the highlighted information.", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    const program = await db.program.findUnique({ where: { slug: SITE_CONFIG.slug }, select: { id: true } });
    if (!program) return { status: "error", message: "Applications are not open yet. Please contact the program team." };

    const applicationData = {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      churchOrOrganization: parsed.data.churchOrOrganization,
      ministryRole: parsed.data.ministryRole,
      reason: parsed.data.reason,
    };
    await db.application.create({ data: { programId: program.id, ...applicationData } });
    return { status: "success", message: "Your application has been received. The program team will review it and contact you by email." };
  } catch (error: unknown) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return { status: "success", message: "We already have an application for this email address. The program team will contact you after review." };
    }
    console.error("Application submission failed", error);
    return { status: "error", message: "We could not submit your application. Please try again or contact the program team." };
  }
}
