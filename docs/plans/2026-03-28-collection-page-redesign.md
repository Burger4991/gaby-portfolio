# Collection Page Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Redesign collection pages — remove background images for theme gradients, standardize section dimensions, add LiquidGlass to all nav/cards, fix carousel scroll axis, and add image lightbox modal.

**Architecture:** Modify FullScreenScrollFX to support gradient backgrounds instead of images. Restructure CollectionPage section layout for fixed dimensions. Create new ImageLightbox component. Update CollectionCarousel to horizontal-scroll-only with click-to-enlarge.

**Tech Stack:** React, Framer Motion (carousel), GSAP (scroll FX), CSS custom properties (theme tokens)

**Source brainstorm:** `docs/brainstorm/2026-03-28-collection-page-redesign.md`

---

### Task 1: Remove GlowingShadow from CollectionPage

**Files:**
- Modify: `src/components/CollectionPage.tsx:1-178`

**Step 1: Remove GlowingShadow import and usage**

Remove the import of `GlowingShadow` (line 8) and the divider JSX block (lines 124-126):

```tsx
// REMOVE this import:
import GlowingShadow from './GlowingShadow'

// REMOVE this JSX block:
{/* Glowing divider between text and carousel */}
<div style={{ position: 'absolute', left: '40%', top: 0, bottom: 0, zIndex: 2 }}>
  <GlowingShadow />
</div>
```

**Step 2: Verify dev server renders without divider**

Run: `npm run dev` — check a collection page, confirm no divider visible.

**Step 3: Commit**

```bash
git add src/components/CollectionPage.tsx
git commit -m "refactor: remove GlowingShadow divider from collection pages"
```

---

### Task 2: Replace background images with theme gradients in FullScreenScrollFX

**Files:**
- Modify: `src/components/FullScreenScrollFX.tsx`

**Step 1: Add gradient background support to Section type**

Update the `Section` type to accept an optional `gradient` string. When `gradient` is provided, render a div with that CSS gradient instead of an `<img>`.

Change the Section type (line 17-23):

```tsx
type Section = {
  id?: string
  background: string
  gradient?: string  // CSS gradient string — if provided, replaces background image
  leftLabel?: ReactNode
  title: string | ReactNode
  rightLabel?: ReactNode
  content?: ReactNode
}
```

**Step 2: Update the background rendering block**

In the `.fx-bgs` section (lines 299-310), conditionally render gradient div or image:

```tsx
{sections.map((s, i) => (
  <div className="fx-bg" key={s.id ?? i}>
    {s.gradient ? (
      <div
        ref={(el) => { if (el) bgRefs.current[i] = el as unknown as HTMLImageElement }}
        className="fx-bg-gradient"
        style={{ background: s.gradient }}
      />
    ) : (
      <img
        ref={(el) => { if (el) bgRefs.current[i] = el }}
        src={s.background}
        alt=""
        className="fx-bg-img"
      />
    )}
    <div className="fx-bg-overlay" />
  </div>
))}
```

**Step 3: Add CSS for gradient backgrounds**

Add to the style block after `.fx-bg-img`:

```css
.fx-bg-gradient { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; will-change: opacity; }
```

**Step 4: Verify — homepage should still use images, collection pages will use gradients after Task 3**

Run: `npm run dev` — homepage unchanged, no errors.

**Step 5: Commit**

```bash
git add src/components/FullScreenScrollFX.tsx
git commit -m "feat: support gradient backgrounds in FullScreenScrollFX"
```

---

### Task 3: CollectionPage — gradient backgrounds + standardized dimensions

**Files:**
- Modify: `src/components/CollectionPage.tsx`

**Step 1: Generate per-section gradients from theme tokens**

Replace `background: section.images[0]?.src ?? ''` with computed gradients. Each section gets a different angle for visual variety:

