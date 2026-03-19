'use client'

import { ChevronDown } from 'lucide-react'

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="relative text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-6" style={{ color: 'var(--color-accent)' }}>
          Fashion Designer
        </p>
        <h1 className="text-8xl md:text-[10rem] font-light italic leading-none mb-6"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          Gaby
        </h1>
        <p className="text-lg md:text-xl leading-relaxed mb-10" style={{ color: 'var(--color-muted)' }}>
          Design & Direction — Bridging Creativity + Execution
        </p>
        <div className="flex justify-center gap-8 md:gap-14 mb-12">
          {[
            { value: '5 yrs', label: 'directing collections' },
            { value: '10+ yrs', label: 'in apparel' },
            { value: 'FIDM', label: 'Los Angeles' },
            { value: 'Miami', label: 'based' },
          ].map(({ value, label }) => (
            <div key={value} className="text-center">
              <div className="text-sm font-semibold tracking-[0.1em] uppercase" style={{ color: 'var(--color-text)' }}>{value}</div>
              <div className="text-xs tracking-wide mt-0.5" style={{ color: 'var(--color-muted)' }}>{label}</div>
            </div>
          ))}
        </div>
        <a href="#portfolio"
          className="inline-block px-10 py-3.5 text-xs font-semibold tracking-[0.25em] uppercase border transition-colors duration-300 cursor-pointer"
          style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = 'var(--color-accent)'; el.style.color = 'var(--color-bg)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.backgroundColor = 'transparent'; el.style.color = 'var(--color-accent)' }}>
          View Work
        </a>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" aria-hidden="true">
        <ChevronDown size={22} style={{ color: 'var(--color-muted)', opacity: 0.6 }} />
      </div>
    </section>
  )
}
