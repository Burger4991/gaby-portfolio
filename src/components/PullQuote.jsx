// src/components/PullQuote.jsx
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function PullQuote() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      className="py-20 md:py-32 px-6 md:px-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <motion.blockquote
        ref={ref}
        className="max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: prefersReduced ? 0 : 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: prefersReduced ? 0 : 0.8, ease: 'easeOut' }}
      >
        <p
          className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
        >
          "Design lives in the balance of opposites — freedom and structure,
          originality and wearability, creativity and execution."
        </p>
        <footer
          className="text-xs font-semibold tracking-[0.3em] uppercase"
          style={{ color: 'var(--color-accent)' }}
        >
          — Gabriela Gamargo
        </footer>
      </motion.blockquote>
    </section>
  )
}
