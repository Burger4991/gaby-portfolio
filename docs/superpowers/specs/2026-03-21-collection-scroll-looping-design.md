# Collection Scroll — Looping Vertical Carousel Design

## Goal

Replace the current two-zone collection page (hero intro + stacked split sections) with a single full-screen looping vertical carousel. Each section of a collection becomes one full-screen panel. Scrolling cycles through sections infinitely — reaching the last section wraps back to the first.

## Architecture

### Core Mechanism: GSAP Observer

The current `CollectionScrollFX` uses ScrollTrigger scrub (`${total * 100}vh` tall container, scroll position drives animation). Looping is not compatible with this pattern. The replacement uses **GSAP Observer**:

- Body scroll is **locked** (`document.body.style.overflow = 'hidden'`) on mount, restored on unmount via `useLayoutEffect` cleanup (not `useEffect` — `useLayoutEffect` runs synchronously before paint and provides a stronger teardown guarantee on Next.js route changes)
- `Observer.create()` captures `wheel` + `touch` events with `preventDefault: false` so the carousel's own wheel handler is not suppressed
- Observer is configured to trigger only on predominantly vertical scroll: check `Math.abs(deltaY) > Math.abs(deltaX)` inside the handler to ignore horizontal trackpad swipes (which belong to the carousel)
- Each trigger increments or decrements a section index, wrapped with modulo: `(currentIndex + 1) % total` (forward) and `(currentIndex - 1 + total) % total` (backward)
- Transitions are JS-driven `gsap.to()` animations — not tied to scroll position
- A debounce lock (~800ms) prevents rapid-fire triggers during transition. Use GSAP Observer's built-in `debounce: true` option (debounces to the next frame) plus a manual `isAnimating` ref that blocks new triggers while a transition is in progress
- `CollectionCarousel` attaches its own non-passive `wheel` listener for horizontal drag. This coexists safely: horizontal swipes (`deltaX > deltaY`) are ignored by Observer; vertical scrolls (`deltaY > deltaX`) are ignored by the carousel's handler

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
    │   └── CollectionCarousel (existing component, current section's images)
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

**Outcome callout rendering:**

The `outcome` string in `portfolioData.ts` is a plain string. Carry over the splitting logic from `SplitScrollCollection.tsx` (lines 216–225):
- If the string starts with `↑` or `"Featured"`, split on `" — "` or `". "` — first segment is the bolded gold label, remainder is the body text
- Otherwise, render `"Outcome"` as the gold label and the full string as body text

**Key implementation notes:**
- `'use client'` directive required
- GSAP Observer created in `useLayoutEffect`, cleaned up on unmount (`observer.kill()`)
- Body overflow locked in `useLayoutEffect`, restored via cleanup
- Active section index in `useState`
- Background images: render all, only active is visible (opacity), so Next.js can preload them
- `CollectionCarousel` receives `images={sections[activeIndex].images}` and `sectionTitle={sections[activeIndex].title}` — resets on index change via `key={activeIndex}` (no `sectionTitle` field in the section shape — use `.title` directly)

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

Still wraps carousel card faces in `CollectionCarousel`. No changes needed.

## What Gets Deleted (from existing files)

- All `IntersectionObserver` logic in `SplitScrollCollection.tsx`
- All `revealedSections` / `activeSection` state
- All `section-reveal` CSS class usage
- The `GlowingShadow` import in `SplitScrollCollection.tsx`
- All `CollectionScrollFX` import/usage in `SplitScrollCollection.tsx` (re-added inside new component)
- All stacked section grid markup
- `split-back-nav` block (back nav link) in `SplitScrollCollection.tsx` — now owned by `CollectionScrollFX` fixed overlay
- `split-page-header` block (collection title + subtitle) in `SplitScrollCollection.tsx` — now owned by `CollectionScrollFX` fixed overlay
- `paddingTop: '4rem'` and `minHeight: '100vh'` on the outer wrapper in `SplitScrollCollection.tsx` — the new component owns the full viewport

## Constraints

- Next.js pinned to 15 — no upgrade
- `'use client'` on all interactive components
- No test suite — verify with `npm run lint` + `npm run build`
- GSAP Observer must be explicitly registered: `gsap.registerPlugin(Observer)`. Import from `gsap/Observer`. This is not auto-registered — the existing `CollectionScrollFX.tsx` demonstrates the correct pattern for `ScrollTrigger`.
- Body overflow lock must be cleaned up on unmount (Next.js route changes)
- `CollectionCarousel` uses Framer Motion inertia internally — ensure it still receives correct `images` and `sectionTitle` props on section change
- `category.label` is a full display string (e.g. `"Resort & Activewear"`, `"Cut & Sew Knits"`) — not a short slug. The fixed overlay label should use `font-size: 0.6rem` or smaller, or truncate with `text-overflow: ellipsis` if the label is long.

## Known Open Items (not blocking implementation)

- **Mobile behavior**: The fixed full-viewport layout with body scroll lock has known issues on iOS Safari (`overflow: hidden` on `body` is unreliable). The 40/60 split with 3D carousel is also unusable at small widths. Mobile-specific behavior is out of scope for this iteration — a follow-up spec will address stacking and touch handling for narrow screens.
- **Z-index stack**: Ensure panel background images are at `z-index: 0`, text/carousel content at `z-index: 1`, fixed overlay at `z-index: 100`. Framer Motion's `motion.div` (used inside `CollectionCarousel`) creates a new stacking context via `will-change: transform` — test that the fixed overlay renders above carousel elements.
- **Single-image sections**: Sections with one image render as a static card in `CollectionCarousel` (existing behavior). The background image and carousel will show the same image — acceptable.

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
