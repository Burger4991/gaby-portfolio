'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface ScrollExpandHeroProps {
  mediaSrc: string
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
  const scrollProgressRef = useRef(0)

  const showContent = scrollProgress >= 0.75

  useEffect(() => {
    const removeAll = () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const next = Math.min(1, Math.max(0, scrollProgressRef.current + e.deltaY / 800))
      scrollProgressRef.current = next
      setScrollProgress(next)
    }

    let touchStartY = 0
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const delta = touchStartY - e.touches[0].clientY
      touchStartY = e.touches[0].clientY
      const next = Math.min(1, Math.max(0, scrollProgressRef.current + delta / 400))
      scrollProgressRef.current = next
      setScrollProgress(next)
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    return removeAll
  }, [])

  // Image grows from 15vw/25vh → 100vw/100vh
  const imgW = `${15 + scrollProgress * 85}vw`
  const imgH = `${25 + scrollProgress * 75}vh`
  const bgOpacity = 0.7 - scrollProgress * 0.4

  return (
    <div className={className} style={{ position: 'relative', height: 'calc(100vh + 800px)' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Layer 0: Background image + dark overlay */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <Image src={bgImageSrc} alt="" fill style={{ objectFit: 'cover' }} priority />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'var(--color-bg)',
              opacity: bgOpacity,
              transition: 'opacity 0.1s linear',
            }}
          />
        </div>

        {/* Layer 1: Expanding hero image — grows from center */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: imgW,
            height: imgH,
            zIndex: 1,
            overflow: 'hidden',
            transition: 'width 0.05s linear, height 0.05s linear',
          }}
        >
          <Image src={mediaSrc} alt={title} fill style={{ objectFit: 'cover' }} priority />
        </div>

        {/* Layer 2: Text — always visible on top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop: '12vh',
            pointerEvents: 'none',
          }}
        >
          {eyebrow && (
            <p
              style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
                letterSpacing: '0.3em',
                color: 'var(--color-accent)',
                marginBottom: '0.75rem',
                textShadow: '0 1px 8px rgba(0,0,0,0.6)',
              }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 10vw, 8rem)',
              color: 'var(--color-text)',
              lineHeight: 1,
              margin: 0,
              textShadow: '0 2px 16px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Scroll hint — fades out as user scrolls */}
        {scrollToExpand && (
          <div
            style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 2,
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.3em',
              color: 'var(--color-muted)',
              opacity: 1 - scrollProgress * 2,
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {scrollToExpand}
          </div>
        )}

        {/* Children revealed at 75% */}
        {showContent && children && (
          <div
            style={{
              position: 'absolute',
              bottom: '4rem',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 3,
              animation: 'fadeInUp 0.5s ease forwards',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {children}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  )
}
