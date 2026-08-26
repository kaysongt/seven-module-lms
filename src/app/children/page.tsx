import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Children Ministry",
  description:
    "Raising spirit-filled children who know God, love His Word and walk in His ways. Child care is available at every Sunday service.",
};

/**
 * Values, scriptures and programme names are the church's own, carried across
 * from their existing page. The emoji that headed each value there are dropped:
 * this design already has a typographic label for that job, and a glyph that
 * renders differently on every device is a poor substitute.
 */

const VALUES = [
  {
    title: "Love and compassion",
    verse: "1 John 4:7–8",
    body: "We teach children that love is more than a feeling — it is a way of life. Our kids learn to be kind, caring and full of compassion, just like Jesus.",
  },
  {
    title: "Honesty and integrity",
    verse: "Ephesians 4:25",
    body: "Truth matters. We build the courage to speak truthfully and live with integrity, and help children see that honesty honours God and earns trust.",
  },
  {
    title: "Spiritual habits",
    verse: "Proverbs 22:6",
    body: "Prayer, worship and Bible reading become part of a child's rhythm of life — not chores, but habits that build a foundation which holds.",
  },
];

const HABITS = [
  {
    title: "Prayer",
    verse: "Philippians 4:6–7",
    body: "Children learn to talk to God every day, and to bring Him everything rather than only the tidy parts.",
  },
  {
    title: "Worship",
    verse: "Psalm 100:2",
    body: "Joyful, unembarrassed worship — so that praising God is something they associate with gladness.",
  },
  {
    title: "Bible reading",
    verse: "2 Timothy 3:16–17",
    body: "Scripture is alive and is their guide for truth and right living. We make daily reading something they want to do.",
  },
];

const PROGRAMMES = [
  {
    title: "Vacation Bible School",
    body: "A week of teaching, games and worship built around one big idea from Scripture.",
  },
  {
    title: "Back to School",
    body: "Sending our children into a new school year prayed for, supplied and encouraged.",
  },
  {
    title: "Hallelujah Night",
    body: "A safe, joyful alternative on the night the rest of the city does something else.",
  },
  {
    title: "Christmas Production",
    body: "Our children tell the Christmas story themselves, on stage, to the whole house.",
  },
];

export default function ChildrenPage() {
  return (
    <main className="overflow-hidden">
      <PublicNav />

      <section className="border-b border-[var(--line)] bg-[var(--forest-deep)] py-20 text-white md:py-28">
        <div className="page-shell">
          <span className="text-xs font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">
            Children Ministry
          </span>
          <h1 className="display mt-7 max-w-3xl text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.9] font-medium tracking-[-0.05em]">
            Raising <span className="italic text-[var(--sun-soft)]">spirit-filled children</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/72">
            Kids who know God, love His Word and walk in His ways — nurtured here every Sunday, with
            child care available at every service.
          </p>
        </div>
      </section>

      <section className="bg-[var(--paper-light)] py-24 md:py-32">
        <div className="page-shell grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <span className="eyebrow">Our calling</span>
            <h2 className="display mt-6 max-w-lg text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
              This is not just what we do. It is who we are.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--ink-soft)]">
              At the heart of our children&rsquo;s ministry is a joyful commitment to raising
              spirit-filled children. That journey starts with nurturing their faith, shaping their
              hearts with biblical truth, and encouraging a personal relationship with Jesus.
            </p>
            <Link href="/contact" className="button-quiet mt-6 !px-0">
              Ask about Sundays <ArrowRight size={16} />
            </Link>
          </div>

          {/*
            Scripture rather than a photograph. There is no photography of the
            children's ministry yet, and a stock image of adults would caption
            this page with people it is not about.
          */}
          <figure className="rounded-[2rem] border-l-4 border-[var(--sun)] bg-[var(--paper)] p-9 md:p-11">
            <blockquote className="display text-3xl leading-tight font-medium tracking-[-0.02em] md:text-4xl">
              &ldquo;Train up a child in the way he should go, and when he is old he will not depart
              from it.&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-xs font-extrabold tracking-[0.12em] text-[var(--ink-soft)] uppercase">
              Proverbs 22:6
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-[var(--line)] py-24 md:py-32">
        <div className="page-shell">
          <span className="eyebrow">What guides us</span>
          <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
            Three things we are deliberate about.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {VALUES.map((item) => (
              <article key={item.title} className="min-h-60 bg-[var(--paper-light)] p-8 md:p-9">
                <h3 className="display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs font-extrabold tracking-[0.1em] text-[var(--clay)] uppercase">
                  {item.verse}
                </p>
                <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="page-shell">
          <span className="eyebrow">Habits we build</span>
          <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
            Prayer, worship, and the Word — every week.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--line)] md:grid-cols-3">
            {HABITS.map((item) => (
              <article key={item.title} className="min-h-56 bg-[var(--paper-light)] p-8 md:p-9">
                <h3 className="display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-xs font-extrabold tracking-[0.1em] text-[var(--clay)] uppercase">
                  {item.verse}
                </p>
                <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--forest-deep)] py-24 text-white md:py-32">
        <div className="page-shell">
          <span className="text-xs font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">
            Through the year
          </span>
          <h2 className="display mt-6 max-w-2xl text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
            The moments our children look forward to.
          </h2>
          <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {PROGRAMMES.map((item) => (
              <article key={item.title} className="min-h-52 bg-[var(--forest-deep)] p-8">
                <h3 className="display text-2xl font-semibold">{item.title}</h3>
                <p className="mt-4 text-sm leading-7 text-white/68">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
