'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { categories } from '@/data/portfolioData'

export default function Portfolio() {
  const [activeIdx, setActiveIdx] = useState(0)
  const router = useRouter()

  return (
    <section id="portfolio" style={{ background: 'var(--color-bg)' }}>
      <div
        className="accordion-panels"
        style={{
          display: 'flex',
          height: '85vh',
          minHeight: '480px',
          overflow: 'hidden',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        {categories.map((category, i) => (
          <div
            key={category.id}
            className="accordion-panel"
            data-cursor="view"
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => {
              if (i === activeIdx) router.push(`/work/${category.id}`)
              else setActiveIdx(i)
            }}
            style={{
              position: 'relative',
              flex: i === activeIdx ? '5 1 0%' : '1 1 0%',
              transition: 'flex 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              cursor: 'pointer',
              borderRight: i < categories.length - 1 ? '1px solid var(--color-border)' : 'none',
              minWidth: '64px',
            }}
          >
            <Image
              src={category.previewImages[0]}
              alt={category.label}
              fill
              style={{
                objectFit: 'cover',
                transform: i === activeIdx ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              sizes="50vw"
            />

            {/* Overlay — uses token-based gradient */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: i === activeIdx
                  ? 'linear-gradient(to top, var(--color-overlay-gradient) 35%, transparent 100%)'
                  : 'var(--color-overlay-scrim)',
                transition: 'background 0.5s ease',
              }}
            />

            {/* Collapsed vertical label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                opacity: i === activeIdx ? 0 : 1,
                transition: 'opacity 0.25s ease',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: '1rem',
                  color: 'var(--color-overlay-text)',
                  whiteSpace: 'nowrap',
                  transform: 'rotate(-90deg)',
                  letterSpacing: 'var(--tracking-tight)',
                }}
              >
                {category.label}
              </span>
            </div>

            {/* Mobile-only: tap to explore pill */}
            <div
              className="mobile-tap-hint"
              style={{
                position: 'absolute',
                bottom: '1rem',
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                opacity: i === activeIdx ? 0 : 1,
                transition: 'opacity 0.25s ease',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-xs)',
                  letterSpacing: 'var(--tracking-normal)',
                  textTransform: 'uppercase',
                  color: 'var(--color-overlay-muted)',
                  border: '1px solid var(--color-overlay-dim)',
                  borderRadius: '999px',
                  padding: '0.3rem 0.75rem',
                  backdropFilter: 'blur(4px)',
                }}
              >
                Tap to explore
              </span>
            </div>

            {/* Expanded content */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2.5rem',
                opacity: i === activeIdx ? 1 : 0,
                transform: i === activeIdx ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.35s ease 0.2s, transform 0.35s ease 0.2s',
                pointerEvents: i === activeIdx ? 'auto' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  margin: '0 0 0.6rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>

              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(2rem, 3vw, 3.25rem)',
                  lineHeight: 1.05,
                  color: 'var(--color-overlay-heading)',
                  margin: '0 0 0.65rem',
                }}
              >
                {category.label}
              </h2>

              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tracking-normal)',
                  textTransform: 'uppercase',
                  color: 'var(--color-overlay-muted)',
                  margin: '0 0 1.5rem',
                }}
              >
                {category.subtitle}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Link
                  href={`/work/${category.id}`}
                  data-cursor="link"
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 'var(--text-label-sm)',
                    letterSpacing: 'var(--tracking-wide)',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-accent)',
                    paddingBottom: '2px',
                  }}
                >
                  View Collection →
                </Link>
                <span
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: 'var(--text-label-xs)',
                    letterSpacing: 'var(--tracking-tight)',
                    textTransform: 'uppercase',
                    color: 'var(--color-overlay-dim)',
                  }}
                >
                  {category.sections.length} sections
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .accordion-panels {
            flex-direction: column !important;
            height: auto !important;
          }
          .accordion-panel {
            flex: none !important;
            height: 55vw !important;
            min-width: unset !important;
            border-right: none !important;
            border-bottom: 1px solid var(--color-border) !important;
            touch-action: manipulation;
          }
          @media (hover: hover) {
            .mobile-tap-hint { display: none !important; }
          }
        }
      `}</style>
    </section>
  )
}
