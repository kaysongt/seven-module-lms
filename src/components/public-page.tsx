import ChicagoHome from "@/components/chicago/home";
import ChicagoAbout from "@/components/chicago/about";
import ChicagoContact from "@/components/chicago/contact";
import ChicagoChildren from "@/components/chicago/children";
import { InformationPage, LocationHome, NetworkHome } from "@/components/network-pages";
import type { PublicContext } from "@/lib/locations";

export type PublicPageName = "home" | "about" | "contact" | "children";

export function PublicPage({ context, page }: { context: PublicContext; page: PublicPageName }) {
  if (context.location?.slug === "chicago") {
    const Component = { home: ChicagoHome, about: ChicagoAbout, contact: ChicagoContact, children: ChicagoChildren }[page];
    return <Component context={context} />;
  }
  if (page === "home") return context.location ? <LocationHome context={context} /> : <NetworkHome context={context} />;
  return <InformationPage context={context} page={page} />;
}
