import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { canReadMinistryFile } from "@/lib/ministry-policy";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
  Vary: "Cookie",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user)
    return new Response("Please sign in through Ministers Login.", {
      status: 401,
      headers: privateHeaders,
    });
  const { id } = await context.params;
  const profile = await db.ministerProfile.findUnique({
    where: { userId: user.id },
    select: { status: true, clearance: true },
  });
  const file = await db.ministryFile.findUnique({
    where: { id },
    select: { status: true, clearance: true, fileName: true, mimeType: true },
  });
  // The same response for missing and inaccessible files avoids revealing private metadata.
  if (!file || !canReadMinistryFile(user, profile, file))
    return new Response("Document not available.", {
      status: 404,
      headers: privateHeaders,
    });
  const content = await db.ministryFileContent.findUnique({
    where: { fileId: id },
    select: { data: true },
  });
  if (!content)
    return new Response("Document not available.", {
      status: 404,
      headers: privateHeaders,
    });
  await db.auditLog.create({
    data: {
      actorId: user.id,
      action: "ministry_file.downloaded",
      entityType: "MinistryFile",
      entityId: id,
    },
  });
  return new Response(new Uint8Array(content.data), {
    headers: {
      ...privateHeaders,
      "Content-Type": file.mimeType,
      "Content-Disposition": `attachment; filename="document.${file.fileName.split(".").pop()}"; filename*=UTF-8''${encodeURIComponent(file.fileName).replace(/['()*]/g, (c) => `%${c.charCodeAt(0).toString(16)}`)}`,
      "Content-Length": String(content.data.byteLength),
    },
  });
}
