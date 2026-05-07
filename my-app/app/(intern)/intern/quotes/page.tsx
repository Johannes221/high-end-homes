"use client"

import { useEffect, useMemo, useState } from "react"

type QuoteLineItemOverride = {
  key: string
  amount?: number | null
  included?: boolean
  processed?: boolean
}

type QuoteCustomLineItem = {
  key: string
  label: string
  amount: number
  details?: string
}

type QuoteResolvedLineItem = {
  key: string
  label: string
  amount: number
  details?: string
  included: boolean
  finalAmount: number
  source: "auto" | "manual"
}

type QuotePricing = {
  lineItemOverrides?: QuoteLineItemOverride[]
  customLineItems?: QuoteCustomLineItem[]
  internalNotes?: string
  exportedAt?: string | null
}

type QuotePricingSummary = {
  autoTotal: number
  finalTotal: number
  lineItems: QuoteResolvedLineItem[]
}

type QuotePayload = {
  type?: string
  company?: string
  address?: string
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

type QuoteItem = {
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
  quantityEstimate: string | null
  permitStatus: string | null
  desiredDate: string | null
  notes: string | null
  complexityScore: number
  complexityLevel: string
  effortRange: string
  estimatedMinPrice: number
  estimatedMaxPrice: number
  approvalStatus: string
  approvedAt: string | null
  approvedBy: string | null
  createdAt: string
  updatedAt?: string
  materials: string[]
  removalItems: string[]
  imageFileNames: string[]
  imagesBase64: string[]
  complexityFlags: string[]
  payload: QuotePayload
  pricing: QuotePricing
  pricingSummary: QuotePricingSummary
}

type QuoteResponse = { success?: boolean; quotes?: QuoteItem[] }
type QuotePatchResponse = { success?: boolean; quote?: QuoteItem }

type CustomLineItemDraft = {
  label: string
  amount: string
  details: string
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(value)
}

function formatValue(value: string | null | undefined) {
  return value && value.trim().length > 0 ? value : "-"
}

function buildSelectionSummary(quote: QuoteItem) {
  const values = [...quote.materials, ...quote.removalItems]
  return values.length > 0 ? values.join(", ") : "-"
}

function downloadCsv(quote: QuoteItem) {
  const rows = [
    ["Unverbindliches Preisangebot"],
    ["Dieses Angebot dient nur als Orientierung und ist ohne Gewähr."],
    [],
    ["Anfrage", quote.type],
    ["Kunde", quote.name],
    ["E-Mail", quote.email],
    ["Telefon", quote.phone ?? ""],
    ["Firma", quote.company ?? quote.payload.company ?? ""],
    ["Gebäudetyp", quote.buildingType],
    ["Quadratmeter", String(quote.squareMeters)],
    ["Stockwerk", quote.floor ?? quote.payload.floor ?? ""],
    ["Aufzug", quote.elevator ?? quote.payload.elevator ?? ""],
    ["Gesamtpreis Auto", String(quote.pricingSummary.autoTotal)],
    ["Gesamtpreis Final", String(quote.pricingSummary.finalTotal)],
    [],
    ["Posten", "Automatik", "Final", "Quelle", "Aktiv", "Details"],
    ...quote.pricingSummary.lineItems.map((item) => [
      item.label,
      String(item.amount),
      String(item.finalAmount),
      item.source,
      item.included ? "ja" : "nein",
      item.details ?? "",
    ]),
  ]

  const csvContent = rows.map((row) => row.join(",")).join("\n")
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `angebot-${quote.name.replace(/\s+/g, "-").toLowerCase()}-${quote.id}.csv`
  link.click()
  URL.revokeObjectURL(link.href)
}

function downloadText(quote: QuoteItem, preview: any) {
  const text = `
UNVERBINDLICHES PREISANGEBOT
============================

Dieses Angebot dient nur als Orientierung und ist ohne Gewähr.
Endgültige Preise nach Ortsbesichtigung.

KUNDE
-----
Name: ${quote.name}
E-Mail: ${quote.email}
Telefon: ${quote.phone ?? "-"}
Firma: ${quote.company ?? quote.payload.company ?? "-"}

PROJEKT
-------
Typ: ${quote.type}
Gebäudetyp: ${quote.buildingType}
Größe: ${quote.squareMeters} m²
Stockwerk: ${quote.floor ?? quote.payload.floor ?? "-"}
Aufzug: ${quote.elevator ?? quote.payload.elevator ?? "-"}
Wunschtermin: ${quote.desiredDate ?? quote.payload.desiredDate ?? "-"}

PREISÜBERSICHT
--------------
Automatische Kalkulation: ${formatCurrency(quote.pricingSummary.autoTotal)}
Final kalkuliert: ${formatCurrency(preview.finalTotal)}

POSITIONEN
---------
${preview.lineItems.map((item: any) =>
  `- ${item.label}: ${formatCurrency(item.finalAmount)} (${item.included ? "inkludiert" : "exkludiert"})`
).join("\n")}

GESAMT: ${formatCurrency(preview.finalTotal)}

---
High-End Homes
${new Date().toLocaleDateString("de-DE")}
`.trim()

  const blob = new Blob([text], { type: "text/plain;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = `angebot-${quote.name.replace(/\s+/g, "-").toLowerCase()}-${quote.id}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

function openPdfOffer(quoteId: string) {
  window.open(`/api/quotes/${quoteId}/pdf?print=1`, "_blank", "noopener,noreferrer")
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState("")
  const [expandedId, setExpandedId] = useState("")
  const [draftOverrides, setDraftOverrides] = useState<Record<string, QuoteLineItemOverride[]>>({})
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})
  const [draftCustomItems, setDraftCustomItems] = useState<Record<string, QuoteCustomLineItem[]>>({})
  const [newCustomItem, setNewCustomItem] = useState<Record<string, CustomLineItemDraft>>({})
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [draftProcessed, setDraftProcessed] = useState<Record<string, Record<string, boolean>>>({})

  const loadQuotes = async () => {
    try {
      const response = await fetch("/api/quotes")
      const data = (await response.json()) as QuoteResponse
      if (response.ok && data.success) {
        setQuotes(data.quotes || [])
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadQuotes()
  }, [])

  const buildDefaultOverrides = (quote: QuoteItem) => {
    const savedMap = new Map((quote.pricing.lineItemOverrides ?? []).map((item) => [item.key, item]))
    return quote.pricingSummary.lineItems.map((item) => {
      const saved = savedMap.get(item.key)
      return {
        key: item.key,
        amount: typeof saved?.amount === "number" ? saved.amount : item.source === "manual" ? item.finalAmount : null,
        included: saved?.included ?? item.included,
        processed: saved?.processed ?? false,
      }
    })
  }

  const syncDraft = (quote: QuoteItem) => {
    const overrides = buildDefaultOverrides(quote)
    setDraftOverrides((current) => ({
      ...current,
      [quote.id]: overrides,
    }))
    setDraftNotes((current) => ({
      ...current,
      [quote.id]: quote.pricing.internalNotes ?? "",
    }))
    setDraftCustomItems((current) => ({
      ...current,
      [quote.id]: quote.pricing.customLineItems ?? [],
    }))
    setNewCustomItem((current) => ({
      ...current,
      [quote.id]: { label: "", amount: "", details: "" },
    }))
    const processedMap: Record<string, boolean> = {}
    overrides.forEach((item) => {
      processedMap[item.key] = item.processed ?? false
    })
    setDraftProcessed((current) => ({
      ...current,
      [quote.id]: processedMap,
    }))
  }

  const updateQuote = async (id: string, payload: { approvalStatus?: string; markExported?: boolean }) => {
    setUpdatingId(id)
    try {
      const quote = quotes.find((entry) => entry.id === id)
      if (!quote) {
        return
      }

      const response = await fetch(`/api/quotes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          approvalStatus: payload.approvalStatus ?? quote.approvalStatus,
          markExported: payload.markExported,
          lineItemOverrides: draftOverrides[id] ?? quote.pricing.lineItemOverrides ?? [],
          customLineItems: draftCustomItems[id] ?? quote.pricing.customLineItems ?? [],
          internalNotes: draftNotes[id] ?? quote.pricing.internalNotes ?? "",
        }),
      })

      const data = (await response.json()) as QuotePatchResponse

      if (response.ok && data.success && data.quote) {
        setQuotes((current) => current.map((quote) => (quote.id === id ? { ...quote, ...data.quote } : quote)))
        syncDraft(data.quote)
        return data.quote
      }
    } finally {
      setUpdatingId("")
    }

    return null
  }

  const getDraftOverrides = (quote: QuoteItem) => {
    const existing = draftOverrides[quote.id]
    if (existing) {
      return existing
    }

    return buildDefaultOverrides(quote)
  }

  const getPreviewSummary = (quote: QuoteItem) => {
    const overrides = getDraftOverrides(quote)
    const customItems = draftCustomItems[quote.id] ?? quote.pricing.customLineItems ?? []
    const overrideMap = new Map(overrides.map((item) => [item.key, item]))
    const baseItems = [
      ...quote.pricingSummary.lineItems.filter((item) => !item.key.startsWith("custom-")),
      ...customItems.map((item) => ({
        key: item.key,
        label: item.label,
        amount: item.amount,
        details: item.details,
        included: true,
        finalAmount: item.amount,
        source: "auto" as const,
      })),
    ]
    const lineItems = baseItems.map((item) => {
      const override = overrideMap.get(item.key)
      const included = override?.included !== false
      const hasManualAmount = typeof override?.amount === "number" && Number.isFinite(override.amount)
      const finalAmount = hasManualAmount ? Math.round(override?.amount ?? 0) : item.amount

      return {
        ...item,
        included,
        finalAmount,
        source: hasManualAmount ? "manual" as const : "auto" as const,
      }
    })

    return {
      lineItems,
      finalTotal: lineItems.filter((item) => item.included).reduce((sum, item) => sum + item.finalAmount, 0),
    }
  }

  const setLineItemAmount = (quote: QuoteItem, key: string, value: string) => {
    const next = getDraftOverrides(quote).map((item) => item.key === key ? { ...item, amount: value === "" ? null : Number(value) } : item)
    setDraftOverrides((current) => ({ ...current, [quote.id]: next }))
  }

  const toggleLineItemIncluded = (quote: QuoteItem, key: string) => {
    const next = getDraftOverrides(quote).map((item) => item.key === key ? { ...item, included: item.included === false ? true : false } : item)
    setDraftOverrides((current) => ({ ...current, [quote.id]: next }))
  }

  const toggleLineItemProcessed = (quote: QuoteItem, key: string) => {
    setDraftProcessed((current) => ({
      ...current,
      [quote.id]: {
        ...(current[quote.id] ?? {}),
        [key]: !(current[quote.id]?.[key] ?? false),
      },
    }))
    const next = getDraftOverrides(quote).map((item) => item.key === key ? { ...item, processed: !(item.processed ?? false) } : item)
    setDraftOverrides((current) => ({ ...current, [quote.id]: next }))
  }

  const addCustomLineItem = (quote: QuoteItem) => {
    const draft = newCustomItem[quote.id] ?? { label: "", amount: "", details: "" }
    if (!draft.label.trim() || !draft.amount.trim()) {
      return
    }

    const customItem: QuoteCustomLineItem = {
      key: `custom-${Date.now()}`,
      label: draft.label.trim(),
      amount: Number(draft.amount) || 0,
      details: draft.details.trim() || undefined,
    }

    setDraftCustomItems((current) => ({
      ...current,
      [quote.id]: [...(current[quote.id] ?? quote.pricing.customLineItems ?? []), customItem],
    }))
    const nextOverrides = [...getDraftOverrides(quote), { key: customItem.key, amount: customItem.amount, included: true }]
    setDraftOverrides((current) => ({ ...current, [quote.id]: nextOverrides }))
    setNewCustomItem((current) => ({
      ...current,
      [quote.id]: { label: "", amount: "", details: "" },
    }))
  }

  const removeLineItem = (quote: QuoteItem, key: string) => {
    if (key.startsWith("custom-")) {
      setDraftCustomItems((current) => ({
        ...current,
        [quote.id]: (current[quote.id] ?? quote.pricing.customLineItems ?? []).filter((item) => item.key !== key),
      }))
      setDraftOverrides((current) => ({
        ...current,
        [quote.id]: getDraftOverrides(quote).filter((item) => item.key !== key),
      }))
      return
    }

    const next = getDraftOverrides(quote).map((item) => item.key === key ? { ...item, included: false } : item)
    setDraftOverrides((current) => ({ ...current, [quote.id]: next }))
  }

  const sortedQuotes = useMemo(() => quotes, [quotes])

  return (
    <div className="space-y-6">
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxImage(null)
            }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={lightboxImage}
            alt="Vollbild"
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Anfragen</h1>
        <p className="text-sm text-gray-500">Gesammelte Angebotsanfragen mit Detailposten, Kostenschätzung, manueller Preisfreigabe und Export.</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500">Anfragen werden geladen...</div>
      ) : sortedQuotes.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 text-sm text-gray-500">Noch keine Anfragen vorhanden.</div>
      ) : (
        <div className="space-y-4">
          {sortedQuotes.map((quote) => {
            const preview = getPreviewSummary(quote)
            const isExpanded = expandedId === quote.id
            return (
              <div key={quote.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">{quote.type} · {quote.name}</h2>
                    <p className="text-sm text-gray-500">{quote.email}{quote.phone ? ` · ${quote.phone}` : ""}</p>
                    <p className="text-sm text-gray-500">{quote.buildingType} · {quote.squareMeters} m²{quote.floor ? ` · ${quote.floor}` : ""}</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p>Status: <strong>{quote.approvalStatus}</strong></p>
                    <p>Komplexität: <strong>{quote.complexityLevel}</strong> ({quote.complexityScore})</p>
                    <p>Preisspanne: <strong>{quote.estimatedMinPrice} € – {quote.estimatedMaxPrice} €</strong></p>
                    <p>Final kalkuliert: <strong>{formatCurrency(preview.finalTotal)}</strong></p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <p><strong>Firma:</strong> {formatValue(quote.company || quote.payload.company)}</p>
                    <p><strong>Aufzug:</strong> {formatValue(quote.elevator || quote.payload.elevator)}</p>
                    <p><strong>Menge / Aufwand:</strong> {formatValue(quote.quantityEstimate || quote.payload.effortEstimate)}</p>
                    <p><strong>Baugenehmigung:</strong> {formatValue(quote.permitStatus || quote.payload.permitStatus)}</p>
                    <p><strong>Wunschtermin:</strong> {formatValue(quote.desiredDate || quote.payload.desiredDate)}</p>
                  </div>
                  <div>
                    <p><strong>Auswahl:</strong> {buildSelectionSummary(quote)}</p>
                    <p><strong>Hinweise:</strong> {quote.complexityFlags.join(" · ") || "-"}</p>
                    <p><strong>Dateien:</strong> {quote.imageFileNames.join(", ") || "-"}</p>
                  </div>

                  {quote.imagesBase64 && quote.imagesBase64.length > 0 ? (
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Hochgeladene Bilder:</p>
                      <div className="flex flex-wrap gap-3">
                        {quote.imagesBase64.map((base64, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={base64}
                              alt={`Bild ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg border border-gray-300 cursor-pointer hover:border-gray-500 transition-colors"
                              onClick={() => setLightboxImage(base64)}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
                              <svg className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                {quote.notes ? <p className="text-sm text-gray-700"><strong>Anmerkungen:</strong> {quote.notes}</p> : null}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                  <p><strong>Unverbindliches Preisangebot:</strong> Dieses Angebot dient nur als Orientierung und ist ohne Gewähr. Endgültige Preise nach Ortsbesichtigung.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!isExpanded) {
                        syncDraft(quote)
                      }
                      setExpandedId(isExpanded ? "" : quote.id)
                    }}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium"
                  >
                    {isExpanded ? "Details schließen" : "Bearbeiten & Details"}
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateQuote(quote.id, { approvalStatus: "approved" })}
                    disabled={updatingId === quote.id}
                    className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium disabled:opacity-60"
                  >
                    Freigeben
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateQuote(quote.id, { approvalStatus: "pending" })}
                    disabled={updatingId === quote.id}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-60"
                  >
                    Auf offen setzen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      downloadCsv({
                        ...quote,
                        pricingSummary: {
                          ...quote.pricingSummary,
                          lineItems: preview.lineItems,
                          finalTotal: preview.finalTotal,
                        },
                      })
                      openPdfOffer(quote.id)
                    }}
                    disabled={updatingId === quote.id}
                    className="px-4 py-2 rounded-lg bg-[#c9a45c] text-black text-sm font-semibold disabled:opacity-60"
                  >
                    PDF-Angebot erstellen
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadText(quote, preview)}
                    disabled={updatingId === quote.id}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium disabled:opacity-60"
                  >
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => window.location.href = `mailto:${quote.email}?subject=Ihr unverbindliches Preisangebot von High-End Homes&body=Hallo ${quote.name},%0D%0A%0D%0Avielen Dank für Ihre Anfrage. Anbei erhalten Sie unser unverbindliches Preisangebot.%0D%0A%0D%0ADieses Angebot dient nur als Orientierung und ist ohne Gewähr. Endgültige Preise nach Ortsbesichtigung.%0D%0A%0D%0AFür Rückfragen stehen wir Ihnen gerne zur Verfügung.%0D%0A%0D%0AMit freundlichen Grüßen%0D%0AHigh-End Homes`}
                    disabled={updatingId === quote.id}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
                  >
                    E-Mail senden
                  </button>
                </div>

                {isExpanded ? (
                  <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-5">
                    <div className="grid lg:grid-cols-3 gap-4 text-sm text-gray-700">
                      <div className="space-y-1">
                        <p><strong>Adresse:</strong> {formatValue(quote.address || quote.payload.address)}</p>
                        <p><strong>Baujahr:</strong> {formatValue(quote.constructionYear || quote.payload.constructionYear)}</p>
                        <p><strong>Wertgegenstände:</strong> {formatValue(quote.payload.valuables)}</p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>Asbest:</strong> {quote.payload.asbestosRequired ? "Ja" : "Nein"}</p>
                        <p><strong>Weitere Schadstoffe:</strong> {quote.payload.otherPollutants ? "Ja" : "Nein"}</p>
                        <p><strong>Entsorgung gewünscht:</strong> {quote.payload.disposalWanted ? "Ja" : "Nein"}</p>
                      </div>
                      <div className="space-y-1">
                        <p><strong>Erstellt:</strong> {new Date(quote.createdAt).toLocaleString("de-DE")}</p>
                        <p><strong>Zuletzt exportiert:</strong> {formatValue(quote.pricing.exportedAt ?? undefined)}</p>
                        <p><strong>Freigegeben von:</strong> {formatValue(quote.approvedBy)}</p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm">
                        <thead>
                          <tr className="text-left text-gray-500 border-b border-gray-200">
                            <th className="py-2 pr-4">Aktiv</th>
                            <th className="py-2 pr-4">Posten</th>
                            <th className="py-2 pr-4">Auto</th>
                            <th className="py-2 pr-4">Tatsächlich</th>
                            <th className="py-2 pr-4">Quelle</th>
                            <th className="py-2">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {preview.lineItems.map((item) => (
                            <tr key={item.key} className="border-b border-gray-100 align-top">
                              <td className="py-3 pr-4">
                                <input
                                  type="checkbox"
                                  checked={item.included}
                                  onChange={() => toggleLineItemIncluded(quote, item.key)}
                                  className="h-4 w-4"
                                />
                              </td>
                              <td className="py-3 pr-4 font-medium text-black">{item.label}</td>
                              <td className="py-3 pr-4 text-black">{formatCurrency(item.amount)}</td>
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={draftProcessed[quote.id]?.[item.key] ?? false}
                                    onChange={() => toggleLineItemProcessed(quote, item.key)}
                                    className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500"
                                    style={{ accentColor: '#22c55e' }}
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={getDraftOverrides(quote).find((entry) => entry.key === item.key)?.amount ?? ""}
                                    onChange={(event) => setLineItemAmount(quote, item.key, event.target.value)}
                                    className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-black"
                                    placeholder={String(item.amount)}
                                  />
                                </div>
                              </td>
                              <td className="py-3 pr-4 text-black">{item.source === "manual" ? "Manuell" : "Auto"}</td>
                              <td className="py-3 text-black">
                                <div className="flex items-start justify-between gap-3">
                                  <span>{item.details || "-"}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeLineItem(quote, item.key)}
                                    className="rounded-md border border-red-200 px-2 py-1 text-xs text-red-600"
                                  >
                                    Löschen
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="rounded-xl border border-dashed border-gray-300 bg-white p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-gray-900">Position hinzufügen</h3>
                      <div className="grid md:grid-cols-[1.4fr_0.6fr_1fr_auto] gap-3">
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">Titel</label>
                          <input
                            type="text"
                            value={newCustomItem[quote.id]?.label ?? ""}
                            onChange={(event) => setNewCustomItem((current) => ({ ...current, [quote.id]: { ...(current[quote.id] ?? { label: "", amount: "", details: "" }), label: event.target.value } }))}
                            className="rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="Bezeichnung der Position"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">Betrag</label>
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={newCustomItem[quote.id]?.amount ?? ""}
                            onChange={(event) => setNewCustomItem((current) => ({ ...current, [quote.id]: { ...(current[quote.id] ?? { label: "", amount: "", details: "" }), amount: event.target.value } }))}
                            className="rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="Preis"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="block text-xs font-medium text-gray-700">Anmerkung</label>
                          <input
                            type="text"
                            value={newCustomItem[quote.id]?.details ?? ""}
                            onChange={(event) => setNewCustomItem((current) => ({ ...current, [quote.id]: { ...(current[quote.id] ?? { label: "", amount: "", details: "" }), details: event.target.value } }))}
                            className="rounded-lg border border-gray-300 px-3 py-2"
                            placeholder="Details optional"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => addCustomLineItem(quote)}
                          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                        >
                          Hinzufügen
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 text-sm text-gray-700">
                        <p><strong>Automatische Summe:</strong> {formatCurrency(quote.pricingSummary.autoTotal)}</p>
                        <p><strong>Finale Summe:</strong> {formatCurrency(preview.finalTotal)}</p>
                        <p><strong>Preisspanne Anfrage:</strong> {formatCurrency(quote.estimatedMinPrice)} bis {formatCurrency(quote.estimatedMaxPrice)}</p>
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Interne Anmerkungen</label>
                        <textarea
                          value={draftNotes[quote.id] ?? quote.pricing.internalNotes ?? ""}
                          onChange={(event) => setDraftNotes((current) => ({ ...current, [quote.id]: event.target.value }))}
                          rows={5}
                          className="w-full rounded-xl border border-gray-300 px-3 py-2"
                          placeholder="Eigene Einschätzung, Rückfragen, finale Hinweise"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => void updateQuote(quote.id, {})}
                        disabled={updatingId === quote.id}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-60"
                      >
                        Änderungen speichern
                      </button>
                      <button
                        type="button"
                        onClick={async () => {
                          const savedQuote = await updateQuote(quote.id, { markExported: true })
                          if (savedQuote) {
                            openPdfOffer(savedQuote.id)
                          }
                        }}
                        disabled={updatingId === quote.id}
                        className="px-4 py-2 rounded-lg bg-[#c9a45c] text-black text-sm font-semibold disabled:opacity-60"
                      >
                        PDF-Angebot erstellen
                      </button>
                      <button
                        type="button"
                        onClick={() => syncDraft(quote)}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium"
                      >
                        Entwurf zurücksetzen
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
