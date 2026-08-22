import type { Metadata } from "next";
import { PublicNav } from "@/components/public-nav";
import { SiteFooter } from "@/components/site-footer";
import { SITE_CONFIG } from "@/lib/site-config";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <main>
      <PublicNav />
      <article className="page-shell max-w-4xl py-20 md:py-28">
        <span className="eyebrow">Privacy notice</span>
        <h1 className="display mt-6 text-6xl font-medium tracking-[-0.05em]">Your information deserves careful handling.</h1>
        <div className="prose-course mt-12">
          <h2>Information we collect</h2><p>We collect application, account, enrollment, learning progress, assessment, assignment, and discussion information needed to administer the program.</p>
          <h2>How it is used</h2><p>Authorized program staff use this information to review applications, provide access, support learning, assess completion, moderate discussions, and maintain academic records. We do not sell student information.</p>
          <h2>Retention and choices</h2><p>Records are retained for as long as needed to provide the program, maintain academic records, secure the service, and meet applicable obligations. You may request access, correction, or deletion, subject to legitimate academic, security, financial, or legal retention needs.</p>
          <h2>Security</h2><p>The platform uses restricted staff roles, one-time invitations, hashed passwords, server-side authorization, and encrypted production connections. No internet service can guarantee absolute security.</p>
          <h2>Contact</h2><p>For privacy or account questions, email <a href={`mailto:${SITE_CONFIG.supportEmail}`} className="font-bold underline">{SITE_CONFIG.supportEmail}</a>.</p>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
