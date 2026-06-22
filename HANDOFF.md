# Handoff — 2026-04-05

## What we were doing
Direct component fixes on `feat/visual-cleanup` — tackling visual issues identified from live site review: accordion zoom obscuring images, carousel/card size inconsistency, caption alignment mismatch.

## Where we left off
3 commits pushed: accordion zoom removed, carousel widened to 300px faces, SpotlightCard fixed to 420×420px, carousel height aligned to match. Dev server confirmed live at localhost:3001 (port 3001). Height alignment visually verified by user — minor carousel height overage noted and fixed.

## This session's decisions
- **Accordion zoom**: Removed `scale(1.05/1.15)` entirely — images show at natural scale, expansion alone reveals content
- **Carousel geometry**: FACE_WIDTH 240→300px (from design-tokens export), CARD_HEIGHT 340→320px to fit captions inside 420px wrapper
- **SpotlightCard**: Fixed `420×420px` with `overflow: hidden` — uniform size across all collection sections
- **Caption padding**: Unified to `0.75rem 0` on both single-image and multi-image paths
- **Playground**: Built but not a priority — playground HTML sits uncommitted in working tree, no action needed

## What's next
1. **Test on real device / Vercel preview** — verify accordion reveal + carousel dimensions feel right
2. **Mobile swipe fix** — `MobileImageStrip` in `CollectionPage.tsx`, `touch-action: pan-x` isn't working; needs JS gesture handler
3. **Mobile accordion UX** — vertical stack feels like plain cards, needs clearer tap affordance
4. **Typography refinements** — deferred, revisit before PR #3 merge
5. **Merge PR #3** when mobile is resolved

## Watch out for
- `playground/index.html` is modified but not committed — don't accidentally stage it
- Vercel auto-deploys from `main` — `feat/visual-cleanup` is safe to push without triggering deploy
- SpotlightCard `420px` height may clip very long outcome text — worth checking on data-heavy sections

## Project state → see PROJECT.md
Phase: implementing | Resume at: mobile swipe fix (MobileImageStrip in CollectionPage.tsx)

---
Session ended without /wrap — 2026-04-21 02:37
Use /load in your next session.
