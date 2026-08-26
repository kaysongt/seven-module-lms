import Link from "next/link";
import { ArrowRight, ArrowUpRight, MapPin, Play } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import { CHURCH } from "@/lib/church";

/**
 * The church's front door.
 *
 * Service times and the address sit in a card directly under the hero, on
 * purpose. Neither appears above the fold on the current site, which is its
 * single worst failure: the most common reason a stranger opens a church
 * website is to find out when and where to turn up.
 */

const PATHS = [
  {
    title: "Membership",
    body: "Understand the house, its vision and its doctrine, then formally make it yours.",
    go: "Join the next class",
  },
  {
    title: "Small Groups",
    body: "Meet through the week with a handful of people who will actually know your name.",
    go: "Find a group",
  },
  {
    title: "Units",
    body: "Serve on a team and help carry the weight of what happens every Sunday.",
    go: "Start serving",
  },
  {
    title: "Life Groups",
    body: "Gather by life stage — students, singles, couples, parents — for what you are walking through now.",
    go: "See the groups",
  },
];

export default function HomePage() {
  const { address, services } = CHURCH;

  return (
    <main className="overflow-hidden">
      <PublicNav />

      {/* ---- Hero ---- */}
      <section className="relative border-b border-[var(--line)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -top-44 right-[-8rem] h-[34rem] w-[34rem] rounded-full border border-[var(--forest)]/10" />
          <div className="absolute top-12 right-16 h-48 w-48 rounded-full bg-[var(--sun)]/12 blur-3xl" />
        </div>
        <div className="page-shell relative grid items-center gap-12 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:py-28">
          <div className="reveal max-w-3xl">
            <span className="eyebrow">{CHURCH.tagline} &middot; Chicago</span>
            <h1 className="display mt-8 text-[clamp(3.4rem,9vw,7.4rem)] leading-[0.82] font-medium tracking-[-0.06em]">
              Come as you are.
              <br />
              <span className="italic text-[var(--forest)]">Leave built up.</span>
            </h1>
            <p className="mt-9 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">
              A Word-centered church on Chicago&rsquo;s West Side, raising people of purpose through
              the teaching of Scripture and the ministry of the Holy Spirit.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/#visit" className="button-primary">
                Plan your visit <ArrowRight size={17} />
              </Link>
              <a href={CHURCH.watchUrl} target="_blank" rel="noopener" className="button-secondary">
                <Play size={16} /> Watch a service
              </a>
            </div>
          </div>

          {/* Service times card — the reason most first-time visitors are here. */}
          <div
            id="visit"
            className="reveal reveal-delay-2 scroll-mt-28 rounded-[2.2rem] border border-[var(--line)] bg-[var(--paper-light)] p-7 shadow-[var(--shadow)] md:p-9"
          >
            <span className="text-xs font-extrabold tracking-[0.18em] text-[var(--clay)] uppercase">
              Plan a visit
            </span>
            <dl className="mt-7 grid gap-6">
              {services.map((service) => (
                <div key={service.day} className="border-b border-[var(--line)] pb-5 last:border-0 last:pb-0">
                  <dt className="text-xs font-extrabold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
                    {service.day}
                  </dt>
                  <dd className="display mt-1 text-4xl font-semibold">{service.time}</dd>
                  <dd className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{service.note}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-7 border-t border-[var(--line)] pt-6">
              <p className="flex items-start gap-2 text-sm leading-6 font-semibold">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--sun)]" />
                <span>
                  {address.street}
                  <br />
                  {address.city}, {address.state} {address.postcode}
                </span>
              </p>
              <p className="mt-2 pl-6 text-sm text-[var(--ink-soft)]">
                Free parking in the adjacent lot.
              </p>
              <a
                href={address.mapUrl}
                target="_blank"
                rel="noopener"
                className="button-quiet mt-3 !px-0"
              >
                Get directions <ArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Who we are ---- */}
      <section className="bg-[var(--paper-light)] py-24 md:py-32">
        <div className="page-shell grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <span className="eyebrow">Who we are</span>
            <h2 className="display mt-6 max-w-md text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
              A house that sends people out stronger than they came in.
            </h2>
          </div>
          <div className="max-w-2xl">
            <p className="text-lg leading-8 text-[var(--ink-soft)]">
              KingsWord Chicago is the apostolic headquarters of a global ministry with churches
              across Africa, Europe and North America. We are here to train, equip and release
              God&rsquo;s children into their divine purpose — teaching victory in life through the
              Word and the ministry of the Holy Spirit.
            </p>
            <p className="mt-5 text-lg leading-8 text-[var(--ink-soft)]">
              Whether it is your first Sunday or your fifteenth year, there is a place for you here,
              and a next step waiting when you are ready to take it.
            </p>
            <Link href="/about" className="button-quiet mt-6 !px-0">
              More about us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ---- Get involved ---- */}
      <section id="involved" className="scroll-mt-24 border-y border-[var(--line)] py-24 md:py-32">
        <div className="page-shell">
          <span className="eyebrow">Get involved</span>
          <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
            Four ways to stop attending and start belonging.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {PATHS.map((path) => (
              <article
                key={path.title}
                className="flex min-h-64 flex-col bg-[var(--paper-light)] p-8 md:p-9"
              >
                <h3 className="display text-2xl font-semibold">{path.title}</h3>
                <p className="mt-4 flex-1 text-sm leading-7 text-[var(--ink-soft)]">{path.body}</p>
                <Link
                  href="/contact"
                  className="mt-5 text-xs font-extrabold tracking-[0.1em] text-[var(--clay)] uppercase"
                >
                  {path.go} &rarr;
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Believers Training ---- */}
      <section id="training" className="scroll-mt-24 bg-[var(--forest-deep)] py-24 text-white md:py-32">
        <div className="page-shell grid gap-12 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <span className="text-xs font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">
              Believers Training
            </span>
            <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
              Grounded, then sent.
            </h2>
            <p className="mt-7 max-w-xl text-lg leading-8 text-white/72">
              Seven modules, eleven lessons each, taken in order and at your own pace — covenant,
              identity, the Word, the Holy Spirit, prayer, purpose and stewardship. The same
              teaching this house is built on.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/believers-training"
                className="button-primary !border-[var(--sun)] !bg-[var(--sun)] !text-[#1b1200]"
              >
                Explore the programme <ArrowRight size={17} />
              </Link>
              <Link
                href="/apply"
                className="button-secondary !border-white/25 !bg-white/5 !text-white"
              >
                Apply to join
              </Link>
            </div>
          </div>
          <ol className="grid gap-3">
            {[
              "The New Covenant",
              "Identity in Christ",
              "The Word: The Agent of Change",
              "The Ministry of the Holy Spirit",
              "Spiritual Authority and Prayer",
              "Purpose and Calling",
              "Stewardship and Missional Lifestyle",
            ].map((title, index) => (
              <li
                key={title}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3"
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/8 text-xs font-extrabold text-white/60">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1 text-sm font-bold">{title}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---- Livestream ---- */}
      <section className="bg-[var(--sun)] py-24 text-[var(--forest-deep)] md:py-28">
        <div className="page-shell grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <span className="text-xs font-extrabold tracking-[0.17em] uppercase">Livestream</span>
            <h2 className="display mt-6 max-w-4xl text-5xl leading-[0.95] font-medium tracking-[-0.045em] md:text-7xl">
              Can&rsquo;t make it in? Join us live.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 opacity-80">
              Every service streams, and past services stay up on demand.
            </p>
          </div>
          <a
            href={CHURCH.watchUrl}
            target="_blank"
            rel="noopener"
            className="button-primary whitespace-nowrap"
          >
            Watch on YouTube <ArrowUpRight size={17} />
          </a>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
