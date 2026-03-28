'use client'

import { useState } from 'react'
import { Linkedin, Instagram } from 'lucide-react'
import { sendEmail } from '@/app/actions/sendEmail'
import LiquidGlass from './LiquidGlass'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setErrorMessage(null)

    const result = await sendEmail({ name, email, message })

    if (result.success) {
      setStatus('success')
      setName('')
      setEmail('')
      setMessage('')
      setTimeout(() => setStatus('idle'), 4000)
    } else {
      setStatus('error')
      setErrorMessage(result.error ?? 'Something went wrong.')
    }
  }

  const buttonLabel =
    status === 'loading' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send'

  return (
    <section id="contact" className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>
          Get in Touch
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          Let&apos;s Work Together
        </h2>
        <p className="mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Open to collaborations, commissions, and new opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <LiquidGlass
            as="a"
            href="mailto:hello@gabrielagamargo.com"
            style={{ padding: '0.75rem 2rem', color: 'var(--color-accent)', fontWeight: 600 }}
          >
            Say Hello
          </LiquidGlass>
          <LiquidGlass
            as="a"
            href="/resume.pdf"
            download
            style={{ padding: '0.75rem 2rem', color: 'var(--color-accent)', fontWeight: 600 }}
          >
            Download Resume
          </LiquidGlass>
        </div>
        <div className="flex justify-center gap-6 mb-14">
          {[
            { href: 'https://linkedin.com/in/gabrielagamargo', icon: <Linkedin size={18} />, label: 'LinkedIn' },
            { href: 'https://instagram.com/gabrielagamargo', icon: <Instagram size={18} />, label: 'Instagram' },
          ].map(({ href, icon, label }) => (
            <LiquidGlass
              key={label}
              as="a"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Gaby on ${label}`}
              style={{ width: '2.5rem', height: '2.5rem', padding: 0, borderRadius: '50%', color: 'var(--color-muted)' }}
            >
              {icon}
            </LiquidGlass>
          ))}
        </div>
        <form className="text-left space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>Name</label>
            <input
              id="name"
              type="text"
              name="name"
              required
              placeholder="Your name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>Email</label>
            <input
              id="email"
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>Message</label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell me about your project..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200 resize-none"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }}
            />
          </div>
          {status === 'success' && (
            <p className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
              Message sent! I&apos;ll be in touch soon.
            </p>
          )}
          {status === 'error' && errorMessage && (
            <p className="text-sm font-medium" role="alert" style={{ color: 'var(--color-error)' }}>
              {errorMessage}
            </p>
          )}
          <LiquidGlass
            as="button"
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '1rem 2rem',
              color: 'var(--color-accent)',
              fontWeight: 600,
              opacity: status === 'loading' ? 0.6 : 1,
            }}
          >
            {buttonLabel}
          </LiquidGlass>
        </form>
        <p className="mt-16 text-xs tracking-wide" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
          © {new Date().getFullYear()} Gabriela Gamargo. All rights reserved.
        </p>
      </div>
    </section>
  )
}
