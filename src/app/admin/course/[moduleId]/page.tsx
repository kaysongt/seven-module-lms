import Link from "next/link";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";
import { getVideoEmbedUrl } from "@/lib/video";
import { LessonBody } from "@/components/lesson-body";

export default async function ModuleReviewPage({ params, searchParams }: { params: Promise<{ moduleId: string }>; searchParams: Promise<{ lesson?: string }> }) {
  await requireStaff();
  const [{ moduleId }, query] = await Promise.all([params, searchParams]);
  const learningModule = await db.module.findFirst({ where: { id: moduleId, program: { slug: SITE_CONFIG.slug } }, include: { lessons: { orderBy: { order: "asc" } }, assessment: { include: { questions: { orderBy: { order: "asc" } } } } } });
  if (!learningModule) notFound();
  const siblings = await db.module.findMany({ where: { programId: learningModule.programId }, orderBy: { order: "asc" }, select: { id: true, title: true, order: true } });
  const next = siblings.find((item) => item.order > learningModule.order);
  return <div className="mx-auto max-w-6xl px-5 py-9 md:px-10">
    <Link href="/admin/course" className="button-quiet !px-0"><ArrowLeft size={16} /> All course modules</Link>
    <div className="mt-6 flex flex-wrap items-start justify-between gap-5"><div><span className="eyebrow">Module {learningModule.order} · Admin review</span><h1 className="display mt-4 text-5xl font-semibold">{learningModule.title}</h1></div><Link href={"/admin/curriculum/" + learningModule.id} className="button-secondary">Edit content</Link></div>
    <p className="mt-5 text-base leading-8 text-[var(--ink-soft)]">{learningModule.description}</p>
    <nav aria-label="Review any module" className="my-7 flex flex-wrap gap-2">{siblings.map((item) => <Link key={item.id} href={"/admin/course/" + item.id} aria-current={item.id === moduleId ? "page" : undefined} className={item.id === moduleId ? "button-primary !min-h-10 !px-4" : "button-secondary !min-h-10 !px-4"} title={item.title}>Module {item.order}</Link>)}</nav>
    <p className="rounded-xl bg-[var(--sage-light)] p-4 text-sm leading-6">Admin review: every lesson is unlocked. Videos can be paused, skipped through, and replayed here. Student lesson locks and completion requirements remain in place.</p>
    <section className="mt-8 grid gap-5" aria-label="Module lessons">{learningModule.lessons.map((lesson) => {
      const embed = getVideoEmbedUrl(lesson.videoUrl);
      return <details key={lesson.id} id={"lesson-" + lesson.id} open={Boolean(embed) || lesson.id === query.lesson} className="scroll-mt-20 rounded-2xl border border-[var(--line)] bg-[var(--paper-light)]">
        <summary className="cursor-pointer p-5 text-lg font-extrabold"><span className="mr-3 text-[var(--clay)]">{lesson.order}.</span>{lesson.title}<span className="ml-3 text-xs font-medium text-[var(--ink-soft)]">{lesson.kind} · {lesson.status}</span></summary>
        <div className="border-t border-[var(--line)] p-5 md:p-7">
          {embed && <div className="mb-7"><div className="aspect-video min-h-[200px] overflow-hidden rounded-xl bg-black"><iframe src={embed + "?rel=0&playsinline=1"} title={lesson.title + " — admin video review"} className="h-full w-full" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen /></div><a href={lesson.videoUrl!} target="_blank" rel="noopener noreferrer" className="button-secondary mt-4"><ExternalLink size={16} /> Open video in a new tab</a><p className="mt-2 text-xs text-[var(--ink-soft)]">If the embedded player is unavailable on your device, use the video link above.</p></div>}
          <LessonBody body={lesson.body} />
          {lesson.resourceUrl && <a href={lesson.resourceUrl} target="_blank" rel="noopener noreferrer" className="button-secondary mt-5">Open source manual <ExternalLink size={15} /></a>}
        </div>
      </details>;
    })}</section>
    {learningModule.assessment && <section id="checkpoint" className="mt-12 scroll-mt-20"><span className="eyebrow">Questions and answer key</span><h2 className="display mt-3 text-4xl font-semibold">{learningModule.assessment.title}</h2><p className="mt-3 text-sm leading-7">{learningModule.assessment.instructions}</p><div className="mt-6 grid gap-5">{learningModule.assessment.questions.map((question) => <article key={question.id} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-light)] p-6"><h3 className="text-lg font-bold">{question.order}. {question.prompt}</h3><ol className="mt-4 grid gap-2">{(Array.isArray(question.options) ? question.options : []).map((option, index) => <li key={index} className={index === question.correctIndex ? "rounded-lg bg-[var(--sage-light)] p-3 font-bold" : "p-3"}>{String.fromCharCode(65 + index)}. {String(option)}{index === question.correctIndex && " — Correct answer"}</li>)}</ol><p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{question.explanation}</p></article>)}</div></section>}
    <div className="mt-10 flex flex-wrap justify-between gap-4"><Link href="/admin/course" className="button-secondary"><ArrowLeft size={16} /> All modules</Link>{next && <Link href={"/admin/course/" + next.id} className="button-primary">Next module <ArrowRight size={16} /></Link>}</div>
  </div>;
}
