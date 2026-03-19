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

    const initGSAP = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const triggers: ScrollTrigger[] = []

      words.forEach((_, i) => {
        const el = wordRefs.current[i]
        if (!el) return

        const trigger = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            const wordStart = i / words.length
            const wordEnd = (i + 1) / words.length
            const wordProgress = Math.max(0, Math.min(1, (progress - wordStart) / (wordEnd - wordStart)))
            el.style.opacity = String(0.1 + wordProgress * 0.9)
          },
        })

        triggers.push(trigger)
      })

      return () => triggers.forEach(t => t.kill())
    }

    let cleanup: (() => void) | undefined
    initGSAP().then(fn => { cleanup = fn })

    return () => cleanup?.()
  }, []) // words.length is stable (QUOTE is a const)

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <blockquote className="max-w-4xl mx-auto text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
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
