// src/components/Portfolio.jsx
import { useRef, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { categories } from '../data/portfolioData'
import PortfolioCategory from './PortfolioCategory'
import PortfolioCard from './PortfolioCard'
import Lightbox from './Lightbox'

// ─── Shared section heading ───────────────────────────────────────────────────
function SectionHeading() {
  return (
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
  )
}

// ─── Desktop panel header ─────────────────────────────────────────────────────
function PanelHeader({ number, label, subtitle }) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-4 mb-2">
        {number && (
          <span
            className="text-xs font-semibold tracking-[0.3em]"
            style={{ color: 'var(--color-accent)' }}
          >
            {number}
          </span>
        )}
        <h3
          className="text-3xl md:text-4xl font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
        >
          {label}
        </h3>
      </div>
      {subtitle && (
        <p className="text-sm tracking-wide" style={{ color: 'var(--color-muted)' }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 w-12 h-px" style={{ backgroundColor: 'var(--color-accent)' }} />
    </div>
  )
}

// ─── One full-viewport-width desktop panel ────────────────────────────────────
function HorizontalPanel({ number, label, subtitle, items, onOpen }) {
  return (
    <div
      className="flex-none flex flex-col pt-24 px-10 pb-8"
      style={{ width: '100vw', height: '100vh', overflowY: 'auto' }}
    >
      <PanelHeader number={number} label={label} subtitle={subtitle} />

      {/* Asymmetric grid — first card spans 2 of 3 cols */}
      <div className="grid grid-cols-3 gap-6 md:gap-8 flex-1 min-h-0">
        {items.map((item, i) => (
          <div key={item.id} className={i === 0 ? 'col-span-2' : ''}>
            <PortfolioCard
              src={item.src}
              title={item.title}
              alt={item.alt}
              category={label}
              onOpen={() => onOpen({ src: item.src, title: item.title, alt: item.alt })}
              featured={i === 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [lightbox, setLightbox] = useState(null)
  const prefersReduced = useReducedMotion()

  const outerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end end'],
  })

  const N = categories.length
  // Slide left: panel 0 stays at 0%, panel N-1 ends at -(N-1)/N * 100% of total row width
  const endX = `-${(((N - 1) / N) * 100).toFixed(4)}%`
  const x = useTransform(scrollYProgress, [0, 1], ['0%', endX])

  // ── Reduced-motion / universal mobile fallback ────────────────────────────
  if (prefersReduced) {
    return (
      <section id="portfolio" className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
        <SectionHeading />
        {categories.map((cat, i) => (
          <PortfolioCategory
            key={cat.id}
            number={String(i + 1).padStart(2, '0')}
            label={cat.label}
            subtitle={cat.subtitle}
            items={cat.items}
            onOpen={(item) => setLightbox(item)}
          />
        ))}
        <Lightbox
          src={lightbox?.src}
          title={lightbox?.title}
          alt={lightbox?.alt}
          onClose={() => setLightbox(null)}
        />
      </section>
    )
  }

  return (
    <>
      {/* ── Mobile: vertical stack (below md) ─────────────────────────────── */}
      <section id="portfolio" className="block md:hidden py-24 px-6 max-w-6xl mx-auto">
        <SectionHeading />
        {categories.map((cat, i) => (
          <PortfolioCategory
            key={cat.id}
            number={String(i + 1).padStart(2, '0')}
            label={cat.label}
            subtitle={cat.subtitle}
            items={cat.items}
            onOpen={(item) => setLightbox(item)}
          />
        ))}
      </section>

      {/* ── Desktop: pinned horizontal scroll (md and above) ──────────────── */}
      <section
        id="portfolio"
        ref={outerRef}
        className="hidden md:block relative"
        style={{ height: `calc(${N} * 100vh)` }}
      >
        {/* Sticky viewport */}
        <div className="sticky top-0 overflow-hidden" style={{ height: '100vh' }}>
          {/* Translating flex row */}
          <motion.div
            className="flex h-full"
            style={{ width: `${N * 100}vw`, x }}
          >
            {categories.map((cat, i) => (
              <HorizontalPanel
                key={cat.id}
                number={String(i + 1).padStart(2, '0')}
                label={cat.label}
                subtitle={cat.subtitle}
                items={cat.items}
                onOpen={(item) => setLightbox(item)}
              />
            ))}
          </motion.div>

          {/* Scroll progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px]"
            style={{
              width: '100%',
              scaleX: scrollYProgress,
              transformOrigin: 'left',
              backgroundColor: 'var(--color-accent)',
            }}
          />
        </div>
      </section>

      <Lightbox
        src={lightbox?.src}
        title={lightbox?.title}
        alt={lightbox?.alt}
        onClose={() => setLightbox(null)}
      />
    </>
  )
}
