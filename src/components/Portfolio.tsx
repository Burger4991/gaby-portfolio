'use client'

import { useState } from 'react'
import { categories } from '@/data/portfolioData'
import type { PortfolioItem } from '@/data/portfolioData'
import PortfolioCategory from './PortfolioCategory'
import Lightbox from './Lightbox'

export default function Portfolio() {
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)

  return (
    <section id="portfolio" className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
      <div className="mb-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Selected Work</p>
        <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>Collections</h2>
      </div>
      {categories.map((cat, i) => (
        <PortfolioCategory key={cat.id} number={String(i + 1).padStart(2, '0')}
          label={cat.label} subtitle={cat.subtitle} items={cat.items}
          onOpen={item => setLightbox(item)} />
      ))}
      <Lightbox src={lightbox?.src} title={lightbox?.title} alt={lightbox?.alt} onClose={() => setLightbox(null)} />
    </section>
  )
}
