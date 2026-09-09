import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminHeader, AdminEmpty } from "@/components/admin-ui";
import { fileSizeLabel } from "@/lib/ministry-policy";
import { MinistryFileForm } from "./file-form";

export default async function AdminMinistryFilesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const q = (await searchParams).q?.trim().slice(0, 160) ?? "";
  const files = await db.ministryFile.findMany({
    where: q ? { title: { contains: q, mode: "insensitive" } } : {},
    include: { uploadedBy: { select: { fullName: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return (
    <div className="mx-auto max-w-[1200px] px-4 py-10 md:px-8">
      <AdminHeader
        eyebrow="Private ministry library"
        title="Ministry files"
        description="Upload documents, set the required clearance and publish them to approved ministers."
        action={
          <Link className="button-secondary" href="/admin/ministers">
            Manage ministers
          </Link>
        }
      />
      <section className="my-8 rounded-2xl border border-black/10 bg-white p-6">
        <h2 className="mb-5 text-2xl font-extrabold">Add a document</h2>
        <MinistryFileForm />
      </section>
      <form className="my-8 flex flex-wrap items-end gap-4">
        <div className="field min-w-52 flex-1">
          <label htmlFor="file-search">Search document titles</label>
          <input id="file-search" name="q" defaultValue={q} maxLength={160} />
        </div>
        <button className="button-primary">Search</button>
      </form>
      <div className="grid gap-5">
        {!files.length && (
          <AdminEmpty>No documents have been added to this view.</AdminEmpty>
        )}
        {files.map((file) => (
          <article
            key={file.id}
            className="rounded-2xl border border-black/10 bg-white p-6"
          >
            <div className="mb-6 flex flex-wrap justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold">{file.title}</h2>
                <p className="mt-2 break-all text-sm text-[#42566d]">
                  {file.fileName} · {fileSizeLabel(file.byteSize)} · Uploaded by{" "}
                  {file.uploadedBy.fullName}
                </p>
              </div>
              <a
                className="button-secondary"
                href={`/ministers/files/${file.id}`}
              >
                Download original
              </a>
            </div>
            <MinistryFileForm
              file={{
                id: file.id,
                version: file.version,
                title: file.title,
                description: file.description,
                clearance: file.clearance,
                status: file.status,
              }}
            />
          </article>
        ))}
      </div>
      {files.length === 100 && (
        <p className="mt-6 text-sm">
          Showing the first 100 documents. Search for a title to narrow the
          list.
        </p>
      )}
    </div>
  );
}
