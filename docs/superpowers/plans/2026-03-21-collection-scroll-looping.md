# Collection Scroll — Looping Vertical Carousel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current two-zone collection page (hero intro + stacked sections) with a single full-screen looping carousel where each section is a full-screen panel with full-bleed image, 40/60 text/carousel split, and GSAP-driven transitions that wrap infinitely.

**Architecture:** GSAP Observer captures wheel + touch events and drives a section index with modulo wrapping. Body scroll is locked for the duration. Each panel has a full-bleed background image with a left-to-right gradient fade, text content in the left 40%, and the 3D carousel in the right 60%. All images are pre-rendered but only the active panel is visible (opacity). Transitions use `gsap.to()` — not tied to scroll position.

**Tech Stack:** Next.js 15, React 19, TypeScript, GSAP 3 + Observer plugin, Framer Motion (inside CollectionCarousel), Tailwind CSS 4 / inline styles

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/components/CollectionScrollFX.tsx` | **Full rewrite** | Looping carousel: Observer, panels, transitions, overlay, progress dots |
| `src/components/SplitScrollCollection.tsx` | **Major simplification** | Thin wrapper — maps category data to CollectionScrollFX props |

No other files change. `CollectionCarousel.tsx`, `GlowCard.tsx`, `portfolioData.ts` are untouched.

---

## Watch-Outs

- **CollectionScrollFX is a from-scratch rewrite** — discard all existing code. The old component has `ScrollTrigger`, `leftLabel`/`rightLabel` tracks, word-splitting machinery — none of it carries over.
- **TypeScript errors after Task 1** — `SplitScrollCollection.tsx` still imports the old prop shape. This is expected. Fix in Task 2.
- **No test suite** — verify with `npm run lint` (not `npx eslint`) and `npm run build` after Task 2.
- **GSAP Observer must be registered** — import from `gsap/Observer` and call `gsap.registerPlugin(Observer)` before use.
- **`CollectionCarousel` needs `sectionTitle`** — pass `sections[activeIndex].title` as `sectionTitle`. The `key={activeIndex}` prop resets the carousel on section change.
- **Wheel event coexistence** — the carousel attaches its own `{ passive: false }` wheel listener for horizontal scroll. Observer should use `preventDefault: false` and filter out wheel events where `|deltaX| >= |deltaY|`.
- **Body overflow** — lock in `useLayoutEffect`, restore in cleanup. Next.js App Router soft nav triggers cleanup reliably when using `useLayoutEffect`.
- **`category.label` is a full string** (e.g. `"Resort & Activewear"`) — the fixed overlay must truncate with `text-overflow: ellipsis`.

---

## Task 1: Rewrite CollectionScrollFX.tsx

**Files:**
- Rewrite: `src/components/CollectionScrollFX.tsx` (entire file)

- [ ] **Step 1: Replace the entire file with the new implementation**

```tsx
'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import { Observer } from 'gsap/Observer'
import type { SectionImage } from '@/data/portfolioData'
import CollectionCarousel from './CollectionCarousel'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Observer)
}

type CollectionScrollSection = {
  id: string
  background: string
  title: string
  description: string
  outcome: string
  pills: string[]
  images: SectionImage[]
  counter: string
}

export type CollectionScrollFXProps = {
  sections: CollectionScrollSection[]
  collectionLabel: string
}

function parseOutcome(outcome: string): { label: string; body: string } {
  if (outcome.startsWith('↑') || outcome.startsWith('Featured')) {
    if (outcome.includes(' — ')) {
      const [label, ...rest] = outcome.split(' — ')
      return { label, body: rest.join(' — ') }
    }
    if (outcome.includes('. ')) {
      const [label, ...rest] = outcome.split('. ')
      return { label, body: rest.join('. ') }
    }
  }
  return { label: 'Outcome', body: outcome }
}

