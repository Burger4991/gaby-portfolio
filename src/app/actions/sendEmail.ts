'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface FormData {
  name: string
  email: string
  message: string
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function validateForm(data: FormData): string | null {
  if (!data.name || data.name.trim().length < 1) return 'Name is required'
  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return 'Valid email is required'
  if (!data.message || data.message.trim().length < 10) return 'Message must be at least 10 characters'
  return null
}

export async function sendEmail(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const validationError = validateForm(formData)
  if (validationError) return { success: false, error: validationError }

  const toEmail = process.env.GABY_EMAIL
  if (!toEmail) {
    return { success: false, error: 'Contact form is not configured. Please try again later.' }
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',  // NOTE: dev only — needs verified domain in prod
      to: toEmail,
      subject: `Portfolio contact from ${formData.name}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${escapeHtml(formData.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(formData.email)}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(formData.message).replace(/\n/g, '<br>')}</p>
      `,
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
