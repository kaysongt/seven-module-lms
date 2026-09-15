"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { requireAccessibleLesson } from "@/lib/student-data";
import { advanceWatch, getTrainingVideo } from "@/lib/video-progress";

const idSchema = z.string().min(1).max(100);

export async function beginVideo(lessonId: string, rewindTo?: number) {
  idSchema.parse(lessonId);
  const user = await requireUser();
  const { lesson } = await requireAccessibleLesson(user.id, lessonId);
  const video = getTrainingVideo(lesson.videoUrl);
  if (!video) throw new Error("This teaching is not configured for progress tracking. Please contact your instructor.");
  const key = { userId: user.id, lessonId };
  const old = await db.videoProgress.findUnique({ where: { userId_lessonId: key } });
  const sameVideo = old?.videoId === video.id;
  const watchedSeconds = sameVideo ? old.watchedSeconds : 0;
  const position = rewindTo === undefined ? watchedSeconds : z.number().finite().min(0).max(watchedSeconds).parse(rewindTo);
  const sessionId = randomUUID();
  const progress = await db.videoProgress.upsert({
    where: { userId_lessonId: key },
    create: { ...key, videoId: video.id, sessionId, position, watchedSeconds, budgetSeconds: watchedSeconds },
    update: { videoId: video.id, sessionId, position, watchedSeconds, budgetSeconds: watchedSeconds, completedAt: sameVideo ? old.completedAt : null, heartbeatAt: new Date(), version: { increment: 1 } },
  });
  return { sessionId, watchedSeconds: progress.watchedSeconds, position, complete: Boolean(progress.completedAt) };
}

export async function recordVideo(input: { lessonId: string; sessionId: string; position: number }) {
  const parsed = z.object({ lessonId: idSchema, sessionId: z.string().uuid(), position: z.number().finite().min(0) }).parse(input);
  const user = await requireUser();
  const { module: learningModule, lesson } = await requireAccessibleLesson(user.id, parsed.lessonId);
  const video = getTrainingVideo(lesson.videoUrl);
  if (!video) throw new Error("Video is not configured");
  const key = { userId: user.id, lessonId: lesson.id };
  const progress = await db.videoProgress.findUnique({ where: { userId_lessonId: key } });
  if (!progress || progress.videoId !== video.id || progress.sessionId !== parsed.sessionId) throw new Error("Playback continued in another tab. Press Resume here to continue.");
  if (progress.completedAt) return { accepted: true, watchedSeconds: progress.watchedSeconds, position: parsed.position, complete: true };
  const now = new Date();
  const next = advanceWatch(progress, parsed.position, video.duration, now);
  await db.$transaction(async (tx) => {
    // One heartbeat wins. Concurrent tabs or duplicate requests cannot accumulate time.
    const saved = await tx.videoProgress.updateMany({
      where: { ...key, sessionId: parsed.sessionId, version: progress.version },
      data: { watchedSeconds: next.watchedSeconds, budgetSeconds: next.budgetSeconds, position: next.position, heartbeatAt: now, version: { increment: 1 }, completedAt: next.complete ? now : null },
    });
    if (saved.count !== 1) throw new Error("Playback changed. Press Resume to continue from your saved progress.");
    if (next.complete) await tx.lessonProgress.upsert({ where: { userId_lessonId: key }, create: key, update: { completedAt: now } });
  });
  if (next.complete) {
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/modules/" + learningModule.slug);
    revalidatePath("/dashboard/modules/" + learningModule.slug + "/lessons/" + lesson.slug);
    revalidatePath("/admin/students");
  }
  return { accepted: next.accepted, watchedSeconds: next.watchedSeconds, position: next.position, complete: next.complete };
}
