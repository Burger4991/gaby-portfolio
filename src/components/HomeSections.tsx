'use client'

import ImageAccordion from './ImageAccordion'
import PullQuote from './PullQuote'
import About from './About'
import Contact from './Contact'

const GRADIENT_ANGLES = [135, 170, 200, 155]

/**
 * Homepage sections — normal vertical scroll.
 * Each section is full-viewport height with gradient background.
 */
export default function HomeSections() {
  return (
    <>
      {/* Portfolio / Collections */}
      <section
        id="portfolio"
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: `linear-gradient(${GRADIENT_ANGLES[0]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
        }}
      >
        <div style={{ padding: '2.5rem 2rem 0.75rem', textAlign: 'center' }}>
          <p style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'var(--text-label)',
            letterSpacing: 'var(--tracking-wide)',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '0.5rem',
          }}>
            Selected Work
          </p>
          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            color: 'var(--color-text)',
            margin: 0,
          }}>
            Collections
          </h2>
        </div>
        <div style={{ flex: 1, padding: '0.75rem 1.5rem 1.5rem', minHeight: '60vh' }}>
          <ImageAccordion />
        </div>
      </section>

      {/* Pull Quote */}
      <section
        id="pullquote"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(${GRADIENT_ANGLES[1]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
        }}
      >
        <PullQuote />
      </section>

      {/* About */}
      <section
        id="about"
        style={{
          background: `linear-gradient(${GRADIENT_ANGLES[2]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
        }}
      >
        <About />
      </section>

      {/* Contact */}
      <section
        id="contact"
        style={{
          background: `linear-gradient(${GRADIENT_ANGLES[3]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
        }}
      >
        <Contact />
      </section>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem',
        fontFamily: 'Cormorant Garamond, serif',
        fontStyle: 'italic',
        fontWeight: 300,
        fontSize: 'clamp(1.2rem, 3vw, 2rem)',
        color: 'var(--color-muted)',
        background: 'var(--color-bg)',
      }}>
        Gabriela Gamargo
      </div>
    </>
  )
}
