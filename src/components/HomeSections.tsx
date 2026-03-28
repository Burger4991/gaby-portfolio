'use client'

import FullScreenScrollFX from './FullScreenScrollFX'
import ImageAccordion from './ImageAccordion'
import PullQuote from './PullQuote'
import About from './About'
import Contact from './Contact'

/**
 * FullScreenScrollFX wraps the entire homepage below the hero.
 * Each section is a full-screen panel navigated by scroll.
 * The portfolio panel contains the ImageAccordion for collection selection.
 */
export default function HomeSections() {
  const sections = [
    {
      id: 'portfolio',
      background: '/assets/resort/stephanie-gottlieb/969c394b624e05384f21c85fb925ab57.png',
      leftLabel: <span>01</span>,
      title: 'Selected Work',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)' }}>Collections</span>,
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
      background: '/assets/cutsew/vogue-mexico/068e4e0d4268c7a00ec3f0c3acf58faa.jpg',
      leftLabel: <span>02</span>,
      title: 'Philosophy',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)' }}>Words</span>,
      content: (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PullQuote />
        </div>
      ),
    },
    {
      id: 'about',
      background: '/assets/about/e84a9c6fe50fb3b0cc4b4bd758826a65.jpg',
      leftLabel: <span>03</span>,
      title: 'About Gaby',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)' }}>Bio</span>,
      content: (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'auto' }}>
          <About />
        </div>
      ),
    },
    {
      id: 'contact',
      background: '/assets/bridal/resort-bride/1376b5b9dfa2bdf90ff056336a096f79.jpg',
      leftLabel: <span>04</span>,
      title: 'Get in Touch',
      rightLabel: <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)' }}>Contact</span>,
      content: (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, overflow: 'auto' }}>
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