```tsx
const GRADIENT_ANGLES = [135, 160, 200, 170, 145, 190]

const sections = category.sections.map((section, i) => {
  const angle = GRADIENT_ANGLES[i % GRADIENT_ANGLES.length]
  return {
    id: section.id,
    background: '',
    gradient: `linear-gradient(${angle}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`,
    leftLabel: (/* updated in Task 5 */),
    title: section.title,
    rightLabel: (/* stays */),
    content: (/* updated below */),
  }
})
```

**Step 2: Standardize section content dimensions**

Lock the text card and carousel to fixed heights. Replace the content JSX with standardized dimensions:

```tsx
content: (
  <div
    style={{
      position: 'absolute',
      inset: 0,
      zIndex: 10,
      display: 'grid',
      gridTemplateColumns: '40% 60%',
      height: '100%',
    }}
    className="collection-split"
  >
    {/* 40% — Text card */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem 4rem 3rem',
      }}
    >
      <SpotlightCard
        style={{
          padding: '2.5rem',
          maxWidth: '420px',
          width: '100%',
          height: '380px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* ... card content stays same ... */}
      </SpotlightCard>
    </div>

    {/* 60% — Carousel */}
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 3rem 4rem 2rem',
        height: '100%',
      }}
    >
      <CollectionCarousel images={section.images} sectionTitle={section.title} />
    </div>
  </div>
),
```

Key changes:
- SpotlightCard gets `height: '380px'` for fixed card size
- No GlowingShadow divider
- `gradient` prop instead of `background` image

**Step 3: Verify — collection pages show gradient backgrounds, fixed-height cards**

Run: `npm run dev` — navigate to a collection page, confirm gradient bg and consistent card heights.

**Step 4: Commit**

```bash
git add src/components/CollectionPage.tsx
git commit -m "feat: gradient backgrounds + standardized dimensions on collection pages"
```

---

### Task 4: Carousel — horizontal scroll only

**Files:**
- Modify: `src/components/CollectionCarousel.tsx:44-96`

**Step 1: Update wheel handler to horizontal-only**

Change `handleWheel` to only respond to `deltaX` (horizontal scroll), and let vertical scroll pass through:

```tsx
const handleWheel = (e: WheelEvent) => {
  // Only intercept horizontal scroll — let vertical pass through to section nav
  if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return
  e.preventDefault()
  e.stopPropagation()
  inertiaAnimation.current?.stop()
  rotation.set(rotation.get() - e.deltaX * 0.15)
}
```

**Step 2: Update the hint text**

In the `CollectionCarousel` default export (line 232), change:

```tsx
// FROM:
scroll to rotate
// TO:
swipe to rotate
```

**Step 3: Verify — vertical scroll navigates between sections, horizontal scroll rotates carousel**

Run: `npm run dev` — on a collection page, vertical scroll should change sections, horizontal trackpad swipe should rotate carousel.

**Step 4: Commit**

```bash
git add src/components/CollectionCarousel.tsx
git commit -m "fix: carousel responds to horizontal scroll only, vertical passes through"
```

---

### Task 5: LiquidGlass on nav items — section name pills

**Files:**
- Modify: `src/components/CollectionPage.tsx`
- Modify: `src/components/FullScreenScrollFX.tsx`

**Step 1: Add LiquidGlass active variant support**

Add an `active` prop to LiquidGlass for stronger glow. In `src/components/LiquidGlass.tsx`, add:

```tsx
type LiquidGlassProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode
  as?: 'button' | 'span' | 'a' | 'div'
  className?: string
  style?: React.CSSProperties
  active?: boolean  // stronger glow when active
  // ... rest of existing props
}
```

When `active` is true, apply stronger border and boxShadow in the default (non-hover) state:

```tsx
border: `1px solid color-mix(in srgb, var(--color-accent) ${active ? '50%' : '25%'}, transparent)`,
boxShadow: `
  inset 0 1px 0 0 color-mix(in srgb, white ${active ? '12%' : '8%'}, transparent),
  0 0 ${active ? '20px' : '12px'} 0 color-mix(in srgb, var(--color-accent) ${active ? '25%' : '10%'}, transparent)
`,
```

**Step 2: Update CollectionPage left nav — section name pills**

Replace the `leftLabel` from section numbers to section name pills:

```tsx
leftLabel: (
  <LiquidGlass style={{
    fontSize: 'var(--text-label-sm)',
    letterSpacing: 'var(--tracking-normal)',
    whiteSpace: 'nowrap',
  }}>
    {section.title}
  </LiquidGlass>
),
```

**Step 3: Update CollectionPage right nav — LiquidGlass pills**

```tsx
rightLabel: (
  <LiquidGlass style={{
    fontSize: 'var(--text-label-xs)',
    letterSpacing: 'var(--tracking-normal)',
  }}>
    {section.pills[0] ?? ''}
  </LiquidGlass>
),
```

**Step 4: Update FullScreenScrollFX to pass active state to nav items**

In the left/right nav item rendering (lines 337-349, 373-389), the items already have an `active` class. We need to pass the active state down so LiquidGlass pills can use `active` prop.

Add a data attribute to track active state:

```tsx
// Left items
<div
  key={`L-${s.id ?? i}`}
  className={`fx-item fx-left-item ${i === index ? 'active' : ''}`}
  ref={(el) => { if (el) leftItemRefs.current[i] = el }}
  onClick={() => goTo(i)}
  role="button"
  tabIndex={0}
  aria-pressed={i === index}
  data-active={i === index ? 'true' : 'false'}
>
  {s.leftLabel}
</div>
```

Then in CollectionPage, we'll handle the active glow via CSS on the parent `.fx-left-item.active` which already gets `opacity: 1` — the LiquidGlass stronger glow comes from the parent's active styling propagating down.

Actually, simpler: since FullScreenScrollFX already animates opacity on nav items (active=1, inactive=0.35), LiquidGlass will naturally look more prominent when active. For the extra glow, we can use CSS:

Add to FullScreenScrollFX styles:
```css
.fx-left-item.active .liquid-glass-active,
.fx-right-item.active .liquid-glass-active { /* handled by opacity animation */ }
```

**Step 5: Verify — nav items show as LiquidGlass pills with section names**

Run: `npm run dev` — collection pages should show section name pills in left nav, LiquidGlass styled.

**Step 6: Commit**

```bash
git add src/components/LiquidGlass.tsx src/components/CollectionPage.tsx src/components/FullScreenScrollFX.tsx
git commit -m "feat: LiquidGlass nav pills with section names on collection pages"
```

---

### Task 6: LiquidGlass on SpotlightCard text cards

**Files:**
- Modify: `src/components/CollectionPage.tsx`

**Step 1: Wrap SpotlightCard with LiquidGlass styling**

Add LiquidGlass-style backdrop blur and border glow to the SpotlightCard wrapper. Since SpotlightCard already has its own border/bg, we merge the LiquidGlass aesthetic into its inline styles:

```tsx
<SpotlightCard
  style={{
    padding: '2.5rem',
    maxWidth: '420px',
    width: '100%',
    height: '380px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    overflow: 'hidden',
    backdropFilter: 'blur(12px) saturate(1.4)',
    WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
    border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
    boxShadow: `
      inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent),
      0 0 12px 0 color-mix(in srgb, var(--color-accent) 10%, transparent)
    `,
    background: 'color-mix(in srgb, var(--color-card-bg) 70%, transparent)',
  }}
>
```

