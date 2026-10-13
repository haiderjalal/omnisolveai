# Content guide

## Where the words live

Every piece of copy is in typed files under `src/content/` — components contain none. To change text,
edit `home.ts` (chapter copy) or `site.ts` (name, contact, nav, footer). Nothing else needs touching.

## ⚠️ This copy is a DRAFT

The old site was only available as a 171 px-wide screenshot, and no live site could be found. Headings
that were legible were kept; everything else is drafted to fit them. **Do not launch with this copy.**
Every factual claim is marked `// CONFIRM` in the source. Checklist:

| Where                                                            | What to replace / verify                                                                                                                      |
| ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `site.ts`                                                        | contact email (currently the placeholder `hello@omnisolve.example`), response time, location, WhatsApp number (`NEXT_PUBLIC_WHATSAPP_NUMBER`) |
| `home.ts` → `hero.trust`                                         | "Trusted by … teams across fintech, healthcare, retail and logistics"                                                                         |
| `stats`                                                          | **120+ · 98% · 48h · 8+** — only the first was legible in the old screenshot; the rest are guesses                                            |
| `testimonials`                                                   | invented placeholder quotes — replace with real, approved ones (or remove the block)                                                          |
| `caseStudies`                                                    | titles/summaries are illustrative; swap in real projects and real cover images                                                                |
| `measuredBars`                                                   | 96 / 92 / 94 / 90 % are placeholders — use figures OmniSolve actually tracks                                                                  |
| `securityPillars`                                                | confirm each claim is true of OmniSolve's practice; do **not** add certifications unless held                                                 |
| `industries`, `services`, `roles`, `stackChips`, `plans`, `faqs` | confirm they match what OmniSolve really sells; plan _names_, structure and features are placeholders (no prices are shown)                   |
| `leadership`                                                     | real names, roles and photos                                                                                                                  |
| `posts`                                                          | real articles (cards are currently non-links)                                                                                                 |
| Footer                                                           | add Privacy / Terms links once those pages exist                                                                                              |

## Imagery needed

| Item                                             | Currently                                                                                                                                                                                                            |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Logo source files (SVG/AI/Figma) + wordmark font | The supplied PNGs; the horizontal logo file contains **only the globe** (no wordmark), and `favicon.jpg.jpeg` carries a watermark. A dark-mode mark and a clean favicon set were generated from `omnisolve-icon.png` |
| Case-study visuals                               | generated network art (`CoverArt`)                                                                                                                                                                                   |
| Team photos                                      | generated art with monograms                                                                                                                                                                                         |
| Client logos                                     | none shown (nothing was invented)                                                                                                                                                                                    |

## Tone

Plain, specific, confident, no hype. Headings are short and carry the story ("Strategy decks are easy
to buy…"). Keep the gradient-accent second line to ≤ 4 words.
