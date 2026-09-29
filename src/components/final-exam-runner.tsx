"use client";
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveFinalExam } from '@/app/final-assessment/actions';
import type { ExamAnswers, FinalQuestion } from '@/lib/final-exam';

type Props = { attemptId: string; questions: Omit<FinalQuestion, 'correctIndex'>[]; initialAnswers: ExamAnswers; version: number; remainingSeconds: number };
export function FinalExamRunner({ attemptId, questions, initialAnswers, version, remainingSeconds }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState(initialAnswers);
  const [current, setCurrent] = useState(0);
  const [seconds, setSeconds] = useState(remainingSeconds);
  const [message, setMessage] = useState('Your answers are saved as you go.');
  const [submitting, setSubmitting] = useState(false);
  const latest = useRef(initialAnswers);
  const saved = useRef(JSON.stringify(initialAnswers));
  const revision = useRef(version);
  const busy = useRef(false);
  const closed = useRef(false);
  const submitRequested = useRef(false);
  const deadline = useRef<number | null>(null);
  const persist = useCallback(async (finish = false) => {
    if (finish) { submitRequested.current = true; setSubmitting(true); }
    finish = finish || submitRequested.current;
    if (busy.current || closed.current) return;
    const snapshot = latest.current;
    const serialized = JSON.stringify(snapshot);
    if (!finish && serialized === saved.current) return;
    busy.current = true;
    if (finish) setSubmitting(true);
    setMessage(finish ? 'Submitting your assessment…' : 'Saving answers…');
    try {
      const result = await saveFinalExam(attemptId, revision.current, snapshot, finish);
      if ('error' in result) { submitRequested.current = false; setMessage(result.error!); return; }
      revision.current = result.version;
      saved.current = serialized;
      if (result.closed) { closed.current = true; router.refresh(); }
      else setMessage('All saved answers are up to date.');
    } catch { setMessage('Connection interrupted. Keep this page open; we will retry saving. The exam timer continues.'); }
    finally { busy.current = false; setSubmitting(false); }
  }, [attemptId, router]);
  useEffect(() => {
    // Monotonic elapsed time avoids local clock changes altering the displayed countdown.
    deadline.current = performance.now() + remainingSeconds * 1000;
    const timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil(((deadline.current ?? performance.now()) - performance.now()) / 1000));
      setSeconds(remaining);
      void persist(remaining === 0);
    }, 1000);
    return () => clearInterval(timer);
  }, [remainingSeconds, persist]);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => {
      if (!closed.current && JSON.stringify(latest.current) !== saved.current) { event.preventDefault(); event.returnValue = ''; }
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  const question = questions[current];
  const answered = Object.keys(answers).length;
  function select(value: number) { const next = { ...latest.current, [question.number]: value }; latest.current = next; setAnswers(next); setMessage('Answer selected. Saving shortly…'); }
  return <section className="mt-8">
    <div className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm">
      <div><p className="text-sm font-bold">{answered} of {questions.length} answered</p><p role="status" className="mt-1 max-w-lg text-xs leading-5">{message}</p></div>
      <p className={seconds < 300 ? 'text-xl font-bold text-red-700' : 'text-xl font-bold'} aria-label="Time remaining">{Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}</p>
    </div>
    <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_240px]">
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper-light)] p-6 md:p-9">
        <span className="eyebrow">Module {question.module} · Question {question.number} of 50</span>
        <fieldset disabled={seconds === 0 || submitting} className="mt-6"><legend className="text-2xl font-bold leading-9">{question.prompt}</legend>
          <div className="mt-6 grid gap-3">{question.options.map((option, index) => <label key={index} className={'flex cursor-pointer items-start gap-3 rounded-xl border p-4 ' + (answers[String(question.number)] === index ? 'border-[var(--forest)] bg-[var(--sage-light)]' : 'border-[var(--line)]')}><input type="radio" name={'question-' + question.number} checked={answers[String(question.number)] === index} onChange={() => select(index)} className="mt-1 h-4 w-4 shrink-0" /><span>{String.fromCharCode(65 + index)}. {option}</span></label>)}</div>
        </fieldset>
        <div className="mt-8 flex justify-between gap-3"><button className="button-secondary" disabled={current === 0} onClick={() => setCurrent(current - 1)}>Previous</button><button className="button-primary" disabled={current === questions.length - 1} onClick={() => setCurrent(current + 1)}>Next question</button></div>
      </div>
      <aside className="rounded-2xl border border-[var(--line)] p-5"><p className="text-sm font-bold">Jump to a question</p><nav aria-label="Exam questions" className="mt-4 grid grid-cols-5 gap-2">{questions.map((q, index) => <button key={q.number} aria-current={current === index ? 'step' : undefined} aria-label={'Question ' + q.number + (answers[String(q.number)] !== undefined ? ', answered' : ', unanswered')} onClick={() => setCurrent(index)} className={'min-h-10 rounded-lg border text-sm font-bold ' + (current === index ? 'border-[var(--forest)] ring-2 ring-[var(--forest)] ' : 'border-[var(--line)] ') + (answers[String(q.number)] !== undefined ? 'bg-[var(--sage-light)]' : '')}>{q.number}</button>)}</nav><p className="mt-4 text-xs leading-5">Shaded questions have an answer. You can revisit any question before submitting.</p></aside>
    </div>
    <p className="mt-6 text-sm leading-6">When time runs out, only answers received by the server before the deadline count. The timer continues if you close this page.</p>
    <button className="button-primary mt-5" disabled={submitting} onClick={() => { if (seconds === 0 || window.confirm(`Submit your final assessment? ${50 - answered} question(s) are unanswered. You cannot change answers after submitting.`)) void persist(true); }}>{seconds === 0 ? 'Finish assessment and view results' : 'Submit final assessment'}</button>
  </section>;
}
