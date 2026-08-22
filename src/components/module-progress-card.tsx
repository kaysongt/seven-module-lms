import Link from "next/link";
import { ArrowRight, Check, Clock3, LockKeyhole } from "lucide-react";

type ModuleCardProps = {
  order: number;
  slug: string;
  eyebrow: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  completedLessons: number;
  totalLessons: number;
  percent: number;
  isUnlocked: boolean;
  isComplete: boolean;
};

export function ModuleProgressCard(props: ModuleCardProps) {
  const href = props.isUnlocked ? `/dashboard/modules/${props.slug}` : undefined;
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <span className="display text-5xl font-semibold tracking-[-0.06em] text-[var(--forest)]/25">{String(props.order).padStart(2, "0")}</span>
        <span className={`grid h-9 w-9 place-items-center rounded-full ${props.isComplete ? "bg-[var(--forest)] text-white" : props.isUnlocked ? "bg-[var(--sun-soft)] text-[var(--forest-deep)]" : "bg-black/5 text-black/30"}`}>
          {props.isComplete ? <Check size={17} strokeWidth={3} /> : props.isUnlocked ? <ArrowRight size={16} /> : <LockKeyhole size={15} />}
        </span>
      </div>
      <span className="mt-7 text-[0.66rem] font-extrabold tracking-[0.15em] text-[var(--clay)] uppercase">{props.eyebrow}</span>
      <h3 className="display mt-2 text-3xl leading-none font-semibold">{props.title}</h3>
      <p className="mt-4 min-h-20 text-sm leading-6 text-[var(--ink-soft)]">{props.summary}</p>
      <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-black/8"><span className="block h-full rounded-full bg-[var(--forest)]" style={{ width: `${props.isComplete ? 100 : props.percent}%` }} /></div>
      <div className="mt-3 flex items-center justify-between text-[0.68rem] font-bold text-[var(--ink-soft)]/65">
        <span>{props.isUnlocked ? `${props.completedLessons}/${props.totalLessons} lessons` : "Complete the previous module"}</span>
        <span className="inline-flex items-center gap-1"><Clock3 size={12} /> {props.estimatedMinutes} min</span>
      </div>
    </>
  );

  const classes = `block rounded-[1.5rem] border p-6 no-underline transition ${props.isUnlocked ? "border-[var(--line)] bg-white/72 hover:-translate-y-1 hover:border-[var(--forest)]/35 hover:shadow-[var(--shadow)]" : "cursor-not-allowed border-black/5 bg-black/[0.025] opacity-65"}`;
  return href ? <Link href={href} className={classes}>{content}</Link> : <article className={classes}>{content}</article>;
}
