# Gaby Portfolio — Project State
*Last updated: 2026-04-05 15:30*

## Phase
implementing

## Plan
- **File:** `DESIGN-SPEC.md` + `VISUAL-CLEANUP.md`
- **Current step:** Mobile fixes (Wave 4 remaining)
- **Decided:** No FullScreenScrollFX. Normal scroll. Desktop 40/60 split + 3D carousel. Mobile: card-first + MobileImageStrip.
- **Open:** Mobile swipe, mobile accordion UX, typography refinements, PR #3 merge.

## Implementation
- **Active:** Mobile fixes (swipe, accordion UX)
- **Done:**
  - Wave 1-3: themes, LiquidGlass, SpotlightCard, ImageAccordion, collection pages
  - Wave 3.5: gradient bgs, LG on cards, lightbox modal, horizontal scroll carousel
  - Wave 4: dead file cleanup, copy audit, FullScreenScrollFX removal, mobile layout (partial)
  - Wave 4 desktop polish: carousel perspective+size, caption/stage dedup, SpotlightCard padding, Latte gradient fix — `5216404`
  - Component fixes (2026-04-05): accordion zoom removed, carousel 300px faces + 320px height, SpotlightCard 420×420px fixed, caption padding unified — `c145fba`, `c85c8a3`
- **Blocked:** Mobile swipe — touch-action:pan-x insufficient on real device

## Decisions Log
- 2026-03-28 20:30: Collection page redesign — gradient bgs, LG nav pills, no divider, standardized dimensions, lightbox modal
- 2026-03-28 23:00: Removed FullScreenScrollFX from collection pages — scroll conflict with carousel
- 2026-03-29 02:40: Removed FullScreenScrollFX from homepage too — simplified to stacked sections
- 2026-03-29 03:00: Dedicated mobile layout — MobileImageStrip replaces 3D carousel on mobile
- 2026-03-29 03:30: Feature-dev workflow is standard for all portfolio features going forward
- 2026-04-05 11:10: Caption hides when it matches stage (string normalization) — carousel label row stays clean without data changes
- 2026-04-05 11:10: Latte gradient uses symmetrical end-stop (bg→surface→bg) via --color-gradient-* CSS tokens; other themes use CSS fallback (unchanged)
- 2026-04-05 11:10: Carousel perspective 1000→1400px, cards 220×320→240×340 — gentler 3D, side images more visible
- 2026-04-05 15:30: ImageAccordion zoom removed (scale 1.05/1.15→1.0) — subjects were obscured by crop-zoom
- 2026-04-05 15:30: Carousel FACE_WIDTH 240→300px, CARD_HEIGHT 340→320px — wider faces per design-tokens, height reduced to fit 420px alignment wrapper
- 2026-04-05 15:30: SpotlightCard fixed to 420×420px in CollectionPage — uniform card size regardless of content length
- 2026-04-05 15:30: Caption padding unified to `0.75rem 0` on both single and multi-image carousel paths

## Open Questions
- Best approach for mobile swipe (react-swipeable vs pointer events vs native scroll)?
- Mobile accordion: bigger active-state differential, or different component entirely?
- Typography refinements — deferred, revisit before PR merge?
