import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { escapeHtml, parsePersistedQuotePayload, resolveQuotePricing } from "@/lib/quote"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type QuoteRecord = {
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
  approvedBy: string | null
  payloadJson: string
  createdAt: Date
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value?: string | Date | null) {
  if (!value) {
    return "-"
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "-"
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function buildPdfHtml(input: {
  quote: QuoteRecord
  advisorName: string
  advisorEmail: string
  pricingSummary: ReturnType<typeof resolveQuotePricing>
  internalNotes: string
}) {
  const { quote, advisorName, advisorEmail, pricingSummary, internalNotes } = input
  const payload = parsePersistedQuotePayload(quote.payloadJson)
  const selectedItems = pricingSummary.lineItems.filter((item) => item.included)
  const customerCompany = quote.company || payload.company || "-"
  const customerAddress = quote.address || payload.address || "-"
  const offerDate = formatDate(new Date())
  const desiredDate = quote.desiredDate || payload.desiredDate || "-"
  const approvalName = quote.approvedBy || advisorName

  const lineRows = selectedItems.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <strong>${escapeHtml(item.label)}</strong>
        ${item.details ? `<div class="sub">${escapeHtml(item.details)}</div>` : ""}
      </td>
      <td class="num">${escapeHtml(formatCurrency(item.finalAmount))}</td>
    </tr>
  `).join("")

  const infoRows = [
    ["Kunde", quote.name],
    ["Firma", customerCompany],
    ["E-Mail", quote.email],
    ["Telefon", quote.phone || "-"],
    ["Adresse", customerAddress],
    ["Leistung", quote.type],
    ["Gebäudetyp", quote.buildingType],
    ["Fläche", `${quote.squareMeters} m²`],
    ["Stockwerk", quote.floor || payload.floor || "-"],
    ["Aufzug", quote.elevator || payload.elevator || "-"],
    ["Wunschtermin", desiredDate],
  ].map(([label, value]) => `
    <div class="info-row">
      <div class="label">${escapeHtml(label)}</div>
      <div class="value">${escapeHtml(value)}</div>
    </div>
  `).join("")

  const flags = [
    payload.asbestosRequired ? "Asbestentsorgung erforderlich" : "",
    payload.otherPollutants ? "Weitere Schadstoffe angegeben" : "",
    payload.disposalWanted ? "Entsorgung gewünscht" : "",
    payload.valuables ? `Wertgegenstände: ${payload.valuables}` : "",
    payload.permitStatus ? `Genehmigung: ${payload.permitStatus}` : "",
  ].filter(Boolean)

  const notesBlock = [quote.notes || payload.notes, internalNotes].filter(Boolean).join("\n\n")

  return `<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Angebot ${escapeHtml(quote.name)}</title>
    <style>
      @page { size: A4; margin: 20mm 14mm 20mm 14mm; }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, Helvetica, sans-serif;
        color: #111827;
        background: #f3f4f6;
      }
      .toolbar {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: center;
        gap: 12px;
        padding: 16px;
        background: rgba(17, 24, 39, 0.92);
        z-index: 10;
      }
      .toolbar button {
        border: 0;
        border-radius: 999px;
        padding: 10px 18px;
        background: #c9a45c;
        color: #111827;
        font-weight: 700;
        cursor: pointer;
      }
      .page {
        width: 210mm;
        min-height: 297mm;
        margin: 20px auto;
        background: #ffffff;
        padding: 20mm 16mm;
        box-shadow: 0 15px 40px rgba(0, 0, 0, 0.12);
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 24px;
        border-bottom: 2px solid #c9a45c;
        padding-bottom: 20px;
      }
      .brand img {
        width: 220px;
        height: auto;
        margin-bottom: 18px;
      }
      .brand p,
      .meta,
      .small,
      .sub,
      .footer,
      .notes {
        color: #4b5563;
      }
      .brand p,
      .meta,
      .small,
      .notes,
      .footer { font-size: 13px; line-height: 1.5; }
      h1 {
        margin: 0 0 8px 0;
        font-size: 30px;
        color: #111827;
      }
      .badge {
        display: inline-block;
        border-radius: 999px;
        background: rgba(201, 164, 92, 0.16);
        color: #8a6a2f;
        padding: 6px 12px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }
      .section {
        margin-top: 26px;
      }
      .section h2 {
        margin: 0 0 12px 0;
        font-size: 16px;
        color: #111827;
      }
      .info-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px 20px;
      }
      .info-row {
        display: grid;
        grid-template-columns: 120px 1fr;
        gap: 10px;
        border-bottom: 1px solid #e5e7eb;
        padding: 8px 0;
      }
      .label { color: #6b7280; font-size: 12px; font-weight: 700; text-transform: uppercase; }
      .value { color: #111827; font-size: 14px; }
      table {
        width: 100%;
        border-collapse: collapse;
      }
      thead th {
        text-align: left;
        font-size: 12px;
        color: #6b7280;
        padding: 10px 8px;
        border-bottom: 1px solid #d1d5db;
        text-transform: uppercase;
      }
      tbody td {
        vertical-align: top;
        padding: 12px 8px;
        border-bottom: 1px solid #e5e7eb;
        font-size: 14px;
      }
      .num { text-align: right; white-space: nowrap; font-weight: 700; }
      .summary {
        margin-top: 18px;
        margin-left: auto;
        width: 320px;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 16px;
        background: #fafaf9;
      }
      .summary-row {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        padding: 6px 0;
        font-size: 14px;
      }
      .summary-row.total {
        margin-top: 8px;
        padding-top: 12px;
        border-top: 1px solid #d1d5db;
        font-size: 18px;
        font-weight: 700;
      }
      .pill-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .pill {
        display: inline-flex;
        padding: 8px 10px;
        border-radius: 999px;
        background: #f3f4f6;
        font-size: 12px;
        color: #374151;
      }
      .notes {
        white-space: pre-wrap;
        border: 1px solid #e5e7eb;
        border-radius: 14px;
        padding: 14px;
        background: #fafaf9;
      }
      .signature {
        margin-top: 36px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 32px;
      }
      .signature-box {
        padding-top: 22px;
        border-top: 1px solid #9ca3af;
        font-size: 13px;
      }
      .footer {
        margin-top: 36px;
        padding-top: 14px;
        border-top: 1px solid #e5e7eb;
      }
      @media print {
        body { background: #fff; }
        .toolbar { display: none; }
        .page {
          width: auto;
          min-height: auto;
          margin: 0;
          box-shadow: none;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <div class="toolbar">
      <button onclick="window.print()">PDF speichern / drucken</button>
    </div>
    <main class="page">
      <div class="header">
        <div class="brand">
          <img src="/logo-black.png" alt="High-End Homes" />
          <p>
            High-End Homes<br />
            Angebotserstellung & Objektservice<br />
            Ansprechpartner: ${escapeHtml(approvalName)}<br />
            ${escapeHtml(advisorEmail)}
          </p>
        </div>
        <div>
          <span class="badge">Angebot</span>
          <h1>High-End Homes</h1>
          <div class="meta">
            Angebotsnr.: ${escapeHtml(quote.id)}<br />
            Datum: ${escapeHtml(offerDate)}<br />
            Kunde: ${escapeHtml(quote.name)}
          </div>
        </div>
      </div>

      <section class="section">
        <h2>Kundendaten</h2>
        <div class="info-grid">
          ${infoRows}
        </div>
      </section>

      <section class="section">
        <h2>Leistungspositionen</h2>
        <table>
          <thead>
            <tr>
              <th style="width: 52px;">Pos.</th>
              <th>Leistung</th>
              <th style="width: 180px; text-align: right;">Preis</th>
            </tr>
          </thead>
          <tbody>
            ${lineRows}
          </tbody>
        </table>
        <div class="summary">
          <div class="summary-row">
            <span>Automatische Kalkulation</span>
            <strong>${escapeHtml(formatCurrency(pricingSummary.autoTotal))}</strong>
          </div>
          <div class="summary-row total">
            <span>Gesamtpreis</span>
            <span>${escapeHtml(formatCurrency(pricingSummary.finalTotal))}</span>
          </div>
          <div class="small" style="margin-top: 10px;">Alle Preise als Richtwert gemäß interner Freigabe.</div>
        </div>
      </section>

      <section class="section">
        <h2>Projektmerkmale</h2>
        <div class="pill-list">
          ${(flags.length > 0 ? flags : ["Keine besonderen Zusatzmerkmale vermerkt"]).map((flag) => `<span class="pill">${escapeHtml(flag)}</span>`).join("")}
        </div>
      </section>

      <section class="section">
        <h2>Anmerkungen</h2>
        <div class="notes">${escapeHtml(notesBlock || "Keine zusätzlichen Anmerkungen hinterlegt.")}</div>
      </section>

      <section class="signature">
        <div class="signature-box">
          Für High-End Homes<br />
          ${escapeHtml(approvalName)}
        </div>
        <div class="signature-box">
          Annahme durch Kunden<br />
          ${escapeHtml(quote.name)}
        </div>
      </section>

      <div class="footer">
        Dieses Angebot wurde digital erstellt auf Basis der freigegebenen Anfrage vom ${escapeHtml(formatDate(quote.createdAt))}.
      </div>
    </main>
    <script>
      window.addEventListener("load", () => {
        const autoPrint = new URLSearchParams(window.location.search).get("print")
        if (autoPrint === "1") {
          window.setTimeout(() => window.print(), 350)
        }
      })
    </script>
  </body>
</html>`
}

export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return new NextResponse("Nicht eingeloggt.", { status: 401 })
    }

    const { id } = await context.params
    const quote = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!quote) {
      return new NextResponse("Anfrage nicht gefunden.", { status: 404 })
    }

    const payload = parsePersistedQuotePayload(quote.payloadJson)
    const pricingSummary = resolveQuotePricing(payload, payload.pricing)
    const advisorName = session.user.name || quote.approvedBy || "Bennet Pfeifer"
    const advisorEmail = session.user.email || "bennet.pfeifer@highendhomes.de"
    const internalNotes = payload.pricing?.internalNotes ?? ""

    return new NextResponse(
      buildPdfHtml({
        quote,
        advisorName,
        advisorEmail,
        pricingSummary,
        internalNotes,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    )
  } catch (error) {
    console.error("Quote PDF error:", error)
    return new NextResponse("PDF konnte nicht erstellt werden.", { status: 500 })
  }
}
