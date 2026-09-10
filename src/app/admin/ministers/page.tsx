import Link from "next/link";
import type { MinisterStatus } from "@prisma/client";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminHeader, AdminEmpty } from "@/components/admin-ui";
import { clearanceLabel } from "@/lib/ministry-policy";
import { MinisterReviewForm } from "./review-form";

export default async function AdminMinistersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  await requireAdmin();
  const query = await searchParams;
  const status = ["PENDING", "APPROVED", "DECLINED", "SUSPENDED"].includes(
    query.status ?? "",
  )
    ? (query.status as MinisterStatus)
    : undefined;
  const q = query.q?.trim().slice(0, 160) ?? "";
  const profiles = await db.ministerProfile.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            user: {
              OR: [
                { fullName: { contains: q, mode: "insensitive" } },
                { email: { contains: q, mode: "insensitive" } },
              ],
            },
          }
        : {}),
    },
    include: {
      user: { select: { fullName: true, email: true } },
      reviewedBy: { select: { fullName: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8">
      <AdminHeader
        eyebrow="Minister access"
        title="Ministers"
        description="Verify applications, approve accounts and assign clearance for private ministry documents."
        action={
          <Link href="/admin/ministry-files" className="button-secondary">
            Manage ministry files
          </Link>
        }
      />
      <form className="my-8 flex flex-wrap items-end gap-4">
        <div className="field min-w-52 flex-1">
          <label htmlFor="minister-search">Name or email</label>
          <input
            id="minister-search"
            name="q"
            defaultValue={q}
            maxLength={160}
          />
        </div>
        <div className="field">
          <label htmlFor="minister-status">Status</label>
          <select
            id="minister-status"
            name="status"
            defaultValue={status ?? ""}
          >
            <option value="">All statuses</option>
            {["PENDING", "APPROVED", "DECLINED", "SUSPENDED"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <button className="button-primary">Filter</button>
      </form>
      <div className="grid gap-5">
        {!profiles.length && (
          <AdminEmpty>No minister requests match this view.</AdminEmpty>
        )}
        {profiles.map((profile) => (
          <article
            key={profile.userId}
            className="rounded-2xl border border-black/10 bg-white p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-[#172c45]">
                  {profile.user.fullName}
                </h2>
                <p className="mt-2 text-sm text-[#42566d]">
                  {profile.user.email} · {profile.phone}
                </p>
              </div>
              <span className="rounded-full bg-[#e8f0fe] px-3 py-2 text-sm font-bold text-[#1743ad]">
                {profile.status} · {clearanceLabel(profile.clearance)}
              </span>
            </div>
            <dl className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <dt className="text-sm font-bold">Church / congregation</dt>
                <dd className="mt-1 text-sm text-[#42566d]">
                  {profile.church}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-bold">Ministry role</dt>
                <dd className="mt-1 text-sm text-[#42566d]">
                  {profile.ministryRole}
                </dd>
              </div>
            </dl>
            {profile.requestNote && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#42566d]">
                {profile.requestNote}
              </p>
            )}
            <p className="mt-4 text-xs text-[#42566d]">
              Requested {profile.createdAt.toLocaleDateString("en-GB")}
              {profile.reviewedBy &&
                ` · Last reviewed by ${profile.reviewedBy.fullName}`}
            </p>
            <MinisterReviewForm
              profile={{
                userId: profile.userId,
                version: profile.version,
                status: profile.status,
                clearance: profile.clearance,
                adminNotes: profile.adminNotes,
              }}
            />
          </article>
        ))}
      </div>
      {profiles.length === 100 && (
        <p className="mt-6 text-sm">
          Showing the first 100 results. Filter by status or search for a name.
        </p>
      )}
    </div>
  );
}
