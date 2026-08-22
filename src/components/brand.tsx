import Link from "next/link";
import { SITE_CONFIG } from "@/lib/site-config";

export function Brand({ compact = false, href = "/", inverted = false }: { compact?: boolean; href?: string; inverted?: boolean }) {
  return (
    <Link href={href} className="inline-flex items-center gap-3 no-underline" aria-label={`${SITE_CONFIG.name} home`}>
      <span className={`relative grid h-10 w-10 grid-cols-3 items-end gap-1 rounded-full p-2 ${inverted ? "border border-white/15 bg-white/10" : "bg-[var(--forest-deep)]"}`} aria-hidden="true">
        <span className="h-2 rounded-full bg-[var(--sun)]" />
        <span className="h-4 rounded-full bg-[var(--sun-soft)]" />
        <span className="h-6 rounded-full bg-[var(--paper-light)]" />
      </span>
      <span className="grid leading-none">
        <span className={`text-[0.62rem] font-extrabold tracking-[0.19em] uppercase ${inverted ? "text-[var(--sun-soft)]" : "text-[var(--forest)]"}`}>{SITE_CONFIG.organization}</span>
        {!compact && <span className={`display mt-1 text-xl font-semibold ${inverted ? "text-white" : "text-[var(--ink)]"}`}>{SITE_CONFIG.shortName}</span>}
      </span>
    </Link>
  );
}
