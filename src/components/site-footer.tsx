import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "@/components/brand";
import { CHURCH } from "@/lib/church";

export function SiteFooter() {
  const { address } = CHURCH;

  return (
    <footer className="bg-[var(--forest-deep)] text-[var(--paper-light)]">
      <div className="page-shell grid gap-12 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <Brand href="/" inverted />
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/68">{CHURCH.description}</p>
          <a
            href={CHURCH.giveUrl}
            target="_blank"
            rel="noopener"
            className="button-primary mt-7 !min-h-11 !border-[var(--sun)] !bg-[var(--sun)] !text-[#1b1200]"
          >
            Give online
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="grid content-start gap-3">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--sun-soft)] uppercase">
              Gather
            </p>
            <Link href="/#visit">Plan a visit</Link>
            <Link href="/about">About us</Link>
            <Link href="/believers-training">Believers Training</Link>
            <Link href="/children">Children&rsquo;s ministry</Link>
            <a href={CHURCH.watchUrl} target="_blank" rel="noopener" className="inline-flex items-center gap-1">
              Livestream <ArrowUpRight size={14} />
            </a>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="grid content-start gap-3">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[var(--sun-soft)] uppercase">
              Connect
            </p>
            <a href={CHURCH.phoneHref}>{CHURCH.phone}</a>
            <a href={`mailto:${CHURCH.email}`} className="inline-flex items-center gap-1">
              {CHURCH.email} <ArrowUpRight size={14} />
            </a>
            <a href={address.mapUrl} target="_blank" rel="noopener">
              {address.street}
            </a>
            <Link href="/signup">Start Believers Training</Link>
            <Link href="/login">Student login</Link>
            <Link href="/privacy">Privacy</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="page-shell flex flex-wrap justify-between gap-3 py-5 text-xs text-white/50">
          <span>
            &copy; {new Date().getFullYear()} {CHURCH.name}. All rights reserved.
          </span>
          <span>
            {CHURCH.services.map((s) => `${s.day}s ${s.time}`).join(" · ")}
          </span>
        </div>
      </div>
    </footer>
  );
}
