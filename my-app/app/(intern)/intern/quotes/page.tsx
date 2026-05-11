"use client"

import { useEffect, useMemo, useState } from "react"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { AlertDialog } from "@/components/AlertDialog"

type QuoteLineItemOverride = {
  key: string
  amount?: number | null
  included?: boolean
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

function downloadText(quote: QuoteItem, preview: QuotePricingSummary) {
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
${preview.lineItems.map((item) =>
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
  const [loadedImages, setLoadedImages] = useState<Record<string, string[]>>({})
  const [draftOverrides, setDraftOverrides] = useState<Record<string, QuoteLineItemOverride[]>>({})
  const [draftNotes, setDraftNotes] = useState<Record<string, string>>({})
  const [draftCustomItems, setDraftCustomItems] = useState<Record<string, QuoteCustomLineItem[]>>({})
  const [newCustomItem, setNewCustomItem] = useState<Record<string, CustomLineItemDraft>>({})
  const [lightboxImages, setLightboxImages] = useState<string[]>([])
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [lightboxScale, setLightboxScale] = useState(1)
  const [lightboxOffset, setLightboxOffset] = useState({ x: 0, y: 0 })
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    onConfirm: () => void
  }>({ open: false, title: "", description: "", onConfirm: () => {} })
  const [alertDialog, setAlertDialog] = useState<{
    open: boolean
    title: string
    description: string
    variant?: "default" | "destructive"
  }>({ open: false, title: "", description: "", variant: "default" })

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
  }

  const loadQuoteImages = async (quoteId: string) => {
    if (loadedImages[quoteId]) return
    
    try {
      const response = await fetch(`/api/quotes/${quoteId}`)
      const data = await response.json()
      if (response.ok && data.success && data.quote) {
        setLoadedImages((current) => ({
          ...current,
          [quoteId]: data.quote.imagesBase64 || [],
        }))
      }
    } catch (error) {
      console.error("Failed to load images:", error)
    }
  }

  const updateQuote = async (id: string, payload: { approvalStatus?: string; markExported?: boolean }) => {
    setUpdatingId(id)
    try {
      const quote = quotes.find((entry) => entry.id === id)
      if (!quote) {
        return
      }

      const optimisticUpdate = {
        ...quote,
        approvalStatus: payload.approvalStatus ?? quote.approvalStatus,
        pricing: {
          ...quote.pricing,
          lineItemOverrides: draftOverrides[id] ?? quote.pricing.lineItemOverrides ?? [],
          customLineItems: draftCustomItems[id] ?? quote.pricing.customLineItems ?? [],
          internalNotes: draftNotes[id] ?? quote.pricing.internalNotes ?? "",
        },
      }
      
      setQuotes((current) => current.map((q) => (q.id === id ? optimisticUpdate : q)))

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
        
        if (payload.approvalStatus === "approved") {
          const sendResponse = await fetch(`/api/quotes/${id}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })
          
          const sendData = await sendResponse.json()
          
          if (sendResponse.ok && sendData.success) {
            setAlertDialog({
              open: true,
              title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
              description: `✅ Anfrage freigegeben und E-Mail mit PDF erfolgreich an ${quote.email} versendet!`,
              variant: "default",
            })
          } else {
            setAlertDialog({
              open: true,
              title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
              description: `⚠️ Anfrage freigegeben, aber E-Mail-Versand fehlgeschlagen: ${sendData.error || "Unbekannter Fehler"}`,
              variant: "destructive",
            })
          }
        }
        
        return data.quote
      }
    } finally {
      setUpdatingId("")
    }

    return null
  }

  const sendQuoteEmail = async (quote: QuoteItem) => {
    setConfirmDialog({
      open: true,
      title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
      description: `Angebot als PDF an ${quote.email} senden?`,
      onConfirm: async () => {
        setUpdatingId(quote.id)
        try {
          const response = await fetch(`/api/quotes/${quote.id}/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          })

          const data = await response.json()

          if (response.ok && data.success) {
            setAlertDialog({
              open: true,
              title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
              description: `✅ Angebot erfolgreich an ${quote.email} versendet!`,
              variant: "default",
            })
            await loadQuotes()
          } else {
            setAlertDialog({
              open: true,
              title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
              description: `❌ Fehler beim Versenden: ${data.error || "Unbekannter Fehler"}`,
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Send quote error:", error)
          setAlertDialog({
            open: true,
            title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
            description: `❌ Fehler beim Versenden: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          })
        } finally {
          setUpdatingId("")
        }
      },
    })
  }

  const deleteQuote = async (quote: QuoteItem) => {
    setConfirmDialog({
      open: true,
      title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
      description: `Anfrage von ${quote.name} (${quote.email}) wirklich löschen?\n\nDieser Vorgang kann nicht rückgängig gemacht werden!`,
      onConfirm: async () => {
        setUpdatingId(quote.id)
        try {
          const response = await fetch(`/api/quotes/${quote.id}`, {
            method: "DELETE",
          })

          const data = await response.json()

          if (response.ok && data.success) {
            setAlertDialog({
              open: true,
              title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
              description: `✅ Anfrage erfolgreich gelöscht!`,
              variant: "default",
            })
            setQuotes((current) => current.filter((q) => q.id !== quote.id))
          } else {
            setAlertDialog({
              open: true,
              title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
              description: `❌ Fehler beim Löschen: ${data.error || "Unbekannter Fehler"}`,
              variant: "destructive",
            })
          }
        } catch (error) {
          console.error("Delete quote error:", error)
          setAlertDialog({
            open: true,
            title: "Auf www.highendhomes.de wird Folgendes angezeigt:",
            description: `❌ Fehler beim Löschen: ${error instanceof Error ? error.message : String(error)}`,
            variant: "destructive",
          })
        } finally {
          setUpdatingId("")
        }
      },
    })
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

    const autoTotal = lineItems.filter((item) => item.included && item.source === "auto").reduce((sum, item) => sum + item.finalAmount, 0)
    const finalTotal = lineItems.filter((item) => item.included).reduce((sum, item) => sum + item.finalAmount, 0)
    
    return {
      lineItems,
      autoTotal,
      finalTotal,
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

  const sortedQuotes = useMemo(() => {
    let filtered = quotes

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((q) => q.type === filterType)
    }

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((q) => q.approvalStatus === filterStatus)
    }

    // Search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((q) =>
        q.name.toLowerCase().includes(query) ||
        q.email.toLowerCase().includes(query) ||
        q.phone?.toLowerCase().includes(query) ||
        q.company?.toLowerCase().includes(query) ||
        q.address?.toLowerCase().includes(query) ||
        q.id.toLowerCase().includes(query)
      )
    }

    // Sort
    const sorted = [...filtered]
    switch (sortBy) {
      case "date-desc":
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case "date-asc":
        sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "price-desc":
        sorted.sort((a, b) => b.estimatedMaxPrice - a.estimatedMaxPrice)
        break
      case "price-asc":
        sorted.sort((a, b) => a.estimatedMaxPrice - b.estimatedMaxPrice)
        break
      case "name-asc":
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      default:
        break
    }

    return sorted
  }, [quotes, searchQuery, filterType, filterStatus, sortBy])

  const openLightbox = (images: string[], startIndex: number = 0) => {
    setLightboxImages(images)
    setLightboxIndex(startIndex)
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  const closeLightbox = () => {
    setLightboxImages([])
    setLightboxIndex(0)
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  const zoomIn = () => setLightboxScale((prev) => Math.min(prev + 0.5, 4))
  const zoomOut = () => {
    setLightboxScale((prev) => {
      const next = Math.max(prev - 0.5, 1)
      if (next === 1) setLightboxOffset({ x: 0, y: 0 })
      return next
    })
  }
  const resetZoom = () => {
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  const nextImage = () => {
    setLightboxIndex((prev) => {
      const next = (prev + 1) % lightboxImages.length
      return next
    })
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  const prevImage = () => {
    setLightboxIndex((prev) => {
      const next = (prev - 1 + lightboxImages.length) % lightboxImages.length
      return next
    })
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  const goToImage = (index: number) => {
    setLightboxIndex(index)
    setLightboxScale(1)
    setLightboxOffset({ x: 0, y: 0 })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxImages.length === 0) return
      if (e.key === "ArrowRight") { e.preventDefault(); nextImage(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prevImage(); }
      if (e.key === "Escape") closeLightbox()
      if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomIn(); }
      if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomOut(); }
      if (e.key === "0") { e.preventDefault(); resetZoom(); }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxImages.length, lightboxIndex])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (lightboxScale > 1) return
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY })
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart || lightboxScale > 1) return
    const dx = e.changedTouches[0].clientX - touchStart.x
    const dy = e.changedTouches[0].clientY - touchStart.y
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) prevImage()
      else nextImage()
    }
    setTouchStart(null)
  }

  return (
    <div className="space-y-6">
      {lightboxImages.length > 0 && (
        <div
          className="fixed inset-0 bg-black/95 flex flex-col z-50"
          onClick={closeLightbox}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar mit Controls */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/50 backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm font-medium">{lightboxIndex + 1} / {lightboxImages.length}</span>
              <span className="text-white/50">|</span>
              <span className="text-sm text-white/70">{lightboxScale > 1 ? `${Math.round(lightboxScale * 100)}%` : "Original"}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="p-2 text-white hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                onClick={(e) => { e.stopPropagation(); zoomOut(); }}
                disabled={lightboxScale <= 1}
                title="Verkleinern (-)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <button
                className="p-2 text-white hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                onClick={(e) => { e.stopPropagation(); resetZoom(); }}
                title="Originalgröße (0)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button
                className="p-2 text-white hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                onClick={(e) => { e.stopPropagation(); zoomIn(); }}
                disabled={lightboxScale >= 4}
                title="Vergrößern (+)"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              <div className="w-px h-6 bg-white/20 mx-1" />
              <button
                className="p-2 text-white hover:text-gray-300 hover:bg-white/10 rounded-lg transition-colors"
                onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                title="Schließen (Esc)"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Hauptbereich mit Bild */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Navigationsbuttons */}
            <button
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 transition-all z-10 p-3 rounded-full"
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white hover:bg-white/10 transition-all z-10 p-3 rounded-full"
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Bild mit Zoom und Pan */}
            <div className="relative flex items-center justify-center" style={{ width: '90vw', height: '75vh' }}>
              <img
                src={lightboxImages[lightboxIndex]}
                alt={`Bild ${lightboxIndex + 1}`}
                className="object-contain transition-transform duration-200 select-none"
                style={{
                  transform: `scale(${lightboxScale})`,
                  cursor: lightboxScale > 1 ? 'grab' : 'pointer',
                  maxWidth: '100%',
                  maxHeight: '100%',
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  if (lightboxScale === 1) {
                    zoomIn()
                  } else {
                    resetZoom()
                  }
                }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<div class="text-white text-center">Bild konnte nicht geladen werden</div>'
                  }
                }}
                draggable={false}
              />
            </div>
            {/* Navigations-Hinweis */}
            {lightboxScale === 1 && lightboxImages.length > 1 && (
              <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-white/60 text-sm bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full pointer-events-none select-none">
                ← Pfeiltasten oder wischen →
              </div>
            )}
          </div>

          {/* Thumbnail-Leiste */}
          <div className="shrink-0 bg-black/50 backdrop-blur-sm p-3">
            <div className="flex gap-2 justify-center overflow-x-auto max-w-full">
              {lightboxImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); goToImage(idx); }}
                  className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    idx === lightboxIndex ? 'border-[#c9a45c] ring-2 ring-[#c9a45c]/30' : 'border-transparent hover:border-white/50'
                  }`}
                >
                  <img 
                    src={img} 
                    alt={`Thumbnail ${idx + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.style.display = 'none'
                    }}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Anfragen</h1>
        <p className="text-sm text-gray-500">Gesammelte Angebotsanfragen mit Detailposten, Kostenschätzung, manueller Preisfreigabe und Export.</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Suche nach Name, E-Mail, Telefon, Firma, Adresse oder ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#c9a45c] focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a45c] focus:border-transparent bg-white text-gray-900"
          >
            <option value="all">Alle Typen</option>
            <option value="Entrümpelung">Entrümpelung</option>
            <option value="Entkernung">Entkernung</option>
            <option value="Kombi">Kombi</option>
            <option value="Hausauflösung">Hausauflösung</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a45c] focus:border-transparent bg-white text-gray-900"
          >
            <option value="all">Alle Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#c9a45c] focus:border-transparent bg-white text-gray-900"
          >
            <option value="date-desc">Neueste zuerst</option>
            <option value="date-asc">Älteste zuerst</option>
            <option value="price-desc">Preis: Hoch → Niedrig</option>
            <option value="price-asc">Preis: Niedrig → Hoch</option>
            <option value="name-asc">Name: A → Z</option>
            <option value="name-desc">Name: Z → A</option>
          </select>
        </div>

        {/* Results count */}
        <div className="mt-3 text-sm text-gray-900 font-medium">
          {sortedQuotes.length} von {quotes.length} Anfrage{quotes.length !== 1 ? "n" : ""}
          {(searchQuery || filterType !== "all" || filterStatus !== "all" || sortBy !== "date-desc") && (
            <button
              onClick={() => {
                setSearchQuery("")
                setFilterType("all")
                setFilterStatus("all")
                setSortBy("date-desc")
              }}
              className="ml-3 text-[#c9a45c] hover:underline font-medium"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
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
                    <p><strong>Dateien:</strong> {quote.imageFileNames.filter(name => name && !name.startsWith("data:") && name.length < 100).join(", ") || "-"}</p>
                  </div>

                  {(() => {
                    const images = loadedImages[quote.id] || []
                    const validImages = images.filter((base64) => {
                      if (!base64 || typeof base64 !== 'string') return false
                      if (!base64.startsWith('data:image/')) return false
                      if (base64.length < 100) return false
                      return true
                    })
                    
                    if (validImages.length === 0) return null
                    
                    return (
                      <div className="mt-4 col-span-full">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-semibold text-gray-800">Hochgeladene Bilder ({validImages.length})</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => openLightbox(validImages, 0)}
                            className="flex items-center gap-2 text-sm bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                            </svg>
                            Vollbild
                          </button>
                        </div>
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {validImages.map((base64, index) => (
                            <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => openLightbox(validImages, index)}>
                              <img
                                src={base64}
                                alt={`Bild ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  const parent = target.parentElement
                                  if (parent) {
                                    parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs">Fehler</div>'
                                  }
                                }}
                              />
                              {/* Hover Overlay */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                </svg>
                              </div>
                              {/* Bildnummer */}
                              <div className="absolute top-1 left-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 py-0.5 rounded">
                                {index + 1}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
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
                        void loadQuoteImages(quote.id)
                      }
                      setExpandedId(isExpanded ? "" : quote.id)
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                  >
                    {isExpanded ? (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        Details schließen
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        Bearbeiten & Details
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateQuote(quote.id, { approvalStatus: "approved" })}
                    disabled={updatingId === quote.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Freigeben
                  </button>
                  <button
                    type="button"
                    onClick={() => void updateQuote(quote.id, { approvalStatus: "pending" })}
                    disabled={updatingId === quote.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c9a45c] text-white text-sm font-medium hover:bg-[#b8944d] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    PDF-Angebot
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadText(quote, preview)}
                    disabled={updatingId === quote.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Text
                  </button>
                  <button
                    type="button"
                    onClick={() => sendQuoteEmail(quote)}
                    disabled={updatingId === quote.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    PDF per E-Mail senden
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteQuote(quote)}
                    disabled={updatingId === quote.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Löschen
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
                                <input
                                  type="number"
                                  min="0"
                                  step="1"
                                  value={getDraftOverrides(quote).find((entry) => entry.key === item.key)?.amount ?? ""}
                                  onChange={(event) => setLineItemAmount(quote, item.key, event.target.value)}
                                  className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-black"
                                  placeholder={String(item.amount)}
                                />
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
                          <tr className="border-t-2 border-gray-300 font-bold">
                            <td className="py-3 pr-4"></td>
                            <td className="py-3 pr-4 text-black">Gesamtsumme</td>
                            <td className="py-3 pr-4 text-black">{formatCurrency(quote.pricingSummary.autoTotal)}</td>
                            <td className="py-3 pr-4 text-black">{formatCurrency(preview.finalTotal)}</td>
                            <td className="py-3 pr-4"></td>
                            <td className="py-3"></td>
                          </tr>
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

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
      />

      <AlertDialog
        open={alertDialog.open}
        onOpenChange={(open) => setAlertDialog({ ...alertDialog, open })}
        title={alertDialog.title}
        description={alertDialog.description}
        variant={alertDialog.variant}
      />
    </div>
  )
}
