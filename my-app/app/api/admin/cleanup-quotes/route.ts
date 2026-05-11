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
    
    // Alle Anfragen laden
    const allQuotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" }
    })

    console.log(`Total quotes in production: ${allQuotes.length}`)

    if (allQuotes.length <= 5) {
      return NextResponse.json({
        success: true,
        message: "Only 5 or fewer quotes, nothing to delete",
        deletedCount: 0,
        remainingCount: allQuotes.length
      })
    }

    // Behalte die letzten 5
    const quotesToDelete = allQuotes.slice(5)
    console.log(`Deleting ${quotesToDelete.length} old quotes from production...`)

    for (const quote of quotesToDelete) {
      await prisma.quoteRequest.delete({
        where: { id: quote.id }
      })
      console.log(`Deleted: ${quote.name} (${quote.type})`)
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${quotesToDelete.length} old quotes, keeping last 5`,
      deletedCount: quotesToDelete.length,
      remainingCount: 5
    })
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
