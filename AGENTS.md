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
`.trust` (the Lifetime Warranty/60-Day Returns/Certificate row on home) and
`.quiz-wrap` (the Find Your Domain card, both the home CTA and `quiz.html`
itself) went through the same fix after being given a fixed `--surface-soft`
background 2026-07-31 (`.trust` for a card look it didn't have before,
`.quiz-wrap` because it used to sit on `var(--light)` — identical to the page
background, so the "card" was invisible even in light mode, not just a
dark-mode bug). Both got the same hardcoded-literal dark-mode override.

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
drawer). State lives in the plain in-memory `promoState` variable in
`app.js` (changed 2026-08-03 from `localStorage["ka_promo"]` — client wants
the popup to greet every fresh page load/reload, not just the first time
ever, so it must NOT survive a reload; don't reintroduce persistence here
without being asked again): `null` → the popup auto-opens once per load on
`index.html` via an `IntersectionObserver` on `.hero-slider` (fires the
moment its top edge scrolls above the viewport, then disconnects) →
`"dismissed"` (closed without an email — shows `.promo-fab`, a bottom-left
circular button that reopens the same modal, for the rest of THIS load only)
or `"subscribed"` (email submitted — FAB retired for the rest of this load,
popup doesn't reopen again until the next reload). The dismiss/subscribe
branching lives in the shared
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
`.promo-fab`'s `bottom` offset is the same everywhere (`1.35rem` + safe-area),
close to the thumb — including on PDP. This used to be page-conditional
(2026-07-31: `body[data-page="pdp"] .promo-fab` bumped it to `5.5rem` since
`.sticky-atc`, PDP's full-width fixed bar, occupies roughly the bottom 4.5rem
once the visitor scrolls past the buy box), but the client explicitly asked
2026-08-03 for the FAB to sit in "the same spot as home, everywhere" — so the
override was removed outright, on PDP the FAB now visually sits over the top
of `.sticky-atc` once it's showing (FAB's `z-index:56` > the bar's `55`, so
it renders on top, not hidden behind it). If that overlap turns out to bother
anyone, the fix is a fresh, deliberate ask — don't quietly restore the old
per-page override as a "bug fix."

## Component inventory

