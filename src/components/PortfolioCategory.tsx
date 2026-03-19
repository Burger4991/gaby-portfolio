'use client'

import PortfolioCard from './PortfolioCard'
import type { PortfolioItem } from '@/data/portfolioData'

type Props = {
  number: string
  label: string
  subtitle: string
  items: PortfolioItem[]
  onOpen: (item: PortfolioItem) => void
}

export default function PortfolioCategory({ number, label, subtitle, items, onOpen }: Props) {
  return (
    <div className="mb-24">
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-xs font-semibold tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>{number}</span>
          <h3 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>{label}</h3>
        </div>
        <p className="text-sm tracking-wide" style={{ color: 'var(--color-muted)' }}>{subtitle}</p>
        <div className="mt-4 w-12 h-px" style={{ backgroundColor: 'var(--color-accent)' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, i) => (
          <div key={item.id} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
            <PortfolioCard src={item.src} title={item.title} alt={item.alt} category={label}
              onOpen={() => onOpen(item)} featured={i === 0} />
          </div>
        ))}
      </div>
    </div>
  )
}
