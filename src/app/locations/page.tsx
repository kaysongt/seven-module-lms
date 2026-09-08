import { LocationsPage } from "@/components/network-pages";
import { getPublicContext } from "@/lib/public-context";

export const metadata = { title: "Our locations", description: "Find KingsWord in Chicago, Nigeria, Calgary, Dallas and London." };

export default async function Page() {
  return <LocationsPage context={await getPublicContext()} />;
}
