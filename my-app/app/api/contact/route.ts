import { NextRequest, NextResponse } from "next/server"

import { sendEmail } from "@/lib/email"

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, service } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, E-Mail und Nachricht sind erforderlich" },
        { status: 400 }
      )
    }

    console.log("Contact form submission:", {
      name,
      email,
      phone,
      message,
      service,
      timestamp: new Date().toISOString(),
    })

    // Interne Benachrichtigung
    await sendEmail({
      to: process.env.CONTACT_EMAIL || "bennet.pfeifer@highendhomes.de",
      subject: service 
        ? `Neue Kontaktanfrage - ${service}` 
        : "Neue Kontaktanfrage",
      html: `
        <h2>Neue Kontaktanfrage</h2>
        ${service ? `<p><strong>Service:</strong> ${service}</p>` : ""}
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>E-Mail:</strong> ${email}</p>
        ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
        <p><strong>Nachricht:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">Gesendet am ${new Date().toLocaleString("de-DE")}</p>
      `,
    })

    // Kunden-Bestätigung
    await sendEmail({
      to: email,
      subject: "Deine Kontaktanfrage bei High-End Homes",
      html: `
        <!DOCTYPE html>
        <html lang="de">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="margin:0;padding:24px;background:#f9fafb;font-family:Arial,sans-serif;">
            <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
              <h1 style="margin:0 0 16px 0;color:#111827;font-size:24px;">Deine Kontaktanfrage bei High-End Homes</h1>
              <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
                Hi ${name},
              </p>
              <p style="margin:0 0 16px 0;color:#4b5563;font-size:15px;line-height:1.6;">
                danke für deine Nachricht. Wir haben deine Anfrage erhalten und melden uns zeitnah bei dir.
              </p>
              <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:20px;margin:24px 0;">
                <h2 style="margin:0 0 12px 0;color:#111827;font-size:16px;">Deine Nachricht</h2>
                <p style="margin:0 0 8px 0;color:#4b5563;font-size:14px;line-height:1.5;">${message.replace(/\n/g, "<br>")}</p>
                ${service ? `<p style="margin:0;color:#6b7280;font-size:13px;">Betreff: ${service}</p>` : ""}
              </div>
              <p style="margin:0 0 8px 0;color:#4b5563;font-size:15px;line-height:1.6;">
                Viele Grüße<br />
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
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    )
  }
}
