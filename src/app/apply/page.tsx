import type { Metadata } from "next";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { ApplicationForm } from "@/app/apply/application-form";
import { Brand } from "@/components/brand";

export const metadata: Metadata = { title: "Apply", description: "Apply for the seven-module Believers Training program." };

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[var(--paper-light)]">
      <div className="page-shell flex min-h-20 items-center justify-between border-b border-[var(--line)]"><Brand /><Link href="/" className="button-quiet"><ArrowLeft size={16} /> Back home</Link></div>
      <div className="page-shell grid gap-14 py-14 lg:grid-cols-[0.68fr_1.32fr] lg:py-20">
        <div>
          <span className="eyebrow">Application</span>
          <h1 className="display mt-7 text-6xl leading-[0.9] font-medium tracking-[-0.05em] md:text-7xl">Tell us where you are beginning.</h1>
          <p className="mt-7 text-base leading-8 text-[var(--ink-soft)]">A short application helps the team understand your context and prepare the right learning environment.</p>
          <div className="mt-9 flex gap-3 rounded-2xl border border-[var(--line)] bg-[var(--sage-light)]/45 p-5 text-sm leading-6 text-[var(--ink-soft)]"><LockKeyhole className="mt-0.5 shrink-0 text-[var(--forest)]" size={18} /><p>Your information is visible only to authorized program staff and is used for admissions and enrollment.</p></div>
        </div>
        <div className="rounded-[2rem] border border-[var(--line)] bg-white/70 p-6 shadow-[var(--shadow)] md:p-10"><ApplicationForm /></div>
      </div>
    </main>
  );
}
