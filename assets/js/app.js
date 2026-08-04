/* ============================================================
   KRAYMER ART — Mockup interactions (vanilla JS, no build step)
   One file, organized by concern:
     1. Placeholder imagery helper
     2. Product card renderer
     3. Cart (localStorage) + drawer
     4. Wishlist (localStorage)
     5. Search overlay
     6. Modals (size guide, checkout mock)
     7. Accordions
     8. Page initializers (home / plp / pdp)
   ============================================================ */

/* ---------------- 1. Placeholder imagery ---------------- */
/* Editorial SVG illustrations replacing product photography.
   Each product type gets a distinct minimal line drawing:
   ring, necklace, earrings, bracelet, sets.
   In production, swap these for real product images. */
const PH_GOLD = "#C4A882";
const accentColors = { jjk: "#5B7FA5", kny: "#B55848", genshin: "#8A6DAE" };

function imgPath(p, shot) {
  return p.imgDir ? `assets/${p.imgDir}/${shot}` : null;
}
function phImg(p) {
  if (p.images && p.images[0] && p.images[0] !== "placeholder") return p.images[0];
  return "assets/placeholder_" + (p.phId || ((PRODUCTS.indexOf(p) % 4) + 1)) + ".jpg";
}
function phImgList(p) {
  if (p.images && p.images.length > 0 && p.images[0] !== "placeholder") return p.images;
  return [];
}

function phSVG(type, gemColor) {
  const g = gemColor || PH_GOLD;
  const shapes = {
    rings: [
      `<circle cx="200" cy="280" r="72" fill="none" stroke="${PH_GOLD}" stroke-width="1.2"/>`,
      `<path d="M200,208 l-9,-14 h18 z" fill="${g}"/>`,
      `<circle cx="200" cy="192" r="7" fill="${g}"/>`,
      `<line x1="200" y1="212" x2="200" y2="220" stroke="${PH_GOLD}" stroke-width="1"/>`,
    ].join(""),
    necklaces: [
      `<path d="M90,140 Q200,50 310,140" fill="none" stroke="${PH_GOLD}" stroke-width="0.8"/>`,
      `<path d="M250,180 Q255,250 240,320" fill="none" stroke="${PH_GOLD}" stroke-width="0.5"/>`,
      `<circle cx="238" cy="330" r="18" fill="none" stroke="${PH_GOLD}" stroke-width="1.1"/>`,
      `<circle cx="238" cy="330" r="6" fill="${g}"/>`,
    ].join(""),
    earrings: [
      `<circle cx="155" cy="240" r="30" fill="none" stroke="${PH_GOLD}" stroke-width="1"/>`,
      `<circle cx="245" cy="240" r="30" fill="none" stroke="${PH_GOLD}" stroke-width="1"/>`,
      `<circle cx="155" cy="240" r="5" fill="${g}"/>`,
      `<circle cx="245" cy="240" r="5" fill="${g}"/>`,
      `<line x1="155" y1="210" x2="155" y2="182" stroke="${PH_GOLD}" stroke-width="0.7"/>`,
      `<line x1="245" y1="210" x2="245" y2="182" stroke="${PH_GOLD}" stroke-width="0.7"/>`,
      `<path d="M148,182 Q155,175 162,182" fill="none" stroke="${PH_GOLD}" stroke-width="0.7"/>`,
      `<path d="M238,182 Q245,175 252,182" fill="none" stroke="${PH_GOLD}" stroke-width="0.7"/>`,
    ].join(""),
    bracelets: [
      `<path d="M115,270 Q110,175 200,150 Q290,175 285,270" fill="none" stroke="${PH_GOLD}" stroke-width="1.2"/>`,
      `<circle cx="200" cy="145" r="6" fill="${g}"/>`,
      `<line x1="200" y1="145" x2="200" y2="155" stroke="${PH_GOLD}" stroke-width="1"/>`,
    ].join(""),
    sets: [
      `<rect x="75" y="80" width="250" height="340" rx="3" fill="none" stroke="${PH_GOLD}" stroke-width="0.6" stroke-dasharray="3,4"/>`,
      `<circle cx="160" cy="230" r="40" fill="none" stroke="${PH_GOLD}" stroke-width="1"/>`,
      `<circle cx="160" cy="230" r="4.5" fill="${g}"/>`,
      `<path d="M250,200 Q265,230 250,260" fill="none" stroke="${PH_GOLD}" stroke-width="0.8"/>`,
      `<circle cx="250" cy="265" r="8" fill="none" stroke="${PH_GOLD}" stroke-width="1"/>`,
      `<circle cx="250" cy="265" r="2.5" fill="${g}"/>`,
      `<text x="200" y="385" text-anchor="middle" fill="${PH_GOLD}" font-size="9" font-family="Inter,sans-serif" letter-spacing="2.5" opacity=".6">COLLECTOR BOX</text>`,
    ].join(""),
  };
  return shapes[type] || shapes.rings;
}

function ph(label, opts = {}) {
  if (opts.img) {
    return `<div class="ph" role="img" aria-label="${label}" style="background-image:url(${opts.img});background-size:cover;background-position:center">${opts.tag ? `<span class="ph__tag" style="position:absolute;bottom:var(--space-sm);right:var(--space-sm);font-size:.45rem;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);opacity:.5;z-index:1;display:none">${opts.tag}</span>` : ""}</div>`;
  }
  const type = opts.type || "rings";
  const gemColor = opts.gemColor || PH_GOLD;
  const svg = phSVG(type, gemColor);
  const tag = opts.tag ? `<span class="ph__tag">${opts.tag}</span>` : "";
  return `<div class="ph" role="img" aria-label="${label}">
    <svg class="ph__svg" viewBox="0 0 400 500" fill="none">${svg}</svg>
    <span class="ph__label">${label}</span>${tag}</div>`;
}

/* ---------------- 2. Product card renderer ---------------- */

function priceHTML(p) {
  const discount = p.compareAt ? Math.round((1 - p.price / p.compareAt) * 100) : 0;
  if (p.pieces > 1) {
    const per = Math.round(p.price / p.pieces);
    return `<div class="card__price">
      <span>${kaMoney(per)} <span class="per-piece">per piece</span></span>
      ${p.compareAt ? `<s>${kaMoney(Math.round(p.compareAt / p.pieces))}</s><span class="card__discount">-${discount}%</span>` : ""}
      <span class="per-piece">· ${kaMoney(p.price)} set</span>
    </div>`;
  }
  return `<div class="card__price">
    <span>${kaMoney(p.price)}</span>
    ${p.compareAt ? `<s>${kaMoney(p.compareAt)}</s><span class="card__discount">-${discount}%</span>` : ""}
  </div>`;
}

function productCard(p, opts = {}) {
  const col = COLLECTIONS[p.collection];

  /* Card approach: production has settled on "soft" (the former Genshin
     approach) for every collection — see AGENTS.md. "bold"/"clean" are kept
     for the variant1/2/3.html comparison pages only, forced via
     opts.forceApproach; never gate them on a collection again. */
  const approachMap = { jjk: "soft", kny: "soft", genshin: "soft" };
  const resolvedApproach = opts.forceApproach || (opts.activeCollection && approachMap[opts.activeCollection]);
  const approachClass = (opts.approach !== false && resolvedApproach) ? ` card--${resolvedApproach}` : "";

  /* Determine primary state (mutually exclusive) */
  let stateClass = "";
  let stateBadge = "";

  if (p.soldOut) {
    stateClass = "sold";
    stateBadge = '<span class="badge badge--soldout">Sold Out</span>';
  } else if (p.comingSoon) {
    stateClass = "card--coming-soon";
    stateBadge = '<span class="badge badge--coming">Coming Soon</span>';
  } else if (p.lowStock) {
    stateClass = "card--low-stock";
    stateBadge = '<span class="badge badge--lowstock">Only a Few Left</span>';
  } else if (p.isNew) {
    stateBadge = '<span class="badge badge--new">New</span>';
  } else if (p.isFeatured) {
    stateClass = "card--featured";
    stateBadge = '<span class="badge badge--featured">Featured</span>';
  }

  /* Sale is additive — discount badge if not sold out or coming soon */
  const saleBadge = (!p.soldOut && !p.comingSoon && p.compareAt)
    ? `<span class="badge badge--sale">-${Math.round((1 - p.price / p.compareAt) * 100)}%</span>`
    : "";

  /* Catalog tags are additive too — never override the primary state */
  const tagBadge = p.badges.includes("collector-set") ? '<span class="badge badge--ink">Collector Set</span>'
    : (p.badges.includes("bestseller") && !p.soldOut) ? '<span class="badge badge--gold">Bestseller</span>'
    : "";

  /* CTA: notify for sold-out & coming-soon, standard ATC otherwise */
  const cta = (p.soldOut || p.comingSoon)
    ? `<button class="card__buy card__buy--notify" data-notify="${p.handle}" aria-label="Notify me"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg></button>`
    : `<button class="card__buy" data-add="${p.handle}" aria-label="Add to cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg></button>`;

  /* Badge wrap: primary state + optional sale + optional catalog tag */
  const badgesWrap = (stateBadge || saleBadge || tagBadge)
    ? `<div class="card__badges">${stateBadge}${tagBadge}${saleBadge}</div>` : "";

  return `
  <article class="card${approachClass} ${stateClass}" data-handle="${p.handle}" data-images='${JSON.stringify(p.images || [])}'>
    <div class="card__img">
      ${ph(p.title, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, img: phImg(p) })}
      ${badgesWrap}
      <button class="heart" data-wish="${p.handle}" aria-label="Wishlist">
        <svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>
      </button>
      ${cta}
    </div>
    <a class="card__body" href="producto.html?id=${p.handle}">
      <span class="card__series">${col.name}</span>
      <h3 class="card__title">${p.title}</h3>
      ${priceHTML(p)}
    </a>
  </article>`;
}

/* ---------------- 2b. Journal / blog post cards ---------------- */
function postCard(post) {
  return `
  <a class="post-card" id="${post.slug}" href="blog.html#${post.slug}">
    <div class="post-card__img"><img src="${post.image}" alt="${post.title}" loading="lazy"></div>
    <div class="post-card__body">
      <span class="eyebrow">${post.category}</span>
      <h3>${post.title}</h3>
      <p class="sm muted">${post.excerpt}</p>
      <span class="post-card__link">Read more &rarr;</span>
    </div>
  </a>`;
}
function renderPosts(selector, posts) {
  const host = document.querySelector(selector);
  if (host) host.innerHTML = posts.map(postCard).join("");
}

/* ---------------- 3. Cart ---------------- */
const Cart = {
  key: "ka_cart",
  read() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  write(items) {
    localStorage.setItem(this.key, JSON.stringify(items));
    renderCart();
    updateBadges();
  },
  add(handle, metal, size) {
    const p = kaProduct(handle);
    if (!p) return;
    metal = metal || p.metals[0];
    size = size || (p.sizes.length ? p.sizes[Math.floor(p.sizes.length / 2)] : null);
    const items = this.read();
    const found = items.find((i) => i.handle === handle && i.metal === metal && i.size === size);
    if (found) found.qty += 1;
    else items.push({ handle, metal, size, qty: 1 });
    this.write(items);
  },
  setQty(idx, qty) {
    const items = this.read();
    if (!items[idx]) return;
    items[idx].qty = Math.max(0, qty);
    this.write(items.filter((i) => i.qty > 0));
  },
  remove(idx) {
    const items = this.read();
    items.splice(idx, 1);
    this.write(items);
  },
  count() { return this.read().reduce((n, i) => n + i.qty, 0); },
  subtotal() {
    return this.read().reduce((sum, i) => {
      const p = kaProduct(i.handle);
      return sum + (p ? p.price * i.qty : 0);
    }, 0);
  },
};

