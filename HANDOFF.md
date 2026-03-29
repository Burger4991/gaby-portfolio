# Handoff — 2026-03-29

## What we were doing
Major session: brainstormed collection page redesign, implemented Wave 3.5 + Wave 4, then pivoted to removing FullScreenScrollFX entirely due to irreconcilable scroll conflicts between section navigation and carousel interaction. Simplified to normal vertical scroll site-wide.

## Where we left off
Desktop collection pages work well (40/60 split, 3D carousel, lightbox). Mobile has issues:
- **Image strip swipe doesn't work** on mobile despite touch-action:pan-x fix — needs further debugging on actual device
- **Homepage accordion** works but mobile layout (vertical stack) looks like plain cards, not interactive accordion
- **Lightbox** works on both desktop and mobile (arrows + keyboard nav)
- **Desktop is in good shape** — user confirmed "web version is fine for now"

## This session's decisions
- Removed FullScreenScrollFX from entire site — root cause of all scroll/overlap/nav conflicts
- Collection pages: normal vertical scroll, 40/60 grid on desktop, dedicated MobileImageStrip on mobile
- Homepage: simple stacked sections with gradient backgrounds, accordion with 70vh container
- Lightbox: larger cards (1100px max, 3/4 aspect), SpotlightCard glow, mobile nav below image
- LiquidGlass stays on: Back button, text cards, stage pills, lightbox buttons (NOT on nav labels)
- Copy can be enhanced by Claude (doesn't need to match original site exactly)
- Feature-dev workflow is the standard for all portfolio work going forward

## What's next
1. **Fix mobile image strip swipe** — the touch-action:pan-x approach isn't working. May need a JS-based swipe handler or different approach entirely
2. **Mobile accordion** — make it feel more interactive (bigger active panel, clearer tap affordance)
3. **Visual polish pass** — gradients, spacing, typography refinements on both mobile and desktop
4. **Test on real devices** — Playwright mobile viewport doesn't catch all touch behavior issues
5. **Merge PR #3** when mobile issues resolved

## Watch out for
- Mobile Safari swipe gestures conflict with horizontal scroll — `touch-action: pan-x` may not be enough
- The 3D carousel `preventDefault` on wheel events blocks page scroll on desktop — current fix only prevents default on horizontal scroll
- Vercel preview caching — user needs incognito to see latest changes
- `FullScreenScrollFX.tsx` is deleted — don't try to import it

## Project state → see PROJECT.md
Phase: implementing | Resume at: fix mobile collection page experience
