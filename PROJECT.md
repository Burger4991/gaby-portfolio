# Gaby Portfolio — Project State
*Last updated: 2026-03-21 21:00*

## Phase
complete (CollectionScrollFX looping carousel shipped)

## Plan
- **File:** `docs/superpowers/plans/2026-03-21-collection-scroll-looping.md` — complete
- **Spec:** `docs/superpowers/specs/2026-03-21-collection-scroll-looping-design.md`
- **Current step:** Done — both tasks implemented, spec + quality reviewed, pushed
- **Decided:** GSAP Observer (not ScrollTrigger), full-screen panels, 40/60 split, modulo looping, progress dots display-only, subtitle suppressed
- **Open:** Vercel deploy to verify on mobile/desktop; copy alignment with Gaby's original site (needs URL)

## Implementation
- **Active:** Nothing — complete
- **Done:**
  - `CollectionScrollFX.tsx` rewritten as looping GSAP Observer carousel (`3ec0bfc`)
  - `SplitScrollCollection.tsx` simplified to 15-line data mapper (`4a7006f`)
  - Build passes, all `/work/[slug]` pages statically generated, pushed

## Review / Eval
- **Status:** complete
- **Findings:** Spec compliant (14/14 requirements). Quality reviewers flagged tween cleanup + stale closure — both already applied by implementer. `@ts-ignore` on GSAP Observer import for macOS casing quirk.
- **Actions needed:** None

## Decisions Log
- 2026-03-21: 40/60 grid — collection page uses `2fr 3fr` (text narrower, carousel wider)
- 2026-03-21: Vertical divider — gold gradient `::after` pseudo-element, option B (fades top/bottom)
- 2026-03-21: 3D carousel — FACE_WIDTH 200→280, CARD_HEIGHT 280→360, FACE_PADDING 6→18px, draggable=false, horizontal wheel/trackpad scroll added
- 2026-03-21: Text reveal — IntersectionObserver triggers staggered fade-up (0→320ms) on section enter
- 2026-03-21: FullScreenScrollFX placement B — FX sits at top of collection page as section picker, existing split layout continues below
- 2026-03-21: GlowCard + GlowingShadow + FullScreenScrollFX — all approved to use exact 21st.dev component code
- 2026-03-21: CollectionScrollFX architecture — GSAP Observer for infinite looping; body overflow lock via useLayoutEffect; goTo inside useLayoutEffect to avoid stale closure; tween cleanup on unmount
- 2026-03-21: Subtitle suppressed — `category.subtitle` dropped from overlay (too long); label truncated with ellipsis

## Open Questions
- Progress dots: decided display-only (not clickable). No change needed.

## Watch Out For
- `gsap/Observer` import gets `// @ts-ignore` — TypeScript casing conflict on macOS, runtime is fine
- Lint warnings about refs in GSAP cleanup are false positives — not real bugs
- Next.js pinned to 15 — do not upgrade
- ESLint: use `npm run lint`, not `npx eslint`
- Pre-existing lint errors in `Contact.tsx`, `Navbar.tsx`, `PullQuote.tsx` — don't fix in unrelated work
