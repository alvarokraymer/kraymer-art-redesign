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
blog.html              Journal index (body[data-page="blog"]) — grid of BLOG_POSTS
about.html             Our Story (body[data-page="about"]) — founder + craft + CTA
quiz.html              Find Your Domain quiz (body[data-page="quiz"]) — extracted
                        off home 2026-07-31, see "Quiz" below
variant1.html          Card approach "Bold" — MOCKUP-ONLY comparison, never production
variant2.html          Card approach "Clean" — MOCKUP-ONLY comparison, never production
variant3.html          Card approach "Soft" (= production approach) — same comparison set
assets/css/styles.css  ALL styles. Tokens in :root, mobile-first, min-width only
assets/js/data.js      Mock catalog + BLOG_POSTS. Product shape mirrors Shopify `product`
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
--pink        #D98CA3   /* liked/active wishlist heart ONLY — nowhere else */
--line        #E8E2DE   /* hairline borders */

--surface       #F0F0EF /* neutral card/section fill — NOT cream, see note below */
--surface-soft  #F6F6F5 /* lighter neutral variant, e.g. guarantee box */
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

`--surface`/`--surface-soft` were originally a warm cream (`#F4EEEB`/`#F9F6F3`)
and got flagged 2026-07-31 as reading like unwanted "cream/yellow" against the
otherwise achromatic Noir palette — retuned to near-neutral grays. If a future
request wants warmth back, that's a deliberate brand call to confirm first,
not a default to restore quietly.

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

The same trap bit `.sec--dark` and the hero itself, found in a later pass
(2026-07-30): `[data-theme="dark"] .sec--dark{color:var(--light)}` used
`var(--light)` expecting "the light literal" but got the dark literal instead —
fixed by swapping to `color:var(--dark)` (which *is* the light literal in dark
mode — that inversion is the whole trick, use the "wrong-looking" token on
purpose). Separately, `.hs-content h2` (hero slide headline) sits over a
gradient overlay that is a **hardcoded** dark rgba, not a token — so its text
must also be a **hardcoded** light value (`#F6F6F6`), never `var(--light)`,
or it silently goes dark-on-dark in dark mode while staying legible by
accident over light-toned photos and unreadable over dark ones.

**Rule going forward:** any new section that hardcodes a background/text pair
instead of pairing two tokens must get a `[data-theme="dark"]` override in the
same change, and must be checked with the theme toggle on before calling it
done — not just in light mode. If a background is a photo + a permanently-dark
gradient (like the hero or the fandom tiles), its text must be a **hardcoded**
light color, never a token, since the token swaps but the photo doesn't.

The inverse trap bit `.card`/`.card--soft` (product cards) and `.post-card`
(journal cards), found 2026-07-31: their backgrounds are `--surface`/
`--surface-soft` (or a hardcoded white gradient for `.card--soft`), which
**never invert**, but `.card__title`/price and `.post-card` title/link text
were unset and inherited the page's `color:var(--dark)` — which *does* invert.
Result: near-white title text on a near-white card in dark mode. Fixed with
hardcoded-literal overrides (`#181514`) on the always-light card, not a token
— same underlying rule as above, just the light/dark roles swapped: a
background that stays fixed needs fixed text, whichever polarity the fixed
background is. The `.heart` icon had the identical bug (white circle backdrop
that never inverts, `stroke:var(--dark)` that did) — fixed the same way.

## Logo

