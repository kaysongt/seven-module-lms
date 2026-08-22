import type { Metadata } from "next";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { ActivationForm } from "@/app/activate/[token]/activation-form";
import { db } from "@/lib/db";
import { hashToken } from "@/lib/tokens";

export const metadata: Metadata = { title: "Activate account" };

export default async function ActivationPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const invitation = await db.invitation.findUnique({
    where: { tokenHash: hashToken(token) },
    select: { acceptedAt: true, expiresAt: true },
  });
  const isAvailable = Boolean(invitation && !invitation.acceptedAt && invitation.expiresAt > new Date());

  return (
    <main className="min-h-screen bg-[var(--forest-deep)] px-4 py-10">
      <div className="mx-auto w-full max-w-xl rounded-[2rem] bg-[var(--paper-light)] p-7 shadow-2xl md:p-11">
        <Brand />
        <span className="eyebrow mt-12">Private invitation</span>
        {isAvailable ? (
          <>
            <h1 className="display mt-6 text-5xl leading-[0.95] font-medium">Create your student account.</h1>
            <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">Choose a secure password to activate your enrollment and enter the learning space.</p>
            <div className="mt-8"><ActivationForm token={token} /></div>
          </>
        ) : (
          <>
            <h1 className="display mt-6 text-5xl leading-[0.95] font-medium">This link is no longer available.</h1>
            <p className="mt-5 text-sm leading-7 text-[var(--ink-soft)]">Activation links can be used only once and expire after seven days. Sign in if your account is already active, or ask the program team for a new invitation.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/login" className="button-primary">Sign in</Link>
              <Link href="/apply" className="button-secondary">Contact admissions</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
