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

export type QuoteCustomLineItem = {
  key: string
  label: string
  amount: number
  details?: string
}

export type QuotePricingState = {
  lineItemOverrides?: QuoteLineItemOverride[]
  customLineItems?: QuoteCustomLineItem[]
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

type QuoteProjectMode = "clearance" | "gutting" | "combined"

type ScopedRateConfig = {
  ratePerSquareMeter: number
  minimum: number
}

const clearanceMaterialRateConfig: Record<string, ScopedRateConfig> = {
  Möbel: { ratePerSquareMeter: 2.2, minimum: 120 },
  Elektrogeräte: { ratePerSquareMeter: 1.8, minimum: 110 },
  "Kleidung & Textilien": { ratePerSquareMeter: 0.8, minimum: 60 },
  Holz: { ratePerSquareMeter: 1.4, minimum: 80 },
  Metall: { ratePerSquareMeter: 1.5, minimum: 90 },
  Kunststoff: { ratePerSquareMeter: 1, minimum: 70 },
  Baumaterialien: { ratePerSquareMeter: 3.2, minimum: 180 },
  Sondermüll: { ratePerSquareMeter: 5.5, minimum: 320 },
}

const guttingRemovalRateConfig: Record<string, ScopedRateConfig> = {
  Böden: { ratePerSquareMeter: 3.5, minimum: 200 },
  Deckenverkleidungen: { ratePerSquareMeter: 3, minimum: 180 },
  "Wandverkleidungen & Putz": { ratePerSquareMeter: 4.5, minimum: 280 },
  "Sanitär (Bad/WC)": { ratePerSquareMeter: 3.5, minimum: 420 },
  Elektroinstallationen: { ratePerSquareMeter: 3.5, minimum: 420 },
  "Fenster & Türen": { ratePerSquareMeter: 3.5, minimum: 320 },
  "Heizung & Rohre": { ratePerSquareMeter: 4.5, minimum: 520 },
  Trennwände: { ratePerSquareMeter: 3.5, minimum: 260 },
}

const floorBaseSurcharges: Record<string, number> = {
  "1.OG": 120,
  "2.OG": 260,
  "3.OG+": 420,
  Keller: 140,
}

const quantityMultipliers: Record<string, number> = {
  Wenig: 0.9,
  Mittel: 1,
  Viel: 1.15,
}

const projectSetupFees: Record<QuoteProjectMode, number> = {
  clearance: 220,
  gutting: 420,
  combined: 560,
}

const clearanceBaseWorkRate: Record<QuoteProjectMode, number> = {
  clearance: 16,
  gutting: 0,
  combined: 13,
}

const guttingBaseWorkRate: Record<QuoteProjectMode, number> = {
  clearance: 0,
  gutting: 18,
  combined: 16,
}

function roundCurrency(value: number) {
  return Math.round(value)
}

function getSquareMeters(submission: QuoteSubmission) {
  return Math.max(Number(submission.squareMeters) || 0, 0)
}

function getProjectMode(submission: QuoteSubmission): QuoteProjectMode {
  if (submission.type === "Entkernung") {
    return "gutting"
  }

  if (submission.type === "Entkernung & Entrümpelung") {
    return "combined"
  }

  return "clearance"
}

function getQuantityLabel(submission: QuoteSubmission) {
  return submission.quantityEstimate || submission.effortEstimate || ""
}

function getQuantityMultiplier(submission: QuoteSubmission) {
  return quantityMultipliers[getQuantityLabel(submission)] ?? 1
}

function getFloorSurcharge(submission: QuoteSubmission, mode: QuoteProjectMode) {
  if (submission.elevator === "Ja") {
    return 0
  }

  const base = floorBaseSurcharges[submission.floor ?? ""] ?? 0
  if (base === 0) {
    return 0
  }

  if (mode === "gutting") {
    return roundCurrency(base * 1.3)
  }

  if (mode === "combined") {
    return roundCurrency(base * 1.15)
  }

  return base
}

function getScopedAmount(squareMeters: number, config: ScopedRateConfig) {
  return roundCurrency(Math.max(Math.max(squareMeters, 1) * config.ratePerSquareMeter, config.minimum))
}

function sumLineItems(items: QuoteLineItem[]) {
  return items.reduce((sum, item) => sum + item.amount, 0)
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
  const normalizedSquareMeters = Math.max(squareMeters, 1)
  const lineItems: QuoteLineItem[] = []
  const mode = getProjectMode(submission)
  const isClearance = mode === "clearance" || mode === "combined"
  const isGutting = mode === "gutting" || mode === "combined"

  lineItems.push({
    key: "project-setup",
    label: "Baustelleneinrichtung / Anfahrt",
    amount: projectSetupFees[mode],
  })

  if (isClearance) {
    const clearanceBaseAmount = roundCurrency(normalizedSquareMeters * clearanceBaseWorkRate[mode])
    const clearanceItems: QuoteLineItem[] = [
      {
        key: "base-clearance",
        label: "Grundaufwand Entrümpelung",
        amount: clearanceBaseAmount,
        details: `${normalizedSquareMeters} m² × ${clearanceBaseWorkRate[mode]} €/m²`,
      },
    ]

    for (const material of submission.materials ?? []) {
      const config = clearanceMaterialRateConfig[material] ?? { ratePerSquareMeter: 1.5, minimum: 90 }
      clearanceItems.push({
        key: `material-${material}`,
        label: `Entrümpelung: ${material}`,
        amount: getScopedAmount(squareMeters, config),
        details: `Auswahlabhängiger Zuschlag für ${material}`,
      })
    }

    if (submission.valuables === "Ja") {
      clearanceItems.push({
        key: "valuables-check",
        label: "Sichtung Wertgegenstände",
        amount: 120,
      })
    }

    const quantityMultiplier = getQuantityMultiplier(submission)
    const clearanceSubtotal = sumLineItems(clearanceItems)
    if (quantityMultiplier !== 1) {
      clearanceItems.push({
        key: "quantity-adjustment",
        label: quantityMultiplier > 1 ? `Mehraufwand ${getQuantityLabel(submission)}` : `Abschlag ${getQuantityLabel(submission)}`,
        amount: roundCurrency(clearanceSubtotal * (quantityMultiplier - 1)),
        details: quantityMultiplier > 1 ? "Zusätzlicher Räum- und Sortieraufwand" : "Reduzierter Räumaufwand",
      })
    }

    lineItems.push(...clearanceItems)
  }

  if (isGutting) {
    const guttingItems: QuoteLineItem[] = [
      {
        key: "base-gutting",
        label: "Grundaufwand Entkernung",
        amount: roundCurrency(normalizedSquareMeters * guttingBaseWorkRate[mode]),
        details: `${normalizedSquareMeters} m² × ${guttingBaseWorkRate[mode]} €/m²`,
      },
    ]

    for (const item of submission.removalItems ?? []) {
      const config = guttingRemovalRateConfig[item] ?? { ratePerSquareMeter: 3, minimum: 220 }
      guttingItems.push({
        key: `removal-${item}`,
        label: `Entkernung: ${item}`,
        amount: getScopedAmount(squareMeters, config),
        details: `Teilrückbau für ${item}`,
      })
    }

    if (submission.disposalWanted) {
      guttingItems.push({
        key: "disposal-service",
        label: "Entsorgung des Rückbaumaterials",
        amount: roundCurrency(Math.max(280, normalizedSquareMeters * 3)),
      })
    }

    lineItems.push(...guttingItems)
  }

  const floorFactor = getFloorSurcharge(submission, mode)
  if (floorFactor > 0) {
    lineItems.push({
      key: "floor-factor",
      label: `Transportzuschlag ${submission.floor || "Stockwerk"} ohne Aufzug`,
      amount: floorFactor,
      details: "Zusätzliche Laufwege und Trageaufwand berücksichtigt",
    })
  }

  if (submission.asbestosRequired) {
    const asbestosRate = mode === "clearance" ? 7 : 9
    lineItems.push({
      key: "asbestos",
      label: "Asbest-Handling / Fachbetrieb",
      amount: roundCurrency(Math.max(1200, normalizedSquareMeters * asbestosRate)),
    })
  }

  if (submission.otherPollutants) {
    lineItems.push({
      key: "pollutants",
      label: "Prüfung / Umgang mit weiteren Schadstoffen",
      amount: roundCurrency(Math.max(650, normalizedSquareMeters * 4)),
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
  const customItems: QuoteLineItem[] = (pricing?.customLineItems ?? []).map((item) => ({
    key: item.key,
    label: item.label,
    amount: roundCurrency(item.amount),
    details: item.details,
  }))
  const allItems = [...autoItems, ...customItems]
  const overrideMap = new Map((pricing?.lineItemOverrides ?? []).map((item) => [item.key, item]))

  const lineItems = allItems.map((item) => {
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
  const removalItems = submission.removalItems ?? []
  const selectionCount = materials.length + removalItems.length
  const quantityLabel = getQuantityLabel(submission)

  if (submission.type === "Entkernung & Entrümpelung") {
    score += 1
    flags.push("Kombinierter Leistungsumfang mit zwei Gewerken.")
  }

  if (squareMeters >= 80) {
    score += 1
    flags.push("Projektgröße ab 80 m² — erhöhter Grundaufwand.")
  }

  if (squareMeters >= 150) {
    score += 1
    flags.push("Großfläche ab 150 m² — Organisation und Logistik steigen deutlich.")
  }

  if (submission.asbestosRequired) {
    score += 1
    flags.push("Asbestentsorgung erforderlich — Fachbetrieb einplanen.")
  }

  if (submission.otherPollutants) {
    score += 1
    flags.push("Andere Schadstoffe angegeben — gesonderte Prüfung erforderlich.")
  }

  if ((submission.floor === "2.OG" || submission.floor === "3.OG+" || submission.floor === "Keller") && submission.elevator !== "Ja") {
    score += 1
    flags.push("Erschwerter Materialtransport ohne Aufzug.")
  }

  if (materials.includes("Sondermüll") || materials.includes("Baumaterialien")) {
    score += 1
    flags.push("Entsorgungsintensive Materialien ausgewählt.")
  }

  if (removalItems.some((item) => item === "Sanitär (Bad/WC)" || item === "Elektroinstallationen" || item === "Heizung & Rohre")) {
    score += 1
    flags.push("Technische Rückbaupositionen ausgewählt.")
  }

  if (selectionCount >= 4) {
    score += 1
    flags.push("Viele Leistungspositionen erhöhen Abstimmung und Sortieraufwand.")
  }

  if (quantityLabel === "Viel") {
    score += 1
    flags.push("Hoher Umfang/Aufwand angegeben.")
  }

  const level = score >= 7 ? "High" : score >= 4 ? "Medium" : "Low"
  const effortRange = level === "High" ? "5+ Arbeitstage" : level === "Medium" ? "2–5 Arbeitstage" : "1–2 Arbeitstage"

  return { score, level, effortRange, flags }
}

export function estimatePriceRange(submission: QuoteSubmission, complexity: ComplexityResult): PriceEstimate {
  const autoTotal = roundCurrency(buildQuoteLineItems(submission).reduce((sum, item) => sum + item.amount, 0))
  const selectionCount = (submission.materials ?? []).length + (submission.removalItems ?? []).length
  const quantityLabel = getQuantityLabel(submission)
  const isCombined = submission.type === "Entkernung & Entrümpelung"
  let minFactor = 0.9
  let maxFactor = 1.14
  const rationale: string[] = []

  if (complexity.level === "Medium") {
    minFactor = 0.88
    maxFactor = 1.2
  }

  if (complexity.level === "High") {
    minFactor = 0.84
    maxFactor = 1.28
  }

  rationale.push(`Automatische Kalkulation aus ${buildQuoteLineItems(submission).length} Positionen abgeleitet`)

  if (submission.asbestosRequired || submission.otherPollutants) {
    minFactor -= 0.02
    maxFactor += 0.05
    rationale.push("Schadstoffthemen erhöhen die Preisbandbreite")
  }

  if (isCombined) {
    maxFactor += 0.03
    rationale.push("Kombinierter Leistungsumfang mit zusätzlicher Abstimmung")
  }

  if (selectionCount >= 4) {
    maxFactor += 0.03
    rationale.push("Viele gewählte Leistungspositionen berücksichtigt")
  }

  if (quantityLabel === "Viel") {
    maxFactor += 0.02
    rationale.push("Hoher Umfang/Aufwand eingepreist")
  }

  if (submission.elevator !== "Ja" && (submission.floor === "2.OG" || submission.floor === "3.OG+" || submission.floor === "Keller")) {
    rationale.push("Transport- und Trageaufwand berücksichtigt")
  }

  const min = roundCurrency(autoTotal * Math.max(0.75, minFactor))
  const max = roundCurrency(autoTotal * Math.max(minFactor + 0.08, maxFactor))

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
