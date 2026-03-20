# Collection Carousel + Nav Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace split-scroll collection pages with a compact split + 3D carousel layout, and expand the navbar to offer direct navigation to all collections.

**Architecture:** Three focused tasks in dependency order — Navbar first (independent), CollectionCarousel second (new component, adapts existing ThreeDCarousel logic), SplitScrollCollection third (consumes CollectionCarousel, adds section jump nav, removes 100vh height). No new dependencies. `portfolioData.ts` is untouched.

**Tech Stack:** Next.js 15 App Router, Framer Motion (already installed), TypeScript, inline styles (project convention — no Tailwind in components).

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/components/Navbar.tsx` | Logo → `/`, links → absolute hrefs, add collection sub-links derived from `categories` |
| Create | `src/components/CollectionCarousel.tsx` | 3D drag carousel for `SectionImage[]` — no lightbox, shows caption below active card |
| Modify | `src/components/SplitScrollCollection.tsx` | Remove 100vh, add section anchor IDs, add jump nav with IntersectionObserver, use CollectionCarousel |

---

## Task 1: Fix Navbar — Logo, hrefs, collection sub-links

**Files:**
- Modify: `src/components/Navbar.tsx`

**Context:** The logo currently has `href="#hero"` which is a dead link on `/work/[slug]` pages. The `links` array uses fragment-only hrefs (`#portfolio`) which also break on collection pages. The full-screen overlay menu needs collection shortcuts derived dynamically from the `categories` array so they stay in sync if the data changes.

- [ ] **Step 1: Update logo href and aria-label**

In `src/components/Navbar.tsx`, find the logo `<a>` element (line ~37) and change:

```tsx
// BEFORE
href="#hero"
aria-label="Gabriela Gamargo — back to top"

// AFTER
href="/"
aria-label="Gabriela Gamargo — home"
```

- [ ] **Step 2: Fix links array hrefs to absolute paths**

Find the `links` array (line ~8) and update all hrefs:

```ts
const links = [
  { label: 'Work', href: '/#portfolio' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]
```

- [ ] **Step 3: Import categories and derive collection sub-links**

Add this import at the top of the file (after existing imports):

```ts
import Link from 'next/link'
import { categories } from '@/data/portfolioData'
```

Inside the component body (before the return), add:

```ts
const collectionLinks = categories.map((c) => ({
  label: c.label,
  href: `/work/${c.id}`,
}))
```

- [ ] **Step 4: Add collection sub-links to the overlay menu**

The current nav block uses `links.map(...)` in a single expression — you cannot splice into the middle of a map. Replace the entire `<nav>` inner block with explicit elements:

```tsx
{/* Replace the links.map(...) block inside the <nav> with: */}
<motion.a
  key="Work" href="/#portfolio" onClick={() => setOpen(false)}
  className="block cursor-pointer"
  style={{ fontFamily: 'Cormorant Garamond, serif', color: 'rgba(255,255,255,0.85)', fontSize: 'clamp(3rem, 10vw, 6rem)', fontWeight: 300, fontStyle: 'italic', lineHeight: 1.1 }}
  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--color-accent)' }}
  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)' }}
  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' }}
>
  Work
</motion.a>

{/* Collection sub-links — inserted here, between Work and About */}
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

{['About', 'Contact'].map(({ label, href } = links.find(l => l.label === 'About' || l.label === 'Contact') as typeof links[0], i) => (
  <motion.a
    key={label} href={href} onClick={() => setOpen(false)}
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
```

> **Simpler alternative:** Keep `links.map(...)` for About/Contact but render Work separately above it. Either approach is valid — just don't render Work twice.

- [ ] **Step 5: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 6: Visual check**

```bash
npm run dev
```

- Open `http://localhost:3000` — click the hamburger. Verify: Work link present, 4 gold collection sub-links below it, About, Contact.
- Navigate to `/work/resort` — click the logo. Verify: goes to `/` (home).
- From `/work/resort`, open hamburger, click "Resort & Activewear" sub-link. Verify: stays on `/work/resort` (or navigates correctly if on a different page).

