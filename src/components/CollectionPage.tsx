'use client'

import Link from 'next/link'
import type { PortfolioCategory } from '@/data/portfolioData'
import SpotlightCard from './SpotlightCard'
import CollectionCarousel from './CollectionCarousel'
import LiquidGlass from './LiquidGlass'

const GRADIENT_ANGLES = [135, 160, 200, 170, 145, 190]

/**
 * Collection page — normal vertical scroll layout.
 * Each section: 40% text card / 60% carousel, full-viewport height.
 * No FullScreenScrollFX — eliminates scroll conflicts with carousel.
 */
export default function CollectionPage({ category }: { category: PortfolioCategory }) {
  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '1rem 2rem',
        background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <Link href="/#portfolio" data-cursor="link" style={{ textDecoration: 'none' }}>
          <LiquidGlass style={{
            color: 'var(--color-muted)',
            fontSize: 'var(--text-label-sm)',
            letterSpacing: 'var(--tracking-wide)',
          }}>
            ← Back
          </LiquidGlass>
        </Link>
        <span style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontStyle: 'italic',
          fontWeight: 300,
          fontSize: 'clamp(1.2rem, 2.5vw, 2rem)',
          color: 'var(--color-text)',
        }}>
          {category.label}
        </span>
      </div>

      {/* Sections */}
      {category.sections.map((section, i) => {
        const angle = GRADIENT_ANGLES[i % GRADIENT_ANGLES.length]
        return (
          <section
            key={section.id}
            id={section.id}
            style={{
              minHeight: '100vh',
              display: 'grid',
              gridTemplateColumns: '40% 60%',
              background: `linear-gradient(${angle}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
              borderBottom: '1px solid var(--color-border)',
            }}
            className="collection-section"
          >
            {/* Text card */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 2rem',
            }}>
              <SpotlightCard
                style={{
                  padding: '2.5rem',
                  maxWidth: '420px',
                  width: '100%',
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
                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  marginBottom: '0.75rem',
                }}>
                  {String(i + 1).padStart(2, '0')} / {String(category.sections.length).padStart(2, '0')}
                </p>

                <h2 style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
                  lineHeight: 1.1,
                  color: 'var(--color-text)',
                  margin: '0 0 1rem',
                }}>
                  {section.title}
                </h2>

                <p style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-body)',
                  lineHeight: 1.7,
                  color: 'var(--color-muted)',
                  margin: '0 0 1.25rem',
                }}>
                  {section.description}
                </p>

                <div style={{
                  padding: '0.75rem 1rem',
                  borderLeft: '2px solid var(--color-accent)',
                  background: 'color-mix(in srgb, var(--color-accent) 5%, transparent)',
                  fontSize: '0.8rem',
                  lineHeight: 1.6,
                  color: 'var(--color-text)',
                }}>
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

            {/* Carousel */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 3rem',
            }}>
              <CollectionCarousel images={section.images} sectionTitle={section.title} />
            </div>
          </section>
        )
      })}

      {/* Mobile responsive */}
      <style>{`
        @media (max-width: 768px) {
          .collection-section {
            grid-template-columns: 1fr !important;
            min-height: auto !important;
            padding: 1.5rem 0.75rem !important;
            gap: 1rem;
          }
          .collection-section > div {
            padding: 0.75rem !important;
            min-width: 0 !important;
          }
          .collection-section > div:first-child > div {
            max-width: 100% !important;
            width: 100% !important;
            padding: 1.25rem !important;
            box-sizing: border-box !important;
          }
          .collection-section > div:last-child {
            overflow: hidden;
          }
        }
      `}</style>
    </div>
  )
}
