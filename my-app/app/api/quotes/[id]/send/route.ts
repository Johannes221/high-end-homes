import { NextRequest, NextResponse } from "next/server"
import puppeteer from "puppeteer"

import { auth } from "@/lib/auth"
import { sendEmail } from "@/lib/email"
import { prisma } from "@/lib/prisma"
import { parsePersistedQuotePayload, resolveQuotePricing } from "@/lib/quote"

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
  let browser: Awaited<ReturnType<typeof puppeteer.launch>> | null = null

  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Nicht eingeloggt." }, { status: 401 })
    }

    const { id } = await context.params
    const quote = await prisma.quoteRequest.findUnique({ where: { id } })

    if (!quote) {
      return NextResponse.json({ success: false, error: "Anfrage nicht gefunden." }, { status: 404 })
    }

    const payload = parsePersistedQuotePayload(quote.payloadJson)
    const pricingSummary = resolveQuotePricing(payload, payload.pricing)
    const advisorName = session.user.name || quote.approvedBy || "Bennet Pfeifer"
    const advisorEmail = session.user.email || "bennet.pfeifer@highendhomes.de"

    const baseUrl = process.env.AUTH_URL || process.env.NEXTAUTH_URL || 'http://localhost:3001'
    const pdfUrl = `${baseUrl}/api/quotes/${id}/pdf`

    console.log("Generating PDF from:", pdfUrl)
    console.log("Puppeteer executable:", process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || '/usr/bin/chromium')

    try {
      browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-software-rasterizer',
          '--disable-extensions',
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN,
      })
    } catch (launchError) {
      console.error("Puppeteer launch failed:", launchError)
      throw new Error(`Browser konnte nicht gestartet werden: ${launchError instanceof Error ? launchError.message : String(launchError)}`)
    }

    const page = await browser.newPage()
    
    page.on('console', (msg) => console.log('Browser console:', msg.text()))
    page.on('pageerror', (error) => console.error('Browser page error:', error))
    
    try {
      await page.goto(pdfUrl, { waitUntil: 'networkidle0', timeout: 30000 })
    } catch (gotoError) {
      console.error("Page navigation failed:", gotoError)
      throw new Error(`PDF-Seite konnte nicht geladen werden: ${gotoError instanceof Error ? gotoError.message : String(gotoError)}`)
    }

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

    await browser.close()
    browser = null

    const pdfBufferNode = Buffer.from(pdfBuffer)

    const emailHtml = `
      <!DOCTYPE html>
      <html lang="de">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="margin:0;padding:24px;background:#f9fafb;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
            <h1 style="margin:0 0 16px 0;color:#111827;font-size:24px;">Ihre unverbindliche Preisindikation von High-End Homes</h1>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Sehr geehrte/r ${quote.name},
            </p>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              vielen Dank für Ihre Anfrage. Im Anhang finden Sie eine <strong>unverbindliche Preisindikation</strong> für Ihr Projekt <strong>${quote.type}</strong>.
            </p>
            <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
              Die angegebenen Preise basieren auf den von Ihnen übermittelten Informationen und stellen eine erste Orientierung dar. Nach einer persönlichen Vor-Ort-Besichtigung erstellen wir Ihnen gerne ein verbindliches Angebot.
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
              Bei Fragen, für eine Terminvereinbarung zur Besichtigung oder bei Änderungswünschen stehen wir Ihnen gerne zur Verfügung.
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

    const result = await sendEmail({
      to: quote.email,
      subject: `Ihre unverbindliche Preisindikation von High-End Homes – ${quote.type}`,
      html: emailHtml,
      attachments: [
        {
          filename: `Angebot-${quote.name.replace(/[^a-zA-Z0-9]/g, '_')}-${quote.id.slice(0, 8)}.pdf`,
          content: pdfBufferNode,
        },
      ],
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
        payloadJson: JSON.stringify({
          ...payload,
          pricing: {
            ...payload.pricing,
            exportedAt: new Date().toISOString(),
          },
        }),
      },
    })

    return NextResponse.json({
      success: true,
      message: `Angebot erfolgreich an ${quote.email} versendet.`,
      emailId: result.id,
    })
  } catch (error) {
    console.error("Quote send error:", error)

    if (browser) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error("Browser close error:", closeError)
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: "Angebot konnte nicht versendet werden.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
