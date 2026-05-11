import { NextResponse } from "next/server"
import { execSync } from "child_process"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Secret aus Environment Variable
const SYNC_SECRET = process.env.DB_SYNC_SECRET || "default-secret-change-in-production"

export async function POST(request: Request) {
  // Secret aus Header prüfen
  const authHeader = request.headers.get("x-sync-secret")
  if (authHeader !== SYNC_SECRET) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    )
  }

  try {
    console.log("Starting database schema sync...")
    
    // Prisma db push ausführen
    execSync("npx prisma db push", {
      stdio: "inherit",
      cwd: process.cwd()
    })
    
    console.log("Database schema synced successfully")
    
    return NextResponse.json({
      success: true,
      message: "Database schema synced successfully"
    })
  } catch (error) {
    console.error("Failed to sync database:", error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
}
