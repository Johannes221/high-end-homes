"use client"

import { useEffect, useMemo, useState } from "react"

type QuoteLineItemOverride = {
  key: string
  amount?: number | null
  included?: boolean
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
  complexityFlags: string[]
  payload: QuotePayload
  pricing: QuotePricing
  pricingSummary: QuotePricingSummary
}

type QuoteResponse = { success?: boolean; quotes?: QuoteItem[] }
type QuotePatchResponse = { success?: boolean; quote?: QuoteItem }

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

  const csv = rows.map((row) => row.map((cell = "") => `"${String(cell).replaceAll('"', '""')}"`).join(";")).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `angebot-${quote.name.replace(/\s+/g, "-").toLowerCase()}-${quote.id}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState("")
  const [expandedId, setExpandedId] = useState("")
  const [draftOverrides, setDraftOverrides] = useState<Record<string, QuoteLineItemOverride[]>>({})
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})

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

  const syncDraft = (quote: QuoteItem) => {
    setDraftOverrides((current) => ({
      ...current,
      [quote.id]: quote.pricing.lineItemOverrides ?? quote.pricingSummary.lineItems.map((item) => ({ key: item.key, amount: item.source === "manual" ? item.finalAmount : null, included: item.included })),
    }))
    setDraftNotes((current) => ({
      ...current,
      [quote.id]: quote.pricing.internalNotes ?? "",
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
          internalNotes: draftNotes[id] ?? quote.pricing.internalNotes ?? "",
        }),
      })

      const data = (await response.json()) as QuotePatchResponse

      if (response.ok && data.success && data.quote) {
        setQuotes((current) => current.map((quote) => (quote.id === id ? { ...quote, ...data.quote } : quote)))
        syncDraft(data.quote)
      }
    } finally {
      setUpdatingId("")
    }
  }

  const getDraftOverrides = (quote: QuoteItem) => {
    const existing = draftOverrides[quote.id]
    if (existing) {
      return existing
    }

    return quote.pricingSummary.lineItems.map((item) => ({
      key: item.key,
      amount: item.source === "manual" ? item.finalAmount : null,
      included: item.included,
    }))
  }

  const getPreviewSummary = (quote: QuoteItem) => {
    const overrides = getDraftOverrides(quote)
    const overrideMap = new Map(overrides.map((item) => [item.key, item]))
    const lineItems = quote.pricingSummary.lineItems.map((item) => {
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

  const sortedQuotes = useMemo(() => quotes, [quotes])

  return (
    <div className="space-y-6">
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
                </div>

                {quote.notes ? <p className="text-sm text-gray-700"><strong>Anmerkungen:</strong> {quote.notes}</p> : null}

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
                      void updateQuote(quote.id, { markExported: true })
                    }}
                    disabled={updatingId === quote.id}
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium disabled:opacity-60"
                  >
                    Angebot exportieren
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
                              <td className="py-3 pr-4 font-medium text-gray-900">{item.label}</td>
                              <td className="py-3 pr-4 text-gray-700">{formatCurrency(item.amount)}</td>
                              <td className="py-3 pr-4">
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={getDraftOverrides(quote).find((entry) => entry.key === item.key)?.amount ?? ""}
                                  onChange={(event) => setLineItemAmount(quote, item.key, event.target.value)}
                                  className="w-32 rounded-lg border border-gray-300 px-3 py-2"
                                  placeholder={String(item.amount)}
                                />
                              </td>
                              <td className="py-3 pr-4 text-gray-700">{item.source === "manual" ? "Manuell" : "Auto"}</td>
                              <td className="py-3 text-gray-500">{item.details || "-"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
