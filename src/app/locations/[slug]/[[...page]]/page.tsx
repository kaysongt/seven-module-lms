import { notFound } from "next/navigation";
import { PublicPage, type PublicPageName } from "@/components/public-page";
import { locationBySlug, type PublicContext } from "@/lib/locations";
import { publicMetadata } from "@/lib/public-context";

type Props = { params: Promise<{ slug: string; page?: string[] }> };

async function resolvePage(params: Props["params"]) {
  const { slug, page: segments = [] } = await params;
  const location = locationBySlug(slug);
  const page = segments[0] ?? "home";
  if (!location || segments.length > 1 || !["home", "about", "contact", "children"].includes(page) || segments[0] === "home") notFound();
  const context: PublicContext = { location, basePath: `/locations/${location.slug}`, customDomain: false };
  return { context, page: page as PublicPageName };
}

export async function generateMetadata({ params }: Props) {
  const { context, page } = await resolvePage(params);
  return publicMetadata(context, { home: "", about: "About", contact: "Contact", children: "Children’s ministry" }[page]);
}

export default async function Page({ params }: Props) {
  const { context, page } = await resolvePage(params);
  return <PublicPage context={context} page={page} />;
}
