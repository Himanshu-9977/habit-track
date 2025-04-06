"use server"

import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

type EmailData = {
  to: string
  subject: string
  text: string
  html?: string
}

export async function sendEmail(data: EmailData) {
  try {
    const { to, subject, text, html } = data

    await resend.emails.send({
      from: "Habit Tracker <notifications@example.com>",
      to: [to],
      subject,
      text,
      html: html || `<p>${text}</p>`,
    })

    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { success: false, error }
  }
}

