import 'server-only';
import { db } from '@/lib/db';
import { SITE_CONFIG } from '@/lib/site-config';
import { getStudentProgram } from '@/lib/student-data';
import { examAnswersSchema, gradeFinalExam, parseFinalQuestions } from '@/lib/final-exam';

export async function finalizeExpiredExams(examId: string, userId?: string) {
  const now = new Date();
  const expired = await db.finalExamAttempt.findMany({ where: { submittedAt: null, expiresAt: { lte: now }, registration: { examId, ...(userId ? { userId } : {}) } } });
  for (const attempt of expired) {
    const grade = gradeFinalExam(parseFinalQuestions(attempt.questions), examAnswersSchema.parse(attempt.answers));
    // Conditional update prevents a stale snapshot overwriting concurrent submission.
    await db.finalExamAttempt.updateMany({ where: { id: attempt.id, version: attempt.version, submittedAt: null }, data: { ...grade, submittedAt: attempt.expiresAt, version: { increment: 1 } } });
  }
}

export async function getFinalExam() {
  return db.finalExam.findFirst({ where: { program: { slug: SITE_CONFIG.slug } } });
}
export async function finalExamEligibility(userId: string, localApproved: boolean) {
  const enrollment = await db.enrollment.findFirst({ where: { userId, program: { slug: SITE_CONFIG.slug } } });
  if (enrollment && !['ACTIVE', 'COMPLETED'].includes(enrollment.status)) return false;
  if (localApproved) return true;
  const data = await getStudentProgram(userId);
  return Boolean(data && data.program.slug === SITE_CONFIG.slug && data.modules.length === 7 && data.modules.every(item => item.progressState.isComplete && item.progressState.isUnlocked));
}
