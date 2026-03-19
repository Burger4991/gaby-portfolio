'use client'

import { memo, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'framer-motion'
import Image from 'next/image'
import type { PortfolioItem } from '@/data/portfolioData'

const CARD_HEIGHT = 320
const transitionOverlay = { duration: 0.5, ease: [0.32, 0.72, 0, 1] as const }

const Carousel = memo(function Carousel({
  items,
  handleClick,
  controls,
  isCarouselActive,
}: {
  items: PortfolioItem[]
  handleClick: (item: PortfolioItem) => void
  controls: ReturnType<typeof useAnimation>
  isCarouselActive: boolean
}) {
  const faceCount = items.length
  const cylinderWidth = faceCount * 240
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`)

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
        drag={isCarouselActive ? 'x' : false}
        style={{
          transform,
          rotateY: rotation,
          width: cylinderWidth,
          height: CARD_HEIGHT,
          transformStyle: 'preserve-3d',
          cursor: 'grab',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        whileTap={{ cursor: 'grabbing' }}
        onDrag={(_, info) => {
          if (isCarouselActive) rotation.set(rotation.get() + info.offset.x * 0.05)
        }}
        onDragEnd={(_, info) => {
          if (isCarouselActive) {
            controls.start({
              rotateY: rotation.get() + info.velocity.x * 0.05,
              transition: { type: 'spring', stiffness: 100, damping: 30, mass: 0.1 },
            })
          }
        }}
        animate={controls}
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
            </motion.div>
          </div>
        ))}
      </motion.div>
    </div>
  )
})

export default function ThreeDCarousel({ items }: { items: PortfolioItem[] }) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null)
  const [isCarouselActive, setIsCarouselActive] = useState(true)
  const controls = useAnimation()

  const handleClick = (item: PortfolioItem) => {
    setActiveItem(item)
    setIsCarouselActive(false)
    controls.stop()
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
            {/* Close hint */}
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
        controls={controls}
        isCarouselActive={isCarouselActive}
      />
    </motion.div>
  )
}
