/* eslint-disable @next/next/no-assign-module-variable */
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { submitAssessment } from "@/app/dashboard/modules/[moduleSlug]/assessment/actions";
import { FormButton } from "@/components/form-button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { findStudentModule, getStudentProgram } from "@/lib/student-data";

export default async function AssessmentPage({ params, searchParams }: { params: Promise<{ moduleSlug: string }>; searchParams: Promise<{ result?: string }> }) {
  const user = await requireUser();
  const [{ moduleSlug }, { result }] = await Promise.all([params, searchParams]);
  const data = await getStudentProgram(user.id);
  const module = findStudentModule(data, moduleSlug);
  if (!data || !module?.assessment) notFound();
  if (!module.progressState.isUnlocked || !module.lessons.every((lesson) => lesson.isComplete)) return <div className="mx-auto max-w-2xl px-5 py-20"><h1 className="display text-5xl font-medium">Finish every lesson first.</h1><Link href={`/dashboard/modules/${module.slug}`} className="button-secondary mt-7"><ArrowLeft size={16} /> Module overview</Link></div>;

  const assessment = await db.assessment.findUnique({ where: { id: module.assessment.id }, include: { questions: { orderBy: { order: "asc" } } } });
  if (!assessment || assessment.status !== "PUBLISHED") notFound();
  const attempt = result ? await db.assessmentAttempt.findFirst({ where: { id: result, userId: user.id, assessmentId: assessment.id } }) : null;
  const answers = attempt?.answers && typeof attempt.answers === "object" && !Array.isArray(attempt.answers) ? attempt.answers as Record<string, number> : {};

  if (attempt) {
    return <div className="mx-auto max-w-3xl px-5 py-16 md:py-24"><Link href={`/dashboard/modules/${module.slug}`} className="button-quiet !px-0"><ArrowLeft size={16} /> {module.title}</Link><div className={`mt-10 rounded-[2rem] border p-7 md:p-10 ${attempt.status === "PASSED" ? "border-[var(--forest)]/25 bg-[var(--sage-light)]/45" : "border-[var(--clay)]/25 bg-[#fff0e9]"}`}><div className="flex items-center gap-4">{attempt.status === "PASSED" ? <CheckCircle2 size={34} className="text-[var(--forest)]" /> : <XCircle size={34} className="text-[var(--clay)]" />}<div><span className="text-xs font-extrabold tracking-[0.14em] uppercase">{attempt.status === "PASSED" ? "Checkpoint passed" : "Review and try again"}</span><h1 className="display mt-1 text-6xl font-semibold">{attempt.scorePct}%</h1></div></div><p className="mt-6 text-sm leading-7 text-[var(--ink-soft)]">You answered {attempt.correct} of {attempt.total} questions correctly. The pass mark is {assessment.passMark}%.</p></div><div className="mt-8 grid gap-4">{assessment.questions.map((question) => { const options = Array.isArray(question.options) ? question.options.map(String) : []; const selected = answers[question.id]; const correct = selected === question.correctIndex; return <article key={question.id} className="rounded-2xl border border-[var(--line)] bg-white/65 p-5"><div className="flex gap-3">{correct ? <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--forest)]" /> : <XCircle size={18} className="mt-0.5 shrink-0 text-[var(--clay)]" />}<div><h2 className="text-sm font-extrabold leading-6">{question.prompt}</h2><p className="mt-2 text-xs leading-6 text-[var(--ink-soft)]">Your answer: {options[selected] ?? "No answer"}</p>{!correct && <p className="mt-1 text-xs leading-6 text-[var(--forest)]">Correct answer: {options[question.correctIndex]}</p>}<p className="mt-3 text-xs leading-6 text-[var(--ink-soft)]/70">{question.explanation}</p></div></div></article>; })}</div><div className="mt-9 flex flex-wrap gap-3">{attempt.status === "PASSED" ? <Link href="/dashboard" className="button-primary">Continue to the next module <ArrowRight size={16} /></Link> : <Link href={`/dashboard/modules/${module.slug}/assessment`} className="button-primary"><RotateCcw size={16} /> Try again</Link>}<Link href={`/dashboard/modules/${module.slug}`} className="button-secondary">Module overview</Link></div></div>;
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <Link href={`/dashboard/modules/${module.slug}`} className="button-quiet !px-0"><ArrowLeft size={16} /> {module.title}</Link>
      <span className="eyebrow mt-12">Module checkpoint</span><h1 className="display mt-5 text-6xl leading-[0.9] font-medium tracking-[-0.05em]">{assessment.title}</h1><p className="mt-6 text-base leading-8 text-[var(--ink-soft)]">{assessment.instructions} You need {assessment.passMark}% to pass.</p>
      <form action={submitAssessment} className="mt-10 grid gap-5"><input type="hidden" name="assessmentId" value={assessment.id} />{assessment.questions.map((question, index) => { const options = Array.isArray(question.options) ? question.options.map(String) : []; return <fieldset key={question.id} className="rounded-2xl border border-[var(--line)] bg-white/65 p-5 md:p-7"><legend className="px-1 text-sm font-extrabold leading-6"><span className="mr-2 text-[var(--clay)]">{String(index + 1).padStart(2, "0")}</span>{question.prompt}</legend><div className="mt-5 grid gap-3">{options.map((option, optionIndex) => <label key={optionIndex} className="flex cursor-pointer items-start gap-3 rounded-xl border border-[var(--line)] bg-white/55 p-4 text-sm leading-6 transition has-[:checked]:border-[var(--forest)] has-[:checked]:bg-[var(--sage-light)]/55"><input type="radio" name={`question-${question.id}`} value={optionIndex} required className="mt-1 accent-[var(--forest)]" />{option}</label>)}</div></fieldset>; })}<div className="mt-3"><FormButton pendingLabel="Scoring checkpoint…">Submit checkpoint</FormButton></div></form>
    </div>
  );
}
