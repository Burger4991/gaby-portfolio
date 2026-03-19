import { motion, useInView, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.1, 1])
  return (
    <motion.span style={{ opacity }} className="inline-block mr-[0.25em]">
      {children}
    </motion.span>
  )
}

function WordReveal({ text, progress, className, style }) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <Word
          key={i}
          progress={progress}
          range={[i / words.length, Math.min((i + 1) / words.length, 1)]}
        >
          {word}
        </Word>
      ))}
    </span>
  )
}

const BIO_P1 =
  "I'm Gabriela (Gaby) Gamargo, a fashion designer with 5 years of experience guiding women's collections from concept through creation & 10+ years working in the apparel industry. Since high school, fashion design has been my way of blending creativity with structure."

export default function About() {
  const ref = useRef(null)
  const sectionRef = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.6', 'end 0.4'],
  })

  return (
    <section
      id="about"
      ref={sectionRef}
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
            className="text-4xl md:text-5xl font-light italic mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
          >
            Gabriela Gamargo
          </h2>
          <p
            className="leading-relaxed text-base md:text-lg mb-6"
            style={{ color: 'var(--color-muted)' }}
          >
            {prefersReduced ? (
              BIO_P1
            ) : (
              <WordReveal text={BIO_P1} progress={scrollYProgress} />
            )}
          </p>
          <p
            className="leading-relaxed text-base md:text-lg mb-6"
            style={{ color: 'var(--color-muted)' }}
          >
            At 18, I moved across the country to study in L.A. at FIDM, where I
            learned everything from illustration and pattern-making to draping and
            concept development — a leap of faith that became the foundation for my
            career in design and leadership.
          </p>
          <p
            className="leading-relaxed text-sm italic mb-8"
            style={{ color: 'var(--color-accent)', fontFamily: 'Cormorant Garamond, serif' }}
          >
            "Design lives in the balance of opposites — freedom and structure,
            originality and wearability, creativity and execution."
          </p>

          <div className="flex flex-wrap gap-2">
            {[
              'Creative Direction', 'Trend Forecasting', 'Technical Design',
              'Pattern Making', 'Adobe Illustrator', 'CLO 3D', 'PROMEAI',
              'Global Vendor Mgmt', 'Bilingual EN/ES',
            ].map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs tracking-[0.12em] uppercase"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Image column */}
        <motion.div
          className="aspect-[4/5] overflow-hidden"
          style={{ backgroundColor: 'var(--color-border)' }}
          initial={{ opacity: 0, x: prefersReduced ? 0 : 24 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: prefersReduced ? 0 : 0.7, ease: 'easeOut', delay: prefersReduced ? 0 : 0.15 }}
        >
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
