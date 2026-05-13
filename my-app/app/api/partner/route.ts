import { NextRequest, NextResponse } from "next/server"

import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function escape(value: unknown): string {
  if (value == null) return ""
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { company, contact, trade, employees, region, email, phone, website, message } = body

    if (!company || !contact || !email || !trade) {
      return NextResponse.json(
        { error: "Firma, Ansprechpartner, E-Mail und Gewerk sind erforderlich." },
        { status: 400 },
      )
    }

    const recipient = process.env.PARTNERS_EMAIL || process.env.CONTACT_EMAIL || "bennet.pfeifer@highendhomes.de"

    const html = `
      <h2 style="font-family:Arial,sans-serif;">Neue Partner-Anfrage – ${escape(trade)}</h2>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;color:#555;">Firma</td><td style="padding:6px 12px;"><strong>${escape(company)}</strong></td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Ansprechpartner</td><td style="padding:6px 12px;">${escape(contact)}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Gewerk</td><td style="padding:6px 12px;">${escape(trade)}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Mitarbeiter</td><td style="padding:6px 12px;">${escape(employees) || "-"}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Region</td><td style="padding:6px 12px;">${escape(region) || "-"}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">E-Mail</td><td style="padding:6px 12px;">${escape(email)}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Telefon</td><td style="padding:6px 12px;">${escape(phone) || "-"}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Website</td><td style="padding:6px 12px;">${escape(website) || "-"}</td></tr>
      </table>
      ${
        message
          ? `<h3 style="font-family:Arial,sans-serif;margin-top:24px;">Nachricht</h3>
             <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap;">${escape(message)}</p>`
          : ""
      }
      <p style="color:#999;font-size:12px;margin-top:32px;">Eingegangen ${new Date().toLocaleString("de-DE")}</p>
    `

    const internal = await sendEmail({
      to: recipient,
      subject: `Partner-Anfrage – ${trade} – ${company}`,
      html,
    })

    if (!internal.success) {
      return NextResponse.json({ error: "Mailversand fehlgeschlagen." }, { status: 500 })
    }

    await sendEmail({
      to: email,
      subject: "Ihre Partner-Anfrage bei High-End Homes",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;padding:32px;background:#fff;border:1px solid #eee;border-radius:12px;">
          <h2 style="margin:0 0 16px 0;">Anfrage erhalten</h2>
          <p style="line-height:1.6;color:#444;">Hallo ${escape(contact)},</p>
          <p style="line-height:1.6;color:#444;">
            danke für Ihre Anfrage. Wir melden uns innerhalb weniger Tage bei <strong>${escape(company)}</strong>, um die nächsten Schritte zu besprechen.
          </p>
          <p style="line-height:1.6;color:#444;margin-top:24px;">
            Viele Grüße<br/>
            <strong>High-End Homes</strong><br/>
            Bennet Pfeifer
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[partner] error:", err)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