function renderCart() {
  const body = document.querySelector("[data-cart-body]");
  const foot = document.querySelector("[data-cart-foot]");
  const headCount = document.querySelector("[data-cart-headcount]");
  if (!body) return;
  const items = Cart.read();

  headCount.textContent = items.length ? `(${Cart.count()})` : "";

  if (!items.length) {
    foot.hidden = true;
    /* Only 2 products actually carry the "bestseller" tag and aren't sold
       out — pad with other featured, in-stock pieces so this always shows
       a full 4, not just however many happen to be tagged. */
    const recs = PRODUCTS.filter((p) => p.badges.includes("bestseller") && !p.soldOut);
    if (recs.length < 4) {
      const extra = PRODUCTS.filter((p) => !p.soldOut && !recs.includes(p) && (p.featured || p.isFeatured));
      recs.push(...extra.slice(0, 4 - recs.length));
    }
    recs.length = Math.min(recs.length, 4);
    body.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Start with a piece people keep coming back for.</p>
        <div class="cart-rec">
          ${recs.map((p) => productCard(p, { approach: false })).join("")}
        </div>
      </div>`;
    return;
  }

  foot.hidden = false;
  body.innerHTML = items.map((i, idx) => {
    const p = kaProduct(i.handle);
    const variant = [i.metal, i.size ? `Size ${i.size}` : null].filter(Boolean).join(" · ");
    return `
    <div class="cart-row">
      <a class="cart-row__img" href="producto.html?id=${p.handle}">${ph(p.title, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, img: phImg(p) })}</a>
      <div class="cart-row__info">
        <b>${p.title}</b>
        <span class="var">${variant}</span>
        <div class="cart-row__actions">
          <span class="qty-ctl">
            <button data-qty="${idx}|-1" aria-label="Decrease">−</button>
            <b>${i.qty}</b>
            <button data-qty="${idx}|1" aria-label="Increase">+</button>
          </span>
          <span class="cart-row__price">${kaMoney(p.price * i.qty)}</span>
        </div>
        <button class="cart-row__rm" data-remove="${idx}">Remove</button>
      </div>
    </div>`;
  }).join("");

  document.querySelector("[data-cart-subtotal]").textContent = kaMoney(Cart.subtotal());
}

function updateBadges() {
  const n = Cart.count();
  const el = document.querySelector("[data-cart-count]");
  if (el) { el.textContent = n; el.hidden = n === 0; }
  const w = Wishlist.count();
  const wel = document.querySelector("[data-wishlist-count]");
  if (wel) { wel.textContent = w; wel.hidden = w === 0; }
}

function openCart() {
  renderCart();
  document.querySelector("[data-cart-drawer]").classList.add("on");
  document.querySelector("[data-scrim]").classList.add("on");
  lockScroll();
}
function closeCart() {
  document.querySelector("[data-cart-drawer]").classList.remove("on");
  document.querySelector("[data-scrim]").classList.remove("on");
  unlockScroll();
}

/* ---------------- 4. Wishlist ---------------- */
const Wishlist = {
  key: "ka_wishlist",
  read() {
    try { return JSON.parse(localStorage.getItem(this.key)) || []; }
    catch { return []; }
  },
  toggle(handle) {
    let list = this.read();
    list = list.includes(handle) ? list.filter((h) => h !== handle) : [...list, handle];
    localStorage.setItem(this.key, JSON.stringify(list));
    syncWishUI();
    updateBadges();
  },
  count() { return this.read().length; },
};
/* Wishlisting doubles as a "like" — the heart shows a running count.
   baseLikes() is a stable per-handle number (no data.js field to maintain);
   likeCount() adds 1 on top while *this* visitor has it wishlisted. */
function baseLikes(handle) {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) >>> 0;
  return 12 + (h % 140);
}
function likeCount(handle) {
  return baseLikes(handle) + (Wishlist.read().includes(handle) ? 1 : 0);
}
function syncWishUI() {
  const list = Wishlist.read();
  document.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.classList.toggle("active", list.includes(btn.dataset.wish));
  });
  document.querySelectorAll("[data-wish-count]").forEach((el) => {
    el.textContent = likeCount(el.dataset.wishCount);
  });
}

/* ---------------- 5. Search overlay ---------------- */
function openSearch() {
  document.querySelector("[data-search-overlay]").classList.add("on");
  const input = document.querySelector("[data-search-input]");
  setTimeout(() => input.focus(), 200);
}
function closeSearch() {
  document.querySelector("[data-search-overlay]").classList.remove("on");
  const res = document.querySelector("[data-search-results]");
  if (res) res.innerHTML = '<p class="search__hint">Try "sapphire", "garnet" or "topaz".</p>';
}
function lockScroll() { document.body.style.overflow = "hidden"; }
function unlockScroll() {
  if (!document.querySelector(".drawer.on,.fp.on,.mob-nav.on")) document.body.style.overflow = "";
}
function closeMenu() {
  document.querySelector("[data-mob-nav]").classList.remove("on");
  document.querySelector(".hamburger").classList.remove("on");
  document.querySelector(".mob-scrim").classList.remove("on");
  unlockScroll();
}
function runSearch(q) {
  const host = document.querySelector("[data-search-results]");
  q = q.trim().toLowerCase();
  if (q.length < 2) {
    host.innerHTML = '<p class="search__hint">Try "sapphire", "garnet" or "topaz".</p>';
    return;
  }
  const hits = PRODUCTS.filter((p) =>
    [p.title, p.character, p.gem, COLLECTIONS[p.collection].name, kaTypeName(p.type)]
      .join(" ").toLowerCase().includes(q));
  host.innerHTML = hits.length
    ? hits.map((p) => `<a href="producto.html?id=${p.handle}"><b>${p.title}</b><span>${COLLECTIONS[p.collection].name} · ${kaMoney(p.price)}</span></a>`).join("")
    : '<p class="search__hint">No pieces match that search.</p>';
}

/* ---------------- 6. Modals ---------------- */
function openModal(html, type) {
  closeModal();
  const host = document.createElement("div");
  host.className = "modal";
  host.setAttribute("data-modal", type || "");
  host.innerHTML = `
    <div class="modal__bg" data-close-modal></div>
    <div class="modal__box" role="dialog" aria-modal="true">
      <button class="modal__x" data-close-modal aria-label="Close">&times;</button>
      ${html}
    </div>`;
  document.body.appendChild(host);
  requestAnimationFrame(() => host.classList.add("on"));
}
function closeModal() {
  const m = document.querySelector("[data-modal]");
  if (m) m.remove();
}

/* Promo popup: 10% off first order for an email. Dismissing without
   subscribing leaves a floating gift button (site-wide) that reopens it;
   subscribing retires the button for good, for the rest of THIS page load.
   State lives in the plain in-memory `promoState` variable, not
   localStorage — client wants the popup to greet every fresh visit/reload,
   not just the first time ever, so nothing here should survive a reload. */
let promoState = null; // null -> not yet seen, "dismissed", "subscribed"
const PROMO_HTML = `
  <span class="eyebrow" style="color:var(--accent)">Welcome</span>
  <h3>Get 10% Off Your First Piece</h3>
  <p class="small muted" style="margin-bottom:1.25rem">Join the inner circle for early access to new drops and a discount on your first order.</p>
  <form data-promo-form>
    <input type="email" required placeholder="Your email" aria-label="Email" style="display:block;width:100%;height:52px;padding:0 1rem;margin-bottom:.75rem;border:1px solid var(--line);border-radius:var(--radius-sm);background:transparent;font-size:.875rem;color:var(--dark)">
    <button type="submit" class="btn btn--dark btn--full">Get My 10% Off</button>
  </form>
  <p class="small muted" style="margin-top:.75rem;text-align:center">No spam. Unsubscribe anytime.</p>
`;
function openPromoModal() { openModal(PROMO_HTML, "promo"); }
function showPromoFab() { const fab = document.querySelector("[data-promo-fab]"); if (fab) fab.hidden = false; }
function hidePromoFab() { const fab = document.querySelector("[data-promo-fab]"); if (fab) fab.hidden = true; }

const SIZE_GUIDE_HTML = `
  <h3>Ring Size Guide</h3>
  <p class="small muted">Measure the inside diameter of a ring that already fits you, then match it below.</p>
  <table class="size-table">
    <tr><th>US</th><th>EU</th><th>UK</th><th>Diameter (mm)</th></tr>
    <tr><td>5</td><td>49</td><td>J</td><td>15.7</td></tr>
    <tr><td>6</td><td>52</td><td>L</td><td>16.5</td></tr>
    <tr><td>7</td><td>54</td><td>N</td><td>17.3</td></tr>
    <tr><td>8</td><td>57</td><td>P</td><td>18.1</td></tr>
    <tr><td>9</td><td>59</td><td>R</td><td>18.9</td></tr>
    <tr><td>10</td><td>62</td><td>T</td><td>19.8</td></tr>
    <tr><td>11</td><td>64</td><td>V</td><td>20.6</td></tr>
    <tr><td>12</td><td>67</td><td>X</td><td>21.4</td></tr>
  </table>
  <p class="small" style="margin-top:var(--space-3)"><b style="color:var(--accent)">Free resizing for life.</b> <span class="muted">If it doesn't fit, we fix it. No charge, no time limit.</span></p>
`;

/* MOCKUP ONLY: this modal simulates checkout. There is no real
   payment or Shopify integration anywhere in this project. */
const CHECKOUT_MOCK_HTML = `
  <h3>This is a design mockup</h3>
  <p class="small muted">Checkout is intentionally not wired up. In the real build, this button hands off to the Shopify checkout. What matters here: this is the only CTA in the cart, and it stays dominant.</p>
  <button class="btn btn--dark" data-close-modal style="margin-top:var(--space-4)">Back to the mockup</button>
`;

/* ---------------- 7. Accordions ---------------- */
function initAccordions(scope = document) {
  scope.querySelectorAll(".faq__btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const panel = item.querySelector(".faq__panel");
      const open = item.classList.toggle("on");
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0";
    });
  });
}

/* Product-card titles: force a single line everywhere (see .card__title in
   styles.css); if the full name still doesn't fit, turn it into a seamless
   looping ticker instead of just clipping it — used site-wide (home,
   PLP grid, PDP cross-sell rails, cart), so wired via a MutationObserver
   watching the whole document rather than called from every render site
   individually. Two identical text+separator copies + translateX(-50%) is
   the same seamless-loop technique as the header marquee — a gap between
   copies via flex `gap` would reintroduce that marquee's old stutter bug
   (see AGENTS.md), so the separator is real text content, not layout gap. */
function checkCardTitleMarquee(el) {
  if (el.dataset.marqueeChecked) return;
  el.dataset.marqueeChecked = "1";
  if (el.scrollWidth > el.clientWidth + 1) {
    const text = el.textContent;
    el.classList.add("card__title--marquee");
    el.innerHTML = `<span class="card__title__track">${text}<span class="card__title__sep">&bull;</span>${text}<span class="card__title__sep">&bull;</span></span>`;
  }
}
function initCardTitleMarquee() {
  document.querySelectorAll(".card__title").forEach(checkCardTitleMarquee);
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".card__title:not([data-marquee-checked])").forEach(checkCardTitleMarquee);
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

/* Top announcement ticker (2026-08-08 round 5 fix): the static markup on
   every page is two identical halves of 4 items, sized for a 375-414px
   screen — comfortably wider than any phone, so the translateX(-50%) loop
   is seamless there. On a wide desktop viewport the same content is
   narrower than the screen itself: the track runs out mid-viewport
   (visible blank marquee background) and then hard-cuts back to the start
   instead of flowing continuously — client: "el texto se corta y pega
   cambio." Fixed at runtime rather than in the static HTML/CSS: this keeps
   working at literally any width (a fixed CSS breakpoint would just move
   the same bug to whatever monitor is wider than that breakpoint's
   assumption) without duplicating the announcement markup across every
   page a third time. If the current single half already covers the
   viewport (true on mobile — this is why mobile is unaffected), nothing is
   touched at all. */
function initMarquee() {
  document.querySelectorAll(".marquee__track").forEach((track) => {
    const kids = Array.from(track.children);
    const half = kids.length / 2;
    if (!half || !Number.isInteger(half)) return;
    const firstHalf = kids.slice(0, half);
    const unitWidth = firstHalf[half - 1].getBoundingClientRect().right - firstHalf[0].getBoundingClientRect().left;
    if (!unitWidth || unitWidth <= 0) return;
    const repeats = Math.ceil((window.innerWidth * 1.2) / unitWidth);
    if (repeats <= 1) return;
    const unitHTML = firstHalf.map((el) => el.outerHTML).join("");
    const halfHTML = unitHTML.repeat(repeats);
    track.innerHTML = halfHTML + halfHTML;
    /* Original CSS duration (28s) implies unitWidth/28 px/s. Each half is
       now `repeats` units wide, so duration = repeats * 28s keeps that same
       px/s speed instead of the text suddenly whizzing by faster on a
       wider screen just because there's more of it to cover in the same
       28s. */
    track.style.animationDuration = (28 * repeats) + "s";
  });
}

/* Horizontal scroll rows had no way to be scrolled with a mouse alone on
   desktop (scrollbar-width:none hides the native bar, there's no touch
   gesture without a touchscreen) — client: "no puedo hacerlos, habria que
   poner un drag, unas flechas o algo." Adds prev/next arrow buttons, hidden
   below 768px (see .scrollx-arrow in styles.css). Wired via the same
   MutationObserver-on-body + dataset-flag pattern as
   initCardTitleMarquee() above, for the same reason: these rows get their
   content filled from many different call sites (home bestsellers, PDP's
   3 cross-sell rails, reviews, PLP), not one central place. */
function initScrollArrows() {
  const arrowSvg = (dir) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="${dir === "l" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"}"/></svg>`;
  function attach(host, row) {
    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "scrollx-arrow scrollx-arrow--prev";
    prevBtn.setAttribute("aria-label", "Scroll left");
    prevBtn.innerHTML = arrowSvg("l");
    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "scrollx-arrow scrollx-arrow--next";
    nextBtn.setAttribute("aria-label", "Scroll right");
    nextBtn.innerHTML = arrowSvg("r");
    host.appendChild(prevBtn);
    host.appendChild(nextBtn);
    prevBtn.addEventListener("click", () => row.scrollBy({ left: -row.clientWidth * 0.8, behavior: "smooth" }));
    nextBtn.addEventListener("click", () => row.scrollBy({ left: row.clientWidth * 0.8, behavior: "smooth" }));
    const update = () => {
      const max = row.scrollWidth - row.clientWidth;
      prevBtn.classList.toggle("is-hidden", row.scrollLeft <= 4);
      nextBtn.classList.toggle("is-hidden", max <= 4 || row.scrollLeft >= max - 4);
    };
    row.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    /* Stashed on the row, not just closed over — see below: every row this
       function has already wired needs its arrows re-checked on every later
       mutation too, not just its own scroll/resize events. */
    row._scrollxUpdate = update;
    update();
  }
  /* Rows with no alignment of their own yet — get wrapped in .scrollx-wrap
     (see styles.css), which both hosts the arrows and fixes these rows
     running edge-to-edge past the boxed .w column at desktop widths
     (client, round 5: cards going "hasta los márgenes"). */
  document.querySelectorAll(".scroll-row, .rev-scroll, .post-scroll, .ugc-scroll, .collectible-scroll, .sub-scroll").forEach((row) => {
    if (row.dataset.arrowsInit) {
      /* Already wired — but the row this function first saw may have been
         empty (the mount div exists before its cards get rendered in, e.g.
         home bestsellers/PDP cross-sell are filled by a *later* mutation
         than the one that first revealed the empty <div data-bestsellers>).
         update() computed off a 0-width row hides both arrows correctly for
         that instant, but nothing re-ran it once real cards arrived — caught
         in testing: the next arrow stayed hidden despite real overflow.
         Re-running update() on every mutation this observer sees (cheap:
         a scrollWidth/clientWidth read and two classList.toggle calls)
         keeps it honest regardless of when content actually lands. */
      if (row._scrollxUpdate) row._scrollxUpdate();
      return;
    }
    row.dataset.arrowsInit = "1";
    if (row.classList.contains("sub-scroll")) {
      /* .sub-scroll already has its own .w-matching alignment (see the
         earlier round-3 fix in styles.css) — no extra wrap needed. */
      attach(row, row);
    } else {
      const wrap = document.createElement("div");
      wrap.className = "scrollx-wrap";
      row.parentNode.insertBefore(wrap, row);
      wrap.appendChild(row);
      attach(wrap, row);
    }
  });
}
function initScrollArrowsWatch() {
  initScrollArrows();
  const observer = new MutationObserver(() => initScrollArrows());
  observer.observe(document.body, { childList: true, subtree: true });
}

