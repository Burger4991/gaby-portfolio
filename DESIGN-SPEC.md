# Design Spec — Gaby Portfolio Redesign

**Branch:** `feat/visual-cleanup`
**Date:** 2026-03-28
**Status:** Approved — ready for implementation

---

## Vision

Premium fashion portfolio with cohesive visual system: full-screen snap scroll navigation, liquid glass UI elements, spotlight cards, and 3D carousel with scroll interaction. Three themes.

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
- **Glowing shadow dividers** between panels
- **Loop scroll:** after last section, loops back to first
- Reference: https://21st.dev/community/components/Scottclayton3d/full-screen-scroll-fx/default

## UI Component System

### Liquid Glass (site-wide interactive element style)
Applied to: buttons, pills, stage labels, CTAs, theme toggle, nav items, skill tags, back-to-top
- Reference: https://21st.dev/community/components/aliimam/liquid-glass-button/default
- Must work across all 3 themes with adapted opacity/blur

### Spotlight Card
Text content cards on collection pages
- Reference: https://21st.dev/community/components/easemize/spotlight-card/default
- Pointer-tracking glow effect on border/shadow

### Glowing Shadow Divider
Section dividers on collection pages (already staged as component)

### 3D Carousel (updated)
- Keep cylindrical 3D geometry
- Change interaction: scroll/swipe triggers rotation (not pointer drag)
- Stage pill (liquid glass) appears under active image
- Caption text below pill

## Theme System

3 themes, toggled via cycle button:

### 1. Dark Luxury (default) — KEEP CURRENT
```
--color-bg:           #0C0C0E
--color-surface:      #111116
--color-border:       #1F1F25
--color-text:         #EDE8DF
--color-muted:        #5C5349
--color-accent:       #B8965A
--color-accent-hover: #CCA96A
--color-card-bg:      #18181E
```

### 2. Warm Ivory (light) — KEEP CURRENT
```
--color-bg:           #F8F4EE
--color-surface:      #F2EBE1
--color-border:       #E5DDD3
--color-text:         #1C1610
--color-muted:        #9A8E84
--color-accent:       #A0673A
--color-accent-hover: #B5784A
--color-card-bg:      #EDE7DF
```

### 3. Catppuccin (new)
Tokens TBD — reference: https://21st.dev/community/themes/catppuccin

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

### Wave 1: Foundation
- [ ] Add Catppuccin theme tokens
- [ ] Build Liquid Glass component
- [ ] Build Spotlight Card component
- [ ] Update theme toggle → 3-way cycle
- [ ] Typography refinements
- [ ] **CHECKPOINT: deploy + review**

### Wave 2: Homepage
- [ ] Replace Portfolio accordion with Interactive Image Accordion
- [ ] Wrap homepage sections in FullScreenScrollFX
- [ ] Apply liquid glass to all CTAs, buttons, nav
- [ ] **CHECKPOINT: deploy + review**

### Wave 3: Collection Pages
- [ ] Full-screen snap scroll per section
- [ ] 40/60 spotlight card + 3D carousel layout
- [ ] Carousel: scroll/swipe interaction
- [ ] Liquid glass stage pills under active image
- [ ] Glowing shadow dividers
- [ ] Loop scroll
- [ ] **CHECKPOINT: deploy + review**

### Wave 4: Copy + Polish
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
| 8 | 3 themes (Dark, Light, Catppuccin) | User likes current dark; Catppuccin adds personality |
| 9 | Typography refine, not replace | Cormorant + Manrope already fit |
| 10 | Copy: original base + improvements, Gaby approves | Best of both, she has final say |
| 11 | Loop scroll on collection pages | Continuous browsing |
| 12 | 4-wave delivery with checkpoints | Prevents drift |

## 21st.dev References

- Interactive Image Accordion: https://21st.dev/community/components/thanh/interactive-image-accordion/default
- Full Screen Scroll FX: https://21st.dev/community/components/Scottclayton3d/full-screen-scroll-fx/default
- Glowing Shadow: https://21st.dev/community/components/aliimam/glowing-shadow/default
- Liquid Glass Button: https://21st.dev/community/components/aliimam/liquid-glass-button/default
- Spotlight Card: https://21st.dev/community/components/easemize/spotlight-card/default
- Catppuccin theme: https://21st.dev/community/themes/catppuccin
- Cosmic Night (typography ref): https://21st.dev/community/themes/cosmic-night
- Midnight Bloom (color ref, not used): https://21st.dev/community/themes/midnight-bloom
