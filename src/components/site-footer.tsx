import Link from "next/link";
import { Brand } from "@/components/brand";
import { getPublicContext } from "@/lib/public-context";
import { LOCATIONS, localHref, locationHref, NETWORK, phoneHref, type PublicContext } from "@/lib/locations";

export async function SiteFooter({ context: supplied }: { context?: PublicContext } = {}) {
  const context = supplied ?? await getPublicContext();
  const { location } = context;
  return (
    <footer className="bg-[var(--forest-deep)] text-white">
      <div className="page-shell grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <Brand href={localHref(context)} inverted name={location ? `KingsWord ${location.name}` : NETWORK.name} tagline={location?.tagline ?? NETWORK.tagline} />
          <p className="mt-6 max-w-md text-base leading-7 text-white/75">{location?.description ?? NETWORK.description}</p>
          {location?.email && <a className="mt-4 block break-all text-sm" href={`mailto:${location.email}`}>{location.email}</a>}
          {location?.congregations.length === 1 && <a className="mt-3 block text-sm" href={phoneHref(location.congregations[0].phone)}>{location.congregations[0].phone}</a>}
        </div>
        <nav className="grid content-start gap-3 text-sm" aria-label="Locations in footer">
          <p className="mb-2 font-bold text-[var(--sun-soft)]">KingsWord everywhere</p>
          {LOCATIONS.map((item) => <Link key={item.slug} href={locationHref(item, context.customDomain)}>{item.name}</Link>)}
        </nav>
        <nav className="grid content-start gap-3 text-sm" aria-label="Footer navigation">
          <p className="mb-2 font-bold text-[var(--sun-soft)]">Your next step</p>
          <Link href={localHref(context, "about")}>About us</Link>
          <Link href={location ? localHref(context, "#visit") : "/locations"}>Plan a visit</Link>
          {location && <Link href={localHref(context, "children")}>Children’s ministry</Link>}
          <Link href="/believers-training">Believers Training</Link>
          <Link href="/login">Student login</Link>
          <Link href={localHref(context, "contact")}>Contact</Link>
          <Link href="/privacy">Privacy</Link>
          {location?.giveUrl && <a href={location.giveUrl} target="_blank" rel="noopener noreferrer">Give online</a>}
        </nav>
      </div>
      <div className="border-t border-white/15"><div className="page-shell py-6 text-sm text-white/65">© {new Date().getFullYear()} {location ? `KingsWord ${location.name}` : "KingsWord Ministries International"}</div></div>
    </footer>
  );
}
