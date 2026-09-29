import { describe, expect, it } from 'vitest';
import { answersBeforeDeadline, examAnswersSchema, gradeFinalExam, parseFinalQuestions, publicQuestions, type FinalQuestion } from './final-exam';
const questions: FinalQuestion[] = Array.from({length: 50}, (_, i) => ({number: i+1, module: Math.min(7, Math.floor(i/8)+1), prompt: `Question ${i+1}`, options:['A','B','C','D'], correctIndex:i%4}));
describe('final exam scoring and boundaries', () => {
  it('passes exactly 35 correct answers at 70% and counts blanks as wrong', () => {
    const answers = Object.fromEntries(questions.slice(0,35).map(q=>[String(q.number),q.correctIndex]));
    expect(gradeFinalExam(questions,answers).scorePct).toBe(70);
    delete answers['35'];
    expect(gradeFinalExam(questions,answers).scorePct).toBe(68);
    expect(gradeFinalExam(questions,{}).correct).toBe(0);
  });
  it('module totals and scores reconcile with the full result', () => {
    const grade = gradeFinalExam(questions,Object.fromEntries(questions.map(q=>[q.number,q.correctIndex])));
    expect(grade.correct).toBe(50);
    expect(grade.moduleResults.reduce((n,r)=>n+r.total,0)).toBe(50);
    expect(grade.moduleResults.reduce((n,r)=>n+r.correct,0)).toBe(50);
  });
  it('removes every answer index from student question data', () => {
    expect(publicQuestions(questions)).toHaveLength(50);
    expect(JSON.stringify(publicQuestions(questions))).not.toContain('correctIndex');
  });
  it('refuses duplicated or incomplete question sets and invalid option values', () => {
    expect(()=>parseFinalQuestions(questions.slice(1))).toThrow();
    expect(()=>parseFinalQuestions(questions.map(q=>({...q,number:1})))).toThrow();
    expect(examAnswersSchema.safeParse({'1':4}).success).toBe(false);
    expect(examAnswersSchema.safeParse({'51':0}).success).toBe(false);
    expect(examAnswersSchema.safeParse({'1':'0'}).success).toBe(false);
  });
  it('never accepts new answers at or after the server deadline', () => {
    const deadline=new Date('2026-09-29T12:00:00Z');
    expect(answersBeforeDeadline(new Date(deadline.getTime()-1),deadline,{'1':0},{'1':1})).toEqual({'1':1});
    expect(answersBeforeDeadline(deadline,deadline,{'1':0},{'1':1})).toEqual({'1':0});
    expect(answersBeforeDeadline(new Date(deadline.getTime()+1),deadline,{}, {'1':1})).toEqual({});
  });
});
