import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Readiness includes both private files and student video progress.
    await Promise.all([
      db.$queryRaw`SELECT "id" FROM "MinistryFile" LIMIT 0`,
      db.$queryRaw`SELECT "lessonId" FROM "VideoProgress" LIMIT 0`,
    ]);
    return NextResponse.json({
      status: "ok",
      database: "connected",
      checkedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "degraded",
        database: "unavailable",
        checkedAt: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
