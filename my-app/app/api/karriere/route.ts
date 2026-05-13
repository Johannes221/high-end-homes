import { NextRequest, NextResponse } from "next/server"

import { sendEmail } from "@/lib/email"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type AttachmentInput = {
  name?: string
  mime?: string
  data?: string
}

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
    const { position, name, email, phone, experience, availability, message } = body
    const attachment = body.attachment as AttachmentInput | undefined

    if (!name || !email || !position) {
      return NextResponse.json(
        { error: "Name, E-Mail und Position sind erforderlich." },
        { status: 400 },
      )
    }

    const recipient = process.env.CAREERS_EMAIL || process.env.CONTACT_EMAIL || "bennet.pfeifer@highendhomes.de"

    const attachments =
      attachment?.data && attachment.name
        ? [
            {
              filename: attachment.name,
              content: Buffer.from(attachment.data, "base64"),
            },
          ]
        : undefined

    const html = `
      <h2 style="font-family:Arial,sans-serif;">Neue Bewerbung – ${escape(position)}</h2>
      <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;">
        <tr><td style="padding:6px 12px;color:#555;">Name</td><td style="padding:6px 12px;"><strong>${escape(name)}</strong></td></tr>
        <tr><td style="padding:6px 12px;color:#555;">E-Mail</td><td style="padding:6px 12px;">${escape(email)}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Telefon</td><td style="padding:6px 12px;">${escape(phone) || "-"}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Verfügbar ab</td><td style="padding:6px 12px;">${escape(availability) || "-"}</td></tr>
        <tr><td style="padding:6px 12px;color:#555;">Erfahrung</td><td style="padding:6px 12px;">${escape(experience) || "-"}</td></tr>
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
      subject: `Bewerbung – ${position} – ${name}`,
      html,
      attachments,
    })

    if (!internal.success) {
      return NextResponse.json({ error: "Mailversand fehlgeschlagen." }, { status: 500 })
    }

    await sendEmail({
      to: email,
      subject: "Ihre Bewerbung bei High-End Homes",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;padding:32px;background:#fff;border:1px solid #eee;border-radius:12px;">
          <h2 style="margin:0 0 16px 0;">Bewerbung erhalten</h2>
          <p style="line-height:1.6;color:#444;">Sehr geehrte/r ${escape(name)},</p>
          <p style="line-height:1.6;color:#444;">
            vielen Dank für Ihre Bewerbung auf die Position <strong>${escape(position)}</strong>.
            Wir prüfen Ihre Unterlagen und melden uns innerhalb weniger Tage bei Ihnen.
          </p>
          <p style="line-height:1.6;color:#444;margin-top:24px;">
            Mit freundlichen Grüßen<br/>
            <strong>High-End Homes</strong><br/>
            Bennet Pfeifer
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[karriere] error:", err)
    return NextResponse.json({ error: "Interner Serverfehler" }, { status: 500 })
  }
}
