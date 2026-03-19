import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import { Linkedin, Instagram } from 'lucide-react'

const FORMSPREE_ID = 'YOUR_FORMSPREE_ID' // replace with real ID from formspree.io

export default function Contact() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      id="contact"
      className="py-24 px-6 md:px-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <motion.div
        ref={ref}
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut' }}
      >
        <p
          className="text-xs font-semibold tracking-[0.4em] uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Get in Touch
        </p>
        <h2
          className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
        >
          Let's Work Together
        </h2>
        <p className="mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Open to collaborations, commissions, and new opportunities.
        </p>

        {/* Primary CTA + Resume */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a
            href="mailto:gaby@example.com"
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent)' }}
          >
            Say Hello
          </a>
          <a
            href="/resume.pdf"
            download
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-accent)'
              e.currentTarget.style.color = 'var(--color-bg)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--color-accent)'
            }}
          >
            Download Resume
          </a>
        </div>

        {/* Social links */}
        <div className="flex justify-center gap-6 mb-14">
          <a
            href="https://linkedin.com/in/gaby"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gaby on LinkedIn"
            className="w-11 h-11 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)' }}
          >
            <Linkedin size={20} />
          </a>
          <a
            href="https://instagram.com/gaby"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Gaby on Instagram"
            className="w-11 h-11 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-accent)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-muted)' }}
          >
            <Instagram size={20} />
          </a>
        </div>

        {/* Contact form */}
        <form
          action={`https://formspree.io/f/${FORMSPREE_ID}`}
          method="POST"
          className="text-left space-y-6"
        >
          {[
            { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label
                htmlFor={id}
                className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2"
                style={{ color: 'var(--color-muted)' }}
              >
                {label}
              </label>
              <input
                id={id}
                type={type}
                name={id}
                required
                placeholder={placeholder}
                className="w-full px-4 py-3 focus:outline-none focus:ring-2 transition-shadow duration-200"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  '--tw-ring-color': 'var(--color-accent)',
                }}
              />
            </div>
          ))}

          <div>
            <label
              htmlFor="message"
              className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2"
              style={{ color: 'var(--color-muted)' }}
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={5}
              placeholder="Tell me about your project..."
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 transition-shadow duration-200 resize-none"
              style={{
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                color: 'var(--color-text)',
                '--tw-ring-color': 'var(--color-accent)',
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-accent)' }}
          >
            Send Message
          </button>
        </form>

        {/* Footer */}
        <p className="mt-16 text-xs tracking-wide" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
          © {new Date().getFullYear()} Gaby. All rights reserved.
        </p>
      </motion.div>
    </section>
  )
}
