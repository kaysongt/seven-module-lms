import Link from "next/link";
import { Menu } from "lucide-react";
import { Brand } from "@/components/brand";
import { CHURCH, NAV_LINKS } from "@/lib/church";

/**
 * The church's primary navigation.
 *
 * Both the inline bar and the mobile panel render from NAV_LINKS, so a link
 * added in one place cannot go missing from the other — which is exactly how
 * navigations drift out of sync.
 */
export function PublicNav() {
  return (
    <header className="relative z-20 border-b border-[var(--line)] bg-[rgba(245,242,236,0.82)] backdrop-blur-xl">
      <div className="page-shell flex min-h-20 items-center justify-between gap-5">
        <Brand />

        <nav
          className="hidden items-center gap-6 text-sm font-bold text-[var(--ink-soft)] lg:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) =>
            link.external ? (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener"
                className="hover:text-[var(--forest)]"
              >
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} className="hover:text-[var(--forest)]">
                {link.label}
              </Link>
            ),
          )}
          <a
            href={CHURCH.giveUrl}
            target="_blank"
            rel="noopener"
            className="button-primary !min-h-11 !px-5"
          >
            Give
          </a>
        </nav>

        <details className="group relative lg:hidden">
          <summary
            className="grid h-11 w-11 cursor-pointer list-none place-items-center rounded-full border border-[var(--line)] bg-white/60"
            aria-label="Open navigation"
          >
            <Menu size={19} />
          </summary>
          <nav
            className="absolute right-0 mt-3 grid min-w-60 gap-1 rounded-2xl border border-[var(--line)] bg-[var(--paper-light)] p-2 shadow-2xl"
            aria-label="Mobile navigation"
          >
            {NAV_LINKS.map((link) =>
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener"
                  className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href="/signup"
              className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]"
            >
              Start Believers Training
            </Link>
            <Link
              href="/login"
              className="rounded-xl px-4 py-3 text-sm font-bold hover:bg-[var(--sage-light)]"
            >
              Student login
            </Link>
            <a
              href={CHURCH.giveUrl}
              target="_blank"
              rel="noopener"
              className="button-primary mt-1 !min-h-11"
            >
              Give
            </a>
          </nav>
        </details>
      </div>
    </header>
  );
}
