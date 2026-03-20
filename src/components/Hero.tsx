'use client'
import ScrollExpandHero from './ScrollExpandHero'

export default function Hero() {
  return (
    <ScrollExpandHero
      mediaSrc="https://picsum.photos/seed/hero-main/1200/800"
      bgImageSrc="https://picsum.photos/seed/hero-bg/1920/1080"
      title="GABRIELA GAMARGO"
      eyebrow="Fashion Designer"
      scrollToExpand="↓ Scroll"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingTop: '2rem' }}>
        <div style={{ display: 'flex', gap: '3rem', fontFamily: 'Manrope, sans-serif', fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-muted)' }}>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>10+</div>Years Industry</div>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>5+</div>Design Lead</div>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>300K+</div>Units Sold</div>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>∞</div>Details</div>
        </div>
        <a
          href="#portfolio"
          style={{
            display: 'inline-block',
            padding: '0.75rem 2.5rem',
            border: '1px solid var(--color-accent)',
            color: 'var(--color-accent)',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          View Work
        </a>
      </div>
    </ScrollExpandHero>
  )
}
