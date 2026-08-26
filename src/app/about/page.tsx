import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import { CHURCH } from "@/lib/church";

export const metadata = {
  title: "About us",
  description:
    "KingsWord International Church, Chicago is committed to raising a people of purpose — the apostolic headquarters of a global ministry.",
};

/**
 * The mission statement below is carried over close to verbatim from the
 * church's existing site. It is doctrinal identity language they chose for
 * themselves; it is re-set here, not rewritten.
 */

const COMMITMENTS = [
  {
    title: "Proclaim Jesus",
    body: "To present the Anointed One clearly to a dying world, without apology and without dilution.",
  },
  {
    title: "Teach the Word",
    body: "To help people build a stronger relationship with the Lord through the preaching and teaching of Scripture.",
  },
  {
    title: "Emphasize victory",
    body: "To hold out victory in life by the Word and by the ministry of the Holy Spirit.",
  },
  {
    title: "Release purpose",
    body: "To train, equip and release God's children into the fullness of their God-given purpose.",
  },
];

const LEADERS = [
  {
    name: "Dr Kayode Ijisesan",
    role: "President, KingsWord Ministries International",
    body: "Founder of KingsWord Ministries International, overseeing a global apostolic work with churches across Africa, Europe and North America.",
  },
  {
    name: "Pastor May Ijisesan",
    role: "Senior Pastor",
    body: "Leads the Chicago congregation, with a particular ministry to women carrying the weight of leadership in the local church.",
  },
];

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      <PublicNav />

      <section className="border-b border-[var(--line)] bg-[var(--forest-deep)] py-20 text-white md:py-28">
        <div className="page-shell">
          <span className="text-xs font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">
            About us
          </span>
          <h1 className="display mt-7 max-w-3xl text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.9] font-medium tracking-[-0.05em]">
            Raising a <span className="italic text-[var(--sun-soft)]">supernatural army</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/72">
            KingsWord International Church, Chicago is committed to raising a people of purpose —
            and to sending them back out into the city stronger than they arrived.
          </p>
        </div>
      </section>

      <section className="bg-[var(--paper-light)] py-24 md:py-32">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="eyebrow">Our mission</span>
            <h2 className="display mt-6 max-w-md text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
              A people of purpose, trained and released.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-[var(--ink-soft)]">
              We are committed to raising a people of purpose: to proclaim Jesus, the Anointed One,
              and to present Him clearly to a dying world.
            </p>
            <p className="mt-5 text-lg leading-8 text-[var(--ink-soft)]">
              We are called to help people build a stronger relationship with the Lord through the
              preaching and teaching of the Word. We emphasize victory in life by the Word and the
              ministry of the Holy Spirit. We are anointed to train, equip and release God&rsquo;s
              children into the fullness of their God-given purpose.
            </p>
            <Link href="/contact" className="button-quiet mt-6 !px-0">
              Talk to someone <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] py-24 md:py-32">
        <div className="page-shell">
          <span className="eyebrow">What we are for</span>
          <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
            Four commitments we keep coming back to.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {COMMITMENTS.map((item) => (
              <article key={item.title} className="min-h-56 bg-[var(--paper-light)] p-8 md:p-9">
                <h3 className="display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="page-shell">
          <span className="eyebrow">Meet our leaders</span>
          <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
            The people who carry this house.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2">
            {LEADERS.map((leader) => (
              <article key={leader.name} className="bg-[var(--paper-light)] p-8 md:p-10">
                <h3 className="display text-3xl font-semibold">{leader.name}</h3>
                <p className="mt-2 text-xs font-extrabold tracking-[0.1em] text-[var(--clay)] uppercase">
                  {leader.role}
                </p>
                <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">{leader.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--forest-deep)] py-24 text-white md:py-28">
        <div className="page-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="text-xs font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">
              KingsWord everywhere
            </span>
            <h2 className="display mt-6 max-w-3xl text-5xl leading-[0.95] font-medium tracking-[-0.045em] md:text-6xl">
              The apostolic headquarters of a global ministry.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/70">
              Chicago is the headquarters of a work that now spans Africa, Europe and North America.
              What is taught here is taught in every one of those houses.
            </p>
          </div>
          <a
            href={CHURCH.ministryUrl}
            target="_blank"
            rel="noopener"
            className="button-primary !border-[var(--sun)] !bg-[var(--sun)] !text-[#1b1200] whitespace-nowrap"
          >
            KingsWord International <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
