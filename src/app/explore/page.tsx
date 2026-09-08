import { CinematicHome } from "@/components/cinematic-home";
import { getPublicContext } from "@/lib/public-context";

export const metadata = {
  title: { absolute: "Explore the world of KingsWord" },
  description:
    "One Word. One Spirit. Everywhere. Explore our global family and find your KingsWord community.",
};

// Keep the global experience available even when the root serves a local church.
export default async function Page() {
  const { customDomain } = await getPublicContext();
  return <CinematicHome context={{ basePath: "", customDomain }} />;
}
