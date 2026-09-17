import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";

export default async function CourseReviewPage() {
  await requireStaff();
  const program = await db.program.findUnique({ where: { slug: SITE_CONFIG.slug }, include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" }, select: { id: true, videoUrl: true } }, assessment: { select: { _count: { select: { questions: true } } } } } } } });
  return <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
    <span className="eyebrow">Administrator course access</span>
    <h1 className="display mt-4 text-5xl font-semibold">Review the full course.</h1>
    <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--ink-soft)]">Open any module to watch its teaching, read every lesson, and review the questions and answers. All modules are available to administrators and instructors. Reviewing does not change student progress.</p>
    {!program && <p className="mt-8">The course has not been configured yet.</p>}
    <div className="mt-9 grid gap-5 md:grid-cols-2">{program?.modules.map((learningModule) => <Link key={learningModule.id} href={"/admin/course/" + learningModule.id} className="rounded-2xl border border-[var(--line)] bg-[var(--paper-light)] p-6 transition hover:border-[var(--forest)]">
      <span className="text-xs font-extrabold tracking-widest text-[var(--clay)]">MODULE {learningModule.order} · {learningModule.status}</span>
      <h2 className="display mt-3 text-3xl font-semibold">{learningModule.title}</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">{learningModule.summary}</p>
      <p className="mt-4 text-xs font-bold">{learningModule.lessons.length} lessons · {learningModule.assessment?._count.questions ?? 0} test questions</p>
      <span className="mt-6 inline-flex items-center gap-2 font-extrabold text-[var(--forest)]"><PlayCircle size={19} /> Watch video & review module <ArrowRight size={17} /></span>
    </Link>)}</div>
  </div>;
}
