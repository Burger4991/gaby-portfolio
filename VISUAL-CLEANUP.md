# Visual Cleanup — Gaby Portfolio

**Branch:** `feat/visual-cleanup`
**Spec:** `DESIGN-SPEC.md`
**Brainstorm:** `docs/brainstorm/2026-03-28-portfolio-redesign.md`

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
- [x] LiquidGlass on: Hero CTA, Contact buttons, About skill tags, BackToTop
- [x] Fix z-index layering (nav > content > bg)
- [x] Fix text-transform:uppercase leak
- [x] Remove broken GSAP ScrollTrigger from PullQuote + About

## Wave 3: Collection Pages — PARTIAL
- [x] FullScreenScrollFX per-section navigation
- [x] 40/60 SpotlightCard + 3D carousel layout
- [x] Carousel: scroll/swipe interaction (replaces drag)
- [x] LiquidGlass stage pills under carousel images
- [x] Overlay text tokens for readability over dark bg
- [ ] **Glowing shadow dividers between panels**
- [ ] **Loop scroll (last panel → first)**

## Still Missing (from DESIGN-SPEC)
- [ ] LiquidGlass on: nav menu items (fullscreen overlay)
- [ ] LiquidGlass on: theme toggle button
- [ ] LiquidGlass on: social icon buttons (Contact)
- [ ] LiquidGlass on: collection page back link
- [ ] Glowing shadow dividers on collection pages
- [ ] Loop scroll on collection pages
- [ ] Typography refinements (Cosmic Night inspiration)
- [ ] GlowCard not yet used (SpotlightCard replaced it for text cards)

## Wave 4: Copy + Polish — NOT STARTED
- [ ] Copy audit against gabrielagamargo.com
- [ ] Flag changes for Gaby
- [ ] Cross-browser / mobile / performance
- [ ] Final review → PR to main
