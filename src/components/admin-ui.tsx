export function AdminHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="flex flex-wrap items-end justify-between gap-6"><div><span className="text-[0.65rem] font-extrabold tracking-[0.16em] text-[var(--clay)] uppercase">{eyebrow}</span><h1 className="display mt-3 text-5xl leading-none font-semibold tracking-[-0.045em] md:text-6xl">{title}</h1>{description && <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">{description}</p>}</div>{action}</div>;
}

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) {
  const tones = { neutral: "bg-black/6 text-black/55", good: "bg-[var(--sage-light)] text-[var(--forest)]", warn: "bg-[var(--sun-soft)]/60 text-[#72501f]", bad: "bg-[#fde2d8] text-[#8b3d28]" };
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[0.58rem] font-extrabold tracking-[0.1em] uppercase ${tones[tone]}`}>{children}</span>;
}

export function AdminEmpty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-black/15 p-10 text-center text-sm font-bold text-[var(--ink-soft)]/65">{children}</div>;
}
