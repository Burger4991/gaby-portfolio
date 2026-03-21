# Gaby Cárdenas — Portfolio

Fashion design portfolio for Gaby Cárdenas. Built with Next.js 15 and deployed on Vercel.

## Stack

- **Next.js 15** (App Router, pinned — do not upgrade)
- **React 19**
- **Tailwind CSS 4**
- **GSAP** — scroll-driven animations via `GSAPProvider` + `ScrollTrigger`
- **Framer Motion** — 3D cylindrical carousel (`ThreeDCarousel`)
- **Resend** — contact form email delivery

## Routes

- `/` — home page with section components
- `/work/[slug]` — collection detail pages, statically generated

All content lives in `src/data/portfolioData.ts` — the single source of truth for copy, images, and collection structure.

## Development

```bash
npm install
npm run dev      # localhost:3000
npm run lint     # run before committing (no test suite)
npm run build    # production build
```

## Environment variables

Required for the contact form. Set in Vercel dashboard or `.env.local`:

```
RESEND_API_KEY=...
GABY_EMAIL=...
```

## Deployment

Vercel — pushes to `main` auto-deploy. No manual steps needed.

## Known constraints

**Next.js is pinned to 15** — Next.js 16 Turbopack production builds break `work/[slug]` page generation. Do not upgrade. See `CLAUDE.md` for full architecture notes.
