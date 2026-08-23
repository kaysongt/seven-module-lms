/* eslint-disable @next/next/no-assign-module-variable */
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Clock3, Download, LockKeyhole } from "lucide-react";
import { notFound } from "next/navigation";
import { LessonBody } from "@/components/lesson-body";
import { AssignmentForm } from "@/components/assignment-form";
import { markLessonComplete } from "@/app/dashboard/modules/[moduleSlug]/lessons/[lessonSlug]/actions";
import { requireUser } from "@/lib/auth";
import { findStudentModule, getStudentProgram, isLessonSequentiallyUnlocked } from "@/lib/student-data";
import { getVideoEmbedUrl } from "@/lib/video";

export default async function LessonPage({ params }: { params: Promise<{ moduleSlug: string; lessonSlug: string }> }) {
  const user = await requireUser();
  const { moduleSlug, lessonSlug } = await params;
  const data = await getStudentProgram(user.id);
  const module = findStudentModule(data, moduleSlug);
  const lesson = module?.lessons.find((item) => item.slug === lessonSlug);
  if (!data || !module || !lesson) notFound();
  if (!module.progressState.isUnlocked || !isLessonSequentiallyUnlocked(module.lessons, lesson.id)) return <div className="mx-auto max-w-3xl px-5 py-20"><LockKeyhole size={30} className="text-[var(--clay)]" /><h1 className="display mt-6 text-5xl font-medium">Complete the previous lesson first.</h1><Link href={`/dashboard/modules/${module.slug}`} className="button-secondary mt-8"><ArrowLeft size={16} /> Module overview</Link></div>;

  const index = module.lessons.findIndex((item) => item.id === lesson.id);
  const nextLesson = module.lessons[index + 1];
  const nextHref = nextLesson ? `/dashboard/modules/${module.slug}/lessons/${nextLesson.slug}` : `/dashboard/modules/${module.slug}/assessment`;
  const embedUrl = getVideoEmbedUrl(lesson.videoUrl);
  const completeAction = markLessonComplete.bind(null, lesson.id);

  return (
    <div className="min-h-screen bg-[var(--paper-light)]">
      <div className="border-b border-[var(--line)] bg-white/50 px-4 py-4 md:px-8"><div className="mx-auto flex max-w-7xl items-center justify-between gap-5"><Link href={`/dashboard/modules/${module.slug}`} className="inline-flex items-center gap-2 text-xs font-extrabold text-[var(--ink-soft)]"><ArrowLeft size={15} /> {module.title}</Link><span className="text-xs font-bold text-[var(--ink-soft)]/60">Lesson {lesson.order} of {module.lessons.length}</span></div></div>
      <div className="mx-auto grid max-w-7xl lg:grid-cols-[270px_1fr]">
        <aside className="hidden border-r border-[var(--line)] p-6 lg:block"><span className="text-[0.65rem] font-extrabold tracking-[0.15em] text-[var(--clay)] uppercase">Module {String(module.order).padStart(2, "0")}</span><h2 className="display mt-3 text-2xl font-semibold">{module.title}</h2><ol className="mt-7 grid gap-2">{module.lessons.map((item) => <li key={item.id}><Link href={isLessonSequentiallyUnlocked(module.lessons, item.id) ? `/dashboard/modules/${module.slug}/lessons/${item.slug}` : "#"} aria-disabled={!isLessonSequentiallyUnlocked(module.lessons, item.id)} className={`flex gap-3 rounded-xl p-3 text-xs font-bold leading-5 ${item.id === lesson.id ? "bg-[var(--sage-light)] text-[var(--forest-deep)]" : "text-[var(--ink-soft)]/70"}`}><span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.6rem] ${item.isComplete ? "bg-[var(--forest)] text-white" : "border border-[var(--line)]"}`}>{item.isComplete ? <Check size={10} /> : item.order}</span>{item.title}</Link></li>)}</ol></aside>
        <article className="min-w-0 px-4 py-10 md:px-10 md:py-14 xl:px-20">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-wrap items-center gap-4 text-[0.68rem] font-extrabold tracking-[0.08em] text-[var(--ink-soft)]/60 uppercase"><span>{lesson.kind}</span><span className="inline-flex items-center gap-1"><Clock3 size={13} /> {lesson.estimatedMinutes} min</span>{lesson.isComplete && <span className="inline-flex items-center gap-1 text-[var(--forest)]"><Check size={13} /> Complete</span>}</div>
            {embedUrl && <div className="mt-8 aspect-video overflow-hidden rounded-2xl bg-black shadow-xl"><iframe src={embedUrl} title={lesson.title} className="h-full w-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>}
            <div className="mt-9"><LessonBody body={lesson.body} /></div>
            {lesson.resourceUrl && <a href={lesson.resourceUrl} target="_blank" rel="noreferrer" className="button-secondary mt-6"><Download size={16} /> Open source manual</a>}
            {lesson.kind === "ASSIGNMENT" && !lesson.isComplete && <AssignmentForm lessonId={lesson.id} />}
            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--line)] pt-7">
              {!lesson.isComplete && lesson.kind !== "ASSIGNMENT" && <form action={completeAction}><button className="button-primary"><Check size={17} /> Mark complete</button></form>}
              {!lesson.isComplete && lesson.kind === "ASSIGNMENT" && <span className="text-sm font-extrabold text-[var(--ink-soft)]">Submit your response above to complete this lesson.</span>}
              {lesson.isComplete && <span className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--forest)]"><Check size={16} /> Lesson complete</span>}
              {lesson.isComplete && <Link href={nextHref} className="button-secondary">{nextLesson ? "Next lesson" : "Module checkpoint"} <ArrowRight size={16} /></Link>}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
