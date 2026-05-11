const { PrismaClient } = require("@prisma/client")
const { PrismaLibSql } = require("@prisma/adapter-libsql")

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ 
    url: process.env.DATABASE_URL || "file:./dev.db",
    authToken: process.env.DATABASE_AUTH_TOKEN
  })
})

async function cleanupOldQuotes() {
  try {
    console.log("Fetching all quotes...")
    const allQuotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" }
    })

    console.log(`Total quotes: ${allQuotes.length}`)

    if (allQuotes.length <= 5) {
      console.log("Only 5 or fewer quotes, nothing to delete")
      return
    }

    // Behalte die letzten 5
    const quotesToDelete = allQuotes.slice(5)
    console.log(`Deleting ${quotesToDelete.length} old quotes...`)

    for (const quote of quotesToDelete) {
      await prisma.quoteRequest.delete({
        where: { id: quote.id }
      })
      console.log(`Deleted: ${quote.name} (${quote.type})`)
    }

    console.log("✅ Cleanup complete")
  } catch (error) {
    console.error("❌ Cleanup failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

cleanupOldQuotes()
