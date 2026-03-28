'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import type { SectionImage } from '@/data/portfolioData'

const CARD_HEIGHT = 280
const FACE_WIDTH = 200

type CollectionCarouselProps = {
  images: SectionImage[]
  sectionTitle: string
}

function Carousel({ images, sectionTitle, onActiveIndexChange }: {
  images: SectionImage[]
  sectionTitle: string
  onActiveIndexChange: (i: number) => void
}) {
  const faceCount = images.length
  const cylinderWidth = faceCount * FACE_WIDTH
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`)

  const isDragging = useRef(false)
  const lastX = useRef(0)
  const velocityX = useRef(0)
  const lastTime = useRef(0)
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

  useEffect(() => {
    return () => {
      inertiaAnimation.current?.stop()
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    inertiaAnimation.current?.stop()
    isDragging.current = true
    lastX.current = e.clientX
    lastTime.current = performance.now()
    velocityX.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const now = performance.now()
    const dt = now - lastTime.current
    const dx = e.clientX - lastX.current
    velocityX.current = dt > 0 ? dx / dt : 0
    lastX.current = e.clientX
    lastTime.current = now
    rotation.set(rotation.get() + dx * 0.3)
  }

  const handlePointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    inertiaAnimation.current = animate(rotation, rotation.get() + velocityX.current * 60, {
      type: 'spring',
      stiffness: 100,
      damping: 30,
      mass: 0.1,
    })
  }

  return (
    <div
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
        data-cursor="drag"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          transform,
          width: cylinderWidth,
          height: CARD_HEIGHT,
          transformStyle: 'preserve-3d',
          cursor: 'grab',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: faceWidth,
              height: CARD_HEIGHT,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              padding: '0 6px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                clipPath: 'inset(0 round 4px)',
                position: 'relative',
                border: '1px solid var(--color-border)',
              }}
            >
              <Image
                src={img.src}
                alt={img.caption ?? sectionTitle}
                fill
                style={{ objectFit: 'cover' }}
                sizes="200px"
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
  if (images.length === 0) return null

  if (images.length === 1) {
    const img = images[0]
    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: FACE_WIDTH * 2 }}>
        <div style={{ position: 'relative', width: '100%', height: CARD_HEIGHT, border: '1px solid var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
          <Image src={img.src} alt={img.caption ?? sectionTitle} fill style={{ objectFit: 'cover' }} sizes="400px" />
        </div>
        {(img.caption || img.stage) && (
          <div style={{
            padding: '0.6rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'var(--text-label-sm)',
            letterSpacing: 'var(--tracking-tight)',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            borderTop: '1px solid var(--color-border)',
          }}>
            <span>{img.caption}</span>
            {img.stage && <span style={{
              padding: '0.2rem 0.5rem',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-label-xs)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--color-accent)',
            }}>{img.stage}</span>}
          </div>
        )}
      </div>
    )
  }

  const activeImage = images[activeIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Carousel
        images={images}
        sectionTitle={sectionTitle}
        onActiveIndexChange={setActiveIndex}
      />
      {activeImage && (activeImage.caption || activeImage.stage) && (
        <div
          style={{
            padding: '0.6rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Manrope, sans-serif',
            fontSize: 'var(--text-label-sm)',
            letterSpacing: 'var(--tracking-tight)',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <span>{activeImage.caption}</span>
          {activeImage.stage && (
            <span
              style={{
                padding: '0.2rem 0.5rem',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-label-xs)',
                letterSpacing: 'var(--tracking-tight)',
                color: 'var(--color-accent)',
              }}
            >
              {activeImage.stage}
            </span>
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
          color: 'var(--color-muted)',
          paddingBottom: '0.5rem',
        }}
      >
        drag to rotate
      </div>
    </div>
  )
}
