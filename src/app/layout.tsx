import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/site-config";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: `${SITE_CONFIG.name} | ${SITE_CONFIG.organization}`,
    template: `%s | ${SITE_CONFIG.shortName}`,
  },
  description: SITE_CONFIG.description,
  openGraph: {
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
