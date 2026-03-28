# Portfolio Redesign — Brainstorm Capture
*Date: 2026-03-28 14:00*

## What we were figuring out
How to redesign the gaby-portfolio after reverting 28 commits of drifted experiments. Needed to define the visual system, page architecture, component library, theme system, and implementation sequencing — all while preventing the drift that happened last round.

## Options considered

### Collection page layout
- **40/60 text/carousel split** — more visual weight to imagery, text less dense
- **50/50 split (current)** — equal weight, text felt too dense
- **Different ratios** — not explored, 40/60 felt right immediately

### Carousel interaction
- **Scroll/swipe to rotate (chosen)** — keeps 3D depth, more intuitive than drag
- **Drag to rotate (current)** — works but less intuitive
- **Flat horizontal scroll** — loses the premium 3D feel

### Page navigation
- **Full-screen snap scroll everywhere** — cohesive premium experience
- **Normal scroll with snap only on collections** — inconsistent feel
- **Normal scroll everywhere** — less premium

### Homepage portfolio section
- **Interactive Image Accordion (21st.dev)** — high visual impact, matches vision
- **Keep current accordion** — functional but less impactful
- **Card grid** — too generic for a fashion portfolio

### UI element style
- **Liquid glass site-wide** — cohesive premium language for all interactive elements
- **Keep current flat style** — functional but not distinctive
- **Mix of styles** — inconsistent

### Text card treatment
- **Spotlight Card with glow** — strong visual presence at full-screen scale
- **GlowCard (existing)** — simpler, less impactful
- **No card treatment** — text feels disconnected from carousel

### Stage pills placement
- **Under carousel images as liquid glass labels** — matches image to process step
- **In text card (current)** — disconnected from the images they describe
- **Remove entirely** — loses process storytelling

### Theme system
- **3 themes: Dark Luxury (keep), Warm Ivory (keep), Catppuccin (add)** — variety without losing identity
- **Recolor dark to Midnight Bloom** — user likes current dark colors
- **Keep 2 themes** — misses opportunity for Catppuccin

### Typography
- **Refine weight/spacing inspired by Cosmic Night, keep Cormorant + Manrope** — already good fonts, just need polish
- **New fonts** — unnecessary, current pair works for luxury fashion

### Copy strategy
- **Original site base + Claude improvements, Gaby approves** — best of both worlds
- **Verbatim from original** — loses better descriptions
- **All Claude-written** — may not match Gaby's voice

## Decision
Full redesign with 4-wave incremental delivery:
1. Foundation (themes, components, typography)
2. Homepage (accordion, snap scroll, liquid glass)
3. Collection pages (snap panels, 40/60 split, carousel, loop scroll)
4. Copy + polish

Each wave has a deploy + review checkpoint before proceeding.

## Rejected (and why)
- **Midnight Bloom recolor for dark theme**: User likes current Dark Luxury colors
- **Drag-to-rotate carousel**: Less intuitive than scroll/swipe
- **Pills in text card**: Disconnected from the images they describe
- **All-at-once implementation**: Caused drift last time — incremental with checkpoints prevents this
- **New fonts**: Cormorant + Manrope already fit the luxury fashion aesthetic

## Open questions going into the spec
- Catppuccin token values need to be defined (research the 21st.dev theme)
- Exact typography refinements TBD after researching Cosmic Night reference
- Loop scroll implementation approach (GSAP Observer vs custom)
- How 21st.dev component code translates to our React/Next.js setup (need to fetch and study)

## References
- DESIGN-SPEC.md — full spec written and saved in repo root
- 21st.dev components saved in memory: reference_21st_components.md
