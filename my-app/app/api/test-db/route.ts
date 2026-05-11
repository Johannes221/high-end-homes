import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Teste Datenbankverbindung
    const count = await prisma.quoteRequest.count()
    
    return NextResponse.json({
      success: true,
      message: "Datenbankverbindung erfolgreich",
      quoteCount: count,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDatabaseAuthToken: !!process.env.DATABASE_AUTH_TOKEN,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20),
      }
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      env: {
        NODE_ENV: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasDatabaseAuthToken: !!process.env.DATABASE_AUTH_TOKEN,
        databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 20),
      }
    }, { status: 500 })
  }
}
