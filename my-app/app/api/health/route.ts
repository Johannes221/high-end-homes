import { NextResponse } from "next/server"

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return new NextResponse("OK", { status: 200 })
  } catch (error) {
    console.error("Health check failed:", error)
    return new NextResponse("ERROR", { status: 500 })
  }
}
