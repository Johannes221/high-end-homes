export type QuoteSubmission = {
  type?: string
  name?: string
  email?: string
  phone?: string
  company?: string
  address?: string
  squareMeters?: string | number
  buildingType?: string
  constructionYear?: string
  floor?: string
  elevator?: string
  materials?: string[]
  removalItems?: string[]
  quantityEstimate?: string
  valuables?: string
  asbestosRequired?: boolean
  otherPollutants?: boolean
  disposalWanted?: boolean
  permitStatus?: string
  desiredDate?: string
  imageFileNames?: string[]
  notes?: string
  effortEstimate?: string
}

export type ComplexityResult = {
  score: number
  level: "Low" | "Medium" | "High"
  effortRange: string
  flags: string[]
}

export type PriceEstimate = {
  min: number
  max: number
  currency: "EUR"
  rationale: string[]
}

export type QuoteLineItem = {
  key: string
  label: string
  amount: number
  details?: string
}

export type QuoteLineItemOverride = {
  key: string
  amount?: number | null
  included?: boolean
}

export type QuotePricingState = {
  lineItemOverrides?: QuoteLineItemOverride[]
  internalNotes?: string
  exportedAt?: string
}

export type QuoteResolvedLineItem = QuoteLineItem & {
  included: boolean
  finalAmount: number
  source: "auto" | "manual"
}

export type QuotePricingSummary = {
  autoTotal: number
  finalTotal: number
  lineItems: QuoteResolvedLineItem[]
}

export type PersistedQuotePayload = QuoteSubmission & {
  pricing?: QuotePricingState
}

const clearanceMaterialBaseRates: Record<string, number> = {
  Möbel: 180,
  Elektrogeräte: 140,
  "Kleidung & Textilien": 60,
  Holz: 120,
  Metall: 130,
  Kunststoff: 90,
  Baumaterialien: 220,
  Sondermüll: 380,
}

const guttingRemovalBaseRates: Record<string, number> = {
  Böden: 12,
  Deckenverkleidungen: 10,
  "Wandverkleidungen & Putz": 18,
  "Sanitär (Bad/WC)": 850,
  Elektroinstallationen: 700,
  "Fenster & Türen": 420,
  "Heizung & Rohre": 1100,
  Trennwände: 16,
}

function roundCurrency(value: number) {
  return Math.round(value)
}

function getSquareMeters(submission: QuoteSubmission) {
  return Math.max(Number(submission.squareMeters) || 0, 0)
}

function getFloorFactor(submission: QuoteSubmission) {
  if (submission.elevator === "Ja") {
    return 0
  }

  if (submission.floor === "1.OG") {
    return 120
  }

  if (submission.floor === "2.OG") {
    return 260
  }

  if (submission.floor === "3.OG+") {
    return 420
  }

  if (submission.floor === "Keller") {
    return 140
  }

  return 0
}

function getQuantityFactor(quantityEstimate?: string) {
  if (quantityEstimate === "Viel") {
    return 220
  }

  if (quantityEstimate === "Mittel") {
    return 120
  }

  if (quantityEstimate === "Wenig") {
    return 40
  }

  return 0
}

export function parsePersistedQuotePayload(payloadJson: string): PersistedQuotePayload {
  try {
    const parsed = JSON.parse(payloadJson) as PersistedQuotePayload
    return typeof parsed === "object" && parsed !== null ? parsed : {}
  } catch {
    return {}
  }
}