`assets/SVG/kraymer-logo.svg` (loaded via `<img>`, so it can't use `fill:currentColor`
the way an inlined SVG could — the browser won't let an `<img>`-loaded SVG pick
up the page's CSS `color`). Its fill is a soft near-white (`#fafafa`), the
opposite polarity of the old `logoProv.svg` (dark `#231f20`). So the CSS filter
logic is also inverted from what you'd guess:

```css
.hdr-logo img{ filter:invert(1) }              /* light mode: invert soft-white → dark, visible on the white header */
[data-theme="dark"] .hdr-logo img{ filter:none } /* dark mode: already light, needs no inversion */
```

If the logo asset ever changes again, check its fill color first — a light-fill
logo and a dark-fill logo need opposite filter rules, not the same one moved
to the other theme.

## Gold accent — use sparingly, on purpose

`--accent` was creeping onto every eyebrow/label (card series tag, fandom
tile labels, footer column headers, post-card categories, the PLP piece
count) — diluted to the point it stopped reading as an accent. Pulled back
2026-08-01 to `var(--muted)`/`var(--muted-d)` (or the footer's own
`rgba(246,246,246,.5)` on its permanently-dark background) everywhere except
genuinely singular moments: the hero eyebrow, the founder's signature, the
"Bestseller" badge, primary CTA buttons/links, active/selected states, and
carousel controls. If you're adding gold somewhere, ask "is this the one
special thing on this screen, or just another label?" — if the latter, use
muted. `--surface`/`--surface-soft` were also nudged a touch lighter the same
day (`#F0F0EF`→`#F3F3F2`, `#F6F6F5`→`#F8F8F7`).

## Promo popup + gift FAB

`PROMO_HTML`/`openPromoModal()`/`showPromoFab()`/`hidePromoFab()` in `app.js`,
markup in `partials.js` (`PROMO_FAB_HTML`, injected site-wide next to the cart
drawer). State lives in `localStorage["ka_promo"]`: unset → the popup
auto-opens once on `index.html` via an `IntersectionObserver` on
`.hero-slider` (fires the moment its top edge scrolls above the viewport,
then disconnects) → `"dismissed"` (closed without an email — shows
`.promo-fab`, a bottom-left circular button that reopens the same modal) or
`"subscribed"` (email submitted — FAB retired for good, popup never
auto-opens again). The dismiss/subscribe branching lives in the shared
`[data-close-modal]` handler and a delegated `submit` listener for
`[data-promo-form]`, not inside `openModal()` itself, since that function is
shared with the size-guide and checkout-mock modals and must stay generic.
`openModal(html, type)` tags the host with `data-modal="<type>"` so this kind
of per-modal-kind logic can key off it.
**Gotcha already hit once:** `hidden` on `.promo-fab` (and on `.plp-hero`) does
nothing by itself — both have an explicit `display` in their own rule, which
beats the UA stylesheet's `[hidden]{display:none}` on specificity/source-order.
Every element toggled via the `hidden` attribute needs its own
`.selector[hidden]{display:none}` line; don't assume the attribute alone works.

## Component inventory

- **Base `.card`** (no approach class — used by home Bestsellers and PDP
  cross-sell only, via `productCard(p, {approach:false})`): a real card
  container (`--surface-soft` fill, radius, subtle shadow), not a bare image +
  text flow. The three PLP "approach" variants each fully override
  background/radius/shadow, so changes here are invisible on `coleccion.html` —
  that's by design, don't chase parity between the two.
- **Shop by Collection** (`.ftile` on `index.html`, right after Bestsellers):
  full-bleed real product photography per collection (not `.ph` placeholders —
  rule 9 explicitly allows real photography for shipped pieces) with a
  hardcoded dark gradient overlay (`.ftile::after`) for legible text regardless
  of theme. Text inside must stay on tokens that are *paired* with the tile's
  own background (`.ftile__body h3{color:var(--light)}` pairs with the
  `::after` gradient being permanently dark) — don't add a hardcoded-photo
  section without also adding its gradient overlay.
- **Journal / blog** (`postCard()` + `renderPosts()` in `app.js`, `BLOG_POSTS`
  in `data.js`): one card renderer, two mounts — `[data-posts-home]` (first 3,
  horizontal scroll on `index.html`) and `[data-posts-all]` (all, grid on
  `blog.html`). Each post gets `id="<slug>"` on its own card so
  `blog.html#slug` (used by "Read more" links and the home preview) scrolls to
  it directly — there are no separate per-post detail pages, by design; the
  excerpt shown IS the full content, same low-fidelity-content convention as
  the rest of this mockup.
- **Product cards** (`productCard()` in `app.js`): one shared renderer.
  **Production has standardized on the "soft" approach for every collection**
  (2026-07-31) — `approachMap` maps jjk/kny/genshin all to `"soft"`. "bold" and
  "clean" still exist in CSS and are reachable via `opts.forceApproach`, but
  only `variant1.html`/`variant2.html` use them now, as an internal
  side-by-side comparison — see "Variant pages" below. Don't reintroduce a
  per-collection approach split on `coleccion.html` without being asked; if you
  need to compare approaches again, do it on the variant pages, not live.
  Badge priority is mutually exclusive
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
- **Variant pages** (`variant1.html`/`variant2.html`/`variant3.html`,
  `initVariant(approach)` in `app.js`): show the same fixed set of 8 products
  three times, once per card approach (Bold / Clean / Soft), for internal
  side-by-side comparison only. **These never go to production** — they're
  marked `<meta name="robots" content="noindex,nofollow">`, carry an
  "Internal Only" eyebrow in the hero copy, and are tucked under a "Variants"
  dropdown in the nav (not the footer) precisely so they read as internal
  tooling, not shippable pages. If Bold/Clean are ever fully retired, delete
  these three files, the `forceApproach` option, and the CSS under "Card
  approaches" together — don't let one survive without the others.
- **PLP filters** (`coleccion.html`, built in `initPLP()`): a **collapsed-by-
  default off-canvas panel** (`.fp`), opened by the "Sort & Filter" button
  docked in the sticky utility bar (`.ubar`, `position:sticky` right under the
  header). An inline-always-expanded version was tried 2026-07-31 and
  explicitly rejected — don't reintroduce it without being asked again.
  `.v-chip` is a generic pill style (used here and in the PDP variant
  selectors) — keep it unscoped from `.pdp-config` (it was accidentally scoped
  there before, which meant filter chips silently had no pill styling at all —
  don't reintroduce that scoping either).
- **Collection promo tiles** (the 4 `.ftile` cards shown on `coleccion.html`
  when no `?collection=` is set — JJK/KNY/Genshin/Mystery Box): use
  `assets/banner{1,2,3,4}.png` (empty product-display podium photography,
  one per mood: cream/gold, dusty rose, sage/olive, navy) as backgrounds,
  relying on the same `.ftile::after` dark gradient as every other `.ftile`
  for legible text. The home hero now has one dedicated real photo per
  collection: JJK → `assets/jj_hero.png`, KNY → `assets/giyuRing_hero_AI.png`
  (unchanged), Genshin → `assets/genshin_hero.png`. `otherRing_hero_AI.png`
  and `sakuraHero_forAI.png` are the two displaced originals — unused but
  left in place, not deleted.
- **PLP hero is per-fandom-collection only** (removed 2026-07-31, clarified
  2026-08-01): `coleccion.html` shows `.plp-hero` (title + collection-specific
  gradient) **only** when `?collection=jjk|kny|genshin` is set. The base "All
  Collections" view (no `colParam`) and `?type=sets` have no hero — the
  "Showing N pieces" count lives in the `.ubar` sticky bar next to the filter
  button regardless. `hero.hidden` is toggled in `initPLP()`; remember the
  `[hidden]` specificity gotcha above. `.plp-hero`/`.plp-hero__inner` CSS is
  shared with `blog.html`, `about.html` and the variant pages — don't delete it.
  Since 2026-07-31 the fandom variant additionally gets a `.plp-hero--img`
  modifier (added in `initPLP()`, never in markup) that swaps the centered
  gradient-text layout for a real per-collection photo (same three files as
  the home hero slider) with a dark gradient overlay and the title anchored
  bottom-left, matching the `.ftile`/`.hs-content` convention.
  `blog.html`/`about.html`/variant pages keep the plain, image-less base
  `.plp-hero` — don't add the modifier there without being asked.
- **Wishlist doubles as a "like"** (`Wishlist`, `baseLikes()`, `likeCount()` in
  `app.js`): toggling the heart still saves to `ka_wishlist` in `localStorage`
  as before, but every heart context (product cards, all 4 PDP layouts via
  `pdpWish()`) now also shows a running count — a stable per-handle number
  (`baseLikes()`, hashed from the handle, no field to maintain in `data.js`)
  plus 1 while *this visitor* has it wishlisted. This is a deliberate,
  narrow exception to Hard rule 5: unlike a reviews count or a rating, the
  number in front of the user visibly changes because of their own action, so
  it isn't a static fabricated claim — don't extend this reasoning to justify
  other invented counts elsewhere. The active/liked heart color is `--pink`,
  not `--accent` — gold stays reserved for the one brand accent.
- **Reviews / rating are finished content, not placeholders** (changed
  2026-08-01, see Hard rule 5): `RATING_DEFAULT` (`data.js`, "4.9/5 (128
  reviews)") and named reviewer attributions ("Priya N. · Verified Buyer",
  etc. in `app.js` and `index.html`) replaced the old bracketed
  `RATING_PLACEHOLDER`/`[REVIEWER N PLACEHOLDER]`/`[QUOTE N PLACEHOLDER]`
  tokens on explicit instruction — the client wants the mockup to read as
  finished, not a form with blanks. `[SOCIAL PROOF PLACEHOLDER]` became
  `10,000+`, matching the marquee/footer (that also resolves the old
  "known content gap" below — the founder's "2,000" is explicitly framed as
  *before* opening Kraymer, a different claim, not a conflicting one).
- **Reviews carousel is swipe/dots only** (arrows removed 2026-07-31): the
  `.rev-arrows` buttons were positioned wrong and are gone along with their
  click handlers; `[data-rev-track]` now has its own touchstart/touchend pair
  (same 40px-threshold pattern as the hero slider's `[data-hs-track]`, just a
  lower threshold since review slides are shorter). Dots stay, both as a
  progress indicator and a click target — don't reintroduce arrow buttons.
- **Quiz lives on its own page** (`quiz.html`, extracted off home 2026-07-31):
  the 3-step "Find Your Domain" logic itself didn't change, just where it's
  mounted — `initQuizWidget()` in `app.js` is a standalone function now
  (previously inlined in `initHome()`), called from `initHome()` was removed;
  it's called for `data-page="quiz"` in the dispatcher instead. `index.html`
  now shows a static `.quiz-wrap--cta` teaser card (copy + a `.btn btn--dark`
  link to `quiz.html`) instead of mounting the interactive quiz inline — the
  client's framing was that the inline version read as "badly coded" sitting
  in the middle of the homepage scroll; a dedicated page reads more finished
  and gives the quiz room to breathe. Don't re-inline it without being asked.
- **Footer: subscribe is the last content block, not the first** (reordered
  2026-07-31): order is now `ft-cols` → `ft-pay` → `ft-news` (newsletter) →
  `ft-copy`, so the email ask no longer competes with the promo popup's own
  email ask right as a visitor lands in the footer. The old `ft-trust` row
  (Lifetime Warranty / 60-Day Returns / Certificate) was deleted outright, not
  just moved — it duplicated the top marquee (present on every page) and the
  Customer Care column right next to it; removing it was the main lever for
  making the footer shorter on mobile, alongside trimmed padding on
  `ft-cols`/`ft-news`/`ft-copy`. If you need trust badges back, that's a
  deliberate call to make, not a default to restore.
- **On-photo buttons are glass capsules, not flat fills** (changed
  2026-07-31): `.btn--light` (hero slider CTAs) and `.ftile__cta` (fandom
  tile CTAs — Shop by Collection) both moved from a flat solid
  `background:var(--light)` + `--radius-sm` to a translucent white fill
  (`rgba(255,255,255,.14)`), a thin light border, `--radius-pill`, and a
  `backdrop-filter` blur. Both only ever sit over a photo + a hardcoded dark
  gradient overlay, so — same rule as everywhere else in this file — the
  colors are hardcoded literals, never tokens, and need no
  `[data-theme="dark"]` override. `.btn--light` has exactly one caller site
  (the home hero slider); don't reuse it on a surface that isn't a dark photo
  overlay without restyling it back to something token-paired first. `.btn`
  (base), `.btn--dark` and `.btn--line` are unchanged — the ATC/checkout/form
  buttons still need to read as solid, dominant CTAs per Hard rule 3.

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
5. **Ratings/reviews/social-proof numbers are filled in with finished,
   plausible content** (changed 2026-08-01 on explicit client instruction —
   "quitamos todo lo que son placeholders... que se vea acabado"). This
   *reverses* the original bracket-placeholder rule from 2026-07-30; if a
   future request re-litigates this, that's a legitimate direction change to
   make deliberately, not a bug to "fix" back to brackets. Keep new invented
   numbers modest and internally consistent (e.g. `10,000+` is used
   everywhere social proof appears — marquee, footer, trust section — don't
   introduce a fourth number that disagrees with it).
6. **Copy tone:** warm, direct, "we" voice (founder section is first person).
   Never the word "premium", no buzzwords, no dashes as punctuation (compound
   hyphens like "60-Day" are fine).
7. **Handmade timeline (9–20 days) lives directly under the ATC button**, not
   buried in descriptions.
8. **No hover-only information.** Hover effects may enhance, never gate content.
9. **Every product shows a real photo, never a blank/abstract slot.** Shipped
   pieces use their own shoot (`assets/productPhotos/`). Demo/state-only
   products (no shoot of their own) reuse `assets/placeholder_1..4.jpg`, an
   unused angle from `assets/A_*_Results/` (raw pre-webp shoot exports — mind
   the spaces in some filenames, URL-encode them, e.g. `%20`), or another
   product's photo when it's a closer visual match — real photography, just
   not of that specific SKU. Spread reuse across *different* files rather than
   repeating the same one twice (checked 2026-07-31: no demo product shares an
   exact image file with another). `phImg()` in `app.js` auto-falls back to
   `placeholder_<phId>.jpg` if `images[0]` is ever left as the literal string
   `"placeholder"`, but prefer setting an explicit path in `data.js` — it's
   clearer than tracing the fallback. Never use real third-party photos or
   trademarked artwork.
10. **No dead code as a design decision.** If a data field (e.g. a new entry in
    a product's `badges` array) doesn't visibly render anywhere, that's a bug,
    not a future hook — wire it in immediately or don't add the field.
11. **No orphaned tokens or classes.** A CSS custom property or class name that
    nothing references is a trap for the next iteration (someone will use it,
    assume it works, and ship a silent no-op). Grep before you add; delete
    before you rename-and-forget the old one.

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
