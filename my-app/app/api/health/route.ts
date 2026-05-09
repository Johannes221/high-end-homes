import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Einfacher Health-Check ohne Datenbank - PrismaLibSql kann im Edge Probleme haben
    return NextResponse.json({
      ok: true,
      service: "high-end-homes-backend",
      database: "skipped",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        ok: false,
        service: "high-end-homes-backend",
        database: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
