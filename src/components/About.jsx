import { motion, useInView, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  return (
    <section
      id="about"
      className="py-24 px-6 md:px-10"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div
        ref={ref}
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center"
      >
        {/* Text column */}
        <motion.div
          initial={{ opacity: 0, x: prefersReduced ? 0 : -24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut' }}
        >
          <p
            className="text-xs font-semibold tracking-[0.4em] uppercase mb-4"
            style={{ color: 'var(--color-accent)' }}
          >
            About
          </p>
          <h2
            className="text-4xl md:text-5xl font-light mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
          >
            Gaby
          </h2>
          <p
            className="leading-relaxed text-base md:text-lg mb-6"
            style={{ color: 'var(--color-muted)' }}
          >
            {/* Replace with real bio */}
            Gaby is a fashion designer with experience in resort and beach wear,
            bringing a warm, intentional aesthetic to every collection. Her work
            spans hand-drawn concept sketches to finished garments, always rooted
            in wearability and craft.
          </p>
          <p
            className="leading-relaxed text-base md:text-lg"
            style={{ color: 'var(--color-muted)' }}
          >
            {/* Replace with real philosophy */}
            She believes fashion should feel as good as it looks — and that the
            best designs start with a pencil and a blank page.
          </p>
        </motion.div>

        {/* Image column */}
        <motion.div
          className="aspect-[4/5] overflow-hidden"
          style={{ backgroundColor: 'var(--color-border)' }}
          initial={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut', delay: prefersReduced ? 0 : 0.15 }}
        >
          {/* Replace src with a real process shot or portrait */}
          <img
            src="/images/about-placeholder.jpg"
            alt="Gaby at work — process shot"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </motion.div>
      </div>
    </section>
  )
}
