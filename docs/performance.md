# Performance — measured, with caveats

Project goal (from the engineering standards): Lighthouse ≥ 95 in every category, LCP < 2.5 s,
CLS < 0.1. This page records what was actually measured, how, and what is still short of the goal.

## How it was measured

Production build served locally, Lighthouse via headless **Microsoft Edge with a software (CPU) WebGL
renderer** — there is no GPU in this lab setup, which is _pessimistic_ for a WebGL page. The machine
was an ordinary busy workstation (many other apps), so results vary run to run; ranges are given
instead of single numbers. **No real-device testing has been done yet.**

## Results

|                                                         | Accessibility | Best Practices | SEO      | Performance                                |
| ------------------------------------------------------- | ------------- | -------------- | -------- | ------------------------------------------ |
| Desktop                                                 | **100**       | **100**        | **100**¹ | 86–89 on quiet runs (62–81 on loaded runs) |
| Mobile (Lighthouse default: simulated slow 4G + 4× CPU) | **100**       | **100**        | **100**¹ | 60–73                                      |

¹ With the production configuration. Previews/local builds are intentionally `noindex`, which Lighthouse
reports as 69 on SEO; that is the single failing audit.

| Metric                   | Desktop      | Mobile                                                                           |
| ------------------------ | ------------ | -------------------------------------------------------------------------------- |
| First Contentful Paint   | 0.3 s        | 1.2 s (simulated)                                                                |
| Largest Contentful Paint | 0.8 s        | 1.8–3.7 s simulated · **0.6–2.1 s observed** · 1.4 s in a real 4×-throttled load |
| Cumulative Layout Shift  | **0**        | **0**                                                                            |
| Total Blocking Time      | ≈ 280–410 ms | 1.1–2 s simulated                                                                |

The LCP element is the hero headline, server-rendered, so it paints with the first frame. Lighthouse's
_simulated_ mobile LCP is higher than anything observed because it models a slow network plus a
676 KB page.

## Where the time goes (profile under 4× CPU throttle)

1. **One-off WebGL start-up** (module evaluation, shader compilation, first frames) — a single task of
   about 1.3 s _under throttling and software rendering_. This is the dominant cost and is inherent to
   booting a 3D scene; GPUs compile shaders far faster than the CPU rasteriser used here.
2. **React hydration** of a long static page.
3. Native style/layout/paint work (largest bucket, not JavaScript).

## What has already been done

- 3D engine (~268 KB gz), zod validation and GSAP Flip are all **lazy-loaded**; first paint needs none of them.
- Static pieces (text, reveals, cards, buttons) are **server components**; one small client controller drives them.
- Per-frame loops **do nothing at rest** and no longer force layout (cached scroll position).
- Renderer is inspected **before** the scene is mounted; software rasterisers get the lighter tier (no bloom).
- DPR is capped (1.4–1.75) and adapts; draw calls ≈ 8; geometry is a few thousand points.
- Hero entrance is pure CSS, finishing in ~1.5 s; no blocking preloader.
- Fonts via `next/font` (self-hosted, swap); images via `next/image`.

## Not yet at the goal — likely next steps (in order of expected value)

1. **Measure on real phones and laptops with GPUs.** The lab numbers above are the worst case; real
   WebGL start-up should be much cheaper. Do this before quoting any performance figure to the owner.
2. Spread scene start-up over several frames (mount layers progressively / `compileAsync`) so no single long task.
3. Subset or reduce fonts (three families today).
4. Code-split below-the-fold client components so they load on approach.
5. A lighter mobile tier (fewer points) if device testing shows a need.

## Behaviour that protects real users

`prefers-reduced-motion` → one calm frame, no scroll choreography. No WebGL → the static logo globe.
Frame-rate monitor → drops pixel ratio, then bloom. Everything works with JavaScript disabled.
