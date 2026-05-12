import { NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import {
  resolveQuotePricing,
  type QuoteSubmission,
} from "@/lib/quote"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type QuoteListRow = {
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

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const quotes = await prisma.$queryRaw<QuoteListRow[]>`
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
      ORDER BY createdAt DESC
    `

    return NextResponse.json({
      success: true,
      quotes: quotes.map(quote => {
        const materials = parseStringArray(quote.materialsJson)
        const removalItems = parseStringArray(quote.removalItemsJson)
        const imageFileNames = parseStringArray(quote.imageFileNamesJson)
        const complexityFlags = parseStringArray(quote.complexityFlagsJson)
        const payload: QuoteSubmission = {
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
        }
        const pricingSummary = resolveQuotePricing(payload)
        return {
          ...quote,
          materials,
          removalItems,
          imageFileNames,
          imagesBase64: [],
          complexityFlags,
          payload,
          pricing: {
            lineItemOverrides: [],
            customLineItems: [],
            internalNotes: "",
            exportedAt: null,
          },
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
