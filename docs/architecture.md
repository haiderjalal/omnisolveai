# Architecture

## The idea in one diagram

```
 scroll position (Lenis)                      pointer · drag · intro timeline
        │                                                 │
        ▼                                                 │
 StoryDriver  ── per chapter ──►  chapterProgress{}       │   (DOM scenes read this:
 (chapters.ts keyframes)          activeChapter (store)   │    carousel, scrubbed words…)
        │                                                 │
        ▼                                                 ▼
  target ───── damp every frame ─────────────────────►  live ──► GlobeScene (R3F)
 (what the story wants)                                  (what is drawn)   │
                                                                           ▼
                                           one persistent <Canvas> behind the page
```

Everything the 60 fps loop reads lives in **plain mutable objects**
(`features/story/sceneState.ts`), never React state. React only owns low-frequency UI state
(active chapter, quality tier, drafted message…) in a small Zustand store.

## The story engine (`features/story`)

- `chapters.ts` defines each chapter's globe pose as a **from → to** keyframe pair plus an optional
  `during()` refinement (the industries tour, the network breaking apart…). Each chapter starts
  exactly where the previous one ended — a unit test enforces this, so the globe can never jump.
- `StoryDriver` turns the scroll position into `chapterProgress` for every chapter and solves the
  active chapter's keyframes into `target`. Boundaries are "section top reaches viewport centre".
  Sticky chapters (gap, industries, services) report progress while pinned; flow chapters while they
  cross the screen.
- Sticky scenes use CSS `position: sticky` inside a tall wrapper — no scroll-jacking, no pin spacers.
- The driver caches scroll position from scroll events and does **no work while the page is at
  rest** (see `lib/scrollState.ts` and the performance notes).

## The 3D scene (`features/globe`)

One fixed canvas, loaded lazily after first paint. Layers, back to front:

| Layer            | Technique                                                                                                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Planet body      | opaque sphere, fresnel rim, dissolves into the page background as it dims                                                                                               |
| Continents       | ~5–9k dot-matrix points sampled from a 1° Natural Earth land mask (`data/landMask.ts`, generated)                                                                       |
| Network          | jittered Fibonacci nodes + nearest-neighbour edges; one shader displaces points for the intro and the "break apart"; packets travel edges in the vertex/fragment shader |
| Orbit ring       | custom tapered tube (the logo's swoosh), draws itself in, carries a travelling highlight                                                                                |
| Atmosphere, dust | additive halo; sparse parallax particles                                                                                                                                |
| Bloom            | high tier only                                                                                                                                                          |

Geometry is **deterministic** (seeded PRNG): identical on server and client, no `Math.random()` during render.
All layers share one set of uniform objects — see `materials.ts` for why materials are built by hand
(react-three-fiber copies `uniforms` props).

### Quality tiers

`detectTier` picks `high` / `medium` from cheap signals (no throwaway WebGL context). The canvas is
created empty, the renderer is inspected (software rasterisers are forced to `medium`), and only
then is the scene mounted. A frame-rate monitor can step `high` down at runtime. If WebGL cannot
start, an error boundary falls back to the static logo globe. **Reduced motion** renders one calm
frame (no choreography).

## The motion system (`components/motion`)

The principle: **text and cards are plain server-rendered markup; CSS does the animating; one small
client controller flips the switches.**

- `SplitText` splits headings into masked words/letters **on the server** — no layout measurement,
  no layout shift, real text in the first paint (good for LCP/SEO). Headings carry an `aria-label`.
- `Reveal`, `Odometer`, `DrawOnReveal`, `TiltCard`, `ButtonLink` are likewise static markup with
  `data-*` hooks. `PageEffects` (the only client component for these) observes reveals and delegates
  pointer tilt / magnetic buttons — which keeps hydration cheap.
- Hidden "before reveal" states exist only under `html.js:not(.rm)`; an inline pre-paint script sets
  those classes, and a CSS failsafe un-hides everything after 4 s if hydration ever fails.
- Scroll-scrubbed pieces (`ScrubWords`, `GapFragments`, the service carousel) read
  `chapterProgress` and redraw only when it changes.

## Accessibility architecture

Semantic landmarks, one `h1`, skip link, `aria-current` on nav/rail, native `<dialog>` for the mobile
menu, native `<details name>` for the FAQ, labelled form fields with `aria-describedby` errors and
`role="alert"`. Every pinned scene has a plain stacked version under `prefers-reduced-motion`. The
canvas is `aria-hidden` and decorative; nothing essential lives only in WebGL. Unlit scrub-text keeps
AA contrast. Verified by automated axe scans (see `e2e/accessibility.spec.ts`).

## Inquiry pipeline (`app/api/inquiries`, `services`, `lib`)

```
ContactForm (RHF + lazily-loaded zod)  ──POST──►  route.ts  (thin: rate-limit → size cap → JSON → zod)
                                                       │
                                                       ▼
                                              InquiryService   honeypot · idempotency · sanitise
                                                       │
                                                       ▼
                                              EmailInquiryNotifier ─► Resend (fetch, 8 s timeout)
```

- Client and server validate with the **same** schema (`lib/validations/inquiry.schema.ts`).
- With no email configured the pipeline is in **demo mode**: it acknowledges but sends nothing.
- **There is no database yet**, so a failed notification returns an error (502) rather than silently
  losing the lead. Persisting inquiries (Supabase, per the project standards) with retried
  notifications is the next step — the notifier interface is where it plugs in.
- Rate limiting is in-memory (best effort on serverless); back it with a shared store before heavy traffic.
