import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

// Lazy initialization of Resend client
let resend: Resend | null = null
function getResend() {
  if (!resend && process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

// Price calculation constants (per square meter)
const BASE_PRICE_PER_SQM = 12 // Base price per sqm
const ASBESTOS_EXTRA = 15 // Extra per sqm for asbestos

// Building type multipliers
const BUILDING_MULTIPLIERS: Record<string, number> = {
  wohnung: 1.0,
  haus: 1.1,
  gewerbe: 1.3,
  buero: 1.2,
  lager: 1.4,
  industrie: 1.5,
}

// Material complexity factors (affects duration)
const MATERIAL_COMPLEXITY: Record<string, number> = {
  holz: 1.0,
  metall: 1.3,
  kunststoff: 1.1,
  glas: 1.4,
  elektronik: 1.5,
  moebel: 1.2,
  textilien: 0.9,
  baumaterial: 1.3,
}

interface QuoteRequest {
  squareMeters: string
  buildingType: string
  materials: string
  asbestos: string
  email: string
  notes: string
}

function calculateQuote(data: QuoteRequest) {
  const sqm = parseInt(data.squareMeters) || 0
  const buildingType = data.buildingType || "wohnung"
  const materials = JSON.parse(data.materials || "[]") as string[]
  const hasAsbestos = data.asbestos === "true"

  // Calculate base price
  const buildingMultiplier = BUILDING_MULTIPLIERS[buildingType] || 1.0
  let pricePerSqm = BASE_PRICE_PER_SQM * buildingMultiplier

  // Add asbestos extra if applicable
  if (hasAsbestos) {
    pricePerSqm += ASBESTOS_EXTRA
  }

  // Calculate complexity factor based on materials
  const complexitySum = materials.reduce((sum, material) => {
    return sum + (MATERIAL_COMPLEXITY[material] || 1.0)
  }, 0)
  const avgComplexity = materials.length > 0 ? complexitySum / materials.length : 1.0

  // Add complexity adjustment to price (±20%)
  const complexityAdjustment = (avgComplexity - 1.0) * 0.4
  pricePerSqm = pricePerSqm * (1 + complexityAdjustment)

  // Calculate total price range (±15% for min/max)
  const baseTotal = sqm * pricePerSqm
  const minPrice = Math.round(baseTotal * 0.85)
  const maxPrice = Math.round(baseTotal * 1.15)

  // Calculate duration (days)
  // Base: 1 day per 50 sqm, adjusted by complexity
  const baseDays = sqm / 50
  const adjustedDays = baseDays * avgComplexity
  const minDays = Math.max(1, Math.round(adjustedDays * 0.8))
  const maxDays = Math.max(minDays, Math.round(adjustedDays * 1.3))

  return {
    priceRange: {
      min: minPrice,
      max: maxPrice,
    },
    durationRange: {
      min: minDays,
      max: maxDays,
    },
  }
}

function generateEmailContent(
  data: QuoteRequest,
  quote: ReturnType<typeof calculateQuote>
) {
  const buildingTypes: Record<string, string> = {
    wohnung: "Wohnung",
    haus: "Einfamilienhaus",
    gewerbe: "Gewerbeobjekt",
    buero: "Bürogebäude",
    lager: "Lagerhalle",
    industrie: "Industriegebäude",
  }

  const materialLabels: Record<string, string> = {
    holz: "Holz",
    metall: "Metall",
    kunststoff: "Kunststoff",
    glas: "Glas",
    elektronik: "Elektronik",
    moebel: "Möbel",
    textilien: "Textilien",
    baumaterial: "Baumaterialien",
  }

  const materials = JSON.parse(data.materials || "[]") as string[]
  const hasAsbestos = data.asbestos === "true"

  return {
    subject: "Ihr Angebot von High-End Homes",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ihr Angebot von High-End Homes</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0a0a0a; color: #fafafa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a; border-radius: 8px; overflow: hidden; max-width: 100%;">
          <!-- Header -->
          <tr>
            <td style="padding: 30px; background-color: #0a0a0a; text-align: center; border-bottom: 2px solid #c9a45c;">
              <h1 style="margin: 0; color: #c9a45c; font-size: 28px; font-weight: bold;">High-End Homes</h1>
              <p style="margin: 10px 0 0 0; color: #fafafa; font-size: 14px;">Professionelle Entrümpelung & Entkernung</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="color: #c9a45c; font-size: 20px; margin: 0 0 20px 0;">Ihr persönliches Angebot</h2>
              
              <p style="color: #fafafa; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Vielen Dank für Ihre Anfrage. Basierend auf Ihren Angaben haben wir folgende Schätzung erstellt:
              </p>
              
              <!-- Quote Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #c9a45c; font-size: 16px; margin: 0 0 15px 0;">Kostenschätzung</h3>
                    <p style="color: #fafafa; font-size: 24px; font-weight: bold; margin: 0 0 5px 0;">
                      ${quote.priceRange.min.toLocaleString("de-DE")} € - ${quote.priceRange.max.toLocaleString("de-DE")} €
                    </p>
                    <p style="color: #737373; font-size: 12px; margin: 0;">inkl. MwSt.</p>
                  </td>
                </tr>
              </table>
              
              <!-- Duration Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; border-radius: 8px; margin: 20px 0;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="color: #c9a45c; font-size: 16px; margin: 0 0 15px 0;">Geschätzte Dauer</h3>
                    <p style="color: #fafafa; font-size: 20px; font-weight: bold; margin: 0;">
                      ${quote.durationRange.min} - ${quote.durationRange.max} Tage
                    </p>
                  </td>
                </tr>
              </table>
              
              <!-- Project Details -->
              <h3 style="color: #c9a45c; font-size: 16px; margin: 30px 0 15px 0;">Ihre Projektdetails</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 0; color: #737373; width: 150px;">Quadratmeter:</td>
                  <td style="padding: 8px 0; color: #fafafa;">${data.squareMeters} m²</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #737373;">Gebäudetyp:</td>
                  <td style="padding: 8px 0; color: #fafafa;">${buildingTypes[data.buildingType] || data.buildingType}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #737373; vertical-align: top;">Materialien:</td>
                  <td style="padding: 8px 0; color: #fafafa;">
                    ${materials.map((m) => materialLabels[m] || m).join(", ") || "Keine Angabe"}
                  </td>
                </tr>
                ${hasAsbestos ? `
                <tr>
                  <td style="padding: 8px 0; color: #737373;">Asbest:</td>
                  <td style="padding: 8px 0; color: #c9a45c;">Zertifizierte Entsorgung erforderlich</td>
                </tr>
                ` : ""}
              </table>
              
              ${data.notes ? `
              <h3 style="color: #c9a45c; font-size: 16px; margin: 20px 0 10px 0;">Zusätzliche Hinweise</h3>
              <p style="color: #fafafa; font-size: 14px; line-height: 1.6; margin: 0;">${data.notes}</p>
              ` : ""}
              
              <!-- Disclaimer -->
              <p style="color: #737373; font-size: 12px; line-height: 1.6; margin: 30px 0 0 0; border-top: 1px solid #2a2a2a; padding-top: 20px;">
                * Dies ist eine unverbindliche Kostenschätzung basierend auf Ihren Angaben. 
                Der endgültige Preis kann nach einer kostenlosen Besichtigung vor Ort variieren.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #0a0a0a; border-top: 1px solid #2a2a2a;">
              <p style="color: #737373; font-size: 12px; margin: 0 0 10px 0; text-align: center;">
                <strong style="color: #fafafa;">High-End Homes</strong><br>
                Bennet Pfeifer<br>
                Gerhard-Hauptmann Straße 38<br>
                69221 Dossenheim
              </p>
              <p style="color: #737373; font-size: 12px; margin: 0; text-align: center;">
                Dieses Angebot wurde am ${new Date().toLocaleDateString("de-DE")} erstellt.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const data: QuoteRequest = {
      squareMeters: formData.get("squareMeters") as string,
      buildingType: formData.get("buildingType") as string,
      materials: formData.get("materials") as string,
      asbestos: formData.get("asbestos") as string,
      email: formData.get("email") as string,
      notes: formData.get("notes") as string,
    }

    // Validate required fields
    if (!data.squareMeters || !data.buildingType || !data.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Calculate quote
    const quote = calculateQuote(data)

    // Generate email content
    const emailContent = generateEmailContent(data, quote)

    // Send email using Resend
    // Note: Replace with your verified domain email
    const resendClient = getResend()
    if (resendClient) {
      try {
        await resendClient.emails.send({
          from: "High-End Homes <info@high-end-homes.de>",
          to: data.email,
          subject: emailContent.subject,
          html: emailContent.html,
        })
      } catch (emailError) {
        console.error("Email sending failed:", emailError)
        // Continue without failing - we still return the quote
      }
    }

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Quote calculation error:", error)
    return NextResponse.json(
      { error: "Failed to calculate quote" },
      { status: 500 }
    )
  }
}
