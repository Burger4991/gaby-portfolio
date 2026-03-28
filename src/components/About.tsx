'use client'

import Image from 'next/image'
import LiquidGlass from './LiquidGlass'

const BIO_INTRO = "I'm Gabriela (Gaby) Gamargo, a fashion designer with 5 years of experience guiding women's collections from concept through creation — and 10+ years working in the apparel industry. Since high school, when I first took styling seriously and began learning sewing, fashion design has been my way of blending creativity with structure."

const BIO_BODY = "At 18, I moved across the country on my own to study in L.A. at FIDM, where I learned everything from illustration and pattern-making to draping and concept development. At Pitusa, where I grew into the role of Head of Design, I learned to merge creative vision with practical execution — managing teams, collaborating with global vendors, and refining processes to ensure garments delivered on both style and quality."

const SKILLS = [
  'Creative Direction', 'Trend Forecasting', 'Technical Design', 'Fit & Grading', 'QC',
  'Product Development', 'Global Vendor Mgmt', 'Line Planning', 'Fabric Sourcing',
  'Team Leadership', 'Adobe Illustrator', 'Photoshop', 'CLO 3D', 'PROMEAI', 'ChatGPT',
  'Netsuite', 'Canva', 'Bilingual EN/ES',
]

export default function About() {
  return (
    <section id="about" className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div>
          <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>About</p>
          <h2 className="text-4xl md:text-5xl font-light italic mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
            Gabriela Gamargo
          </h2>
          <p className="leading-relaxed text-base md:text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
            {BIO_INTRO}
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
        <div className="aspect-[4/5] overflow-hidden relative">
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
