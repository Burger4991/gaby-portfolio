'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import type { PortfolioCategory } from '@/data/portfolioData'

export default function SplitScrollCollection({ category }: { category: PortfolioCategory }) {
  const stageRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollToStage = (i: number) => {
    stageRefs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        paddingTop: '5rem',
      }}
    >
      {/* Back link */}
      <div style={{ padding: '1.5rem 2rem 0' }}>
        <Link
          href="/#portfolio"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.3em',
            color: 'var(--color-muted)',
            textDecoration: 'none',
          }}
        >
          ← Back to Portfolio
        </Link>
      </div>

      {/* Split layout */}
      <div
        className="split-scroll-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem',
          gap: '4rem',
          alignItems: 'start',
        }}
      >
        {/* Left: sticky info panel */}
        <div
          className="split-scroll-left"
          style={{
            position: 'sticky',
            top: '6rem',
            height: 'calc(100vh - 8rem)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '2rem',
            padding: '2rem 0',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.35em',
                color: 'var(--color-accent)',
                marginBottom: '0.75rem',
              }}
            >
              Collection
            </p>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                color: 'var(--color-text)',
                lineHeight: 1.1,
                margin: '0 0 1.5rem',
              }}
            >
              {category.label}
            </h1>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                color: 'var(--color-muted)',
                maxWidth: '36ch',
              }}
            >
              {category.description}
            </p>
          </div>

          {/* Outcome callout */}
          <div
            style={{
              borderLeft: '2px solid var(--color-accent)',
              paddingLeft: '1rem',
            }}
          >
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '0.4rem',
              }}
            >
              Outcome
            </p>
            <p
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontSize: '1.1rem',
                color: 'var(--color-text)',
                lineHeight: 1.5,
              }}
            >
              {category.outcome}
            </p>
          </div>

          {/* Stage pills — jump navigation */}
          <div>
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--color-muted)',
                marginBottom: '0.75rem',
              }}
            >
              Process
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {category.processStages.map((stage, i) => (
                <button
                  key={stage.label}
                  onClick={() => scrollToStage(i)}
                  style={{
                    padding: '0.35rem 0.85rem',
                    border: '1px solid var(--color-border)',
                    background: 'transparent',
                    color: 'var(--color-muted)',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2em',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    const btn = e.currentTarget
                    btn.style.borderColor = 'var(--color-accent)'
                    btn.style.color = 'var(--color-accent)'
                  }}
                  onMouseLeave={(e) => {
                    const btn = e.currentTarget
                    btn.style.borderColor = 'var(--color-border)'
                    btn.style.color = 'var(--color-muted)'
                  }}
                >
                  {stage.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: scrollable stage images */}
        <div style={{ paddingTop: '3rem', paddingBottom: '8rem' }}>
          {category.processStages.map((stage, i) => (
            <div
              key={stage.label}
              ref={(el) => { stageRefs.current[i] = el }}
              style={{ marginBottom: '5rem' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.6rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.35em',
                    color: 'var(--color-accent)',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3em',
                    color: 'var(--color-muted)',
                  }}
                >
                  {stage.label}
                </span>
              </div>

              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/3',
                  overflow: 'hidden',
                  backgroundColor: 'var(--color-surface)',
                }}
              >
                <Image
                  src={stage.src}
                  alt={`${category.label} — ${stage.label}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>

              {stage.caption && (
                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.7rem',
                    color: 'var(--color-muted)',
                    marginTop: '0.75rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  {stage.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .split-scroll-grid {
            grid-template-columns: 1fr !important;
          }
          .split-scroll-left {
            position: static !important;
            height: auto !important;
          }
        }
      `}</style>
    </div>
  )
}
