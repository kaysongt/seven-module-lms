import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { SITE_CONFIG } from "@/lib/site-config";

export function SiteFooter() {
  return (
    <footer className="bg-[var(--forest-deep)] text-[var(--paper-light)]">
      <div className="page-shell grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Brand href="/" inverted />
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/68">{SITE_CONFIG.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="grid content-start gap-3">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--sun-soft)] uppercase">Explore</p>
            <Link href="/curriculum">Curriculum</Link>
            <Link href="/apply">Apply</Link>
            <Link href="/login">Student login</Link>
          </div>
          <div className="grid content-start gap-3">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--sun-soft)] uppercase">Support</p>
            <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="inline-flex items-center gap-1">Email the team <ArrowUpRight size={14} /></a>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="page-shell flex flex-wrap justify-between gap-3 py-5 text-xs text-white/50">
          <span>© {new Date().getFullYear()} {SITE_CONFIG.organization}</span>
          <span>Built for careful learning and accountable practice.</span>
        </div>
      </div>
    </footer>
  );
}
