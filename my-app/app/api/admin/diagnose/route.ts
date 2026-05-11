import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const results = {
    timestamp: new Date().toISOString(),
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      databaseUrlPrefix: process.env.DATABASE_URL?.substring(0, 50),
      hasDatabaseAuthToken: !!process.env.DATABASE_AUTH_TOKEN,
    },
    database: {
      connectionTest: false,
      error: null as string | null,
      quoteCount: 0,
      sampleQuote: null as any,
    }
  }

  try {
    // Teste Verbindung
    console.log("Testing database connection...")
    
    // Zähle Anfragen mit Timeout
    const count = await Promise.race([
      prisma.quoteRequest.count(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout after 10s")), 10000)
      )
    ]) as number
    
    results.database.connectionTest = true
    results.database.quoteCount = count
    
    // Hole eine Beispiel-Anfrage
    if (count > 0) {
      const sample = await prisma.quoteRequest.findFirst({
        select: {
          id: true,
          type: true,
          name: true,
          email: true,
          createdAt: true,
        }
      })
      results.database.sampleQuote = sample
    }
    
    return NextResponse.json(results)
  } catch (error) {
    console.error("Diagnose error:", error)
    results.database.error = error instanceof Error ? error.message : String(error)
    return NextResponse.json(results, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
