'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — gsap/Observer casing conflicts with observer.d.ts on macOS case-insensitive FS
import { Observer } from 'gsap/Observer'
import type { SectionImage } from '@/data/portfolioData'
import CollectionCarousel from './CollectionCarousel'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer)
}

type CollectionScrollSection = {
  id: string
  background: string
  title: string
  description: string
  outcome: string
  pills: string[]
  images: SectionImage[]
  counter: string
}

export type CollectionScrollFXProps = {
  sections: CollectionScrollSection[]
  collectionLabel: string
}

function parseOutcome(outcome: string): { label: string; body: string } {
  if (outcome.startsWith('↑') || outcome.startsWith('Featured')) {
    if (outcome.includes(' — ')) {
      const [label, ...rest] = outcome.split(' — ')
      return { label, body: rest.join(' — ') }
    }
    if (outcome.includes('. ')) {
      const [label, ...rest] = outcome.split('. ')
      return { label, body: rest.join('. ') }
    }
  }
  return { label: 'Outcome', body: outcome }
}

export default function CollectionScrollFX({ sections, collectionLabel }: CollectionScrollFXProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = sections.length
  const isAnimatingRef = useRef(false)
  const currentIndexRef = useRef(0)
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])
  const goToRef = useRef<((next: number) => void) | null>(null)

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || total === 0) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    bgRefs.current.forEach((bg, i) => {
      if (bg) gsap.set(bg, { opacity: i === 0 ? 1 : 0 })
    })
    textRefs.current.forEach((text, i) => {
      if (text) gsap.set(text, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 })
    })

    const goTo = (next: number) => {
      if (isAnimatingRef.current) return
      const prev = currentIndexRef.current
      if (next === prev) return
      isAnimatingRef.current = true
      currentIndexRef.current = next

      const prevBg = bgRefs.current[prev]
      const nextBg = bgRefs.current[next]
      if (prevBg) gsap.to(prevBg, { opacity: 0, duration: 0.6, ease: 'power2.out' })
      if (nextBg) gsap.to(nextBg, { opacity: 1, duration: 0.6, ease: 'power2.out' })

      const prevText = textRefs.current[prev]
      if (prevText) gsap.to(prevText, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' })

      const nextText = textRefs.current[next]
      if (nextText) {
        gsap.set(nextText, { opacity: 0, y: 20 })
        gsap.to(nextText, { opacity: 1, y: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' })
      }

      setActiveIndex(next)
      gsap.delayedCall(0.8, () => { isAnimatingRef.current = false })
    }

    goToRef.current = goTo

    const observer = Observer.create({
      type: 'wheel,touch',
      preventDefault: false,
      debounce: true,
      onDown: (self) => {
        const e = self.event as WheelEvent | null
        if (e && 'deltaX' in e && 'deltaY' in e) {
          if (Math.abs((e as WheelEvent).deltaX) >= Math.abs((e as WheelEvent).deltaY)) return
        }
        goTo((currentIndexRef.current + 1) % total)
      },
      onUp: (self) => {
        const e = self.event as WheelEvent | null
        if (e && 'deltaX' in e && 'deltaY' in e) {
          if (Math.abs((e as WheelEvent).deltaX) >= Math.abs((e as WheelEvent).deltaY)) return
        }
        goTo((currentIndexRef.current - 1 + total) % total)
      },
    })

    return () => {
      gsap.killTweensOf(bgRefs.current)
      gsap.killTweensOf(textRefs.current)
      observer.kill()
      document.body.style.overflow = prevOverflow
    }
  }, [total])

  if (total === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
        zIndex: 0,
      }}
    >
      {/* Fixed overlay: back nav + collection label */}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '4rem',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
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
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            maxWidth: '12rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {collectionLabel}
        </span>
      </div>

      {/* Background images — all rendered, only active is visible */}
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => { bgRefs.current[i] = el }}
          style={{ position: 'absolute', inset: 0, opacity: 0 }}
        >
          <Image
            src={section.background}
            alt=""
            fill
            style={{ objectFit: 'cover', filter: 'brightness(0.65)' }}
            sizes="100vw"
            priority={i === 0}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(12,12,14,0.95) 0%, rgba(12,12,14,0.92) 35%, rgba(12,12,14,0.5) 55%, transparent 100%)',
            }}
          />
        </div>
      ))}

      {/* 40/60 split panel */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          zIndex: 1,
        }}
      >
        {/* Left: text content (all sections stacked, only active visible) */}
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          {sections.map((section, i) => {
            const { label, body } = parseOutcome(section.outcome)
            return (
              <div
                key={section.id}
                ref={(el) => { textRefs.current[i] = el }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '3rem 2.5rem 3rem 4rem',
                  gap: '1.5rem',
                  opacity: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    margin: 0,
                  }}
                >
                  {section.counter}
                </p>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    lineHeight: 1.05,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--color-muted)',
                    margin: 0,
                  }}
                >
                  {section.description}
                </p>
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '2px solid var(--color-accent)',
                    background: 'rgba(184,150,90,0.05)',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                      fontFamily: 'Manrope, sans-serif',
                    }}
                  >
                    {label}
                  </span>
                  {' '}
                  {body}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
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
              </div>
            )
          })}
        </div>

        {/* Right: 3D carousel — key resets it on section change */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 3rem 3rem 2.5rem',
          }}
        >
          <CollectionCarousel
            key={activeIndex}
            images={sections[activeIndex].images}
            sectionTitle={sections[activeIndex].title}
          />
        </div>
      </div>

      {/* Progress dots — bottom center */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          zIndex: 100,
        }}
      >
        {sections.map((_, i) => (
          <button
            key={i}
            onClick={() => goToRef.current?.(i)}
            data-cursor="link"
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: i === activeIndex ? 'var(--color-accent)' : 'transparent',
              border: i === activeIndex ? '1px solid var(--color-accent)' : '1px solid var(--color-border)',
              transition: 'background 0.3s ease',
              padding: 0,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}
