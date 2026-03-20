'use client'

import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
// ThreeDCarousel is no longer used — kept for reference only
type PortfolioItem = { id: string; src: string; alt: string; title: string }

const CARD_HEIGHT = 320
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(function Carousel({
  items,
  handleClick,
  isCarouselActive,
  categoryId,
}: {
  items: PortfolioItem[]
  handleClick: (item: PortfolioItem) => void
  isCarouselActive: boolean
  categoryId: string
}) {
  const faceCount = items.length
  const cylinderWidth = faceCount * 240
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`)

  const isDragging = useRef(false)
  const lastX = useRef(0)
  const velocityX = useRef(0)
  const lastTime = useRef(0)
  const inertiaAnimation = useRef<ReturnType<typeof animate> | null>(null)

  // Stop inertia when carousel is deactivated (card expanded)
  useEffect(() => {
    if (!isCarouselActive) {
      inertiaAnimation.current?.stop()
    }
  }, [isCarouselActive])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isCarouselActive) return
    inertiaAnimation.current?.stop()
    isDragging.current = true
    lastX.current = e.clientX
    lastTime.current = performance.now()
    velocityX.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !isCarouselActive) return
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
    if (isCarouselActive) {
      inertiaAnimation.current = animate(rotation, rotation.get() + velocityX.current * 60, {
        type: 'spring',
        stiffness: 100,
        damping: 30,
        mass: 0.1,
      })
    }
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
        {items.map((item, i) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              width: faceWidth,
              height: CARD_HEIGHT,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              padding: '0 8px',
            }}
            onClick={() => handleClick(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(item) }}
          >
            <motion.div
              layoutId={`card-${item.id}`}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 6,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="240px"
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '16px 12px 12px',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent)',
                  color: '#fff',
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontSize: '1rem',
                }}
              >
                {item.title}
              </div>
              <Link
                href={`/work/${categoryId}`}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.6rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.2em',
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  padding: '4px 8px',
                  border: '1px solid rgba(255,255,255,0.3)',
                }}
              >
                Process →
              </Link>
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  )
})

export default function ThreeDCarousel({ items, categoryId }: { items: PortfolioItem[]; categoryId: string }) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)

  const handleClick = (item: PortfolioItem) => {
    setActiveItem(item)
    setIsCarouselActive(false)
  }

  const handleClose = () => {
    setActiveItem(null)
    setIsCarouselActive(true)
  }

  return (
    <motion.div layout style={{ position: 'relative' }}>
      <AnimatePresence mode="sync">
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
            transition={transitionOverlay}
          >
            <motion.div
              layoutId={`card-${activeItem.id}`}
              style={{
                width: 'min(80vw, 520px)',
                aspectRatio: '3/4',
                borderRadius: 8,
                overflow: 'hidden',
                position: 'relative',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={activeItem.src}
                alt={activeItem.alt}
                fill
                style={{ objectFit: 'cover' }}
                sizes="520px"
              />
            </motion.div>
            <div
              style={{
                position: 'absolute',
                top: '2rem',
                right: '2rem',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
              }}
            >
              Click to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <Carousel
        items={items}
        handleClick={handleClick}
        isCarouselActive={isCarouselActive}
        categoryId={categoryId}
      />
    </motion.div>
  )
}
