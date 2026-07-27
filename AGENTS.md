# AGENTS.md — Kraymer Art Redesign Mockup

## What this project is

A **design-direction mockup** for the Kraymer Art Shopify rebuild. Not production, not
backend, not Shopify. Its only job is to iterate on visual/UX direction fast, in the
browser, with small frequent changes. A Shopify developer will later port the decisions
to **Shopify Horizon**.

Source of truth for business context: the brief in the first user message (kept in the
chat history) and `structureProposal_manolo.md` (module inventory, flexible guide).
Where they conflicted, the brief won (documented in chat: shipping 9–20 days, one
dominant CTA, specific hero CTAs, 2-col mobile grid, no invented review figures,
fandom-first nav, no Berserk/AoT, quiz + wishlist included per user request).

## Stack

- HTML + CSS + **vanilla JS, zero build step**. No frameworks, no npm, no bundler.
- Only external dependency: Google Fonts (Fraunces + Inter) via CDN.
- Open `index.html` directly in a browser or serve statically (`python -m http.server`).
  Partials are injected from JS template strings, so `file://` works too.

## File map

```
index.html            Home           (body[data-page="home"])
coleccion.html        PLP, driven by ?collection=jjk|kny|genshin and ?type=sets
producto.html         PDP, driven by ?id=<handle> (defaults to first product)
assets/css/styles.css ALL styles. Tokens in :root, mobile-first, min-width only
assets/js/data.js     Mock catalog. Object shape mirrors Shopify `product`
assets/js/partials.js Header/footer/cart drawer/search overlay (template strings)
assets/js/app.js      All interactions, organized in numbered sections
AGENTS.md             This file
README.md             User-facing docs (run, iterate, deploy)
```

## Design tokens (Gallery Ivory)

All iteration on visual direction happens in `:root` in `styles.css`. Change a
variable, not scattered rules. Key tokens: `--bg #FAF7F1`, `--ink #1B1815`,
`--gold #A87E3F` (accent only, never for big fills), `--line #E8E1D5`,
fandom accents `--jjk/--kny/--genshin` (desaturated, tiles/badges only),
`--font-display: Fraunces`, `--font-body: Inter`.

## Hard rules (from the brief, do not regress)

1. **Mobile-first, non-negotiable.** Base styles target 375–414px. Desktop only via
   `min-width` media queries. 98.8% of real traffic is mobile.
2. **Fandom-first navigation.** Full names ("Jujutsu Kaisen"), abbreviations only as
   support text. Never nav by product type alone.
3. **One dominant CTA** in buy-box and cart drawer. No competing express buttons.
   ATC button must be visually distinct from variant selectors.
4. **No fake urgency.** Never countdown timers. Honest signals only (batch numbers,
   real stock). Sold out sinks to end of grid, dimmed, "Notify me" CTA.
5. **No invented social proof.** Ratings/reviews/counts always explicit placeholders
   (`[RATING PLACEHOLDER]`, `[SOCIAL PROOF PLACEHOLDER]`).
6. **Copy tone:** warm, direct, "we" voice (founder section is first person). Never
   the word "premium", no buzzwords, no dashes as punctuation (compound hyphens like
   "60-Day" are fine).
7. **Handmade timeline (9–20 days) lives directly under the ATC button**, not buried
   in descriptions.
8. **No hover-only information.** Hover effects may enhance, never gate content.
9. Placeholder imagery only (`.ph` blocks). Never real third-party photos or
   trademarked artwork.

## Shopify Horizon portability

- Every `:root` token maps 1:1 to a Horizon `settings_schema.json` setting.
- HTML sections are commented `<!-- section: name -->` mirroring future
  `sections/*.liquid` files.
- `data.js` objects mirror the Shopify `product` shape (handle, title, price in
  cents, compareAt, options). Custom fields documented inline as metafields
  (`kraymer.character`, `kraymer.technique`, `kraymer.pieces_in_set`,
  `kraymer.batch_label`).
- All rendering reads from that shape, so swapping mock data for Liquid objects is
  mechanical.

## Iteration workflow

Changes arrive as small, frequent design tweaks. Keep class names stable, prefer
editing tokens over rewriting rules, and keep `AGENTS.md` updated when structure,
tokens or conventions change.

## Deploy (pending)

Target: GitHub repo → Cloudflare Pages (connect repo in Cloudflare dashboard, no
build command, output dir = repo root). User decides GitHub user/repo after v1
review. See README.md for the exact checklist.