**Step 2: Verify — text cards have frosted glass look**

Run: `npm run dev` — collection page text cards should show LiquidGlass frosted effect.

**Step 3: Commit**

```bash
git add src/components/CollectionPage.tsx
git commit -m "feat: LiquidGlass styling on collection text cards"
```

---

### Task 7: Image Lightbox Modal

**Files:**
- Create: `src/components/ImageLightbox.tsx`
- Modify: `src/components/CollectionCarousel.tsx`

**Step 1: Create ImageLightbox component**

```tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import type { SectionImage } from '@/data/portfolioData'
import SpotlightCard from './SpotlightCard'

type ImageLightboxProps = {
  images: SectionImage[]
  initialIndex: number
  onClose: () => void
}

export default function ImageLightbox({ images, initialIndex, onClose }: ImageLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const image = images[index]

  const prev = useCallback(() => setIndex((i) => (i - 1 + images.length) % images.length), [images.length])
  const next = useCallback(() => setIndex((i) => (i + 1) % images.length), [images.length])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, prev, next])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', maxWidth: '900px', width: '100%' }}
      >
        {/* Prev arrow */}
        <button
          onClick={prev}
          style={{
            background: 'none', border: 'none', color: 'var(--color-overlay-text)',
            fontSize: '2rem', cursor: 'pointer', padding: '1rem', flexShrink: 0,
          }}
          aria-label="Previous image"
        >
          &#8249;
        </button>

        {/* Image card */}
        <SpotlightCard
          style={{
            flex: 1,
            padding: '1rem',
            backdropFilter: 'blur(12px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(12px) saturate(1.4)',
            border: '1px solid color-mix(in srgb, var(--color-accent) 25%, transparent)',
            background: 'color-mix(in srgb, var(--color-card-bg) 70%, transparent)',
            boxShadow: `
              inset 0 1px 0 0 color-mix(in srgb, white 8%, transparent),
              0 0 20px 0 color-mix(in srgb, var(--color-accent) 15%, transparent)
            `,
          }}
        >
          <div style={{ position: 'relative', width: '100%', aspectRatio: '4/5', borderRadius: '8px', overflow: 'hidden' }}>
            <Image src={image.src} alt={image.caption ?? ''} fill style={{ objectFit: 'cover' }} sizes="(max-width: 900px) 90vw, 800px" />
          </div>
          {(image.caption || image.stage) && (
            <div style={{
              padding: '0.75rem 0.5rem 0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-sm)',
                color: 'var(--color-overlay-muted)',
                textTransform: 'uppercase',
                letterSpacing: 'var(--tracking-tight)',
              }}>
                {image.caption}
              </span>
              <span style={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: 'var(--text-label-xs)',
                color: 'var(--color-overlay-dim)',
                letterSpacing: 'var(--tracking-normal)',
              }}>
                {index + 1} / {images.length}
              </span>
            </div>
          )}
        </SpotlightCard>

        {/* Next arrow */}
        <button
          onClick={next}
          style={{
            background: 'none', border: 'none', color: 'var(--color-overlay-text)',
            fontSize: '2rem', cursor: 'pointer', padding: '1rem', flexShrink: 0,
          }}
          aria-label="Next image"
        >
          &#8250;
        </button>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'absolute', top: '1.5rem', right: '1.5rem',
          background: 'none', border: 'none', color: 'var(--color-overlay-text)',
          fontSize: '1.5rem', cursor: 'pointer', padding: '0.5rem',
        }}
        aria-label="Close lightbox"
      >
        &#10005;
      </button>
    </div>
  )
}
```

