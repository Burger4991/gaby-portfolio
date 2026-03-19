'use client'

import { useRef } from 'react'

type Props = {
  src: string
  title: string
  alt: string
  category?: string
  onOpen: () => void
  featured?: boolean
}

export default function PortfolioCard({ src, title, alt, category, onOpen, featured }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.1s ease'
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02,1.02,1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.6s ease'
    card.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      onOpen()
    }
  }

  return (
    <div style={{ perspective: '800px' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onClick={onOpen} onKeyDown={handleKeyDown} role="button" aria-label={category ? `${title} — ${category}` : title} tabIndex={0} className="cursor-pointer">
      <div ref={cardRef}
        className={`relative overflow-hidden group ${featured ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}
        style={{ backgroundColor: 'var(--color-card-bg)', willChange: 'transform' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-[0.85]"
          style={{ backgroundColor: 'var(--color-overlay)' }} aria-hidden="true">
          <p className="text-xl font-light tracking-wide text-center px-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>{title}</p>
          {category && (
            <p className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color: 'var(--color-muted)' }}>{category}</p>
          )}
        </div>
      </div>
    </div>
  )
}
