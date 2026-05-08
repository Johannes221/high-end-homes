import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

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

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || "587"),
          secure: process.env.SMTP_PORT === "465",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })

        const mailOptions = {
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: process.env.CONTACT_EMAIL || "info@high-end-homes.de",
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
        }

        await transporter.sendMail(mailOptions)
        console.log("Contact email sent successfully")
      } catch (emailError) {
        console.error("Error sending contact email:", emailError)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error processing contact form:", error)
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    )
  }
}
