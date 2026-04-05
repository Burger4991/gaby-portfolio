---
paths:
  - "**/*.tsx"
  - "**/*.ts"
  - "**/*.css"
  - "app/**"
type: note
area: tech
---

# Gaby Portfolio Development Rules

## Framework Constraints

- **Next.js 15 pinned** — do not upgrade without explicit instruction (breaking changes in minor versions)
- **App Router only** — no `pages/` directory. All routes in `app/`
- **No `use client` unless necessary** — prefer server components; add directive only for interactive elements

## Animation Stack

- **GSAP** for scroll-based animations (not Framer Motion for scroll)
- **Framer Motion** for component enter/exit transitions only
- **CollectionScrollFX** rearchitecture is pending — do not refactor scroll animation system without explicit "rearchitect CollectionScrollFX" instruction
- Never modify animation timing values without testing on mobile (animations feel 2x faster on mobile)

## Design System

- Dark aesthetic — never introduce light backgrounds without approval
- All new components must match existing type scale and color tokens
- Check `tailwind.config.ts` for custom tokens before adding inline styles

## Before Deploying

```bash
npm run build  # must complete without errors
npm run lint   # zero warnings on new files
```
Vercel auto-deploys on push to main — no manual deploy step needed.
