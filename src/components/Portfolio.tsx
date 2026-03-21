'use client'

import { categories } from '@/data/portfolioData'
import FullScreenScrollFX from './FullScreenScrollFX'

export default function Portfolio() {
  const panels = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    subtitle: cat.subtitle,
    imageSrc: cat.previewImages[0],
    href: `/work/${cat.id}`,
    sectionCount: cat.sections.length,
  }))

  return <FullScreenScrollFX mode="home" panels={panels} />
}
