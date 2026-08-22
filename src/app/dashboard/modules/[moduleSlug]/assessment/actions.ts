"use server";

/* eslint-disable @next/next/no-assign-module-variable */

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateScore, scorePasses } from "@/lib/learning";
import { getStudentProgram } from "@/lib/student-data";

export async function submitAssessment(formData: FormData) {
  const user = await requireUser();
  const assessmentId = String(formData.get("assessmentId") ?? "");
  const assessment = await db.assessment.findUnique({ where: { id: assessmentId }, include: { module: true, questions: { orderBy: { order: "asc" } } } });
  if (!assessment || assessment.status !== "PUBLISHED") throw new Error("Assessment not found");

  const data = await getStudentProgram(user.id);
  const module = data?.modules.find((item) => item.id === assessment.moduleId);
  if (!data || !module || !module.progressState.isUnlocked || !module.lessons.every((lesson) => lesson.isComplete)) throw new Error("Complete the module lessons before taking this checkpoint");

  const answers: Record<string, number> = {};
  let correct = 0;
  for (const question of assessment.questions) {
    const raw = formData.get(`question-${question.id}`);
    const answer = Number(raw);
    if (!Number.isInteger(answer) || answer < 0 || answer > 3) throw new Error("Answer every question before submitting");
    answers[question.id] = answer;
    if (answer === question.correctIndex) correct += 1;
  }

  const scorePct = calculateScore(correct, assessment.questions.length);
  const passed = scorePasses(scorePct, assessment.passMark);
  const attempt = await db.assessmentAttempt.create({
    data: { assessmentId, userId: user.id, answers, correct, total: assessment.questions.length, scorePct, status: passed ? "PASSED" : "FAILED" },
  });

  if (passed) {
    const publishedAssessmentIds = data.modules.map((item) => item.assessment?.id).filter((id): id is string => Boolean(id));
    const passedAssessments = await db.assessmentAttempt.findMany({ where: { userId: user.id, assessmentId: { in: publishedAssessmentIds }, status: "PASSED" }, distinct: ["assessmentId"], select: { assessmentId: true } });
    const completedLessonCount = await db.lessonProgress.count({ where: { userId: user.id, lessonId: { in: data.modules.flatMap((item) => item.lessons.map((lesson) => lesson.id)) } } });
    const totalLessons = data.modules.reduce((sum, item) => sum + item.lessons.length, 0);
    if (passedAssessments.length === publishedAssessmentIds.length && completedLessonCount === totalLessons) {
      await db.enrollment.update({ where: { id: data.enrollment.id }, data: { status: "COMPLETED", completedAt: new Date() } });
    }
  }

  redirect(`/dashboard/modules/${assessment.module.slug}/assessment?result=${attempt.id}`);
}
