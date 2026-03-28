'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { categories } from '@/data/portfolioData'
import LiquidGlass from './LiquidGlass'

export default function ImageAccordion() {
  const [activeIdx, setActiveIdx] = useState(0)

  return (
    <div
      className="image-accordion"
      style={{
        display: 'flex',
        width: '100%',
        height: '100%',
        gap: '6px',
        overflow: 'hidden',
      }}
    >
      {categories.map((category, i) => {
        const isActive = i === activeIdx
        return (
          <div
            key={category.id}
            data-cursor="view"
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => setActiveIdx(i)}
            style={{
              position: 'relative',
              flex: isActive ? '5 1 0%' : '0.8 1 0%',
              transition: 'flex 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              overflow: 'hidden',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            <Image
              src={category.previewImages[0]}
              alt={category.label}
              fill
              style={{
                objectFit: 'cover',
                transform: isActive ? 'scale(1.05)' : 'scale(1.15)',
                transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Dark gradient overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: isActive
                  ? 'linear-gradient(to top, var(--color-overlay-gradient) 25%, transparent 70%)'
                  : 'var(--color-overlay-scrim)',
                transition: 'background 0.5s ease',
              }}
            />

            {/* Collapsed: rotated label */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: isActive ? 0 : 1,
                transition: 'opacity 0.3s ease',
                pointerEvents: 'none',
              }}
            >
              <span
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(0.9rem, 1.2vw, 1.1rem)',
                  color: 'var(--color-overlay-text)',
                  whiteSpace: 'nowrap',
                  transform: 'rotate(-90deg)',
                  letterSpacing: 'var(--tracking-tight)',
                }}
              >
                {category.label}
              </span>
            </div>

            {/* Expanded: title + CTA */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '2rem 2rem 2.25rem',
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 0.4s ease 0.15s, transform 0.4s ease 0.15s',
                pointerEvents: isActive ? 'auto' : 'none',
              }}
            >
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  margin: '0 0 0.5rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>

              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(1.8rem, 3vw, 3rem)',
                  lineHeight: 1.05,
                  color: 'var(--color-overlay-heading)',
                  margin: '0 0 0.5rem',
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
                  margin: '0 0 1.25rem',
                }}
              >
                {category.subtitle}
              </p>

              <Link
                href={`/work/${category.id}`}
                data-cursor="link"
                onClick={(e) => e.stopPropagation()}
              >
                <LiquidGlass
                  as="span"
                  style={{
                    color: 'var(--color-accent)',
                    fontSize: 'var(--text-label-sm)',
                    letterSpacing: 'var(--tracking-wide)',
                  }}
                >
                  View Collection →
                </LiquidGlass>
              </Link>
            </div>
          </div>
        )
      })}

      <style>{`
        @media (max-width: 768px) {
          .image-accordion {
            flex-direction: column !important;
            height: auto !important;
            gap: 3px !important;
          }
          .image-accordion > div {
            flex: none !important;
            height: 120px !important;
            border-radius: 6px !important;
          }
          .image-accordion > div[style*="flex: 5"] {
            height: 300px !important;
          }
        }
      `}</style>
    </div>
  )
}
