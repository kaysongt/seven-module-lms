import { ArrowUpRight } from "lucide-react";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import { CHURCH } from "@/lib/church";

export const metadata = {
  title: "Contact",
  description:
    "Questions about a first visit, prayer requests, testimonies — reach KingsWord Chicago by phone, email, or in person on Chicago's West Side.",
};

export default function ContactPage() {
  const { address, services } = CHURCH;

  /**
   * Reaching a person is the point of this page, so the phone number, the email
   * address and the map link come first and are real links. A contact form that
   * posts nowhere would look more finished and help nobody, so the form is
   * deliberately not here yet — see the README.
   */
  const details = [
    { label: "Address", value: `${address.street}, ${address.city}, ${address.state} ${address.postcode}`, href: address.mapUrl, external: true },
    { label: "Telephone", value: CHURCH.phone, href: CHURCH.phoneHref },
    { label: "Email", value: CHURCH.email, href: `mailto:${CHURCH.email}` },
  ];

  return (
    <main className="overflow-hidden">
      <PublicNav />

      <section className="border-b border-[var(--line)] bg-[var(--forest-deep)] py-20 text-white md:py-28">
        <div className="page-shell">
          <span className="text-xs font-extrabold tracking-[0.17em] text-[var(--sun-soft)] uppercase">
            Contact
          </span>
          <h1 className="display mt-7 max-w-3xl text-[clamp(2.8rem,7vw,5.4rem)] leading-[0.9] font-medium tracking-[-0.05em]">
            Tell us you are <span className="italic text-[var(--sun-soft)]">coming</span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/72">
            Questions about a first visit, prayer requests, testimonies, or anything else — someone
            here reads every message.
          </p>
        </div>
      </section>

      <section className="bg-[var(--paper-light)] py-24 md:py-32">
        <div className="page-shell grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <span className="eyebrow">Reach us</span>
            <h2 className="display mt-6 max-w-md text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
              On the West Side.
            </h2>
            <dl className="mt-10 grid">
              {details.map((item) => (
                <div
                  key={item.label}
                  className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-[var(--line)] py-5"
                >
                  <dt className="text-xs font-extrabold tracking-[0.12em] text-[var(--ink-soft)] uppercase">
                    {item.label}
                  </dt>
                  <dd className="text-base leading-7 font-semibold">
                    <a
                      href={item.href}
                      {...(item.external ? { target: "_blank", rel: "noopener" } : {})}
                      className="inline-flex items-start gap-1 hover:text-[var(--forest)]"
                    >
                      {item.value}
                      {item.external && <ArrowUpRight size={14} className="mt-1.5 shrink-0" />}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <span className="eyebrow">When we gather</span>
            <h2 className="display mt-6 max-w-md text-5xl leading-[0.95] font-medium tracking-[-0.04em] md:text-6xl">
              Sundays and Fridays.
            </h2>
            <dl className="mt-10 grid gap-6">
              {services.map((service) => (
                <div
                  key={service.day}
                  className="rounded-[1.6rem] border border-[var(--line)] bg-[var(--paper)] p-7"
                >
                  <dt className="text-xs font-extrabold tracking-[0.14em] text-[var(--ink-soft)] uppercase">
                    {service.day}
                  </dt>
                  <dd className="display mt-1 text-4xl font-semibold">{service.time}</dd>
                  <dd className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">{service.note}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-sm leading-6 text-[var(--ink-soft)]">
              Free parking is available in the lot adjacent to the church.
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
