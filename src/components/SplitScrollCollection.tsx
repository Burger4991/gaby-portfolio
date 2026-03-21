'use client'

import type { PortfolioCategory } from '@/data/portfolioData'
import CollectionScrollFX from './CollectionScrollFX'

export default function SplitScrollCollection({ category }: { category: PortfolioCategory }) {
  return (
    <CollectionScrollFX
      sections={category.sections.map((s, i) => ({
        id: s.id,
        background: s.images[0]?.src ?? '',
        title: s.title,
        description: s.description,
        outcome: s.outcome,
        pills: s.pills,
        images: s.images,
        counter: `${String(i + 1).padStart(2, '0')} / ${String(category.sections.length).padStart(2, '0')}`,
      }))}
      collectionLabel={category.label}
    />
  )
}
