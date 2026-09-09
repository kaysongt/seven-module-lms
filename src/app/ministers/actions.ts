"use server";

import { Prisma } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createSession, destroySession, getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { hashToken } from "@/lib/tokens";
import {
  ministerDetailsSchema,
  ministerSignupSchema,
} from "@/lib/ministry-policy";
import type { ActionState } from "@/lib/action-state";

async function allowRequest(identity: string) {
  const now = Date.now();
  const hour = Math.floor(now / 3_600_000);
  // Vercel supplies x-real-ip; outside Vercel use one conservative shared bucket.
  const ip = process.env.VERCEL
    ? ((await headers()).get("x-real-ip") ?? "unknown")
    : "local";
  const counters = await db.$transaction([
    db.ministryRequestLimit.upsert({
      where: { key: hashToken(`minister-ip:${ip}:${hour}`) },
      create: {
        key: hashToken(`minister-ip:${ip}:${hour}`),
        expiresAt: new Date((hour + 2) * 3_600_000),
      },
      update: { attempts: { increment: 1 } },
    }),
    db.ministryRequestLimit.upsert({
      where: { key: hashToken(`minister-account:${identity}:${hour}`) },
      create: {
        key: hashToken(`minister-account:${identity}:${hour}`),
        expiresAt: new Date((hour + 2) * 3_600_000),
      },
      update: { attempts: { increment: 1 } },
    }),
    db.ministryRequestLimit.deleteMany({
      where: { expiresAt: { lt: new Date(now) } },
    }),
  ]);
  return counters[0].attempts <= 20 && counters[1].attempts <= 5;
}

export async function registerMinister(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const parsed = ministerSignupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  if (!(await allowRequest(parsed.data.email)))
    return {
      status: "error",
      message: "Too many requests. Please try again in an hour.",
    };
  const {
    email,
    fullName,
    password,
    phone,
    church,
    ministryRole,
    requestNote,
  } = parsed.data;
  const existing = await db.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing)
    return {
      status: "error",
      message:
        "This email already has a KingsWord account. Sign in above, then request minister access. Use your activation link if your account has not been activated.",
    };
  const passwordHash = await hashPassword(password);
  let userId: string;
  try {
    userId = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          fullName,
          passwordHash,
          role: "STUDENT",
          ministerProfile: {
            create: {
              phone,
              church,
              ministryRole,
              requestNote,
              status: "PENDING",
              clearance: 0,
            },
          },
        },
        select: { id: true },
      });
      await tx.auditLog.create({
        data: {
          actorId: user.id,
          action: "minister.requested",
          entityType: "MinisterProfile",
          entityId: user.id,
        },
      });
      return user.id;
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    )
      return {
        status: "error",
        message: "This email already has an account. Please sign in instead.",
      };
    throw error;
  }
  await createSession(userId);
  revalidatePath("/admin/ministers");
  redirect("/ministers");
}

export async function requestMinisterAccess(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) redirect("/ministers/login");
  const parsed = ministerDetailsSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success)
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  if (!(await allowRequest(user.id)))
    return {
      status: "error",
      message: "Too many requests. Please try again in an hour.",
    };
  // Never update an existing profile here: only administrators can grant or restore access.
  try {
    await db.$transaction([
      db.ministerProfile.create({
        data: {
          userId: user.id,
          ...parsed.data,
          status: "PENDING",
          clearance: 0,
        },
      }),
      db.auditLog.create({
        data: {
          actorId: user.id,
          action: "minister.requested",
          entityType: "MinisterProfile",
          entityId: user.id,
        },
      }),
    ]);
  } catch (error) {
    if (
      !(
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      )
    )
      throw error;
  }
  revalidatePath("/admin/ministers");
  redirect("/ministers");
}

export async function ministerLogout() {
  await destroySession();
  redirect("/ministers/login");
}
