import { z } from 'zod';

export const finalQuestionSchema = z.object({
  number: z.number().int().min(1).max(50), module: z.number().int().min(1).max(7),
  prompt: z.string().min(1), options: z.array(z.string().min(1)).length(4),
  correctIndex: z.number().int().min(0).max(3),
});
export type FinalQuestion = z.infer<typeof finalQuestionSchema>;
export type ExamAnswers = Record<string, number>;
export const examAnswersSchema = z.record(z.string().regex(/^(?:[1-9]|[1-4][0-9]|50)$/), z.number().int().min(0).max(3));
export function parseFinalQuestions(input: unknown): FinalQuestion[] {
  const questions = z.array(finalQuestionSchema).length(50).parse(input);
  if (questions.some((question, index) => question.number !== index + 1)) throw new Error('Exam question numbers must be sequential');
  return questions;
}
export function publicQuestions(questions: FinalQuestion[]) {
  return questions.map(({ number, module, prompt, options }) => ({ number, module, prompt, options }));
}
export function gradeFinalExam(questions: FinalQuestion[], answers: ExamAnswers) {
  const moduleResults = Array.from({ length: 7 }, (_, index) => ({ module: index + 1, correct: 0, total: 0 }));
  let correct = 0;
  for (const question of questions) {
    const result = moduleResults[question.module - 1];
    result.total++;
    if (answers[String(question.number)] === question.correctIndex) { correct++; result.correct++; }
  }
  return { correct, scorePct: Math.round(correct * 100 / questions.length), moduleResults };
}
export function answersBeforeDeadline(now: Date, expiresAt: Date, saved: ExamAnswers, incoming: ExamAnswers) {
  return now >= expiresAt ? saved : incoming;
}