- [ ] **Step 7: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat(nav): logo routes home, absolute hrefs, collection sub-links from categories"
```

---

## Task 2: Create CollectionCarousel component

**Files:**
- Create: `src/components/CollectionCarousel.tsx`
- Reference: `src/components/ThreeDCarousel.tsx` (copy drag mechanics from here)

**Context:** `ThreeDCarousel.tsx` has the complete 3D cylinder drag-with-inertia implementation. `CollectionCarousel` strips out the lightbox overlay and adapts for `SectionImage[]` (from `portfolioData.ts`). Key changes: no `activeItem` state, no `AnimatePresence`, no `layoutId`, card height 280px, face width 200px. Adds caption + stage badge display below the carousel showing the frontmost card.

**Active face index formula** (handles unbounded rotation and negative JS modulo). Round *before* taking modulo — applying `%` inside `Math.round` causes index flicker at wrap boundaries:
```ts
const faceAngle = 360 / images.length
const rawIndex = Math.round(-v / faceAngle)           // round first
const activeIndex = ((rawIndex % faceCount) + faceCount) % faceCount  // then normalize
```

- [ ] **Step 1: Create the file with types and constants**

Create `src/components/CollectionCarousel.tsx`:

```tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import type { SectionImage } from '@/data/portfolioData'

const CARD_HEIGHT = 280
const FACE_WIDTH = 200

