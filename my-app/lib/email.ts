import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from,
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set, skipping email")
    return { success: false, error: "Email not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.SMTP_FROM || "High-End Homes <bennet.pfeifer@highendhomes.de>",
      to,
      subject,
      html,
    })

    if (error) {
      console.error("Resend error:", error)
      return { success: false, error: error.message }
    }

    console.log("Email sent successfully:", data?.id)
    return { success: true, id: data?.id }
  } catch (error) {
    console.error("Email send failed:", error)
    return { success: false, error: String(error) }
  }
}
