# Design Spec — Gaby Portfolio Redesign

**Branch:** `feat/visual-cleanup`
**Date:** 2026-03-28
**Status:** Approved — ready for implementation

---

## Vision

Premium fashion portfolio with cohesive visual system: full-screen snap scroll navigation, liquid glass UI elements, spotlight cards, and 3D carousel with horizontal scroll interaction. Four themes (Dark Luxury, Catppuccin Latte, Frappe, Mocha).

## Page Architecture

### Homepage (`/`)
Full-screen snap scroll between sections:
1. **Hero** — scroll-to-expand (existing)
2. **Marquee** — decorative strip (existing, not a snap panel)
3. **Portfolio** — Interactive Image Accordion (new, replaces current accordion)
   - Shows all categories: Resort, Cut & Sew, Bridal, Illustrations
   - Clicking a category → navigates to `/work/[slug]`
   - Reference: https://21st.dev/community/components/thanh/interactive-image-accordion/default
4. **PullQuote** — scroll-reveal quote (existing)
5. **About** — bio + skills (existing)
6. **Contact** — form + socials (existing)

### Collection Pages (`/work/[slug]`)
Full-screen snap scroll through sub-sections:
- Each panel = full viewport height
- **40% left:** Spotlight text card (glowing border/shadow effect)
  - Contains: section counter, title, description, outcome box
  - No pills (moved to carousel), no jump nav (scroll handles it)
- **60% right:** 3D cylindrical carousel
  - Interaction: scroll/swipe to rotate (not drag)
  - Active image shows liquid glass stage pill underneath
  - Caption text below
- **No dividers** — clean split, no GlowingShadow needed
- **Gradient backgrounds** — theme-derived gradients per section (no background images)
- **LiquidGlass nav pills** — section names in left nav, labels in right nav, stronger glow on active
- **LiquidGlass on text cards** — frosted glass aesthetic on SpotlightCard
- **Click-to-enlarge** — carousel images open a modal lightbox with arrow navigation
- **Loop scroll:** after last section, loops back to first (both directions, all pages)
- Reference: https://21st.dev/community/components/Scottclayton3d/full-screen-scroll-fx/default

## UI Component System

### Liquid Glass (site-wide interactive element style)
Applied to: buttons, pills, stage labels, CTAs, theme toggle, nav items, skill tags, back-to-top
- Reference: https://21st.dev/community/components/aliimam/liquid-glass-button/default
- Must work across all 4 themes with adapted opacity/blur
- `active` prop for stronger glow on active nav items

### Spotlight Card
Text content cards on collection pages
- Reference: https://21st.dev/community/components/easemize/spotlight-card/default
- Pointer-tracking glow effect on border/shadow

### Image Lightbox
Modal for enlarged carousel images
- SpotlightCard-styled image card
- LiquidGlass arrow buttons and close button
- Keyboard navigation (arrows, Escape)
- Body scroll locked when open

### 3D Carousel (updated)
- Keep cylindrical 3D geometry
- Interaction: horizontal scroll/swipe only (vertical passes through to section nav)
- Stage pill (liquid glass) appears under active image
- Caption text below pill
- Click any image to open lightbox

## Theme System

4 themes, toggled via cycle button (Sun → CloudSun → Palette → Moon):

### 1. Dark Luxury (default)
Gold accent on near-black. `--color-accent: #B8965A`

### 2. Catppuccin Latte (light)
Purple accent on warm gray. `--color-accent: #8839ef`

### 3. Catppuccin Frappe (mid-dark)
Lavender accent on deep blue-gray. `--color-accent: #ca9ee6`

### 4. Catppuccin Mocha (dark)
Mauve accent on dark cocoa. `--color-accent: #cba6f7`

Full token definitions in `globals.css`. Warm Ivory theme was replaced by the three Catppuccin variants.

## Typography

Fonts stay: Cormorant Garamond (headings) + Manrope (body/UI)

