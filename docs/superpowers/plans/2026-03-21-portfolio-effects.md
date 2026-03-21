# Portfolio Effects Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three visual effects to the Gaby portfolio: GlowCard on carousel photos, GlowingShadow on the collection page vertical divider, and FullScreenScrollFX as a home-page section picker and collection-page section intro.

**Architecture:** GlowCard wraps each carousel card face with pointer-tracking spotlight effect. GlowingShadow replaces/augments the `split-story::after` gold divider with an animated glow. FullScreenScrollFX is a GSAP ScrollTrigger full-screen panel scroller used in two places: replacing the Portfolio accordion on the home page, and as a section-picker intro above the existing split layout on each collection page.

**Tech Stack:** Next.js 15 App Router, React 19, GSAP 3 + ScrollTrigger (already registered in GSAPProvider), Framer Motion (already installed), Tailwind CSS 4, CSS custom properties.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/components/GlowCard.tsx` | Pointer-tracking spotlight card wrapper |
| Modify | `src/components/CollectionCarousel.tsx` | Wrap each carousel card face in GlowCard |
| Create | `src/components/GlowingShadow.tsx` | Animated glow overlay for divider |
| Modify | `src/components/SplitScrollCollection.tsx` | Replace `::after` divider with GlowingShadow; add FullScreenScrollFX section picker at top |
| Create | `src/components/FullScreenScrollFX.tsx` | Full-screen GSAP scroll panel (shared, used in two places) |
| Modify | `src/components/Portfolio.tsx` | Replace accordion with FullScreenScrollFX |

---

## Task 1: GlowCard component

**Files:**
- Create: `src/components/GlowCard.tsx`

### What it does
A `div` wrapper that tracks pointer position and paints a radial-gradient spotlight using a CSS custom property. The spotlight hue shifts as the pointer moves across the X axis.

- [ ] **Step 1: Create `src/components/GlowCard.tsx`**

```tsx
'use client'

import { useRef, useCallback } from 'react'

type GlowCardProps = {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

export default function GlowCard({ children, className, style }: GlowCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const xPct = (x / rect.width) * 100
    const yPct = (y / rect.height) * 100
    // Hue shifts from 40 (gold) to 320 (rose) across X axis
    const hue = 40 + (xPct / 100) * 280
    card.style.setProperty('--glow-x', `${xPct}%`)
    card.style.setProperty('--glow-y', `${yPct}%`)
    card.style.setProperty('--glow-hue', String(hue))
    card.style.setProperty('--glow-opacity', '1')
  }, [])

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current
    if (!card) return
    card.style.setProperty('--glow-opacity', '0')
  }, [])

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        '--glow-x': '50%',
        '--glow-y': '50%',
        '--glow-hue': '40',
        '--glow-opacity': '0',
        ...style,
      } as React.CSSProperties}
    >
      {/* Spotlight overlay — sits above image, below pointer events */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          zIndex: 2,
          background: `radial-gradient(
            circle 140px at var(--glow-x) var(--glow-y),
            hsla(var(--glow-hue), 70%, 75%, 0.18) 0%,
            transparent 80%
          )`,
          opacity: 'var(--glow-opacity)' as string,
          transition: 'opacity 0.25s ease',
        }}
      />
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Verify file saved** — open `src/components/GlowCard.tsx` and confirm no syntax errors (`npm run lint`)

---

## Task 2: Integrate GlowCard into CollectionCarousel

**Files:**
- Modify: `src/components/CollectionCarousel.tsx`

Each carousel card face (`div` with `position: absolute`, `width: faceWidth`, `height: CARD_HEIGHT`) gets wrapped in a `GlowCard`. The inner image container must keep `position: relative` so the spotlight overlay stacks correctly.

- [ ] **Step 1: Import GlowCard at top of `CollectionCarousel.tsx`**

Add after existing imports:
```tsx
import GlowCard from './GlowCard'
```

- [ ] **Step 2: Wrap each face div in GlowCard**

In the `Carousel` function, find the `images.map` block. The outer `div` with `position: absolute` is the face container — replace the inner container `div` (the one with `clipPath`) so the glow is layered on the card surface:

Replace the inner `div` block (lines ~144–163 in current file):
```tsx
<GlowCard
  style={{
    width: '100%',
    height: '100%',
    clipPath: 'inset(0 round 4px)',
    border: '1px solid var(--color-border)',
    overflow: 'hidden',
  }}
>
  <Image
    src={img.src}
    alt={img.caption ?? sectionTitle}
    fill
    draggable={false}
    style={{ objectFit: 'cover', pointerEvents: 'none' }}
    sizes="280px"
  />
</GlowCard>
```

Note: remove the old inner `div` with `clipPath` — GlowCard itself carries those styles.

- [ ] **Step 3: Run dev server and visually verify**

```bash
npm run dev
```

