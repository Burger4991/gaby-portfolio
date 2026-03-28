'use client'

import { useRef, useCallback } from 'react'

type GlowCardProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function GlowCard({ children, className, style }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xPct = (x / rect.width) * 100
    const yPct = (y / rect.height) * 100
    // Hue shifts from 40 (gold) to 320 (rose) across X axis
    const hue = 40 + (xPct / 100) * 280
    card.style.setProperty('--glow-x', `${xPct}%`)
    card.style.setProperty('--glow-y', `${yPct}%`)
    card.style.setProperty('--glow-hue', String(hue))
    card.style.setProperty('--glow-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--glow-opacity', '0')
  }, [])

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-hue': '40',
        '--glow-opacity': '0',
        ...style,
      } as React.CSSProperties}
    >
      {/* Spotlight overlay — sits above image, below pointer events */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 2,
          background: `radial-gradient(
            circle 140px at var(--glow-x) var(--glow-y),
            hsla(var(--glow-hue), 70%, 75%, 0.18) 0%,
            transparent 80%
          )`,
          opacity: 'var(--glow-opacity)' as string,
          transition: 'opacity 0.25s ease',
        }}
      />
      {children}
    </div>
  )
}
