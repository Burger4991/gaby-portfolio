'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface FormData {
  name: string
  email: string
  message: string
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

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',  // NOTE: dev only — needs verified domain in prod
      to: process.env.GABY_EMAIL ?? 'gabriela@example.com',
      subject: `Portfolio contact from ${formData.name}`,
      html: `
        <h2>New Portfolio Contact</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `,
    })
    return { success: true }
  } catch {
    return { success: false, error: 'Failed to send message. Please try again.' }
  }
}
