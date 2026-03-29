# Visual Cleanup — Gaby Portfolio

**Branch:** `feat/visual-cleanup`
**Spec:** `DESIGN-SPEC.md`
**Brainstorm:** `docs/brainstorm/2026-03-28-portfolio-redesign.md`
**Last commit:** `a88ee20` (2026-03-28)
**Status:** ALL WAVES COMPLETE — PR ready

---

## Wave 1: Foundation — DONE
- [x] 4 themes: Dark Luxury, Latte, Frappé, Mocha
- [x] LiquidGlass component (frosted blur + glow)
- [x] SpotlightCard component (pointer-tracking glow)
- [x] Theme toggle (4-way cycle: Sun → CloudSun → Palette → Moon)
- [x] Design tokens: overlay colors, type scale, tracking scale
- [x] Replace 30+ hardcoded colors with tokens
- [x] Remove dead code (ThreeDCarousel, ThemeContext.jsx)

## Wave 2: Homepage — DONE
- [x] FullScreenScrollFX as full-page navigator
- [x] ImageAccordion for portfolio selection
- [x] Content panels (PullQuote, About, Contact) inside scroll FX
- [x] LiquidGlass on ALL interactive elements site-wide
- [x] Fix z-index layering (nav z:10 > content z:3 > bg z:1)
- [x] Fix text-transform:uppercase leak
- [x] Remove broken GSAP ScrollTrigger from PullQuote + About
- [x] Fix scroll conflict in About/Contact (stopPropagation)
- [x] Fix fragile mobile CSS selector (data-active attribute)

## Wave 3: Collection Pages — MOSTLY DONE
- [x] FullScreenScrollFX per-section navigation
- [x] 40/60 SpotlightCard + 3D carousel layout
- [x] Carousel: scroll/swipe interaction (replaces drag)
- [x] LiquidGlass stage pills under carousel images
- [x] Overlay text tokens for readability over dark bg
- [x] GlowingShadow vertical divider between text/carousel
- [x] LiquidGlass on collection back link
- [x] **Loop scroll (last panel → first)**

## Wave 3.5: Collection Page Redesign — DONE
Source: `docs/brainstorm/2026-03-28-collection-page-redesign.md`
- [x] Remove background images → theme-derived gradient backgrounds per section
- [x] Remove GlowingShadow divider (keep 40/60 split layout)
- [x] Standardize section dimensions (fixed card height, carousel size, padding)
- [x] LiquidGlass on all nav items (left: section name pills, right: labels), stronger on active
- [x] LiquidGlass on SpotlightCard text cards
- [x] Carousel: horizontal scroll only (vertical passes through to section nav)
- [x] Image lightbox modal (SpotlightCard-styled cards, arrow nav, click-outside dismiss)

## Wave 4: Polish — IN PROGRESS
- [x] Loop scroll (removed with FullScreenScrollFX — no longer applicable)
- [x] Dead file cleanup (Portfolio, SplitScrollCollection, Lightbox, splitWords, GlowingShadow, FullScreenScrollFX)
- [x] DESIGN-SPEC.md updated (4 themes, Wave 3.5 decisions)
- [x] Copy audit documented (docs/copy-audit.md — Claude-enhanced copy OK)
- [x] Removed FullScreenScrollFX entirely — normal scroll site-wide
- [x] Desktop collection pages working (40/60 split, 3D carousel, lightbox)
- [x] Dedicated mobile layout (MobileImageStrip component)
- [ ] **Mobile swipe not working** — touch-action:pan-x insufficient
- [ ] **Mobile accordion UX** — looks like plain cards, needs clearer interaction
- [ ] Visual polish pass (gradients, spacing, typography)
- [~] Typography refinements — deferred
- [ ] Final review → PR to main

## Notes
- FullScreenScrollFX.tsx DELETED — don't try to import it
- Desktop is in good shape, mobile needs work
- PR #3 open: https://github.com/Burger4991/gaby-portfolio/pull/3
- Use feature-dev workflow for all remaining features