**Step 2: Add click-to-enlarge to CollectionCarousel**

In `CollectionCarousel.tsx`, add state for lightbox and click handler on carousel images.

Add to Carousel component — wrap each image div with an onClick:

```tsx
// Add state to CollectionCarousel (not inner Carousel)
const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

// Pass onClick to Carousel
<Carousel
  images={images}
  sectionTitle={sectionTitle}
  onActiveIndexChange={setActiveIndex}
  onImageClick={(i: number) => setLightboxIndex(i)}
/>

// Add lightbox at end
{lightboxIndex !== null && (
  <ImageLightbox
    images={images}
    initialIndex={lightboxIndex}
    onClose={() => setLightboxIndex(null)}
  />
)}
```

In the inner `Carousel` component, add `onImageClick` prop and attach onClick to each image face:

```tsx
<div
  key={i}
  style={{ /* existing face styles */ }}
  onClick={() => onImageClick(i)}
  style={{ cursor: 'pointer', /* ...existing */ }}
>
```

**Step 3: Verify — click carousel image, lightbox opens with arrows**

Run: `npm run dev` — click an image in the carousel, lightbox should open. Arrow keys and buttons should navigate. Click outside or X to close.

**Step 4: Commit**

```bash
git add src/components/ImageLightbox.tsx src/components/CollectionCarousel.tsx
git commit -m "feat: image lightbox modal with SpotlightCard styling and arrow navigation"
```

---

### Task 8: Lint + final verify

**Step 1: Run lint**

```bash
npm run lint
```

Fix any errors.

**Step 2: Run build**

```bash
npm run build
```

Verify no build errors.

**Step 3: Visual check all 4 themes**

Run: `npm run dev` — cycle through Dark Luxury, Latte, Frappe, Mocha on a collection page. Verify:
- Gradient backgrounds adapt to each theme
- LiquidGlass pills are visible on all themes
- Lightbox works on all themes
- Carousel horizontal scroll only

**Step 4: Commit any lint fixes**

```bash
git commit -m "chore: lint fixes for collection page redesign"
```

---

## Summary of changes

| Task | What | Files |
|------|------|-------|
| 1 | Remove GlowingShadow divider | CollectionPage.tsx |
| 2 | Gradient background support in FullScreenScrollFX | FullScreenScrollFX.tsx |
| 3 | Gradient bgs + standardized dimensions | CollectionPage.tsx |
| 4 | Horizontal-scroll-only carousel | CollectionCarousel.tsx |
| 5 | LiquidGlass nav pills + section names | LiquidGlass.tsx, CollectionPage.tsx, FullScreenScrollFX.tsx |
| 6 | LiquidGlass on text cards | CollectionPage.tsx |
| 7 | Image lightbox modal | NEW ImageLightbox.tsx, CollectionCarousel.tsx |
| 8 | Lint + final verify | All |
