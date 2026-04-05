# Collection Page Redesign — Brainstorm Capture
*Date: 2026-03-28 20:30*

## What we were figuring out
How to restructure collection pages for better visual consistency, interaction design, and LiquidGlass integration. The current 40/60 split has inconsistent dimensions, a broken divider, background images competing with carousel content, and scroll hijacking issues.

## Options considered

### Background treatment
- **A) Solid theme color** — clean but flat, no section differentiation
- **B) Subtle gradient from theme tokens** — varies per section, keeps carousel as visual focus **(CHOSEN)**
- **C) Keep background images** — rejected, competes with carousel

### Carousel interaction
- **Keep 3D cylinder, horizontal scroll only** — vertical scroll passes through to section nav **(CHOSEN)**
- **Replace with flat horizontal filmstrip** — rejected, loses the visual impact
- **Replace with featured image + thumbnails** — rejected, different UX pattern

### Click-to-enlarge
- **A) Simple lightbox** — dark overlay, single image
- **B) Expand in-place** — scales within carousel area
- **C) Modal with SpotlightCard-style image cards + arrow navigation** — consistent card language, browsable **(CHOSEN)**

### LiquidGlass on nav
- **A) LG on all nav items, stronger on active** **(CHOSEN)**
- **B) LG only on active item** — not enough visual consistency
- **C) No LG on nav** — misses the site-wide LG language

### GlowingShadow divider
- **Fix positioning** — still adds visual noise
- **Remove entirely** — cleaner layout **(CHOSEN)**

### Left nav content
- **Keep section numbers (01, 02...)** — less useful for navigation
- **Section name pills with LiquidGlass** — more informative **(CHOSEN)**

### Gradient variation method
- **Auto-derived from theme tokens** — zero config, adapts to all 4 themes **(CHOSEN)**
- **Manual per-section colors in portfolioData.ts** — maintenance burden

## Decision

Full collection page restructure:

1. **LiquidGlass site-wide on collection pages:** All nav items (both left/right) wrapped in LG pills. Left nav switches from numbers to section names. Active items get stronger blur/glow. Text cards (SpotlightCard) also get LG treatment.

2. **Remove background images.** Replace with theme-derived gradients (e.g. `linear-gradient(135deg, var(--color-bg), var(--color-surface), var(--color-card-bg))`). Angle rotates per section index for visual differentiation.

3. **Remove GlowingShadow divider.** Keep the 40/60 split layout — the split stands on its own without the divider.

4. **Standardize dimensions.** Fixed card height, fixed carousel dimensions, consistent padding across all sections regardless of text length or image count.

5. **Carousel: horizontal scroll only.** Vertical scroll events pass through to FullScreenScrollFX section navigation. Only `deltaX` / horizontal swipe rotates the cylinder.

6. **Image lightbox modal.** Click any carousel image to open SpotlightCard-styled modal. Arrow keys / buttons to navigate through section images. Dismiss on click-outside or close button.

7. **Text cards working well** — keep SpotlightCard approach as-is.

## Rejected (and why)
- **Background images on sections:** Competes with carousel imagery, carousel should be sole visual focus
- **Flat horizontal filmstrip carousel:** Loses the 3D visual impact that works well
- **GlowingShadow divider:** Doesn't land at the split boundary, adds visual noise
- **Section numbers in left nav:** Names are more useful for wayfinding
- **Manual per-section gradient colors:** Maintenance burden, theme tokens handle it automatically

## Open questions going into the spec
- Exact gradient formula per section (angle offsets, opacity mix)
- Fixed carousel dimensions (what CARD_HEIGHT and FACE_WIDTH work universally?)
- Mobile breakpoint behavior for lightbox modal (full-width cards?)
- Whether SpotlightCard text should truncate/scroll at fixed height or if copy needs editing to fit

## Decision Log

| # | Decision | Alternatives Considered | Why |
|---|----------|------------------------|-----|
| 1 | LiquidGlass on all nav items + cards, stronger on active | LG only on active; no LG on cards | Consistent visual language, active state needs to pop |
| 2 | Left nav: section name pills (not numbers) | Keep numbers; show both | Names are more useful for navigation |
| 3 | Remove background images, use gradient/tinted bg | Fix bg images; solid color | Carousel images should be the star, gradients add variety without competing |
| 4 | Gradients derived from theme tokens | Per-section manual colors in data | Zero config, auto-adapts to all 4 themes |
| 5 | Remove GlowingShadow divider, keep 40/60 split | Fix divider; restructure layout entirely | Split works on its own, divider was visual noise |
| 6 | Standardize section dimensions (fixed card + carousel sizes) | Let content dictate size | Consistency across sections matters more than fitting variable content |
| 7 | Carousel: horizontal scroll only, vertical passes through | Keep vertical scroll; both axes | Prevents scroll hijack on section navigation |
| 8 | Click-to-enlarge: modal with SpotlightCard-style image cards + arrow nav | Simple lightbox; expand in-place | Consistent card language, browsable without closing |
