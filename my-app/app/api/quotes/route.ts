import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { estimatePriceRange, evaluateComplexity, parsePersistedQuotePayload, resolveQuotePricing } from "@/lib/quote"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function serializeQuote(quote: {
  id: string
  type: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  squareMeters: number
  buildingType: string | null
  constructionYear: string | null
  floor: string | null
  elevator: string | null
  materialsJson: string
  removalItemsJson: string
  quantityEstimate: string | null
  valuables: string | null
  asbestosRequired: boolean
  otherPollutants: boolean
  disposalWanted: boolean
  permitStatus: string | null
  desiredDate: string | null
  imageFileNamesJson: string
  imagesBase64Json: string
  notes: string | null
  complexityScore: number
  complexityLevel: string
  effortRange: string
  complexityFlagsJson: string
  estimatedMinPrice: number
  estimatedMaxPrice: number
  approvalStatus: string
  approvedAt: Date | null
  approvedBy: string | null
  sharedAt: Date | null
  payloadJson: string
  createdAt: Date
  updatedAt: Date
}, includeImages = false) {
  const payload = parsePersistedQuotePayload(quote.payloadJson)
  const complexity = evaluateComplexity(payload)
  const estimate = estimatePriceRange(payload, complexity)
  const pricingSummary = resolveQuotePricing(payload, payload.pricing)

  return {
    ...quote,
    complexityScore: complexity.score,
    complexityLevel: complexity.level,
    effortRange: complexity.effortRange,
    estimatedMinPrice: estimate.min,
    estimatedMaxPrice: estimate.max,
    materials: JSON.parse(quote.materialsJson),
    removalItems: JSON.parse(quote.removalItemsJson),
    imageFileNames: JSON.parse(quote.imageFileNamesJson),
    imagesBase64: includeImages ? JSON.parse(quote.imagesBase64Json) : [],
    complexityFlags: complexity.flags,
    payload,
    pricing: payload.pricing ?? { lineItemOverrides: [], internalNotes: "", exportedAt: null },
    pricingSummary,
  }
}

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    // Timeout für Datenbankabfrage
    const quotes = await Promise.race([
      prisma.quoteRequest.findMany({
        orderBy: { createdAt: "desc" },
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Datenbank Timeout - DATABASE_URL fehlt auf Render.com")), 5000)
      )
    ]) as any[]

    return NextResponse.json({
      success: true,
      quotes: quotes.map((quote) => serializeQuote(quote, false)),
    })
  } catch (error) {
    console.error("Quotes API error:", error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Anfragen konnten nicht geladen werden.",
      needsDatabaseConfig: true
    }, { status: 500 })
  }
}
