'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'

gsap.registerPlugin(ScrollTrigger)

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

    const ctx = gsap.context(() => {
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

    return () => ctx.revert()
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
                background: 'linear-gradient(to top, rgba(10,8,6,0.88) 30%, rgba(10,8,6,0.25) 100%)',
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
                  fontSize: '0.58rem',
                  letterSpacing: '0.38em',
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
                  color: '#fff',
                  margin: '0 0 0.75rem',
                }}
              >
                {panel.label}
              </h2>
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
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
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
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
              fontSize: '0.58rem',
              letterSpacing: '0.38em',
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
              fontSize: '0.58rem',
              letterSpacing: '0.35em',
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
              fontSize: '0.62rem',
              letterSpacing: '0.28em',
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
          fontSize: '0.55rem',
          letterSpacing: '0.3em',
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
