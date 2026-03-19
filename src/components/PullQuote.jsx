// src/components/PullQuote.jsx
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import { useRef } from 'react'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.1, 1])
  return (
    <motion.span style={{ opacity }}>
      {children}{' '}
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

const QUOTE_TEXT =
  '"Design lives in the balance of opposites — freedom and structure, originality and wearability, creativity and execution."'

export default function PullQuote() {
  const sectionRef = useRef(null)
  const prefersReduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.8', 'end 0.2'],
  })

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 px-6 md:px-10"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <blockquote className="max-w-4xl mx-auto text-center">
        <p
          className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
        >
          {prefersReduced ? (
            QUOTE_TEXT
          ) : (
            <WordReveal text={QUOTE_TEXT} progress={scrollYProgress} />
          )}
        </p>
        <footer
          className="text-xs font-semibold tracking-[0.3em] uppercase"
          style={{ color: 'var(--color-accent)' }}
        >
          — Gabriela Gamargo
        </footer>
      </blockquote>
    </section>
  )
}