/* ---------------- 8. Page initializers ---------------- */

/* Shared quick-add + wish + notify + image swipe (PLP only) */
function initCardActions() {
  /* Touch swipe tracking for card images */
  let sx = 0, sy = 0, onCard = null;
  document.addEventListener("touchstart", (e) => { onCard = e.target.closest(".card__img"); if (onCard) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; } }, {passive:true});
  document.addEventListener("touchend", (e) => {
    if (!onCard) return;
    const card = onCard.closest(".card");
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    const wasSwipe = Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy);
    if (wasSwipe && card && card.dataset.images) {
      try {
        const imgs = JSON.parse(card.dataset.images);
        if (imgs.length > 1 && imgs[0] !== "placeholder") {
          const ph = onCard.querySelector(".ph");
          const cur = ph.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);
          let idx = cur ? imgs.indexOf(cur[1]) : 0;
          idx = (idx < 0 ? 0 : idx + (dx > 0 ? -1 : 1) + imgs.length) % imgs.length;
          ph.style.backgroundImage = `url(${imgs[idx]})`;
        }
      } catch {}
    }
    onCard = null;
  }, {passive:true});

  document.addEventListener("click", (e) => {
    /* Tap card image → navigate to PDP */
    const imgArea = e.target.closest(".card__img");
    if (imgArea && !e.target.closest("[data-add]") && !e.target.closest("[data-wish]") && !e.target.closest("[data-notify]")) {
      const card = imgArea.closest(".card");
      if (card) { window.location = "producto.html?id=" + card.dataset.handle; return; }
    }
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      e.preventDefault();
      Cart.add(addBtn.dataset.add);
      addBtn.classList.add("done");
      setTimeout(() => addBtn.classList.remove("done"), 1500);
      return;
    }
    const wishBtn = e.target.closest("[data-wish]");
    if (wishBtn) {
      e.preventDefault();
      Wishlist.toggle(wishBtn.dataset.wish);
      wishBtn.classList.add("heart-pop");
      setTimeout(() => wishBtn.classList.remove("heart-pop"), 350);
      return;
    }
    const notifyBtn = e.target.closest("[data-notify]");
    if (notifyBtn) {
      notifyBtn.textContent = "We'll email you";
      notifyBtn.disabled = true;
      return;
    }
    const qtyBtn = e.target.closest("[data-qty]");
    if (qtyBtn) {
      const [i, d] = qtyBtn.dataset.qty.split("|");
      const items = Cart.read();
      if (items[Number(i)]) Cart.setQty(Number(i), items[Number(i)].qty + Number(d));
      return;
    }
    const rmBtn = e.target.closest("[data-remove]");
    if (rmBtn) { Cart.remove(Number(rmBtn.dataset.remove)); return; }
  });
}

/* ---- HOME (hero slider + hamburger) ---- */
function initHome() {
  /* Bestsellers: a fixed curated set of 8, capped and ordered on purpose
     (not just "every featured product") — mirrors the hardcoded handle-list
     pattern already used by initVariant(). Ends with a "View All" card
     linking to the full collections page. */
  const bestHandles = ["giyu-ring", "gojo-x-geto", "giyu-pin", "shenhe-necklace", "zhongli-necklace", "higuruma-necklace", "collector-club-box", "venti-bracelet"];
  const best = bestHandles.map((h) => kaProduct(h)).filter(Boolean);
  const strip = document.querySelector("[data-bestsellers]");
  if (strip) {
    const viewAllCard = `<a class="viewall-card" href="coleccion.html"><span>View All<br>&rarr;</span></a>`;
    strip.innerHTML = best.map((p) => productCard(p, { approach: false })).join("") + viewAllCard;
    strip.style.cssText += "padding-left:24px!important;padding-right:24px!important;scroll-padding-left:24px!important;scroll-padding-right:24px!important";
    strip.querySelectorAll(".card").forEach((c) => c.removeAttribute("data-images"));

  }

  /* Journal preview: first 3 posts */
  renderPosts("[data-posts-home]", BLOG_POSTS.slice(0, 4));

  /* Promo popup: auto-open once per page load, right after the visitor
     scrolls past the hero slider — not if they've already dismissed or
     subscribed during THIS load (see promoState above). */
  const heroSection = document.querySelector(".hero-slider");
  if (heroSection && !promoState) {
    const promoObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && !promoState) {
        openPromoModal();
        promoObserver.disconnect();
      }
    }, { threshold: 0 });
    promoObserver.observe(heroSection);
  }

  /* Hero slider: auto-rotate every 5s, touch swipe */
  const track = document.querySelector("[data-hs-track]");
  const dots = document.querySelector("[data-hs-dots]");
  if (track && dots) {
    const total = track.children.length;
    let current = 0;
    let auto = setInterval(() => go(current + 1), 5000);
    const go = (i) => {
      current = ((i % total) + total) % total;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.querySelectorAll("button").forEach((d, j) => d.classList.toggle("on", j === current));
    };

    /* Touch swipe */
    let sx = 0, ex = 0;
    track.addEventListener("touchstart", (e) => { sx = e.changedTouches[0].screenX; }, {passive:true});
    track.addEventListener("touchend", (e) => {
      ex = e.changedTouches[0].screenX;
      const dx = sx - ex;
      if (Math.abs(dx) > 60) {
        clearInterval(auto);
        auto = setInterval(() => go(current + 1), 5000);
        go(dx > 0 ? current + 1 : current - 1);
      }
    }, {passive:true});
  }

  initQuizWidget();
}

/* ---- Quiz: Find Your Piece (3 steps, series -> metal -> style) — its own
   page (quiz.html), not inline on home (see AGENTS.md quiz CTA note) ---- */
function initQuizWidget() {
  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    const state = { series: null, metal: null, style: null };
    const steps = [
      { key: "series", q: "Pick your collection", opts: [["jjk", "Jujutsu Kaisen"], ["kny", "Demon Slayer"], ["genshin", "Genshin Impact"]] },
      { key: "metal", q: "Pick your metal", opts: [["silver", "925 Sterling Silver"], ["gold", "18K Gold"]] },
      { key: "style", q: "Pick your style", opts: [["subtle", "Subtle, every day"], ["statement", "Statement piece"]] },
    ];
    let step = 0;
    const renderStep = () => {
      if (step < steps.length) {
        const s = steps[step];
        quiz.innerHTML = `
          <div class="quiz__step">
            <p class="quiz__q">${step + 1} / 3 · ${s.q}</p>
            <div class="quiz__opts">
              ${s.opts.map(([v, label]) => `<button class="quiz__opt" data-quiz-opt="${s.key}|${v}">${label}</button>`).join("")}
            </div>
          </div>`;
        return;
      }
      /* Result: match series + metal preference, style nudges type */
      const wantGold = state.metal === "gold";
      const pool = PRODUCTS.filter((p) => !p.soldOut && p.collection === state.series);
      const byMetal = pool.filter((p) =>
        wantGold ? p.metals.some((m) => m.includes("Gold")) : p.metals.some((m) => m.includes("Silver")));
      const byStyle = byMetal.filter((p) =>
        state.style === "statement" ? (p.type === "sets" || p.type === "necklaces") : (p.type === "rings" || p.type === "earrings"));
      const pick = byStyle[0] || byMetal[0] || pool[0];
      quiz.innerHTML = `
        <div class="quiz__result">
          <p class="eyebrow">Your piece</p>
          <h3 class="card__title">${pick.title}</h3>
          <p class="small" style="margin:var(--space-sm) 0 var(--space-3);opacity:.8">${pick.line}</p>
          <a href="producto.html?id=${pick.handle}">View the piece &rarr;</a>
        </div>`;
    };
    quiz.addEventListener("click", (e) => {
      const opt = e.target.closest("[data-quiz-opt]");
      if (!opt) return;
      const [key, val] = opt.dataset.quizOpt.split("|");
      state[key] = val;
      step += 1;
      renderStep();
    });
    renderStep();
  }
}

