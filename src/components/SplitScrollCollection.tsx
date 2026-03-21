'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { PortfolioCategory } from '@/data/portfolioData'
import CollectionCarousel from './CollectionCarousel'
import GlowingShadow from './GlowingShadow'
import CollectionScrollFX from './CollectionScrollFX'

export default function SplitScrollCollection({ category }: { category: PortfolioCategory }) {
  const [activeSection, setActiveSection] = useState(category.sections[0]?.id ?? '')
  const [revealedSections, setRevealedSections] = useState<Set<string>>(
    () => new Set([category.sections[0]?.id ?? ''])
  )
  const revealedRef = useRef<Set<string>>(new Set([category.sections[0]?.id ?? '']))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id.replace('section-', '')
            setActiveSection(id)
            if (!revealedRef.current.has(id)) {
              revealedRef.current.add(id)
              setRevealedSections(new Set(revealedRef.current))
            }
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '-64px 0px 0px 0px',
      }
    )
    category.sections.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.id])

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '4rem' }}>

      {/* Back nav */}
      <div className="split-back-nav" style={{ padding: '1.5rem 4rem 0' }}>
        <Link
          href="/#portfolio"
          data-cursor="link"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            textDecoration: 'none',
          }}
        >
          ← Back to Portfolio
        </Link>
      </div>

      {/* Page header */}
      <div
        className="split-page-header"
        style={{
          padding: '4rem 4rem 3rem',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            marginBottom: '1rem',
          }}
        >
          Collections
        </p>
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            lineHeight: 1,
            color: 'var(--color-text)',
            margin: '0 0 1rem',
          }}
        >
          {category.label}
        </h1>
        <p
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
          }}
        >
          {category.subtitle}
        </p>
      </div>

      {/* Section-picker intro */}
      <CollectionScrollFX
        sections={category.sections.map((s, idx) => ({
          id: s.id,
          background: s.images[0]?.src ?? '',
          leftLabel: String(idx + 1).padStart(2, '0'),
          title: s.title,
          rightLabel: s.pills[0] ?? '',
        }))}
      />

      {/* One split-collection block per section */}
      {category.sections.map((section, i) => {
        const revealed = revealedSections.has(section.id)
        return (
          <div key={section.id}>


            {/* Section grid */}
            <div
              id={`section-${section.id}`}
              style={{
                display: 'grid',
                gridTemplateColumns: '3fr 2fr',
                borderBottom: '1px solid var(--color-border)',
              }}
              className="split-collection"
            >
              {/* Left: sticky story panel */}
              <div
                className="split-story"
                style={{
                  position: 'sticky',
                  top: '4rem',
                  height: 'auto',
                  alignSelf: 'flex-start',
                  padding: '3rem 2.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                <p
                  className={revealed ? 'section-reveal revealed' : 'section-reveal'}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    animationDelay: '0ms',
                  }}
                >
                  {String(i + 1).padStart(2, '0')} / {String(category.sections.length).padStart(2, '0')}
                </p>

                <h2
                  className={revealed ? 'section-reveal revealed' : 'section-reveal'}
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    lineHeight: 1.05,
                    color: 'var(--color-text)',
                    margin: 0,
                    animationDelay: '80ms',
                  }}
                >
                  {section.title}
                </h2>

                <p
                  className={revealed ? 'section-reveal revealed' : 'section-reveal'}
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--color-muted)',
                    maxWidth: '380px',
                    margin: 0,
                    animationDelay: '160ms',
                  }}
                >
                  {section.description}
                </p>

                <div
                  className={revealed ? 'section-reveal revealed' : 'section-reveal'}
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '2px solid var(--color-accent)',
                    background: 'rgba(184,150,90,0.05)',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text)',
                    animationDelay: '240ms',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                      fontFamily: 'Manrope, sans-serif',
                    }}
                  >
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

                {/* Stage pills */}
                <div
                  className={revealed ? 'section-reveal revealed' : 'section-reveal'}
                  style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', animationDelay: '320ms' }}
                >
                  {section.pills.map((pill) => (
                    <span
                      key={pill}
                      style={{
                        padding: '0.3rem 0.75rem',
                        border: '1px solid var(--color-accent)',
                        background: 'rgba(184,150,90,0.08)',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                        borderRadius: '2px',
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>

                {/* Section jump nav */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                  <p style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-border)', marginBottom: '0.5rem' }}>
                    Sections
                  </p>
                  {category.sections.map((s, idx) => (
                    <a
                      key={s.id}
                      href={`#section-${s.id}`}
                      style={{
                        display: 'block',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '0.6rem',
                        letterSpacing: '0.1em',
                        padding: '0.2rem 0',
                        color: activeSection === s.id ? 'var(--color-accent)' : 'var(--color-border)',
                        textDecoration: 'none',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {String(idx + 1).padStart(2, '0')}  {s.title}
                    </a>
                  ))}
                </div>

                <GlowingShadow />
              </div>

              {/* Right: image carousel */}
              <div
                className="split-images"
                style={{
                  padding: '3rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}
              >
                <CollectionCarousel images={section.images} sectionTitle={section.title} />
              </div>
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes sectionFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .section-reveal {
          opacity: 0;
          transform: translateY(18px);
        }

        .section-reveal.revealed {
          animation: sectionFadeUp 0.55s cubic-bezier(0.4, 0, 0.2, 1) both;
        }

        @media (max-width: 768px) {
          .split-back-nav {
            padding: 1.5rem 1.5rem 0 !important;
          }
          .split-page-header {
            padding: 2.5rem 1.5rem 2rem !important;
          }
          .split-collection {
            grid-template-columns: 1fr !important;
          }
          .split-story {
            position: static !important;
            align-self: auto !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--color-border);
            padding: 2.5rem 1.5rem !important;
          }
          .split-images {
            padding: 2rem 1.5rem !important;
          }
          .section-divider {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}
