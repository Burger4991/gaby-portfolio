'use client'

import FullScreenScrollFX from './FullScreenScrollFX'
import ImageAccordion from './ImageAccordion'
import PullQuote from './PullQuote'
import About from './About'
import Contact from './Contact'
const GRADIENT_ANGLES = [135, 170, 200, 155]

/**
 * FullScreenScrollFX wraps the entire homepage below the hero.
 * Each section is a full-screen panel navigated by scroll.
 * The portfolio panel contains the ImageAccordion for collection selection.
 */
export default function HomeSections() {
  const sections = [
    {
      id: 'portfolio',
      background: '',
      gradient: `linear-gradient(${GRADIENT_ANGLES[0]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
      leftLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}>Selected Work</span>,
      title: 'Selected Work',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const }}>Collections</span>,
      content: (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column' }}>
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
              color: 'var(--color-overlay-heading)',
              margin: 0,
            }}>
              Collections
            </h2>
          </div>
          <div style={{ flex: 1, padding: '0.75rem 1.5rem 1.5rem', minHeight: 0 }}>
            <ImageAccordion />
          </div>
        </div>
      ),
    },
    {
      id: 'pullquote',
      background: '',
      gradient: `linear-gradient(${GRADIENT_ANGLES[1]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
      leftLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}>Philosophy</span>,
      title: 'Philosophy',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const }}>Words</span>,
      content: (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PullQuote />
        </div>
      ),
    },
    {
      id: 'about',
      background: '',
      gradient: `linear-gradient(${GRADIENT_ANGLES[2]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
      leftLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}>About Gaby</span>,
      title: 'About Gaby',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const }}>Bio</span>,
      content: (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'auto' }}
          onWheel={(e) => e.stopPropagation()}
        >
          <About />
        </div>
      ),
    },
    {
      id: 'contact',
      background: '',
      gradient: `linear-gradient(${GRADIENT_ANGLES[3]}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
      leftLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const, whiteSpace: 'nowrap' }}>Get in Touch</span>,
      title: 'Get in Touch',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', textTransform: 'uppercase' as const }}>Contact</span>,
      content: (
        <div
          style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'auto' }}
          onWheel={(e) => e.stopPropagation()}
        >
          <Contact />
        </div>
      ),
    },
  ]

  return (
    <FullScreenScrollFX
      sections={sections}
      footer={<span>Gabriela Gamargo</span>}
    />
  )
}