/* ---- Variant comparison pages (mockup-only, never production — see AGENTS.md) ---- */
function initVariant(approach) {
  const handles = ["gojo-x-geto","giyu-ring","giyu-pin","anya-x-yor","shenhe-necklace","toji-bracelet","yuji-ring","water-breathing-ring"];
  const list = handles.map(kaProduct).filter(Boolean);
  const grid = document.querySelector("[data-variant-grid]");
  if (grid) grid.innerHTML = `<div class="pgrid">${list.map((p) => productCard(p, { forceApproach: approach })).join("")}</div>`;
}

/* ---- Blog ---- */
function initBlog() {
  renderPosts("[data-posts-all]", BLOG_POSTS);
  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) target.scrollIntoView({ block: "start" });
  }
}

/* ---- PLP ---- */
function initPLP() {
  const params = new URLSearchParams(location.search);
  const colParam = params.get("collection");   // jjk | kny | genshin | null
  const typeParam = params.get("type");        // e.g. sets
  let activeType = typeParam || null;
  let activeSort = "trending";
  const subHost = document.querySelector("[data-subcats]");

  /* Hero: only for a specific fandom collection (jjk/kny/genshin). The base
     "All Collections" view has no hero (removed 2026-07-31) — clarified
     2026-08-01 that this only ever meant the unfiltered view. */
  const hero = document.querySelector("[data-plp-hero]");
  /* Evocative, non-anime-naming lines — same voice as the home hero slider,
     one per collection. Never mention the show by name (see hard rule 2 on
     never naming Berserk/AoT — extended here to keep all three consistent:
     the imagery does the work, not the title). */
  const heroCopy = {
    jjk: { eyebrow: "Collection", line: "Cursed energy, cast in solid silver. Two eyes on one technique, precision that never blinks." },
    kny: { eyebrow: "Collection", line: "Breath held to a single, exact note. Steel that remembers the fight, calm that holds the line." },
    genshin: { eyebrow: "Collection", line: "Elements bent to one will. Light that keeps every color it passed through." },
  }[colParam];
  if (colParam && COLLECTIONS[colParam]) {
    hero.hidden = false;
    hero.classList.add("plp-hero--img");
    hero.querySelector(".eyebrow").textContent = heroCopy.eyebrow;
    hero.querySelector("h1").textContent = COLLECTIONS[colParam].name;
    hero.querySelector("[data-plp-desc]").textContent = heroCopy.line;
    const heroImg = {
      jjk: "assets/jj_hero.png",
      kny: "assets/giyuRing_hero_AI.png",
      genshin: "assets/genshin_hero.png",
    }[colParam];
    hero.style.backgroundImage = `url(${heroImg})`;
  } else {
    hero.hidden = true;
  }

  /* All Collections: show collection promo tiles above the sub-category chips.
     No page hero anymore (removed 2026-07-31) — these tiles anchor to
     subHost instead. */
  if (!colParam) {
    const tiles = document.createElement("div");
    tiles.className = "w";
    tiles.style.padding = ".75rem 0 0";
    tiles.innerHTML = `<div class="scroll-row" style="display:flex;gap:1rem;padding:0 var(--gutter)">
      <a class="ftile" href="coleccion.html?collection=jjk" style="background-image:url(assets/banner4.png);background-size:cover;background-position:center;min-width:min(55vw,320px);min-height:120px;border-radius:var(--radius);flex:none;display:flex;align-items:flex-end;overflow:hidden;text-decoration:none;position:relative"><div style="position:relative;z-index:1;padding:1rem;width:100%"><span class="eyebrow" style="color:#A09892">Jujutsu Kaisen</span><h3 style="color:#fff;font-size:1.15rem;font-weight:300">Precision and presence</h3></div></a>
      <a class="ftile" href="coleccion.html?collection=kny" style="background-image:url(assets/banner2.png);background-size:cover;background-position:center;min-width:min(55vw,320px);min-height:120px;border-radius:var(--radius);flex:none;display:flex;align-items:flex-end;overflow:hidden;text-decoration:none;position:relative"><div style="position:relative;z-index:1;padding:1rem;width:100%"><span class="eyebrow" style="color:#A09892">Demon Slayer</span><h3 style="color:#fff;font-size:1.15rem;font-weight:300">Forged in flame</h3></div></a>
      <a class="ftile" href="coleccion.html?collection=genshin" style="background-image:url(assets/banner3.png);background-size:cover;background-position:center;min-width:min(55vw,320px);min-height:120px;border-radius:var(--radius);flex:none;display:flex;align-items:flex-end;overflow:hidden;text-decoration:none;position:relative"><div style="position:relative;z-index:1;padding:1rem;width:100%"><span class="eyebrow" style="color:#A09892">Genshin Impact</span><h3 style="color:#fff;font-size:1.15rem;font-weight:300">Elemental weight</h3></div></a>
      <a class="ftile" href="#" style="background-image:url(assets/banner1.png);background-size:cover;background-position:center;min-width:min(55vw,320px);min-height:120px;border-radius:var(--radius);flex:none;display:flex;align-items:flex-end;overflow:hidden;text-decoration:none;position:relative"><div style="position:relative;z-index:1;padding:1rem;width:100%"><span class="eyebrow" style="color:#C4A882">Mystery Box</span><h3 style="color:#fff;font-size:1.15rem;font-weight:300">Collector's Club</h3><p style="font-size:.75rem;color:rgba(255,255,255,.65)">Unreleased pieces. Every 4 weeks.</p></div></a>
    </div>`;
    subHost.parentNode.insertBefore(tiles, subHost);
  }

  /* Subcategory tiles with elegant SVG icons */
  const poolForCounts = colParam ? PRODUCTS.filter((p) => p.collection === colParam) : PRODUCTS;
  const catIcons = {
    "": `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`,
    rings: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3"/></svg>`,
    necklaces: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 6c0-2 2-3 6-3s6 1 6 3"/><path d="M6 6c0 4 2 4 6 10"/><path d="M18 6c0 4-2 4-6 10"/></svg>`,
    earrings: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="14" r="4"/><circle cx="16" cy="14" r="4"/><line x1="8" y1="10" x2="8" y2="6"/><line x1="16" y1="10" x2="16" y2="6"/></svg>`,
    bracelets: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M7 16c0-5 2-10 5-10s5 5 5 10"/><path d="M7 16c0 2 2 4 5 4s5-2 5-4"/></svg>`,
    sets: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16v16H4z"/><path d="M9 9h6v6H9z"/><path d="M4 4l5 5"/><path d="M20 4l-5 5"/><path d="M4 20l5-5"/><path d="M20 20l-5-5"/></svg>`,
    pins: `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><line x1="12" y1="9" x2="12" y2="3"/><line x1="12" y1="15" x2="12" y2="21"/></svg>`,
  };
  subHost.innerHTML =
    `<button class="sub ${!activeType ? "active" : ""}" data-type="">${catIcons[""]}<b>All</b><span>${poolForCounts.length} pieces</span></button>` +
    PRODUCT_TYPES.map((t) => {
      const n = poolForCounts.filter((p) => p.type === t.id).length;
      return `<button class="sub ${activeType === t.id ? "active" : ""}" data-type="${t.id}">${catIcons[t.id] || ""}<b>${t.name}</b><span>${n} piece${n === 1 ? "" : "s"}</span></button>`;
    }).join("");
  subHost.style.cssText += "padding-left:24px!important;padding-right:24px!important;scroll-padding-left:24px!important;scroll-padding-right:24px!important";

  /* Sort icons — chips live inside the Filters panel (see filterPanel below),
     not inline on the page. */
  const sortIcons = {
    trending: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right:6px;vertical-align:-3px"><path d="M22 7l-8.5 8.5-5-5L1 18"/><path d="M16 7h6v6"/></svg>`,
    newest: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right:6px;vertical-align:-3px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
    "price-asc": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right:6px;vertical-align:-3px"><path d="M12 19V5"/><path d="M6 11l6-6 6 6"/></svg>`,
    "price-desc": `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right:6px;vertical-align:-3px"><path d="M12 5v14"/><path d="M6 13l6 6 6-6"/></svg>`,
  };
  const sortLabels = { trending: "Trending", newest: "Newest", "price-asc": "Price: Low", "price-desc": "Price: High" };

  const grid = document.querySelector("[data-plp-grid]");
  const countEl = document.querySelector("[data-plp-count]");

  function apply() {
    let list = PRODUCTS.slice();
    if (colParam) list = list.filter((p) => p.collection === colParam || (p.featured && p.collection === "all"));
    else if (filterCol) list = list.filter((p) => p.collection === filterCol || (p.featured && p.collection === "all"));
    if (activeType) list = list.filter((p) => p.type === activeType);
    if (filterMat) list = list.filter((p) => p.metals.some((m) => m.toLowerCase().includes(filterMat)));
    if (filterPrice) {
      const r = { under100: [0, 9999], "100-200": [10000, 19999], "200-300": [20000, 29999], "300+": [30000, 999999] };
      list = list.filter((p) => p.price >= r[filterPrice][0] && p.price <= r[filterPrice][1]);
    }
    if (filterAvail === "in-stock") list = list.filter((p) => !p.soldOut);
    if (filterAvail === "pre-order") list = list.filter((p) => p.metals.length === 0 || p.badges.includes("pre-order"));

    /* Available first, then coming soon, then sold out (always last) */
    const available = list.filter((p) => !p.soldOut && !p.comingSoon);
    const coming = list.filter((p) => p.comingSoon && !p.soldOut);
    const out = list.filter((p) => p.soldOut);

    const sorts = {
      "trending": (a, b) => {
        if (a.hero && b.hero) return a.hero - b.hero;
        if (a.hero) return -1;
        if (b.hero) return 1;
        return ((b.featured ? 3 : 0) + (b.isFeatured ? 1 : 0) + (b.badges.includes("bestseller") ? 1 : 0)) - ((a.featured ? 3 : 0) + (a.isFeatured ? 1 : 0) + (a.badges.includes("bestseller") ? 1 : 0));
      },
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "newest": (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0),
    };
    available.sort(sorts[activeSort] || sorts.trending);
    coming.sort((a, b) => (a.hero || 99) - (b.hero || 99));
    out.sort((a, b) => (a.hero || 99) - (b.hero || 99));

    /* Pull hero products to the very top regardless of state */
    const allSorted = [...available, ...coming, ...out];
    const heroes = allSorted.filter((p) => p.hero).sort((a, b) => a.hero - b.hero);
    const rest = allSorted.filter((p) => !p.hero);
    const finalList = [...heroes, ...rest];
    grid.innerHTML = `<div class="pgrid">${finalList.map((p) => productCard(p, { activeCollection: colParam })).join("")}</div>`;
    countEl.textContent = `Showing ${finalList.length} handcrafted piece${finalList.length === 1 ? "" : "s"}`;
    syncWishUI();
  }

  subHost.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-type]");
    if (!btn) return;
    activeType = btn.dataset.type || null;
    subHost.querySelectorAll(".sub").forEach((s) => s.classList.toggle("active", s === btn));
    apply();
  });

  /* Filter state + panel — collapsed by default, opened from the "Sort &
     Filter" button docked in the sticky utility bar (.ubar) */
  let filterMat = null, filterPrice = null, filterAvail = null, filterCol = null;
  const filterBtn = document.querySelector("[data-open-filters]");
  const filterPanel = document.createElement("div");
  filterPanel.className = "fp";
  const svgIco = (path) => `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5" style="margin-right:5px;vertical-align:-2px">${path}</svg>`;
  const filIcons = {
    jjk: svgIco(`<circle cx="8" cy="12" r="3"/><circle cx="16" cy="12" r="3"/>`),
    kny: svgIco(`<path d="M12 2c2 4 5 6 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4-.3 1.5 0 2.5 1 3 0-3 .5-6 2-10z"/>`),
    genshin: svgIco(`<path d="M12 2l2.5 7H22l-6 4.5L18.5 21 12 16.5 5.5 21 8 13.5 2 9h7.5z"/>`),
    silver: svgIco(`<circle cx="12" cy="12" r="8"/>`),
    gold: svgIco(`<path d="M6 3h12l3 6-9 12L3 9z"/>`),
    "in-stock": svgIco(`<path d="M20 6L9 17l-5-5"/>`),
    "pre-order": svgIco(`<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`),
  };
  filterPanel.innerHTML = `
    <div class="fp__top"><span class="fp__title">Sort &amp; Filter</span><button class="fp__clear" data-clear-filters>Clear all</button></div>
    <div class="fp__body">
      <div class="v-group">
        <p class="v-label">Sort by</p>
        <div class="v-row" data-fil-group="sort">
          ${Object.keys(sortLabels).map((v) => `<button class="v-chip v-chip--sort${activeSort===v?" selected":""}" data-fil-val="${v}">${sortIcons[v]}${sortLabels[v]}</button>`).join("")}
        </div>
      </div>
      ${!colParam ? `
      <div class="v-group">
        <p class="v-label">Collection</p>
        <div class="v-row" data-fil-group="col">
          <button class="v-chip" data-fil-val="jjk">${filIcons.jjk}Jujutsu Kaisen</button>
          <button class="v-chip" data-fil-val="kny">${filIcons.kny}Demon Slayer</button>
          <button class="v-chip" data-fil-val="genshin">${filIcons.genshin}Genshin Impact</button>
        </div>
      </div>` : ""}
      <div class="v-group">
        <p class="v-label">Material</p>
        <div class="v-row" data-fil-group="mat">
          <button class="v-chip" data-fil-val="silver">${filIcons.silver}925 Silver</button>
          <button class="v-chip" data-fil-val="gold">${filIcons.gold}18K Gold</button>
        </div>
      </div>
      <div class="v-group">
        <p class="v-label">Price</p>
        <div class="v-row" data-fil-group="price">
          <button class="v-chip" data-fil-val="under100">Under $100</button>
          <button class="v-chip" data-fil-val="100-200">$100–$200</button>
          <button class="v-chip" data-fil-val="200-300">$200–$300</button>
          <button class="v-chip" data-fil-val="300+">$300+</button>
        </div>
      </div>
      <div class="v-group">
        <p class="v-label">Availability</p>
        <div class="v-row" data-fil-group="avail">
          <button class="v-chip" data-fil-val="in-stock">${filIcons["in-stock"]}In stock</button>
          <button class="v-chip" data-fil-val="pre-order">${filIcons["pre-order"]}Pre-order</button>
        </div>
      </div>
    </div>
    <div class="fp__bot"><button class="btn btn--dark btn--full" data-apply-filters>Apply Filters</button></div>
  `;
  document.body.appendChild(filterPanel);
  filterPanel.insertAdjacentHTML("beforebegin", `<div class="scrim fp-scrim" data-close-fp></div>`);
  const fpScrim = document.querySelector(".fp-scrim");
  const fpCount = document.querySelector("[data-filter-count]");

  function closeFP() { filterPanel.classList.remove("on"); fpScrim.classList.remove("on"); document.body.style.overflow = ""; }
  function updateFilterUI() {
    filterPanel.querySelectorAll(".v-chip").forEach((c) => {
      const grp = c.closest("[data-fil-group]").dataset.filGroup, val = c.dataset.filVal;
      c.classList.toggle("selected",
        (grp==="col"&&filterCol===val)||(grp==="sort"&&activeSort===val)||(grp==="mat"&&filterMat===val)||(grp==="price"&&filterPrice===val)||(grp==="avail"&&filterAvail===val));
    });
    const n = (filterMat?1:0)+(filterPrice?1:0)+(filterAvail?1:0);
    fpCount.textContent = n; fpCount.classList.toggle("show", n > 0);
  }

  filterPanel.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-fil-val]");
    if (chip) {
      const grp = chip.closest("[data-fil-group]").dataset.filGroup, val = chip.dataset.filVal;
      if (grp === "col") filterCol = filterCol === val ? null : val;
      else if (grp === "sort") { activeSort = val; updateFilterUI(); apply(); return; }
      if (grp==="mat") filterMat = filterMat===val?null:val;
      else if (grp==="price") filterPrice = filterPrice===val?null:val;
      else if (grp==="avail") filterAvail = filterAvail===val?null:val;
      updateFilterUI(); return;
    }
    if (e.target.closest("[data-clear-filters]")) { filterMat=filterPrice=filterAvail=filterCol=null; updateFilterUI(); apply(); closeFP(); return; }
    if (e.target.closest("[data-apply-filters]")) { closeFP(); apply(); return; }
  });

  filterBtn.addEventListener("click", () => { filterPanel.classList.add("on"); fpScrim.classList.add("on"); lockScroll(); updateFilterUI(); if (typeof lucide !== "undefined") lucide.createIcons(); });
  fpScrim.addEventListener("click", closeFP);

  /* Load more: visual progress only */
  const loadBtn = document.querySelector("[data-load-more]");
  if (loadBtn) loadBtn.addEventListener("click", () => {
    loadBtn.textContent = "You've seen every piece in this collection";
    loadBtn.disabled = true;
  });

  apply();
}

