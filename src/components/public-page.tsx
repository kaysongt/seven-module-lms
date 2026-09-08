import { CinematicHome } from "@/components/cinematic-home";
import { CinematicInformationPage, CinematicLocationHome } from "@/components/location-site";
import type { PublicContext } from "@/lib/locations";

export type PublicPageName = "home" | "about" | "contact" | "children";

export function PublicPage({ context, page }: { context: PublicContext; page: PublicPageName }) {
  if (page === "home") return context.location ? <CinematicLocationHome context={context} /> : <CinematicHome context={context} />;
  return <CinematicInformationPage context={context} page={page} />;
}
