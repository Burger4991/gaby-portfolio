# Portfolio Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate the Gaby Gamargo portfolio from Vite + React + Framer Motion to Next.js 15 + GSAP, with the new Dark Luxury / Warm Ivory color system, a preloader, a Server Action contact form via Resend, and Vercel Analytics — all working with hardcoded content.

**Architecture:** Next.js 15 App Router with SSG. All scroll animations replaced by GSAP ScrollTrigger. Framer Motion kept only for UI state (nav overlay, lightbox). Color system: two CSS custom property themes on `html[data-theme]`. Content stays hardcoded for this plan; Sanity CMS is Plan 2.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS v4, GSAP 3 + ScrollTrigger, Framer Motion (UI only), Resend, @vercel/analytics, Lucide React

**Spec:** `docs/superpowers/specs/2026-03-19-gaby-portfolio-redesign.md`

---

## File Map

```
src/
  app/
    layout.tsx                 — root layout: ThemeProvider, GSAPProvider, Analytics, fonts
    page.tsx                   — main page: all sections composed
    globals.css                — color tokens, film grain, marquee, cursor, font face
    actions/
      sendEmail.ts             — 'use server' Server Action via Resend
    work/
      [slug]/
        page.tsx               — case study placeholder (dynamicParams = false)
  components/
    GSAPProvider.tsx           — GSAP + ScrollTrigger dynamic import + init + iOS fix
    ThemeProvider.tsx          — dark/light context, localStorage persistence
    ThemeToggle.tsx            — moon/sun toggle button
    Preloader.tsx              — full-screen GSAP intro animation
    Navbar.tsx                 — fixed nav + FM overlay (ported, minor adjustments)
    Hero.tsx                   — GSAP entrance timeline + scroll parallax
    Marquee.tsx                — CSS only (direct port)
    Portfolio.tsx              — GSAP ScrollTrigger horizontal pin
    PortfolioCard.tsx          — 3D tilt (direct port, adjust import)
    PortfolioCategory.tsx      — mobile fallback (direct port)
    PullQuote.tsx              — GSAP word-by-word scroll reveal
    About.tsx                  — GSAP slide-in + word reveal on bio intro
    Contact.tsx                — Server Action form with inline state
    Lightbox.tsx               — FM AnimatePresence (direct port)
    BackToTop.tsx              — FM AnimatePresence (direct port)
    CustomCursor.tsx           — CSS + JS (direct port)
  lib/
    splitWords.ts              — splits string → string[] for GSAP word animation
  data/
    portfolioData.ts           — hardcoded categories + items (same as current, TS)
next.config.ts                 — image remotePatterns (picsum + sanity placeholder)
```

---

## Task 1 — Scaffold Next.js, remove Vite

**Files:**
- Delete: `vite.config.ts`, `index.html`, `src/main.jsx`
- Create: `next.config.ts`
- Modify: `package.json` (via scaffold)

- [ ] **Step 1: Uninstall Lenis (already removed from code but still in package.json)**

```bash
cd /Users/alexanderburger/Desktop/gaby-portfolio
npm uninstall lenis
```

- [ ] **Step 2: Scaffold Next.js into existing directory**

```bash
npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git --eslint --no-turbopack --import-alias "@/*"
```

When prompted about overwriting existing files, allow overwriting `package.json`, `.gitignore`, `tsconfig.json`. Do NOT overwrite the `src/` directory contents — answer no when asked about existing source files.

- [ ] **Step 3: Remove Vite artifacts**

```bash
rm -f vite.config.ts index.html src/main.jsx
```

- [ ] **Step 4: Set up `next.config.ts`**

Replace the generated `next.config.ts` with:

```ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default nextConfig
```

- [ ] **Step 5: Install required packages**

```bash
npm install gsap framer-motion lucide-react @vercel/analytics resend
npm install -D @types/node
```

- [ ] **Step 6: Verify Next.js dev server starts**

```bash
npm run dev
```

Expected: dev server at `http://localhost:3000` with the default Next.js page. No errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 15, remove Vite"
```

---

## Task 2 — Color System + ThemeProvider

**Files:**
- Create: `src/components/ThemeProvider.tsx`
- Create: `src/components/ThemeToggle.tsx`
- Modify: `src/app/globals.css`

- [ ] **Step 1: Write `globals.css` with new color tokens**

Replace `src/app/globals.css` entirely:

```css
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Manrope:wght@300;400;500;600;700&display=swap');

@import "tailwindcss";

/* ─── Dark Luxury (default) ─── */
html[data-theme="dark"],
html:not([data-theme]) {
  --color-bg:           #0C0C0E;
  --color-surface:      #111116;
  --color-border:       #1F1F25;
  --color-text:         #EDE8DF;
  --color-muted:        #5C5349;
  --color-accent:       #B8965A;
  --color-accent-hover: #CCA96A;
  --color-card-bg:      #18181E;
  --color-overlay:      #0C0C0E;
}

/* ─── Warm Ivory (light) ─── */
html[data-theme="light"] {
  --color-bg:           #F8F4EE;
  --color-surface:      #F2EBE1;
  --color-border:       #E5DDD3;
  --color-text:         #1C1610;
  --color-muted:        #9A8E84;
  --color-accent:       #A0673A;
  --color-accent-hover: #B5784A;
  --color-card-bg:      #EDE7DF;
  --color-overlay:      #F8F4EE;
}

/* ─── Base ─── */
*, *::before, *::after { box-sizing: border-box; }

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Manrope', sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
  -webkit-font-smoothing: antialiased;
}

/* ─── Film grain ─── */
body::after {
  content: '';
  position: fixed;
  inset: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 9990;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  animation: grain 0.5s steps(1) infinite;
}
@keyframes grain {
  0%  { transform: translate(0, 0); }
  10% { transform: translate(-2%, -3%); }
  20% { transform: translate(3%, 2%); }
  30% { transform: translate(-1%, 4%); }
  40% { transform: translate(4%, -1%); }
  50% { transform: translate(-3%, 3%); }
  60% { transform: translate(2%, -4%); }
  70% { transform: translate(-4%, 1%); }
  80% { transform: translate(1%, -2%); }
  90% { transform: translate(3%, 4%); }
}

/* ─── Marquee ─── */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 30s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}

