# Collection Scroll — Looping Vertical Carousel Design

## Goal

Replace the current two-zone collection page (hero intro + stacked split sections) with a single full-screen looping vertical carousel. Each section of a collection becomes one full-screen panel. Scrolling cycles through sections infinitely — reaching the last section wraps back to the first.

## Architecture

### Core Mechanism: GSAP Observer

The current `CollectionScrollFX` uses ScrollTrigger scrub (`${total * 100}vh` tall container, scroll position drives animation). Looping is not compatible with this pattern. The replacement uses **GSAP Observer**:

- Body scroll is **locked** (`document.body.style.overflow = 'hidden'`) on mount, restored on unmount
- `Observer.create()` captures `wheel` + `touch` events
- Each trigger increments or decrements a section index, wrapped with modulo: `(currentIndex + 1) % total` (forward) and `(currentIndex - 1 + total) % total` (backward)
- Transitions are JS-driven `gsap.to()` animations — not tied to scroll position
- A debounce lock (~800ms) prevents rapid-fire triggers during transition

### Page Structure

The entire collection page (`/work/[slug]`) becomes a single fixed-position container filling the viewport. The stacked layout below is removed.

```
Page root (position: fixed, inset: 0, overflow: hidden)
├── Fixed overlay (position: fixed, top-left, z-index above panels)
│   ├── ← Back to Portfolio (link, existing style)
│   └── Collection label (e.g. "Resort", gold uppercase Manrope)
│
└── Panel (fills viewport, one active section at a time)
    ├── Background image (Next.js Image fill, current section's first image)
    ├── Gradient overlay (left: rgba(bg, 0.95) → right: transparent)
    ├── Left column — 40% width, text content
    │   ├── Section counter (01 / 03, gold, Manrope uppercase)
    │   ├── Section title (Cormorant Garamond italic, large)
    │   ├── Description (Manrope, muted)
    │   ├── Outcome callout (gold left-border box)
    │   └── Stage pills (gold border, uppercase)
    ├── Right column — 60% width
    │   └── ThreeDCarousel (existing component, current section's images)
    └── Progress indicator (bottom — dots or bar, shows current/total)
```

### Transitions

On section change (forward or backward):

1. **Background image**: cross-fade — incoming image fades in over outgoing (opacity 0→1, duration ~0.6s)
2. **Text content**: outgoing fades out + slight translateY up; incoming fades in + translateY from below (~0.5s, staggered per element)
3. **Carousel**: re-renders with new section's images (React state update — carousel resets to position 0)
4. **Progress indicator**: updates to reflect new index

Easing: `cubic-bezier(0.4, 0, 0.2, 1)` (matches existing `sectionFadeUp` animation).

### Fixed Overlay

`position: fixed`, top: 1.5rem, left: 4rem, z-index: 100. Always visible across all panels.

Contents:
- Back link: `← Back to Portfolio` (existing Manrope style, `--color-muted`)
- Collection label: category label in `--color-accent`, Manrope 0.65rem, letter-spacing 0.35em, uppercase, displayed below the back link

### Progress Indicator

Bottom-center of the viewport. Dot style:
- N dots, one per section
- Active dot: `--color-accent`, filled
- Inactive dots: `--color-border`, hollow
- `position: fixed`, bottom: 2rem

## Component Changes

### `CollectionScrollFX.tsx` — full rewrite

**New name:** Keep filename. **New responsibility:** Looping GSAP Observer carousel (replaces scrub-based implementation entirely).

**Props:**
```ts
interface CollectionScrollFXProps {
  sections: {
    id: string
    background: string        // image src (first image of section)
    title: string
    description: string
    outcome: string
    pills: string[]
    images: SectionImage[]   // full image array for carousel
    counter: string          // e.g. "01 / 03"
  }[]
  collectionLabel: string    // e.g. "Resort"
}
```

**Key implementation notes:**
- `'use client'` directive required
- GSAP Observer created in `useLayoutEffect`, cleaned up on unmount (`observer.kill()`)
- Body overflow locked in `useLayoutEffect`, restored via cleanup
- Active section index in `useState`
- Background images: render all, only active is visible (opacity), so Next.js can preload them
- ThreeDCarousel receives `images={sections[activeIndex].images}` — resets on index change via `key={activeIndex}`

### `SplitScrollCollection.tsx` — major simplification

Remove:
- `IntersectionObserver` setup and `revealedSections` / `activeSection` state
- The stacked sections map (`category.sections.map(...)`)
- The `CollectionScrollFX` import and usage (now embedded inside new component)
- All split-collection grid CSS

Keep:
- Page-level wrapper div (background color, min-height)
- Render `<CollectionScrollFX>` with full section data

**New render output:**
```tsx
return (
  <div style={{ backgroundColor: 'var(--color-bg)' }}>
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
  </div>
)
```

### `GlowingShadow.tsx` — removed from collection pages

The vertical divider component was placed between text and carousel columns. With the new gradient-fade design, there is no hard column edge to place it on. Remove the import and usage from the new `CollectionScrollFX`.

### `GlowCard.tsx` — unchanged

Still wraps carousel card faces in `ThreeDCarousel`. No changes needed.

## What Gets Deleted (from existing files)

- All `IntersectionObserver` logic in `SplitScrollCollection.tsx`
- All `revealedSections` / `activeSection` state
- All `section-reveal` CSS class usage
- The `GlowingShadow` import in `SplitScrollCollection.tsx`
- All `CollectionScrollFX` import/usage in `SplitScrollCollection.tsx` (re-added inside new component)
- All stacked section grid markup

## Constraints

- Next.js pinned to 15 — no upgrade
- `'use client'` on all interactive components
- No test suite — verify with `npm run lint` + `npm run build`
- GSAP already registered via `GSAPProvider` — Observer is part of GSAP core, no additional registration needed
- Body overflow lock must be cleaned up on unmount (Next.js route changes)
- ThreeDCarousel uses Framer Motion inertia — ensure it still receives correct props on section change

## Success Criteria

- Scrolling on any collection page cycles through sections (forward and back)
- Reaching the last section and scrolling forward wraps to the first
- Reaching the first section and scrolling backward wraps to the last
- Background image transitions smoothly on section change
- Text content transitions smoothly on section change
- 3D carousel updates to the active section's images
- Fixed overlay (back nav + collection label) always visible
- Progress dots reflect current section
- Body scroll is restored when navigating away from the page
- `npm run lint` and `npm run build` pass
