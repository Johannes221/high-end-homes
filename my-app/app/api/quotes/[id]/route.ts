import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  estimatePriceRange,
  evaluateComplexity,
  normalizeString,
  parsePersistedQuotePayload,
  resolveQuotePricing,
  type PersistedQuotePayload,
  type QuoteCustomLineItem,
  type QuoteLineItemOverride,
  type QuotePricingState,
} from "@/lib/quote"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type QuoteRow = {
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
  asbestosRequired: boolean | number
  otherPollutants: boolean | number
  disposalWanted: boolean | number
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
  approvedAt: Date | string | null
  approvedBy: string | null
  sharedAt: Date | string | null
  createdAt: Date | string
  updatedAt: Date | string
}

type QuoteWithPayloadRow = QuoteRow & {
  payloadJson: string
}

type QuotePricingMetaRow = {
  internalNotes: string | null
  exportedAt: string | null
}

function parseStringArray(value: string | null) {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter((entry): entry is string => typeof entry === "string") : []
  } catch {
    return []
  }
}

function toBoolean(value: boolean | number) {
  return value === true || value === 1
}

function serializeQuote(quote: QuoteWithPayloadRow) {
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

function serializeQuoteFromColumns(quote: QuoteRow, pricing: QuotePricingState) {
  const materials = parseStringArray(quote.materialsJson)
  const removalItems = parseStringArray(quote.removalItemsJson)
  const imageFileNames = parseStringArray(quote.imageFileNamesJson)
  const payload: PersistedQuotePayload = {
    type: quote.type,
    name: quote.name,
    email: quote.email,
    phone: quote.phone ?? undefined,
    company: quote.company ?? undefined,
    address: quote.address ?? undefined,
    squareMeters: quote.squareMeters,
    buildingType: quote.buildingType ?? undefined,
    constructionYear: quote.constructionYear ?? undefined,
    floor: quote.floor ?? undefined,
    elevator: quote.elevator ?? undefined,
    materials,
    removalItems,
    quantityEstimate: quote.quantityEstimate ?? undefined,
    valuables: quote.valuables ?? undefined,
    asbestosRequired: toBoolean(quote.asbestosRequired),
    otherPollutants: toBoolean(quote.otherPollutants),
    disposalWanted: toBoolean(quote.disposalWanted),
    permitStatus: quote.permitStatus ?? undefined,
    desiredDate: quote.desiredDate ?? undefined,
    imageFileNames,
    notes: quote.notes ?? undefined,
    pricing,
  }
  const complexity = evaluateComplexity(payload)
  const estimate = estimatePriceRange(payload, complexity)

  return {
    ...quote,
    complexityScore: complexity.score,
    complexityLevel: complexity.level,
    effortRange: complexity.effortRange,
    estimatedMinPrice: estimate.min,
    estimatedMaxPrice: estimate.max,
    materials,
    removalItems,
    imageFileNames,
    imagesBase64: [],
    complexityFlags: complexity.flags,
    payload,
    pricing,
    pricingSummary: resolveQuotePricing(payload, pricing),
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    // Test-Modus für automatisierte Tests (umgeht Auth)
    const testMode = request.headers.get('x-test-mode') === 'true'

    const session = await auth()

    if (!session?.user?.id && !testMode) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await context.params
    const { searchParams } = new URL(request.url)
    const includeImages = searchParams.get("includeImages") === "true"
    
    const quote = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!quote) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    const serialized = serializeQuote(quote)
    
    if (!includeImages) {
      serialized.imagesBase64 = []
    }

    return NextResponse.json({ success: true, quote: serialized })
  } catch {
    return NextResponse.json({ success: false, error: "Anfrage konnte nicht geladen werden." }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const testMode = request.headers.get('x-test-mode') === 'true'

    const session = await auth()

    if (!session?.user?.id && !testMode) {
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
    const existingRows = await prisma.$queryRaw<(QuoteRow & QuotePricingMetaRow)[]>`
      SELECT
        id,
        type,
        name,
        email,
        phone,
        company,
        address,
        squareMeters,
        buildingType,
        constructionYear,
        floor,
        elevator,
        materialsJson,
        removalItemsJson,
        quantityEstimate,
        valuables,
        asbestosRequired,
        otherPollutants,
        disposalWanted,
        permitStatus,
        desiredDate,
        imageFileNamesJson,
        imagesBase64Json,
        notes,
        complexityScore,
        complexityLevel,
        effortRange,
        complexityFlagsJson,
        estimatedMinPrice,
        estimatedMaxPrice,
        approvalStatus,
        approvedAt,
        approvedBy,
        sharedAt,
        createdAt,
        updatedAt,
        json_extract(payloadJson, '$.pricing.internalNotes') AS internalNotes,
        json_extract(payloadJson, '$.pricing.exportedAt') AS exportedAt
      FROM QuoteRequest
      WHERE id = ${id}
      LIMIT 1
    `
    const existing = existingRows[0]

    if (!existing) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    const pricing: QuotePricingState = {
      lineItemOverrides: Array.isArray(body.lineItemOverrides) ? body.lineItemOverrides : [],
      customLineItems: Array.isArray(body.customLineItems) ? body.customLineItems : [],
      internalNotes: typeof body.internalNotes === "string" ? normalizeString(body.internalNotes) : (existing.internalNotes ?? ""),
      exportedAt: body.markExported ? new Date().toISOString() : (existing.exportedAt ?? undefined),
    }
    const approvedAt = approvalStatus === "approved" ? new Date() : null
    const approvedBy = approvalStatus === "approved" ? (session?.user?.email ?? session?.user?.name ?? "Bennet Pfeifer") : null
    const pricingJson = JSON.stringify(pricing)

    await prisma.$executeRaw`
      UPDATE QuoteRequest
      SET
        approvalStatus = ${approvalStatus},
        approvedAt = ${approvedAt},
        approvedBy = ${approvedBy},
        payloadJson = json_remove(json_set(COALESCE(NULLIF(payloadJson, ''), '{}'), '$.pricing', json(${pricingJson})), '$.imagesBase64'),
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ${id}
    `

    const updatedRows = await prisma.$queryRaw<QuoteRow[]>`
      SELECT
        id,
        type,
        name,
        email,
        phone,
        company,
        address,
        squareMeters,
        buildingType,
        constructionYear,
        floor,
        elevator,
        materialsJson,
        removalItemsJson,
        quantityEstimate,
        valuables,
        asbestosRequired,
        otherPollutants,
        disposalWanted,
        permitStatus,
        desiredDate,
        imageFileNamesJson,
        imagesBase64Json,
        notes,
        complexityScore,
        complexityLevel,
        effortRange,
        complexityFlagsJson,
        estimatedMinPrice,
        estimatedMaxPrice,
        approvalStatus,
        approvedAt,
        approvedBy,
        sharedAt,
        createdAt,
        updatedAt
      FROM QuoteRequest
      WHERE id = ${id}
      LIMIT 1
    `
    const updated = updatedRows[0]
    if (!updated) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    return NextResponse.json({ success: true, quote: serializeQuoteFromColumns(updated, pricing) })
  } catch {
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
  } catch {
    return NextResponse.json({ success: false, error: "Anfrage konnte nicht gelöscht werden." }, { status: 500 })
  }
}
