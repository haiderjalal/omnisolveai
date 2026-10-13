# Pitch guide

How to present this to the owner. All stills referenced are in [pitch/stills](pitch/stills).

## The one-sentence story

> Your logo is already a story — a network wrapped around a world. The new site tells it: your
> engineers connect what's scattered, and the page shows it happening.

## Before you present (checklist)

- [ ] Replace or at least review the draft copy — see [content-guide.md](content-guide.md). Show the owner the **real** stats and a real contact email.
- [ ] Open it on a **real phone** and a real laptop with a GPU (the lab results were software-rendered).
- [ ] Decide how to show it: `npm run build && npm run start` on your laptop (full control, zero risk), or a private Vercel preview link (needs your go-ahead; previews are `noindex`).
- [ ] Have `docs/pitch/stills` ready as a fallback if the venue's Wi-Fi/browser misbehaves.
- [ ] Do **not** promise conversion lifts — there is no data. Offer to measure after launch.

## A 4-minute walk-through

| Time | Scroll to          | Say / point out                                                                                                                                                                      |
| ---- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0:00 | **Hero**           | Let the intro play: nodes assemble into the logo's globe and the ring sweeps in. Drag the globe. "That's your logo, rebuilt as a live 3D object." Point at the four tethered labels. |
| 0:40 | **The gap**        | Words light up as you scroll; the network on the globe falls apart. "This is the problem you solve — strategy that never reaches production."                                        |
| 1:10 | **Industries**     | The globe re-forms and tours five regions; the card changes with it. "Domain expertise, shown rather than listed."                                                                   |
| 1:50 | **Services**       | The logo's ring becomes a 3D carousel. Use the arrows (also works by keyboard).                                                                                                      |
| 2:20 | **Proof**          | Odometer numbers, tilt cards. "Real client results go here."                                                                                                                         |
| 2:40 | **Team builder**   | Click two roles → the globe pulses → _Request this team_ pre-fills the contact form. Filter the tech stack. "Visitors do the first step of the sale themselves."                     |
| 3:15 | **Plans → Finale** | The globe lights up fully; one clear call to action.                                                                                                                                 |
| 3:40 | **Contact**        | Submit the form — validation, success animation. Mention it's in demo mode until email is connected.                                                                                 |
| 3:55 | **Accessibility**  | Turn on _reduce motion_ in the OS: the pinned scenes become a clean readable page. "Same content, no motion — and it works with JavaScript off."                                     |

## Questions the owner will ask

**"Will it be slow or heavy?"** The 3D engine loads _after_ the page is visible, the headline paints
immediately, and it adapts: lighter on phones, static on devices without WebGL, calm for people who
prefer reduced motion. Honest status: desktop is fast; mobile performance is good in a real browser but
below the 95 goal in a throttled lab test — see [performance.md](performance.md). Real-device testing is the next step.

**"Is it accessible?"** Automated WCAG 2.1 AA scans pass on the key views, it is keyboard-operable, and
there is a full reduced-motion layout. (Automated tools don't replace a manual audit by assistive-tech users.)

**"What about SEO?"** All text is real HTML in the first response; headings, metadata, sitemap, structured
data (Organization, FAQ) and a share image are in place. Lighthouse SEO is 100 in the production configuration.

**"Can our team edit the text?"** Yes — all copy is in two typed files (`src/content`). A CMS can come later.

**"Does the form work?"** It validates and acknowledges today; connecting email (Resend) is a configuration
step. Saving inquiries to a database is a recommended next phase.

**"Is this final copy?"** No. It's a draft built around your existing headings; real stats, testimonials,
team and pricing are needed.

## Honest scope

**Built:** the full homepage story (11 chapters), responsive down to phones, reduced-motion and no-JS
modes, contact pipeline, SEO basics, tests, docs.
**Not built (proposed next, only after approval):** inner pages (services, case studies, pricing, about, blog),
a CMS, inquiry storage + retries, analytics, real imagery, a manual accessibility audit, real-device performance tuning.

## Suggested proposal shape

1. _Phase 2 — Launch-ready:_ real content + imagery, inquiry persistence, analytics, device-tested performance pass, deploy.
2. _Phase 3 — Growth:_ inner pages and a lightweight CMS, case-study pages with their own 3D accents, A/B tests on the hero.
