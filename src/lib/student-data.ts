/* eslint-disable @next/next/no-assign-module-variable */
import { ContentStatus, EnrollmentStatus } from "@prisma/client";
import { hasVerifiedVideoCompletion, requiresVideoCompletion } from "@/lib/video-progress";
import { db } from "@/lib/db";
import { calculateProgramPercent, deriveModuleProgress } from "@/lib/learning";

export async function getStudentProgram(userId: string) {
  const enrollment = await db.enrollment.findFirst({
    where: { userId, status: { in: [EnrollmentStatus.ACTIVE, EnrollmentStatus.COMPLETED] } },
    include: {
      program: {
        include: {
          modules: {
            where: { status: ContentStatus.PUBLISHED },
            orderBy: { order: "asc" },
            include: {
              lessons: {
                where: { status: ContentStatus.PUBLISHED },
                orderBy: { order: "asc" },
              },
              assessment: {
                select: { id: true, title: true, passMark: true, status: true },
              },
            },
          },
        },
      },
    },
  });

  if (!enrollment) return null;

  const [lessonProgress, passedAttempts, videoProgress] = await Promise.all([
    db.lessonProgress.findMany({ where: { userId }, select: { lessonId: true, completedAt: true } }),
    db.assessmentAttempt.findMany({
      where: { userId, status: "PASSED" },
      select: { assessmentId: true, scorePct: true, submittedAt: true },
      orderBy: { submittedAt: "desc" },
    }),
    db.videoProgress.findMany({ where: { userId } }),
  ]);

  const completedLessonIds = new Set(lessonProgress.map((item) => item.lessonId));
  const videoByLesson = new Map(videoProgress.map((item) => [item.lessonId, item]));
  for (const lesson of enrollment.program.modules.flatMap((item) => item.lessons)) {
    if (requiresVideoCompletion(lesson) && !hasVerifiedVideoCompletion(lesson, videoByLesson.get(lesson.id))) completedLessonIds.delete(lesson.id);
  }
  const passedAssessmentIds = new Set(passedAttempts.map((item) => item.assessmentId));
  const states = deriveModuleProgress(
    enrollment.program.modules.map((module) => ({
      id: module.id,
      order: module.order,
      lessonIds: module.lessons.map((lesson) => lesson.id),
      availableAt: module.availableAt,
      assessmentPassed: Boolean(module.assessment && passedAssessmentIds.has(module.assessment.id)),
    })),
    completedLessonIds,
  );
  const stateById = new Map(states.map((state) => [state.id, state]));

  const modules = enrollment.program.modules.map((module) => ({
    ...module,
    progressState: stateById.get(module.id)!,
    lessons: module.lessons.map((lesson) => ({
      ...lesson,
      isComplete: completedLessonIds.has(lesson.id),
      watchedSeconds: videoByLesson.get(lesson.id)?.watchedSeconds ?? 0,
    })),
    bestScore: module.assessment
      ? passedAttempts.find((attempt) => attempt.assessmentId === module.assessment?.id)?.scorePct ?? null
      : null,
  }));

  return {
    enrollment,
    program: enrollment.program,
    modules,
    overallPercent: calculateProgramPercent(states),
  };
}

export function findStudentModule<T extends Awaited<ReturnType<typeof getStudentProgram>>>(data: T, slug: string) {
  if (!data) return null;
  return data.modules.find((module) => module.slug === slug) ?? null;
}

export function isLessonSequentiallyUnlocked(
  lessons: Array<{ id: string; order: number; isComplete: boolean }>,
  lessonId: string,
): boolean {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) return false;
  return lessons.filter((item) => item.order < lesson.order).every((item) => item.isComplete);
}

export function getContinueHref(data: NonNullable<Awaited<ReturnType<typeof getStudentProgram>>>): string {
  for (const module of data.modules) {
    if (!module.progressState.isUnlocked || module.progressState.isComplete) continue;
    const lesson = module.lessons.find((item) => !item.isComplete);
    if (lesson) return `/dashboard/modules/${module.slug}/lessons/${lesson.slug}`;
    if (module.assessment) return `/dashboard/modules/${module.slug}/assessment`;
    return `/dashboard/modules/${module.slug}`;
  }
  return "/dashboard";
}

export async function requireAccessibleLesson(userId: string, lessonId: string) {
  const data = await getStudentProgram(userId);
  if (!data) throw new Error("Active enrollment required");
  const module = data.modules.find((item) => item.lessons.some((lesson) => lesson.id === lessonId));
  const lesson = module?.lessons.find((item) => item.id === lessonId);
  if (!module || !lesson || !module.progressState.isUnlocked || !isLessonSequentiallyUnlocked(module.lessons, lesson.id)) throw new Error("Lesson is not available");
  return { module, lesson };
}
