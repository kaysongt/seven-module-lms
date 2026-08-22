import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/print-button";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";

export default async function CertificatePage() {
  const user = await requireUser();
  const certificate = await db.certificate.findFirst({
    where: { studentId: user.id, program: { slug: SITE_CONFIG.slug } },
    include: { program: true, issuedBy: { select: { fullName: true } } },
  });
  if (!certificate) notFound();
  return <div className="min-h-screen bg-[#e7e2d6] px-4 py-10 print:bg-white print:p-0"><div className="mx-auto mb-5 flex max-w-5xl items-center justify-between print:hidden"><Link href="/dashboard" className="button-secondary"><ArrowLeft size={15} /> Dashboard</Link><PrintButton /></div><article className="relative mx-auto aspect-[1.414/1] w-full max-w-5xl overflow-hidden border-[14px] border-double border-[var(--forest-deep)] bg-[var(--paper-light)] p-[6%] text-center shadow-2xl print:h-screen print:max-w-none print:shadow-none"><div className="absolute inset-5 border border-[var(--sun)]" aria-hidden="true" /><div className="relative flex h-full flex-col items-center justify-center"><span className="text-[clamp(.55rem,1.2vw,.85rem)] font-extrabold tracking-[0.24em] text-[var(--clay)] uppercase">{certificate.program.certificateLabel}</span><h1 className="display mt-[4%] text-[clamp(2.4rem,7vw,6rem)] leading-none font-medium tracking-[-0.05em]">{certificate.program.name}</h1><p className="mt-[4%] text-[clamp(.7rem,1.5vw,1.1rem)] text-[var(--ink-soft)]">This certifies that</p><h2 className="display mt-[1.5%] border-b border-[var(--sun)] px-[5%] pb-[1%] text-[clamp(2rem,5vw,4.5rem)] font-semibold italic">{user.fullName}</h2><p className="mt-[3%] max-w-2xl text-[clamp(.65rem,1.25vw,1rem)] leading-relaxed text-[var(--ink-soft)]">has completed all seven modules, required lessons, and learning checkpoints.</p><div className="mt-[5%] grid w-full max-w-2xl grid-cols-3 gap-4 text-[clamp(.5rem,1vw,.75rem)]"><div><strong className="block border-b border-[var(--line)] pb-2">{certificate.issuedAt.toLocaleDateString()}</strong><span className="mt-2 block uppercase tracking-wider">Date issued</span></div><div><strong className="block border-b border-[var(--line)] pb-2">{certificate.issuedBy.fullName}</strong><span className="mt-2 block uppercase tracking-wider">Authorized by</span></div><div><strong className="block border-b border-[var(--line)] pb-2">{certificate.serial}</strong><span className="mt-2 block uppercase tracking-wider">Certificate ID</span></div></div></div></article></div>;
}
