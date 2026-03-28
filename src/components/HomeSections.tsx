'use client'

import FullScreenScrollFX from './FullScreenScrollFX'
import PullQuote from './PullQuote'
import About from './About'
import Contact from './Contact'
import { categories } from '@/data/portfolioData'

/**
 * Homepage below the hero: FullScreenScrollFX for portfolio browsing,
 * then normal-flow sections (PullQuote, About, Contact).
 */
export default function HomeSections() {
  const sections = categories.map((cat, i) => ({
    id: cat.id,
    background: cat.previewImages[0],
    leftLabel: <span>{String(i + 1).padStart(2, '0')}</span>,
    title: cat.label,
    rightLabel: (
      <span style={{ fontSize: 'var(--text-label-xs)', letterSpacing: 'var(--tracking-normal)', color: 'var(--color-overlay-muted)' }}>
        {cat.sections.length} sections
      </span>
    ),
  }))

  return (
    <>
      <div id="portfolio">
        <FullScreenScrollFX
          sections={sections}
          footer={<span>Selected Work</span>}
          onIndexChange={(i) => {
            // Could add routing on click later
          }}
        />
      </div>

      <PullQuote />
      <About />
      <Contact />
    </>
  )
}
