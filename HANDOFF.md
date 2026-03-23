# Handoff — 2026-03-21

## What we were doing
Cleanup + polish pass on the gaby-portfolio after the CollectionScrollFX looping carousel shipped.

## Where we left off
**Committed `d1ba3dd` on `feat/copy-alignment-clickable-dots`. NOT pushed yet.**

Four tasks completed this session:
- **pixel-agents/** — gitignored + removed from git index (`git rm --cached --force`)
- **Copy pass** — resort + bridal section descriptions rewritten to first-person, process-specific voice matching cutsew originals. Both categories flagged with `// TODO: PENDING GABY REVIEW` in `portfolioData.ts` (no authoritative copy on original site)
- **Carousel vertical alignment** — `CollectionCarousel.tsx` refactored: `CaptionBar` and `DragHint` now always render at fixed heights (42px + 24px), making the image zone consistently `CARD_HEIGHT + 40 = 400px` regardless of section type
- **FullScreenScrollFX audit** — NOT dead code; `Portfolio.tsx` renders it for the home page (`mode="home"`). Keep it.

## Decisions made
- Resort + bridal copy: improved voice (first-person, process details) but flagged pending review — Gaby needs to verify/correct before launch since original site has no resort/bridal pages to source from
- `FullScreenScrollFX` stays — it's the home page scroll section, not dead code
- `pixel-agents/` stays on disk locally, just invisible to git
- Vercel URL not determined — needs Vercel dashboard check (project name: `gaby-portfolio`)
- TypeScript exit 0; only errors are from `pixel-agents/` which is now gitignored

## What's next
- [ ] Push branch + open PR to merge into main
- [ ] Verify Vercel deploy on mobile + desktop — check Vercel dashboard for live URL (gaby-portfolio project), test CollectionScrollFX on real device
- [ ] Gaby review: resort + bridal copy (flagged with TODO in portfolioData.ts)

## Watch out for
- `package.json` / `package-lock.json` have unstaged changes (playwright got added by a lint run) — do NOT commit them
- `FullScreenScrollFX` is used by `Portfolio.tsx` home page — don't delete it
- Original site (gabrielagamargo.com) only has RTW/Cut & Sew section — resort, bridal, illustrations copy was Claude-written
