'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

type HomePanelData = {
  id: string
  label: string
  subtitle: string
  imageSrc: string
  href: string
  sectionCount: number
}

type CollectionPanelData = {
  id: string
  title: string
  index: number
  total: number
}

type FullScreenScrollFXProps =
  | { mode: 'home'; panels: HomePanelData[] }
  | { mode: 'collection'; panels: CollectionPanelData[]; collectionLabel: string }

export default function FullScreenScrollFX(props: FullScreenScrollFXProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const panels = panelRefs.current.filter(Boolean)
    if (panels.length < 2) return

    let ctx: { revert: () => void } | null = null

    async function init() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top top',
            end: () => `+=${panels.length * 100}vh`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            snap: {
              snapTo: 1 / (panels.length - 1),
              duration: { min: 0.2, max: 0.5 },
              ease: 'power1.inOut',
            },
          },
        })

        panels.forEach((panel, i) => {
          if (i === 0) return
          tl.fromTo(
            panel,
            { yPercent: 100 },
            { yPercent: 0, ease: 'none' },
            i - 1
          )
        })
      }, container)
    }

    init()
    return () => { ctx?.revert() }
  }, [])

  if (props.mode === 'home') {
    return (
      <section
        ref={containerRef}
        id="portfolio"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
      >
        {props.panels.map((panel, i) => (
          <div
            key={panel.id}
            ref={(el) => { if (el) panelRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            <Image
              src={panel.imageSrc}
              alt={panel.label}
              fill
              style={{ objectFit: 'cover', zIndex: 0 }}
              sizes="100vw"
              priority={i === 0}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, var(--color-overlay-gradient) 30%, transparent 100%)',
                zIndex: 1,
              }}
            />
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                padding: '0 2rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  margin: '0 0 0.75rem',
                }}
              >
                {String(i + 1).padStart(2, '0')} / {String(props.panels.length).padStart(2, '0')}
              </p>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  lineHeight: 1,
                  color: 'var(--color-overlay-heading)',
                  margin: '0 0 0.75rem',
                }}
              >
                {panel.label}
              </h2>
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-sm)',
                  letterSpacing: 'var(--tracking-normal)',
                  textTransform: 'uppercase',
                  color: 'var(--color-overlay-muted)',
                  margin: '0 0 2rem',
                }}
              >
                {panel.subtitle}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                <Link
                  href={panel.href}
                  data-cursor="link"
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
                  {panel.sectionCount} sections
                </span>
              </div>
            </div>
            {i === 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  zIndex: 2,
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'var(--text-label-xs)',
                  letterSpacing: 'var(--tracking-wide)',
                  textTransform: 'uppercase',
                  color: 'var(--color-overlay-dim)',
                }}
              >
                ↓ Scroll to explore
              </div>
            )}
          </div>
        ))}
      </section>
    )
  }

  // mode === 'collection'
  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {props.panels.map((panel, i) => (
        <div
          key={panel.id}
          ref={(el) => { if (el) panelRefs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'var(--text-label-sm)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              margin: '0 0 1.5rem',
            }}
          >
            {props.collectionLabel}
          </p>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'var(--text-label-sm)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              margin: '0 0 0.75rem',
            }}
          >
            {String(panel.index + 1).padStart(2, '0')} / {String(panel.total).padStart(2, '0')}
          </p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              lineHeight: 1,
              color: 'var(--color-text)',
              margin: '0 0 2.5rem',
              textAlign: 'center',
              padding: '0 2rem',
            }}
          >
            {panel.title}
          </h2>
          <a
            href={`#section-${panel.id}`}
            data-cursor="link"
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
            Enter Section →
          </a>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'var(--text-label-xs)',
          letterSpacing: 'var(--tracking-wide)',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
          pointerEvents: 'none',
        }}
      >
        ↓ Scroll through sections
      </div>
    </section>
  )
}
