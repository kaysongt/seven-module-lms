import type { Metadata } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/manrope";
import "./globals.css";
import { NETWORK } from "@/lib/locations";
import { getAppUrl } from "@/lib/app-url";

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: {
    default: NETWORK.name,
    template: `%s | KingsWord`,
  },
  description: NETWORK.description,
  openGraph: {
    title: NETWORK.name,
    description: NETWORK.description,
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
