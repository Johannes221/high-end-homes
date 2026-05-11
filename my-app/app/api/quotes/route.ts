import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  parsePersistedQuotePayload,
  resolveQuotePricing,
} from "@/lib/quote"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    // Abfrage mit payloadJson für lineItems
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        type: true,
        name: true,
        email: true,
        phone: true,
        company: true,
        address: true,
        squareMeters: true,
        buildingType: true,
        constructionYear: true,
        floor: true,
        elevator: true,
        quantityEstimate: true,
        valuables: true,
        asbestosRequired: true,
        otherPollutants: true,
        disposalWanted: true,
        permitStatus: true,
        desiredDate: true,
        imageFileNamesJson: true,
        notes: true,
        complexityScore: true,
        complexityLevel: true,
        effortRange: true,
        estimatedMinPrice: true,
        estimatedMaxPrice: true,
        approvalStatus: true,
        approvedAt: true,
        approvedBy: true,
        sharedAt: true,
        createdAt: true,
        updatedAt: true,
        // Komplexe Felder weglassen für Performance
        materialsJson: false,
        removalItemsJson: false,
        imagesBase64Json: false,
        payloadJson: true,
        complexityFlagsJson: false,
      }
    })

    return NextResponse.json({
      success: true,
      quotes: quotes.map(quote => {
        const payload = parsePersistedQuotePayload(quote.payloadJson)
        const pricingSummary = resolveQuotePricing(payload, payload.pricing)
        return {
          ...quote,
          materials: [],
          removalItems: [],
          imageFileNames: JSON.parse(quote.imageFileNamesJson),
          imagesBase64: [],
          complexityFlags: [],
          payload,
          pricing: payload.pricing ?? { lineItemOverrides: [], customLineItems: [], internalNotes: "", exportedAt: null },
          pricingSummary
        }
      })
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : "Anfragen konnten nicht geladen werden."
    }, { status: 500 })
  }
}
