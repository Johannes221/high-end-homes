import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"

import { NextResponse } from "next/server"

import { sendEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"
import {
  escapeHtml,
  estimatePriceRange,
  evaluateComplexity,
  normalizeSubmission,
  normalizeString,
  sanitizeQuotePayloadForPersistence,
  type QuoteSubmission,
} from "@/lib/quote"

export const dynamic = 'force-dynamic';

type MailSharePayload = {
  recipientEmail?: string
  formUrl?: string
}

function resolveAppUrl() {
  return normalizeString(process.env.AUTH_URL) || normalizeString(process.env.NEXTAUTH_URL) || "http://127.0.0.1:3000"
}

function resolveAllowedOrigin() {
  return normalizeString(process.env.ALLOWED_ORIGIN) || normalizeString(process.env.FRONTEND_URL) || normalizeString(process.env.PUBLIC_APP_URL)
}

function buildCorsHeaders(request: Request) {
  const headers = new Headers({
    "Access-Control-Allow-Methods": "POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  })
  const requestOrigin = normalizeString(request.headers.get("origin"))
  const allowedOrigin = resolveAllowedOrigin()

  if (allowedOrigin && requestOrigin === allowedOrigin) {
    headers.set("Access-Control-Allow-Origin", allowedOrigin)
    headers.set("Vary", "Origin")
  }

  return headers
}

function jsonWithCors(request: Request, body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init)
  const corsHeaders = buildCorsHeaders(request)

  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value)
  })

  return response
}

function buildTableRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:10px 12px;border:1px solid #2a2a2a;color:rgba(255,255,255,0.7);vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:10px 12px;border:1px solid #2a2a2a;color:#ffffff;vertical-align:top;">${escapeHtml(value) || "-"}</td>
    </tr>
  `
}

function buildEmailHtml(submission: QuoteSubmission, complexityScore: number, complexityLevel: string, effortRange: string, estimateMin: number, estimateMax: number, flags: string[]) {
  const itemSelection = submission.type === "Entkernung" ? submission.removalItems ?? [] : submission.materials ?? []
  const specialFlags = [
    submission.asbestosRequired ? "Asbest" : "",
    submission.otherPollutants ? "Andere Schadstoffe" : "",
    submission.disposalWanted ? "Entsorgung gewünscht" : "",
    submission.valuables ? `Wertgegenstände: ${submission.valuables}` : "",
  ].filter(Boolean)

  const rows = [
    buildTableRow("Typ", submission.type || "-"),
    buildTableRow("Name", submission.name || "-"),
    buildTableRow("E-Mail", submission.email || "-"),
    buildTableRow("Telefon", submission.phone || "-"),
    buildTableRow("Firma", submission.company || "-"),
    buildTableRow("Adresse", submission.address || "-"),
    buildTableRow("Quadratmeter", submission.squareMeters ? `${submission.squareMeters} m²` : "-"),
    buildTableRow("Gebäudetyp", submission.buildingType || "-"),
    buildTableRow("Baujahr", submission.constructionYear || "-"),
    buildTableRow("Stockwerk", submission.floor || "-"),
    buildTableRow("Aufzug", submission.elevator || "-"),
    buildTableRow("Auswahl", itemSelection.join(", ") || "-"),
    buildTableRow("Mengeneinschätzung", submission.quantityEstimate || "-"),
    buildTableRow("Sonderangaben", specialFlags.join(", ") || "-"),
    buildTableRow("Baugenehmigung", submission.permitStatus || "-"),
    buildTableRow("Wunschtermin", submission.desiredDate || "-"),
    buildTableRow("Bilddateien", (submission.imageFileNames ?? []).join(", ") || "-"),
    buildTableRow("Notizen", submission.notes || "-"),
  ].join("")

  const notesList = flags.length > 0 ? flags.map((item) => `<li>${escapeHtml(item)}</li>`).join("") : "<li>Keine besonderen Auffälligkeiten.</li>"

  return `
    <!DOCTYPE html>
    <html lang="de">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Neues Angebot</title>
      </head>
      <body style="margin:0;padding:24px;background:#0a0a0a;font-family:Arial,sans-serif;">
        <div style="max-width:760px;margin:0 auto;background:#1a1a1a;border:1px solid #2a2a2a;border-radius:16px;padding:24px;">
          <h1 style="margin:0 0 16px 0;color:#c9a45c;font-size:24px;">Neues Angebot</h1>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">${rows}</table>
          <div style="border:1px solid #2a2a2a;border-radius:12px;padding:16px;background:#0a0a0a;">
            <h2 style="margin:0 0 12px 0;color:#c9a45c;font-size:18px;">Automatische Bewertung</h2>
            <p style="margin:0 0 8px 0;color:#ffffff;">Komplexität: <strong>${escapeHtml(complexityLevel)}</strong> (Score: ${complexityScore})</p>
            <p style="margin:0 0 8px 0;color:#ffffff;">Geschätzter Aufwand: <strong>${escapeHtml(effortRange)}</strong></p>
            <p style="margin:0 0 12px 0;color:#ffffff;">Preisspanne: <strong>${estimateMin} € – ${estimateMax} €</strong></p>
            <div>
              <p style="margin:0 0 8px 0;color:rgba(255,255,255,0.7);">Hinweise</p>
              <ul style="margin:0;padding-left:20px;color:#ffffff;">${notesList}</ul>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