export function buildQuoteLineItems(submission: QuoteSubmission): QuoteLineItem[] {
  const squareMeters = getSquareMeters(submission)
  const lineItems: QuoteLineItem[] = []
  const isClearance = submission.type === "Entrümpelung"
  const isGutting = submission.type === "Entkernung"
  const isCombined = submission.type === "Entkernung & Entrümpelung"

  if (isClearance || isCombined) {
    lineItems.push({
      key: "site-setup-clearance",
      label: "Grundaufwand Entrümpelung",
      amount: roundCurrency(Math.max(squareMeters, 1) * 6),
      details: `${squareMeters || 1} m² kalkuliert`,
    })

    for (const material of submission.materials ?? []) {
      const baseRate = clearanceMaterialBaseRates[material] ?? 100
      const amount = material === "Sondermüll"
        ? baseRate
        : roundCurrency(baseRate + squareMeters * 0.9)

      lineItems.push({
        key: `material-${material}`,
        label: `Entrümpelung: ${material}`,
        amount,
      })
    }

    if (submission.valuables === "Ja") {
      lineItems.push({
        key: "valuables-check",
        label: "Sichtung Wertgegenstände",
        amount: 80,
      })
    }

    const quantityFactor = getQuantityFactor(submission.quantityEstimate)
    if (quantityFactor > 0) {
      lineItems.push({
        key: "quantity-factor",
        label: `Mengenfaktor ${submission.quantityEstimate}`,
        amount: quantityFactor,
      })
    }
  }

  if (isGutting || isCombined) {
    lineItems.push({
      key: "site-setup-gutting",
      label: "Grundaufwand Entkernung",
      amount: roundCurrency(Math.max(squareMeters, 1) * 10),
      details: `${squareMeters || 1} m² kalkuliert`,
    })

    for (const item of submission.removalItems ?? []) {
      const baseRate = guttingRemovalBaseRates[item] ?? 250
      const amount = item === "Sanitär (Bad/WC)" || item === "Elektroinstallationen" || item === "Heizung & Rohre"
        ? baseRate
        : roundCurrency(baseRate * Math.max(squareMeters, 1))

      lineItems.push({
        key: `removal-${item}`,
        label: `Entkernung: ${item}`,
        amount,
      })
    }

    if (submission.disposalWanted) {
      lineItems.push({
        key: "disposal-service",
        label: "Entsorgung des Rückbaumaterials",
        amount: roundCurrency(Math.max(squareMeters, 1) * 4),
      })
    }
  }

  const floorFactor = getFloorFactor(submission)
  if (floorFactor > 0) {
    lineItems.push({
      key: "floor-factor",
      label: `Transportzuschlag ${submission.floor || "Stockwerk"} ohne Aufzug`,
      amount: floorFactor,
      details: "Zusätzliche Laufwege und Trageaufwand berücksichtigt",
    })
  }

  if (submission.asbestosRequired) {
    lineItems.push({
      key: "asbestos",
      label: "Asbest-Handling / Fachbetrieb",
      amount: roundCurrency(Math.max(squareMeters, 1) * 8 + 350),
    })
  }

  if (submission.otherPollutants) {
    lineItems.push({
      key: "pollutants",
      label: "Prüfung / Umgang mit weiteren Schadstoffen",
      amount: 420,
    })
  }

  if (submission.elevator === "Ja") {
    lineItems.push({
      key: "elevator-benefit",
      label: "Aufzug vorhanden",
      amount: 0,
      details: "Kein Zuschlag nötig",
    })
  }

  if (lineItems.length === 0) {
    lineItems.push({
      key: "base-assessment",
      label: "Grundbewertung Anfrage",
      amount: roundCurrency(Math.max(squareMeters, 1) * 8),
    })
  }

  return lineItems
}

export function resolveQuotePricing(submission: QuoteSubmission, pricing?: QuotePricingState): QuotePricingSummary {
  const autoItems = buildQuoteLineItems(submission)
  const overrideMap = new Map((pricing?.lineItemOverrides ?? []).map((item) => [item.key, item]))

  const lineItems = autoItems.map((item) => {
    const override = overrideMap.get(item.key)
    const included = override?.included !== false
    const hasManualAmount = typeof override?.amount === "number" && Number.isFinite(override.amount)
    const finalAmount = hasManualAmount ? roundCurrency(override.amount ?? 0) : item.amount

    return {
      ...item,
      included,
      finalAmount,
      source: hasManualAmount ? "manual" : "auto",
    } satisfies QuoteResolvedLineItem
  })

  const autoTotal = roundCurrency(lineItems.filter((item) => item.included).reduce((sum, item) => sum + item.amount, 0))
  const finalTotal = roundCurrency(lineItems.filter((item) => item.included).reduce((sum, item) => sum + item.finalAmount, 0))

  return {
    autoTotal,
    finalTotal,
    lineItems,
  }
}

export function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

export function normalizeStringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter((entry): entry is string => typeof entry === "string" && entry.trim().length > 0)
}

export function normalizeBoolean(value: unknown) {
  return value === true
}