Navigate to any `/work/[slug]` page. Hover over carousel cards — spotlight should appear and follow pointer. Move left-to-right — hue should shift gold → rose. Mouse-leave should fade the glow out.

- [ ] **Step 4: Lint**

```bash
npm run lint
```

Fix any issues.

- [ ] **Step 5: Commit**

```bash
git add src/components/GlowCard.tsx src/components/CollectionCarousel.tsx
git commit -m "feat(carousel): GlowCard pointer-tracking spotlight on card faces"
```

---

## Task 3: GlowingShadow component

**Files:**
- Create: `src/components/GlowingShadow.tsx`

Replaces the CSS `::after` pseudo-element divider in `SplitScrollCollection`. GlowingShadow is a `div` absolutely positioned at the right edge of the story column, pulsing a soft glow that augments the gold gradient line.

- [ ] **Step 1: Create `src/components/GlowingShadow.tsx`**

```tsx
'use client'

export default function GlowingShadow() {
  return (
    <>
      {/* Gold gradient rule — same as old ::after */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '1px',
          height: '100%',
          background: 'linear-gradient(to bottom, transparent, var(--color-accent) 20%, var(--color-accent) 80%, transparent)',
          opacity: 0.45,
          zIndex: 1,
        }}
      />
      {/* Glow bloom — wider soft pulse behind the rule */}
      <div
        aria-hidden
        className="glowing-shadow-bloom"
        style={{
          position: 'absolute',
          top: '10%',
          right: '-8px',
          width: '17px',
          height: '80%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse at center, hsla(38,55%,55%,0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />
      <style>{`
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; transform: scaleY(1); }
          50%       { opacity: 1;    transform: scaleY(1.08); }
        }
        @media (max-width: 768px) {
          .glowing-shadow-bloom { display: none; }
        }
      `}</style>
    </>
  )
}
```

- [ ] **Step 2: Verify file saved** — `npm run lint`

---

## Task 4: Integrate GlowingShadow into SplitScrollCollection

**Files:**
- Modify: `src/components/SplitScrollCollection.tsx`

Remove the `::after` CSS rule and render `<GlowingShadow />` inside the `.split-story` column instead.

- [ ] **Step 1: Import GlowingShadow**

Add at top of `SplitScrollCollection.tsx`:
```tsx
import GlowingShadow from './GlowingShadow'
```

- [ ] **Step 2: Remove the `::after` CSS rule**

In the `<style>` block at bottom of the file, delete:
```css
/* Gradient vertical divider between text and carousel */
.split-story::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent, var(--color-accent) 20%, var(--color-accent) 80%, transparent);
  opacity: 0.45;
}
```

- [ ] **Step 3: Render GlowingShadow inside the story column**

In the `.split-story` `div` (the sticky left column), confirm it already has `position: relative` (it does via `position: sticky`) — add `overflow: visible` if needed. Then add `<GlowingShadow />` as the last child of that `div`, before the closing `</div>`:

```tsx
<GlowingShadow />
```

- [ ] **Step 4: Run dev server and visually verify**

Navigate to any `/work/[slug]` page. The gold vertical divider should be visible as before. On close inspection, a soft pulsing glow bloom should be visible behind/around the rule, breathing gently.

- [ ] **Step 5: Lint and commit**

```bash
npm run lint
git add src/components/GlowingShadow.tsx src/components/SplitScrollCollection.tsx
git commit -m "feat(collection): GlowingShadow pulsing glow on vertical divider"
```

---

## Task 5: FullScreenScrollFX component

**Files:**
- Create: `src/components/FullScreenScrollFX.tsx`

This is a full-screen GSAP ScrollTrigger panel scroller. Each panel occupies 100vh. Scrolling "snaps" through panels via GSAP. Used in two contexts:

1. **Home page** — panels are portfolio categories. Each panel shows `previewImages[0]` full-bleed, category label, subtitle, and a "View Collection →" link. Clicking the link navigates to `/work/[slug]`. Looping: after the last panel, scrolling wraps to the first (GSAP `scrub` with modulo indexing).
2. **Collection page intro** — panels are the collection's sections. Each panel shows the section title and a jump link to `#section-{id}` below. After the last panel, scroll continues naturally down to the split layout.

The component takes a `mode` prop: `'home'` or `'collection'`. It also takes the data as a prop.

- [ ] **Step 1: Create `src/components/FullScreenScrollFX.tsx`**

