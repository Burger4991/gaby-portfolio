'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface ScrollExpandHeroProps {
  mediaSrc: string
  posterSrc?: string
  bgImageSrc: string
  title: string
  eyebrow?: string
  scrollToExpand?: string
  children?: React.ReactNode
  className?: string
}

export default function ScrollExpandHero({
  mediaSrc,
  bgImageSrc,
  title,
  eyebrow,
  scrollToExpand,
  children,
  className = '',
}: ScrollExpandHeroProps) {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef(0)

  const showContent = scrollProgress >= 0.75

  // Split title on first space
  const spaceIndex = title.indexOf(' ')
  const firstWord = spaceIndex !== -1 ? title.slice(0, spaceIndex) : title
  const restOfTitle = spaceIndex !== -1 ? title.slice(spaceIndex + 1) : ''

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Scroll interception
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollProgressRef.current >= 1) return
      e.preventDefault()
      const newProgress = Math.min(1, Math.max(0, scrollProgressRef.current + e.deltaY / 800))
      scrollProgressRef.current = newProgress
      setScrollProgress(newProgress)
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY
    }
    const handleTouchMove = (e: TouchEvent) => {
      if (scrollProgressRef.current >= 1) return
      e.preventDefault()
      const delta = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      const newProgress = Math.min(1, Math.max(0, scrollProgressRef.current + delta / 400))
      scrollProgressRef.current = newProgress
      setScrollProgress(newProgress)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  // Derived dimensions
  const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250)
  const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400)
  const hasTwoWords = spaceIndex !== -1 && restOfTitle.length > 0
  const effectiveTranslate = hasTwoWords ? scrollProgress * (isMobile ? 180 : 150) : 0

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', height: 'calc(100vh + 800px)' }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Background image */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Image
            src={bgImageSrc}
            alt=""
            fill
            style={{ objectFit: 'cover' }}
            priority
            unoptimized
          />
          {/* Dark overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--color-bg)',
              opacity: 0.7,
            }}
          />
        </div>

        {/* Content layer */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }}
        >
          {/* Eyebrow */}
          {eyebrow && (
            <motion.p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '1rem',
                opacity: 1 - scrollProgress * 1.5 > 0 ? 1 - scrollProgress * 1.5 : 0,
              }}
            >
              {eyebrow}
            </motion.p>
          )}

          {/* Title row */}
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}
          >
            <motion.span
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 'clamp(3rem, 10vw, 8rem)',
                color: 'var(--color-text)',
                display: 'block',
                translateX: -effectiveTranslate,
                lineHeight: 1,
              }}
            >
              {firstWord}
            </motion.span>
            {restOfTitle && (
              <motion.span
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(3rem, 10vw, 8rem)',
                  color: 'var(--color-text)',
                  display: 'block',
                  translateX: effectiveTranslate,
                  lineHeight: 1,
                }}
              >
                {restOfTitle}
              </motion.span>
            )}
          </div>

          {/* Expanding media */}
          <div
            style={{
              position: 'relative',
              width: mediaWidth,
              height: mediaHeight,
              maxWidth: '100vw',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            <Image
              src={mediaSrc}
              alt={title}
              fill
              style={{ objectFit: 'cover' }}
              priority
              unoptimized
            />
          </div>

          {/* Scroll to expand hint */}
          {scrollToExpand && (
            <div
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--color-muted)',
                marginTop: '1.25rem',
                opacity: 1 - scrollProgress,
                textAlign: 'center',
              }}
            >
              {scrollToExpand}
            </div>
          )}

          {/* Children revealed after 75% progress */}
          {showContent && children && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ color: 'var(--color-text)' }}
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
