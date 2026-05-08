import { NextResponse } from "next/server"

import { prisma } from "@/lib/prisma"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await prisma.$queryRawUnsafe("SELECT 1")

    return NextResponse.json({
      ok: true,
      service: "high-end-homes-backend",
      database: "ok",
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