type CollectionCarouselProps = {
  images: SectionImage[]
  sectionTitle: string
}
```

- [ ] **Step 2: Add the inner Carousel component**

After the type definitions, add the `Carousel` component. Copy the pointer handler logic from `ThreeDCarousel.tsx` exactly — only remove the `isCarouselActive` guard since there's no overlay to deactivate it:

```tsx
function Carousel({ images, sectionTitle, activeIndex, onActiveIndexChange }: {
  images: SectionImage[]
  sectionTitle: string
  activeIndex: number
  onActiveIndexChange: (i: number) => void
}) {
  const faceCount = images.length
  const cylinderWidth = faceCount * FACE_WIDTH
  const faceWidth = cylinderWidth / faceCount
  const radius = cylinderWidth / (2 * Math.PI)
  const rotation = useMotionValue(0)
  const transform = useTransform(rotation, (v) => `rotate3d(0, 1, 0, ${v}deg)`)

  const isDragging = useRef(false)
  const lastX = useRef(0)
  const velocityX = useRef(0)
  const lastTime = useRef(0)
  const inertiaAnimation = useRef<ReturnType<typeof animate> | null>(null)

  // Update active index on rotation change
  useEffect(() => {
    const unsubscribe = rotation.on('change', (v) => {
      const faceAngle = 360 / faceCount
      const rawIndex = Math.round(-v / faceAngle)                        // round first
      const normalized = ((rawIndex % faceCount) + faceCount) % faceCount // then normalize
      onActiveIndexChange(normalized)
    })
    return unsubscribe
  }, [rotation, faceCount, onActiveIndexChange])

  const handlePointerDown = (e: React.PointerEvent) => {
    inertiaAnimation.current?.stop()
    isDragging.current = true
    lastX.current = e.clientX
    lastTime.current = performance.now()
    velocityX.current = 0
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const now = performance.now()
    const dt = now - lastTime.current
    const dx = e.clientX - lastX.current
    velocityX.current = dt > 0 ? dx / dt : 0
    lastX.current = e.clientX
    lastTime.current = now
    rotation.set(rotation.get() + dx * 0.3)
  }

  const handlePointerUp = () => {
    if (!isDragging.current) return
    isDragging.current = false
    inertiaAnimation.current = animate(rotation, rotation.get() + velocityX.current * 60, {
      type: 'spring',
      stiffness: 100,
      damping: 30,
      mass: 0.1,
    })
  }

  return (
    <div
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        width: '100%',
        height: CARD_HEIGHT + 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          transform,
          width: cylinderWidth,
          height: CARD_HEIGHT,
          transformStyle: 'preserve-3d',
          cursor: 'grab',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          touchAction: 'none',
          userSelect: 'none',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: faceWidth,
              height: CARD_HEIGHT,
              transform: `rotateY(${i * (360 / faceCount)}deg) translateZ(${radius}px)`,
              padding: '0 6px',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 4,
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--color-border)',
              }}
            >
              <Image
                src={img.src}
                alt={img.caption ?? sectionTitle}
                fill
                style={{ objectFit: 'cover' }}
                sizes="200px"
              />
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  )
}
```

- [ ] **Step 3: Add the default export wrapper with caption display**

```tsx
export default function CollectionCarousel({ images, sectionTitle }: CollectionCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Carousel
        images={images}
        sectionTitle={sectionTitle}
        activeIndex={activeIndex}
        onActiveIndexChange={setActiveIndex}
      />
      {/* Caption row */}
      {activeImage && (activeImage.caption || activeImage.stage) && (
        <div
          style={{
            padding: '0.6rem 1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontFamily: 'Manrope, sans-serif',
            fontSize: '0.62rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--color-muted)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          <span>{activeImage.caption}</span>
          {activeImage.stage && (
            <span
              style={{
                padding: '0.2rem 0.5rem',
                border: '1px solid var(--color-border)',
                fontSize: '0.55rem',
                letterSpacing: '0.15em',
                color: 'var(--color-accent)',
              }}
            >
              {activeImage.stage}
            </span>
          )}
        </div>
      )}
      <div
        style={{
          textAlign: 'center',
          fontFamily: 'Manrope, sans-serif',
          fontSize: '0.52rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-border)',
          paddingBottom: '0.5rem',
        }}
      >
        drag to rotate
      </div>
    </div>
  )
}
```

- [ ] **Step 4: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 5: Smoke check in dev**

```bash
npm run dev
```

The component isn't wired in yet — just verify the build starts clean. TypeScript success is the test here.

- [ ] **Step 6: Commit**

```bash
git add src/components/CollectionCarousel.tsx
git commit -m "feat(carousel): CollectionCarousel — 3D drag carousel for SectionImage[], caption below active card"
```

---

## Task 3: Update SplitScrollCollection — compact layout, jump nav, carousel

**Files:**
- Modify: `src/components/SplitScrollCollection.tsx`

**Context:** Three changes: (1) remove `minHeight: 100vh` from section blocks + add anchor `id`, (2) change left panel to `height: auto` + `alignSelf: flex-start`, (3) replace scrollable image stack with `<CollectionCarousel />`, (4) add section jump nav with `IntersectionObserver` below the pills. The component is already `'use client'` so hooks are fine.

- [ ] **Step 1: Add imports, remove unused Image import**

At the top of `src/components/SplitScrollCollection.tsx`:
- Add `import { useState, useEffect } from 'react'` (new line — file has no React import currently)
- Add `import CollectionCarousel from './CollectionCarousel'`
- **Remove** `import Image from 'next/image'` — it will be unused after Step 6 replaces the image stack. Remove it now to keep the diff clean. `Link` stays (used by back nav).

- [ ] **Step 2: Add activeSection state and IntersectionObserver**

Inside the component body, before the return statement, add:

```tsx
const [activeSection, setActiveSection] = useState(category.sections[0]?.id ?? '')

useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id.replace('section-', ''))
        }
      })
    },
    {
      threshold: 0.4,
      rootMargin: '-4rem 0px 0px 0px',
    }
  )
  category.sections.forEach((s) => {
    const el = document.getElementById(`section-${s.id}`)
    if (el) observer.observe(el)
  })
  return () => observer.disconnect()
}, [category.sections])
```

- [ ] **Step 3: Update section block — remove minHeight, add id**

Find the section block `<div>` (the one with `key={section.id}` and `className="split-collection"`). Change:

```tsx
// BEFORE
<div
  key={section.id}
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    minHeight: '100vh',
    borderBottom: '1px solid var(--color-border)',
  }}
  className="split-collection"
>