```tsx
'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

gsap.registerPlugin(ScrollTrigger)

type HomePanel = {
  mode: 'home'
  id: string
  label: string
  subtitle: string
  imageSrc: string
  href: string
  sectionCount: number
}

type CollectionPanel = {
  mode: 'collection'
  id: string
  title: string
  index: number
  total: number
}

type FullScreenScrollFXProps =
  | { mode: 'home'; panels: Omit<HomePanel, 'mode'>[] }
  | { mode: 'collection'; panels: Omit<CollectionPanel, 'mode'>[]; collectionLabel: string }

export default function FullScreenScrollFX(props: FullScreenScrollFXProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRefs = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const panels = panelRefs.current.filter(Boolean)
    if (panels.length === 0) return

    // Pin the container and scroll through panels
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${panels.length * 100}vh`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.2, max: 0.5 },
            ease: 'power1.inOut',
          },
        },
      })

      panels.forEach((panel, i) => {
        if (i === 0) return
        tl.fromTo(
          panel,
          { yPercent: 100 },
          { yPercent: 0, ease: 'none' },
          i - 1
        )
      })
    }, container)

    return () => ctx.revert()
  }, [])

  if (props.mode === 'home') {
    return (
      <section
        ref={containerRef}
        id="portfolio"
        style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
      >
        {props.panels.map((panel, i) => (
          <div
            key={panel.id}
            ref={(el) => { if (el) panelRefs.current[i] = el }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}
          >
            {/* Full-bleed background image */}
            <Image
              src={panel.imageSrc}
              alt={panel.label}
              fill
              style={{ objectFit: 'cover', zIndex: 0 }}
              sizes="100vw"
              priority={i === 0}
            />
            {/* Dark overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(10,8,6,0.88) 30%, rgba(10,8,6,0.25) 100%)',
                zIndex: 1,
              }}
            />
            {/* Content */}
            <div
              style={{
                position: 'relative',
                zIndex: 2,
                textAlign: 'center',
                padding: '0 2rem',
              }}
            >
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.58rem',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                  color: 'var(--color-accent)',
                  margin: '0 0 0.75rem',
                }}
              >
                {String(i + 1).padStart(2, '0')} / {String(props.panels.length).padStart(2, '0')}
              </p>
              <h2
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontStyle: 'italic',
                  fontWeight: 300,
                  fontSize: 'clamp(2.5rem, 5vw, 5rem)',
                  lineHeight: 1,
                  color: '#fff',
                  margin: '0 0 0.75rem',
                }}
              >
                {panel.label}
              </h2>
              <p
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.62rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.55)',
                  margin: '0 0 2rem',
                }}
              >
                {panel.subtitle}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem' }}>
                <Link
                  href={panel.href}
                  data-cursor="link"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.62rem',
                    letterSpacing: '0.28em',
                    textTransform: 'uppercase',
                    color: 'var(--color-accent)',
                    textDecoration: 'none',
                    borderBottom: '1px solid var(--color-accent)',
                    paddingBottom: '2px',
                  }}
                >
                  View Collection →
                </Link>
                <span
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '0.55rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  {panel.sectionCount} sections
                </span>
              </div>
            </div>

            {/* Scroll hint (first panel only) */}
            {i === 0 && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '2rem',
                  left: 0,
                  right: 0,
                  textAlign: 'center',
                  zIndex: 2,
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '0.55rem',
                  letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                ↓ Scroll to explore
              </div>
            )}
          </div>
        ))}
      </section>
    )
  }

  // mode === 'collection'
  return (
    <section
      ref={containerRef}
      style={{
        position: 'relative',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-bg)',
      }}
    >
      {props.panels.map((panel, i) => (
        <div
          key={panel.id}
          ref={(el) => { if (el) panelRefs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg)',
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          {/* Collection label */}
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.58rem',
              letterSpacing: '0.38em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              margin: '0 0 1.5rem',
            }}
          >
            {props.collectionLabel}
          </p>

          {/* Section counter */}
          <p
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.58rem',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'var(--color-muted)',
              margin: '0 0 0.75rem',
            }}
          >
            {String(panel.index + 1).padStart(2, '0')} / {String(panel.total).padStart(2, '0')}
          </p>

          {/* Section title */}
          <h2
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(3rem, 7vw, 7rem)',
              lineHeight: 1,
              color: 'var(--color-text)',
              margin: '0 0 2.5rem',
              textAlign: 'center',
              padding: '0 2rem',
            }}
          >
            {panel.title}
          </h2>

          {/* Jump link */}
          <a
            href={`#section-${panel.id}`}
            data-cursor="link"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontSize: '0.62rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--color-accent)',
              textDecoration: 'none',
              borderBottom: '1px solid var(--color-accent)',
              paddingBottom: '2px',
            }}
          >
            Enter Section →
          </a>
        </div>
      ))}

      {/* Scroll hint */}
      <div
        style={{
          position: 'absolute',
          bottom: '2rem',
          left: 0,
          right: 0,
          textAlign: 'center',
          zIndex: 10,
          fontFamily: 'Manrope, sans-serif',
          fontSize: '0.55rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color: 'var(--color-muted)',
          pointerEvents: 'none',
        }}
      >
        ↓ Scroll through sections
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Lint**

