# Visual Cleanup — Gaby Portfolio

**Branch:** `feat/visual-cleanup`
**Baseline:** `c24c33c` (last approved deployment)
**Goal:** Clean, consistent visuals + copy aligned with original site

---

## Phase 1: Visual Audit & Fix (current)

- [x] Run ui-visual-validator audit on all components
- [x] Add design tokens: overlay colors, type scale, letter-spacing scale
- [x] Replace all hardcoded colors with tokens (30+ instances fixed)
- [x] Consolidate font sizes: 8 label sizes → 4 tokens (`--text-label-xs/sm/md/body`)
- [x] Consolidate letter-spacing: 13 values → 3 tokens (`--tracking-tight/normal/wide`)
- [x] Fix light-theme overlay gradients (Portfolio, FullScreenScrollFX)
- [x] Fix low-contrast text (jump nav, carousel hints used border color for text → muted)
- [x] Remove dead code (ThreeDCarousel.tsx — unused)
- [x] Fix hardcoded error color in Contact → `--color-error` token
- [ ] Run ui-ux-designer review for navigation + layout consistency
- [ ] Ensure GlowCard, GlowingShadow integrate cleanly with baseline styles

## Phase 2: Feature Integration

- [ ] Wire GlowCard into CollectionCarousel card faces
- [ ] Wire GlowingShadow as section dividers on collection pages
- [ ] Integrate FullScreenScrollFX on homepage (replace accordion)
- [ ] CollectionScrollFX looping carousel (ON HOLD — decide later)
- [ ] Validate all features work in both themes

## Phase 3: Copy Alignment

- [ ] Audit all copy against gabrielagamargo.com (original site)
- [ ] Replace any Claude-written descriptions with original copy
- [ ] Verify resort/bridal descriptions match source
- [ ] Final copy pass for tone consistency

## Phase 4: Polish & Ship

- [ ] Cross-browser check (Safari, Chrome, Firefox)
- [ ] Mobile responsive audit
- [ ] Performance check (no layout shifts, smooth animations)
- [ ] Final visual review before PR

---

## Design Tokens Added (globals.css)

**Overlay tokens** (always dark, even in light theme):
- `--color-overlay-text` / `--color-overlay-heading` / `--color-overlay-muted` / `--color-overlay-dim`
- `--color-overlay-gradient` / `--color-overlay-scrim`
- `--color-error`

**Type scale:**
- `--text-label-xs` (0.55rem) — hints, counters
- `--text-label-sm` (0.62rem) — nav links, pills, captions
- `--text-label` (0.7rem) — eyebrows, section labels
- `--text-body` (0.875rem) — paragraph body

**Tracking:**
- `--tracking-tight` (0.1em) — compact labels
- `--tracking-normal` (0.2em) — standard UI text
- `--tracking-wide` (0.3em) — section headers, nav

## Kept Features (from drifted branch)
- GlowCard (pointer-tracking spotlight)
- GlowingShadow (pulsing glow divider)
- FullScreenScrollFX (GSAP scroll panels)
- CollectionScrollFX (looping carousel) — ON HOLD

## Discarded (from drifted branch)
- Layout experiments (40/60 splits, 2fr/3fr grids)
- Multiple carousel rewrites
- Section divider experiments
- ThreeDCarousel.tsx (dead code, removed)