function createFileName(name: string) {
  const safeName = name.replace(/[^a-zA-Z0-9äöüÄÖÜß]+/g, "").slice(0, 50) || "Anfrage"
  return `${Date.now()}-${safeName}.json`
}


async function sendQuoteNotificationEmail({
  submission,
  complexity,
  estimate,
}: {
  submission: QuoteSubmission
  complexity: ReturnType<typeof evaluateComplexity>
  estimate: ReturnType<typeof estimatePriceRange>
}) {
  // Interne Benachrichtigung
  if (process.env.NOTIFICATION_EMAIL) {
    const html = buildEmailHtml(
      submission,
      complexity.score,
      complexity.level,
      complexity.effortRange,
      estimate.min,
      estimate.max,
      complexity.flags
    )

    await sendEmail({
      to: process.env.NOTIFICATION_EMAIL,
      subject: `Neues Angebot — ${submission.type || "Anfrage"} von ${submission.name}`,
      html,
    })
  }

  // Kunden-Bestätigung
  if (submission.email) {
    const customerHtml = `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Ihre Anfrage bei High-End Homes</title>
        </head>
        <body style="margin:0;padding:24px;background:#f9fafb;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
            <h1 style="margin:0 0 16px 0;color:#111827;font-size:24px;">Ihre Anfrage bei High-End Homes</h1>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Sehr geehrte/r ${escapeHtml(submission.name)},
            </p>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              vielen Dank für Ihre Anfrage bezüglich <strong>${escapeHtml(submission.type || "Ihrem Projekt")}</strong>. Wir haben Ihre Angaben erhalten und werden uns zeitnah bei Ihnen melden.
            </p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
              <h2 style="margin:0 0 12px 0;color:#111827;font-size:16px;">Ihre Angaben</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Service:</td>
                  <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(submission.type || "-")}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Adresse:</td>
                  <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;text-align:right;">${escapeHtml(submission.address || "-")}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Fläche:</td>
                  <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;text-align:right;">${submission.squareMeters ? `${submission.squareMeters} m²` : "-"}</td>
                </tr>
              </table>
            </div>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Wir prüfen Ihre Anfrage und setzen uns in Kürze mit Ihnen in Verbindung, um weitere Details zu besprechen und Ihnen ein unverbindliches Angebot zu unterbreiten.
            </p>
            <p style="margin:0 0 8px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Mit freundlichen Grüßen<br />
              <strong>High-End Homes</strong><br />
              Bennet Pfeifer<br />
              bennet.pfeifer@highendhomes.de
            </p>
            <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0;" />
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
              High-End Homes<br />
              Fachbetrieb für Entkernung, Entrümpelung und Hausauflösung<br />
              Heidelberg & Rhein-Neckar
            </p>
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: submission.email,
      subject: `Ihre Anfrage bei High-End Homes - ${submission.type || "Bestätigung"}`,
      html: customerHtml,
    })
  }
}

function resolveQuoteArchiveDirectory() {
  const configuredDirectory = normalizeString(process.env.QUOTE_ARCHIVE_DIR)

  if (configuredDirectory) {
    return configuredDirectory
  }

  if (process.env.NODE_ENV !== "production") {
    return path.join(process.cwd(), "data", "quotes")
  }

  return ""
}

async function archiveQuoteSubmission(fileNameBase: string, payload: Record<string, unknown>) {
  const quotesDirectory = resolveQuoteArchiveDirectory()

  if (!quotesDirectory) {
    return
  }

  await mkdir(quotesDirectory, { recursive: true })
  await writeFile(path.join(quotesDirectory, createFileName(fileNameBase)), JSON.stringify(payload, null, 2), "utf8")
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: buildCorsHeaders(request),
  })
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.json()
    const submission = normalizeSubmission(rawBody)
    const persistedSubmission = sanitizeQuotePayloadForPersistence(submission)

    if (!submission.name || !submission.email) {
      return jsonWithCors(
        request,
        { success: false, error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      )
    }

    const complexity = evaluateComplexity(submission)
    const estimate = estimatePriceRange(submission, complexity)

    const savedRequest = await prisma.quoteRequest.create({
      data: {
        type: submission.type || "Anfrage",
        name: submission.name,
        email: submission.email,
        phone: submission.phone || null,
        company: submission.company || null,
        address: submission.address || null,
        squareMeters: Math.max(Number(submission.squareMeters) || 0, 0),
        buildingType: submission.buildingType || "Nicht angegeben",
        constructionYear: submission.constructionYear || null,
        floor: submission.floor || null,
        elevator: submission.elevator || null,
        materialsJson: JSON.stringify(submission.materials ?? []),
        removalItemsJson: JSON.stringify(submission.removalItems ?? []),
        quantityEstimate: submission.quantityEstimate || null,
        valuables: submission.valuables || null,
        asbestosRequired: submission.asbestosRequired === true,
        otherPollutants: submission.otherPollutants === true,
        disposalWanted: submission.disposalWanted === true,
        permitStatus: submission.permitStatus || null,
        desiredDate: submission.desiredDate || null,
        imageFileNamesJson: JSON.stringify(submission.imageFileNames ?? []),
        // Base64-Bilder nicht in DB speichern (Performance) - nur Filenames
        imagesBase64Json: "[]",
        notes: submission.notes || null,
        complexityScore: complexity.score,
        complexityLevel: complexity.level,
        effortRange: complexity.effortRange,
        complexityFlagsJson: JSON.stringify(complexity.flags),
        estimatedMinPrice: estimate.min,
        estimatedMaxPrice: estimate.max,
        payloadJson: JSON.stringify(persistedSubmission),
      },
    })

    // E-Mail und Archivierung asynchron ausführen (nicht blockieren)
    sendQuoteNotificationEmail({ submission, complexity, estimate }).catch(console.error)
    archiveQuoteSubmission(submission.name, {
      ...submission,
      complexity,
      estimate,
      databaseId: savedRequest.id,
      createdAt: new Date().toISOString(),
    }).catch(console.error)

    return jsonWithCors(request, { success: true, id: savedRequest.id, estimate, complexity })
  } catch (error) {
    return jsonWithCors(
      request,
      { 
        success: false, 
        error: "Die Anfrage konnte nicht verarbeitet werden.",
        details: process.env.NODE_ENV !== "production" ? (error instanceof Error ? error.message : String(error)) : undefined
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = (await request.json()) as MailSharePayload
    const recipientEmail = normalizeString(body.recipientEmail)

    if (!recipientEmail) {
      return jsonWithCors(request, { success: false, error: "Empfänger-E-Mail fehlt." }, { status: 400 })
    }

    // E-Mail-Versand deaktiviert - Link wird nur zurückgegeben
    const formUrl = normalizeString(body.formUrl) || resolveAppUrl()

    return jsonWithCors(request, { success: true, formUrl })
  } catch {
    return jsonWithCors(request, { success: false, error: "Der Link konnte nicht generiert werden." }, { status: 500 })
  }
}
