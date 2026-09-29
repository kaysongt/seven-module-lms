"use server";
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function approveFinalExam(form: FormData) {
  const admin = await requireAdmin();
  const id = String(form.get('registrationId') ?? '');
  const mode = String(form.get('mode') ?? '');
  if (!['local', 'retake'].includes(mode)) throw new Error('Invalid approval');
  await db.$transaction(async tx => {
    const registration = await tx.finalExamRegistration.update({ where: { id }, data: { version: { increment: 1 } } });
    const last = await tx.finalExamAttempt.findFirst({ where: { registrationId: id }, orderBy: { number: 'desc' } });
    if (mode === 'local') {
      if (!registration.church) throw new Error('No local-church request exists.');
      await tx.finalExamRegistration.update({ where: { id }, data: { localApproved: true } });
    } else {
      if (!last?.submittedAt || (last.scorePct ?? 0) >= last.passMark) throw new Error('Only a completed unsuccessful attempt can be approved for a retake.');
      await tx.finalExamRegistration.update({ where: { id }, data: { attemptsAllowed: Math.max(registration.attemptsAllowed, last.number + 1) } });
    }
    await tx.auditLog.create({ data: { actorId: admin.id, action: 'final_exam.' + mode + '_approved', entityType: 'FinalExamRegistration', entityId: id } });
  });
  revalidatePath('/admin/final-assessment');
  revalidatePath('/final-assessment');
}
