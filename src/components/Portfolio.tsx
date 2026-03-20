'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { categories } from '@/data/portfolioData'

export default function Portfolio() {
  const [activeIdx, setActiveIdx] = useState(0)

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
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => setActiveIdx(i)}
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
            {/* Background image */}
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

            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: i === activeIdx
                  ? 'linear-gradient(to top, rgba(10,8,6,0.88) 35%, rgba(10,8,6,0.2) 100%)'
                  : 'rgba(10,8,6,0.6)',
                transition: 'background 0.5s ease',
              }}
            />

            {/* Collapsed vertical label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                  color: 'rgba(255,255,255,0.85)',
                  whiteSpace: 'nowrap',
                  transform: 'rotate(-90deg)',
                  letterSpacing: '0.06em',
                }}
              >
                {category.label}
              </span>
            </div>

            {/* Expanded content */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2.5rem 2.5rem 2.75rem',
                opacity: i === activeIdx ? 1 : 0,
                transform: i === activeIdx ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.35s ease 0.2s, transform 0.35s ease 0.2s',
                pointerEvents: i === activeIdx ? 'auto' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.38em',
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
                  color: '#fff',
                  margin: '0 0 0.65rem',
                }}
              >
                {category.label}
              </h2>

              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0 0 1.5rem',
                }}
              >
                {category.subtitle}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <Link
                  href={`/work/${category.id}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.62rem',
                    letterSpacing: '0.28em',
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
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
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
            height: 65vw !important;
            min-width: unset !important;
            border-right: none !important;
            border-bottom: 1px solid var(--color-border) !important;
          }
        }
      `}</style>
    </section>
  )
}
