import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const prefersReduced = useReducedMotion()

  const { scrollY } = useScroll()

  // Parallax transforms — name lingers, label/tagline/stats/CTA move faster
  const nameY = useTransform(scrollY, [0, 500], [0, -80])
  const contentY = useTransform(scrollY, [0, 500], [0, -140])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 24 },
    visible: (delay = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReduced ? 0 : 0.8,
        ease: 'easeOut',
        delay: prefersReduced ? 0 : delay,
      },
    }),
  }

  // Set heroImg to a root-relative path like '/images/hero.jpg' when available.
  // null = cream/bg fallback (the default shipped state).
  const heroImg = null

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      style={{
        backgroundColor: 'var(--color-bg)',
        ...(heroImg && {
          backgroundImage: `url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }),
      }}
    >
      {/* Dark overlay — only when hero image is present */}
      {heroImg && (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'var(--color-overlay)', opacity: 0.5 }}
          aria-hidden="true"
        />
      )}

      <div className="relative text-center max-w-2xl mx-auto">
        {/* Label — faster parallax layer */}
        <motion.p
          className="text-xs font-semibold tracking-[0.4em] uppercase mb-6"
          style={{
            color: 'var(--color-accent)',
            y: prefersReduced ? 0 : contentY,
            opacity: prefersReduced ? 1 : opacity,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
        >
          Fashion Designer
        </motion.p>

        {/* Name — slow/lingering parallax layer */}
        <motion.h1
          className="text-8xl md:text-[10rem] font-light italic leading-none mb-6"
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            color: heroImg ? 'white' : 'var(--color-text)',
            y: prefersReduced ? 0 : nameY,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
        >
          Gaby
        </motion.h1>

        {/* Tagline — faster parallax layer */}
        <motion.p
          className="text-lg md:text-xl leading-relaxed mb-10"
          style={{
            color: heroImg ? 'rgba(255,255,255,0.8)' : 'var(--color-muted)',
            y: prefersReduced ? 0 : contentY,
            opacity: prefersReduced ? 1 : opacity,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
        >
          Design & Direction — Bridging Creativity + Execution
        </motion.p>

        {/* Stats — faster parallax layer */}
        <motion.div
          className="flex justify-center gap-8 md:gap-14 mb-12"
          style={{
            y: prefersReduced ? 0 : contentY,
            opacity: prefersReduced ? 1 : opacity,
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.35}
        >
          {[
            { value: '5 yrs', label: 'directing collections' },
            { value: '10+ yrs', label: 'in apparel' },
            { value: 'FIDM', label: 'Los Angeles' },
            { value: 'Miami', label: 'based' },
          ].map(({ value, label }) => (
            <div key={value} className="text-center">
              <div
                className="text-sm font-semibold tracking-[0.1em] uppercase"
                style={{ color: 'var(--color-text)' }}
              >
                {value}
              </div>
              <div
                className="text-xs tracking-wide mt-0.5"
                style={{ color: 'var(--color-muted)' }}
              >
                {label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA — faster parallax layer */}
        <motion.a
          href="#portfolio"
          className="inline-block px-10 py-3.5 text-xs font-semibold tracking-[0.25em] uppercase border transition-colors duration-300 cursor-pointer"
          style={{
            borderColor: 'var(--color-accent)',
            color: 'var(--color-accent)',
            y: prefersReduced ? 0 : contentY,
            opacity: prefersReduced ? 1 : opacity,
          }}
          onMouseEnter={e => {
            e.currentTarget.style.backgroundColor = 'var(--color-accent)'
            e.currentTarget.style.color = 'var(--color-bg)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--color-accent)'
          }}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.55}
        >
          View Work
        </motion.a>
      </div>

      {/* Scroll indicator */}
      {!prefersReduced && (
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ChevronDown size={22} style={{ color: 'var(--color-muted)', opacity: 0.6 }} />
        </motion.div>
      )}
    </section>
  )
}
