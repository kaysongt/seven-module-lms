import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";

export function PublicNav() {
  return (
    <header className="relative z-20 border-b border-[var(--line)] bg-[rgba(242,238,228,0.82)] backdrop-blur-xl">
      <div className="page-shell flex min-h-20 items-center justify-between gap-5">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm font-bold text-[var(--ink-soft)] md:flex" aria-label="Primary navigation">
          <Link href="/curriculum" className="hover:text-[var(--forest)]">Curriculum</Link>
          <Link href="/#experience" className="hover:text-[var(--forest)]">Experience</Link>
          <Link href="/login" className="hover:text-[var(--forest)]">Student login</Link>
          <Link href="/apply" className="button-primary !min-h-11 !px-5">Apply</Link>
        </nav>
        <details className="group relative md:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border border-[var(--line)] bg-white/60" aria-label="Open navigation">
            <Menu size={19} />
          </summary>
          <nav className="absolute right-0 mt-3 grid min-w-56 gap-1 rounded-2xl border border-[var(--line)] bg-[var(--paper-light)] p-2 shadow-2xl" aria-label="Mobile navigation">
            <Link href="/curriculum" className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]">Curriculum</Link>
            <Link href="/#experience" className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]">Experience</Link>
            <Link href="/login" className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]">Student login</Link>
            <Link href="/apply" className="button-primary mt-1 !min-h-11">Apply</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
