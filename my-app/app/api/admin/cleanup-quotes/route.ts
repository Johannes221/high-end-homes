import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CLEANUP_SECRET = process.env.CLEANUP_SECRET || "default-secret-change-in-production"

export async function POST(request: Request) {
  // Secret aus Header prüfen
  const authHeader = request.headers.get("x-cleanup-secret")
  if (authHeader !== CLEANUP_SECRET) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    console.log("Starting production cleanup - keep last 5 quotes...")
    
    // Timeout für den gesamten Vorgang
    const result = await Promise.race([
      (async () => {
        // Alle Anfragen laden mit Timeout
        const allQuotes = await Promise.race([
          prisma.quoteRequest.findMany({
            orderBy: { createdAt: "desc" }
          }),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error("Database query timeout")), 10000)
          )
        ]) as any[]

        console.log(`Total quotes in production: ${allQuotes.length}`)

        if (allQuotes.length <= 5) {
          return {
            success: true,
            message: "Only 5 or fewer quotes, nothing to delete",
            deletedCount: 0,
            remainingCount: allQuotes.length
          }
        }

        // Behalte die letzten 5
        const quotesToDelete = allQuotes.slice(5)
        console.log(`Deleting ${quotesToDelete.length} old quotes from production...`)

        // Lösche mit Timeout pro Anfrage
        let deletedCount = 0
        for (const quote of quotesToDelete) {
          await Promise.race([
            prisma.quoteRequest.delete({ where: { id: quote.id } }),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error("Delete timeout")), 5000)
            )
          ])
          console.log(`Deleted: ${quote.name} (${quote.type})`)
          deletedCount++
        }

        return {
          success: true,
          message: `Deleted ${deletedCount} old quotes, keeping last 5`,
          deletedCount,
          remainingCount: 5
        }
      })(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Overall cleanup timeout (30s)")), 30000)
      )
    ])

    return NextResponse.json(result)
  } catch (error) {
    console.error("Production cleanup failed:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
