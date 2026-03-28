'use client'

import { useRef, useCallback } from 'react'

type SpotlightCardProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

/**
 * Card with pointer-tracking spotlight glow on border/background.
 * Used for text content cards on collection pages.
 */
export default function SpotlightCard({ children, className, style }: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    card.style.setProperty('--spotlight-x', `${x}%`)
    card.style.setProperty('--spotlight-y', `${y}%`)
    card.style.setProperty('--spotlight-opacity', '1')
  }, [])

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--spotlight-opacity', '0')
  }, [])

  return (
    <div
      ref={cardRef}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        position: 'relative',
        borderRadius: '12px',
        border: '1px solid var(--color-border)',
        background: 'var(--color-card-bg)',
        overflow: 'hidden',
        '--spotlight-x': '50%',
        '--spotlight-y': '50%',
        '--spotlight-opacity': '0',
        ...style,
      } as React.CSSProperties}
    >
      {/* Spotlight gradient overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 1,
          background: `radial-gradient(
            circle 200px at var(--spotlight-x) var(--spotlight-y),
            color-mix(in srgb, var(--color-accent) 12%, transparent) 0%,
            transparent 70%
          )`,
          opacity: 'var(--spotlight-opacity)' as string,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Border glow overlay */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-1px',
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 0,
          background: `radial-gradient(
            circle 160px at var(--spotlight-x) var(--spotlight-y),
            color-mix(in srgb, var(--color-accent) 30%, transparent) 0%,
            transparent 70%
          )`,
          opacity: 'var(--spotlight-opacity)' as string,
          transition: 'opacity 0.3s ease',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />
      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}
