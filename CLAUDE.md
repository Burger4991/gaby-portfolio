# gaby-portfolio

Next.js 15 App Router portfolio site for Gaby Cohen — two routes (home + `/work/[slug]`), fully static, dark/light themes.

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run lint     # ESLint
```

No test suite. Lint before committing.

## Environment Variables

Two env vars required for the contact form (set in Vercel or `.env.local`):

```
RESEND_API_KEY=...
GABY_EMAIL=...   # recipient address for contact form submissions
```

`from` address in `sendEmail.ts` is currently `onboarding@resend.dev` (Resend dev default) — swap to a verified domain for production.

## Landmines

**Next.js pinned to 15 — do not upgrade to 16+.** Next.js 16 Turbopack production builds omit the `work/[slug]` page entry file, causing collection pages to 404 in production (compilation succeeds but `generateStaticParams` collection fails). ESLint runs with `ignoreDuringBuilds: true` due to ESLint 9 + legacy `.eslintrc.json` incompatibility in Next.js 15's build lint step — lint manually with `npm run lint`.

**Single source of truth for content:** all portfolio data lives in `src/data/portfolioData.ts`. Editing copy, images, sections, or categories means editing this file only. Image assets in `public/assets/` organized by category.

**Theme tokens:** always use `var(--color-*)` rather than hardcoded colors. Tokens defined in `globals.css` on `html[data-theme]`.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) — routing, data layer, theme system, animation stack (GSAP + Framer Motion), key components, fonts, and styling approach.