/* Detail captions for the last two gallery shots — only the 4 products with
   their own full local photoshoot (7 real images each) get these; every
   other product has too few images for "the last two" to mean anything. */
const PDP_IMAGE_NOTES = {
  "anya-x-yor": ["Worn everyday, paired with a plain stud.", "Catching afternoon light, no filter."],
  "giyu-pin": ["Charged under any light source.", "Glows blue for hours after dark."],
  "giyu-ring": ["Shown on a size 7, worn solo.", "Stacked next to the matching pin."],
  "gojo-x-geto": ["Worn stacked, both bands together.", "Shown solo, catching studio light."],
};

/* ---- PDP ---- */
function initPDP() {
  const params = new URLSearchParams(location.search);
  const p = kaProduct(params.get("id")) || PRODUCTS[0];
  const col = COLLECTIONS[p.collection];
  const host = document.querySelector("[data-pdp]");
  document.title = `${p.title} · Kraymer`;
  const approach = params.get("approach") || "1";

  const isRing = p.type === "rings" || (p.type === "sets" && p.sizes.length > 1);
  const imgs = phImgList(p);
  const hasImgs = imgs.length > 1;
  const mainImg = imgs[0] || phImg(p);
  const gemColor = accentColors[p.collection] || PH_GOLD;

  /* Info button + caption overlay on the last two gallery images (see
     PDP_IMAGE_NOTES). One button/panel pair exists per page (only one PDP
     approach renders at a time), shared across the classic/editorial/side
     main-gallery path and the immersive path — both call this after moving. */
  const imgNotes = PDP_IMAGE_NOTES[p.handle];
  const noteForIdx = (i) => {
    if (!imgNotes) return null;
    const start = imgs.length - imgNotes.length;
    return i >= start ? imgNotes[i - start] : null;
  };
  const applyImgNote = (i) => {
    const btn = host.querySelector("[data-gal-info]");
    if (!btn) return;
    const panel = btn.nextElementSibling;
    const note = noteForIdx(i);
    btn.hidden = !note;
    if (panel) {
      panel.hidden = true;
      panel.querySelector("[data-gal-info-text]").textContent = note || "";
    }
  };

  /* --- Helpers --- */
  const thumbStrip = (dataAttr) => hasImgs
    ? `<div class="gal-strip" ${dataAttr}>${imgs.map((url,i) => `<button class="${i===0?'on':''}" data-gal-thumb="${i}" style="background-image:url(${url})"></button>`).join("")}</div>` : "";
  const galInfoHTML = `<button class="gal-info" data-gal-info hidden aria-label="Image details"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><circle cx="12" cy="12" r="9.5"/><line x1="12" y1="15.5" x2="12" y2="11"/><circle cx="12" cy="8" r=".6" fill="currentColor" stroke="none"/></svg></button><div class="gal-info__panel" data-gal-info-panel hidden><p data-gal-info-text></p></div>`;
  /* Prev/next arrows on the main gallery image itself — mobile AND desktop
     (2026-08-08 round 6, client explicit: "tanto en móvil como en
     desktop"). Swipe already worked on mobile via goGal()'s touchstart/
     touchend handlers below, but it isn't discoverable; these call the same
     goGal()/goGalImmersive() functions, just from a visible button instead
     of a gesture. Only rendered when hasImgs (more than one real photo) —
     same guard thumbStrip()/the dot pagination already use, nothing to
     navigate to otherwise. */
  const galArrowsHTML = hasImgs ? `
    <button class="gal-arrow gal-arrow--prev" data-gal-prev aria-label="Previous image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
    <button class="gal-arrow gal-arrow--next" data-gal-next aria-label="Next image"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>` : "";
  const mainGal = (extra) => `<div class="gal" data-gallery-main style="background-image:url(${mainImg});background-size:cover;background-position:center;touch-action:pan-y pinch-zoom;border:1px solid #D5D5D5" ${hasImgs ? `data-gal-imgs='${JSON.stringify(imgs)}'` : ""} ${extra||""}>${galInfoHTML}${galArrowsHTML}</div>`;
  /* 3-column grid, centered icon-over-label — same visual language as
     home's .trust__row, not a vertical list, per 2026-08-06 instruction. */
  const guaranteeHTML = `
    <div class="pdp-guarantee">
      <div class="pdp-guarantee__item"><span class="pdp-guarantee__icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" width="18" height="18"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></span><b>Lifetime Warranty</b><small>Every piece, forever</small></div>
      <div class="pdp-guarantee__item"><span class="pdp-guarantee__icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></span><b>60 Day Returns</b><small>No questions asked</small></div>
      <div class="pdp-guarantee__item"><span class="pdp-guarantee__icon"><svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="1.5" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4"/></svg></span><b>Certificate of Authenticity</b><small>Numbered by hand</small></div>
    </div>`;
  const noteHTML = `<div class="atc-note"><b>Made to Order, by Hand</b>Ships in 9 to 20 days. You'll get photo updates while your piece is being made, then tracked shipping.</div>`;
  const variantsHTML = (size, metal, metalStyle) => {
    let h = "";
    if (p.metals.length) {
      h += `<div class="v-group"><p class="v-label">Metal</p><div class="${metalStyle}" data-metal-opts>${p.metals.map((m,i) => `<button class="${metalStyle === 'metal-cards' ? 'metal-card' : 'v-chip'} ${i===0?'selected':''}" data-metal="${m}"><span>${m}</span></button>`).join("")}</div></div>`;
    }
    if (p.sizes.length) {
      h += `<div class="v-group"><p class="v-label">${isRing?"Ring size":"Size"} ${isRing?`<button data-open-sizeguide>Guide</button>`:""}</p><div class="v-row" data-size-opts>${p.sizes.map((s,i) => `<button class="v-chip ${i===0?'selected':''}" data-size="${s}">${s}</button>`).join("")}</div>${isRing?`<p class="sm muted" style="margin-top:.5rem">Free resizing for life.</p>`:""}</div>`;
    }
    return h;
  };

  /* --- PDP state helpers --- */
  const pdpBadge = () => {
    if (p.soldOut) return `<span class="pdp-state-badge pdp-state--sold">Sold Out</span>`;
    if (p.comingSoon) return `<span class="pdp-state-badge pdp-state--coming">Coming Soon</span>`;
    if (p.lowStock) return `<span class="pdp-state-badge pdp-state--low">Only a Few Left</span>`;
    if (p.isNew) return `<span class="pdp-state-badge pdp-state--new">New</span>`;
    return "";
  };
  const pdpCTA = (extraStyle) => {
    if (p.soldOut) return `<button class="btn btn--dark" disabled style="opacity:.5;cursor:notallowed;${extraStyle||""}">Sold Out</button>`;
    if (p.comingSoon) return `<button class="btn btn--dark" data-notify="${p.handle}" style="${extraStyle||""}"><i data-lucide="bell" style="width:16px;height:16px"></i>Notify Me When Available</button>`;
    return `
      <button class="btn btn--dark" data-pdp-atc style="${extraStyle||""}"><i data-lucide="shopping-bag" style="width:16px;height:16px"></i>Add to Cart · ${kaMoney(p.price)}</button>
      <button class="btn btn--line pdp-buynow" data-pdp-buynow><i data-lucide="zap" style="width:16px;height:16px"></i>Buy Now</button>`;
  };
  const pdpPrice = (extraStyle) => {
    const sale = p.compareAt ? `<span style="text-decoration:line-through;color:var(--muted);font-weight:300;margin-left:.5rem;font-size:.9em">${kaMoney(p.compareAt)}</span><span class="pdp-discount">-${Math.round((1-p.price/p.compareAt)*100)}%</span>` : "";
    return `<div class="pdp-price" ${extraStyle||""}>${kaMoney(p.price)}${sale}</div>`;
  };
  const pdpWish = (extraStyle, extraClass) => `
    <button class="heart pdp-wish ${extraClass||""}" style="position:static;${extraStyle||""}" data-wish="${p.handle}" aria-label="Wishlist">
      <svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>
      <span class="pdp-wish__count" data-wish-count="${p.handle}">${likeCount(p.handle)}</span>
    </button>`;

  const conceptLine = p.line || "Designed as a piece you can wear anywhere, that another fan recognizes across the room.";
  const faqIco = (path) => `<i data-lucide="${path}" style="width:16px;height:16px;margin-right:.6rem;flex:none"></i>`;
  const specsHTML = `
    <div class="pdp-details-head"><span class="eyebrow">Details</span></div>
    <div class="specs faq">
      <div class="faq__item"><button class="faq__btn"><span class="faq__btn-label">${faqIco("gem")}Specs &amp; Materials</span></button><div class="faq__panel"><p>Solid 925 sterling silver${p.metals.some((m)=>m.includes("Gold"))?" or 18K gold plated over sterling silver":""}. Hand-set ${p.gem?p.gem.toLowerCase():"stone"}, brilliant cut. Hypoallergenic and nickel free.</p></div></div>
      <div class="faq__item"><button class="faq__btn"><span class="faq__btn-label">${faqIco("sparkles")}Concept &amp; Inspiration</span></button><div class="faq__panel"><p>${conceptLine}</p></div></div>
      <div class="faq__item"><button class="faq__btn"><span class="faq__btn-label">${faqIco("truck")}Shipping &amp; Returns</span></button><div class="faq__panel"><p>Made to order, ships in 9 to 20 days with photo updates along the way, then tracked worldwide. 60 day returns, no questions asked.</p></div></div>
      <div class="faq__item"><button class="faq__btn"><span class="faq__btn-label">${faqIco("droplet")}Care Instructions</span></button><div class="faq__panel"><p>Wipe with the included polishing cloth after wear. Store in the pouch. Your lifetime warranty covers the rest.</p></div></div>
      <div class="faq__item"><button class="faq__btn"><span class="faq__btn-label">${faqIco("badge-check")}Is this official licensed merchandise?</span></button><div class="faq__panel"><p>No. Every piece is an original design inspired by the worlds we grew up loving, hand-sculpted in our own studio, not a licensed reproduction.</p></div></div>
    </div>`;
  /* "Seen in the wild" — UGC rail. No real customer photos/videos exist yet
     (client instruction 2026-08-04: reserve the space with grey placeholders
     rather than reusing product-shoot photos as fake UGC, or skipping the
     section outright). Names are drawn from the same reviewer pool as
     reviewsHTML/home, not newly invented people. Video cards are a taller
     9:16 placeholder with a static play glyph — never autoplaying, nothing
     to un-mute since there's no real media wired up yet. */
  /* 9 items, not 6 (2026-08-08 round 5): at the new wider desktop rail
     width, 6 cards left visible dead space trailing off the row before the
     new scroll arrows even had anything to scroll to. Chloe M. is the one
     name from the shared reviewer pool not already used here; the rest
     reuse existing names for a second post (a real customer posting both a
     photo and a video separately is a normal UGC pattern, not a new
     fabricated identity). */
  const ugcItems = [
    { name: "Priya N.", video: false }, { name: "Daniel K.", video: true },
    { name: "Sam T.", video: false }, { name: "Maria L.", video: true },
    { name: "Jordan P.", video: false }, { name: "Alex R.", video: false },
    { name: "Chloe M.", video: false }, { name: "Priya N.", video: true },
    { name: "Sam T.", video: true },
  ];
  const ugcHTML = `
    <section class="sec sec--sm" aria-label="Customer photos and videos">
      <div class="ct" style="margin-bottom:1rem"><span class="eyebrow">Seen in the wild</span><h2>Worn by collectors</h2></div>
      <div class="ugc-scroll">
        ${ugcItems.map((u) => `
          <div class="ugc-card${u.video?" ugc-card--video":""}">
            <div class="ugc-card__media">${u.video?`<button class="ugc-card__play" aria-label="Play video from ${u.name}"><svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M8 5v14l11-7z"/></svg></button>`:""}</div>
            <p class="ugc-card__cap">${u.name}</p>
          </div>`).join("")}
      </div>
    </section>`;

  /* "The story behind the piece" — compressed editorial module, moved above
     the UGC rail 2026-08-05 (client liked this section, wanted it earlier
     and simplified to one well-placed image instead of a two-image row).
     Intro reuses the product's own Concept & Inspiration line rather than a
     duplicate paragraph; image reuses the real hero photoshoot frame
     (mainImg) for the 4 products that have one, otherwise the same
     placeholder fallback used everywhere else. The fuller craft narrative
     already lives on about.html#craft — linked via its own prominent CTA
     line, not copy-pasted wholesale, to avoid the exact duplication this
     redesign is meant to remove. */
  const storyHTML = `
    <section class="sec sec--sm sec--warm">
      <div class="ct" style="margin-bottom:1rem"><span class="eyebrow">The story behind the piece</span><h2>${p.title}</h2></div>
      <div class="pdp-narrative">
        <div class="pdp-narrative__img" style="background-image:url(${mainImg})"></div>
        <div class="pdp-narrative__text">
          <p>${conceptLine}</p>
          <p>Every piece starts as a wax sculpture at the bench, not a die-cast mold, then goes out in small numbered batches.</p>
          <a class="pdp-narrative__cta" href="about.html#craft"><i data-lucide="arrow-right" style="width:16px;height:16px"></i>Read the full craft process</a>
        </div>
      </div>
    </section>`;

  /* "The complete collectible experience" — moved above the UGC rail
     2026-08-06. Only 3 cards, each grounded in a real, already-stated claim:
     presentation/pouch, Certificate of Authenticity, and solid-vs-plated
     materials (the same "not costume jewelry" comparison already made on
     about.html) — the one legitimate way to address the "how do we compare
     to other brands" ask without inventing a benchmark or naming a
     competitor. Deliberately still no "digital collectible" or gifting
     card invented — see the 2026-08-04 audit. Images are grey
     placeholders, no packaging photography exists yet. */
  const collectibleHTML = `
    <section class="sec sec--sm">
      <div class="ct" style="margin-bottom:1rem"><span class="eyebrow">What's in the box</span><h2>The complete piece</h2></div>
      <div class="collectible-scroll">
        <div class="collectible-card">
          <div class="collectible-card__img"></div>
          <div class="collectible-card__body"><h3>Presentation</h3><p>Every piece ships with its own polishing cloth and pouch, ready to wear or gift straight out of the box.</p></div>
        </div>
        <div class="collectible-card">
          <div class="collectible-card__img"></div>
          <div class="collectible-card__body"><h3>Certificate of Authenticity</h3><p>Numbered by hand, matched to your piece's batch.</p></div>
        </div>
        <div class="collectible-card">
          <div class="collectible-card__img"></div>
          <div class="collectible-card__body"><h3>Solid, Not Plated</h3><p>925 sterling silver and 18K gold, the same standard as fine jewelry, not the base metal most costume pieces are built on.</p></div>
        </div>
        <div class="collectible-card">
          <div class="collectible-card__img"></div>
          <div class="collectible-card__body"><h3>Free Lifetime Resizing</h3><p>Rings ship true to size, and if it ever needs adjusting, resizing is free for as long as you own the piece.</p></div>
        </div>
        <div class="collectible-card">
          <div class="collectible-card__img"></div>
          <div class="collectible-card__body"><h3>Your Batch, Numbered</h3><p>Every piece is stamped with its batch number by hand, the same one printed on your certificate.</p></div>
        </div>
      </div>
    </section>`;

  /* Reviews: a plain vertical list of 5 (was a 3-card scroll-row + a
     3-more toggle) with a single review behind "Load More", matching the
     PLP's own load-more convention (label swaps, button disables — nothing
     left to reveal after that, since only 6 review quotes exist in this
     mockup). Kept as the very last section on the page per 2026-08-05
     instruction. */
  const reviewsHTML = `
    <section class="sec sec--sm" id="reviews" style="padding-bottom:.75rem">
      <div class="ct" style="margin-bottom:1rem"><span class="eyebrow">Reviews</span><h2>What collectors say</h2></div>
      <div class="ct pdp-rating-summary" style="margin-bottom:1.5rem"><span class="stars">★★★★★</span> ${RATING_DEFAULT}</div>
      <div class="rev-list">
        <div class="rv"><span class="stars">★★★★★</span><h4>Exactly as pictured</h4><p>The detail is incredible. I wear it every day and it still looks new.</p><p class="who"><span class="rv__avatar"></span><span><b>Priya N.</b> · Verified Buyer</span></p></div>
        <div class="rv"><span class="stars">★★★★★</span><h4>Worth every penny</h4><p>Photos do not do it justice. The weight and finish feel substantial.</p><p class="who"><span class="rv__avatar"></span><span><b>Daniel K.</b> · Verified Buyer</span></p></div>
        <div class="rv"><span class="stars">★★★★★</span><h4>Perfect gift</h4><p>Bought this for a friend. They have not taken it off since.</p><p class="who"><span class="rv__avatar"></span><span><b>Sam T.</b> · Verified Buyer</span></p></div>
        <div class="rv"><span class="stars">★★★★★</span><h4>Better than expected</h4><p>Better finish than pieces I've paid three times as much for.</p><p class="who"><span class="rv__avatar"></span><span><b>Maria L.</b> · Verified Buyer</span></p></div>
        <div class="rv"><span class="stars">★★★★★</span><h4>Great unboxing</h4><p>Exactly as pictured, and the box alone felt like a gift.</p><p class="who"><span class="rv__avatar"></span><span><b>Jordan P.</b> · Verified Buyer</span></p></div>
        <div class="rv" data-rev-extra hidden><span class="stars">★★★★★</span><h4>Ordered a second piece</h4><p>Ordered two more the week after my first piece arrived.</p><p class="who"><span class="rv__avatar"></span><span><b>Alex R.</b> · Verified Buyer</span></p></div>
      </div>
      <div class="ct" style="margin-top:1rem"><button class="btn btn--line" data-rev-loadmore><i data-lucide="plus" style="width:16px;height:16px"></i>Load More Reviews</button></div>
    </section>`;
  const crossHTML = `
    <section class="sec sec--sm">
      <div class="ct" style="margin-bottom:1.5rem"><span class="eyebrow">You may also like</span><h2>Complete the look</h2></div>
      <div class="scroll-row" data-crosssell></div>
    </section>`;
  /* Classic-only: related products split into two rails per 2026-08-05
     instruction (same-collection "Complete the Look" vs. broader "You May
     Also Like") — smaller cards (.scroll-row--compact) than the old single
     crossHTML rail. crossHTML itself is untouched and still used as-is by
     the other 3 approaches. */
  const completeLookHTML = `
    <section class="sec sec--sm">
      <div class="ct" style="margin-bottom:1rem"><span class="eyebrow">${col.name}</span><h2>Complete the Look</h2></div>
      <div class="scroll-row scroll-row--compact" data-crosssell-same></div>
    </section>`;
  const alsoLikeHTML = `
    <section class="sec sec--sm">
      <div class="ct" style="margin-bottom:1rem"><span class="eyebrow">Other Collectors' Picks</span><h2>You May Also Like</h2></div>
      <div class="scroll-row scroll-row--compact" data-crosssell-other></div>
    </section>`;

  /* ===== APPROACH ROUTING ===== */
  let html = "";
  let cssClass = "";

  if (approach === "2") {
    /* ── Approach 2: Editorial — story-driven, large visual ── */
    cssClass = "pdp--editorial";
    html = `
      <nav class="bread" aria-label="Breadcrumb"><a href="index.html">Home</a><span></span><a href="coleccion.html">All Collections</a><span></span><b>${p.title}</b></nav>
      <div class="pdp-layout">
        <div>
          ${mainGal('style="border:0;border-radius:var(--radius)"')}
          ${hasImgs ? `<div style="display:flex;justify-content:center;gap:.4rem;padding:.75rem 0">${imgs.map((_,i)=>`<button class="pdp-dot ${i===0?'on':''}" data-gal-thumb="${i}" style="width:8px;height:8px;border-radius:50%;border:0;background:${i===0?'var(--dark)':'var(--line)'};cursor:pointer"></button>`).join("")}</div>` : ""}
        </div>
        <div class="pdp-meta">
          <span class="pdp-tag">${col.name}</span>
          ${pdpBadge()}
          <div class="pdp-headline"><h1 class="pdp-title">${p.title}</h1></div>
          ${pdpPrice('style="margin-bottom:.75rem"')}
          ${pdpWish()}
          <div class="pdp-desc">${p.line||"Designed as a piece you can wear anywhere, that another fan recognizes across the room."}</div>
          <div class="pdp-config">
            ${variantsHTML("chips","metal-cards","metal-cards")}
          </div>
          <div class="atc-bar">
            ${pdpCTA()}
            <div class="pdp-assurance">${noteHTML}${guaranteeHTML}</div>
          </div>
        </div>
      </div>
      ${specsHTML}
      <section class="sec sec--sm" style="text-align:center;padding-top:0">
        <a class="btn btn--link" href="coleccion.html">&larr; Back to collection</a>
      </section>
      ${crossHTML}
      ${reviewsHTML}`;

  } else if (approach === "3") {
    /* ── Approach 3: Side — 2-column, minimal chrome, price inline ── */
    cssClass = "pdp--side";
    html = `
      <nav class="bread" aria-label="Breadcrumb"><a href="index.html">Home</a><span></span><a href="coleccion.html">All Collections</a><span></span><b>${p.title}</b></nav>
      <div class="pdp-layout">
        <div class="pdp-gallery">
          ${mainGal('style="border:0"')}
          ${thumbStrip('style="padding:0;gap:.5rem"')}
        </div>
        <div class="pdp-meta">
          <span class="pdp-tag" style="margin-bottom:.25rem">${col.name}</span>
          ${pdpBadge()}
          <h1 class="pdp-title" style="font-size:1.5rem;margin-bottom:.25rem">${p.title}</h1>
          ${pdpPrice('style="margin-bottom:.75rem"')}
          ${pdpWish()}
          <div class="pdp-desc" style="font-size:1rem">${p.line||"Designed as a piece you can wear anywhere, that another fan recognizes across the room."}</div>
          <div class="pdp-config" style="background:transparent;padding:1rem 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:1.5rem 0">
            ${variantsHTML("chips","v-row","v-row")}
          </div>
          <div class="pdp-cta-row" style="display:flex;gap:.75rem;align-items:center">
            ${pdpCTA("flex:1")}
          </div>
          <div class="pdp-assurance">${noteHTML}${guaranteeHTML}</div>
        </div>
      </div>
      ${specsHTML}
      <section class="sec sec--sm" style="text-align:center;padding-top:0">
        <a class="btn btn--link" href="coleccion.html">&larr; Back to collection</a>
      </section>
      ${crossHTML}`;

  } else if (approach === "4") {
    /* ── Approach 4: Immersive — full-width gallery, floating price, visual ── */
    cssClass = "pdp--immersive";
    const soldOverlay = p.soldOut ? `<div style="position:absolute;inset:0;background:rgba(24,21,20,.4);z-index:3;display:flex;align-items:center;justify-content:center"><span style="background:var(--dark);color:var(--light);padding:.75rem 2rem;border-radius:var(--radius-pill);font-size:.7rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase">Sold Out</span></div>` : "";
    html = `
      <nav class="bread" aria-label="Breadcrumb" style="padding:1rem var(--gutter)"><a href="index.html">Home</a><span></span><a href="coleccion.html">All Collections</a><span></span><b>${p.title}</b></nav>
      <div style="position:relative;width:100%;aspect-ratio:3/4;overflow:hidden;background:#F4EEEB" data-gallery-main style="background-image:url(${mainImg});background-size:cover;background-position:center">
        <div style="position:absolute;inset:0;background-image:url(${mainImg});background-size:cover;background-position:center" data-gallery-main-img></div>
        ${soldOverlay}
        ${galInfoHTML}
        ${galArrowsHTML}
        <div style="position:absolute;bottom:0;left:0;right:0;padding:2rem var(--gutter);background:linear-gradient(to top,rgba(24,21,20,.85) 0%,rgba(24,21,20,.4) 60%,transparent 100%);z-index:1">
          <span style="font-size:.6rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.6)">${col.name}</span>
          <div style="display:flex;align-items:flex-end;justify-content:space-between;gap:1rem">
            <h1 style="font-family:var(--display);font-size:1.75rem;font-weight:300;color:#fff;line-height:1.1">${p.title}</h1>
            <div style="text-align:right;flex:none">
              <div style="font-size:1.5rem;font-weight:700;color:#fff">${kaMoney(p.price)}</div>
              ${p.compareAt?`<div style="font-size:.85rem;color:rgba(255,255,255,.5);text-decoration:line-through">${kaMoney(p.compareAt)}<span style="margin-left:.3rem;font-size:.65rem;border:1px solid rgba(255,255,255,.3);border-radius:var(--radius-pill);padding:1px 6px">-${Math.round((1-p.price/p.compareAt)*100)}%</span></div>`:""}
            </div>
          </div>
        </div>
      </div>
      ${hasImgs ? `<div style="display:flex;overflow-x:auto;gap:0;scrollbar-width:none;border-bottom:1px solid var(--line)">${imgs.map((url,i) => `<button data-gal-thumb="${i}" style="flex:none;width:min(25vw,110px);aspect-ratio:1;background-image:url(${url});background-size:cover;background-position:center;border:none;cursor:pointer;border-right:1px solid var(--line);${i===0?'opacity:1':'opacity:.6'}"></button>`).join("")}</div>` : ""}
      <div class="w" style="max-width:640px;margin:0 auto;padding:2rem var(--gutter)">
        ${pdpBadge()}
        <div style="text-align:center">${pdpWish()}</div>
        <div class="pdp-config" style="background:transparent;padding:0;margin-bottom:1.5rem">
          ${variantsHTML("chips","metal-cards","metal-cards")}
        </div>
        <div class="pdp-desc" style="text-align:center;font-size:1.2rem;margin-bottom:1.5rem">${p.line||"Designed as a piece you can wear anywhere, that another fan recognizes across the room."}</div>
        ${pdpCTA("min-height:58px;font-size:.9rem;border-radius:var(--radius-pill);width:100%")}
        <div class="pdp-assurance">${noteHTML}${guaranteeHTML}</div>
        ${specsHTML}
        <a class="btn btn--link" href="coleccion.html" style="margin-top:1.5rem;text-align:center;display:block">&larr; Back to collection</a>
      </div>
      ${crossHTML}
      ${reviewsHTML}`;

  } else {
    /* ── Approach 1: Classic — traditional layout (default) ── */
    cssClass = "pdp--classic";
    html = `
      <nav class="bread" aria-label="Breadcrumb"><a href="index.html">Home</a><span></span><a href="coleccion.html">All Collections</a><span></span><b>${p.title}</b></nav>
      <div class="pdp-layout">
        <div class="pdp-gallery">
          ${mainGal()}
          ${thumbStrip('data-gal-strip')}
        </div>
        <div class="pdp-meta">
          <span class="pdp-tag">${col.name}</span>
          ${pdpBadge()}
          <div class="pdp-headline"><h1 class="pdp-title">${p.title}</h1></div>
          ${pdpPrice('style="margin-bottom:.75rem"')}
          <div class="pdp-desc">Handcrafted in sterling silver. A piece designed to be worn every day, <i>subtle enough for those who know.</i></div>
          <div class="pdp-rating"><span class="stars pdp-rating__stars">★★★★★</span> ${RATING_DEFAULT} · <a href="#reviews">Read reviews</a></div>
          ${pdpWish()}
          <div class="pdp-config">
            ${variantsHTML("chips","metal-cards","metal-cards")}
          </div>
          <div class="atc-bar">
            ${pdpCTA()}
            <div class="pdp-assurance">${noteHTML}${guaranteeHTML}</div>
          </div>
        </div>
      </div>
      ${specsHTML}
      ${storyHTML}
      ${collectibleHTML}
      ${ugcHTML}
      <section class="sec sec--sm" style="text-align:center">
        <a class="btn btn--line" href="coleccion.html"><i data-lucide="arrow-left" style="width:16px;height:16px"></i>Back to All Collections</a>
      </section>
      ${completeLookHTML}
      ${alsoLikeHTML}
      ${reviewsHTML}`;
  }

  /* ===== RENDER ===== */
  host.innerHTML = html;
  if (cssClass) host.classList.add(cssClass);

  /* Cross-sell. Slice bumped 4->5 (2026-08-08 round 5): client wants these
     rails to fill a full desktop row (5 cards at the new wider
     .scroll-row--compact desktop size fit ~1400px without scrolling) rather
     than leaving a visibly short row. */
  const cross = PRODUCTS.filter((x) => x.handle!==p.handle && !x.soldOut && (x.character===p.character || x.collection===p.collection)).slice(0,5);
  const crossEl = host.querySelector("[data-crosssell]");
  if (crossEl) {
    crossEl.innerHTML = cross.map((cp) => productCard(cp, { approach: false })).join("");
    crossEl.querySelectorAll(".card").forEach((c) => c.removeAttribute("data-images"));
  }
  /* Classic-only split rails */
  const sameEl = host.querySelector("[data-crosssell-same]");
  if (sameEl) {
    const sameCollection = PRODUCTS.filter((x) => x.handle!==p.handle && !x.soldOut && x.collection===p.collection).slice(0,5);
    sameEl.innerHTML = sameCollection.map((cp) => productCard(cp, { approach: false })).join("");
    sameEl.querySelectorAll(".card").forEach((c) => c.removeAttribute("data-images"));
  }
  const otherEl = host.querySelector("[data-crosssell-other]");
  if (otherEl) {
    const otherPicks = PRODUCTS.filter((x) => x.handle!==p.handle && !x.soldOut && x.collection!==p.collection).slice(0,5);
    otherEl.innerHTML = otherPicks.map((cp) => productCard(cp, { approach: false })).join("");
    otherEl.querySelectorAll(".card").forEach((c) => c.removeAttribute("data-images"));
  }

  /* Info button: toggles the caption panel over whichever image is showing */
  applyImgNote(0);
  host.addEventListener("click", (e) => {
    const infoBtn = e.target.closest("[data-gal-info]");
    if (infoBtn) { infoBtn.nextElementSibling.hidden = !infoBtn.nextElementSibling.hidden; }
    const revLoadBtn = e.target.closest("[data-rev-loadmore]");
    if (revLoadBtn) {
      host.querySelectorAll("[data-rev-extra]").forEach((el) => { el.hidden = false; });
      revLoadBtn.textContent = "You've read every review on this piece";
      revLoadBtn.disabled = true;
    }
  });

  /* Gallery: thumbs + swipe on main image */
  const main = host.querySelector("[data-gallery-main]");
  if (main && hasImgs) {
    let galIdx = 0;
    const goGal = (i) => {
      galIdx = ((i % imgs.length) + imgs.length) % imgs.length;
      main.style.backgroundImage = `url(${imgs[galIdx]})`;
      applyImgNote(galIdx);
      host.querySelectorAll("[data-gal-thumb]").forEach((b,j) => {
        b.classList.toggle("on", j===galIdx);
        if (b.style.opacity !== undefined && !b.classList.contains("pdp-dot")) {
          b.style.opacity = j===galIdx ? "1" : ".6";
        }
        if (b.classList.contains("pdp-dot")) {
          b.style.background = j===galIdx ? "var(--accent)" : "var(--line)";
        }
      });
      const strip = host.querySelector("[data-gal-strip]");
      if (strip) { const btn = strip.children[galIdx]; if (btn) btn.scrollIntoView({behavior:"smooth",inline:"center",block:"nearest"}); }
    };
    host.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-gal-thumb]");
      if (btn) { goGal(Number(btn.dataset.galThumb)); return; }
      if (e.target.closest("[data-gal-prev]")) { goGal(galIdx - 1); return; }
      if (e.target.closest("[data-gal-next]")) { goGal(galIdx + 1); return; }
    });
    let gx = 0;
    main.addEventListener("touchstart", (e) => { gx = e.changedTouches[0].screenX; }, {passive:true});
    main.addEventListener("touchend", (e) => {
      const dx = gx - e.changedTouches[0].screenX;
      if (Math.abs(dx) > 40) goGal(galIdx + (dx > 0 ? 1 : -1));
    }, {passive:true});
  }

  /* Immersive approach: separate main image element */
  const mainImgEl = host.querySelector("[data-gallery-main-img]");
  if (mainImgEl && hasImgs) {
    let galIdx = 0;
    const goGalImmersive = (i) => {
      galIdx = ((i % imgs.length) + imgs.length) % imgs.length;
      mainImgEl.style.backgroundImage = `url(${imgs[galIdx]})`;
      applyImgNote(galIdx);
      host.querySelectorAll("[data-gal-thumb]").forEach((b,j) => {
        b.style.opacity = j===galIdx ? "1" : ".6";
      });
    };
    host.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-gal-thumb]");
      if (btn && mainImgEl) { goGalImmersive(Number(btn.dataset.galThumb)); return; }
      if (e.target.closest("[data-gal-prev]")) { goGalImmersive(galIdx - 1); return; }
      if (e.target.closest("[data-gal-next]")) { goGalImmersive(galIdx + 1); return; }
    });
    let gx = 0;
    mainImgEl.addEventListener("touchstart", (e) => { gx = e.changedTouches[0].screenX; }, {passive:true});
    mainImgEl.addEventListener("touchend", (e) => {
      const dx = gx - e.changedTouches[0].screenX;
      if (Math.abs(dx) > 40) goGalImmersive(galIdx + (dx > 0 ? 1 : -1));
    }, {passive:true});
  }

  /* Variants */
  let selectedMetal = p.metals[0];
  let selectedSize = p.sizes[0] || null;
  host.querySelectorAll("[data-metal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMetal = btn.dataset.metal;
      host.querySelectorAll("[data-metal]").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });
  host.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      host.querySelectorAll("[data-size]").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });

  /* Inline ATC */
  const atcBtn = host.querySelector("[data-pdp-atc]");
  if (atcBtn) {
    atcBtn.addEventListener("click", () => {
      Cart.add(p.handle, selectedMetal, selectedSize);
      atcBtn.classList.add("done");
      atcBtn.innerHTML = "Added ✓";
      setTimeout(() => {
        atcBtn.classList.remove("done");
        atcBtn.innerHTML = p.soldOut ? "Sold Out" : `<i data-lucide="shopping-bag" style="width:16px;height:16px"></i>Add to Cart · ${kaMoney(p.price)}`;
        if (typeof lucide !== "undefined") lucide.createIcons();
        openCart();
      }, 600);
    });
  }

  /* Buy Now: adds the item then jumps straight to the (mocked) checkout,
     skipping the cart drawer — no real payment processing in this mockup. */
  const buyNowBtn = host.querySelector("[data-pdp-buynow]");
  if (buyNowBtn) {
    buyNowBtn.addEventListener("click", () => {
      Cart.add(p.handle, selectedMetal, selectedSize);
      openModal(CHECKOUT_MOCK_HTML);
    });
  }

  /* Sticky ATC bar. .sticky-atc__inner carries "w" (2026-08-08 round 5):
     the bar itself stays a true full-width fixed strip (client explicitly
     asked for full width on desktop, reversing the earlier max-width:640px
     cap), but its content lines up with the rest of the page instead of
     stretching thumb-far-left/button-far-right with a canyon between them
     — the same .w-alignment trick already used for the header/hero. */
  if (atcBtn) {
    const bar = document.createElement("div");
    bar.className = "sticky-atc";
    bar.innerHTML = `
      <div class="sticky-atc__inner w">
        <div class="sticky-atc__thumb">${ph(p.title, { type: p.type, gemColor, img: phImg(p) })}</div>
        <div class="sticky-atc__meta"><b>${p.title}</b><span>${kaMoney(p.price)}</span></div>
        <button class="btn btn--dark" ${p.soldOut?"disabled":""}>${p.soldOut?"Sold Out":"Add to Cart"}</button>
      </div>`;
    document.body.appendChild(bar);
    bar.querySelector("button").addEventListener("click", () => {
      Cart.add(p.handle, selectedMetal, selectedSize);
      openCart();
    });
    const io = new IntersectionObserver(([entry]) => {
      bar.classList.toggle("show", !entry.isIntersecting && entry.boundingClientRect.top < 0);
    }, { threshold: 0 });
    io.observe(atcBtn);
  }

  initAccordions(host);
  syncWishUI();
  if (typeof lucide !== "undefined") lucide.createIcons();
}