/* ─── Custom cursor (pointer devices only) ─── */
@media (hover: hover) {
  * { cursor: none !important; }
  .cursor-dot {
    position: fixed;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--color-accent);
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
  }
  .cursor-ring {
    position: fixed;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: 1px solid var(--color-accent);
    pointer-events: none;
    z-index: 9998;
    transform: translate(-50%, -50%);
    transition: width 0.2s, height 0.2s, opacity 0.2s;
    opacity: 0.5;
  }
  .cursor-ring.hovering {
    width: 52px;
    height: 52px;
    opacity: 0.3;
  }
}
```

- [ ] **Step 2: Write `ThemeProvider.tsx`**

```tsx
// src/components/ThemeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    const initial = stored ?? 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = () => {
    setTheme(prev => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', next)
      document.documentElement.setAttribute('data-theme', next)
      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
```

- [ ] **Step 3: Write `ThemeToggle.tsx`**

```tsx
// src/components/ThemeToggle.tsx
'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-8 h-8 flex items-center justify-center transition-opacity duration-200 hover:opacity-70 cursor-pointer"
      style={{ color: 'var(--color-muted)' }}
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
```

- [ ] **Step 4: Write root `layout.tsx`**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gabriela Gamargo — Fashion Designer',
  description: 'Fashion designer specializing in resort, bridal, and womenswear. Based in Miami.',
  openGraph: {
    title: 'Gabriela Gamargo — Fashion Designer',
    description: 'Fashion designer specializing in resort, bridal, and womenswear. Based in Miami.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Build check**

```bash
npm run build
```

Expected: clean build, no TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/components/ThemeProvider.tsx src/components/ThemeToggle.tsx next.config.ts
git commit -m "feat: color system, ThemeProvider, root layout"
```

---

## Task 3 — Port Static Components

**Files:**
- Create: `src/data/portfolioData.ts`
- Create: `src/components/Marquee.tsx`
- Create: `src/components/Lightbox.tsx`
- Create: `src/components/BackToTop.tsx`
- Create: `src/components/CustomCursor.tsx`

These are direct ports of existing components with minimal changes (add `'use client'`, convert JSX → TSX, fix import paths).

- [ ] **Step 1: Create `portfolioData.ts`**

```ts
// src/data/portfolioData.ts
export type PortfolioItem = {
  id: string
  src: string
  title: string
  alt: string
  slug?: string
}

export type PortfolioCategory = {
  id: string
  label: string
  subtitle: string
  items: PortfolioItem[]
}

export const categories: PortfolioCategory[] = [
  {
    id: 'resort',
    label: 'Resort & Activewear',
    subtitle: "RTW women's resort and activewear collections",
    items: [
      { id: 'r1', src: 'https://picsum.photos/seed/resort1/800/1000', title: 'Linen Co-ord Set', alt: 'Linen co-ordinate set — resort collection' },
      { id: 'r2', src: 'https://picsum.photos/seed/resort2/800/1000', title: 'Halter Maxi Dress', alt: 'Halter maxi dress styled for resort' },
      { id: 'r3', src: 'https://picsum.photos/seed/resort3/800/1000', title: 'Wrap Coverup', alt: 'Sheer wrap coverup over swimwear' },
    ],
  },
  {
    id: 'cutsew',
    label: 'Cut & Sew Knits',
    subtitle: 'RTW — cut & sew knits, crochet, and soft wovens',
    items: [
      { id: 'cs1', src: 'https://picsum.photos/seed/knit1/800/1000', title: 'Crochet Top', alt: 'Hand-crocheted top — knit collection' },
      { id: 'cs2', src: 'https://picsum.photos/seed/knit2/800/1000', title: 'Soft Woven Set', alt: 'Soft woven co-ordinate set' },
    ],
  },
  {
    id: 'bridal',
    label: 'Bridal & Eveningwear',
    subtitle: 'Custom bespoke bridal and evening collections',
    items: [
      { id: 'b1', src: 'https://picsum.photos/seed/bridal1/800/1000', title: 'Evening Gown', alt: 'Custom evening gown — bridal collection' },
      { id: 'b2', src: 'https://picsum.photos/seed/bridal2/800/1000', title: 'Bespoke Bridal', alt: 'Custom bespoke bridal look' },
    ],
  },
  {
    id: 'illustrations',
    label: 'Hand Illustrations',
    subtitle: 'Fashion illustrations — Procreate, markers, and colored pencils',
    items: [
      { id: 'i1', src: 'https://picsum.photos/seed/sketch1/800/1000', title: 'Evening Gown Study', alt: 'Hand-drawn fashion illustration — evening gown' },
      { id: 'i2', src: 'https://picsum.photos/seed/sketch2/800/1000', title: 'Resort Silhouettes', alt: 'Fashion illustration — resort silhouettes' },
      { id: 'i3', src: 'https://picsum.photos/seed/sketch3/800/1000', title: 'Technical Flat', alt: 'Technical design flat — spec sheet illustration' },
    ],
  },
]
```

- [ ] **Step 2: Port `Marquee.tsx`**

```tsx
// src/components/Marquee.tsx
export default function Marquee() {
  const items = [
    'Resort & Activewear', 'Bridal & Eveningwear', 'Hand Illustrations',
    'Cut & Sew Knits', 'Design & Direction', 'Creative Direction', "Women's RTW",
  ]
  const doubled = [...items, ...items]
  return (
    <div
      className="w-full overflow-hidden py-5 border-y"
      style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      aria-hidden="true"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-6 text-xs font-semibold tracking-[0.3em] uppercase px-8"
            style={{ color: 'var(--color-muted)' }}
          >
            {item}
            <span style={{ color: 'var(--color-accent)' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Port `Lightbox.tsx`**

```tsx
// src/components/Lightbox.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect } from 'react'

type Props = { src?: string; title?: string; alt?: string; onClose: () => void }

export default function Lightbox({ src, title, alt, onClose }: Props) {
  useEffect(() => {
    if (!src) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [src, onClose])

  useEffect(() => {
    document.body.style.overflow = src ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [src])

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-12"
          style={{ backgroundColor: 'rgba(0,0,0,0.92)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }} onClick={onClose}
        >
          <motion.figure
            className="relative max-w-3xl w-full"
            initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.93, opacity: 0 }} transition={{ duration: 0.2 }}
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="w-full max-h-[80vh] object-contain" />
            {title && (
              <figcaption className="mt-4 text-center text-sm tracking-[0.2em] uppercase"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(255,255,255,0.6)' }}>
                {title}
              </figcaption>
            )}
          </motion.figure>
          <button onClick={onClose} aria-label="Close lightbox"
            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center cursor-pointer transition-opacity duration-200 hover:opacity-70"
            style={{ color: 'rgba(255,255,255,0.8)' }}>
            <X size={22} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 4: Port `BackToTop.tsx`**

```tsx
// src/components/BackToTop.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-40 w-10 h-10 flex items-center justify-center cursor-pointer"
          style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 5: Port `CustomCursor.tsx`**

```tsx
// src/components/CustomCursor.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let rafId: number
    const onMove = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + 'px'
        dotRef.current.style.top = e.clientY + 'px'
      }
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t
      const animate = () => {
        ringPos.current.x = lerp(ringPos.current.x, e.clientX, 0.12)
        ringPos.current.y = lerp(ringPos.current.y, e.clientY, 0.12)
        if (ringRef.current) {
          ringRef.current.style.left = ringPos.current.x + 'px'
          ringRef.current.style.top = ringPos.current.y + 'px'
        }
        rafId = requestAnimationFrame(animate)
      }
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(animate)
    }
    const onEnter = () => ringRef.current?.classList.add('hovering')
    const onLeave = () => ringRef.current?.classList.remove('hovering')
    window.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
```

- [ ] **Step 6: Build check**

```bash
npm run build
```

Expected: clean build.

- [ ] **Step 7: Commit**

```bash
git add src/
git commit -m "feat: port static components (Marquee, Lightbox, BackToTop, CustomCursor)"
```

---

## Task 4 — Port Navbar

**Files:**
- Create: `src/components/Navbar.tsx`

Navbar is a direct port with `ThemeToggle` replacing `ThemeSelector`, and TypeScript types added.

- [ ] **Step 1: Write `Navbar.tsx`**

```tsx
// src/components/Navbar.tsx
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const links = [
  { label: 'Work', href: '#portfolio' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

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
          href="#hero"
          onClick={() => setOpen(false)}
          className="text-xl font-semibold tracking-[0.2em] transition-opacity duration-200 hover:opacity-70 cursor-pointer"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: open ? 'white' : 'var(--color-text)', position: 'relative', zIndex: 60 }}
          aria-label="Gabriela Gamargo — back to top"
        >
          G. GAMARGO
        </a>

        <div className="flex items-center gap-4" style={{ position: 'relative', zIndex: 60 }}>
          <div className={open ? 'hidden' : 'block'}>
            <ThemeToggle />
          </div>
          <button
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
            style={{ backgroundColor: 'rgba(17,17,27,0.97)' }}
            initial={{ opacity: 0, y: '-100%' }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav className="flex flex-col items-center gap-2 mb-16">
              {links.map(({ label, href }, i) => (
                <motion.a
                  key={label} href={href} onClick={() => setOpen(false)}
                  className="block cursor-pointer"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)' }}
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08, ease: 'easeOut' }}
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
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: port Navbar with ThemeToggle"
```

---

## Task 5 — Port Hero, PullQuote, About, Contact (static, no GSAP yet)

These components are ported first with static/no animations, so the page is viewable end-to-end. GSAP is layered on in Tasks 8–11.

**Files:**
- Create: `src/components/Hero.tsx`
- Create: `src/components/PullQuote.tsx`
- Create: `src/components/About.tsx`
- Create: `src/components/Contact.tsx`

- [ ] **Step 1: Write `Hero.tsx` (static, no animations)**

```tsx
// src/components/Hero.tsx
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
```

- [ ] **Step 2: Write `PullQuote.tsx` (static)**

```tsx
// src/components/PullQuote.tsx
const QUOTE = '"Design lives in the balance of opposites — freedom and structure, originality and wearability, creativity and execution."'

export default function PullQuote() {
  return (
    <section className="py-20 md:py-32 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <blockquote className="max-w-4xl mx-auto text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          {QUOTE}
        </p>
        <footer className="text-xs font-semibold tracking-[0.3em] uppercase" style={{ color: 'var(--color-accent)' }}>
          — Gabriela Gamargo
        </footer>
      </blockquote>
    </section>
  )
}
```

- [ ] **Step 3: Write `About.tsx` (static)**

```tsx
// src/components/About.tsx
const BIO_INTRO = "I'm Gabriela (Gaby) Gamargo, a fashion designer with 5 years of experience guiding women's collections from concept through creation & 10+ years working in the apparel industry. Since high school, fashion design has been my way of blending creativity with structure."

const BIO_BODY = "At 18, I moved across the country to study in L.A. at FIDM, where I learned everything from illustration and pattern-making to draping and concept development — a leap of faith that became the foundation for my career in design and leadership."

const SKILLS = [
  'Creative Direction', 'Trend Forecasting', 'Technical Design', 'Pattern Making',
  'Adobe Illustrator', 'CLO 3D', 'PROMEAI', 'Global Vendor Mgmt', 'Bilingual EN/ES',
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
          <p className="leading-relaxed text-base md:text-lg mb-6" style={{ color: 'var(--color-muted)' }}>{BIO_INTRO}</p>
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
        <div className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          {/* Placeholder — real image added when Gaby provides one */}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Write `Contact.tsx` (static, placeholder form — Server Action added in Task 12)**

```tsx
// src/components/Contact.tsx
'use client'

import { Linkedin, Instagram } from 'lucide-react'

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>
          Get in Touch
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          Let's Work Together
        </h2>
        <p className="mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Open to collaborations, commissions, and new opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="mailto:hello@gabrielagamargo.com"
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            Say Hello
          </a>
          <a href="/resume.pdf" download
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
            Download Resume
          </a>
        </div>
        <div className="flex justify-center gap-6 mb-14">
          {[
            { href: 'https://linkedin.com/in/gabrielagamargo', icon: <Linkedin size={20} />, label: 'LinkedIn' },
            { href: 'https://instagram.com/gabrielagamargo', icon: <Instagram size={20} />, label: 'Instagram' },
          ].map(({ href, icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Gaby on ${label}`}
              className="w-11 h-11 flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)' }}>
              {icon}
            </a>
          ))}
        </div>
        {/* Form — wired to Server Action in Task 12 */}
        <form className="text-left space-y-6">
          {[
            { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>{label}</label>
              <input id={id} type={type} name={id} required placeholder={placeholder}
                className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>Message</label>
            <textarea id="message" name="message" required rows={5} placeholder="Tell me about your project..."
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200 resize-none"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          </div>
          <button type="submit"
            className="w-full py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            Send Message
          </button>
        </form>
        <p className="mt-16 text-xs tracking-wide" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
          © {new Date().getFullYear()} Gabriela Gamargo. All rights reserved.
        </p>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Build check**

```bash
npm run build
```

- [ ] **Step 6: Commit**

```bash
git add src/components/Hero.tsx src/components/PullQuote.tsx src/components/About.tsx src/components/Contact.tsx
git commit -m "feat: port Hero, PullQuote, About, Contact (static)"
```

---

## Task 6 — Port Portfolio Components + Main Page

**Files:**
- Create: `src/components/PortfolioCard.tsx`
- Create: `src/components/PortfolioCategory.tsx`
- Create: `src/components/Portfolio.tsx`
- Create: `src/app/page.tsx`

- [ ] **Step 1: Write `PortfolioCard.tsx`**

Direct port — 3D tilt logic unchanged, add TypeScript types.

```tsx
// src/components/PortfolioCard.tsx
'use client'

import { useRef } from 'react'

type Props = {
  src: string
  title: string
  alt: string
  category?: string
  onOpen: () => void
  featured?: boolean
}

export default function PortfolioCard({ src, title, alt, category, onOpen, featured }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.1s ease'
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale3d(1.02,1.02,1.02)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transition = 'transform 0.6s ease'
    card.style.transform = 'rotateY(0deg) rotateX(0deg) scale3d(1,1,1)'
  }

  return (
    <div style={{ perspective: '800px' }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      onClick={onOpen} className="cursor-pointer">
      <div ref={cardRef} role="figure" aria-label={category ? `${title} — ${category}` : title}
        className={`relative overflow-hidden group ${featured ? 'aspect-[4/3]' : 'aspect-[3/4]'}`}
        style={{ backgroundColor: 'var(--color-card-bg)', willChange: 'transform' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-300 opacity-0 group-hover:opacity-[0.85]"
          style={{ backgroundColor: 'var(--color-overlay)' }} aria-hidden="true">
          <p className="text-xl font-light tracking-wide text-center px-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>{title}</p>
          {category && (
            <p className="text-xs tracking-[0.2em] uppercase mt-2" style={{ color: 'var(--color-muted)' }}>{category}</p>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Write `PortfolioCategory.tsx`** (mobile fallback — used on < md screens)

```tsx
// src/components/PortfolioCategory.tsx
'use client'

import PortfolioCard from './PortfolioCard'
import type { PortfolioItem } from '@/data/portfolioData'

type Props = {
  number: string
  label: string
  subtitle: string
  items: PortfolioItem[]
  onOpen: (item: PortfolioItem) => void
}

export default function PortfolioCategory({ number, label, subtitle, items, onOpen }: Props) {
  return (
    <div className="mb-24">
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-xs font-semibold tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>{number}</span>
          <h3 className="text-3xl md:text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>{label}</h3>
        </div>
        <p className="text-sm tracking-wide" style={{ color: 'var(--color-muted)' }}>{subtitle}</p>
        <div className="mt-4 w-12 h-px" style={{ backgroundColor: 'var(--color-accent)' }} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {items.map((item, i) => (
          <div key={item.id} className={i === 0 ? 'sm:col-span-2 lg:col-span-2' : ''}>
            <PortfolioCard src={item.src} title={item.title} alt={item.alt} category={label}
              onOpen={() => onOpen(item)} featured={i === 0} />
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write `Portfolio.tsx`** (static for now — GSAP horizontal scroll added in Task 9)

```tsx
// src/components/Portfolio.tsx
'use client'

import { useState } from 'react'
import { categories } from '@/data/portfolioData'
import type { PortfolioItem } from '@/data/portfolioData'
import PortfolioCategory from './PortfolioCategory'
import Lightbox from './Lightbox'

export default function Portfolio() {
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)

  return (
    <section id="portfolio" className="py-24 px-6 md:px-10 max-w-6xl mx-auto">
      <div className="mb-16 text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Selected Work</p>
        <h2 className="text-4xl md:text-5xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>Collections</h2>
      </div>
      {categories.map((cat, i) => (
        <PortfolioCategory key={cat.id} number={String(i + 1).padStart(2, '0')}
          label={cat.label} subtitle={cat.subtitle} items={cat.items}
          onOpen={item => setLightbox(item)} />
      ))}
      <Lightbox src={lightbox?.src} title={lightbox?.title} alt={lightbox?.alt} onClose={() => setLightbox(null)} />
    </section>
  )
}
```

- [ ] **Step 4: Write `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import Marquee from '@/components/Marquee'
import Portfolio from '@/components/Portfolio'
import PullQuote from '@/components/PullQuote'
import About from '@/components/About'
import Contact from '@/components/Contact'
import BackToTop from '@/components/BackToTop'
import CustomCursor from '@/components/CustomCursor'

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Portfolio />
        <PullQuote />
        <About />
        <Contact />
      </main>
      <BackToTop />
      <CustomCursor />
    </>
  )
}
```

- [ ] **Step 5: Build check and smoke test**

```bash
npm run build && npm run dev
```

Open `http://localhost:3000`. Verify:
- Page renders all sections
- Theme toggle switches dark ↔ light
- Nav overlay opens/closes
- Lightbox opens on card click

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: port Portfolio components, compose main page — site working end-to-end"
```

---

## Task 7 — GSAP Setup

**Files:**
- Create: `src/lib/splitWords.ts`
- Create: `src/components/GSAPProvider.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Write `splitWords.ts`**

```ts
// src/lib/splitWords.ts

/**
 * Splits a string into an array of individual words.
 * Components render each word as a <span> element for GSAP to animate.
 * A non-breaking space is appended to each word to preserve spacing.
 */
export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean)
}
```

- [ ] **Step 2: Write `GSAPProvider.tsx`**

```tsx
// src/components/GSAPProvider.tsx
'use client'

import { useEffect } from 'react'

export default function GSAPProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Dynamic import ensures GSAP never runs on the server (it accesses window)
    let ctx: { revert: () => void } | undefined
    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)
      // Normalize scroll on iOS Safari to prevent pin jitter
      ScrollTrigger.normalizeScroll(true)
      // Expose to window so individual components can import and use directly
      // after confirming GSAP is registered
      ;(window as typeof window & { __gsapReady?: boolean }).__gsapReady = true
      ctx = gsap.context(() => {})
    })()
    return () => ctx?.revert()
  }, [])

  return <>{children}</>
}
```

- [ ] **Step 3: Add `GSAPProvider` to `layout.tsx`**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/ThemeProvider'
import GSAPProvider from '@/components/GSAPProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gabriela Gamargo — Fashion Designer',
  description: 'Fashion designer specializing in resort, bridal, and womenswear. Based in Miami.',
  openGraph: {
    title: 'Gabriela Gamargo — Fashion Designer',
    description: 'Fashion designer specializing in resort, bridal, and womenswear. Based in Miami.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <GSAPProvider>
            {children}
          </GSAPProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: clean build. GSAP is loaded client-side only — no SSR warnings.

- [ ] **Step 5: Commit**

```bash
git add src/lib/splitWords.ts src/components/GSAPProvider.tsx src/app/layout.tsx
git commit -m "feat: GSAP provider, splitWords utility"
```

---

## Task 8 — Hero GSAP Animations

**Files:**
- Modify: `src/components/Hero.tsx`

Replace the static Hero with GSAP entrance timeline + scroll parallax. All animation runs after the preloader exits (Task 13 chains it). For now, the entrance fires on mount.

- [ ] **Step 1: Rewrite `Hero.tsx` with GSAP**

```tsx
// src/components/Hero.tsx
'use client'

import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

// Exported so Preloader can chain into it (Task 13)
export let startHeroEntrance: (() => void) | null = null

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const taglineRef = useRef<HTMLParagraphElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    let gsap: typeof import('gsap')['gsap']
    let ScrollTrigger: typeof import('gsap/ScrollTrigger')['ScrollTrigger']
    let ctx: ReturnType<typeof gsap.context>

    ;(async () => {
      const gsapModule = await import('gsap')
      const stModule = await import('gsap/ScrollTrigger')
      gsap = gsapModule.gsap
      ScrollTrigger = stModule.ScrollTrigger
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // ── Entrance timeline ──
        const tl = gsap.timeline({ paused: true })

        // Eyebrow: characters stagger in
        if (eyebrowRef.current) {
          const text = eyebrowRef.current.textContent || ''
          eyebrowRef.current.innerHTML = text.split('').map(c =>
            c === ' ' ? ' ' : `<span style="display:inline-block;opacity:0;transform:translateY(10px)">${c}</span>`
          ).join('')
          tl.to(eyebrowRef.current.querySelectorAll('span'), {
            opacity: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out'
          }, 0)
        }

        // Name: clip-path reveal from bottom
        if (nameRef.current) {
          gsap.set(nameRef.current, { clipPath: 'inset(100% 0 0 0)', y: 20 })
          tl.to(nameRef.current, { clipPath: 'inset(0% 0 0 0)', y: 0, duration: 0.9, ease: 'power3.out' }, 0.2)
        }

        // Tagline, stats, CTA: stagger fade up
        const fadeTargets = [taglineRef.current, statsRef.current, ctaRef.current].filter(Boolean)
        gsap.set(fadeTargets, { opacity: 0, y: 20 })
        tl.to(fadeTargets, { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, 0.5)

        // Expose play function so Preloader can trigger it
        startHeroEntrance = () => tl.play()

        // Auto-play immediately (Preloader Task replaces this with chained call)
        tl.play()

        // ── Scroll parallax ──
        if (sectionRef.current) {
          // Name lingers (slow parallax)
          gsap.to(nameRef.current, {
            y: -80,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: true,
            }
          })
          // Rest moves faster + fades
          const fastTargets = [eyebrowRef.current, taglineRef.current, statsRef.current, ctaRef.current]
          gsap.to(fastTargets, {
            y: -140,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top top',
              end: '40% top',
              scrub: true,
            }
          })
        }
      }, sectionRef)
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero"
      className="relative min-h-screen flex items-center justify-center pt-20 px-6"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="relative text-center max-w-2xl mx-auto">
        <p ref={eyebrowRef} className="text-xs font-semibold tracking-[0.4em] uppercase mb-6"
          style={{ color: 'var(--color-accent)' }}>Fashion Designer</p>
        <h1 ref={nameRef} className="text-8xl md:text-[10rem] font-light italic leading-none mb-6"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>Gaby</h1>
        <p ref={taglineRef} className="text-lg md:text-xl leading-relaxed mb-10"
          style={{ color: 'var(--color-muted)' }}>Design & Direction — Bridging Creativity + Execution</p>
        <div ref={statsRef} className="flex justify-center gap-8 md:gap-14 mb-12">
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
        <a ref={ctaRef} href="#portfolio"
          className="inline-block px-10 py-3.5 text-xs font-semibold tracking-[0.25em] uppercase border transition-colors duration-300 cursor-pointer"
          style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
          onMouseEnter={e => { const el = e.currentTarget; el.style.backgroundColor = 'var(--color-accent)'; el.style.color = 'var(--color-bg)' }}
          onMouseLeave={e => { const el = e.currentTarget; el.style.backgroundColor = 'transparent'; el.style.color = 'var(--color-accent)' }}>
          View Work
        </a>
      </div>
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2" aria-hidden="true">
        <ChevronDown size={22} style={{ color: 'var(--color-muted)', opacity: 0.6 }} />
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Smoke test on dev server**

```bash
npm run dev
```

Open `http://localhost:3000`. Verify: hero text animates in on load. Scrolling makes "Gaby" linger while other elements scroll faster.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.tsx
git commit -m "feat: Hero GSAP entrance timeline + scroll parallax"
```

---

## Task 9 — Portfolio Horizontal Scroll (GSAP ScrollTrigger)

**Files:**
- Modify: `src/components/Portfolio.tsx`

Replace the static vertical layout with a GSAP-pinned horizontal scroll on desktop. Mobile keeps the vertical PortfolioCategory stack.

- [ ] **Step 1: Rewrite `Portfolio.tsx`**

```tsx
// src/components/Portfolio.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { categories } from '@/data/portfolioData'
import type { PortfolioItem } from '@/data/portfolioData'
import PortfolioCard from './PortfolioCard'
import PortfolioCategory from './PortfolioCategory'
import Lightbox from './Lightbox'

export default function Portfolio() {
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const loadedCount = useRef(0)
  const totalImages = categories.reduce((sum, c) => sum + c.items.length, 0)

  const handleImageLoad = useCallback(() => {
    loadedCount.current += 1
    if (loadedCount.current >= totalImages) {
      // All images loaded — refresh ScrollTrigger pin calculations
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        ScrollTrigger.refresh()
      })
    }
  }, [totalImages])

  useEffect(() => {
    // Only apply horizontal scroll on desktop
    if (window.innerWidth < 768) return

    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      const track = trackRef.current
      const bar = progressBarRef.current
      if (!section || !track) return

      const N = categories.length
      // Track translates from 0 to -(N-1) panel widths
      const endX = -(N - 1) * window.innerWidth

      ctx = gsap.context(() => {
        gsap.to(track, {
          x: endX,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: `+=${N * window.innerHeight}`,
            onUpdate: (self) => {
              if (bar) bar.style.transform = `scaleX(${self.progress})`
            },
          },
        })
      })
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <>
      {/* ── Desktop: horizontal scroll ── */}
      <div ref={sectionRef} id="portfolio" className="hidden md:block"
        style={{ height: `${categories.length * 100}vh` }}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* Progress bar */}
          <div ref={progressBarRef} className="absolute bottom-0 left-0 h-[2px] w-full origin-left z-10"
            style={{ backgroundColor: 'var(--color-accent)', transform: 'scaleX(0)' }} />

          {/* Horizontal track */}
          <div ref={trackRef} className="flex h-full" style={{ width: `${categories.length * 100}vw` }}>
            {categories.map((cat, i) => (
              <div key={cat.id} className="w-screen h-full flex-shrink-0 flex flex-col justify-center pt-24 px-10 pb-8">
                {/* Panel header */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-4 mb-2">
                    <span className="text-xs font-semibold tracking-[0.3em]" style={{ color: 'var(--color-accent)' }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-light"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
                      {cat.label}
                    </h3>
                  </div>
                  <p className="text-sm tracking-wide" style={{ color: 'var(--color-muted)' }}>{cat.subtitle}</p>
                  <div className="mt-4 w-12 h-px" style={{ backgroundColor: 'var(--color-accent)' }} />
                </div>

                {/* Asymmetric card grid — first item is col-span-2 */}
                <div className="grid grid-cols-3 gap-6 flex-1">
                  {cat.items.map((item, j) => (
                    <div key={item.id} className={j === 0 ? 'col-span-2' : ''}>
                      <PortfolioCard src={item.src} title={item.title} alt={item.alt} category={cat.label}
                        onOpen={() => setLightbox(item)} featured={j === 0}
                        onImageLoad={handleImageLoad} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mobile: vertical stack ── */}
      <section id="portfolio" className="md:hidden py-24 px-6 max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>Selected Work</p>
          <h2 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>Collections</h2>
        </div>
        {categories.map((cat, i) => (
          <PortfolioCategory key={cat.id} number={String(i + 1).padStart(2, '0')}
            label={cat.label} subtitle={cat.subtitle} items={cat.items}
            onOpen={item => setLightbox(item)} />
        ))}
      </section>

      <Lightbox src={lightbox?.src} title={lightbox?.title} alt={lightbox?.alt} onClose={() => setLightbox(null)} />
    </>
  )
}
```

- [ ] **Step 2: Add `onImageLoad` prop to `PortfolioCard.tsx`**

Add the prop and wire it to the img's `onLoad`:

```tsx
// Add to Props type:
onImageLoad?: () => void

// Add to <img>:
onLoad={onImageLoad}
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

- [ ] **Step 4: Smoke test**

Open `http://localhost:3000`. On desktop, scroll through the portfolio section and verify cards slide horizontally. On mobile (resize browser < 768px), verify vertical stack renders instead.

- [ ] **Step 5: Commit**

```bash
git add src/components/Portfolio.tsx src/components/PortfolioCard.tsx
git commit -m "feat: Portfolio GSAP horizontal scroll with mobile fallback"
```

---

## Task 10 — PullQuote Word Reveal

**Files:**
- Modify: `src/components/PullQuote.tsx`

- [ ] **Step 1: Rewrite `PullQuote.tsx` with GSAP word reveal**

```tsx
// src/components/PullQuote.tsx
'use client'

import { useEffect, useRef } from 'react'
import { splitWords } from '@/lib/splitWords'

const QUOTE = '"Design lives in the balance of opposites — freedom and structure, originality and wearability, creativity and execution."'
const words = splitWords(QUOTE)

export default function PullQuote() {
  const sectionRef = useRef<HTMLElement>(null)
  const wordsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const spans = wordsRef.current.filter(Boolean)
      if (!sectionRef.current || spans.length === 0) return

      gsap.set(spans, { opacity: 0.1 })

      ctx = gsap.context(() => {
        gsap.to(spans, {
          opacity: 1,
          ease: 'none',
          stagger: {
            each: 1 / spans.length,
            from: 'start',
          },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            end: 'top 15%',
            scrub: true,
          },
        })
      })
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 md:py-32 px-6 md:px-10"
      style={{ backgroundColor: 'var(--color-bg)' }}>
      <blockquote className="max-w-4xl mx-auto text-center">
        <p className="text-3xl md:text-4xl lg:text-5xl font-light italic leading-snug mb-8"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          {words.map((word, i) => (
            <span
              key={i}
              ref={el => { if (el) wordsRef.current[i] = el }}
              style={{ opacity: 0.1 }}
            >
              {word}{' '}
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
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/PullQuote.tsx
git commit -m "feat: PullQuote GSAP word-by-word scroll reveal"
```

---

## Task 11 — About GSAP Animations

**Files:**
- Modify: `src/components/About.tsx`

- [ ] **Step 1: Rewrite `About.tsx` with GSAP word reveal on bio intro + slide-in**

```tsx
// src/components/About.tsx
'use client'

import { useEffect, useRef } from 'react'
import { splitWords } from '@/lib/splitWords'

const BIO_INTRO = "I'm Gabriela (Gaby) Gamargo, a fashion designer with 5 years of experience guiding women's collections from concept through creation & 10+ years working in the apparel industry. Since high school, fashion design has been my way of blending creativity with structure."

const BIO_BODY = "At 18, I moved across the country to study in L.A. at FIDM, where I learned everything from illustration and pattern-making to draping and concept development — a leap of faith that became the foundation for my career in design and leadership."

const SKILLS = [
  'Creative Direction', 'Trend Forecasting', 'Technical Design', 'Pattern Making',
  'Adobe Illustrator', 'CLO 3D', 'PROMEAI', 'Global Vendor Mgmt', 'Bilingual EN/ES',
]

const introWords = splitWords(BIO_INTRO)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const textColRef = useRef<HTMLDivElement>(null)
  const imgColRef = useRef<HTMLDivElement>(null)
  const introWordsRef = useRef<HTMLSpanElement[]>([])

  useEffect(() => {
    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      if (!sectionRef.current) return

      ctx = gsap.context(() => {
        // Text column slide in from left
        gsap.from(textColRef.current, {
          opacity: 0, x: -24,
          duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' }
        })

        // Image column slide in from right
        gsap.from(imgColRef.current, {
          opacity: 0, x: 24, scale: 1.05,
          duration: 0.7, ease: 'power2.out', delay: 0.15,
          scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' }
        })

        // Bio intro word reveal
        const spans = introWordsRef.current.filter(Boolean)
        if (spans.length > 0) {
          gsap.set(spans, { opacity: 0.1 })
          gsap.to(spans, {
            opacity: 1, ease: 'none',
            stagger: { each: 1 / spans.length, from: 'start' },
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 70%',
              end: 'top 20%',
              scrub: true,
            },
          })
        }
      })
    })()

    return () => ctx?.revert()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-24 px-6 md:px-10"
      style={{ backgroundColor: 'var(--color-surface)' }}>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div ref={textColRef}>
          <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>About</p>
          <h2 className="text-4xl md:text-5xl font-light italic mb-6 leading-tight"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
            Gabriela Gamargo
          </h2>
          <p className="leading-relaxed text-base md:text-lg mb-6" style={{ color: 'var(--color-muted)' }}>
            {introWords.map((word, i) => (
              <span key={i} ref={el => { if (el) introWordsRef.current[i] = el }} style={{ opacity: 0.1 }}>
                {word}{' '}
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
        <div ref={imgColRef} className="aspect-[4/5] overflow-hidden" style={{ backgroundColor: 'var(--color-border)' }}>
          {/* Placeholder — real image added when Gaby provides one */}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/About.tsx
git commit -m "feat: About GSAP slide-in + word reveal on bio intro"
```

---

## Task 12 — Contact Form: Server Action + Resend

**Files:**
- Create: `src/app/actions/sendEmail.ts`
- Modify: `src/components/Contact.tsx`
- Create: `.env.local` (local dev only — not committed)

- [ ] **Step 1: Create `.env.local`**

```bash
# Do NOT commit this file
cat >> .gitignore << 'EOF'
.env.local
EOF
```

Create `.env.local` in the project root:
```
RESEND_API_KEY=re_your_key_here
GABY_EMAIL=hello@gabrielagamargo.com
```

To get a Resend API key: sign up at resend.com → API Keys → Create Key.

- [ ] **Step 2: Write `sendEmail.ts`**

```ts
// src/app/actions/sendEmail.ts
'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

type FormData = { name: string; email: string; message: string }
type Result = { success: true } | { error: string }

export async function sendEmail(data: FormData): Promise<Result> {
  const { name, email, message } = data

  if (!name?.trim()) return { error: 'Name is required.' }
  if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return { error: 'Valid email is required.' }
  if (!message?.trim() || message.trim().length < 10) return { error: 'Message must be at least 10 characters.' }

  try {
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // ⚠️ Resend sandbox domain — works for dev/testing only. Before going live, verify Gaby's domain in Resend and change this to an address on that domain.
      to: process.env.GABY_EMAIL!,
      replyTo: email,
      subject: `Portfolio inquiry from ${name}`,
      html: `
        <p><strong>From:</strong> ${name} (${email})</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br />')}</p>
      `,
    })
    return { success: true }
  } catch (err) {
    console.error('Resend error:', err)
    return { error: 'Failed to send. Please try again or email directly.' }
  }
}
```

- [ ] **Step 3: Replace `Contact.tsx` with the Server Action version**

Replace the entire contents of `src/components/Contact.tsx` with:

```tsx
// src/components/Contact.tsx
'use client'

import { useActionState } from 'react'
import { Linkedin, Instagram } from 'lucide-react'
import { sendEmail } from '@/app/actions/sendEmail'

export default function Contact() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      return sendEmail({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        message: formData.get('message') as string,
      })
    },
    null
  )

  return (
    <section id="contact" className="py-24 px-6 md:px-10" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-semibold tracking-[0.4em] uppercase mb-4" style={{ color: 'var(--color-accent)' }}>
          Get in Touch
        </p>
        <h2 className="text-4xl md:text-5xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}>
          Let's Work Together
        </h2>
        <p className="mb-10 leading-relaxed" style={{ color: 'var(--color-muted)' }}>
          Open to collaborations, commissions, and new opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
          <a href="mailto:hello@gabrielagamargo.com"
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            Say Hello
          </a>
          <a href="/resume.pdf" download
            className="px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 cursor-pointer"
            style={{ border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
            Download Resume
          </a>
        </div>
        <div className="flex justify-center gap-6 mb-14">
          {[
            { href: 'https://linkedin.com/in/gabrielagamargo', icon: <Linkedin size={20} />, label: 'LinkedIn' },
            { href: 'https://instagram.com/gabrielagamargo', icon: <Instagram size={20} />, label: 'Instagram' },
          ].map(({ href, icon, label }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Gaby on ${label}`}
              className="w-11 h-11 flex items-center justify-center transition-colors duration-200 cursor-pointer"
              style={{ color: 'var(--color-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-muted)' }}>
              {icon}
            </a>
          ))}
        </div>
        <form action={formAction} className="text-left space-y-6">
          {[
            { id: 'name', label: 'Name', type: 'text', placeholder: 'Your name' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
          ].map(({ id, label, type, placeholder }) => (
            <div key={id}>
              <label htmlFor={id} className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>{label}</label>
              <input id={id} type={type} name={id} required placeholder={placeholder}
                className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200"
                style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
            </div>
          ))}
          <div>
            <label htmlFor="message" className="block text-xs font-semibold tracking-[0.15em] uppercase mb-2" style={{ color: 'var(--color-muted)' }}>Message</label>
            <textarea id="message" name="message" required rows={5} placeholder="Tell me about your project..."
              className="w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-shadow duration-200 resize-none"
              style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text)' }} />
          </div>
          {state && 'error' in state && (
            <p className="text-sm" style={{ color: '#e74c3c' }}>{state.error}</p>
          )}
          {state && 'success' in state && (
            <p className="text-sm" style={{ color: 'var(--color-accent)' }}>
              Message sent! Gaby will be in touch soon.
            </p>
          )}
          <button type="submit" disabled={isPending}
            className="w-full py-4 text-xs font-semibold tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer disabled:opacity-60"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-bg)' }}>
            {isPending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
        <p className="mt-16 text-xs tracking-wide" style={{ color: 'var(--color-muted)', opacity: 0.6 }}>
          © {new Date().getFullYear()} Gabriela Gamargo. All rights reserved.
        </p>
      </div>
    </section>
  )
}
```

**Note:** `useActionState` is React 19 / Next.js 15. If there is a type error, check that `react` version is 19+.

- [ ] **Step 4: Build check**

```bash
npm run build
```

- [ ] **Step 5: Commit (do NOT commit .env.local)**

```bash
git add src/app/actions/sendEmail.ts src/components/Contact.tsx .gitignore
git commit -m "feat: Server Action contact form via Resend"
```

---

## Task 13 — Preloader

**Files:**
- Create: `src/components/Preloader.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write `Preloader.tsx`**

```tsx
// src/components/Preloader.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { startHeroEntrance } from './Hero'

export default function Preloader() {
  const [visible, setVisible] = useState(true)
  const logoRef = useRef<HTMLSpanElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Don't show preloader again in the same session
    if (sessionStorage.getItem('preloader_seen')) {
      setVisible(false)
      startHeroEntrance?.()
      return
    }

    let ctx: { revert: () => void } | undefined

    ;(async () => {
      const { gsap } = await import('gsap')

      ctx = gsap.context(() => {
        const tl = gsap.timeline()

        // Fade in logo
        tl.from(logoRef.current, { opacity: 0, y: 10, duration: 0.6, ease: 'power2.out' })

        // Pause at full opacity
        tl.to({}, { duration: 0.5 })

        // Slide overlay up
        tl.to(overlayRef.current, {
          y: '-100%',
          duration: 0.8,
          ease: 'power3.inOut',
          onComplete: () => {
            setVisible(false)
            sessionStorage.setItem('preloader_seen', '1')
            // Chain into hero entrance
            startHeroEntrance?.()
          },
        })
      })
    })()

    return () => ctx?.revert()
  }, [])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9995] flex items-center justify-center"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <span
        ref={logoRef}
        className="text-2xl font-light tracking-[0.4em]"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: 'var(--color-text)' }}
      >
        G. GAMARGO
      </span>
    </div>
  )
}
```

- [ ] **Step 2: Update `Hero.tsx` — disable auto-play of entrance (preloader will trigger it)**

In `Hero.tsx`, find the line:
```ts
// Auto-play immediately (Preloader Task replaces this with chained call)
tl.play()
```

Replace with:
```ts
// Preloader calls startHeroEntrance() to trigger this
// If preloader already ran this session, play immediately
if (sessionStorage.getItem('preloader_seen')) {
  tl.play()
}
```

- [ ] **Step 3: Add `Preloader` to `page.tsx`**

```tsx
// src/app/page.tsx
import Preloader from '@/components/Preloader'
// ... other imports ...

export default function Home() {
  return (
    <>
      <Preloader />
      <Navbar />
      <main>
        {/* ... sections ... */}
      </main>
      <BackToTop />
      <CustomCursor />
    </>
  )
}
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

- [ ] **Step 5: Smoke test**

Open `http://localhost:3000` in a fresh tab (or clear sessionStorage). Verify:
- Preloader overlay appears with "G. GAMARGO"
- After ~1.2s, overlay slides up
- Hero content animates in immediately after
- Refreshing the same tab skips the preloader and plays hero immediately

- [ ] **Step 6: Commit**

```bash
git add src/components/Preloader.tsx src/components/Hero.tsx src/app/page.tsx
git commit -m "feat: Preloader GSAP intro → chains into Hero entrance"
```

---

## Task 14 — Case Study Placeholder Route

**Files:**
- Create: `src/app/work/[slug]/page.tsx`

- [ ] **Step 1: Write the placeholder page**

```tsx
// src/app/work/[slug]/page.tsx
export const dynamicParams = false

export async function generateStaticParams() {
  // No case studies yet — no pages pre-rendered
  // When Sanity is connected (Plan 2), this returns slugs from CMS
  return []
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  // This page is never reached (dynamicParams = false + empty generateStaticParams = 404)
  // Placeholder for Plan 2
  return null
}
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

- [ ] **Step 3: Push everything to GitHub**

```bash
git add src/app/work/
git commit -m "feat: case study placeholder route /work/[slug]"
git push
```

- [ ] **Step 4: Verify Vercel deployment**

Check the Vercel dashboard or visit the deployed URL. Confirm the new site is live with the dark theme, preloader, and all sections.

---

## Final Checklist

Before considering Plan 1 complete, verify:

- [ ] Dark theme loads by default on first visit
- [ ] Light theme (Warm Ivory) toggles correctly
- [ ] Preloader shows once per session, then is skipped
- [ ] Hero GSAP entrance fires after preloader exits
- [ ] Hero parallax works on scroll (Gaby lingers, rest fades)
- [ ] Portfolio horizontal scroll works on desktop
- [ ] Portfolio shows vertical stack on mobile
- [ ] Portfolio progress bar fills as you scroll through panels
- [ ] PullQuote words reveal word by word on scroll
- [ ] About text slides in + bio intro word reveal works
- [ ] Lightbox opens on card click, ESC closes it
- [ ] Navbar overlay slides down and links scroll to sections
- [ ] Contact form submits (requires live Resend key in Vercel env vars)
- [ ] Resume download link works (add `public/resume.pdf` when Gaby provides it)
- [ ] `https://yoursite.vercel.app/work/anything` returns 404
- [ ] No console errors in production build