export default function CollectionScrollFX({ sections, collectionLabel }: CollectionScrollFXProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const total = sections.length
  const isAnimatingRef = useRef(false)
  const currentIndexRef = useRef(0)
  const bgRefs = useRef<(HTMLDivElement | null)[]>([])
  const textRefs = useRef<(HTMLDivElement | null)[]>([])

  const goTo = (next: number) => {
    if (isAnimatingRef.current) return
    const prev = currentIndexRef.current
    if (next === prev) return
    isAnimatingRef.current = true
    currentIndexRef.current = next

    const prevBg = bgRefs.current[prev]
    const nextBg = bgRefs.current[next]
    if (prevBg) gsap.to(prevBg, { opacity: 0, duration: 0.6, ease: 'power2.out' })
    if (nextBg) gsap.to(nextBg, { opacity: 1, duration: 0.6, ease: 'power2.out' })

    const prevText = textRefs.current[prev]
    if (prevText) gsap.to(prevText, { opacity: 0, y: -20, duration: 0.4, ease: 'power2.out' })

    const nextText = textRefs.current[next]
    if (nextText) {
      gsap.set(nextText, { opacity: 0, y: 20 })
      gsap.to(nextText, { opacity: 1, y: 0, duration: 0.5, delay: 0.25, ease: 'power2.out' })
    }

    setActiveIndex(next)
    gsap.delayedCall(0.8, () => { isAnimatingRef.current = false })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (typeof window === 'undefined' || total === 0) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    bgRefs.current.forEach((bg, i) => {
      if (bg) gsap.set(bg, { opacity: i === 0 ? 1 : 0 })
    })
    textRefs.current.forEach((text, i) => {
      if (text) gsap.set(text, { opacity: i === 0 ? 1 : 0, y: i === 0 ? 0 : 20 })
    })

    const observer = Observer.create({
      type: 'wheel,touch',
      preventDefault: false,
      debounce: true,
      onDown: (self) => {
        const e = self.event as WheelEvent | null
        if (e && 'deltaX' in e && 'deltaY' in e) {
          if (Math.abs((e as WheelEvent).deltaX) >= Math.abs((e as WheelEvent).deltaY)) return
        }
        goTo((currentIndexRef.current + 1) % total)
      },
      onUp: (self) => {
        const e = self.event as WheelEvent | null
        if (e && 'deltaX' in e && 'deltaY' in e) {
          if (Math.abs((e as WheelEvent).deltaX) >= Math.abs((e as WheelEvent).deltaY)) return
        }
        goTo((currentIndexRef.current - 1 + total) % total)
      },
    })

    return () => {
      observer.kill()
      document.body.style.overflow = prevOverflow
    }
  }, [total])

  if (total === 0) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        backgroundColor: 'var(--color-bg)',
        zIndex: 0,
      }}
    >
      {/* Fixed overlay: back nav + collection label */}
      <div
        style={{
          position: 'fixed',
          top: '1.5rem',
          left: '4rem',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <Link
          href="/#portfolio"
          data-cursor="link"
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            textDecoration: 'none',
          }}
        >
          ← Back to Portfolio
        </Link>
        <span
          style={{
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--color-accent)',
            maxWidth: '12rem',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {collectionLabel}
        </span>
      </div>

      {/* Background images — all rendered, only active is visible */}
      {sections.map((section, i) => (
        <div
          key={section.id}
          ref={(el) => { bgRefs.current[i] = el }}
          style={{ position: 'absolute', inset: 0, opacity: 0 }}
        >
          <Image
            src={section.background}
            alt=""
            fill
            style={{ objectFit: 'cover', filter: 'brightness(0.65)' }}
            sizes="100vw"
            priority={i === 0}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(12,12,14,0.95) 0%, rgba(12,12,14,0.92) 35%, rgba(12,12,14,0.5) 55%, transparent 100%)',
            }}
          />
        </div>
      ))}

      {/* 40/60 split panel */}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          zIndex: 1,
        }}
      >
        {/* Left: text content (all sections stacked, only active visible) */}
        <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
          {sections.map((section, i) => {
            const { label, body } = parseOutcome(section.outcome)
            return (
              <div
                key={section.id}
                ref={(el) => { textRefs.current[i] = el }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  padding: '3rem 2.5rem 3rem 4rem',
                  gap: '1.5rem',
                  opacity: 0,
                }}
              >
                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.6rem',
                    letterSpacing: '0.35em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    margin: 0,
                  }}
                >
                  {section.counter}
                </p>
                <h2
                  style={{
                    fontFamily: 'Cormorant Garamond, serif',
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                    lineHeight: 1.05,
                    color: 'var(--color-text)',
                    margin: 0,
                  }}
                >
                  {section.title}
                </h2>
                <p
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.875rem',
                    lineHeight: 1.75,
                    color: 'var(--color-muted)',
                    margin: 0,
                  }}
                >
                  {section.description}
                </p>
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    borderLeft: '2px solid var(--color-accent)',
                    background: 'rgba(184,150,90,0.05)',
                    fontSize: '0.8rem',
                    lineHeight: 1.6,
                    color: 'var(--color-text)',
                  }}
                >
                  <span
                    style={{
                      color: 'var(--color-accent)',
                      fontWeight: 600,
                      fontFamily: 'Manrope, sans-serif',
                    }}
                  >
                    {label}
                  </span>
                  {' '}
                  {body}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {section.pills.map((pill) => (
                    <span
                      key={pill}
                      style={{
                        padding: '0.3rem 0.75rem',
                        border: '1px solid var(--color-accent)',
                        background: 'rgba(184,150,90,0.08)',
                        fontFamily: 'Manrope, sans-serif',
                        fontSize: '0.6rem',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        color: 'var(--color-accent)',
                        borderRadius: '2px',
                      }}
                    >
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Right: 3D carousel — key resets it on section change */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem 3rem 3rem 2.5rem',
          }}
        >
          <CollectionCarousel
            key={activeIndex}
            images={sections[activeIndex].images}
            sectionTitle={sections[activeIndex].title}
          />
        </div>
      </div>

      {/* Progress dots — bottom center */}
      <div
        style={{
          position: 'fixed',
          bottom: '2rem',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: '0.5rem',
          zIndex: 100,
        }}
      >
        {sections.map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: i === activeIndex ? 'var(--color-accent)' : 'transparent',
              border: '1px solid var(--color-accent)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run lint to check for obvious errors**

```bash
cd /Users/alexanderburger/Desktop/gaby-portfolio && npm run lint 2>&1 | head -40
```

Expected: TypeScript errors in `SplitScrollCollection.tsx` about the old prop shape — these are expected and will be fixed in Task 2. No errors should originate from `CollectionScrollFX.tsx` itself.

- [ ] **Step 3: Commit Task 1**

```bash
git add src/components/CollectionScrollFX.tsx
git commit -m "feat(collection): rewrite CollectionScrollFX as looping GSAP Observer carousel"
```

---

## Task 2: Simplify SplitScrollCollection.tsx

**Files:**
- Rewrite: `src/components/SplitScrollCollection.tsx` (entire file)

- [ ] **Step 1: Replace the entire file**

```tsx
'use client'

import type { PortfolioCategory } from '@/data/portfolioData'
import CollectionScrollFX from './CollectionScrollFX'

export default function SplitScrollCollection({ category }: { category: PortfolioCategory }) {
  return (
    <CollectionScrollFX
      sections={category.sections.map((s, i) => ({
        id: s.id,
        background: s.images[0]?.src ?? '',
        title: s.title,
        description: s.description,
        outcome: s.outcome,
        pills: s.pills,
        images: s.images,
        counter: `${String(i + 1).padStart(2, '0')} / ${String(category.sections.length).padStart(2, '0')}`,
      }))}
      collectionLabel={category.label}
    />
  )
}
```

- [ ] **Step 2: Run lint**

```bash
cd /Users/alexanderburger/Desktop/gaby-portfolio && npm run lint 2>&1 | head -40
```

Expected: No errors from `SplitScrollCollection.tsx` or `CollectionScrollFX.tsx`. Pre-existing errors in `Contact.tsx` (unescaped apostrophes) and `Navbar.tsx` (`<a>` element) are pre-existing — do not fix them here.

- [ ] **Step 3: Run build**

```bash
cd /Users/alexanderburger/Desktop/gaby-portfolio && npm run build 2>&1 | tail -20
```

Expected: Build completes successfully. The `/work/[slug]` pages should be statically generated (listed in the build output under `○` or `●` routes).

If the build fails with a GSAP Observer import error (`Cannot find module 'gsap/Observer'`), check that `gsap` is installed and at version ≥ 3.11:
```bash
cat node_modules/gsap/package.json | grep '"version"'
```
If Observer is not available, fall back to a native wheel listener approach — see the spec's Known Open Items.

- [ ] **Step 4: Commit Task 2**

```bash
git add src/components/SplitScrollCollection.tsx
git commit -m "feat(collection): simplify SplitScrollCollection to thin wrapper for looping carousel"
```

- [ ] **Step 5: Push**

```bash
git push
```
