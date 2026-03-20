'use client'
import { useEffect, useRef } from 'react'
import { splitWords } from '@/lib/splitWords'

const QUOTE = '"Design lives in the balance of opposites — freedom and structure, originality and wearability, creativity and execution."'

export default function PullQuote() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([])
  const words = splitWords(QUOTE)

  useEffect(() => {
    if (!sectionRef.current) return
    let cancelled = false
    let trigger: import('gsap/ScrollTrigger').ScrollTrigger | undefined

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        scrub: true,
        onUpdate(self) {
          const progress = self.progress
          wordRefs.current.forEach((span, i) => {
            if (!span) return
            const wordStart = i / words.length
            const wordEnd = (i + 1) / words.length
            const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)))
            span.style.opacity = String(0.1 + wordProgress * 0.9)
          })
        },
      })
    }

    init()
    return () => {
      cancelled = true
      trigger?.kill()
    }
  }, []) // words.length stable — QUOTE is a module-level const

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)', overflow: 'hidden' }}>
      <blockquote className="max-w-4xl mx-auto text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
          {words.map((word, i) => (
            <span
              key={i}
              ref={el => { wordRefs.current[i] = el }}
              style={{ opacity: 0.1, display: 'inline' }}
            >
              {word}&nbsp;
            </span>
          ))}
        </p>
        <footer className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: 'var(--color-accent)' }}>
          — Gabriela Gamargo
        </footer>
      </blockquote>
    </section>
  )
}
