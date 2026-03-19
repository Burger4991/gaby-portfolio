'use client'

import { useCallback } from 'react'
import { motion, useMotionValue, useSpring, type PanInfo } from 'framer-motion'
import Image from 'next/image'
import type { PortfolioItem } from '@/data/portfolioData'

const CARD_WIDTH = 220
const CARD_HEIGHT = 300

interface ThreeDCarouselProps {
  items: PortfolioItem[]
  onOpen: (item: PortfolioItem) => void
}

export default function ThreeDCarousel({ items, onOpen }: ThreeDCarouselProps) {
  const radius = (CARD_WIDTH * items.length) / (2 * Math.PI)

  const rotateY = useMotionValue(0)
  const springRotation = useSpring(rotateY, { stiffness: 300, damping: 30 })

  const handlePan = useCallback(
    (_e: PointerEvent, info: PanInfo) => {
      rotateY.set(rotateY.get() + info.delta.x * 0.5)
    },
    [rotateY]
  )

  return (
    <div
      style={{
        perspective: '1000px',
        width: '100%',
        height: `${CARD_HEIGHT + 40}px`,
        overflow: 'visible',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <motion.div
        onPan={handlePan}
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          rotateY: springRotation,
          cursor: 'grab',
          position: 'relative',
        }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {items.map((item, i) => {
          const cardAngle = (i / items.length) * 360
          return (
            /* Outer: 3D positioning only — no overflow, no borderRadius */
            <motion.div
              key={item.id}
              onClick={() => onOpen(item)}
              role="button"
              tabIndex={0}
              aria-label={`View ${item.title}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onOpen(item)
                }
              }}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                marginLeft: -CARD_WIDTH / 2,
                marginTop: -CARD_HEIGHT / 2,
                rotateY: cardAngle,
                translateZ: radius,
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              {/* Inner: visual clip wrapper */}
              <div style={{ width: '100%', height: '100%', overflow: 'hidden', borderRadius: 4, position: 'relative' }}>
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="220px"
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '12px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    color: 'var(--color-text)',
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle: 'italic',
                    fontSize: '1rem',
                  }}
                >
                  {item.title}
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
