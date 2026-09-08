import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";
import { getPublicContext } from "@/lib/public-context";
import { localHref, NETWORK, type PublicContext } from "@/lib/locations";

export async function PublicNav({ context: supplied }: { context?: PublicContext } = {}) {
  const context = supplied ?? await getPublicContext();
  const { location } = context;
  const links = [
    { label: "About", href: localHref(context, "about") },
    { label: "Locations", href: "/locations" },
    ...(location ? [{ label: "Visit", href: localHref(context, "#visit") }] : []),
    { label: "Believers Training", href: "/believers-training" },
    { label: "Contact", href: localHref(context, "contact") },
  ];
  return (
    <header className="relative z-20 border-b border-[var(--line)] bg-white/95">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:bg-white focus:p-4">Skip to content</a>
      <div className="page-shell flex min-h-24 items-center justify-between gap-5">
        <Brand href={localHref(context)} name={location ? `KingsWord ${location.name}` : NETWORK.name} tagline={location?.tagline ?? NETWORK.tagline} />
        <nav className="hidden items-center gap-5 text-sm font-bold xl:flex" aria-label="Primary navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className="hover:underline">{link.label}</Link>)}
          {location?.giveUrl ? <a className="button-primary !min-h-11 !px-5" href={location.giveUrl} target="_blank" rel="noopener noreferrer">Give</a> : <Link href="/login" className="button-primary !min-h-11 !px-5">Student login</Link>}
        </nav>
        <details className="group relative xl:hidden">
          <summary className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border border-[var(--line)]" aria-label="Open navigation"><Menu size={20} /></summary>
          <nav className="absolute right-0 mt-4 grid w-72 max-w-[calc(100vw-40px)] gap-1 rounded-2xl border border-[var(--line)] bg-white p-3 shadow-2xl" aria-label="Mobile navigation">
            {links.map((link) => <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--paper)]">{link.label}</Link>)}
            <Link href="/signup" className="rounded-xl px-4 py-3 text-sm font-bold">Start Believers Training</Link>
            <Link href="/login" className="rounded-xl px-4 py-3 text-sm font-bold">Student login</Link>
            {location?.giveUrl && <a href={location.giveUrl} className="button-primary" target="_blank" rel="noopener noreferrer">Give</a>}
          </nav>
        </details>
      </div>
    </header>
  );
}
