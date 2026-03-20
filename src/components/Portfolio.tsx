'use client'

import { categories } from '@/data/portfolioData'
import ThreeDCarousel from './ThreeDCarousel'

export default function Portfolio() {
  return (
    <section id="portfolio" style={{ padding: '6rem 0', background: 'var(--color-bg)' }}>
      {categories.map((category, i) => (
        <div key={category.id} style={{ marginBottom: '6rem' }}>
          {/* Category header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 2rem' }}>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '0.5rem',
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </p>
            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 6vw, 4rem)',
                color: 'var(--color-text)',
                margin: 0,
              }}
            >
              {category.label}
            </h2>
            {category.subtitle && (
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.75rem',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-muted)',
                  marginTop: '0.5rem',
                }}
              >
                {category.subtitle}
              </p>
            )}
          </div>
          {/* 3D Carousel */}
          <ThreeDCarousel items={category.items} categoryId={category.id} />
        </div>
      ))}
    </section>
  )
}
