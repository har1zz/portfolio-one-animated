# PixelateBanana portfolio

Next.js 15 + TypeScript + Tailwind CSS + Framer Motion + GSAP. A studio site with a pixel-banana hero, a scroll-driven design / build / automate story, a filterable portfolio, case-study pages and a project brief form.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint     # type check
```

## Add your projects and screenshots

All portfolio content lives in `src/data/projects.ts`.

1. Put images in `public/assets/`.
2. For each project set `image` (cover) and `gallery` (case-study images), for example `image: "/assets/husn-cover.jpg"`.
3. Set `outcome` only to a real, verified result. `null` shows a "To add" note instead of inventing one.

Projects without images show a generated pixel placeholder tagged "Screenshot pending". Add or remove entries to change what is public. `/work/[slug]` pages are generated from this list.

## Project brief form

The form posts to `/api/brief`, which validates with Zod and emails the brief through [Resend](https://resend.com). Copy `.env.example` to `.env.local` and set:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `BRIEF_TO_EMAIL` | Where briefs are delivered |
| `BRIEF_FROM_EMAIL` | Verified sender (default: Resend's onboarding sender) |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL for metadata |

Without the email variables the API answers 503 and the form shows the brief to copy and email manually, and says nothing was sent. The in-memory rate limit is per server instance; use a shared store for strict limits.

## Structure

```
src/app            routes: / , /work/[slug], /api/brief
src/components     Hero, Story (GSAP ScrollTrigger), Work (Framer Motion), Services, Contact, Cursor, TransitionProvider
src/data           projects.ts
src/lib            pixel helpers, brief schema, GSAP setup
src/app/globals.css  design tokens and component styles
```

Page changes play a pixel-grid wipe (`TransitionProvider`). The custom cursor and magnetic buttons run on desktop pointers only and respect reduced motion.

## Notes

- Fonts (Anybody, Geist, IBM Plex Mono) load through `next/font/google`, so the build needs internet access to Google Fonts.
- `pixelatebanana-portfolio/` is the earlier standalone HTML version, kept for reference. It is not part of the Next.js build.
