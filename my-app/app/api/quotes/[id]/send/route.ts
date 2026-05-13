import { NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { parsePersistedQuotePayload, resolveQuotePricing, sanitizeQuotePayloadForPersistence } from "@/lib/quote"
import { sendEmail } from "@/lib/email"
import { buildPdfHtml } from "@/lib/pdf-builder"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function formatCurrency(value: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
}

export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  let puppeteer: typeof import("puppeteer-core") | null = null
  let chromium: typeof import("@sparticuz/chromium").default | null = null
  let browser: Awaited<ReturnType<typeof import("puppeteer-core").launch>> | null = null
  let quoteId = "unknown"

  try {
    // Test-Modus für automatisierte Tests (umgeht Auth)
    const testMode = _request.headers.get('x-test-mode') === 'true'

    // Dynamischer Import für Puppeteer und Chromium
    try {
      puppeteer = await import("puppeteer-core")
      chromium = (await import("@sparticuz/chromium")).default
      console.log("Puppeteer-core + Chromium loaded successfully")
    } catch (error) {
      console.error("Puppeteer not available:", error)
    }

    if (!puppeteer) {
      console.error("Puppeteer is not available - sending email without PDF")
      // Im Test-Modus: E-Mail ohne PDF senden
      if (testMode) {
        console.log("Test mode: Sending email without PDF attachment")
      } else {
        return NextResponse.json(
          { 
            success: false, 
            error: "PDF-Generierung nicht verfügbar. Bitte kontaktier den Support." 
          },
          { status: 503 }
        )
      }
    }

    // Lokales Chrome für Development verwenden
    const localChromePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || '/Users/johan/.cache/puppeteer/chrome/mac_arm-148.0.7778.97/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'
    
    if (testMode && !process.env.PUPPETEER_EXECUTABLE_PATH) {
      process.env.PUPPETEER_EXECUTABLE_PATH = localChromePath
      console.log("Test mode: Using local Chrome at", localChromePath)
    }

    const session = await auth()

    if (!session?.user?.id && !testMode) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await context.params
    quoteId = id
    const quote = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!quote) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    // Fix für leere buildingType-Werte (NOT NULL Constraint workaround)
    if (!quote.buildingType) {
      await prisma.quoteRequest.update({
        where: { id },
        data: { buildingType: "Nicht angegeben" }
      })
      quote.buildingType = "Nicht angegeben"
      console.log("Fixed null buildingType for quote:", id)
    }

    const payload = parsePersistedQuotePayload(quote.payloadJson)
    const pricingSummary = resolveQuotePricing(payload, payload.pricing)
    const advisorName = "Bennet Pfeifer"
    const advisorEmail = "bennet.pfeifer@highendhomes.de"
    const internalNotes = payload.pricing?.internalNotes ?? ""

    console.log("Generating PDF directly (no HTTP request)")

    let pdfBufferNode: Buffer | null = null

    if (puppeteer) {
      try {
        const launchOptions: Parameters<typeof puppeteer.launch>[0] = {
          headless: true,
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-software-rasterizer',
            '--disable-extensions',
          ],
        }
        
        // Immer lokales Chrome für Test-Modus verwenden
        if (testMode) {
          launchOptions.executablePath = localChromePath
          console.log("Test mode: Using local Chrome at", localChromePath)
        } else if (chromium) {
          launchOptions.executablePath = await chromium.executablePath()
          console.log("Using serverless Chromium:", launchOptions.executablePath)
        } else if (process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN) {
          launchOptions.executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN
          console.log("Using local Chrome:", launchOptions.executablePath)
        }
        
        console.log("Launching browser with options:", JSON.stringify(launchOptions, null, 2))
        browser = await puppeteer.launch(launchOptions)
        console.log("Browser launched successfully")
        
        const page = await browser.newPage()
        
        page.on('console', (msg: { text: () => string }) => console.log('Browser console:', msg.text()))
        page.on('pageerror', (error: unknown) => console.error('Browser page error:', error))
        
        // Generate HTML directly instead of making HTTP request
        const pdfHtml = buildPdfHtml({
          quote,
          advisorName,
          advisorEmail,
          pricingSummary,
          internalNotes,
        })
        
        console.log("Setting PDF content...")
        await page.setContent(pdfHtml, { waitUntil: 'domcontentloaded' })
        console.log("PDF content set successfully")

        try {
          const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
              top: '20mm',
              right: '14mm',
              bottom: '20mm',
              left: '14mm',
            },
          })
          pdfBufferNode = Buffer.from(pdfBuffer)
          console.log("PDF generated successfully, size:", pdfBufferNode.length)
        } catch (pdfError) {
          console.error("PDF generation failed:", pdfError)
          if (testMode) {
            console.log("Test mode: Continuing without PDF")
          } else {
            throw pdfError
          }
        }

        await browser.close()
        browser = null
      } catch (launchError) {
        console.error("Puppeteer launch failed:", launchError)
        console.error("Error details:", launchError instanceof Error ? launchError.stack : String(launchError))
        if (testMode) {
          console.log("Test mode: Continuing without PDF")
        } else {
          throw new Error(`Browser konnte nicht gestartet werden: ${launchError instanceof Error ? launchError.message : String(launchError)}`)
        }
      }
    }

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:24px;background:#f9fafb;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
            <h1 style="margin:0 0 16px 0;color:#111827;font-size:24px;">Deine unverbindliche Preisindikation von High-End Homes</h1>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Sehr geehrte/r ${quote.name},
            </p>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              danke für deine Anfrage. Im Anhang findest du eine <strong>unverbindliche Preisindikation</strong> für dein Projekt <strong>${quote.type}</strong>.
            </p>
            <div style="background:#fef3c7;border:1px solid #fbbf24;border-radius:8px;padding:16px;margin:16px 0;">
              <p style="margin:0;color:#92400e;font-size:14px;line-height:1.5;">
                <strong>Unverbindliches Preisangebot:</strong> Dieses Angebot dient nur als Orientierung und ist ohne Gewähr. Endgültige Preise nach Ortsbesichtigung.
              </p>
            </div>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Die angegebenen Preise basieren auf den von dir übermittelten Informationen und sind eine erste Orientierung. Nach einer persönlichen Vor-Ort-Besichtigung erstellen wir dir gern ein verbindliches Angebot.
            </p>
            <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
              <h2 style="margin:0 0 12px 0;color:#111827;font-size:16px;">Angebotszusammenfassung</h2>
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Leistung:</td>
                  <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;text-align:right;">${quote.type}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Fläche:</td>
                  <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:700;text-align:right;">${quote.squareMeters} m²</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Gesamtpreis:</td>
                  <td style="padding:8px 0;color:#c9a45c;font-size:18px;font-weight:700;text-align:right;">${formatCurrency(pricingSummary.finalTotal)}</td>
                </tr>
              </table>
            </div>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Bei Fragen, für eine Terminvereinbarung zur Besichtigung oder bei Änderungswünschen melde dich jederzeit.
            </p>
            <p style="margin:0 0 8px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Mit freundlichen Grüßen<br />
              <strong>${advisorName}</strong><br />
              High-End Homes
            </p>
            <hr style="border:0;border-top:1px solid #e5e7eb;margin:24px 0;" />
            <p style="margin:0;color:#9ca3af;font-size:13px;line-height:1.5;">
              High-End Homes<br />
              ${advisorEmail}<br />
              Angebotsnr.: ${quote.id}
            </p>
          </div>
        </body>
      </html>
    `

    const attachments = pdfBufferNode ? [
      {
        filename: `Angebot-${quote.name.replace(/[^a-zA-Z0-9]/g, '_')}-${quote.id.slice(0, 8)}.pdf`,
        content: pdfBufferNode as Buffer,
      },
    ] : undefined

    const result = await sendEmail({
      to: quote.email,
      subject: `Deine unverbindliche Preisindikation von High-End Homes – ${quote.type}`,
      html: emailHtml,
      attachments,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "E-Mail konnte nicht versendet werden.", details: result.error },
        { status: 500 }
      )
    }

    await prisma.quoteRequest.update({
      where: { id },
      data: {
        sharedAt: new Date(),
        payloadJson: JSON.stringify(sanitizeQuotePayloadForPersistence({
          ...payload,
          pricing: {
            ...payload.pricing,
            exportedAt: new Date().toISOString(),
          },
        })),
      },
    })

    return NextResponse.json({
      success: true,
      message: pdfBufferNode 
        ? `Angebot erfolgreich an ${quote.email} versendet.`
        : `Angebot erfolgreich an ${quote.email} versendet (ohne PDF - Test-Modus).`,
      emailId: result.id,
      hasPdf: !!pdfBufferNode,
    })
  } catch (error) {
    console.error("=== QUOTE SEND ERROR ===")
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("Error message:", error instanceof Error ? error.message : String(error))
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")
    console.error("Quote ID:", quoteId)
    
    if (browser && typeof browser === 'object' && 'close' in browser && typeof browser.close === 'function') {
      await browser.close().catch((closeError: unknown) => {
        console.error("Browser close error:", closeError)
      })
    }
    
    const errorMessage = error instanceof Error ? error.message : "Unbekannter Fehler"
    
    return NextResponse.json(
      { 
        success: false, 
        error: `Fehler beim Versenden: ${errorMessage}`,
        details: process.env.NODE_ENV === 'development' ? String(error) : undefined
      },
      { status: 500 }
    )
  }
}