- **Marquee track must be two byte-identical halves** (bug found 2026-07-31):
  the top announcement bar duplicates its 4 items once so `@keyframes
  marquee{to{transform:translateX(-50%)}}` can loop seamlessly — but the
  first half was missing the middot between its last item and the first item
  of the second half, so the two halves weren't the same width. Result: a
  visible gap at that seam, and because the two halves were slightly
  different lengths, the `-50%` loop point didn't land exactly on the second
  half's start, causing a small stutter every cycle. Both symptoms were the
  same root cause. If you ever add/remove/reorder marquee items, keep both
  halves (in every page's inline copy *and* `partials.js`'s unused
  `ANNOUNCE_HTML`, kept in sync for when it's eventually wired up) exactly
  identical, separators included.
- **PDP gallery info button** (`PDP_IMAGE_NOTES`, `applyImgNote()` in
  `initPDP()`, 2026-07-31): the last two images of the 4 products with a full
  local photoshoot (`anya-x-yor`, `giyu-pin`, `giyu-ring`, `gojo-x-geto` — the
  only ones with 7 real images each) get a small `.gal-info` button in the
  corner; clicking it shows a `.gal-info__panel` caption over the image. The
  button/panel markup (`galInfoHTML`) is injected into `mainGal()` and into
  the immersive approach's gallery box, but there's only ever one instance in
  the DOM at a time (one PDP approach renders per page load), so `goGal()`
  and `goGalImmersive()` both call the same `applyImgNote(galIdx)` — harmless
  redundancy on approach 4, which already double-wires its gallery (see the
  `data-gallery-main`/`data-gallery-main-img` split below). Every other
  product has too few images for "the last two" to be meaningful, so
  `PDP_IMAGE_NOTES` simply has no entry and the button stays hidden.

- **Base `.card`** (no approach class — used by home Bestsellers and PDP
  cross-sell only, via `productCard(p, {approach:false})`): a real card
  container (`--surface-soft` fill, radius, subtle shadow), not a bare image +
  text flow. The three PLP "approach" variants each fully override
  background/radius/shadow, so changes here are invisible on `coleccion.html` —
  that's by design, don't chase parity between the two.
- **Shop by Collection** (`.ftile` on `index.html`, right after Bestsellers):
  full-bleed photography per collection (not `.ph` placeholders —
  rule 9 explicitly allows real photography for shipped pieces) with a
  hardcoded dark gradient overlay (`.ftile::after`). The home version's three
  tiles use `banner4`/`banner2`/`banner3`.png (2026-07-31) — the same mood
  images `coleccion.html`'s own "All Collections" promo tiles use for
  jjk/kny/genshin — rather than a bespoke photo per tile, for consistency
  between the two. Legible text regardless
  of theme. Text inside must stay on tokens that are *paired* with the tile's
  own background. **Correction, 2026-07-31:** this used to say
  `.ftile__body h3{color:var(--light)}` "pairs with" the permanently-dark
  `::after` gradient — that was wrong, `--light` *inverts* in dark mode and
  went dark-on-dark. `h3`/`p`/`.eyebrow` are hardcoded literals now
  (`#F6F6F6`, `rgba(246,246,246,x)`), same fix as `.card`/`.post-card` in the
  dark-mode section above. Don't add a hardcoded-photo section without also
  adding its gradient overlay, and don't pair it with a token that inverts.
- **Journal / blog** (`postCard()` + `renderPosts()` in `app.js`, `BLOG_POSTS`
  in `data.js`): one card renderer, two mounts — `[data-posts-home]` (first 3,
  horizontal scroll on `index.html`) and `[data-posts-all]` (all, grid on
  `blog.html`). Each post gets `id="<slug>"` on its own card so
  `blog.html#slug` (used by "Read more" links and the home preview) scrolls to
  it directly — there are no separate per-post detail pages, by design; the
  excerpt shown IS the full content, same low-fidelity-content convention as
  the rest of this mockup.
- **Product card titles never wrap to 2 lines** (2026-08-05): `.card__title`
  is `white-space:nowrap` with an ellipsis fallback, but a global
  `initCardTitleMarquee()` (called once at DOMContentLoaded, wired via a
  `MutationObserver` on `document.body`, not per-render-site) checks every
  `.card__title` site-wide and turns any that still overflow into a
  seamless looping ticker (`.card__title--marquee`/`.card__title__track`,
  two identical text+`•`-separator copies + `translateX(-50%)`). Uses a
  MutationObserver instead of calling a helper from every place cards get
  rendered (home bestsellers, PLP grid, PDP's 3 cross-sell rails, cart) so
  new call sites don't need to remember to wire it themselves. Two
  identical copies + a **text** separator, not a flex `gap`, is deliberate —
  a gap would reintroduce the exact stutter bug the header marquee had
  (see the marquee note further up this file): with a gap, `-50%` no
  longer lands exactly on the seam between copies.
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
     reviews section. **The only approach with the 2026-08-04 below-the-fold
     redesign** (see next bullet) — 2/3/4 still use the older, plainer
     `specsHTML`→`reviewsHTML`→`crossHTML` tail. Don't assume parity; this was
     a deliberate scoping call (client asked to redesign "everything below
     the purchase area" but confirmed Classic-only when asked, since it's the
     default everyone actually sees).
  2. **Editorial** — story-driven, large visual, dot pagination, full reviews.
  3. **Side** — compact two-column, no rating line, no reviews section (only
     specs + cross-sell) — intentional, not an oversight.
  4. **Immersive** — full-bleed gallery, floating price overlay, full reviews.
- **PDP Classic below-the-fold redesign** (2026-08-04, re-tuned 2026-08-05):
  a redesign brief arrived assuming a much richer PDP than this mockup
  actually has (UGC video, social embeds, packaging/"digital collectible
  experience", a big filterable review feed) — none of that content or
  those features exist here. Audited first, flagged the mismatch; client
  chose "grey-placeholder the missing-media sections rather than skip them
  or invent content." Current order below the untouched purchase area
  (gallery → tag/badge/title/price/desc → rating line with **bigger stars**
  (`.pdp-rating__stars`, needs the extra `.stars.pdp-rating__stars`
  specificity to beat the older `.pdp-rating .stars` rule) → wishlist on
  its own left-aligned line below the rating, not inline with it anymore →
  variants → ATC/Buy Now → assurance card):
  `specsHTML` (5 accordion items — Specs & Materials, Concept &
  Inspiration, **Shipping & Returns** (new, consolidates
  `noteHTML`/`guaranteeHTML`/about.html facts rather than duplicating a
  paragraph), Care Instructions, **Is this official licensed
  merchandise?** (the one about.html FAQ question not already covered on
  the PDP — deliberately no separate PDP FAQ section, nothing left to put
  in it) — every item now has a small `faqIco()` lucide icon via
  `.faq__btn-label`, a flex wrapper needed so the icon+text group together
  on the left while `.faq__btn`'s own `::after` chevron still gets pushed
  right by `justify-content:space-between`) → `storyHTML` ("The story
  behind the piece" — moved above the UGC rail 2026-08-05, client liked it
  and wanted it earlier; simplified to **one** image (`.pdp-narrative__img`)
  instead of a two-image row, with `Read the full craft process` as its own
  prominent `.pdp-narrative__cta` line linking to `about.html#craft`, not
  inline at the end of a paragraph) → `ugcHTML` ("Seen in the wild", grey
  placeholders, names reused from the reviewer pool) → `collectibleHTML`
  ("What's in the box", 2 cards only — Presentation/pouch and Certificate
  of Authenticity, the only two claims with real backing) → a standalone
  "Back to All Collections" CTA (`.btn.btn--line`, own centered section) —
  deliberately pulled out of `.pdp-meta` and moved down here, since a plain
  text link sitting under the specs accordion read like a stray nav item →
  `completeLookHTML`/`alsoLikeHTML` (Classic-only split of the old single
  cross-sell rail: "Complete the Look" filters to `p.collection`, "You May
  Also Like" filters to *other* collections; both use
  `.scroll-row--compact` for smaller cards; `crossHTML`/`data-crosssell`
  itself is untouched and still what the other 3 approaches use) →
  `reviewsHTML`, last on the page — a plain vertical `.rev-list` of 5
  reviews plus one more behind `[data-rev-extra]`/`[data-rev-loadmore]`
  (was a 3-card scroll-row + a 3-more show/hide toggle; only 6 review
  quotes exist in this mockup, so "Load More" reveals the 1 remaining and
  then disables, same convention as the PLP's own load-more button).
  No new dependency, no new carousel library — every rail reuses the
  site's existing native-scroll/scroll-snap pattern
  (`.scroll-row`/`.rev-scroll`/`.post-scroll`), no desktop prev/next arrows
  were added since no existing rail on the site has them either.
  Two real pre-existing dark-mode bugs were fixed in the same pass, same
  bug family as the rest of this file: `.rv` (review card) and the new
  `.collectible-card` both sit on the fixed `--surface` background but had
  no hardcoded-text override, so their text was inheriting the inverting
  `--dark` token and going near-white-on-near-white.
  **2026-08-06 follow-up pass:** `collectibleHTML` now renders *before*
  `ugcHTML` (was after) and grew a 3rd card, "Solid, Not Plated" — the one
  legitimate way to answer "how do we compare to other brands" without
  inventing a benchmark or naming a competitor: it reuses the same
  solid-metal-vs-costume-jewelry claim already made on about.html, not a
  new one. `guaranteeHTML` is a 3-column grid now (icon-over-label, same
  visual language as home's `.trust__row`/`.trust__icon`), not a vertical
  list, and `.pdp-assurance` lost its border-radius to match home's square-
  cornered `.trust`. `storyHTML`'s image (`.pdp-narrative__img`) is a true
  viewport-edge-to-edge bleed now (the classic `left:50%;margin-left:-50vw`
  breakout, needed because PDP's `<main>` **is** `.w` itself — every PDP
  section sits inside that ambient gutter, so "full-bleed" here means
  actively breaking out of it, not just removing padding) with square
  corners; the text below it moved into its own `.pdp-narrative__text` with
  deliberate extra inset — image bleeds, text doesn't, on purpose.
- **Variant pages** (`variant1.html`/`variant2.html`/`variant3.html`,
  `initVariant(approach)` in `app.js`): show the same fixed set of 8 products
  three times, once per card approach (Bold / Clean / Soft), for internal
  side-by-side comparison only. **These never go to production** — they're
  marked `<meta name="robots" content="noindex,nofollow">` and carry an
  "Internal Only" eyebrow in the hero copy. The nav's "Variants" dropdown
  that used to link to them was removed 2026-08-03 ("no lo necesitamos por
  ahora") — the three files themselves are untouched on disk, deliberately
  kept as an unused backup rather than deleted, reachable only by typing the
  URL directly. If you need to compare approaches again, restore the nav
  entry rather than rebuilding the pages. If Bold/Clean are ever fully
  retired instead, delete these three files, the `forceApproach` option, and
  the CSS under "Card approaches" together — don't let one survive without
  the others.
- **PLP filters** (`coleccion.html`, built in `initPLP()`): a **collapsed-by-
  default off-canvas panel** (`.fp`, labeled "Filters"), opened by the button
  docked in the sticky utility bar (`.ubar`, `position:sticky` right under
  the header) — Sort/Collection/Material/Price/Availability all live inside
  it. This went inline-sort-bar → back to fully off-canvas across two
  requests in the same week (2026-08-02 then 2026-08-03): the 2026-08-02
  change put Trending/Newest/Price on their own always-visible row; the very
  next request reverted that specifically ("como estaba antes"), so don't
  re-extract sort into an inline bar again without being asked a third time.
  What DID stick from the 2026-08-02 pass: every chip carries an icon
  (`sortIcons`/`filIcons` in `initPLP()`) — if you add a new filter value,
  give it an icon in the same object, don't ship a bare label — and the Sort
  group is visually bigger/bolder than Material/Price/Availability
  (`.v-chip--sort`: larger, accent-bordered, accent-filled when selected)
  since sort is the filter users reach for most. The mobile nav's
  COLLECTIONS submenu (JJK/KNY/Genshin drill-down) is back too — the
  2026-08-02 removal ("that navigation now lives on the page instead") was
  also reverted 2026-08-03 ("eso no había que cambiarlo"); don't remove it
  again on the same reasoning, that call was made and un-made once already.
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
  bottom-left, matching the `.ftile`/`.hs-content` convention. **Gotcha hit
  immediately after shipping it:** the first pass set
  `.plp-hero--img .plp-hero__inner{padding:2rem 0 2.5rem}` as a shorthand,
  which zeroed the horizontal padding `.plp-hero__inner`'s own `.w` class was
  providing — the title rendered flush against the screen edge. Fixed by
  setting `padding-top`/`padding-bottom`/`padding-left` as separate longhand
  properties instead of a shorthand, so `.w`'s `padding-right` survives; a
  shorthand always resets every side it doesn't mention, a longhand never
  touches sides it doesn't name. The eyebrow uses `var(--accent)` (the hero-
  eyebrow exception in the gold-accent rule above) and the description is a
  bespoke per-collection line (`heroCopy` in `initPLP()`) written in the same
  evocative, never-name-the-anime voice as the home hero slider — don't
  revert it to one generic line shared by all three collections.
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
- **Home reviews are a horizontal scroll of cards, not a swipe carousel**
  (changed 2026-08-03): the old single-slide `.rev-carousel`/`.rev-track`/
  `.rev-dots` swipe widget (dots-only, arrows removed 2026-07-31) was
  replaced with `.rev-scroll.rev-scroll--home`, ~7 compact `.rvc` cards
  (`.rvc__photo` + `.rv__avatar--sm` + quote), matching the same
  scroll-row mechanics used everywhere else (Best Sellers, PDP cross-sell,
  PDP's own reviews). The old carousel CSS/JS (`initHome()`'s
  `[data-rev-track]`/`[data-rev-dots]` wiring) was deleted outright, not
  left dormant — don't resurrect a swipe carousel for reviews without being
  asked again. `.rvc__photo` is a grey placeholder (a real per-review customer
  photo, not just the avatar) — same "client will supply photos later"
  convention as `.rv__avatar`. `.rvc` sits on `--surface` (fixed, doesn't
  invert) so its text needs the same hardcoded dark-mode override as
  `.card`/`.post-card` above (`[data-theme="dark"] .rvc{color:#181514}`).
- **Founder, craft process and FAQ live on `about.html` only** (consolidated
  2026-08-02): home used to duplicate the full founder copy and the 3-item
  craft grid (`#craft` section) and also carried its own 4-item FAQ
  (`index.html#faq`). That's now a single unified `about.html`: a fuller
  founder section (photo placeholder + name/role header + pull-quote, see
  `.founder__head`/`.founder__pull` in the dark-mode-safe styles) followed by
  the craft grid, then a **6-item** FAQ (`#faq`, two new items added — "Is
  this official licensed merchandise?" and "Can I choose the metal and size
  myself?" — don't drop back to 4 without being asked), then the trust row +
  CTA. Home (`index.html`) keeps only a compact one-line founder teaser (small
  avatar circle + one sentence + "Read our full story →" link to
  `about.html`) in the section still tagged `id="craft"` for anchor
  stability, and has no FAQ section of its own — every internal link that
  used to point to `index.html#faq` (mobile nav, footer Customer Care column)
  now points to `about.html#faq`. Founder signature reads "Kraymer" /
  "Kraymer, Founder", not "David Wang" — if you see that name reappear
  anywhere, it's stale content, not a deliberate callback.
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
  2026-07-31, columns re-reordered 2026-08-03): order is now `ft-founder` →
  `ft-cols` → `ft-news` (newsletter) → `ft-pay` → `ft-copy` — payment-card
  logos sit after the newsletter CTA now, not before it. Within `ft-cols`,
  Shop and Brand are the two top-row columns; Customer Care spans the full
  width on its own row below (`style="grid-column:1/-1"` on that div) rather
  than sitting in the 2-column grid alongside them. So the email ask no
  longer competes with the promo popup's own email ask right as a visitor
  lands in the footer. The old
  `ft-trust` row (Lifetime Warranty / 60-Day Returns / Certificate) was
  deleted outright, not just moved — it duplicated the top marquee (present on
  every page) and the Customer Care column right next to it; removing it was
  the main lever for making the footer shorter on mobile, alongside trimmed
  padding on `ft-cols`/`ft-news`/`ft-copy`. If you need trust badges back,
  that's a deliberate call to make, not a default to restore.
- **Footer founder row** (`.ft-founder`, added 2026-08-02): a small avatar +
  name/role + social icon row sits above `ft-cols`. The avatar
  (`.ft-founder__avatar`) is a hardcoded mid-grey circle placeholder — the
  client is supplying a real photo later, don't treat the grey fill as a bug.
  `.ft-social` (Instagram/YouTube/TikTok, lucide-style inline SVGs) replaces
  the old plain-text "Instagram"/"YouTube" links that used to sit inside the
  Brand column — don't re-add them there, this row is their one home now.
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

- **Section rhythm is tight, on purpose** (2026-08-02, tightened again
  2026-08-05): `.sec` is now `2.25rem 0` (was `5rem` → `2.75rem` →
  `2.25rem`), `.sec--sm` is `1.5rem 0` (was `3rem` → `2rem` → `1.5rem`), and
  most `.ct` margin-bottoms were trimmed from `2rem`/`1.5rem` to
  `1–1.25rem` — a recurring client request to cut scroll depth site-wide,
  asked again on 2026-08-05 specifically because it kept feeling too loose
  even after the first pass. If a future request repeats this yet again,
  that's a sign these base values are still the wrong default, not that the
  request is redundant. `.hero-slider` dropped its
  `aspect-ratio:3/4` (near full-viewport-tall on a phone) for an explicit
  `height:56vh` (`64vh` at `min-width:768px`) — "about half the screen," not a
  fixed aspect ratio, was the actual ask. `.plp-hero` shrank the same way
  (`45–55vh` → `24–32vh`). Don't restore the old numbers as a "fix" for
  perceived whitespace regressions — the tightness is intentional; if a
  future pass wants more breathing room back, that's a deliberate call.
- **PDP: cross-sell moved above reviews, images shrank, reviews scroll
  horizontally** (2026-08-02): in approaches 1/2/4 the render order is now
  `${crossHTML}${reviewsHTML}` (was the reverse) — "You may also like" no
  longer sits at the very bottom of the page. `.gal` (main gallery image) is
  `aspect-ratio:4/3` (was `1`), `.gal-strip` thumbnails are `56px` (was
  `72px`) — a deliberate "lighter page" pass, not a bug; approach 3 ("Side")
  overrides `.gal`'s aspect-ratio inline in `initPDP()`, keep that override in
  sync if `.gal`'s default changes again. `noteHTML` + `guaranteeHTML` are now
  wrapped in one `.pdp-assurance` card instead of two stacked boxes, and
  `specsHTML` grew a `.pdp-details-head` eyebrow ("Details") so the specs
  accordion doesn't start with zero visual lead-in. PDP's `reviewsHTML` (and
  the home reviews carousel) render `.rv` cards inside `.rev-scroll`
  (horizontal, snap-scroll) instead of a stacked column, and every `.rv`
  now has an `.rv__avatar` — a hardcoded grey placeholder circle for a
  customer photo the client hasn't supplied yet, same convention as
  `.ft-founder__avatar`. Don't remove the avatar slot thinking it's an empty
  bug.

- **Functional (not redesigned) desktop pass, ≥1180px** (2026-08-08, client
  explicit brief: "no tocar nada en móvil, pero que el 1% de escritorio al
  menos pueda navegar" — this is a usability floor, not a visual redesign).
  Everything below 1180px, including the existing 768px/1024px tablet
  breakpoints, is completely untouched.
  - `.w` grows to `max-width:1400px` (from 1080px) only in this block — more
    breathing room once the viewport actually has it.
  - The off-canvas `.mob-nav` (hamburger + slide-in drawer) is fully
    functional at any width already — it's just an unconventional look on a
    desktop screen. `.hamburger` is hidden ≥1180px and replaced by `.dsk-nav`,
    a plain inline link row injected into `.hdr-bar` in `HEADER_HTML`
    (`partials.js`) right after the logo: Collections/JJK/KNY/Genshin/Sets/
    Our Story/Journal/Quiz. `.mob-nav` itself is untouched in markup and CSS —
    it simply becomes unreachable at this width since its only trigger is
    hidden, not deleted.
  - `.dsk-only` (new utility class, `display:none` until 1180px) marks two
    new header icons — search and wishlist — added to `.hdr-actions` so
    desktop has some way to reach them now that the off-canvas menu (which
    carries the mobile-only "Search" row and the wishlist/theme footer
    buttons) is hidden. Both reuse the existing delegated
    `[data-open-search]`/`[data-open-wishlist]` handlers in `app.js`
    unchanged — no new JS. Dark mode toggle was deliberately **not** given a
    desktop icon: `initHeader()`'s theme-sync code does
    `document.querySelector("[data-theme-toggle]")` (singular), so a second
    instance in the header would silently desync its sun/moon icon from the
    mobile nav's — not worth it for a toggle that's reachable one click away
    from parity in scope.
  - 1180px, not the existing 1024px breakpoint, on purpose: 1024px is already
    spoken for by the `.pgrid` 4-column bump, and cramming 8 nav links plus 4
    header icons into a ~1024px-1180px viewport risked overflow/wrap. Tablet
    landscape (1024-1180px) keeps the off-canvas nav; only genuinely wide
    viewports get the inline one.
  - Three vw-based widths that had no pixel ceiling — `.scroll-row>*` (62vw),
    `.scroll-row--compact>*`/`.viewall-card` (42vw) — were switched to
    `min(Xvw, Ypx)`. At 375-414px this resolves to the exact same vw value as
    before (mobile is unaffected, not just "close enough"); uncapped on a
    1920px desktop viewport they rendered ~1190px/~800px cards. Same fix
    applied to two JS-generated inline styles: the "All Collections" promo
    tiles in `initPLP()` (`min-width:55vw` → `min-width:min(55vw,320px)`) and
    the Immersive PDP (`approach=4`) gallery thumbnail strip
    (`width:25vw` → `width:min(25vw,110px)`). Every other vw-based width in
    the codebase already carried its own `max-width` (`.ugc-card`,
    `.collectible-card`, `.rev-scroll>.rv`, `.rvc`) and didn't need this.
  - Not touched, deliberately: `.pdp-narrative__img`'s `100vw` full-bleed
    breakout (that's the point of a bleed image, capping it would defeat it),
    and the `.fp` filter panel / `.drawer` cart — both already `min(92vw,
    <px>)`, so already desktop-safe. **Correction:** an earlier version of
    this note also claimed `.search` overlay was already pre-capped — it
    wasn't, see the follow-up pass immediately below. Verify the actual
    rendered width before trusting a claim like this, this file included.

- **Desktop pass follow-up: things the first pass missed** (2026-08-08, same
  day, client feedback after seeing it live: "hay imagenes gigantes, cosas
  sin sentido" — review everything full-width). The first pass above fixed
  the header/nav and the vw-based rail widths but didn't audit every
  full-bleed and fixed-position element; this pass did, using actual
  `getBoundingClientRect()` measurements at 1440px rather than eyeballing.
  - **Real bug, not desktop-only:** `.plp-grid .pgrid,.pgrid{...}` (the PLP
    grid rule) was a leftover duplicate of the base `.pgrid` rule, but the
    `.plp-grid .pgrid` half of that selector list has specificity (0,2,0) —
    higher than the plain `.pgrid` used by the 768px/1024px column-count
    bumps (0,1,0). Specificity beats source order, so the PLP grid had been
    silently pinned to 2 columns at *every* width, including the existing
    tablet breakpoints, for as long as that duplicate existed. Fixed by
    dropping the over-specific half; the properties were byte-identical to
    the base rule, so nothing else changed. This one predates the desktop
    pass entirely — it just took a real 1024px+ measurement to surface it.
  - **Giant images**, all from the same root cause (a percentage/vw width or
    an aspect-ratio multiplying up against the now-1400px `.w`, with no
    pixel ceiling): the home "Wear and Care" journal rail
    (`.post-scroll{grid-auto-columns:75%}` → `min(75%,320px)`, same
    mobile-safe `min()` pattern as the first pass's `.scroll-row` fix); the
    PDP Classic "story behind the piece" bleed image
    (`.pdp-narrative__img`, was 1080px tall at 1440px viewport — kept the
    deliberate 100vw breakout, gave it an explicit `height:420px` instead of
    letting `aspect-ratio:4/3` drive it); and the Immersive (`approach=4`)
    hero gallery (`[data-gallery-main]`, was ~1866px tall — its
    `aspect-ratio:3/4` is set via inline style in `app.js`, so the override
    needs `!important` *and* must be scoped to `.pdp--immersive
    [data-gallery-main]`, not the bare attribute selector, since `mainGal()`
    puts the same `data-gallery-main` attribute on the plain `.gal` element
    approaches 1/2/3 use — which was already correctly sized and must not be
    touched).
  - **Full-width things with no reason to be:** the PDP `.rev-list` (the
    plain vertical review list approaches 1/2/4 share — `.rev-scroll`'s own
    cards already cap at 340px and were unaffected) had review paragraphs
    stretching past 1200px per line; capped `.rev-list{max-width:640px;
    margin:0 auto}`. `.sticky-atc` stretched the thumbnail to the left edge
    and the button to the right edge of the viewport with a canyon of empty
    space between — same `max-width:640px` centering fix. The footer
    newsletter `<input>` was matching the full (now 1400px) `.ft-cols`
    column width — `.ft-news form{max-width:420px}` (left-aligned, not
    centered, to match the rest of that column).
  - **Search overlay, and a real flexbox gotcha:** `.search__bar`/
    `.search__body` needed the same `max-width:640px;margin:0 auto`
    centering — but adding just that produced a ~310px box, not 640px. Both
    are flex items in `.search`'s column flex layout, and a flex item with
    an `auto` cross-axis margin does **not** get the default stretch
    behavior — without an explicit `width`, the browser sized the box to
    fit-content first and then centered *that* narrow box, silently
    ignoring the `max-width` cap. Fixed by adding `width:100%` alongside the
    existing `max-width`/`margin:0 auto` (now `min(100%, 640px)`, correctly
    centered). Worth remembering for any *other* flex-item-plus-auto-margin
    centering attempt in this file.
  - Every fix above lives in the existing `@media(min-width:768px)` "Desktop"
    block (not the newer 1180px one from the first pass) since none of them
    are nav-real-estate-dependent — they're plain "don't let this blow up"
    fixes that are equally correct starting at tablet width.

- **Desktop pass, round 3: full-page 1400px alignment + nav redesign**
  (2026-08-08, same day, client: "hay cosas MUY mal, que llegan a márgenes,
  que no están alineadas" + explicit nav requests). Two unrelated asks
  handled together since both touch `.hdr-bar`.
  - **Alignment:** `.hero-slider`, `.plp-hero`, `.sub-scroll` and `.hdr-bar`
    itself were still running edge-to-edge while `.w`-wrapped content around
    them was boxed at 1080px/1400px — the actual source of "no están
    alineadas" (e.g. the hero's headline sat further left than "Best
    Sellers" below it). Fixed by giving all four the exact same
    `max-width`/breakpoint pair `.w` uses (1080px from 768px, 1400px from
    1180px — see the two matching rules in each media block), so every edge
    on the page lines up at every width. `.pdp-narrative__img`'s deliberate
    100vw/-50vw full-bleed breakout (added 2026-08-06, reaffirmed as
    deliberate in round 1 above) is explicitly overridden back to 100%-of-
    parent in the 768px block — the "everything stays in the boxed column"
    ask supersedes the earlier full-bleed call. `.marquee` and the
    `.sec--dark`/`.sec--warm` section bands were deliberately left
    full-bleed: they're solid-color backdrops with no fixed left edge for
    their content to misalign against (the scrolling ticker has no "start"),
    unlike a hero or nav bar — capping *those* would just trade one
    inconsistency (edge-to-edge bands next to boxed content) for a worse one
    (a floating dark rectangle with visible page-background gutters on each
    side, on an ultra-wide screen). Flag if this reasoning doesn't hold once
    seen live.
  - **Nav redesign:** the 8 flat `.dsk-nav` links became 4 groups —
    "All Collections" (`.dsk-drop`, hover/`:focus-within` dropdown panel
    holding JJK/KNY/Genshin/Collector Sets, wording matched to the mobile
    nav's own COLLECTIONS submenu) — "Our Story" — "Journal" — "Take the
    Quiz" (`.dsk-nav__cta`, styled as a small dark pill button, not a plain
    link, via `.dsk-nav a.dsk-nav__cta` which out-specifies the generic
    `.dsk-nav a` color/hover rules without `!important`). The dropdown opens
    on `:hover` *or* `:focus-within`, not hover alone — a keyboard user
    tabbing into JJK/KNY/etc keeps it open via focus, so this doesn't trip
    Hard rule 8 (no hover-only gating). No JS was added for any of this,
    pure CSS.
  - **"Centramos el menú":** `.hdr-bar` became a 3-column grid — but
    `grid-template-columns:auto 1fr auto` (logo/nav/icons columns sized to
    content) was tried first and centered the nav ~39px off the bar's true
    center, because the logo (~97px) and the icon cluster (~174px) aren't
    the same width, so "centered in the leftover space" isn't the same as
    "centered on the bar." Fixed with `1fr auto 1fr`: forcing both flanking
    columns to an equal fractional share (regardless of their content's
    actual size) makes the middle `auto` column — and the nav inside it —
    truly centered on the full bar. `.hdr-logo`/`.hdr-actions` need
    `justify-self:start`/`end` so they don't stretch to fill their now-wider
    equal-share columns.
  - All of the above only activates once `.dsk-nav` itself is visible
    (≥1180px for the nav-dependent grid change; the alignment fixes use the
    768px/1180px pair like `.w`) — nothing here touches mobile.
  - **Follow-up same day:** the dropdown above shipped broken — client
    report: "el drop-down no funciona." `.dsk-drop` has no explicit height,
    so its `:hover` box is exactly as tall as the trigger link (~20px); the
    panel's `margin-top:.6rem` put 9.6px of dead space below that box, off
    `.dsk-drop` entirely. Moving the cursor from the link down toward
    JJK/KNY/etc crossed that dead space and lost `:hover` before ever
    reaching them, closing the panel mid-motion. Fixed by moving the gap
    inside the panel as `padding-top` instead of `margin-top` on the panel
    itself, so the panel's own box touches the trigger with zero dead
    pixels. Verified with an actual simulated hover-then-move-then-click
    through the gap into JJK, confirmed it navigates.

- **Desktop pass, round 4: proportion/scale on a 27" 16:9 monitor**
  (2026-08-08, same day, client: "cosas que siguen viéndose rascas... con
  mucho criterio"). Rounds 1-3 fixed alignment, blowups and nav structure;
  at a real 2560px width the remaining problem was proportion — mobile-sized
  chrome (52px header, 14px logo, 20px icons, 12.8px nav text) and
  never-bumped section headings floating in a much bigger canvas.
  - **One lever, not fifty:** every font-size/padding/gap in `styles.css`
    and `app.js` is rem-based (verified by grepping for hardcoded px
    font-sizes — zero results in either file), so `html{font-size:18px}` at
    ≥1180px scales headings, body copy, buttons, chips, badges and rem-based
    spacing together, proportionally, in one rule instead of hand-tuning
    dozens of individual ones. Confirmed in testing: `h2` (2026-08-06
    default, never explicitly bumped before) went 28px→31.5px, `.pdp-title`/
    `.pdp-price` 28px→31.5px, `.card__title` ~17.6px→18.9px, all without
    touching a single one of those rules directly.
  - **What does NOT scale from that lever, and had to be bumped separately:**
    anything already in hardcoded px rather than rem, since px is absolute.
    `--header-h` (52px→68px — it's px, not rem, because it's also read by
    `.mob-nav`'s padding calc on mobile and needed to stay a stable physical
    value there), the logo's height (an HTML `height="14"` attribute in
    `partials.js`, not CSS at all — overridden via `.hdr-logo img{height:
    18px}`), and `.ico`'s box/svg (42px/20px → 46px/22px). `.ubar{top:52px}`
    was hardcoded rather than `var(--header-h)` — bumped to `68px` alongside
    it in the same rule; this is exactly the kind of silent staleness that
    happens when a sticky-offset doesn't reference the token it depends on,
    worth grepping for again if `--header-h` changes a third time.
  - **Section rhythm, desktop-only:** `.sec`/`.sec--sm` (2.25rem/1.5rem) were
    tightened repeatedly for mobile scroll fatigue — see the 2026-08-02/
    08-05 notes earlier in this file — but that reasoning is mobile-specific
    and reads as cramped on a wide desktop screen. Bumped to 3.5rem/2.25rem
    ONLY ≥1180px. Only affects sections using the bare class: Best Sellers,
    Shop by Collection and the FAQ's bottom carry an inline
    `style="padding:..."` from the mobile-tightening pass, and inline styles
    always beat this rule — left as-is rather than refactored into classes
    only for this, since those are the sections the client tightened most
    recently and on purpose (inline styles can't be responsive at all, so
    this is a real ceiling on how far a "make desktop breathe more" pass can
    go without touching markup).
  - **`.ftile` proportion:** `min-height:150px` is a deliberate mobile
    "panoramic, not portrait" call (see the note earlier in this file), but
    at a ~450px-wide desktop column (1400px ÷ 3) that reads as a squat
    2.4:1 sliver. Bumped to `230px` (≥1180px only) for a ~1.85:1 desktop
    proportion; mobile's single full-width column is unaffected.

- **Desktop pass, round 5: specific fixes from a live-site walkthrough**
  (2026-08-08, same day). Client reviewed the deployed rounds 1-4 and called
  out concrete items; the one deliberate mobile exception this round is
  called out explicitly below, everything else is desktop-only.
  - **Marquee runtime fix, `initMarquee()` in `app.js`:** the static 2-half
    ticker markup is sized for 375-414px and was never touched — on a wide
    desktop viewport the loop ran out of content mid-screen and hard-cut
    back to start ("el texto se corta y pega cambio"). Fixed at runtime, not
    via a CSS breakpoint, so it holds at any width: measures the existing
    first half, and if a screen is wider than it, rebuilds the track as N
    repeats of that same half (both halves still byte-identical, preserving
    the seamless-loop invariant from the note earlier in this file) with
    `animation-duration` scaled by the same factor N so the scroll speed
    (px/s) doesn't change just because there's more content to cover. If one
    half already covers the viewport — true on mobile — nothing runs at all.
  - **Desktop dark-mode toggle:** there wasn't one (round 1 deliberately
    skipped it — see that note — because `initHeader()`'s theme-sync used a
    singular `document.querySelector("[data-theme-toggle]")`, which a
    second instance would have desynced). Client wanted the toggle back, so
    the actual fix landed instead of skipping it: both the restore-on-load
    check and the click handler now use `querySelectorAll(...).forEach(...)`.
    New icon button in `.hdr-actions` (`.ico.dsk-only.theme-btn`, reusing
    the existing generic `.theme-btn .theme-sun/.theme-moon` show/hide
    rules — they were never scoped to the mobile-only `.mob-action-btn`
    wrapper, so no new CSS was needed for the icon swap itself).
  - **Horizontal scroll rows had no way to be scrolled with a mouse alone**
    (`scrollbar-width:none` hides the native bar; there's no touch gesture
    without a touchscreen) — client: "no puedo hacerlos." `initScrollArrows()`
    in `app.js` adds prev/next arrows to every `.scroll-row`, `.rev-scroll`,
    `.post-scroll`, `.ugc-scroll`, `.collectible-scroll` and `.sub-scroll`,
    wired via the same MutationObserver-on-`document.body` + dataset-flag
    pattern `initCardTitleMarquee()` already uses (these rows get filled
    from many different call sites, not one central place). Rows without
    their own alignment get wrapped in a new `.scrollx-wrap` (mirrors `.w`'s
    two breakpoints) — this doubles as the fix for those same rows running
    edge-to-edge past the boxed column at desktop widths ("que no se vayan
    hasta los márgenes"); `.sub-scroll` already had its own alignment from
    round 3, so it gets arrows without a wrap. **Real bug caught in
    testing:** the arrows' hidden/visible state was computed once, at attach
    time — but the empty `<div data-bestsellers>` mount often gets arrows
    *before* `renderCards()` fills it in a later, separate mutation, so
    "next" could compute `max<=0` and hide itself against a still-empty row,
    then never re-check once real cards landed. Fixed by stashing the
    `update` closure on the row (`row._scrollxUpdate`) and re-running it for
    every already-initialized row on every subsequent mutation the observer
    sees, not just that row's own scroll/resize events.
  - **Best Sellers / PDP cross-sell card width:** round 1's `200px` cap was
    the minimum "don't blow up" fix; client wants these "un poco más
    grande," and separately wants the two PDP cross-sell rails wide enough
    that 5 products fill a full desktop row without scrolling. One number
    (`250px`) serves both — at the 1310px content width inside a 1400px
    `.w`, 5 cards at 250px + 4×1rem gaps fit almost exactly. The two
    cross-sell `.slice(0,4)` calls in `initPDP()` became `.slice(0,5)` to
    match (a rail can still render fewer than 5 if a collection doesn't
    have that many eligible products — that's a real data limit, not a bug).
  - **Home page rhythm:** `.trust.w` (both classes — see the "why not just
    `.trust`" specificity note this trick requires, same reasoning as
    `.rev-list` above) capped to `900px`, matching the `.quiz-wrap`/
    `.founder` narrow-card family either side of it on the page, and its
    text bumped (`.62rem/.58rem` read as too small for the box — client:
    "contextos muy pequeños"). The founder teaser's "Read our full story"
    link moved to its own row on desktop only, via
    `.founder > a.btn--ghost{flex-basis:100%}` — no HTML change; this
    selector is deliberately structural (direct-child anchor) rather than a
    new class, since about.html's own, much larger `.founder` section has
    no direct-child anchor at all and so is untouched by it. Mobile already
    stacks this by necessity (insufficient width for one row) — desktop had
    room to keep it inline, which read wrong once there was that much room.
  - **4th blog post** added to `BLOG_POSTS` (`reading-a-batch-number`) and
    the home preview slice bumped `slice(0,3)`→`slice(0,4)`: 3 cards at the
    new 320px-capped `.post-scroll` width left a visibly empty trailing gap
    in the row before it needed to scroll at all. `blog.html`'s own grid
    (`.post-grid`, all posts, 3 columns) now has 7 and ends with a lone
    item in its last row — normal for a page grid, not the same "dead
    space in one viewport" problem the horizontal rail had.
  - **Promo gift FAB** bumped `60px`→`76px` (≥768px) — sized for a mobile
    thumb-reach target, read as small once everything around it scaled up.
  - **PDP gallery, two real bugs from the same root cause (square source
    photos, non-square desktop crops):** Approach 4 "Immersive"'s hero image
    was `height:560px` on a full-width (up to 1400px) box — round 1 fixed
    "1866px-tall giant image" but didn't check what a 2.5:1 crop does to a
    real photo. All four fully-shot products' source photos are natural
    squares (2000×2000, confirmed in testing) — cropped into 2.5:1, `cover`
    only shows the middle ~40% of the photo's height, a much harder zoom
    than intended (client: "super escalada"). Fixed by capping the box to a
    square (`aspect-ratio:1`) at a sane `max-width:640px` instead of
    stretching it across the full column — shows the whole photo, centered,
    uncropped. Separately, `.pdp-layout{align-items:start}` (grid default is
    `stretch`) — without it the shorter gallery column silently stretches
    to match the taller meta column's height, an invisible-but-real "hueco
    raro" (no visible border/background on that column, so it wasn't a
    visible artifact, but the wrong box model regardless — client's "usar
    toda la columna principal... que no haya huecos raros" ask is the
    correct standard to hold this to even where the bug wasn't visible).
  - **"The story behind the piece" redesign — mobile AND desktop, the one
    deliberate exception to "no tocar el móvil" this round** (client named
    it explicitly). Was a true 100vw/-50vw full-bleed breakout with a 4:3
    crop (2026-08-06 call, reaffirmed as deliberate in round 3); now a
    contained card matching the rest of the site's card language
    (`--surface-soft` fill, radius, shadow — plus the matching
    `[data-theme="dark"]` text override every fixed-background card in this
    file needs) with a true square photo. Stacked (photo on top) on mobile;
    a 2-column grid (photo left, text vertically centered right) at
    ≥768px.
  - **Collectible rail** ("What's in the box") grew from 3 cards to 5 —
    "Free Lifetime Resizing" and "Your Batch, Numbered" — both restate
    claims already made elsewhere on the site (ring-size-guide copy,
    handmade-timeline/certificate copy), not new invented claims, per Hard
    rule 5's spirit. **UGC rail** ("Seen in the wild") grew from 6 to 9 —
    added Chloe M. (the one name from the shared reviewer pool not already
    used here) plus a second post each for two existing names (a real
    customer posting a photo and a video separately, not a new fabricated
    identity). Both were sized to fill a full desktop row instead of
    leaving trailing empty space before the new scroll arrows even had
    anything to scroll to.
  - **Sticky ATC bar reversed back to full-width on desktop** — round 3
    had capped it to `640px` to fix a canyon of empty space between the
    thumbnail and the button; client explicitly asked for the bar itself to
    span full width after all. Resolved the *same* canyon problem a
    different way instead of just reverting: the bar's markup in `app.js`
    now wraps its three children in `.sticky-atc__inner` carrying the `w`
    class, so the fixed strip's background/border stay true full-width
    while its content aligns to the same boxed column as everything else —
    the same trick the header/hero already use, applied here for the first
    time to a component that explicitly wants a full-width *background*.
  - **A few desktop-only hover states** (≥768px; client: "algún hover...
    que en móvil no hemos ni planteado" — mobile has no hover, so none of
    this was ever considered for it): `.card`/`.post-card` lift + deepen
    shadow, `.ftile` a subtle scale, `.gal-strip` thumbnails and
    `.viewall-card` a border-color cue — each mirrors that element's
    existing `:active` (touch) treatment at a gentler intensity, not a new
    interaction language.
  - **Known limitation, not fixed this round:** neither `initMarquee()` nor
    the section-rhythm/`.trust` sizing re-measure on window resize after
    initial load (the scroll arrows' `update()` does, via a `resize`
    listener — that one was cheap to add since the function already
    existed for the scroll event). A user resizing their browser mid-session
    won't see the marquee re-balance. Given this is a design mockup
    reviewed at a fixed viewport per session, not a production concern
    worth the added complexity — flag if that judgment call turns out
    wrong.

## Hard rules (from the brief, do not regress)

1. **Mobile-first, non-negotiable.** Base styles target 375–414px. Desktop only
   via `min-width` media queries (currently 4, at 768px/1024px/1180px — resist
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
