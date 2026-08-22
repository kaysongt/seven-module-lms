import { MessageCircle, Reply } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getStudentProgram } from "@/lib/student-data";
import { CommunityForm } from "@/components/community-form";

export default async function CommunityPage({ searchParams }: { searchParams: Promise<{ module?: string }> }) {
  const user = await requireUser();
  const { module: selectedSlug } = await searchParams;
  const data = await getStudentProgram(user.id);
  if (!data) return <div className="mx-auto max-w-3xl px-5 py-20"><h1 className="display text-5xl font-medium">Active enrollment required.</h1></div>;
  const availableModules = data.modules.filter((module) => module.progressState.isUnlocked).map((module) => ({ id: module.id, title: module.title, slug: module.slug }));
  const selected = availableModules.find((module) => module.slug === selectedSlug) ?? availableModules.at(-1);
  const posts = await db.discussionPost.findMany({ where: { moduleId: { in: availableModules.map((module) => module.id) }, parentId: null, status: "VISIBLE" }, include: { author: { select: { fullName: true, role: true } }, module: { select: { title: true } }, replies: { where: { status: "VISIBLE" }, orderBy: { createdAt: "asc" }, include: { author: { select: { fullName: true, role: true } } } } }, orderBy: { createdAt: "desc" }, take: 50 });
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <aside><span className="eyebrow">Learning together</span><h1 className="display mt-5 text-6xl leading-[0.9] font-medium tracking-[-0.05em]">Community room.</h1><p className="mt-6 text-sm leading-7 text-[var(--ink-soft)]">Use this space to ask, listen, test your understanding, and offer useful responses. Staff can participate and moderate every module conversation.</p><div className="mt-8 rounded-2xl border border-[var(--line)] bg-[var(--sun)]/12 p-5 text-xs leading-6 text-[var(--ink-soft)]"><strong className="block text-[var(--ink)]">A simple standard</strong>Address the idea, protect the person, and contribute more clarity than heat.</div></aside>
        <div>
          {selected && <div className="rounded-[1.7rem] border border-[var(--line)] bg-white/70 p-5 shadow-[var(--shadow)] md:p-7"><CommunityForm modules={availableModules} selectedModuleId={selected.id} /></div>}
          <section className="mt-8 grid gap-4" aria-label="Community posts">
            {posts.length === 0 && <div className="rounded-2xl border border-dashed border-[var(--line)] p-10 text-center"><MessageCircle className="mx-auto text-[var(--forest)]/40" /><p className="mt-4 text-sm font-bold">No posts yet. Begin the conversation above.</p></div>}
            {posts.map((post) => <article key={post.id} className="rounded-2xl border border-[var(--line)] bg-white/60 p-5 md:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><strong className="text-sm">{post.author.fullName}</strong>{post.author.role !== "STUDENT" && <span className="ml-2 rounded-full bg-[var(--sage-light)] px-2 py-1 text-[0.58rem] font-extrabold tracking-[0.1em] text-[var(--forest)] uppercase">Staff</span>}</div><span className="text-[0.66rem] font-bold text-[var(--ink-soft)]/55">{post.module.title} · {post.createdAt.toLocaleDateString()}</span></div><p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[var(--ink-soft)]">{post.body}</p>{post.replies.length > 0 && <div className="mt-5 grid gap-3 border-l-2 border-[var(--sage)] pl-4">{post.replies.map((reply) => <div key={reply.id}><div className="flex items-center gap-2"><Reply size={12} className="text-[var(--forest)]" /><strong className="text-xs">{reply.author.fullName}</strong>{reply.author.role !== "STUDENT" && <span className="text-[0.55rem] font-extrabold text-[var(--clay)] uppercase">Staff</span>}</div><p className="mt-1 whitespace-pre-wrap text-xs leading-6 text-[var(--ink-soft)]">{reply.body}</p></div>)}</div>}<details className="mt-5"><summary className="cursor-pointer text-xs font-extrabold text-[var(--forest)]">Reply</summary><div className="mt-4"><CommunityForm modules={availableModules} selectedModuleId={post.moduleId} parentId={post.id} /></div></details></article>)}
          </section>
        </div>
      </div>
    </div>
  );
}
