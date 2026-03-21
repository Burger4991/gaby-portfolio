# Gaby Portfolio — Project State
*Last updated: 2026-03-21 09:38*

## Phase
planning → implementing (spec not written yet; ready to proceed)

## Plan
- **File:** `docs/superpowers/specs/2026-03-21-portfolio-effects-design.md` — does not exist yet, writing is the next step
- **Current step:** Spec writing → spec review → implementation plan → build
- **Decided:** All three effects approved using exact 21st.dev component code; FullScreenScrollFX placement is option B (section picker at top, existing split layout below)
- **Open:** Spec not written; implementation plan not written; build order TBD (GlowCard → GlowingShadow → FullScreenScrollFX home → FullScreenScrollFX collection)

## Implementation
- **Active:** Nothing built yet — in pre-implementation planning
- **Done:** UI polish pass complete (40/60 grid, vertical divider, 3D carousel restored, text reveal); brainstorming complete for 3 new features
- **Blocked:** None — waiting on spec

## Review / Eval
- **Status:** not started
- **Findings:** n/a
- **Actions needed:** Spec review loop before building (dispatch spec-document-reviewer, fix issues, get sign-off)

## Decisions Log
- 2026-03-21: 40/60 grid — collection page uses `2fr 3fr` (text narrower, carousel wider)
- 2026-03-21: Vertical divider — gold gradient `::after` pseudo-element, option B (fades top/bottom)
- 2026-03-21: 3D carousel — FACE_WIDTH 200→280, CARD_HEIGHT 280→360, FACE_PADDING 6→18px, draggable=false, horizontal wheel/trackpad scroll added
- 2026-03-21: Text reveal — IntersectionObserver triggers staggered fade-up (0→320ms) on section enter
- 2026-03-21: FullScreenScrollFX placement B — FX sits at top of collection page as section picker, existing split layout continues below
- 2026-03-21: GlowCard + GlowingShadow + FullScreenScrollFX — all approved to use exact 21st.dev component code

## Open Questions
- None blocking — ready to write spec

## Watch Out For
- `style jsx` in pasted components — needs `'use client'` directive
- GlowCard uses Tailwind classes — verify Tailwind 4 class names match
- FullScreenScrollFX uses GSAP ScrollTrigger — register once via GSAPProvider
- Next.js pinned to 15 — do not upgrade
- "Improve X" ≠ "replace X" — the 3D carousel was previously replaced by mistake; modify, don't swap
- ESLint: use `npm run lint`, not `npx eslint` directly
