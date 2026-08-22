import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Brand } from "@/components/brand";
import { LoginForm } from "@/app/login/login-form";

export const metadata: Metadata = { title: "Student login" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return (
    <main className="grid min-h-screen lg:grid-cols-[0.82fr_1.18fr]">
      <section className="flex flex-col bg-[var(--paper-light)] p-6 md:p-10 lg:p-14">
        <div className="flex items-center justify-between"><Brand /><Link href="/" className="button-quiet"><ArrowLeft size={16} /> Home</Link></div>
        <div className="my-auto w-full max-w-md self-center py-16">
          <span className="eyebrow">Student portal</span>
          <h1 className="display mt-6 text-6xl leading-[0.9] font-medium tracking-[-0.05em]">Welcome back.</h1>
          <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">Return to your next lesson, module conversation, or checkpoint.</p>
          <div className="mt-9"><LoginForm next={next} /></div>
        </div>
      </section>
      <section className="relative hidden overflow-hidden bg-[var(--forest-deep)] p-14 text-white lg:block">
        <div className="absolute top-[-12rem] right-[-10rem] h-[38rem] w-[38rem] rounded-full border-[5rem] border-[var(--sun)]/15" />
        <div className="absolute bottom-20 left-14 grid grid-cols-7 gap-2" aria-hidden="true">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => <span key={step} className="w-8 rounded-full bg-[var(--sun)]/80" style={{ height: `${step * 24}px` }} />)}
        </div>
        <div className="relative flex h-full max-w-2xl flex-col justify-between">
          <span className="text-xs font-extrabold tracking-[0.2em] text-[var(--sun-soft)] uppercase">Continue the work</span>
          <blockquote className="display mb-40 text-5xl leading-[1.02] font-medium italic">“A path becomes clear by walking it with attention.”</blockquote>
        </div>
      </section>
    </main>
  );
}