```bash
npm run lint
```

Fix any issues.

---

## Task 6: Wire FullScreenScrollFX into Portfolio (home page)

**Files:**
- Modify: `src/components/Portfolio.tsx`

Replace the entire accordion implementation with `<FullScreenScrollFX mode="home" />`. The existing `Portfolio.tsx` is a `'use client'` component — keep that directive.

- [ ] **Step 1: Rewrite `src/components/Portfolio.tsx`**

```tsx
'use client'

import { categories } from '@/data/portfolioData'
import FullScreenScrollFX from './FullScreenScrollFX'

export default function Portfolio() {
  const panels = categories.map((cat) => ({
    id: cat.id,
    label: cat.label,
    subtitle: cat.subtitle,
    imageSrc: cat.previewImages[0],
    href: `/work/${cat.id}`,
    sectionCount: cat.sections.length,
  }))

  return <FullScreenScrollFX mode="home" panels={panels} />
}
```

- [ ] **Step 2: Run dev server and visually verify home page**

```bash
npm run dev
```

- Homepage: scroll down past Hero/Marquee into the Portfolio section
- Should see full-bleed category panels stacked
- Scrolling should snap through panels (Resort → Bridal → etc.)
- Each panel shows category image, label, subtitle, "View Collection →" link
- Clicking link navigates to `/work/[slug]`

- [ ] **Step 3: Lint and commit**

```bash
npm run lint
git add src/components/Portfolio.tsx src/components/FullScreenScrollFX.tsx
git commit -m "feat(home): FullScreenScrollFX replaces accordion portfolio section"
```

---

## Task 7: Wire FullScreenScrollFX into SplitScrollCollection (collection intro)

**Files:**
- Modify: `src/components/SplitScrollCollection.tsx`

Add `<FullScreenScrollFX mode="collection" />` above the existing split-scroll layout. The collection FX is a section picker: scroll through section titles, click "Enter Section →" to jump.

- [ ] **Step 1: Import FullScreenScrollFX**

In `SplitScrollCollection.tsx`, add import:
```tsx
import FullScreenScrollFX from './FullScreenScrollFX'
```

- [ ] **Step 2: Add the intro block above the split sections**

After the page header block (the `div` with `split-page-header` class, ending before the sections map), add:

```tsx
{/* Section-picker intro — scroll through section titles before entering split layout */}
<FullScreenScrollFX
  mode="collection"
  collectionLabel={category.label}
  panels={category.sections.map((s, idx) => ({
    id: s.id,
    title: s.title,
    index: idx,
    total: category.sections.length,
  }))}
/>
```

- [ ] **Step 3: Run dev server and visually verify collection page**

Navigate to `/work/resort` (or any collection).
- Should see: back nav → page header → full-screen section picker (FullScreenScrollFX) → existing split layout below
- Scroll through section picker: sections snap one at a time
- "Enter Section →" jumps to the correct `#section-{id}` in the split layout below
- After all panels, scroll continues naturally down to split layout

- [ ] **Step 4: Lint and commit**

```bash
npm run lint
git add src/components/SplitScrollCollection.tsx
git commit -m "feat(collection): FullScreenScrollFX section-picker intro above split layout"
```

---

## Task 8: Production build check

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: clean build, no errors. The `work/[slug]` pages must all be present in build output. If they're missing, check that `generateStaticParams` still works (it reads `categories` — no changes were made to `portfolioData.ts`).

- [ ] **Step 2: Lint final pass**

```bash
npm run lint
```

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: production build cleanup after portfolio effects"
```

---

## Watch-outs

- **GSAP `registerPlugin`**: GSAPProvider already registers ScrollTrigger globally. The `gsap.registerPlugin(ScrollTrigger)` call in `FullScreenScrollFX.tsx` is safe to call multiple times (idempotent) but can be removed if it causes issues — ScrollTrigger is already registered.
- **`'use client'` on all new components**: All three new files must have `'use client'` at the top.
- **Carousel GlowCard `clipPath`**: The original inner div had `clipPath: 'inset(0 round 4px)'` — GlowCard must carry those same styles on its root element so the card shape is maintained.
- **GlowingShadow z-index**: The bloom div is `zIndex: 0`, the rule is `zIndex: 1`. The `.split-story` content sits above both. Confirm story content has no z-index issues.
- **FullScreenScrollFX home — `id="portfolio"`**: The `Portfolio` component renders `<section id="portfolio">`. This ID is linked from Navbar and the Hero "View Work" button. Keep it.
- **FullScreenScrollFX snap on mobile**: `ScrollTrigger.snap` can be janky on mobile touch. If mobile is broken, disable snap on touch devices by checking `window.matchMedia('(hover: none)').matches` inside the `useEffect`.
- **Next.js pinned to 15** — do not upgrade.
