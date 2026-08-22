import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "connected", checkedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json({ status: "degraded", database: "unavailable", checkedAt: new Date().toISOString() }, { status: 503 });
  }
}
