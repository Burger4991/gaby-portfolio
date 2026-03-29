'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import type { SectionImage } from '@/data/portfolioData'
import SpotlightCard from './SpotlightCard'
import LiquidGlass from './LiquidGlass'

type ImageLightboxProps = {
  images: SectionImage[]
  initialIndex: number
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const image = images[index]

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', maxWidth: '900px', width: '100%' }}
      >
        {/* Prev arrow — LiquidGlass button */}
        <LiquidGlass
          as="button"
          onClick={prev}
          style={{ fontSize: '1.5rem', padding: '0.75rem 1rem', flexShrink: 0, color: 'var(--color-overlay-text)' }}
          aria-label="Previous image"
        >
          &#8249;
        </LiquidGlass>

        {/* Image card */}
        <SpotlightCard
          style={{
            flex: 1,
            padding: '1rem',
            backdropFilter: 'blur(12px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
            border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
            background: 'color-mix(in srgb, var(--color-card-bg) 70%, transparent)',
            boxShadow: 'inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent), 0 0 20px 0 color-mix(in srgb, var(--color-accent) 15%, transparent)',
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '8px', overflow: 'hidden' }}>
            <Image src={image.src} alt={image.caption ?? ''} fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 90vw, 800px" />
          </div>
          {(image.caption || image.stage) && (
            <div style={{
              padding: '0.75rem 0.5rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-sm)',
                color: 'var(--color-overlay-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-tight)',
              }}>
                {image.caption}
              </span>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-xs)',
                color: 'var(--color-overlay-dim)',
                letterSpacing: 'var(--tracking-normal)',
              }}>
                {index + 1} / {images.length}
              </span>
            </div>
          )}
        </SpotlightCard>

        {/* Next arrow — LiquidGlass button */}
        <LiquidGlass
          as="button"
          onClick={next}
          style={{ fontSize: '1.5rem', padding: '0.75rem 1rem', flexShrink: 0, color: 'var(--color-overlay-text)' }}
          aria-label="Next image"
        >
          &#8250;
        </LiquidGlass>
      </div>

      {/* Close button */}
      <LiquidGlass
        as="button"
        onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClose() }}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          fontSize: '1.2rem', padding: '0.5rem 0.75rem',
          color: 'var(--color-overlay-text)',
        }}
        aria-label="Close lightbox"
      >
        &#10005;
      </LiquidGlass>
    </div>
  )
}
