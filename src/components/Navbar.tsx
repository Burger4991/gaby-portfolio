// src/components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import { categories } from '@/data/portfolioData'

const links = [
  { label: 'Work', href: '/#portfolio' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const collectionLinks = categories.map((c) => ({
    label: c.label,
    href: `/work/${c.id}`,
  }))

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 backdrop-blur-sm border-b"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--color-bg) 90%, transparent)',
          borderColor: open ? 'transparent' : 'var(--color-border)',
        }}
      >
        <a
          href="/"
          data-cursor="link"
          onClick={() => setOpen(false)}
          className="text-xl font-semibold tracking-[0.2em] transition-opacity duration-200 hover:opacity-70 cursor-pointer"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: open ? 'white' : 'var(--color-text)', position: 'relative', zIndex: 60 }}
          aria-label="Gabriela Gamargo — home"
        >
          G. GAMARGO
        </a>

        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 60 }}>
          <div className={open ? 'hidden' : 'block'}>
            <ThemeToggle />
          </div>
          <button
            type="button"
            onClick={() => setOpen(o => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="flex flex-col justify-center gap-[5px] w-8 h-8 cursor-pointer"
          >
            <motion.span className="block h-px w-5 origin-center"
              style={{ backgroundColor: open ? 'white' : 'var(--color-text)' }}
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }} />
            <motion.span className="block h-px w-5"
              style={{ backgroundColor: open ? 'white' : 'var(--color-text)' }}
              animate={open ? { opacity: 0 } : { opacity: 1 }}
              transition={{ duration: 0.2 }} />
            <motion.span className="block h-px w-5 origin-center"
              style={{ backgroundColor: open ? 'white' : 'var(--color-text)' }}
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              transition={{ duration: 0.2 }} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            data-theme="dark"
            style={{ backgroundColor: 'rgba(17,17,27,0.97)' }}
            initial={{ opacity: 0, y: '-100%' }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col items-center gap-2 mb-16">
              <motion.a
                key="Work" href="/#portfolio" data-cursor="link" onClick={() => setOpen(false)}
                className="block cursor-pointer"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1 }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)' }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
              >
                Work
              </motion.a>

              <motion.div
                style={{
                  display: 'flex',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  marginTop: '-0.75rem',
                  marginBottom: '0.5rem',
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {collectionLinks.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    data-cursor="link"
                    onClick={() => setOpen(false)}
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '0.6rem',
                      letterSpacing: '0.28em',
                      textTransform: 'uppercase' as const,
                      color: 'var(--color-accent)',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(184,150,90,0.35)',
                      paddingBottom: '1px',
                    }}
                  >
                    {label}
                  </Link>
                ))}
              </motion.div>

              {links.filter(l => l.label !== 'Work').map(({ label, href }, i) => (
                <motion.a
                  key={label} href={href} data-cursor="link" onClick={() => setOpen(false)}
                  className="block cursor-pointer"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)' }}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.28 + i * 0.08, ease: 'easeOut' }}
                >
                  {label}
                </motion.a>
              ))}
            </nav>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.5 }}>
              <ThemeToggle />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
