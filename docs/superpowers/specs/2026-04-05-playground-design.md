# Layout Playground — Design Spec

**Date:** 2026-04-05  
**Author:** Alex Burger (brainstormed with Claude)  
**Status:** Approved — pending implementation plan

---

## Context

gaby-portfolio (`~/Desktop/gaby-portfolio`) is a Next.js 15 fashion portfolio for Gabriela Gamargo, a Miami-based fashion designer with 10+ years experience. The site is visually ambitious (4 themes, 3D carousel, scroll-expand hero, custom cursor) but has accumulated significant layout inconsistencies during development:

- 3 different container max-widths across adjacent sections (672/896/1152px)
- No unified spacing system (13+ ad-hoc values)
- 3 competing typography sizing approaches (clamp, Tailwind responsive, CSS vars)
- Hardcoded carousel dimensions (320px/220px) with zero responsive scaling
- Dual sticky header conflict on collection pages (Navbar z-50 + collection header z-50 both at top:0)

The playground is a **standalone design tool** — a self-contained HTML file the designer can open in any browser to experiment with layouts, spacing, themes, and component variants before changes are applied to the production codebase.

**Also pending:** Formalize moving the repo from `~/Desktop/gaby-portfolio` to `~/Documents/Tech/GC_Website/` (or a new folder). This move should happen before or alongside playground creation.

---

## Deliverable

**File:** `gaby-portfolio/playground/index.html`  
**Type:** Single self-contained HTML file (vanilla HTML/CSS/JS — no build step)  
**How to use:** Open directly in any browser. No server required.

---

## Architecture

### Three-Panel Shell

```
┌──────────────┬──────────────────────────────┬─────────────────┐
│  Left Panel  │        Center Canvas         │   Right Panel   │
│   (~280px)   │        (fluid, min)          │    (~240px)     │
│  collapsible │                              │   collapsible   │
│              │  [Homepage] [Collection]     │                 │
│  11 Control  │                              │  Component      │
│  Panels      │  Draggable component blocks  │  Inspector      │
│              │                              │  (on click)     │
└──────────────┴──────────────────────────────┴─────────────────┘
```

- Left and right sidebars are collapsible (toggle button on their inner edge)
- Canvas fills remaining width
- Canvas has a top tab bar: **Homepage** | **Collection**
- All controls update the canvas live — no save/apply step

---

## Canvas — Homepage Mode

Blocks render top-to-bottom in this default order (drag to reorder):

| Block | Visual Representation |
|-------|----------------------|
| **Navbar** | Pinned top — shows logo + hamburger, switches between style variants |
| **Hero** | Hero image (placeholder if no image), "GABRIELA GAMARGO" in Cormorant Garamond, 4 stats, CTA button |
| **Marquee** | Animated scrolling text strip with real category names |
| **Portfolio** | 4 panels with category names + preview images. Switches between accordion / card grid / horizontal strip variants |
| **PullQuote** | Actual quote text in Cormorant Garamond italic |
| **About** | Two-column: text block + portrait placeholder, skill pills |
| **Contact** | Form fields, CTA buttons, social icons |
| **Footer** | Pinned bottom — copyright bar |
| **Floating elements** | BackToTop, ThemeToggle, custom cursor dot — always visible, not draggable |

**Navbar and Footer are pinned** (cannot be reordered). All other blocks are draggable by their header drag-handle.

---

## Canvas — Collection Mode

| Block | Visual Representation |
|-------|----------------------|
| **Sticky header** | Back arrow + category name, respects header behavior setting |
| **Section grid (×N)** | Left: SpotlightCard (title/desc/pills). Right: carousel or alternative image layout |
| **Lightbox overlay** | Triggered by clicking an image. Tests aspect ratio + nav layout |

A section count selector (1–7) controls how many grid rows render for pacing/rhythm testing.

---

## Control Panels (Left Sidebar)

### Panel 1: Layout Grid
- **Container width** — slider 672px → 1400px, or "Full bleed" toggle. Sets unified `max-width` on all sections.
- **Section ordering** — draggable list mirroring canvas order. Reordering here also reorders canvas.
- **Section height** — per-section dropdown: `auto` | `100vh` | `min-height: 100vh` | custom (px/vh input).

### Panel 2: Spacing System
- **Base unit** — 4px or 8px radio selector.
- **Scale preview** — visual bars showing generated scale (×1 through ×16 of base unit).
- **Section padding** — vertical + horizontal sliders snapping to base unit scale.
- **Component gap** — gap between internal elements within sections.

### Panel 3: Typography
- **Heading scale** — min/max sliders for `clamp()`. Type specimen strip previews all headings live.
- **Body size** — slider (0.875rem → 1.25rem).
- **Label/eyebrow size** — slider with paired letter-spacing.
- **Letter-spacing** — 3 stops (tight / normal / wide) with editable values. Shows which components use each.