// AFTER
<div
  key={section.id}
  id={`section-${section.id}`}
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderBottom: '1px solid var(--color-border)',
  }}
  className="split-collection"
>
```

- [ ] **Step 4: Update left panel sticky height**

Find the left panel `<div>` with `className="split-story"`. Change `height` and add `alignSelf`:

```tsx
// BEFORE
style={{
  position: 'sticky',
  top: '4rem',
  height: 'calc(100vh - 4rem)',
  padding: '4rem',
  ...
}}

// AFTER
style={{
  position: 'sticky',
  top: '4rem',
  height: 'auto',
  alignSelf: 'flex-start',
  padding: '3rem 2.5rem',
  ...
}}
```

- [ ] **Step 5: Add section jump nav below the pills**

After the pills `<div>`, add:

```tsx
{/* Section jump nav */}
<div
  style={{
    borderTop: '1px solid var(--color-border)',
    paddingTop: '1rem',
    marginTop: '0.25rem',
  }}
>
  <p
    style={{
      fontFamily: 'Manrope, sans-serif',
      fontSize: '0.52rem',
      letterSpacing: '0.3em',
      textTransform: 'uppercase',
      color: 'var(--color-border)',
      margin: '0 0 0.5rem',
    }}
  >
    Sections
  </p>
  {category.sections.map((s, idx) => (
    <a
      key={s.id}
      href={`#section-${s.id}`}
      style={{
        display: 'block',
        fontFamily: 'Manrope, sans-serif',
        fontSize: '0.6rem',
        letterSpacing: '0.1em',
        padding: '0.2rem 0',
        color: activeSection === s.id ? 'var(--color-accent)' : 'var(--color-border)',
        textDecoration: 'none',
        transition: 'color 0.2s ease',
      }}
    >
      {String(idx + 1).padStart(2, '0')}{'  '}{s.title}
    </a>
  ))}
</div>
```

- [ ] **Step 6: Replace image stack with CollectionCarousel**

Find the right panel `<div>` (the one with `padding: '4rem 3rem'` and `section.images.map(...)`). Replace the entire right panel with:

```tsx
{/* Right: 3D carousel */}
<div
  style={{
    padding: '3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }}
>
  <CollectionCarousel images={section.images} sectionTitle={section.title} />
</div>
```

- [ ] **Step 7: Update mobile style block**

Find the `<style>` tag at the bottom of the component. Update the `.split-story` rule to clear sticky positioning on mobile:

```css
@media (max-width: 768px) {
  .split-collection {
    grid-template-columns: 1fr !important;
  }
  .split-story {
    position: static !important;
    align-self: auto !important;
    height: auto !important;
    border-right: none !important;
    border-bottom: 1px solid var(--color-border);
    padding: 2.5rem 1.5rem !important;
  }
}
```

- [ ] **Step 8: TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 9: Full visual check**

```bash
npm run dev
```

Check each route:
- `http://localhost:3000` — home page accordion unchanged ✓
- `http://localhost:3000/work/resort` — 7 sections stacked, each with sticky left panel (section info + jump nav) and 3D carousel right. Drag the carousel. Verify caption updates as you rotate.
- Click a section number in the jump nav — verify it scrolls to that section and highlights gold.
- Check `/work/cutsew`, `/work/bridal`, `/work/illustrations` — same structure.
- Resize to mobile (375px) — sections stack vertically, left panel is static.

- [ ] **Step 10: Build check**

```bash
npm run build
```

Expected: clean build, all 7 static pages.

- [ ] **Step 11: Commit**

```bash
git add src/components/SplitScrollCollection.tsx
git commit -m "feat(collections): compact split layout, section jump nav, 3D carousel per section"
```

---

## Final Check

After all three tasks:

```bash
npm run build && git log --oneline -5
```

Expected commits:
```
feat(collections): compact split layout, section jump nav, 3D carousel per section
feat(carousel): CollectionCarousel — 3D drag carousel for SectionImage[], caption below active card
feat(nav): logo routes home, absolute hrefs, collection sub-links from categories
```
