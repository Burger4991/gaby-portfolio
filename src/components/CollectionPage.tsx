'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { PortfolioCategory, CollectionSection } from '@/data/portfolioData'
import SpotlightCard from './SpotlightCard'
import CollectionCarousel from './CollectionCarousel'
import LiquidGlass from './LiquidGlass'
import ImageLightbox from './ImageLightbox'

/** Mobile image strip — horizontal scroll, tap to enlarge */
function MobileImageStrip({ section }: { section: CollectionSection }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  return (
    <>
      <div style={{
        display: 'flex',
        gap: '0.75rem',
        overflowX: 'scroll',
        overflowY: 'hidden',
        padding: '0 1rem 0.75rem',
        WebkitOverflowScrolling: 'touch',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        {section.images.map((img, i) => (
          <div
            key={i}
            onClick={() => setLightboxIndex(i)}
            style={{
              flexShrink: 0,
              width: '90vw',
              aspectRatio: '3/4',
              borderRadius: '10px',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              border: '1px solid var(--color-border)',
              scrollSnapAlign: 'start',
            }}
          >
            <Image
              src={img.src}
              alt={img.caption ?? section.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="90vw"
            />
            {img.caption && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2.5rem 0.75rem 0.75rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-sm)',
                color: 'rgba(255,255,255,0.9)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-tight)',
              }}>
                {img.caption}
              </div>
            )}
          </div>
        ))}
      </div>
      <style>{`.collection-mobile-only div::-webkit-scrollbar { display: none; }`}</style>
      <p style={{
        textAlign: 'center',
        fontFamily: 'Manrope, sans-serif',
        fontSize: 'var(--text-label-xs)',
        color: 'var(--color-muted)',
        textTransform: 'uppercase',
        letterSpacing: 'var(--tracking-normal)',
        margin: '0.25rem 0 0',
      }}>
        swipe · tap to enlarge
      </p>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={section.images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

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

            {/* Desktop: 3D Carousel */}
            <div className="collection-desktop-only" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 3rem',
            }}>
              <CollectionCarousel images={section.images} sectionTitle={section.title} />
            </div>

            {/* Mobile: Image strip */}
            <div className="collection-mobile-only" style={{ width: '100%', overflow: 'hidden' }}>
              <MobileImageStrip section={section} />
            </div>
          </section>
        )
      })}

      {/* Responsive: show/hide desktop carousel vs mobile strip */}
      <style>{`
        .collection-mobile-only { display: none; }
        .collection-desktop-only { display: flex; }

        @media (max-width: 768px) {
          .collection-mobile-only { display: block !important; }
          .collection-desktop-only { display: none !important; }
          .collection-section {
            display: flex !important;
            flex-direction: column !important;
            min-height: auto !important;
            padding: 1.5rem 0 !important;
            gap: 1rem;
          }
          .collection-section > div:first-child {
            padding: 0 1rem !important;
          }
          .collection-section > div:first-child > div {
            max-width: 100% !important;
            width: 100% !important;
            padding: 1.25rem !important;
            box-sizing: border-box !important;
          }
        }
      `}</style>
    </div>
  )
}
