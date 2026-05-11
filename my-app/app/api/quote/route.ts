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
  type QuoteSubmission,
} from "@/lib/quote"

export const runtime = 'nodejs';
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
  if (!process.env.NOTIFICATION_EMAIL) {
    return
  }

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
    console.log("=== QUOTE SUBMISSION START ===")
    console.log("Request method:", request.method)
    console.log("Request URL:", request.url)
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))
    
    const rawBody = await request.json()
    console.log("Raw body received:", JSON.stringify(rawBody, null, 2))
    
    const submission = normalizeSubmission(rawBody)
    console.log("Normalized submission:", JSON.stringify(submission, null, 2))

    if (!submission.name || !submission.email) {
      console.log("Validation failed - missing fields:", {
        name: !!submission.name,
        email: !!submission.email,
      })
      return jsonWithCors(
        request,
        { success: false, error: "Bitte füllen Sie alle Pflichtfelder aus." },
        { status: 400 }
      )
    }

    const complexity = evaluateComplexity(submission)
    const estimate = estimatePriceRange(submission, complexity)

    console.log("Creating quote request in database...")
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
        imagesBase64Json: JSON.stringify(submission.imagesBase64 ?? []),
        notes: submission.notes || null,
        complexityScore: complexity.score,
        complexityLevel: complexity.level,
        effortRange: complexity.effortRange,
        complexityFlagsJson: JSON.stringify(complexity.flags),
        estimatedMinPrice: estimate.min,
        estimatedMaxPrice: estimate.max,
        payloadJson: JSON.stringify(submission),
      },
    })
    console.log("Quote saved with ID:", savedRequest.id)

    console.log("Sending notification email...")
    await sendQuoteNotificationEmail({ submission, complexity, estimate })
    console.log("Email sent successfully")

    console.log("Archiving submission...")
    await archiveQuoteSubmission(submission.name, {
      ...submission,
      complexity,
      estimate,
      databaseId: savedRequest.id,
      createdAt: new Date().toISOString(),
    })
    console.log("Submission archived")

    console.log("=== QUOTE SUBMISSION SUCCESS ===")
    return jsonWithCors(request, { success: true, id: savedRequest.id, estimate, complexity })
  } catch (error) {
    console.error("Quote API error:", error)
    console.error("Error details:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    })
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
  } catch (error) {
    console.error("Quote share error:", error)
    return jsonWithCors(request, { success: false, error: "Der Link konnte nicht generiert werden." }, { status: 500 })
  }
}
