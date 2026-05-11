import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  estimatePriceRange,
  evaluateComplexity,
  normalizeString,
  parsePersistedQuotePayload,
  resolveQuotePricing,
  type QuoteCustomLineItem,
  type QuoteLineItemOverride,
} from "@/lib/quote"

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
  imagesBase64Json?: string
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
    imagesBase64: quote.imagesBase64Json ? JSON.parse(quote.imagesBase64Json) : [],
    complexityFlags: complexity.flags,
    payload,
    pricing: payload.pricing ?? { lineItemOverrides: [], internalNotes: "", exportedAt: null },
    pricingSummary: resolveQuotePricing(payload, payload.pricing),
  }
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await context.params
    const quote = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!quote) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    return NextResponse.json({ success: true, quote: serializeQuote(quote) })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Anfrage konnte nicht geladen werden." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await context.params
    const body = (await request.json()) as {
      approvalStatus?: string
      lineItemOverrides?: QuoteLineItemOverride[]
      customLineItems?: QuoteCustomLineItem[]
      internalNotes?: string
      markExported?: boolean
    }
    const approvalStatus = typeof body.approvalStatus === "string" ? body.approvalStatus : "pending"
    const existing = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    const payload = parsePersistedQuotePayload(existing.payloadJson)
    payload.pricing = {
      ...payload.pricing,
      lineItemOverrides: Array.isArray(body.lineItemOverrides) ? body.lineItemOverrides : (payload.pricing?.lineItemOverrides ?? []),
      customLineItems: Array.isArray(body.customLineItems) ? body.customLineItems : (payload.pricing?.customLineItems ?? []),
      internalNotes: typeof body.internalNotes === "string" ? normalizeString(body.internalNotes) : (payload.pricing?.internalNotes ?? ""),
      exportedAt: body.markExported ? new Date().toISOString() : (payload.pricing?.exportedAt ?? undefined),
    }

    const updated = await prisma.quoteRequest.update({
      where: { id },
      data: {
        approvalStatus,
        approvedAt: approvalStatus === "approved" ? new Date() : null,
        approvedBy: approvalStatus === "approved" ? session.user.email ?? session.user.name ?? "Bennet Pfeifer" : null,
        payloadJson: JSON.stringify(payload),
      },
    })

    return NextResponse.json({ success: true, quote: serializeQuote(updated) })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Freigabe konnte nicht gespeichert werden." }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await context.params
    const existing = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    await prisma.quoteRequest.delete({ where: { id } })

    return NextResponse.json({ success: true, message: "Anfrage erfolgreich gelöscht." })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Anfrage konnte nicht gelöscht werden." }, { status: 500 })
  }
}
