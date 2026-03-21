'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import type { SectionImage } from '@/data/portfolioData'

const CARD_HEIGHT = 280
const CARD_WIDTH = 220
const GAP = 20

type CollectionCarouselProps = {
  images: SectionImage[]
  sectionTitle: string
}

export default function CollectionCarousel({ images, sectionTitle }: CollectionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollStart = useRef(0)
  const velocityX = useRef(0)
  const lastX = useRef(0)
  const lastTime = useRef(0)
  const rafRef = useRef<number | null>(null)

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }, [])

  if (images.length === 0) return null

  // Single image: skip carousel, show static display
  if (images.length === 1) {
    const img = images[0]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: CARD_WIDTH * 2 }}>
        <div style={{ position: 'relative', width: '100%', height: CARD_HEIGHT, border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
          <Image src={img.src} alt={img.caption ?? sectionTitle} fill style={{ objectFit: 'cover' }} sizes="440px" />
        </div>
        {(img.caption || img.stage) && (
          <div style={{ padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)' }}>
            <span>{img.caption}</span>
            {img.stage && <span style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--color-border)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-accent)' }}>{img.stage}</span>}
          </div>
        )}
      </div>
    )
  }

  function updateActiveIndex() {
    const track = trackRef.current
    if (!track) return
    const idx = Math.round(track.scrollLeft / (CARD_WIDTH + GAP))
    setActiveIndex(Math.max(0, Math.min(idx, images.length - 1)))
  }

  function applyInertia() {
    const track = trackRef.current
    if (!track || Math.abs(velocityX.current) < 0.1) {
      velocityX.current = 0
      return
    }
    track.scrollLeft -= velocityX.current * 8
    velocityX.current *= 0.92
    updateActiveIndex()
    rafRef.current = requestAnimationFrame(applyInertia)
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    isDragging.current = true
    startX.current = e.clientX
    scrollStart.current = trackRef.current?.scrollLeft ?? 0
    lastX.current = e.clientX
    lastTime.current = performance.now()
    velocityX.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !trackRef.current) return
    const now = performance.now()
    const dt = now - lastTime.current
    const dx = e.clientX - lastX.current
    velocityX.current = dt > 0 ? dx / dt : 0
    lastX.current = e.clientX
    lastTime.current = now
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - startX.current)
    updateActiveIndex()
  }

  const handlePointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    rafRef.current = requestAnimationFrame(applyInertia)
  }

  const activeImage = images[activeIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <style>{`.flat-carousel::-webkit-scrollbar { display: none }`}</style>
      <div
        ref={trackRef}
        className="flat-carousel"
        data-cursor="drag"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          display: 'flex',
          gap: `${GAP}px`,
          overflowX: 'scroll',
          scrollbarWidth: 'none',
          cursor: 'grab',
          userSelect: 'none',
          touchAction: 'pan-y',
        } as React.CSSProperties}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              flex: '0 0 auto',
              width: CARD_WIDTH,
              height: CARD_HEIGHT,
              position: 'relative',
              border: '1px solid var(--color-border)',
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <Image
              src={img.src}
              alt={img.caption ?? sectionTitle}
              fill
              style={{ objectFit: 'cover', pointerEvents: 'none' }}
              sizes="220px"
            />
          </div>
        ))}
      </div>
      {activeImage && (activeImage.caption || activeImage.stage) && (
        <div style={{ padding: '0.6rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '0.62rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--color-muted)', borderTop: '1px solid var(--color-border)' }}>
          <span>{activeImage.caption}</span>
          {activeImage.stage && (
            <span style={{ padding: '0.2rem 0.5rem', border: '1px solid var(--color-border)', fontSize: '0.55rem', letterSpacing: '0.15em', color: 'var(--color-accent)' }}>
              {activeImage.stage}
            </span>
          )}
        </div>
      )}
      <div style={{ textAlign: 'center', fontFamily: 'Manrope, sans-serif', fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--color-border)', paddingBottom: '0.5rem' }}>
        drag to scroll
      </div>
    </div>
  )
}
