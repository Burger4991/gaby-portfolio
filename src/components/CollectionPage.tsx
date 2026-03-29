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
  const GRADIENT_ANGLES = [135, 160, 200, 170, 145, 190]

  const sections = category.sections.map((section, i) => {
    const angle = GRADIENT_ANGLES[i % GRADIENT_ANGLES.length]
    return {
      id: section.id,
      background: '',
      gradient: `linear-gradient(${angle}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
    leftLabel: (
      <LiquidGlass style={{
        fontSize: 'var(--text-label-xs)',
        letterSpacing: 'var(--tracking-normal)',
        maxWidth: '160px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}>
        {section.title}
      </LiquidGlass>
    ),
    title: section.title,
    rightLabel: (
      <LiquidGlass style={{
        fontSize: 'var(--text-label-xs)',
        letterSpacing: 'var(--tracking-normal)',
      }}>
        {section.pills[0] ?? ''}
      </LiquidGlass>
    ),
    content: (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '20%',
          right: '14%',
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
            padding: '2rem 1.5rem 2rem 2rem',
          }}
        >
          <SpotlightCard
            style={{
              padding: '2.5rem',
              maxWidth: '420px',
              width: '100%',
              minHeight: '320px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              backdropFilter: 'blur(12px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
              border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
              boxShadow: `
                inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent),
                0 0 12px 0 color-mix(in srgb, var(--color-accent) 10%, transparent)
              `,
              background: 'color-mix(in srgb, var(--color-card-bg) 70%, transparent)',
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
            height: '100%',
          }}
        >
          <CollectionCarousel images={section.images} sectionTitle={section.title} />
        </div>
      </div>
    ),
  }})

  return (
    <>
      <FullScreenScrollFX
        sections={sections}
        header={
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <Link href="/#portfolio" data-cursor="link" style={{ textDecoration: 'none' }}>
              <LiquidGlass style={{ color: 'var(--color-overlay-muted)', fontSize: 'var(--text-label-sm)', letterSpacing: 'var(--tracking-wide)' }}>
                ← Back
              </LiquidGlass>
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
        @media (max-width: 900px) {
          .collection-split {
            left: 0 !important;
            right: 0 !important;
            grid-template-columns: 1fr !important;
            grid-template-rows: auto auto !important;
            overflow-x: hidden !important;
            overflow-y: auto !important;
            padding: 0.75rem !important;
            gap: 1rem;
          }
          .collection-split > div {
            padding: 0.75rem !important;
            max-width: 100% !important;
            min-width: 0 !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          .collection-split > div:first-child > div {
            max-width: 100% !important;
            width: 100% !important;
            height: auto !important;
            min-height: auto !important;
            padding: 1.25rem !important;
          }
          .collection-split > div:last-child {
            justify-content: center !important;
            align-items: flex-start !important;
          }
        }
      `}</style>
    </>
  )
}
