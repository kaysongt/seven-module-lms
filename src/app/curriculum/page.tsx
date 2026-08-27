import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import { getPublicProgram } from "@/lib/public-program";

export const metadata: Metadata = { title: "Curriculum", description: "Explore all seven Believers Training modules." };

export const dynamic = "force-dynamic";

export default async function CurriculumPage() {
  const program = await getPublicProgram();
  return (
    <main>
      <PublicNav />
      <section className="border-b border-[var(--line)] py-20 md:py-28">
        <div className="page-shell grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
          <span className="eyebrow">Believers Training curriculum</span>
          <div>
            <h1 className="display text-6xl leading-[0.9] font-medium tracking-[-0.05em] md:text-8xl">Seven modules. One grounded Christian life.</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[var(--ink-soft)]">Move from New Covenant foundations to identity, the Word, the Holy Spirit, prayer, purpose, and missional stewardship. Complete each lesson, integration response, and checkpoint to continue.</p>
          </div>
        </div>
      </section>
      <section className="bg-[var(--paper-light)] py-16 md:py-24">
        <div className="page-shell grid gap-5">
          {program.modules.map((module) => {
            const minutes = module.estimatedMinutes;
            return (
              <article key={module.slug} className="group grid gap-6 rounded-[1.6rem] border border-[var(--line)] bg-white/55 p-6 transition hover:-translate-y-1 hover:bg-white/80 hover:shadow-[var(--shadow)] md:grid-cols-[110px_1fr_auto] md:items-center md:p-8">
                <span className="display text-6xl font-semibold tracking-[-0.06em] text-[var(--forest)]/30">{String(module.order).padStart(2, "0")}</span>
                <div>
                  <span className="text-[0.67rem] font-extrabold tracking-[0.16em] text-[var(--clay)] uppercase">{module.eyebrow}</span>
                  <h2 className="display mt-2 text-3xl font-semibold md:text-4xl">{module.title}</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">{module.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-[var(--ink-soft)]/70">
                    <span>{module.lessons.length} lessons</span>
                    <span className="inline-flex items-center gap-1.5"><Clock3 size={13} /> About {minutes} min</span>
                  </div>
                </div>
                <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--line)] text-[var(--forest)] transition group-hover:border-[var(--forest)] group-hover:bg-[var(--forest)] group-hover:text-white" aria-hidden="true"><ArrowRight size={18} /></span>
              </article>
            );
          })}
        </div>
      </section>
      <section className="py-20">
        <div className="page-shell flex flex-col items-start justify-between gap-8 rounded-[2rem] bg-[var(--forest-deep)] p-8 text-white md:flex-row md:items-end md:p-12">
          <div>
            <span className="text-xs font-extrabold tracking-[0.16em] text-[var(--sun-soft)] uppercase">Your next step</span>
            <h2 className="display mt-5 max-w-2xl text-4xl leading-none font-medium md:text-6xl">Begin when you are ready to finish what you begin.</h2>
          </div>
          <Link href="/signup" className="button-secondary !bg-[var(--sun)] !border-[var(--sun)]">Start free <ArrowRight size={16} /></Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
