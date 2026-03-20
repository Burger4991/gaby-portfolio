'use client'

import { useEffect, useRef } from 'react'
import { splitWords } from '@/lib/splitWords'

const BIO_INTRO = "I'm Gabriela (Gaby) Gamargo — Head of Design at Pitusa with 5+ years leading women's RTW collections from concept to delivery, and 10+ years total in the apparel industry. I bridge creativity and commerce: trend-led design that moves at scale."

const BIO_BODY = "A FIDM graduate who left Colombia at 18 to study in Los Angeles, I've built my career across global vendor management, technical design, and creative direction. My work has been featured in Vogue Mexico and has contributed to 300K+ units sold across international markets."

const SKILLS = [
  'Creative Direction', 'Trend Forecasting', 'Technical Design', 'Pattern Making',
  'Adobe Illustrator', 'CLO 3D', 'PROMEAI', 'Global Vendor Mgmt', 'Bilingual EN/ES',
]

const bioWords = splitWords(BIO_INTRO)

export default function About() {
  const textColRef = useRef<HTMLDivElement>(null)
  const imageColRef = useRef<HTMLDivElement>(null)
  const wordSpanRefs = useRef<(HTMLSpanElement | null)[]>([])

  // Animation 1: Text column slide-in from left
  useEffect(() => {
    let cancelled = false
    let anim: gsap.core.Tween | null = null

    async function animate() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const el = textColRef.current
      if (!el) return

      anim = gsap.fromTo(
        el,
        { opacity: 0, x: -24 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none',
          },
        }
      )
    }

    animate()
    return () => {
      cancelled = true
      anim?.kill()
    }
  }, [])

  // Animation 2: Image column fade + scale
  useEffect(() => {
    let cancelled = false
    let anim: gsap.core.Tween | null = null

    async function animate() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const el = imageColRef.current
      if (!el) return

      anim = gsap.fromTo(
        el,
        { opacity: 0, scale: 1.05 },
        {
          opacity: 1,
          scale: 1.0,
          duration: 0.9,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            end: 'top 50%',
            scrub: false,
            toggleActions: 'play none none none',
          },
        }
      )
    }

    animate()
    return () => {
      cancelled = true
      anim?.kill()
    }
  }, [])

  // Animation 3: Bio intro word-by-word scrub reveal
  useEffect(() => {
    let cancelled = false
    const anims: gsap.core.Tween[] = []

    async function animate() {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (cancelled) return

      gsap.registerPlugin(ScrollTrigger)

      const spans = wordSpanRefs.current.filter(Boolean)
      if (!spans.length) return

      const totalWords = spans.length

      spans.forEach((span, i) => {
        if (!span) return
        const progress = i / totalWords

        const anim = gsap.fromTo(
          span,
          { opacity: 0.1 },
          {
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: textColRef.current,
              start: 'top 70%',
              end: 'bottom 80%',
              scrub: true,
              onUpdate(self) {
                const segStart = progress
                const segEnd = (i + 1) / totalWords
                const segProgress = Math.max(0, Math.min(1, (self.progress - segStart) / (segEnd - segStart)))
                if (span) {
                  span.style.opacity = String(0.1 + segProgress * 0.9)
                }
              },
            },
          }
        )
        anims.push(anim)
      })
    }

    animate()
    return () => {
      cancelled = true
      anims.forEach(a => a.kill())
    }
  }, [])

  return (
    <section id="about" className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div ref={textColRef} style={{ opacity: 0 }}>
          <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>About</p>
          <h2 className="text-4xl md:text-5xl font-light italic mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
            Gabriela Gamargo
          </h2>
          <p className="leading-relaxed text-base md:text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
            {bioWords.map((word, i) => (
              <span
                key={i}
                ref={el => { wordSpanRefs.current[i] = el }}
                style={{ opacity: 0.1 }}
              >
                {word}{i < bioWords.length - 1 ? ' ' : ''}
              </span>
            ))}
          </p>
          <p className="leading-relaxed text-base md:text-lg mb-8" style={{ color: 'var(--color-muted)' }}>{BIO_BODY}</p>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map(skill => (
              <span key={skill} className="px-3 py-1 text-xs tracking-[0.12em] uppercase"
                style={{ border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div ref={imageColRef} className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: 'var(--color-border)', opacity: 0 }}>
          {/* Placeholder — real image added when Gaby provides one */}
        </div>
      </div>
    </section>
  )
}