Refinements inspired by Cosmic Night (https://21st.dev/community/themes/cosmic-night):
- Heading weight/spacing adjustments for more elegant luxury feel
- Already using design tokens: `--text-label-xs`, `--text-label-sm`, `--text-label`, `--text-body`
- Already using tracking tokens: `--tracking-tight`, `--tracking-normal`, `--tracking-wide`

## Copy Strategy

1. Audit all copy against gabrielagamargo.com (original site)
2. Keep Claude improvements where they add detail or clarity
3. Flag all changes for Gaby's review — she may revert to original wording
4. SEO keywords (from pills) added to proper meta/structured data, not visual UI

## Implementation Waves

### Wave 1: Foundation — DONE
- [x] 4 themes: Dark Luxury, Latte, Frappe, Mocha
- [x] Build Liquid Glass component (with active prop)
- [x] Build Spotlight Card component
- [x] Update theme toggle → 4-way cycle
- [x] Design tokens: overlay colors, type scale, tracking scale

### Wave 2: Homepage — DONE
- [x] Replace Portfolio accordion with Interactive Image Accordion
- [x] Wrap homepage sections in FullScreenScrollFX
- [x] Apply liquid glass to all CTAs, buttons, nav

### Wave 3: Collection Pages — DONE
- [x] Full-screen snap scroll per section
- [x] 40/60 spotlight card + 3D carousel layout
- [x] Carousel: horizontal scroll/swipe interaction
- [x] Liquid glass stage pills under active image
- [x] Gradient backgrounds (replaced background images)
- [x] LiquidGlass nav pills (section names) + text cards
- [x] Image lightbox modal (click-to-enlarge)
- [x] Loop scroll (all pages, both directions)
- [x] Dead file cleanup

### Wave 4: Copy + Polish — IN PROGRESS
- [ ] Typography refinements (Cosmic Night inspiration)
- [ ] Copy audit against original site
- [ ] Flag changes for Gaby
- [ ] Cross-browser / mobile / performance
- [ ] **Final review → PR to main**

## Decision Log

| # | Decision | Why |
|---|----------|-----|
| 1 | 40/60 text/carousel split | More visual weight to imagery |
| 2 | 3D carousel scroll/swipe (not drag) | Preserves depth, more intuitive |
| 3 | Full-screen snap scroll all pages | Cohesive premium experience |
| 4 | Interactive Image Accordion on homepage | More visual impact |
| 5 | Liquid glass site-wide | Cohesive premium UI language |
| 6 | Spotlight card for text sections | Better presence at full-screen scale |
| 7 | Stage pills under carousel images | Labels match the image they describe |
| 8 | 4 themes (Dark Luxury + 3 Catppuccin) | Warm Ivory replaced by Latte/Frappe/Mocha |
| 9 | Typography refine, not replace | Cormorant + Manrope already fit |
| 10 | Copy: original base + improvements, Gaby approves | Best of both, she has final say |
| 11 | Loop scroll on all pages, both directions | Continuous browsing |
| 12 | 4-wave delivery with checkpoints | Prevents drift |
| 13 | Remove background images → gradient bgs | Carousel images should be sole visual focus |
| 14 | Remove GlowingShadow divider | Clean split, divider was visual noise |
| 15 | LiquidGlass on nav pills + text cards | Consistent frosted glass language |
| 16 | Carousel horizontal scroll only | Prevents vertical scroll hijack |
| 17 | Click-to-enlarge image lightbox | Browsable SpotlightCard-styled modal |

## 21st.dev References

- Interactive Image Accordion: https://21st.dev/community/components/thanh/interactive-image-accordion/default
- Full Screen Scroll FX: https://21st.dev/community/components/Scottclayton3d/full-screen-scroll-fx/default
- Glowing Shadow: https://21st.dev/community/components/aliimam/glowing-shadow/default
- Liquid Glass Button: https://21st.dev/community/components/aliimam/liquid-glass-button/default
- Spotlight Card: https://21st.dev/community/components/easemize/spotlight-card/default
- Catppuccin theme: https://21st.dev/community/themes/catppuccin
- Cosmic Night (typography ref): https://21st.dev/community/themes/cosmic-night
- Midnight Bloom (color ref, not used): https://21st.dev/community/themes/midnight-bloom
