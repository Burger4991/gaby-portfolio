# Visual Polish Pass — Gaby Portfolio Collection Pages

## Context
The portfolio redesign (Waves 1-3.5) is complete. Desktop is in good shape but needs a visual polish pass before PR #3 merges. Session A is building a playground; this session tackles 4 desktop polish items identified from live Vercel preview screenshots.

Branch: `feat/visual-cleanup`

---

## 1. Caption/Stage Label Redundancy

**File:** `src/components/CollectionCarousel.tsx` (lines 216-238)

**Finding:** Not a duplication bug. The carousel shows both `caption` (left, descriptive) and `stage` (right, LiquidGlass pill). But when both say near-identical things (e.g., "Fabric development" / "Fabric Dev"), it reads as redundant.

**Fix:** Hide caption text when it closely mirrors the stage — show only the stage pill. When caption differs meaningfully from stage, show both.

```tsx
// Line ~224-232: Only render caption if it's substantively different from stage
{activeImage.caption && activeImage.stage &&
 activeImage.caption.toLowerCase().replace(/[^a-z]/g, '') !==
 activeImage.stage.toLowerCase().replace(/[^a-z]/g, '') && (
  <span style={{...}}>{activeImage.caption}</span>
)}
```

Also apply the same logic to the single-image fallback (line 189).

---

## 2. SpotlightCard Left Padding

**File:** `src/components/CollectionPage.tsx` (lines 162-168)

**Issue:** Text card container has `padding: '4rem 2rem'`. On narrow desktop (1024px), the card sits too close to the left edge of the viewport.

**Fix:** Increase left padding from `2rem` to `3rem`. Keep right at `2rem` since the card butts against the carousel.

```tsx
// Line 168: change padding
padding: '4rem 2rem 4rem 3rem',
```

---

## 3. Carousel Side-Image Visibility

**File:** `src/components/CollectionCarousel.tsx`

**Issue:** 3D cylinder rotation makes non-active images appear very dark/barely visible. The `perspective: 1000px` causes extreme foreshortening.

**Fix:** Two changes:
1. Increase perspective from `1000px` to `1400px` — gentler 3D effect, side images more visible
2. Increase `FACE_WIDTH` from `220` to `240` — larger cards = more visible content on side faces

```tsx
// Line 10-11
const CARD_HEIGHT = 340  // was 320
const FACE_WIDTH = 240   // was 220

// Line 109: perspective
perspective: '1400px',   // was '1000px'
```

---

## 4. Background Gradient Token Audit

**File:** `src/app/globals.css` + `src/components/CollectionPage.tsx` (line 157)

**Current gradient:** `linear-gradient(${angle}deg, var(--color-bg) 0%, var(--color-surface) 45%, var(--color-card-bg) 100%)`

**Audit by theme:**
| Theme | bg → surface → card-bg | Issue? |
|-------|----------------------|--------|
| Dark Luxury | `#0C0C0E → #111116 → #18181E` | Fine — subtle warm dark |
| Latte | `#eff1f5 → #e6e9ef → #dce0e8` | Light → slightly darker — inverted feel, may look flat |
| Frappe | `#303446 → #414559 → #292c3c` | Mid lifts then drops — subtle but fine |
| Mocha | `#1e1e2e → #313244 → #181825` | Same pattern as Frappe — fine |

**Fix:** For Latte, the gradient goes from lightest → medium → darkest, which is the opposite direction from the dark themes (dark → mid → dark). This makes the card area darker than the page background — feels inverted. Add a Latte-specific gradient override:

```css
/* In globals.css, inside html[data-theme="latte"] */
--color-gradient-start: #eff1f5;
--color-gradient-mid:   #e6e9ef;
--color-gradient-end:   #eff1f5;  /* match start, not card-bg */
```

Then update CollectionPage.tsx gradient to use these tokens:
```tsx
background: `linear-gradient(${angle}deg, var(--color-gradient-start, var(--color-bg)) 0%, var(--color-gradient-mid, var(--color-surface)) 45%, var(--color-gradient-end, var(--color-card-bg)) 100%)`
```

This uses fallback values so existing themes work unchanged, and only Latte overrides the end-stop.

---

## Files Modified

| File | Changes |
|------|---------|
| `src/components/CollectionCarousel.tsx` | Perspective, card size, caption dedup |
| `src/components/CollectionPage.tsx` | Left padding, gradient tokens |
| `src/app/globals.css` | Latte gradient override tokens |

## Verification

1. `cd /Users/alexanderburger/Desktop/gaby-portfolio && npm run dev`
2. Open `localhost:3000/work/cutsew` — check:
   - Side images more visible in carousel
   - Caption only shows when different from stage
   - Text card not hugging left edge
3. Toggle through all 4 themes — verify gradients look cohesive
4. Check Latte theme specifically — no inverted-feeling gradient
5. Spot-check `/work/resort`, `/work/bridal`, `/work/illustrations`
