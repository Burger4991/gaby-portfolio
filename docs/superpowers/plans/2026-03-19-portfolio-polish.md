# Portfolio Polish — Implementation Plan

> **Status as of 2026-03-19:** Tasks 1–6 complete. Tasks 7–8 pending (blocked on Gaby's edited images).

**Goal:** Full portfolio site with real images from gabrielagamargo.com wired into the carousel and collection pages.

**Architecture:** Data layer (`portfolioData.ts`) drives both the carousel on the home page and the split-scroll collection detail pages at `/work/[slug]`. Images live in `src/assets/[collection]/[section]/` — originals scraped from the live site, edited crops to be provided by Gaby.

**Tech Stack:** Next.js App Router, Framer Motion, GSAP + ScrollTrigger, TypeScript.

---

## Completed Work

All six original tasks have been implemented and committed.

| Commit | What |
|--------|------|
| `c07c8b4` | fix(carousel): pointer events for rotation, remove drag-x lateral slide |
| `629d36f` | fix(pullquote): single ScrollTrigger for word reveal, fixes scrub jank |
| `fabd7c6` | feat(about): real bio content + updated hero stats from gabrielagamargo.com |
| `736765d` | feat(data): add description, outcome, processStages to all portfolio categories |
| `38c72b0` | feat(collections): split-scroll collection pages with sticky process panel |
| `aa87796` | feat(assets): scraped + organized 293 images from gabrielagamargo.com |

### What's implemented

- **ThreeDCarousel** — pointer-event rotation with spring inertia, layoutId expand overlay, "Process →" link per card routing to `/work/[slug]`
- **PullQuote** — single ScrollTrigger word reveal
- **About** — real bio, real skills, word-by-word scrub animation
- **Hero** — real stats (10+ years, 5+ design lead, 300K+ units)
- **portfolioData.ts** — real labels, descriptions, outcomes, processStages; `picsum.photos` placeholders for all image URLs (pending Task 7)
- **SplitScrollCollection** — sticky left panel (title, description, outcome callout, process pills), scrollable right (stage images + captions), mobile collapse
- **`/work/[slug]`** — static params from categories, async params pattern for Next.js 16
- **`src/assets/`** — 293 original images organized into section subfolders

### Asset structure (293 files)

```
src/assets/
├── resort/
│   ├── stephanie-gottlieb/   (15 imgs)
│   ├── mercedes-salazar/     (18 imgs)
│   ├── mimi-yoga/            (26 imgs)
│   ├── private-label/        (16 imgs)
│   ├── hpset/                (9 imgs)
│   ├── ephyra/               (12 imgs)
│   └── ariel/                (10 imgs)
├── cutsew/
│   ├── chunky-knits/         (14 imgs)
│   ├── basics-intimates/     (15 imgs)
│   ├── vogue-mexico/         (22 imgs)
│   ├── crochet-patchwork/    (26 imgs)
│   └── silky-handloom/       (22 imgs)
├── bridal/
│   ├── galia-lahav/          (4 imgs)
│   ├── resort-bride/         (19 imgs)
│   ├── night-time/           (21 imgs)
│   ├── satin-sara/           (16 imgs)
│   └── butterfly-bridal/     (13 imgs)
├── illustrations/
│   ├── procreate/            (1 img)
│   └── markers-pencils/      (5 imgs)
├── hero/    (1 img)
├── about/   (3 imgs)
└── misc/    (1 img)
```

Images are originals as served by Canva CDN. Gaby will provide edited/cropped versions — these go into `_edited/` subfolders alongside the originals.

---

## Blocking Dependency

**Task 7 cannot start until Gaby provides edited images.**

The originals are downloaded and organized. The site currently uses `picsum.photos` placeholder URLs everywhere in `portfolioData.ts`. Once Gaby delivers crops, the workflow is:

1. Gaby places edited files into `src/assets/[collection]/[section]/_edited/[filename]`
2. We update `portfolioData.ts` `items[]` and `processStages[]` with the real paths
3. Remove `unoptimized` prop from Next.js `<Image>` components once images are local

---

## Task 7: Wire real images into portfolioData.ts

**Status:** Blocked — waiting for Gaby's edited crops.

**Files:**
- Modify: `src/data/portfolioData.ts`
- Verify: `src/components/ThreeDCarousel.tsx` (remove `unoptimized` if needed)
- Verify: `src/components/SplitScrollCollection.tsx` (remove `unoptimized` if needed)

**What to do when edits arrive:**

- [ ] **Step 1: Confirm edited files are in place**

Check that Gaby's files have been placed into the `_edited/` subfolders:

```
src/assets/resort/stephanie-gottlieb/_edited/
src/assets/resort/mercedes-salazar/_edited/
... etc.
```

- [ ] **Step 2: Decide image selection per category**

For `items[]` (carousel cards) — pick 3–5 strong hero images per collection. These should be portrait-oriented (the carousel card is ~240×320). One image per section is typical.

For `processStages[]` — pick 1 representative image per stage/section. Landscape or square works (the right panel renders at `aspect-ratio: 4/3`).

Write down the selections before touching code — filenames are hashes so keep a mapping:

```
Resort items:
  r1 Stephanie Gottlieb collab → src/assets/resort/stephanie-gottlieb/_edited/[hash].jpg
  r2 Mimi Yoga activewear      → src/assets/resort/mimi-yoga/_edited/[hash].jpg
  r3 Private Label             → src/assets/resort/private-label/_edited/[hash].jpg

Resort processStages:
  Research   → src/assets/resort/stephanie-gottlieb/_edited/[hash].jpg
  Concept    → src/assets/resort/mercedes-salazar/_edited/[hash].jpg
  ... etc.
```

- [ ] **Step 3: Update portfolioData.ts with real image paths**

Replace each `picsum.photos` URL with the corresponding local path. Local Next.js assets in `src/assets/` are served from `/` — the path format is:

```ts
// src/assets/resort/stephanie-gottlieb/_edited/abc123.jpg
// becomes:
src: '/assets/resort/stephanie-gottlieb/_edited/abc123.jpg'
```

> **Note:** Next.js serves `src/` assets only if configured. Confirm the project uses `public/` or `src/assets` aliased correctly. If images must be in `public/`, move them there and update paths accordingly.

Actually — verify where Next.js expects static assets:

```bash
ls public/
# If public/ exists and assets aren't there, images must be moved to public/assets/
```

If images need to move to `public/`:

```bash
cp -r src/assets/ public/assets/
# Then paths become: src: '/assets/resort/...'
```

- [ ] **Step 4: Remove unoptimized prop from Image components**

Once images are local (not external CDN URLs), Next.js image optimization works. Remove `unoptimized` from:
- `src/components/SplitScrollCollection.tsx` — the stage image `<Image>`
- `src/components/ThreeDCarousel.tsx` — if it was added

- [ ] **Step 5: Visual check on all four carousels and collection pages**

```bash
npm run dev
```

Check:
- Home: all four carousels show real images with correct titles
- `/work/resort` — left panel correct, right panel shows 5 stage images in order
- `/work/cutsew`, `/work/bridal`, `/work/illustrations` — same
- Mobile: collection pages stack cleanly

- [ ] **Step 6: Build check**

```bash
npm run build
```

Expected: clean build, no broken image paths, no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add src/data/portfolioData.ts src/components/
git commit -m "feat(images): wire real edited assets into carousel and collection pages"
```

---

## Task 8: Deploy and verify on Vercel

**Status:** Pending — do after Task 7 is complete.

**Files:** None (deploy only)

- [ ] **Step 1: Push to remote**

```bash
git push
```

- [ ] **Step 2: Confirm Vercel build succeeds**

Watch the Vercel dashboard build log. Common failure points:
- `next/image` domain not configured for external URLs (not an issue once images are local)
- Missing `generateStaticParams` coverage (already handled — `dynamicParams = false`)
- TypeScript errors surfacing only in production build

- [ ] **Step 3: QA all collection pages on the live URL**

Check each route:
- `/` — hero, carousels, about, pullquote
- `/work/resort`
- `/work/cutsew`
- `/work/bridal`
- `/work/illustrations`

Verify on mobile viewport (375px) — collection pages should stack.

---

## Notes for Future Work

- **Illustrations page under-scraped**: Only 6 images captured (procreate + markers-pencils) due to Canva lazy loading. The page likely has more sections. Gaby can provide additional originals directly if needed.
- **Hero image**: One image in `src/assets/hero/` — wire into the hero component when Gaby confirms which image she wants as the hero.
- **About photo**: Three images in `src/assets/about/` — wire the correct one into the About section image column placeholder.
- **`_edited/` subfolder convention**: When Gaby delivers crops, she (or we) should place them at `src/assets/[collection]/[section]/_edited/[original-filename]` so originals and edits are always paired.