export function normalizeSubmission(payload: unknown): QuoteSubmission {
  const body = typeof payload === "object" && payload !== null ? (payload as Record<string, unknown>) : {}

  return {
    type: normalizeString(body.type),
    name: normalizeString(body.name),
    email: normalizeString(body.email),
    phone: normalizeString(body.phone),
    company: normalizeString(body.company),
    address: normalizeString(body.address),
    squareMeters:
      typeof body.squareMeters === "number" || typeof body.squareMeters === "string"
        ? body.squareMeters
        : "",
    buildingType: normalizeString(body.buildingType),
    constructionYear: normalizeString(body.constructionYear),
    floor: normalizeString(body.floor),
    elevator: normalizeString(body.elevator),
    materials: normalizeStringArray(body.materials),
    removalItems: normalizeStringArray(body.removalItems),
    quantityEstimate: normalizeString(body.quantityEstimate),
    valuables: normalizeString(body.valuables),
    asbestosRequired: normalizeBoolean(body.asbestosRequired),
    otherPollutants: normalizeBoolean(body.otherPollutants),
    disposalWanted: normalizeBoolean(body.disposalWanted),
    permitStatus: normalizeString(body.permitStatus),
    desiredDate: normalizeString(body.desiredDate),
    imageFileNames: normalizeStringArray(body.imageFileNames),
    notes: normalizeString(body.notes),
    effortEstimate: normalizeString(body.effortEstimate),
  }
}

export function evaluateComplexity(submission: QuoteSubmission): ComplexityResult {
  let score = 1
  const flags: string[] = []
  const squareMeters = Number(submission.squareMeters) || 0
  const materials = submission.materials ?? []

  if (submission.asbestosRequired) {
    score += 1
    flags.push("Asbestentsorgung erforderlich — Fachbetrieb einplanen.")
  }

  if (submission.otherPollutants) {
    score += 1
    flags.push("Andere Schadstoffe angegeben — gesonderte Prüfung erforderlich.")
  }

  if (squareMeters > 100) {
    score += 1
    flags.push("Projektgröße über 100 m² — zusätzlicher Aufwand einplanen.")
  }

  if ((submission.floor === "2.OG" || submission.floor === "3.OG+") && submission.elevator === "Nein") {
    score += 1
    flags.push("Höheres Stockwerk ohne Aufzug — Transportaufwand erhöht.")
  }

  if (materials.includes("Sondermüll")) {
    score += 1
    flags.push("Sondermüll ausgewählt — gesonderte Entsorgung berücksichtigen.")
  }

  const level = score >= 4 ? "High" : score === 3 ? "Medium" : "Low"
  const effortRange = level === "High" ? "16h+" : level === "Medium" ? "8–16h" : "4–8h"

  return { score, level, effortRange, flags }
}

export function estimatePriceRange(submission: QuoteSubmission, complexity: ComplexityResult): PriceEstimate {
  const squareMeters = Math.max(Number(submission.squareMeters) || 0, 1)
  const isGutting = submission.type === "Entkernung"
  const baseRate = isGutting ? 28 : 16
  let multiplier = 1
  const rationale: string[] = []
  const selectedItems = isGutting ? submission.removalItems ?? [] : submission.materials ?? []

  if (submission.asbestosRequired) {
    multiplier += 0.35
    rationale.push("Asbestzuschlag berücksichtigt")
  }

  if (submission.otherPollutants) {
    multiplier += 0.2
    rationale.push("Schadstoffzuschlag berücksichtigt")
  }

  if (submission.elevator === "Nein" && (submission.floor === "2.OG" || submission.floor === "3.OG+")) {
    multiplier += 0.15
    rationale.push("Transportzuschlag für höheres Stockwerk ohne Aufzug")
  }

  if ((submission.materials ?? []).includes("Sondermüll")) {
    multiplier += 0.2
    rationale.push("Sondermüllzuschlag berücksichtigt")
  }

  if (selectedItems.length >= 5) {
    multiplier += 0.15
    rationale.push("Viele Leistungspositionen berücksichtigt")
  }

  if (submission.quantityEstimate === "Viel") {
    multiplier += 0.1
    rationale.push("Hohe Mengenangabe berücksichtigt")
  }

  if (complexity.level === "Medium") {
    multiplier += 0.1
  }

  if (complexity.level === "High") {
    multiplier += 0.2
  }

  const base = squareMeters * baseRate * multiplier
  const min = Math.round(base * 0.9)
  const max = Math.round(base * 1.2)

  return {
    min,
    max,
    currency: "EUR",
    rationale,
  }
}

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
