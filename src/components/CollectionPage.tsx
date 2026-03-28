'use client'

import Link from 'next/link'
import type { PortfolioCategory } from '@/data/portfolioData'
import FullScreenScrollFX from './FullScreenScrollFX'
import SpotlightCard from './SpotlightCard'
import CollectionCarousel from './CollectionCarousel'
import LiquidGlass from './LiquidGlass'

/**
 * Collection page using FullScreenScrollFX for section navigation.
 * Each section is a full-screen panel with 40% text card / 60% carousel.
 */
export default function CollectionPage({ category }: { category: PortfolioCategory }) {
  const sections = category.sections.map((section, i) => ({
    id: section.id,
    background: section.images[0]?.src ?? '',
    leftLabel: (
      <span>
        {String(i + 1).padStart(2, '0')}
      </span>
    ),
    title: section.title,
    rightLabel: (
      <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)' }}>
        {section.pills[0] ?? ''}
      </span>
    ),
    content: (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: '40% 60%',
          height: '100%',
        }}
        className="collection-split"
      >
        {/* 40% — Text card */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 2rem 4rem 3rem',
          }}
        >
          <SpotlightCard
            style={{
              padding: '2.5rem',
              maxWidth: '420px',
              width: '100%',
            }}
          >
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-sm)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                color: 'var(--color-accent)',
                marginBottom: '0.75rem',
              }}
            >
              {String(i + 1).padStart(2, '0')} / {String(category.sections.length).padStart(2, '0')}
            </p>

            <h2
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                lineHeight: 1.1,
                color: 'var(--color-overlay-heading)',
                margin: '0 0 1rem',
              }}
            >
              {section.title}
            </h2>

            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-body)',
                lineHeight: 1.7,
                color: 'var(--color-overlay-muted)',
                margin: '0 0 1.25rem',
              }}
            >
              {section.description}
            </p>

            <div
              style={{
                padding: '0.75rem 1rem',
                borderLeft: '2px solid var(--color-accent)',
                background: 'color-mix(in srgb, var(--color-accent) 5%, transparent)',
                fontSize: '0.8rem',
                lineHeight: 1.6,
                color: 'var(--color-overlay-text)',
                marginBottom: '1rem',
              }}
            >
              <span style={{ color: 'var(--color-accent)', fontWeight: 600, fontFamily: 'Manrope, sans-serif' }}>
                {section.outcome.startsWith('↑') || section.outcome.startsWith('Featured')
                  ? section.outcome.split(' — ')[0].split('. ')[0]
                  : 'Outcome'}
              </span>
              {' '}
              {section.outcome.includes(' — ')
                ? section.outcome.split(' — ').slice(1).join(' — ')
                : section.outcome.includes('. ')
                ? section.outcome.split('. ').slice(1).join('. ')
                : section.outcome}
            </div>
          </SpotlightCard>
        </div>

        {/* 60% — Carousel */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4rem 3rem 4rem 2rem',
          }}
        >
          <CollectionCarousel images={section.images} sectionTitle={section.title} />
        </div>
      </div>
    ),
  }))

  return (
    <>
      <FullScreenScrollFX
        sections={sections}
        header={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              href="/#portfolio"
              data-cursor="link"
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-sm)',
                letterSpacing: 'var(--tracking-wide)',
                textTransform: 'uppercase',
                color: 'var(--color-overlay-muted)',
                textDecoration: 'none',
              }}
            >
              ← Back
            </Link>
            <span style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
              color: 'var(--color-overlay-heading)',
            }}>
              {category.label}
            </span>
          </div>
        }
      />

      <style>{`
        @media (max-width: 768px) {
          .collection-split {
            grid-template-columns: 1fr !important;
            grid-template-rows: auto 1fr !important;
            overflow: auto !important;
          }
        }
      `}</style>
    </>
  )
}
