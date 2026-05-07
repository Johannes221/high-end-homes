import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { estimatePriceRange, evaluateComplexity, parsePersistedQuotePayload, resolveQuotePricing } from "@/lib/quote"

function serializeQuote(quote: {
  id: string
  type: string
  name: string
  email: string
  phone: string | null
  company: string | null
  address: string | null
  squareMeters: number
  buildingType: string
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
}) {
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
    imagesBase64: JSON.parse(quote.imagesBase64Json),
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

    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      quotes: quotes.map((quote: (typeof quotes)[number]) => serializeQuote(quote)),
    })
  } catch (error) {
    console.error("Quotes API error:", error)
    return NextResponse.json({ success: false, error: "Anfragen konnten nicht geladen werden." }, { status: 500 })
  }
}
