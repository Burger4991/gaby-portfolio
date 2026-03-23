# Cursor Redesign — Design Document

**Date:** 2026-03-20
**Status:** Approved — ready for implementation

---

## Understanding Summary

- Ground-up rebuild of `CustomCursor.tsx` and cursor CSS in `globals.css`
- Current cursor is non-functional and was too subtle when it worked — broken UX on a portfolio that depends on interaction feel
- Targets pointer devices (desktop) for cursor; touch devices get ripple + press feedback
- Mix-blend-mode inversion for theme-agnostic contrast
- `prefers-reduced-motion` not in scope

---

## Assumptions

- Text label renders centered inside the expanded ring
- Touch ripple fires on any tap globally (not scoped to interactive elements)
- `cursor: none` stays on `body` for hover devices
- Ripple is a CSS keyframe animation on an injected div, removed after 600ms
- No React state in the animation hot path — refs + RAF only

---

## Final Design

### Component Structure

One component: `CustomCursor.tsx`, mounted once in root layout above all content.

Three DOM elements managed via refs:
- `dotRef` — small magnetic dot
- `ringRef` — morphing ring
- `labelRef` — text label centered inside the ring (child of ring)

All: `position: fixed`, `pointer-events: none`, `z-index: 9999`.

Two position tracks in refs (no React state):
- `pos` — raw mouse position, updates instantly on `mousemove`
- `dot` / `ring` — lerped positions, updated each RAF frame

Context detection: each `mousemove` calls `document.elementFromPoint(x, y)` and walks up with `.closest('[data-cursor]')` to find the nearest labeled ancestor.

Scroll detection: `scroll` listener sets `isScrolling` ref, debounced reset. While scrolling, opacity drops on dot + ring.

Touch: `touchstart` injects `div.cursor-ripple` at touch coordinates, removed after 600ms. Touched element gets `cursor-pressed` class while held.

---

### Animation & Timing

RAF loop runs continuously while mounted. Each frame:
1. Dot lerps toward `pos` at `0.18` — leads
2. Ring lerps toward `pos` at `0.10` — trails, creates cascade

Both write directly to `el.style.transform` — no React, no repaints outside transform.

**Ring morphing** (CSS transitions, not RAF):

| Context | Ring size | Label |
|---------|-----------|-------|
| Default | `40×40px` | hidden |
| `VIEW` | `80×80px` | `VIEW` |
| `DRAG` | `80×80px` | `DRAG` |
| `↗` (link) | `60×60px` | `↗` |

Ring CSS transition: `width 0.3s ease, height 0.3s ease, opacity 0.3s ease`

Label: `position: absolute`, centered via `top: 50% / left: 50% / transform: translate(-50%, -50%)`, `opacity: 0` default → `1` when ring expanded.

**Scroll:** Dot + ring drop to `opacity: 0.15` while `isScrolling`. Reset on next `mousemove`.

**Mix-blend-mode:** `mix-blend-mode: exclusion` on both dot and ring. Dot `background: white`, ring `border-color: white`. Works on any background automatically.

---

### Touch

**Ripple:** `touchstart` → inject `div.cursor-ripple` at touch point → CSS `@keyframes cursor-ripple` (0px→60px, opacity 0.4→0, 600ms) → remove div.

**Press highlight:** `touchstart` → `document.elementFromPoint` → add `.cursor-pressed` class. `touchend`/`touchcancel` → remove class.

```css
.cursor-pressed {
  outline: 1px solid var(--color-accent);
  outline-offset: 2px;
  transition: outline 0.15s;
}
```

---

### `data-cursor` Wiring

| Element | Attribute | Component |
|---------|-----------|-----------|
| Portfolio cards | `data-cursor="view"` | `Portfolio.tsx` / `ThreeDCarousel.tsx` |
| Carousel drag zone | `data-cursor="drag"` | `CollectionCarousel.tsx` |
| Nav links | `data-cursor="link"` | `Navbar.tsx` |
| Back nav link | `data-cursor="link"` | `SplitScrollCollection.tsx` |

---

## Decision Log

| Decision | Chosen | Alternatives | Reason |
|----------|--------|--------------|--------|
| Animation engine | RAF + lerp | Framer Motion springs, CSS transitions | Full timing control, no re-renders |
| Context detection | `data-cursor` + `elementFromPoint` | Event listeners per element | Decoupled — components don't know cursor exists |
| Theme handling | `mix-blend-mode: exclusion` | Theme-aware CSS vars | Works on any background automatically |
| Touch ripple | Injected div + CSS keyframe | Canvas, SVG, Framer Motion | Simplest, zero JS animation budget |
| Ring morphing | CSS transitions | RAF-driven | CSS handles size/opacity; RAF handles position — clean separation |
