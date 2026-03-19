'use client'

import { Linkedin, Instagram } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>
          Get in Touch
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          Let's Work Together
        </h2>
        <p className="mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Open to collaborations, commissions, and new opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="mailto:hello@gabrielagamargo.com"
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            Say Hello
          </a>
          <a href="/resume.pdf" download
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
            Download Resume
          </a>
        </div>
        <div className="flex justify-center gap-6 mb-14">
          {[
            { href: 'https://linkedin.com/in/gabrielagamargo', icon: <Linkedin size={20} />, label: 'LinkedIn' },
            { href: 'https://instagram.com/gabrielagamargo', icon: <Instagram size={20} />, label: 'Instagram' },
          ].map(({ href, icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Gaby on ${label}`}
              className="w-11 h-11 flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)' }}>
              {icon}
            </a>
          ))}
        </div>
        {/* Form — wired to Server Action in Task 12 */}
        <form className="text-left space-y-6">
          {[
            { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>{label}</label>
              <input id={id} type={type} name={id} required placeholder={placeholder}
                className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>Message</label>
            <textarea id="message" name="message" required rows={5} placeholder="Tell me about your project..."
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200 resize-none"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          </div>
          <button type="submit"
            className="w-full py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            Send Message
          </button>
        </form>
        <p className="mt-16 text-xs tracking-wide" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
          © {new Date().getFullYear()} Gabriela Gamargo. All rights reserved.
        </p>
      </div>
    </section>
  )
}
