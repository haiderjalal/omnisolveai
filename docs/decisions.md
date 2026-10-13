# Decisions and deviations from the plan

Short records of choices made while building, in the order they came up. Where the build differs
from [REDESIGN_PLAN.md](REDESIGN_PLAN.md) it says so, and why.

## Deviations from the approved plan

| Plan said                                                       | Built                                                                                             | Why                                                                                                                                               |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| GSAP **SplitText** for text animation                           | Words/letters are split **on the server**; CSS animates; `PageEffects` triggers                   | No browser measurement → no layout shift, headline is in the first paint (LCP), nothing to re-split on resize, one fewer plugin                   |
| **shadcn/ui** (Radix Accordion/Tabs)                            | Native `<details name>` FAQ, native `<dialog>` menu, button-group filter                          | Native elements are accessible, searchable by find-in-page and need no JS. (The modern-web-guidance check recommended exactly this.)              |
| **ScrollTrigger** for scroll scenes + pinning                   | CSS `position: sticky` + our own `StoryDriver`                                                    | Sticky has no pin-spacers or scroll-jacking and survives resize; one source of progress for DOM and 3D. ScrollTrigger is no longer shipped at all |
| Dark-first with **light "paper"** sections for pricing/FAQ/form | Dark everywhere; light only on the contact-form card                                              | Better cohesion; the form still gets maximum legibility                                                                                           |
| Process timeline **pinned**                                     | Scroll-drawn but **not** pinned                                                                   | Fewer pinned scenes → less scroll fatigue (only 3 pinned chapters remain)                                                                         |
| 11 chapters = 10 + intro                                        | Intro plays on the page itself (no blocking preloader); 11 chapters in the rail (Start … Contact) | Keeps content visible and LCP fast                                                                                                                |
| Dark panels #5 and #9 from the old site                         | Folded into "How we work" (4 engagement models) and the "Your team" tray                          | Their headings/text were illegible in the screenshot; used purpose-fit placeholders                                                               |
| Resend SDK                                                      | One `fetch` call                                                                                  | Zero dependency; behaviour is trivial                                                                                                             |

## Choices worth recording

- **One persistent canvas, not one per section.** One WebGL context, one continuous camera, seamless
  chapter transitions. Cost: chapter poses must be designed together (done in `chapters.ts`).
- **Plain mutable objects for 60 fps state; Zustand only for slow UI state.** Keeps React out of the render loop.
- **Server components for anything static.** A pass that moved `Reveal`/`SplitText`/`TiltCard`/`Button`
  off the client reduced hydration work and shipped JS. Pointer effects are delegated from one controller.
- **Deterministic procedural geometry (seeded PRNG).** Same output on server and client; compatible
  with Cache Components, which forbids `Math.random()` during prerender.
- **Materials built by hand.** react-three-fiber copies `uniforms` props into new objects, which silently
  broke shared per-frame uniforms. See `features/globe/materials.ts`.
- **Quality tiers instead of one scene.** `high` (bloom) / `medium` / static fallback / reduced-motion frame.
- **Idle means idle.** Per-frame loops return immediately when nothing changed, and read scroll position
  from a cache (not `window.scrollY`) to avoid forced layout every frame.
- **Lazy-load what first paint doesn't need:** the whole 3D engine (~268 KB gz), the zod validator
  (loads on first form interaction) and GSAP Flip (loads as the stack filter approaches the viewport).
- **No database yet → failures are loud.** A failed notification returns an error instead of
  pretending the lead was saved.
- **Previews are `noindex`.** Only a real production deployment (or an explicit production build with
  `NEXT_PUBLIC_SITE_URL`) is indexable — the private pitch link will not leak into search.
- **No sound, custom cursor or autoplay video** — deliberately (see plan §2.4): they add weight and annoyance, not trust.

## Bugs found by the tests and measurements (kept as lessons)

- Globe pose jumped between two chapters → unit test "each chapter ends where the next begins" now guards it.
- Invalid ARIA (`aria-label` on generic elements) and sub-AA contrast on the form and unlit text → fixed; axe scans guard it.
- Per-frame `window.scrollY` read caused a forced reflow every frame → cached scroll position.
- Building the full "high" scene before detecting a software renderer doubled the start-up cost → renderer is
  inspected first, scene mounted second.