### Panel 4: Theme Editor
- **Theme selector** — 4 tabs: Dark Luxury | Latte | Frappe | Mocha.
- **Per-theme color pickers** — background, surface, text, accent, border, muted.
- **Per-theme effects toggle** — glow intensity, blur amount (e.g., stronger on dark, subtle on light).
- **All-themes view** — 2×2 grid of the same canvas section rendered in all 4 themes simultaneously.

### Panel 5: Collection Layout
- **Grid split** — slider 30/70 → 50/50 (current: 40/60).
- **Carousel size** — height (200px → 500px) and face-width (150px → 300px) sliders.
- **Header behavior** — sticky (current) | scroll-away | fixed offset from navbar.

### Panel 6: Component Variants
- **Accordion style** — expanding panels (current) | card grid (2×2) | horizontal scroll strip | tabbed.
- **PullQuote treatment** — large centered (current) | left-aligned with accent bar | edge-bleed into next section | hidden.
- **Hero style** — scroll-expand (current) | static full-bleed | split (text left / image right) | minimal text + CTA.

### Panel 7: Navigation & Wayfinding
- **Navbar style** — hamburger-only (current) | persistent text links | sidebar nav | bottom bar.
- **Scroll indicators** — progress bar (current) | section dots | breadcrumb trail | none.
- **Section transitions** — hard cut | fade | gradient blend.

### Panel 8: Motion & Effects
- **Cursor** — custom dot (current) | system default | contextual.
- **Hover effects** — SpotlightCard glow intensity slider, LiquidGlass blur slider, accent glow spread slider.
- **Scroll behavior** — smooth (current) | snap | free.
- **Preloader** — on/off toggle, duration slider (0.5s → 3s).

### Panel 9: Image Presentation
- **Lightbox aspect ratio** — 3/4 (current) | match source | 16:9 | 1:1 | 4:5.
- **Collection image layout** — 3D carousel (current) | masonry grid | filmstrip | tiled.
- **Mobile image treatment** — horizontal strip (current) | vertical scroll | swipeable cards.

### Panel 10: Responsive Preview
- **Device frames** — phone (375px) | tablet (768px) | laptop (1280px) | desktop (1440px) | ultrawide (2560px).
- **Side-by-side mode** — renders mobile + desktop canvas simultaneously.

### Panel 11: Export / Snapshot
- **Save layout** — stores current settings as named JSON snapshot (e.g., "layout-v1").
- **Compare snapshots** — load two saved layouts side-by-side.
- **Export config** — generates a `design-tokens.json` file consumable during implementation.

---

## Right Sidebar — Component Inspector

Clicking any canvas block opens per-component controls:
- **Variant selector** (shows applicable variants for that block)
- **Padding override** (overrides Panel 2 global settings for this block only)
- **Visibility toggle** (hide/show without removing from order)
- **Notes field** (free text — e.g., "try card style here")

---

## Implementation Notes

### Styling
- Import same fonts as production site: Cormorant Garamond (Google Fonts), system sans-serif for UI chrome
- CSS custom properties mirror production token names exactly (`--color-bg`, `--color-accent`, etc.) so exported values map 1:1
- Component blocks use real token values for colors/type — placeholder boxes for complex interactions (carousel cylinder, GSAP animations)

### State
- All control values held in a single `state` JS object
- `applyState()` re-renders canvas on every change — no virtual DOM, direct DOM manipulation
- Snapshots serialized to `localStorage` under `gaby-playground-snapshots`
- Export dumps current `state` as formatted JSON download

### No Build Step
- Single file: all CSS in `<style>`, all JS in `<script>`, no imports
- Google Fonts loaded via `<link>` tag
- Placeholder images use CSS gradients (no external image dependencies)
- Real portfolio images optionally loaded from `../public/assets/` with relative paths

---

## Repo Move

Before or alongside playground creation, move the repo:
- Source: `~/Desktop/gaby-portfolio`
- Destination: `~/Documents/Tech/gaby-portfolio/` (new folder — GC_Website is a separate unrelated project, do not overwrite it)
- Update `~/Documents/Tech/PROJECT.md` and `HANDOFF.md` to reflect new path
- Confirm git remote is `github.com/Burger4991/GC_Website`

---

## Verification

1. Open `playground/index.html` directly in Chrome — no server, no build
2. Drag a block to reorder — canvas updates instantly
3. Move the container width slider — all section max-widths update uniformly
4. Switch themes — canvas re-renders with correct colors per theme
5. Open "All themes" view — 2×2 grid shows all 4 themes simultaneously
6. Change accordion variant to "card grid" — Portfolio block re-renders as cards
7. Switch to Collection mode — grid split slider adjusts the two-column layout
8. Save a snapshot — name it, reload the page, confirm it persists from localStorage
9. Export config — downloads a valid JSON file with current settings
10. Open at 375px viewport — blocks reflow correctly, responsive preview device selector works
