// src/components/Portfolio.jsx
import { categories } from '../data/portfolioData'
import PortfolioCategory from './PortfolioCategory'

export default function Portfolio() {
  return (
    <section id="portfolio" className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="mb-16 text-center">
        <p
          className="text-xs font-semibold tracking-[0.4em] uppercase mb-4"
          style={{ color: 'var(--color-accent)' }}
        >
          Selected Work
        </p>
        <h2
          className="text-4xl md:text-5xl font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
        >
          Collections
        </h2>
      </div>

      {/* Render all categories */}
      {categories.map((cat) => (
        <PortfolioCategory
          key={cat.id}
          label={cat.label}
          subtitle={cat.subtitle}
          items={cat.items}
        />
      ))}
    </section>
  )
}
