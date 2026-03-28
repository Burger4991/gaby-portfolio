'use client'

import { useEffect, useRef } from 'react'
import ImageAccordion from './ImageAccordion'
import PullQuote from './PullQuote'
import About from './About'
import Contact from './Contact'

/**
 * Full-screen snap-scroll container for homepage sections below the hero.
 * Each child section fills the viewport and snaps into place on scroll.
 * Uses GSAP ScrollTrigger for smooth pinning + snap.
 */
export default function HomeSnap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const panels = panelRefs.current.filter(Boolean)
    if (panels.length < 2) return

    let ctx: { revert: () => void } | null = null

    async function init() {
      if (!container) return
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

  const panelBase: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
  }

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      {/* Panel 1: Portfolio Accordion — always visible first */}
      <div
        ref={(el) => { if (el) panelRefs.current[0] = el }}
        style={{
          ...panelBase,
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg)',
        }}
      >
        <div style={{ padding: '2.5rem 2rem 0.75rem', textAlign: 'center' }}>
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: 'var(--text-label)',
              letterSpacing: 'var(--tracking-wide)',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              marginBottom: '0.5rem',
            }}
          >
            Selected Work
          </p>
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              color: 'var(--color-text)',
              margin: 0,
            }}
          >
            Collections
          </h2>
        </div>
        <div style={{ flex: 1, padding: '0.75rem 1.5rem 1.5rem', minHeight: 0 }}>
          <ImageAccordion />
        </div>
      </div>

      {/* Panel 2: PullQuote — starts offscreen below */}
      <div
        ref={(el) => { if (el) panelRefs.current[1] = el }}
        style={{
          ...panelBase,
          zIndex: 2,
          transform: 'translateY(100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--color-bg)',
        }}
      >
        <PullQuote />
      </div>

      {/* Panel 3: About — starts offscreen below */}
      <div
        ref={(el) => { if (el) panelRefs.current[2] = el }}
        style={{
          ...panelBase,
          zIndex: 3,
          transform: 'translateY(100%)',
          overflow: 'auto',
          background: 'var(--color-surface)',
        }}
      >
        <About />
      </div>

      {/* Panel 4: Contact — starts offscreen below */}
      <div
        ref={(el) => { if (el) panelRefs.current[3] = el }}
        style={{
          ...panelBase,
          zIndex: 4,
          transform: 'translateY(100%)',
          overflow: 'auto',
          background: 'var(--color-bg)',
        }}
      >
        <Contact />
      </div>
    </div>
  )
}
