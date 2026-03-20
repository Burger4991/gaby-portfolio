# Collection Carousel + Nav Design Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace split-scroll collection pages with a compact split + 3D carousel layout, and expand the navbar to offer direct navigation to all collections.

**Architecture:** Two files change — `Navbar.tsx` (logo fix + menu expansion) and `SplitScrollCollection.tsx` (swap scrolling image stack for 3D carousel). A new `CollectionCarousel.tsx` component adapts the existing 3D carousel for `SectionImage[]`. The `portfolioData.ts` types and data are untouched.

**Tech Stack:** Next.js App Router, Framer Motion (existing in Navbar), TypeScript. No new dependencies.

---

## What's Changing and Why

**Feedback:** The split-scroll collection pages had too much vertical scrolling — resort alone has 7 sections × 100vh = ~5600px of scroll. The 3D carousel keeps the drama and interactivity while dramatically reducing scroll depth (each section is ~450px, so 7 sections ≈ 3150px — 44% less).

**Nav feedback:** The logo (`href="#hero"`) does nothing on collection pages. The hamburger menu only shows Work/About/Contact with no way to jump directly to a specific collection.

---

## 1. Navbar Changes

**File:** `src/components/Navbar.tsx`

### Logo fix
Change logo `href` from `"#hero"` to `"/"` so it always routes home from any page (including `/work/[slug]`). Also update the `aria-label` from `"Gabriela Gamargo — back to top"` to `"Gabriela Gamargo — home"` since it now navigates home, not just to the top.

### links array — fix hrefs for cross-page use
Change the `links` array hrefs to use absolute paths so they work correctly from collection pages:

```ts
const links = [
  { label: 'Work', href: '/#portfolio' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]
```

### Collection sub-links — derive from `categories`
Import `categories` from `@/data/portfolioData` and derive sub-links dynamically so they stay in sync if categories change:

```ts
import { categories } from '@/data/portfolioData'

// Inside the component, derive sub-links:
const collectionLinks = categories.map((c) => ({
  label: c.label,
  href: `/work/${c.id}`,
}))
```

Render these below the Work link in the full-screen overlay, as a flex row of small-caps gold links:

```tsx
{/* Below the Work <motion.a> */}
<motion.div
  style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '-0.5rem', marginBottom: '0.5rem' }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3, delay: 0.32 }}
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
        textTransform: 'uppercase',
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
```

---

## 2. CollectionCarousel Component

**File:** `src/components/CollectionCarousel.tsx` (new)

A slimmed-down adaptation of `ThreeDCarousel.tsx` for `SectionImage[]`. Key differences:
- No expand-to-lightbox overlay — no `activeItem` state, no `AnimatePresence`, no `layoutId`
- Accepts `images: SectionImage[]` and `sectionTitle: string`
- Same drag-to-rotate cylinder mechanics (pointer events, spring inertia) — copy directly from `ThreeDCarousel.tsx`
- Card height: `280px` (shorter than original `320px`)
- Card width: `200px` per face

```ts
import type { SectionImage } from '@/data/portfolioData'

type CollectionCarouselProps = {
  images: SectionImage[]
  sectionTitle: string
}
```

### Active face index (caption display)

Show the caption and stage badge of the card currently facing front. Calculate the active index from the unbounded rotation motion value using this exact formula to handle negative values and both rotation directions correctly:

```ts
const faceAngle = 360 / images.length
const rawIndex = Math.round((-rotation.get() / faceAngle) % images.length)
const activeIndex = ((rawIndex % images.length) + images.length) % images.length
```

- **Negate rotation** because rotating the cylinder right (`+dx`) moves faces away from front — index increases in the negative rotation direction
- **Double modulo + add length** to normalize negative JS `%` results to a positive range `[0, images.length)`
- Subscribe to rotation changes via `rotation.on('change', ...)` inside a `useEffect` to update a `activeIndex` state reactively

Display caption and stage below the carousel:
```tsx
<div style={{ textAlign: 'center', padding: '0.75rem 1rem', ... }}>
  <span>{images[activeIndex]?.caption}</span>
  {images[activeIndex]?.stage && <span>{images[activeIndex].stage}</span>}
</div>
```

---

## 3. SplitScrollCollection Changes

**File:** `src/components/SplitScrollCollection.tsx`

### Section block: remove 100vh min-height, add anchor id
Each section block:
- Remove `minHeight: '100vh'`
- Add `` id={`section-${section.id}`} `` so jump nav anchor links work

```tsx
<div
  key={section.id}
  id={`section-${section.id}`}
  style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    borderBottom: '1px solid var(--color-border)',
    // no minHeight
  }}
  className="split-collection"
>
```

### Right panel: swap image stack for CollectionCarousel
Replace `section.images.map(...)` with:

```tsx
import CollectionCarousel from './CollectionCarousel'

// In right panel:
<CollectionCarousel images={section.images} sectionTitle={section.title} />
```

### Left panel: sticky behavior — height auto
Change the left panel from `height: 'calc(100vh - 4rem)'` to `height: 'auto'` and add `alignSelf: 'flex-start'`. The `position: 'sticky'` and `top: '4rem'` stay.

```tsx
style={{
  position: 'sticky',
  top: '4rem',
  height: 'auto',        // was calc(100vh - 4rem)
  alignSelf: 'flex-start',
  padding: '3rem 2.5rem',
  ...
}}
```

### Left panel: add section jump nav
Below the pills, add a numbered section list. Use `IntersectionObserver` to highlight the currently-visible section.

```tsx
'use client'
// Add to top of component:
const [activeSection, setActiveSection] = useState(category.sections[0].id)

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
      rootMargin: '-4rem 0px 0px 0px', // account for fixed navbar height
    }
  )
  category.sections.forEach((s) => {
    const el = document.getElementById(`section-${s.id}`)
    if (el) observer.observe(el)
  })
  return () => observer.disconnect()
}, [category.sections])
```

Render the nav list below the pills:

```tsx
<div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem', marginTop: '0.5rem' }}>
  <p style={{ fontSize: '0.55rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--color-border)', marginBottom: '0.5rem' }}>
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
      {String(idx + 1).padStart(2, '0')}  {s.title}
    </a>
  ))}
</div>
```

### Mobile style block — update .split-story rule
The mobile `<style>` block must clear `position: sticky` and `align-self` on small screens:

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

---

## Visual Summary

```
/work/resort
├── [Navbar — G. GAMARGO → / ]  [☰ → Work + 4 collection sub-links, About, Contact]
├── Back nav  ← Portfolio
├── Page header: eyebrow / h1 Resort & Activewear / subtitle
│
├── #section-stephanie-gottlieb  (~450px tall)
│   ├── LEFT sticky (height:auto, align-self:flex-start):
│   │   01/07, title, desc, outcome, pills
│   │   SECTIONS nav list (01 active gold, 02-07 muted)
│   └── RIGHT: CollectionCarousel (drag 3D, 4 images, caption below)
│
├── #section-mercedes-salazar  (~450px tall)
│   └── ...same structure, 02 highlighted in nav
│
└── ... × 5 more
```

---

## Out of Scope

- No changes to the home page (accordion stays)
- No changes to `portfolioData.ts`
- No new pages
- No footer
- Real copy from gabrielagamargo.com — handled separately

---

## Files

| Action | File |
|--------|------|
| Modify | `src/components/Navbar.tsx` |
| Create | `src/components/CollectionCarousel.tsx` |
| Modify | `src/components/SplitScrollCollection.tsx` |
