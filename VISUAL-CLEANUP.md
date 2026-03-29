# Visual Cleanup — Gaby Portfolio

**Branch:** `feat/visual-cleanup`
**Spec:** `DESIGN-SPEC.md`
**Brainstorm:** `docs/brainstorm/2026-03-28-portfolio-redesign.md`
**Last commit:** `45ff51d` (2026-03-28)

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
- [ ] **Loop scroll (last panel → first)**

## Remaining Work
- [ ] Loop scroll on collection pages (last section → loops to first)
- [ ] Typography refinements (Cosmic Night inspiration — weight/spacing)
- [ ] Wave 4: Copy audit against gabrielagamargo.com
- [ ] Wave 4: Flag changes for Gaby review
- [ ] Wave 4: Cross-browser / mobile / performance pass
- [ ] Wave 4: Final review → PR to main
- [ ] DESIGN-SPEC.md needs updating (theme section says 3 themes, we have 4)

## Notes
- GlowCard component exists but SpotlightCard replaced it for text cards
- Old Portfolio.tsx, SplitScrollCollection.tsx preserved but no longer imported
- Lightbox.tsx confirmed unused (no imports)
- splitWords lib still imported in old files but not actively used
