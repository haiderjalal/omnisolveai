# OmniSolve AI — Website

A cinematic, fully animated 3D homepage for OmniSolve AI. One story from top to bottom:
**scattered → connected → solved**, told through a real-time WebGL globe built from the logo's
own geometry.

> **Status:** homepage complete and tested (not deployed). Inner pages, a CMS and real content are
> follow-ups — see [docs/pitch-guide.md](docs/pitch-guide.md).
> **Copy is draft.** Anything marked `// CONFIRM` in `src/content/` must be replaced or verified
> by OmniSolve before launch — see [docs/content-guide.md](docs/content-guide.md).

Screens from the real build live in [docs/pitch/stills](docs/pitch/stills).

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
```

Requires Node 20.9+ (developed on Node 24). The project uses **Next.js 16** with Cache Components
enabled, which differs from earlier versions — `AGENTS.md` points to the docs bundled in
`node_modules/next/dist/docs/`.

| Script                               | What it does                                                             |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `npm run dev`                        | Dev server                                                               |
| `npm run build` / `npm run start`    | Production build / serve it                                              |
| `npm run lint` · `npm run typecheck` | ESLint · `tsc --noEmit`                                                  |
| `npm test`                           | Unit tests (Vitest)                                                      |
| `npm run test:e2e`                   | End-to-end + accessibility tests (Playwright). Run `npm run build` first |
| `npm run format`                     | Prettier                                                                 |
| `npm run generate:land-mask`         | Rebuilds the globe's continent data from Natural Earth                   |
| `node scripts/capture.mjs …`         | Screenshot the running site at chosen scroll positions                   |
| `node scripts/capture-pitch.mjs`     | Regenerate every pitch still in `docs/pitch/stills`                      |

## What's inside

```
src/
  app/                 routes: page, layout, API (inquiries, health), error/404, sitemap, robots, OG image
  components/
    layout/            Navbar, ChapterRail, Footer, FloatingContact, SmoothScroll
    motion/            SplitText, Reveal, Odometer, TiltCard, ScrubWords, PageEffects …
    ui/ shared/        Button, SectionHeading, CoverArt
  features/            one folder per chapter: hero, story (gap), industries, services, proof,
                       team, security, pricing, people, finale, faq, contact — plus globe (the 3D scene)
  content/             ALL copy, typed — site.ts, home.ts
  lib/                 gsap, lenis, reveal, scrollState, email (Resend), rate limit, logger, validations
  services/            business logic (inquiry service, notifiers) — no UI, no HTTP
  store/ hooks/ utils/ types/ constants/
e2e/                   Playwright specs (story, contact, API, accessibility, resilience)
docs/                  architecture, decisions, API, content, performance, pitch guide, original plan
scripts/               land-mask generator, capture tools
```

How it fits together is in [docs/architecture.md](docs/architecture.md); why it's built this way
(and where it deliberately differs from the original plan) is in [docs/decisions.md](docs/decisions.md).

## Environment

Copy `.env.example` to `.env.local`. Nothing is required to run the site.

| Variable                                                   | Purpose                                                                                                                                                                |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                     | Canonical URL (metadata, sitemap, Open Graph). **Setting it on a production build also makes the site indexable** — previews and local builds are `noindex` by design. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`                              | Digits only. When empty the floating button scrolls to the contact form instead.                                                                                       |
| `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`, `INQUIRY_TO_EMAIL` | Enables real inquiry emails. If any is missing the API runs in **demo mode** (validates and confirms, sends nothing).                                                  |
| `INQUIRY_RATE_LIMIT`                                       | Max submissions per IP per 10 min (default 5).                                                                                                                         |

## Quality

- **49 unit tests** and **33 end-to-end tests** pass, including WCAG 2.1 A/AA axe scans of the
  hero, proof section, contact form and the reduced-motion layout; keyboard (skip link, modal
  menu); no-JavaScript rendering; and API validation/security behaviour.
- `lint`, `typecheck` and `build` are clean.
- Lighthouse (lab): Accessibility **100**, Best Practices **100**, SEO **100** (production config).
  Performance is strong on desktop and weaker on throttled mobile — the honest numbers, how they
  were measured, and what would improve them are in [docs/performance.md](docs/performance.md).

## Deploying

Not deployed yet — nothing here has been published. When approved: import to Vercel, set the
environment variables above, and set `NEXT_PUBLIC_SITE_URL` for production. Preview deployments stay
out of search engines automatically.