/* ---------------- Global wiring ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  /* Restore theme */
  if (localStorage.getItem("ka_theme") === "dark") {
    document.documentElement.setAttribute("data-theme","dark");
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => btn.classList.add("on"));
  }
  updateBadges();
  renderCart();
  initCardActions();
  initCardTitleMarquee();
  initAccordions();
  initMarquee();
  initScrollArrowsWatch();

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-menu]")) { document.querySelector("[data-mob-nav]").classList.toggle("on"); document.querySelector(".hamburger").classList.toggle("on"); document.querySelector(".mob-scrim").classList.toggle("on"); if (document.querySelector("[data-mob-nav]").classList.contains("on")) lockScroll(); else unlockScroll(); return; }
    if (e.target.closest("[data-mob-nav] a") || e.target.closest(".mob-link")) { closeMenu(); document.querySelector(".mob-scrim").classList.remove("on"); }
    if (e.target.closest("[data-close-menu]")) { closeMenu(); return; }
    if (e.target.closest("[data-open-search]")) { closeMenu(); openSearch(); return; }
    if (e.target.closest("[data-mob-collapse]")) { const btn = e.target.closest("[data-mob-collapse]"); btn.classList.toggle("open"); const sub = btn.nextElementSibling; if (sub && sub.matches("[data-mob-sub]")) sub.classList.toggle("open"); return; }
    if (e.target.closest("[data-open-cart]")) openCart();
    if (e.target.closest("[data-close-cart]") || e.target.closest("[data-scrim]")) closeCart();
    if (e.target.closest("[data-close-search]")) { closeSearch(); document.querySelector("[data-search-results]").innerHTML = ""; return; }
    if (e.target.closest("[data-close-modal]")) {
      if (document.querySelector('[data-modal="promo"]') && promoState !== "subscribed") {
        promoState = "dismissed";
        showPromoFab();
      }
      closeModal();
      return;
    }
    if (e.target.closest("[data-promo-fab]")) { openPromoModal(); return; }
    if (e.target.closest("[data-checkout]")) openModal(CHECKOUT_MOCK_HTML);
    if (e.target.closest("[data-open-sizeguide]")) { e.preventDefault(); openModal(SIZE_GUIDE_HTML); }
    if (e.target.closest("[data-theme-toggle]")) {
      /* querySelectorAll, not querySelector — there are now two instances
         (mobile nav footer + the desktop header icon added 2026-08-08
         round 5), and a single querySelector left whichever one wasn't
         first in the DOM permanently out of sync with the actual theme. */
      const btns = document.querySelectorAll("[data-theme-toggle]");
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) { document.documentElement.removeAttribute("data-theme"); btns.forEach((b) => b.classList.remove("on")); localStorage.setItem("ka_theme","light"); }
      else { document.documentElement.setAttribute("data-theme","dark"); btns.forEach((b) => b.classList.add("on")); localStorage.setItem("ka_theme","dark"); }
      return;
    }
    if (e.target.closest("[data-open-wishlist]")) {
      const list = Wishlist.read();
      openModal(list.length
        ? `<h3>Wishlist</h3>` + list.map((h) => {
            const p = kaProduct(h);
            return `<a href="producto.html?id=${p.handle}" style="display:flex;justify-content:space-between;padding:var(--space-3) 0;border-bottom:1px solid var(--line)"><b>${p.title}</b><span class="muted">${kaMoney(p.price)}</span></a>`;
          }).join("")
        : `<h3>Wishlist</h3><p class="small muted">Nothing saved yet. Tap the heart on any piece to keep it here.</p>`);
    }
  });

  const searchInput = document.querySelector("[data-search-input]");
  if (searchInput) searchInput.addEventListener("input", (e) => { runSearch(e.target.value); });

  const news = document.querySelector("[data-newsletter]");
  if (news) news.addEventListener("submit", (e) => {
    e.preventDefault();
    news.innerHTML = '<p class="small" style="color:var(--gold-soft)">You\'re on the list. (Mockup only, no email was sent.)</p>';
  });

  /* Promo popup: submit + FAB visibility on load */
  document.addEventListener("submit", (e) => {
    if (!e.target.matches("[data-promo-form]")) return;
    e.preventDefault();
    promoState = "subscribed";
    hidePromoFab();
    e.target.closest(".modal__box").innerHTML = `
      <span class="eyebrow" style="color:var(--accent)">You're in</span>
      <h3>10% Off, Sent</h3>
      <p class="small muted">Check your inbox for the code. (Mockup only, no email was sent.)</p>
      <button class="btn btn--dark btn--full" data-close-modal style="margin-top:1rem">Continue Shopping</button>`;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeCart(); closeSearch(); closeModal(); }
  });

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "plp") initPLP();
  if (page === "pdp") initPDP();
  if (page === "blog") initBlog();
  if (page === "quiz") initQuizWidget();
  if (page === "variant") initVariant(document.body.dataset.approach);
  if (typeof lucide !== "undefined") lucide.createIcons();
});
