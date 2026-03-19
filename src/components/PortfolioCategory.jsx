import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import PortfolioCard from './PortfolioCard'

export default function PortfolioCategory({ number, label, subtitle, items, onOpen }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <div ref={ref} className="mb-24">
      {/* Section header — horizontal wipe reveal */}
      <motion.div
        className="mb-8 overflow-hidden"
        initial={{ clipPath: prefersReduced ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)' }}
        animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
        transition={{ duration: prefersReduced ? 0 : 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
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
      </motion.div>

      {/* Asymmetric grid — first card spans 2 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}
            initial={{ clipPath: prefersReduced ? 'inset(0% 0 0 0)' : 'inset(100% 0 0 0)' }}
            animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
            transition={{
              duration: prefersReduced ? 0 : 0.7,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: prefersReduced ? 0 : i * 0.12,
            }}
          >
            <PortfolioCard
              src={item.src}
              title={item.title}
              alt={item.alt}
              category={label}
              onOpen={() => onOpen({ src: item.src, title: item.title, alt: item.alt })}
              featured={i === 0}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
