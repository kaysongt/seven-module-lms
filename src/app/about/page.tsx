import { PublicPage } from "@/components/public-page";
import { getPublicContext, publicMetadata } from "@/lib/public-context";

export async function generateMetadata() {
  return publicMetadata(await getPublicContext(), "About");
}

export default async function Page() {
  return <PublicPage context={await getPublicContext()} page="about" />;
}
