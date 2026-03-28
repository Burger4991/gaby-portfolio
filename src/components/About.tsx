'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { splitWords } from '@/lib/splitWords'
import LiquidGlass from './LiquidGlass'

const BIO_INTRO = "I'm Gabriela (Gaby) Gamargo, a fashion designer with 5 years of experience guiding women's collections from concept through creation — and 10+ years working in the apparel industry. Since high school, when I first took styling seriously and began learning sewing, fashion design has been my way of blending creativity with structure."

const BIO_BODY = "At 18, I moved across the country on my own to study in L.A. at FIDM, where I learned everything from illustration and pattern-making to draping and concept development. At Pitusa, where I grew into the role of Head of Design, I learned to merge creative vision with practical execution — managing teams, collaborating with global vendors, and refining processes to ensure garments delivered on both style and quality."

const SKILLS = [
  'Creative Direction', 'Trend Forecasting', 'Technical Design', 'Fit & Grading', 'QC',
  'Product Development', 'Global Vendor Mgmt', 'Line Planning', 'Fabric Sourcing',
  'Team Leadership', 'Adobe Illustrator', 'Photoshop', 'CLO 3D', 'PROMEAI', 'ChatGPT',
  'Netsuite', 'Canva', 'Bilingual EN/ES',
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
              <LiquidGlass key={skill} style={{ color: 'var(--color-muted)', padding: '0.25rem 0.65rem', fontSize: '0.7rem' }}>
                {skill}
              </LiquidGlass>
            ))}
          </div>
        </div>
        <div ref={imageColRef} className="aspect-[4/5] overflow-hidden relative" style={{ opacity: 0 }}>
          <Image
            src="/assets/about/e84a9c6fe50fb3b0cc4b4bd758826a65.jpg"
            alt="Gabriela Gamargo"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      </div>
    </section>
  )
}
