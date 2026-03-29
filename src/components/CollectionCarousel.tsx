'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import type { SectionImage } from '@/data/portfolioData'
import LiquidGlass from './LiquidGlass'
import ImageLightbox from './ImageLightbox'

const CARD_HEIGHT = 320
const FACE_WIDTH = 220

type CollectionCarouselProps = {
  images: SectionImage[]
  sectionTitle: string
}

function Carousel({ images, sectionTitle, onActiveIndexChange, onImageClick }: {
  images: SectionImage[]
  sectionTitle: string
  onActiveIndexChange: (i: number) => void
  onImageClick: (i: number) => void
}) {
  const faceCount = images.length
  const cylinderWidth = faceCount * FACE_WIDTH
  const faceWidth = FACE_WIDTH
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`)
  const containerRef = useRef<HTMLDivElement>(null)

  const inertiaAnimation = useRef<ReturnType<typeof animate> | null>(null)
  const onActiveIndexChangeRef = useRef(onActiveIndexChange)
  onActiveIndexChangeRef.current = onActiveIndexChange

  useEffect(() => {
    const unsubscribe = rotation.on('change', (v) => {
      const faceAngle = 360 / faceCount
      const rawIndex = Math.round(-v / faceAngle)
      const normalized = ((rawIndex % faceCount) + faceCount) % faceCount
      onActiveIndexChangeRef.current(normalized)
    })
    return unsubscribe
  }, [rotation, faceCount])

  // Scroll/swipe to rotate — replaces drag interaction
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      inertiaAnimation.current?.stop()
      // Both axes rotate the carousel, but only prevent default scroll
      // when horizontal dominates (so vertical page scroll still works)
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
      if (Math.abs(e.deltaX) >= Math.abs(e.deltaY)) e.preventDefault()
      rotation.set(rotation.get() - delta * 0.15)
    }

    let touchStartX = 0
    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      inertiaAnimation.current?.stop()
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      const dx = e.touches[0].clientX - touchStartX
      const dy = e.touches[0].clientY - touchStartY
      // Only rotate if horizontal swipe dominates
      if (Math.abs(dx) > Math.abs(dy)) {
        e.preventDefault()
        rotation.set(rotation.get() + dx * 0.3)
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
    }
    const handleTouchEnd = () => {
      // Light inertia after swipe
      inertiaAnimation.current = animate(rotation, rotation.get(), {
        type: 'spring',
        stiffness: 100,
        damping: 30,
        mass: 0.1,
      })
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('touchstart', handleTouchStart, { passive: true })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
    }
  }, [rotation])

  useEffect(() => {
    return () => { inertiaAnimation.current?.stop() }
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        width: '100%',
        height: CARD_HEIGHT + 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        data-cursor="view"
        style={{
          transform,
          width: cylinderWidth,
          height: CARD_HEIGHT,
          transformStyle: 'preserve-3d',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'pan-y',
          userSelect: 'none',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => onImageClick(i)}
            style={{
              position: 'absolute',
              width: faceWidth,
              height: CARD_HEIGHT,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              padding: '0 6px',
              cursor: 'pointer',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                clipPath: 'inset(0 round 6px)',
                position: 'relative',
                border: '1px solid var(--color-border)',
              }}
            >
              <Image
                src={img.src}
                alt={img.caption ?? sectionTitle}
                fill
                style={{ objectFit: 'cover' }}
                sizes="220px"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export default function CollectionCarousel({ images, sectionTitle }: CollectionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  if (images.length === 0) return null

  if (images.length === 1) {
    const img = images[0]
    return (
      <>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: FACE_WIDTH * 2 }}>
          <div
            onClick={() => setLightboxIndex(0)}
            style={{ position: 'relative', width: '100%', height: CARD_HEIGHT, border: '1px solid var(--color-border)', borderRadius: 6, overflow: 'hidden', cursor: 'pointer' }}
          >
            <Image src={img.src} alt={img.caption ?? sectionTitle} fill style={{ objectFit: 'cover' }} sizes="440px" />
          </div>
          {(img.caption || img.stage) && (
            <div style={{ padding: '0.75rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: 'var(--text-label-sm)', color: 'var(--color-overlay-muted)', textTransform: 'uppercase', letterSpacing: 'var(--tracking-tight)' }}>{img.caption}</span>
              {img.stage && <LiquidGlass style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-accent)' }}>{img.stage}</LiquidGlass>}
            </div>
          )}
        </div>
        {lightboxIndex !== null && (
          <ImageLightbox
            images={images}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Carousel
        images={images}
        sectionTitle={sectionTitle}
        onActiveIndexChange={setActiveIndex}
        onImageClick={(i: number) => setLightboxIndex(i)}
      />
      {activeImage && (
        <div
          style={{
            padding: '0.75rem 1rem 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'var(--text-label-sm)',
            letterSpacing: 'var(--tracking-tight)',
            textTransform: 'uppercase',
            color: 'var(--color-overlay-muted)',
          }}>
            {activeImage.caption}
          </span>
          {activeImage.stage && (
            <LiquidGlass style={{ fontSize: 'var(--text-label-xs)', color: 'var(--color-accent)' }}>
              {activeImage.stage}
            </LiquidGlass>
          )}
        </div>
      )}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'Manrope, sans-serif',
          fontSize: 'var(--text-label-xs)',
          letterSpacing: 'var(--tracking-normal)',
          textTransform: 'uppercase',
          color: 'var(--color-overlay-dim)',
          paddingTop: '0.5rem',
        }}
      >
        scroll to rotate
      </div>
      {lightboxIndex !== null && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  )
}
