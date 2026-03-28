'use client'

const QUOTE = '"Design lives in the balance of opposites — freedom and structure, originality and wearability, creativity and execution."'

export default function PullQuote() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-10" style={{ overflow: 'hidden', width: '100%' }}>
      <blockquote className="max-w-4xl mx-auto text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-overlay-heading)', overflowWrap: 'break-word', wordBreak: 'break-word' }}>
          {QUOTE}
        </p>
        <footer className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: 'var(--color-accent)' }}>
          — Gabriela Gamargo
        </footer>
      </blockquote>
    </section>
  )
}
