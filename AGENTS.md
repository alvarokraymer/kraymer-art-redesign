# AGENTS.md — Kraymer Art Redesign — Design System

## What this project is

A **design-direction mockup**, not production, not backend, not Shopify. Treat this
repo as a **design document that happens to be executable**: every rule below
describes the current, verified state of the code, not an aspiration. If you
change direction, update the rule in the same commit as the code — a stale rule
is worse than no rule.

Source of truth for business context: the brief in the original chat (shipping
9–20 days, one dominant CTA, specific hero CTAs, 2-col mobile grid, no invented
review figures, fandom-first nav, no Berserk/AoT, quiz + wishlist included) and
`structureProposal_manolo.md` (module inventory, flexible guide — content brief,
not implementation spec; the CSS below is what actually ships).

A Shopify developer will eventually port validated decisions to **Shopify
Horizon**. See "Shopify Horizon portability" at the end.

## Stack

- HTML + CSS + **vanilla JS, zero build step**. No frameworks, no npm, no bundler.
- External dependencies: Google Fonts (Open Sans, via CDN) and the `lucide` icon
  script (via unpkg CDN). Everything else is local.
- Open `index.html` directly in a browser, or serve statically. Partials are
  injected from JS template strings, so `file://` works. To preview closer to
  the real deploy: `npx http-server -p 8000 .` (there is no Python in this
  environment — don't reach for `python -m http.server`).

## File map

```
index.html            Home           (body[data-page="home"])
coleccion.html         PLP, driven by ?collection=jjk|kny|genshin and ?type=sets
producto.html          PDP, driven by ?id=<handle>&approach=1|2|3|4 (see below)
assets/css/styles.css  ALL styles. Tokens in :root, mobile-first, min-width only
assets/js/data.js      Mock catalog. Object shape mirrors Shopify `product`
assets/js/partials.js  Header/footer/cart drawer/search overlay (template strings)
assets/js/app.js       All interactions, numbered sections (see file header)
AGENTS.md              This file — the design system, agent-facing
README.md              User-facing docs (run, iterate, deploy) — Spanish
checklist.md           Audit of the REAL live Shopify store. Different artifact,
                        different scope — do not "fix" it by editing this mockup
```

## Design tokens ("Noir")

All visual iteration happens in `:root` in `styles.css`. **Every token declared
must be used somewhere** (CSS or an inline `style=""` in `app.js`) — this file
had 7 dead/duplicate tokens as of 2026-07-30 (removed). Before adding a token,
check an existing one doesn't already cover it. Before deleting one, grep both
`assets/css` and `assets/js` for `var(--name)` — several tokens are only
referenced from inline styles in JS template strings, invisible to a CSS-only
search.

```css
--dark        #181514   /* ink / dark surfaces */
--light       #E6E6E6   /* page background / light text-on-dark */
--muted       #8D847E   /* secondary text */
--muted-d     #A09892   /* secondary text on dark backgrounds */
--accent      #C4A882   /* gold — accent only, never a big fill */
--line        #E8E2DE   /* hairline borders */

--surface       #F4EEEB /* warm off-white card/section fill */
--surface-soft  #F9F6F3 /* lighter variant, e.g. guarantee box */
--gold-soft     #D4C0A2 /* softer accent, distinct from --accent */

--display  'Nantes', 'Georgia', 'Times New Roman', serif   /* headings, local woff2 */
--body     'Open Sans', -apple-system, ... sans-serif       /* everything else, Google Fonts */

--radius       14px    /* cards, tiles */
--radius-sm    8px     /* buttons, chips, badges-as-pills use --radius-pill instead */
--radius-pill  999px

--gutter    1.5rem  /* page horizontal padding */
--header-h  52px    /* sticky header height, used to offset sticky elements below it */

--s         0.75rem  /* spacing scale — used sparingly, mostly hardcoded rem elsewhere */
--space-sm  0.5rem
--space-3   1rem
--space-4   1.5rem
```

Two things NOT in this list because they turned out to be misleading if you
only read `README.md`/old docs: there is **no** `--bg`, `--ink`, `--gold`
(that name was merged into `--accent`, same hex), or per-fandom color
variables (`--jjk`/`--kny`/`--genshin`). Fandom differentiation is done via the
**card approach system** below, not color tokens.

## Dark mode — how it actually works (read before touching colors)

There is a real light/dark toggle (`data-theme-toggle` in the mobile nav),
persisted via `localStorage` and applied as `[data-theme="dark"]` on `<html>`.
The mechanism is a **token swap**, not a second palette:

```css
[data-theme="dark"]{ --dark:#E6E6E6; --light:#181514; --muted:#978F85; --muted-d:#6C6360; --line:#3D3839 }
```

`--dark` and `--light` literally trade values. Any rule that pairs them
consistently (`background:var(--dark); color:var(--light)`) inverts correctly
for free — that's most of the UI (buttons, selected chips, fandom tiles).

**The trap:** a rule that uses one token as background but a *hardcoded* color
for its text (e.g. `background:var(--dark); color:rgba(246,246,246,.85)`)
assumes `--dark` is always literally dark. In dark mode `--dark` becomes the
light value, so the background flips to light while the hardcoded text stays
pale — near-invisible low-contrast text. This exact bug existed in `.ft`
(footer) and `.site-header` until 2026-07-30 (header background was hardcoded
`#fff` outright, never adapting). Fixed via explicit overrides following the
pattern already used for `.marquee`:

```css
[data-theme="dark"] .site-header{ background:var(--light) }
[data-theme="dark"] .ft{ background:var(--light) }
[data-theme="dark"] .marquee{ background:var(--light) }
```

**Rule going forward:** any new section that hardcodes a background/text pair
instead of pairing two tokens must get a `[data-theme="dark"]` override in the
same change, and must be checked with the theme toggle on before calling it
done — not just in light mode.

## Component inventory

- **Product cards** (`productCard()` in `app.js`): one shared renderer, three
  visual "approaches" (`bold` / `clean` / `genshin`→`soft`) selected by the
  **active collection page**, not by the product's own collection — every card
  on one PLP shares one visual language. Badge priority is mutually exclusive
  for *state* (soldOut > comingSoon > lowStock > isNew > isFeatured), plus two
  **additive** badges layered on top regardless of state: a sale `-XX%` pill
  (suppressed if soldOut/comingSoon) and a catalog tag (`collector-set` >
  `bestseller`, suppressed if soldOut). If you add a new badge kind, decide
  explicitly whether it's a *state* (exclusive) or a *tag* (additive) and wire
  it into `badgesWrap`, not a separate code path — this file previously had a
  second, dead `cardBadges()` function whose classes (`.badge--gold` was
  declared as `.badge--a`, `.badge--ink` didn't exist at all) never rendered
  because nothing called it. Removed 2026-07-30; `bestseller`/`collector-set`
  now render through the live path.
- **PDP layouts** (`producto.html?approach=1|2|3|4`, rendered in `app.js`):
  four deliberate, parallel layout explorations, not legacy cruft — keep all
  four working when you touch shared PDP logic (`pdpCTA()`, `pdpBadge()`,
  `pdpPrice()`, `variantsHTML()`, `specsHTML`, `reviewsHTML`, `crossHTML` are
  shared; each approach composes them differently). Default (no param) is
  approach 1 ("Classic").
  1. **Classic** — traditional two-column, thumbnail strip, rating line, full
     reviews section.
  2. **Editorial** — story-driven, large visual, dot pagination, full reviews.
  3. **Side** — compact two-column, no rating line, no reviews section (only
     specs + cross-sell) — intentional, not an oversight.
  4. **Immersive** — full-bleed gallery, floating price overlay, full reviews.
- **Reviews / rating**: `RATING_PLACEHOLDER` (`data.js`) and the review
  attribution placeholders (`[REVIEWER N PLACEHOLDER]`) are the only allowed
  values for a rating number or a reviewer identity anywhere in this repo —
  see Hard rule 5. The star icons and quote text may stay as illustrative
  copy (they demonstrate layout, like a `.ph` image block demonstrates a photo
  slot); the number and the "who said it" may not look like real data.

## Hard rules (from the brief, do not regress)

1. **Mobile-first, non-negotiable.** Base styles target 375–414px. Desktop only
   via `min-width` media queries (currently 3, all at 768px/1024px — resist
   adding `max-width` queries, they're the mobile-first tell). 98.8% of real
   traffic is mobile. Verify every change at 375px width *and* with dark mode
   toggled on, not just the default state.
2. **Fandom-first navigation.** Full names ("Jujutsu Kaisen"), abbreviations
   only as support text. Never nav by product type alone.
3. **One dominant CTA** in buy-box and cart drawer. No competing express
   buttons. ATC button must be visually distinct from variant selectors.
4. **No fake urgency.** Never countdown timers. Honest signals only (batch
   numbers, real stock). Sold out sinks to end of grid, dimmed, "Notify me" CTA.
5. **No invented social proof.** Ratings/reviews/counts always explicit
   placeholders (`RATING_PLACEHOLDER`, `[REVIEWER N PLACEHOLDER]`,
   `[SOCIAL PROOF PLACEHOLDER]`, `[QUOTE N PLACEHOLDER]`). This was regressed
   once already (a hardcoded "5.0" rating and three fabricated "Verified
   Buyer" reviews shipped on the PDP) and fixed 2026-07-30 — don't reintroduce
   plausible-looking fake numbers or names when adding a new module.
6. **Copy tone:** warm, direct, "we" voice (founder section is first person).
   Never the word "premium", no buzzwords, no dashes as punctuation (compound
   hyphens like "60-Day" are fine).
7. **Handmade timeline (9–20 days) lives directly under the ATC button**, not
   buried in descriptions.
8. **No hover-only information.** Hover effects may enhance, never gate content.
9. **Placeholder imagery only** (`.ph` blocks) for demo/state products. Real
   product photography (`assets/productPhotos/`) is fine and already in use
   for shipped pieces — never real third-party photos or trademarked artwork.
10. **No dead code as a design decision.** If a data field (e.g. a new entry in
    a product's `badges` array) doesn't visibly render anywhere, that's a bug,
    not a future hook — wire it in immediately or don't add the field.
11. **No orphaned tokens or classes.** A CSS custom property or class name that
    nothing references is a trap for the next iteration (someone will use it,
    assume it works, and ship a silent no-op). Grep before you add; delete
    before you rename-and-forget the old one.

## Known, deliberate content gap (not yours to fix silently)

The marquee/footer claim "10,000+ clients/collectors" as a stated fact on every
page, while the founder section says "more than 2,000 collectors" and the trust
section explicitly uses `[SOCIAL PROOF PLACEHOLDER]`. These three numbers
disagree. This mirrors `checklist.md`'s own item "Reconciliar pruebas
sociales: elegir una sola métrica... consistente en toda la web" for the real
store. Resolving it means picking one real number (or bracketing all three),
which is a content/brand decision — flag it, don't silently invent a number to
make them match.

## Iteration workflow

Changes arrive as small, frequent design tweaks. Keep class names stable,
prefer editing tokens over rewriting rules, and keep this file updated in the
same change when structure, tokens, or conventions shift — a doc describing a
theme ("Gallery Ivory") the CSS abandoned is worse than no doc; that drift is
what triggered this rewrite on 2026-07-30.

Before calling a visual change done:
1. Check it at 375px width (the real target, not desktop).
2. Toggle dark mode and check again — token-pair rules invert for free, but
   anything with a hardcoded color needs an explicit override (see above).
3. If you touched `data.js` (new field, new badge, new state), confirm it
   actually renders somewhere before moving on.

## Shopify Horizon portability

- Every `:root` token maps 1:1 to a future Horizon `settings_schema.json` setting.
- HTML sections are commented `<!-- section: name -->` mirroring future
  `sections/*.liquid` files.
- `data.js` objects mirror the Shopify `product` shape (handle, title, price in
  cents, compareAt, options). Custom fields documented inline as metafields:
  `kraymer.character`, `kraymer.technique`, `kraymer.pieces_in_set`,
  `kraymer.batch_label`.
- All rendering reads from that shape, so swapping mock data for Liquid objects
  is mechanical.

## Deploy

GitHub Actions (`.github/workflows/deploy.yml`) deploys to Cloudflare Pages
(`kraymer-art-redesign`) on every push to `master`, no build step, output dir
is repo root. The live URL is gated by a PIN screen (`functions/_middleware.js`,
PIN `2026`, cookie `ka_pin`) — that's intentional obscurity for an internal
mockup, not a real auth system.
