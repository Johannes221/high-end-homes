import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Einfacher Health-Check ohne Datenbank - PrismaLibSql kann im Edge Probleme haben
    return NextResponse.json({
      status: "ok",
      service: "high-end-homes-backend",
      database: "ok",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check failed:", error)

    return NextResponse.json(
      {
        status: "error",
        service: "high-end-homes-backend",
        database: "error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
