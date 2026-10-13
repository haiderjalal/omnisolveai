# OmniSolve AI — Website Revamp Plan

> Status: **IMPLEMENTED (homepage).** This is the original plan, kept for reference. What was built,
> and where it deliberately differs, is in [decisions.md](decisions.md); the architecture is in
> [architecture.md](architecture.md); measured performance is in [performance.md](performance.md).
> Goal: a cinematic, fully animated, 3D website that tells one story from top to bottom, built to be pitched to the owner.

---

## 0. TL;DR

- **Concept: "Scattered → Connected → Solved."** Your logo is already a story: a network of nodes wrapped around a globe, with an orbit ring. The website _is_ that globe. It assembles on load, breaks apart when we talk about the problem, re-forms as we show the solution, and lights up fully at the call to action.
- **One real-time 3D globe** (built from the logo's own geometry) lives behind the whole page and is driven by scroll. On top of it: 3D-depth UI (tilt cards, ring carousel), and **every piece of text animated** through one consistent motion system.
- **The old 22-section scroll becomes 11 chapters**, each with its own visual form, so the page reads as a sequence instead of a stack of card grids.
- **Build the riskiest, most impressive slice first** (Hero + 2 chapters), you review it, then I build the rest. Nothing gets deployed or shared externally without your say-so.
- **I need real copy from you** (Section 9). The screenshot is too low-resolution to read body text, and I couldn't find a live site. Everything below uses the headings I could read; all other copy is placeholder until you send it.

---

## 1. What I found

### 1.1 The old site (from the screenshot — 171×1600 px, so headings are readable, body copy is not)

| #   | Old section                               | What it contains                                                                                                      |
| --- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Nav                                       | Logo, ~6 links, 2 dark CTA buttons                                                                                    |
| 2   | Hero                                      | "Enterprise AI and software, **built to scale.**" + paragraph + 2 CTAs + small particle-globe visual + logo/trust row |
| 3   | Engineers who already know your industry  | 5 industry columns                                                                                                    |
| 4   | From strategy to production               | 6 numbered service cards (01–06) + "view all"                                                                         |
| 5   | _(dark navy section — heading illegible)_ | 4 cards + mint CTA + text link                                                                                        |
| 6   | Backed by proof                           | 4 stats (approx. `120+`, `~96–98%`, `~48h`, `8+` — **unverified**)                                                    |
| 7   | Engineers for every stack                 | Tab filter + 6 tech chips                                                                                             |
| 8   | What clients say                          | 3 testimonials                                                                                                        |
| 9   | _(dark navy panel — heading illegible)_   | Left heading + button, right 4 stacked info cards                                                                     |
| 10  | Assemble the roles you need               | 5 role cards + CTA                                                                                                    |
| 11  | Three steps to start                      | 3 steps + CTA                                                                                                         |
| 12  | 120+ projects delivered                   | 3 case-study cards + "view all"                                                                                       |
| 13  | Your data and code stay protected         | 3 security cards                                                                                                      |
| 14  | Choose a plan that fits your stage        | 3 pricing cards (middle one featured)                                                                                 |
| 15  | The people behind the delivery            | 4 team members                                                                                                        |
| 16  | Notes from our engineers                  | 3 blog/insight cards                                                                                                  |
| 17  | Dark CTA banner                           | Heading + mint CTA                                                                                                    |
| 18  | Measured, not promised                    | 4 progress bars                                                                                                       |
| 19  | Questions clients ask us                  | FAQ accordion                                                                                                         |
| 20  | Let's discuss your project                | 3 contact cards + form                                                                                                |
| 21  | Pill link row                             | 5 pills                                                                                                               |
| 22  | Footer                                    | Logo, 4 link columns, contact row, legal, **floating WhatsApp button**                                                |

**My reading of the business** (please confirm): an AI + software delivery partner that also embeds engineers into client teams ("assemble the roles you need", "engineers for every stack", pricing plans, "people behind the delivery").

### 1.2 Diagnosis — why it needs a revamp (observable from the screenshot)

1. **No narrative.** About 15 sections share the identical "pill → H2 → card grid" pattern, so nothing is more important than anything else and the page has no arc.
2. **The hero is weak.** The one visual is a tiny globe inside a faint particle ring, while the logo is the strongest asset you have.
3. **Generic "template" look.** Light cards on white with a mint accent that is **not** in your logo (logo = indigo → teal).
4. **Flat CTA hierarchy.** Repeated dark buttons of the same weight.
5. **No motion identity.**

### 1.3 Asset audit (checked file by file)

| File                            | Finding                                                                                                  | Action                                                 |
| ------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| `OmniSolve AI.png`              | 1280×1280, transparent, full lockup (globe + "OmniSolve" + "AI"). **Best source.**                       | Use as master reference                                |
| `omnisolve-icon.png`            | 525×525, transparent, globe only                                                                         | Rebuild as vector + as 3D geometry                     |
| `omnisolve-logo-horizontal.png` | 700×180. **Contains the globe only; there is no wordmark in the file** (zero pixels right of the globe). | Compose a proper horizontal lockup myself              |
| `favicon.jpg.jpeg`              | 1280×1280 JPEG, grey background, **has a small "ai" badge in the bottom-right corner**                   | Do not use. Generate a clean favicon set from the icon |
| Old-site screenshot             | Low-res                                                                                                  | Replace with real copy (Section 9)                     |

**Brand colors (sampled from your logo):** deep indigo `#15144E` (nodes/wordmark), mid teal `#0A9EA2`, bright teal `#00C1AC` / `#03C9BC` ("AI" text and ring tip). The logo gradient runs indigo → teal diagonally.

---

## 2. Creative direction

### 2.1 Core idea

**The globe is the protagonist.** Visitors don't scroll past a globe; they scroll _through_ the story of one.

| Beat                 | Globe state                             | Meaning                                              |
| -------------------- | --------------------------------------- | ---------------------------------------------------- |
| Intro / Hero         | Assembles, rotates, alive               | "OmniSolve exists and it's built to scale"           |
| The Gap              | Edges dissolve, nodes drift apart       | Strategy → production is where things break          |
| Network / Orbit      | Camera tours clusters; network re-forms | Domain engineers + delivery capability close the gap |
| Proof / Team / Trust | Nodes light up with each proof point    | Evidence                                             |
| Finale               | Fully connected, global pulse           | Solved, now talk to us                               |

The **orbit ring** (the swoosh in the logo) is the recurring motif: it sweeps in the intro, becomes the services carousel, draws the process timeline, and fires the success state of the contact form.

### 2.2 What "full 3D" means here (so expectations are exact)

- **Real-time WebGL**: the globe, ring, particles, glow. Procedural geometry built from the logo, not a pre-rendered video.
- **3D-depth UI**: cards with perspective tilt, ring carousel using CSS 3D transforms, parallax layers.
- **Not**: every element modeled in 3D. That would be slow, inaccessible, and hurt SEO.

### 2.3 Visual language (proposed — tokens marked ◇ are derived, not sampled)

- **Dark-first cinematic.** Your horizontal logo was already designed for dark backgrounds. A few light "paper" sections (pricing, FAQ, form) keep long-form reading comfortable.
- Palette: Void `#050816` ◇ · Deep `#0A1030` ◇ · Indigo `#15144E` · Teal `#0A9EA2` · Bright teal `#00C1AC` (CTAs and highlights only) · Text `#E8ECF8` ◇ · Muted `#9AA3C7` ◇.
- Surfaces: frosted glass (`rgba(255,255,255,.04)` + 1px gradient border + blur), soft inner glows, no hard drop shadows.
- Gradient: indigo → teal at 135°, matching the logo.
- Type: **Sora** (display) · **Inter** (body) · **Geist Mono** (labels/numbers), all via `next/font`. The wordmark itself ships as SVG outlines, so it never depends on a font.

### 2.4 Motion principles

1. **Motion explains.** Every animation maps to the story; nothing moves "just because".
2. **One hero moment per screen.** Everything else supports it.
3. **Easing**: expo-out for reveals, power2 in-out for camera moves; durations 0.6–1.2 s; staggers 40–90 ms.
4. **Never gate reading.** Text is in the DOM from first paint; it is visible ≤ 400 ms after entering the viewport.
5. **Respect `prefers-reduced-motion`** with a calm fade-only version and a static globe.
6. **Native scroll is never hijacked.** Smoothing only; no scroll-jacking, no horizontal scroll takeover on mobile.
7. **No sound.**

---

## 3. The story — chapter by chapter

> "Series" in your message: I read this as a clear **sequence of chapters**. Tell me if you meant something else.
> All bridge copy (chapter 02) is **my proposed draft** and needs your approval.

| #   | Chapter                                                               | Absorbs from old site                                      | What the visitor sees and does                                                                                                                                                                                                                                                  | 3D / motion beats                                                                                                                    |
| --- | --------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 00  | **Intro** (≈3 s, plays on the page itself)                            | —                                                          | Nodes drift out of darkness, snap into the logo globe, the ring sweeps across, the wordmark resolves.                                                                                                                                                                           | Particle → network assembly, bloom flare when the ring completes. Skippable; once per session.                                       |
| 01  | **Hero** — "Enterprise AI and software, _built to scale._"            | Hero, trust row, nav, WhatsApp float                       | A huge globe bleeds off the right edge. Headline resolves character by character; "built to scale." in indigo → teal with a light sweep. 4 capability tags tethered to nodes. Primary CTA (teal, magnetic) vs ghost secondary — a clear hierarchy.                              | Mouse parallax, gentle drag-rotate, ring orbiting, data packets travelling edges.                                                    |
| 02  | **The Gap** (pinned)                                                  | New bridge seeded by "From strategy to production"         | A single statement appears and its words light up as you scroll: strategy is easy to buy; production is where it breaks.                                                                                                                                                        | Network integrity 1 → 0.2: edges dissolve, nodes drift apart, camera pushes in.                                                      |
| 03  | **The Network** — "Engineers who already know your industry" (pinned) | 5 industry columns                                         | Camera glides across the globe in 5 stops. Each stop lights a node cluster and slides in one industry card (icon draws itself, title masks in).                                                                                                                                 | Camera spline, cluster-highlight uniform, edges regrow — the gap closes.                                                             |
| 04  | **The Orbit** — "From strategy to production"                         | 6 service cards, "view all", dark 4-card section           | The logo's ring becomes a 3D carousel: six service cards ride it; scroll or drag to rotate; the active card faces you and expands.                                                                                                                                              | Ring in WebGL behind; cards are real DOM elements with CSS 3D transforms synced to the ring angle (keeps text accessible and sharp). |
| 05  | **The Proof** — "Backed by proof"                                     | Stats, 120+ projects, testimonials                         | Four giant odometer stats, then three case studies as depth-tilt cards with parallax imagery and metric chips; testimonials as a draggable stack.                                                                                                                               | Count-ups, clip-path image reveals, cursor spotlight.                                                                                |
| 06  | **The Team Builder** — "Assemble the roles you need"                  | Roles ×5, stack tabs + chips, three steps, dark info panel | Pick a stack tab and the tech chips reflow while matching globe nodes glow. Roles snap into slots. Three steps appear as a path-draw timeline with a glowing node travelling 01 → 02 → 03.                                                                                      | FLIP layout animation, SVG path scrub, store-driven node highlighting.                                                               |
| 07  | **Trust** — "Your data and code stay protected"                       | 3 security cards, "Measured, not promised" bars            | A wireframe shield forms out of network lines; cards stagger in; four SLA bars fill with a glow while numbers tick up.                                                                                                                                                          | Line-draw shield mesh, scrubbed bar fills.                                                                                           |
| 08  | **Plans** — "Choose a plan that fits your stage"                      | 3 pricing cards                                            | Cards in depth; the featured plan is raised with an animated gradient border and light sweep; features tick in.                                                                                                                                                                 | Tilt, conic-gradient border beam.                                                                                                    |
| 09  | **People & Insights**                                                 | Team ×4, "Notes from our engineers" ×3                     | Portraits in duotone that turn to color on hover; posts as horizontal parallax cards.                                                                                                                                                                                           | Duotone, parallax, name mask reveals.                                                                                                |
| 10  | **Finale** — "Let's discuss your project"                             | CTA banner, FAQ, contact + form, pill row, footer          | The camera pulls back to a fully connected globe; a global "solved" pulse travels the ring. FAQ opens with smooth height and icon morph. Form: floating labels, inline validation; on submit the ring sweeps a check — "Message received". Footer: oversized wordmark parallax. | Global pulse, ring-sweep success state.                                                                                              |

**Always present:** sticky glass navbar (hides on scroll down, returns on scroll up), a right-edge **chapter rail** (dots + names on hover, reinforcing the sequence), and the WhatsApp floating button carried over from the old site.

**Pinned scenes:** only 02, 03 and the process timeline in 06 pin. Everything else scrolls freely to avoid "scroll fatigue".

---

## 4. Text and UI animation system (one reusable kit, used everywhere)

| Element            | Treatment                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| Hero H1            | Per-character masked rise with slight blur-to-sharp; accent line gets a gradient light sweep            |
| Section headings   | Line-by-line masked reveal (lines split with SplitText, re-split on resize)                             |
| Paragraphs         | Line fade + rise, 40 ms stagger                                                                         |
| Manifesto (ch. 02) | Words go from 20 % to 100 % opacity, scrubbed by scroll                                                 |
| Eyebrow pills      | Scale in + SVG border draws itself                                                                      |
| Numbers / stats    | Odometer roll, once, on enter                                                                           |
| Buttons            | Magnetic hover, text-roll swap, arrow nudge, cursor-following glow                                      |
| Cards              | Staggered depth entrance (z + rotateX), 3D tilt ≤ 8°, cursor spotlight, gradient border follows pointer |
| Icons              | SVG stroke draw-on                                                                                      |
| Lists / chips      | FLIP reflow when filters change                                                                         |
| Form               | Floating labels, inline Zod messages, animated success/error                                            |
| Navbar             | Hide/show on scroll direction, active-chapter indicator                                                 |

All text stays real, selectable DOM text. Split spans carry `aria-hidden`, with the original string kept in an `aria-label`, so screen readers and SEO see exactly what is written.

---

## 5. 3D system

### 5.1 The globe (built from the logo's own anatomy)

- **Network shell:** ~220 nodes distributed on a Fibonacci sphere, with edges connecting nearest neighbours (single `LineSegments` geometry). Node sizes vary, as in the logo. Instanced mesh; colors follow the indigo → teal diagonal gradient.
- **Landmass:** dots sampled from a public-domain equirectangular land mask (Natural Earth), rendered as one instanced point cloud. This mirrors the logo: **half network, half continents**. During the story the network "grows" over the land.
- **Orbit ring:** custom tapered ribbon (thick-to-thin like the swoosh), tilted, emissive teal gradient, with a bright "satellite" node travelling along it and a glow trail.
- **Signals:** data packets travelling along edges, driven by a vertex-shader time offset (no per-frame JS cost).
- **Atmosphere:** fresnel rim glow, sparse depth-layered dust, mouse parallax.
- **Post-processing (high tier only):** low-radius bloom, vignette; chromatic aberration only during the intro flare.

### 5.2 Scene architecture (key decision — needs your approval)

**One persistent, fixed `<Canvas>` behind the entire page**, driven by a scroll-progress store. Each chapter declares a small state `{ camera, target, globeRotation, scale, networkIntegrity, highlightedClusters, ringState }`; GSAP ScrollTrigger scrubs between them, and the render loop reads from a mutable store (not React state, so no re-renders).

- ✅ One WebGL context (multiple contexts crash mobile browsers), one continuous camera, seamless transitions.
- ⚠️ More upfront engineering than per-section canvases; chapter states must be designed together.
- ❌ Rejected: a canvas per section (context limits, no continuity); Spline embed (heavy runtime, limited choreography control); pre-rendered video scrubbing (heavy, not interactive).

### 5.3 Performance budgets (targets, to be measured — not promises)

- **LCP:** the headline is server-rendered HTML; the 3D canvas mounts after first paint (`next/dynamic`, `ssr:false`, idle-start). A pre-rendered AVIF/WebP poster of the globe (≤ ~60 KB) shows instantly, then cross-fades into the live scene.
- **No blocking preloader.** The intro choreography plays on top of the real page, so content is never hidden behind a loader.
- **Frame budget:** 60 fps on a mid-range laptop; ≥ 30 fps on a mid-range phone. Draw calls < 30. DPR clamped to 1–1.75 (desktop) / 1–1.5 (mobile). Adaptive quality via drei's `PerformanceMonitor`.
- **Three quality tiers**, picked from WebGL support, device memory/cores, and a live FPS check:
  - **High:** full scene + bloom
  - **Medium:** fewer nodes, no post-processing
  - **Low / reduced-motion / no WebGL:** static poster + CSS-only motion, same content and layout
- Canvas pauses when the tab is hidden. 3D code ships as a separate async chunk.
- **Honest caveat:** CLAUDE.md sets Lighthouse ≥ 95 as a goal. Desktop should get there. Mobile may land lower because WebGL costs main-thread time; I will tune, report real numbers, and never hide them.

---

## 6. Tech stack and architecture

Follows `D:\Projects\CLAUDE.md` standards (see note in Section 11).

| Layer         | Choice                                                                                    | Why                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Framework     | Next.js 16 App Router, React 19, TypeScript strict                                        | Server-first, SEO, matches your standard stack                                                                     |
| Styling       | Tailwind CSS v4 (tokens via `@theme`) + shadcn/ui (Radix)                                 | Consistent tokens; accessible Accordion/Tabs/Dialog primitives                                                     |
| 3D            | three + `@react-three/fiber` v9 + `@react-three/drei` v10 + `@react-three/postprocessing` | React 19-compatible line; tree-shakeable                                                                           |
| Animation     | **GSAP** (ScrollTrigger, SplitText, `@gsap/react`) as the single animation engine         | Best-in-class scroll scrubbing and text splitting; avoids two overlapping libraries                                |
| Smooth scroll | Lenis, synced to ScrollTrigger                                                            | Smoothing without hijacking                                                                                        |
| Shared state  | Zustand (story progress store)                                                            | Justified exception to "prefer local state": 3D loop and DOM need high-frequency shared state outside React render |
| Forms         | React Hook Form + Zod, validated on client **and** server                                 | Per CLAUDE.md                                                                                                      |
| Email         | Resend via a Route Handler                                                                | Per CLAUDE.md; **demo mode first** (see Phase 3)                                                                   |
| Hosting       | Vercel (preview deployment for the pitch)                                                 | Per CLAUDE.md                                                                                                      |

> GSAP's plugins became free in 2025; I'll re-verify the license terms and all peer-dependency versions at install time before pinning anything.

**Content layer:** all copy lives in typed files under `src/content/` (services, industries, stats, pricing, FAQ, team, posts). Swapping in the real copy later touches data only, never components.

```
src/
  app/            layout, page, loading/error/not-found, api/contact, sitemap, robots, OG image
  components/     ui/ (shadcn)  layout/ (Navbar, Footer, ChapterRail)  motion/ (SplitHeading, Reveal, Magnetic, TiltCard, Counter)  shared/
  features/       hero/ story/ globe/ industries/ services/ proof/ team/ security/ pricing/ insights/ faq/ contact/
  content/        typed copy per feature
  lib/            gsap setup, lenis, validations, logger
  hooks/          useReducedMotion, useQualityTier, useChapterProgress
  types/
public/brand/     logo set (SVG + PNG), favicons, poster
docs/             this plan, architecture.md, decisions.md
```

---

## 7. Accessibility, SEO, quality guardrails

- **A11y (WCAG 2.1 AA):** full keyboard support; visible focus rings; semantic landmarks and one `h1`; carousel controllable by keyboard; contrast checked on glass surfaces; 3D canvas is `aria-hidden` and purely decorative; reduced-motion fully supported; nothing essential is only in WebGL.
- **SEO:** SSR content, unique metadata and canonical, Open Graph/Twitter, `Organization` JSON-LD, sitemap/robots, OG image rendered from the globe. `next/image` and `next/font` throughout.
- **Quality gates before each checkpoint:** `npm run lint`, `typecheck`, `build`; Vitest for utilities and Zod schemas; Playwright smoke tests (navigation, form, reduced-motion); manual pass on Chrome/Edge/Firefox/Safari and a real phone.

---

## 8. Phased delivery (each phase ends in a checkpoint you approve)

| Phase                             | Scope                                                                                                                                                                     | Size                               | Checkpoint                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **0 — Foundations**               | Project scaffold, git repo + feature branches, tokens, fonts, clean logo set (SVG lockup, favicon), content layer, motion kit skeleton                                    | S                                  | Brief review of tokens + logo set                                                                                                                               |
| **1 — Vertical slice**            | Globe, intro, **Hero**, **02 The Gap**, **03 The Network**, text system, Lenis, quality tiers                                                                             | **L** (riskiest and most valuable) | **Checkpoint 1:** you review on desktop and phone; I capture a short screen recording. _If the look is wrong, we fix it here, before building 8 more chapters._ |
| **2 — Story build**               | 04 Orbit, 05 Proof, 06 Team Builder, 07 Trust                                                                                                                             | L                                  | Checkpoint 2                                                                                                                                                    |
| **3 — Conversion**                | 08 Plans, 09 People/Insights, 10 Finale: FAQ, form, footer, WhatsApp. Form ships in **demo mode** (validates and animates; no real email) until you approve wiring Resend | M                                  | Checkpoint 3                                                                                                                                                    |
| **4 — Polish and hardening**      | A11y audit, perf tuning, SEO, cross-browser, tests, docs                                                                                                                  | M                                  | Lighthouse and test report                                                                                                                                      |
| **5 — Pitch kit**                 | Vercel preview link, before/after one-pager, optional 45–60 s sizzle reel                                                                                                 | S–M                                | You decide what goes to the owner                                                                                                                               |
| **6 — After the deal (optional)** | Inner pages (Services, Case studies, Pricing, About, Blog, Contact), CMS, analytics                                                                                       | —                                  | Separate plan                                                                                                                                                   |

**Recommendation:** pitch with the **homepage only** (Phases 0–5). Building 15 inner pages before the owner says yes would be effort at risk.

Git: each phase on its own `feature/*` branch with Conventional Commits; I commit only when you ask.

---

## 9. What I need from you

1. **Real copy.** Best: the live URL, the old project's source, or a text export. If none exist, send the text for each section. Until then I use clearly marked placeholders. Specifically I can't read: hero paragraph, the 5 industries, the 6 services, the two dark sections (#5, #9), stats, pricing, team, FAQ, contact details.
2. **Logo source files** (SVG/AI/Figma) if they exist, plus the wordmark font name. Otherwise I'll vectorize and approximate the typeface.
3. **Real proof material:** client logos, case-study visuals, team photos, testimonials (with permission). Until then: procedural on-brand placeholders, labelled as such. I won't invent client names or numbers.
4. Contact details, WhatsApp number, and real pricing tiers.

---

## 10. Pitch strategy (how to sell it)

1. **Lead with the live experience**, not slides: a private Vercel preview opened full-screen, plus the same page on your phone.
2. **Tell the story before the tech:** "your logo is already a story; the website now tells it" lands better with an owner than "WebGL".
3. **Pre-empt the objection "will it be slow/heavy?"** with the tier system, the reduced-motion/"lite" fallback, and real Lighthouse numbers.
4. **Before/after** using the same content and CTAs, so the comparison is clearly about experience.
5. **Don't promise conversion lifts.** I have no data to back a number. Offer instead to instrument CTA clicks and form submits after launch so improvement can be measured.
6. Optional: a short sizzle reel (I can build it with the Hyperframes tooling already available).

---

## 11. Risks, trade-offs, and one housekeeping note

| Risk                                                     | Mitigation                                                                        |
| -------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Copy unavailable or illegible                            | Content layer + labelled placeholders; Section 9                                  |
| Too flashy for enterprise buyers                         | Restraint rule (one hero moment per screen), calm easing, clear CTAs, lite mode   |
| Mobile performance                                       | Tiers, DPR clamp, fewer nodes, poster fallback, test on a real phone from Phase 1 |
| Scope creep (3D + 11 chapters is big)                    | Vertical-slice checkpoint, homepage-only pitch                                    |
| Brand asset gaps (no wordmark file, watermarked favicon) | Rebuild the lockup and favicon in Phase 0                                         |
| Motion-sickness / a11y                                   | Reduced-motion path, no scroll-jacking, no autoplay sound                         |
| Fonts won't exactly match the wordmark                   | Wordmark shipped as SVG; Sora is a close companion, not a replacement             |

**Housekeeping:** `D:\Projects\CLAUDE.md` is written for the **PeptoLogics** project (lead-gen, Supabase, peptide catalog). I'm applying its _engineering standards_ (App Router, strict TS, Tailwind + shadcn, plan-then-approve, accessibility, security, Conventional Commits) but **not** its PeptoLogics-specific business rules. If OmniSolve should have its own `CLAUDE.md`, say so and I'll draft one.

---

## 12. Decisions I need from you to start

1. **Copy source** — live URL / source code / text dump / "use placeholders for now"?
2. **Business reading** (Section 1.1) — correct?
3. **Scope** — homepage-only pitch (recommended) or multi-page?
4. **Look** — dark-first cinematic (recommended) or keep the light theme?
5. **Architecture** — approve the single persistent 3D canvas (Section 5.2)?
6. **Form** — demo mode only for the pitch (recommended), or wire real email now?
7. **Delivery of the pitch** — live private URL, or screen-share/recording only? (Affects Phase 5.)
