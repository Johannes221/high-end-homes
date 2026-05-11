import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from,
  attachments,
}: {
  to: string
  subject: string
  html: string
  from?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
}) {
  if (!process.env.RESEND_API_KEY) {
    return { success: false, error: "Email not configured" }
  }

  try {
    const { data, error } = await resend.emails.send({
      from: from || process.env.SMTP_FROM || "High-End Homes <bennet.pfeifer@highendhomes.de>",
      to,
      subject,
      html,
      attachments,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, id: data?.id }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}
