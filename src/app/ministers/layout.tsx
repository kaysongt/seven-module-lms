import type { Metadata } from "next";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import "./ministers.css";

export const metadata: Metadata = {
  title: "Ministers Portal",
  robots: { index: false, follow: false },
};

export default function MinistersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="kw-site">
      <PublicNav />
      <main id="main-content" className="ministry-main">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
