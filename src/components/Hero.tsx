'use client'
import ScrollExpandHero from './ScrollExpandHero'
import LiquidGlass from './LiquidGlass'

export default function Hero() {
  return (
    <ScrollExpandHero
      mediaSrc="/assets/hero/7cdfb90c99a3bee5bb6a9b6db8ec3f7a.jpg"
      bgImageSrc="/assets/hero/7cdfb90c99a3bee5bb6a9b6db8ec3f7a.jpg"
      title="GABRIELA GAMARGO"
      eyebrow="Fashion Designer"
      scrollToExpand="↓ Scroll"
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', paddingTop: '2rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1.5rem 2.5rem',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'var(--text-label)',
          letterSpacing: 'var(--tracking-normal)',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
        }}>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>10+</div>Years Industry</div>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>5+</div>Design Lead</div>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>300K+</div>Units Sold</div>
          <div><div style={{ fontSize: '1.5rem', color: 'var(--color-text)', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>∞</div>Details</div>
        </div>
        <LiquidGlass
          as="a"
          href="#portfolio"
          style={{
            padding: '0.75rem 2.5rem',
            color: 'var(--color-accent)',
            fontSize: 'var(--text-label)',
            letterSpacing: 'var(--tracking-wide)',
          }}
        >
          View Work
        </LiquidGlass>
      </div>
    </ScrollExpandHero>
  )
}
