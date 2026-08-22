import Link from "next/link";
import { ArrowRight, BookCopy, ClipboardCheck, FileText, MessageSquareText, UsersRound } from "lucide-react";
import { AdminHeader, StatusBadge } from "@/components/admin-ui";
import { requireStaff } from "@/lib/auth";
import { db } from "@/lib/db";
import { SITE_CONFIG } from "@/lib/site-config";

export default async function AdminPage() {
  await requireStaff();
  const program = await db.program.findUnique({ where: { slug: SITE_CONFIG.slug }, select: { id: true, name: true } });
  const programId = program?.id ?? "";
  const [pendingApplications, activeStudents, pendingSubmissions, visiblePosts, latestApplications] = await Promise.all([
    db.application.count({ where: { programId, status: "PENDING" } }),
    db.enrollment.count({ where: { programId, status: { in: ["ACTIVE", "COMPLETED"] } } }),
    db.assignmentSubmission.count({ where: { status: "SUBMITTED" } }),
    db.discussionPost.count({ where: { module: { programId }, status: "VISIBLE" } }),
    db.application.findMany({ where: { programId }, orderBy: { createdAt: "desc" }, take: 5 }),
  ]);
  const metrics = [
    { label: "Pending applications", value: pendingApplications, icon: FileText, href: "/admin/applications" },
    { label: "Active students", value: activeStudents, icon: UsersRound, href: "/admin/students" },
    { label: "Awaiting review", value: pendingSubmissions, icon: ClipboardCheck, href: "/admin/submissions" },
    { label: "Community posts", value: visiblePosts, icon: MessageSquareText, href: "/admin/community" },
  ];
  return <div className="mx-auto max-w-[1320px] px-4 py-9 md:px-8 md:py-12 xl:px-12"><AdminHeader eyebrow="Program operations" title="Admin overview" description={`A live view of admissions, enrollment, learning activity, and curriculum for ${program?.name ?? SITE_CONFIG.name}.`} action={<Link href="/admin/curriculum" className="button-primary"><BookCopy size={16} /> Edit curriculum</Link>} /><section className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{metrics.map(({ label, value, icon: Icon, href }) => <Link key={label} href={href} className="rounded-2xl border border-black/10 bg-white/65 p-5 no-underline transition hover:-translate-y-1 hover:shadow-lg"><Icon size={20} className="text-[var(--clay)]" /><strong className="display mt-8 block text-5xl font-semibold">{value}</strong><span className="mt-2 flex items-center justify-between text-xs font-extrabold text-[var(--ink-soft)]">{label}<ArrowRight size={14} /></span></Link>)}</section><section className="mt-12"><div className="flex items-end justify-between gap-4"><div><span className="text-[0.65rem] font-extrabold tracking-[0.15em] text-[var(--clay)] uppercase">Admissions</span><h2 className="display mt-2 text-3xl font-semibold">Newest applications</h2></div><Link href="/admin/applications" className="button-quiet">View all <ArrowRight size={15} /></Link></div><div className="mt-5 overflow-x-auto rounded-2xl border border-black/10 bg-white/65"><table className="w-full min-w-[680px] text-left text-sm"><thead className="border-b border-black/8 text-[0.62rem] font-extrabold tracking-[0.13em] text-[var(--ink-soft)]/60 uppercase"><tr><th className="p-4">Applicant</th><th className="p-4">Country</th><th className="p-4">Submitted</th><th className="p-4">Status</th></tr></thead><tbody>{latestApplications.map((application) => <tr key={application.id} className="border-b border-black/6 last:border-0"><td className="p-4"><strong className="block">{application.fullName}</strong><span className="mt-1 block text-xs text-[var(--ink-soft)]/60">{application.email}</span></td><td className="p-4 text-[var(--ink-soft)]">{application.country}</td><td className="p-4 text-xs text-[var(--ink-soft)]/65">{application.createdAt.toLocaleDateString()}</td><td className="p-4"><StatusBadge tone={application.status === "PENDING" ? "warn" : application.status === "APPROVED" ? "good" : "neutral"}>{application.status}</StatusBadge></td></tr>)}</tbody></table></div></section></div>;
}
