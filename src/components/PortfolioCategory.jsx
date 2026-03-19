import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'
import PortfolioCard from './PortfolioCard'

export default function PortfolioCategory({ number, label, subtitle, items, onOpen }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <div ref={ref} className="mb-20">
      {/* Section header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: prefersReduced ? 0 : 0.6, ease: 'easeOut' }}
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

      {/* Responsive grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: prefersReduced ? 0 : 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{
              duration: prefersReduced ? 0 : 0.5,
              ease: 'easeOut',
              delay: prefersReduced ? 0 : i * 0.1,
            }}
          >
            <PortfolioCard
              src={item.src}
              title={item.title}
              alt={item.alt}
              category={label}
              onOpen={() => onOpen({ src: item.src, title: item.title, alt: item.alt })}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
