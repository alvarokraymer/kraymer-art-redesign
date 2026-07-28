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
  return "assets/placeholder_" + (p.phId || ((PRODUCTS.indexOf(p) % 4) + 1)) + ".jpg";
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
function cardBadges(p) {
  const out = [];
  if (p.soldOut) out.push('<span class="badge badge--out">Sold Out</span>');
  if (p.badges.includes("bestseller") && !p.soldOut) out.push('<span class="badge badge--gold">Bestseller</span>');
  if (p.badges.includes("collector-set")) out.push('<span class="badge badge--ink">Collector Set</span>');
  if (p.compareAt && !p.soldOut) out.push(`<span class="badge badge--save">Save ${kaMoney(p.compareAt - p.price)}</span>`);
  if (p.batch && !p.soldOut) out.push(`<span class="badge">${p.batch}</span>`);
  return out.join("");
}

function priceHTML(p) {
  if (p.pieces > 1) {
    const per = Math.round(p.price / p.pieces);
    return `<div class="p-card__price">
      <span>${kaMoney(per)} <span class="per-piece">per piece</span></span>
      ${p.compareAt ? `<s>${kaMoney(Math.round(p.compareAt / p.pieces))}</s>` : ""}
      <span class="per-piece">· ${kaMoney(p.price)} set</span>
    </div>`;
  }
  return `<div class="p-card__price">
    <span>${kaMoney(p.price)}</span>
    ${p.compareAt ? `<s>${kaMoney(p.compareAt)}</s>` : ""}
  </div>`;
}

function productCard(p) {
  const col = COLLECTIONS[p.collection];
  const gemColor = accentColors[p.collection] || PH_GOLD;
  const dot = `<span class="card__dot" style="background:${gemColor}"></span>`;
  const cta = p.soldOut
    ? `<button class="btn btn--line sm" data-notify="${p.handle}" style="margin-top:var(--m)">Notify Me</button>`
    : ``;
  const badge = p.soldOut
    ? `<span class="badge">Sold Out</span>`
    : (p.badges.includes("bestseller") ? `<span class="badge badge--acc">Bestseller</span>` : ``);
  return `
  <article class="card ${p.soldOut ? "sold" : ""}" data-handle="${p.handle}">
    <a class="card__img" href="producto.html?id=${p.handle}" aria-label="${p.title}" style="position:relative">
      ${ph(p.title, { type: p.type, gemColor, img: "assets/placeholder_" + (p.phId || ((PRODUCTS.indexOf(p) % 4) + 1)) + ".jpg" })}
      ${badge}
    </a>
    <button class="heart" data-wish="${p.handle}" aria-label="Wishlist">
      <svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>
    </button>
    <div class="card__body">
      <span class="card__series">${col.name}</span>
      <h3 class="card__title"><a href="producto.html?id=${p.handle}">${p.title}</a></h3>
      ${priceHTML(p)}
      ${cta}
    </div>
  </article>`;
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
    const recs = PRODUCTS.filter((p) => p.badges.includes("bestseller") && !p.soldOut).slice(0, 2);
    body.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Start with a piece people keep coming back for.</p>
        <div class="cart-rec">
          ${recs.map((p) => `
            <div>
              <a class="card__img" href="producto.html?id=${p.handle}" style="display:block;position:relative;margin-bottom:var(--s)">${ph(p.title, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, img: phImg(p) })}</a>
              <div class="card__body">
                <span class="card__series">${COLLECTIONS[p.collection].name}</span>
                <h3 class="card__title" style="font-size:.9rem"><a href="producto.html?id=${p.handle}">${p.title}</a></h3>
                <div class="card__price"><span>${kaMoney(p.price)}</span></div>
                <button class="btn btn--line sm" data-add="${p.handle}" style="margin-top:var(--s)">Add</button>
              </div>
            </div>`).join("")}
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
  document.body.style.overflow = "hidden";
}
function closeCart() {
  document.querySelector("[data-cart-drawer]").classList.remove("on");
  document.querySelector("[data-scrim]").classList.remove("on");
  document.body.style.overflow = "";
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
function syncWishUI() {
  const list = Wishlist.read();
  document.querySelectorAll("[data-wish]").forEach((btn) => {
    btn.classList.toggle("active", list.includes(btn.dataset.wish));
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
function closeMenu() {
  const menu = document.querySelector("[data-mob-nav]");
  const ham = document.querySelector(".hamburger");
  if (menu) menu.classList.remove("on");
  if (ham) ham.classList.remove("on");
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
function openModal(html) {
  closeModal();
  const host = document.createElement("div");
  host.className = "modal";
  host.setAttribute("data-modal", "");
  host.innerHTML = `
    <div class="modal__scrim" data-close-modal></div>
    <div class="modal__card" role="dialog" aria-modal="true">
      <button class="modal__close" data-close-modal aria-label="Close">&times;</button>
      ${html}
    </div>`;
  document.body.appendChild(host);
  requestAnimationFrame(() => host.classList.add("on"));
}
function closeModal() {
  const m = document.querySelector("[data-modal]");
  if (m) m.remove();
}

const SIZE_GUIDE_HTML = `
  <h3>Ring Size Guide</h3>
  <p class="small muted">Measure the inside diameter of a ring that fits you, then match it below.</p>
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
  <p class="small" style="margin-top:var(--space-3)"><b style="color:var(--gold)">Free lifetime resizing.</b> <span class="muted">If it does not fit, we adjust it. Forever, at no cost.</span></p>
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

/* ---------------- 8. Page initializers ---------------- */

/* Shared quick-add + wish + notify delegation (all pages) */
function initCardActions() {
  document.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (addBtn) {
      Cart.add(addBtn.dataset.add);
      addBtn.classList.add("done");
      addBtn.textContent = "Added ✓";
      setTimeout(() => {
        addBtn.classList.remove("done");
        addBtn.textContent = "Add to Cart";
      }, 1500);
      return;
    }
    const wishBtn = e.target.closest("[data-wish]");
    if (wishBtn) { Wishlist.toggle(wishBtn.dataset.wish); return; }
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
  /* Bestsellers */
  const best = PRODUCTS.filter((p) => p.badges.includes("bestseller") && !p.soldOut);
  const strip = document.querySelector("[data-bestsellers]");
  if (strip) strip.innerHTML = best.map(productCard).join("");

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

  /* Reviews carousel */
  const revTrack = document.querySelector("[data-rev-track]");
  const revDots = document.querySelector("[data-rev-dots]");
  if (revTrack && revDots) {
    const rTotal = revTrack.children.length;
    let rCur = 0;
    const rGo = (i) => { rCur = ((i % rTotal) + rTotal) % rTotal; revTrack.style.transform = `translateX(-${rCur * 100}%)`; revDots.querySelectorAll("button").forEach((d,j) => d.classList.toggle("on", j === rCur)); };
    revDots.addEventListener("click", (e) => { const btn = e.target.closest("button"); if (!btn) return; rGo(Array.from(revDots.children).indexOf(btn)); });
    document.querySelector("[data-rev-prev]").addEventListener("click", () => rGo(rCur - 1));
    document.querySelector("[data-rev-next]").addEventListener("click", () => rGo(rCur + 1));
  }

  /* Quiz: Find Your Domain (3 steps, series -> metal -> style) */
  const quiz = document.querySelector("[data-quiz]");
  if (quiz) {
    const state = { series: null, metal: null, style: null };
    const steps = [
      { key: "series", q: "Pick your collection", opts: [["jjk", "Collection JJ"], ["kny", "Collection KN"], ["genshin", "Collection GI"]] },
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
          <p class="small" style="margin:var(--space-2) 0 var(--space-3);opacity:.8">${pick.line}</p>
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

/* ---- PLP ---- */
function initPLP() {
  const params = new URLSearchParams(location.search);
  const colParam = params.get("collection");   // jjk | kny | genshin | null
  const typeParam = params.get("type");        // e.g. sets
  let activeType = typeParam || null;
  let activeSort = "trending";

  /* Hero copy per collection */
  const hero = document.querySelector("[data-plp-hero]");
  const col = colParam ? COLLECTIONS[colParam] : null;
  const heroTitle = col ? col.name : (typeParam === "sets" ? "Collector Sets" : "All Collections");
  const heroDesc = col
    ? `Fine jewelry inspired by ${col.name}. Handcrafted in small batches, never mass produced merch.`
    : "Fine anime jewelry, handcrafted in small batches. Every piece is made to order in solid 925 sterling silver and 18K gold.";
  hero.querySelector("h1").textContent = heroTitle;
  hero.querySelector("[data-plp-desc]").textContent = heroDesc;

  /* Mark active nav item */
  document.querySelectorAll(".nav-strip a").forEach((a) => {
    const nav = a.dataset.nav;
    if ((colParam && nav === colParam) || (!colParam && typeParam === "sets" && nav === "sets") || (!colParam && !typeParam && nav === "all")) {
      a.classList.add("active");
    }
  });

  /* Subcategory tiles (the missing intermediate step) */
  const subHost = document.querySelector("[data-subcats]");
  const poolForCounts = colParam ? PRODUCTS.filter((p) => p.collection === colParam) : PRODUCTS;
  subHost.innerHTML =
    `<button class="subcat ${!activeType ? "active" : ""}" data-type=""><b>All</b><span>${poolForCounts.length} pieces</span></button>` +
    PRODUCT_TYPES.map((t) => {
      const n = poolForCounts.filter((p) => p.type === t.id).length;
      return `<button class="subcat ${activeType === t.id ? "active" : ""}" data-type="${t.id}"><b>${t.name}</b><span>${n} piece${n === 1 ? "" : "s"}</span></button>`;
    }).join("");

  const grid = document.querySelector("[data-plp-grid]");
  const countEl = document.querySelector("[data-plp-count]");

  function apply() {
    let list = PRODUCTS.slice();
    if (colParam) list = list.filter((p) => p.collection === colParam);
    if (activeType) list = list.filter((p) => p.type === activeType);

    /* In-stock first, sold out always sinks to the end, dimmed */
    const inStock = list.filter((p) => !p.soldOut);
    const out = list.filter((p) => p.soldOut);

    const sorts = {
      "trending": (a, b) => (b.badges.includes("bestseller") - a.badges.includes("bestseller")),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      "newest": (a, b) => b.batch.localeCompare(a.batch),
    };
    inStock.sort(sorts[activeSort] || sorts.trending);

    const finalList = [...inStock, ...out];
    grid.innerHTML = `<div class="pgrid">${finalList.map(productCard).join("")}</div>`;
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

  document.querySelectorAll("[data-sort]").forEach((chip) => {
    chip.addEventListener("click", () => {
      activeSort = chip.dataset.sort;
      document.querySelectorAll("[data-sort]").forEach((c) => c.classList.toggle("active", c === chip));
      apply();
    });
  });

  /* Filter button: mockup-level sheet (visual interaction only) */
  const filterBtn = document.querySelector("[data-open-filters]");
  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      openModal(`
        <h3>Filters</h3>
        <p class="small muted" style="margin-bottom:var(--space-3)">Visual only in this mockup. In the Horizon build these become real storefront filters.</p>
        <p class="eyebrow eyebrow--ink" style="margin-bottom:var(--space-2)">Character</p>
        <div class="quiz__opts" style="margin-bottom:var(--space-4)">
          ${["Gojo Satoru", "Sukuna", "Tanjiro", "Nezuko", "Raiden", "Zhongli"].map((c) => `<button class="quiz__opt" style="border-color:var(--line);color:var(--ink)">${c}</button>`).join("")}
        </div>
        <p class="eyebrow eyebrow--ink" style="margin-bottom:var(--space-2)">Gemstone</p>
        <div class="quiz__opts" style="margin-bottom:var(--space-4)">
          ${["Sapphire", "Garnet", "Amethyst", "Onyx", "Topaz"].map((c) => `<button class="quiz__opt" style="border-color:var(--line);color:var(--ink)">${c}</button>`).join("")}
        </div>
        <p class="eyebrow eyebrow--ink" style="margin-bottom:var(--space-2)">Availability</p>
        <div class="quiz__opts">
          <button class="quiz__opt" style="border-color:var(--line);color:var(--ink)">In stock</button>
          <button class="quiz__opt" style="border-color:var(--line);color:var(--ink)">Collector sets only</button>
        </div>
        <button class="btn btn--dark" data-close-modal style="margin-top:var(--space-5)">Done</button>
      `);
    });
  }

  /* Load more: visual progress only */
  const loadBtn = document.querySelector("[data-load-more]");
  if (loadBtn) loadBtn.addEventListener("click", () => {
    loadBtn.textContent = "That is every piece in this mockup";
    loadBtn.disabled = true;
  });

  apply();
}

/* ---- PDP ---- */
function initPDP() {
  const params = new URLSearchParams(location.search);
  const p = kaProduct(params.get("id")) || PRODUCTS[0];
  const col = COLLECTIONS[p.collection];
  const host = document.querySelector("[data-pdp]");

  const isRing = p.type === "rings" || (p.type === "sets" && p.sizes.length > 1);
  const hasCompare = !!p.compareAt;

  const galleryShots = [
    { label: `${p.title} · Studio`, tag: "Studio", file: "Front View.jpg" },
    { label: "Stone setting, macro", tag: "Detail", file: "Hero 3_4 Angle.jpg" },
    { label: "Worn on hand", tag: "On hand", file: "Scale Shot.jpg" },
    { label: "Collector box & certificate", tag: "Packaging", file: "Detail_Function Shot.jpg" },
  ];

  host.innerHTML = `
    <nav class="bread" aria-label="Breadcrumb">
      <a href="index.html">Home</a><span></span><a href="coleccion.html?collection=${p.collection}">${col.name}</a><span></span><b>${p.title}</b>
    </nav>
    <div class="pdp-layout">
      <div class="pdp-gallery">
        <div class="gal" data-gallery-main>${ph(galleryShots[0].label, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, tag: p.batch, img: phImg(p) })}</div>
        <div class="gal--thumbs">
          ${galleryShots.map((s, i) => `
            <button data-thumb="${i}" class="${i === 0 ? "active" : ""}" aria-label="View: ${s.tag}">${ph(s.label, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, img: phImg(p) })}</button>`).join("")}
        </div>
      </div>
      <div class="pdp-meta">
        <span class="eyebrow">${col.name}</span>
        <h1 class="pdp-title">${p.title}</h1>
        <p class="pdp-rating"><span class="stars">★★★★★</span> ${RATING_PLACEHOLDER} · <a href="#reviews">Read reviews</a></p>
        <p class="pdp-line">${p.line}</p>

        <div class="pdp-price">
          <span class="price">${kaMoney(p.price)}</span>
          ${hasCompare ? `<s>${kaMoney(p.compareAt)}</s><span class="badge badge--save">Save ${kaMoney(p.compareAt - p.price)}</span>` : ""}
          ${p.pieces > 1 ? `<span class="small muted">· ${kaMoney(Math.round(p.price / p.pieces))} per piece</span>` : ""}
        </div>

        <div class="v-group">
          <p class="v-label">Metal</p>
          <div class="v-row" data-metal-opts>
            ${p.metals.map((m, i) => `<button class="v-chip ${i === 0 ? "selected" : ""}" data-metal="${m}">${m}</button>`).join("")}
          </div>
        </div>

        ${p.sizes.length ? `
        <div class="v-group">
          <p class="v-label">${isRing ? "Ring size" : "Size"}
            ${isRing ? `<button data-open-sizeguide>Size Guide</button>` : ""}
          </p>
          <div class="v-row" data-size-opts>
            ${p.sizes.map((s, i) => `<button class="v-chip variant-opt--size ${i === 0 ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}
          </div>
          ${isRing ? `<p class="size-reassure">Between sizes? <b>Free lifetime resizing</b> on every ring.</p>` : ""}
        </div>` : ""}

        <div class="atc-bar">
          <button class="btn btn--dark" data-pdp-atc ${p.soldOut ? "disabled" : ""}>
            ${p.soldOut ? "Sold Out" : `Add to Cart · ${kaMoney(p.price)}`}
          </button>
          <div class="atc-note">
            <b>Handcrafted to order</b>
            Ships in 9–20 days. You get photo updates while your piece is being made, then tracked shipping.
          </div>
          <div class="trust-row-s">
            <div class="trust-item"><svg viewBox="0 0 24 24"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z"/></svg><b>Lifetime Warranty</b></div>
            <div class="trust-item"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg><b>60-Day Returns</b></div>
            <div class="trust-item"><svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6"/></svg><b>Certificate Included</b></div>
          </div>
        </div>

        <div class="specs faq">
          <div class="acc__item">
            <button class="acc__btn">Specs &amp; Materials</button>
            <div class="acc__panel"><p>Solid 925 sterling silver${p.metals.some((m) => m.includes("Gold")) ? " or 18K gold plated over sterling silver" : ""}. Hand-set ${p.gem.toLowerCase()}, brilliant cut. Interior engraving available. Hypoallergenic and nickel free, always.</p></div>
          </div>
          <div class="acc__item">
            <button class="acc__btn">Concept &amp; Inspiration</button>
            <div class="acc__panel"><p>${p.line} Designed as a piece you can wear to dinner without explaining yourself, and that another fan recognizes across the room.</p></div>
          </div>
          <div class="acc__item">
            <button class="acc__btn">Care Instructions</button>
            <div class="acc__panel"><p>Wipe with the included polishing cloth after wear. Keep it in the pouch when you take it off. Silver ages; a quick polish brings it back. Your lifetime warranty covers the rest.</p></div>
          </div>
        </div>

        <a class="btn btn--link" href="coleccion.html?collection=${p.collection}">&larr; Back to ${col.name}</a>
      </div>
    </div>

    <section class="section" id="reviews">
      <div class="section-head">
        <span class="eyebrow">Reviews</span>
        <h2 class="h2">What collectors say</h2>
        <span class="placeholder-note">Reviews placeholder · Real reviews only in production</span>
      </div>
      <div class="review-card">
        <span class="stars">★★★★★</span>
        <h4>Sample review title</h4>
        <p>Sample review text. This space is reserved for verified customer reviews with photos of the piece worn in the real world.</p>
        <p class="who"><b>Verified Buyer</b> · [REVIEW PLACEHOLDER]</p>
      </div>
      <div class="review-card">
        <span class="stars">★★★★★</span>
        <h4>Sample review title</h4>
        <p>Sample review text. No ratings or review counts in this mockup are real; they are layout placeholders waiting for the review app.</p>
        <p class="who"><b>Verified Buyer</b> · [REVIEW PLACEHOLDER]</p>
      </div>
    </section>

    <section class="section section--tight">
      <div class="section-head">
        <span class="eyebrow">More from ${p.character}</span>
        <h2 class="h2">Complete the set</h2>
      </div>
      <div class="card-scroll" data-crosssell></div>
    </section>
  `;

  /* Cross-sell: same character first, then same collection */
  const cross = PRODUCTS.filter((x) => x.handle !== p.handle && !x.soldOut && (x.character === p.character || x.collection === p.collection)).slice(0, 4);
  host.querySelector("[data-crosssell]").innerHTML = cross.map(productCard).join("");

  /* Gallery thumbs */
  const main = host.querySelector("[data-gallery-main]");
  let activeShot = 0;
  host.querySelectorAll("[data-thumb]").forEach((btn) => {
    btn.addEventListener("click", () => {
      activeShot = Number(btn.dataset.thumb);
      main.innerHTML = ph(galleryShots[activeShot].label, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, tag: p.batch, img: phImg(p) });
      host.querySelectorAll("[data-thumb]").forEach((b) => b.classList.toggle("active", b === btn));
    });
  });

  let selectedMetal = p.metals[0];
  let selectedSize = p.sizes[0] || null;
  host.querySelectorAll("[data-metal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedMetal = btn.dataset.metal;
      host.querySelectorAll("[data-metal]").forEach((b) => b.classList.toggle("selected", b === btn));
      main.innerHTML = ph(galleryShots[activeShot].label, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, tag: p.batch, img: phImg(p) });
    });
  });
  host.querySelectorAll("[data-size]").forEach((btn) => {
    btn.addEventListener("click", () => {
      selectedSize = btn.dataset.size;
      host.querySelectorAll("[data-size]").forEach((b) => b.classList.toggle("selected", b === btn));
    });
  });

  /* Size guide modal is handled by the global delegated handler */

  /* Inline ATC */
  const atcBtn = host.querySelector("[data-pdp-atc]");
  atcBtn.addEventListener("click", () => {
    Cart.add(p.handle, selectedMetal, selectedSize);
    atcBtn.classList.add("done");
    atcBtn.textContent = "Added ✓";
    setTimeout(() => {
      atcBtn.classList.remove("done");
      atcBtn.textContent = `Add to Cart · ${kaMoney(p.price)}`;
      openCart();
    }, 600);
  });

  /* Sticky ATC bar: only after the inline button leaves the viewport */
  const bar = document.createElement("div");
  bar.className = "sticky-atc";
  bar.innerHTML = `
    <div class="sticky-atc__thumb">${ph(p.title, { type: p.type, gemColor: accentColors[p.collection] || PH_GOLD, img: phImg(p) })}</div>
    <div class="sticky-atc__meta"><b>${p.title}</b><span>${kaMoney(p.price)}</span></div>
    <button class="btn btn--dark" ${p.soldOut ? "disabled" : ""}>${p.soldOut ? "Sold Out" : "Add to Cart"}</button>`;
  document.body.appendChild(bar);
  bar.querySelector("button").addEventListener("click", () => {
    Cart.add(p.handle, selectedMetal, selectedSize);
    openCart();
  });
  const io = new IntersectionObserver(([entry]) => {
    bar.classList.toggle("show", !entry.isIntersecting && entry.boundingClientRect.top < 0);
  }, { threshold: 0 });
  io.observe(atcBtn);

  initAccordions(host);
  syncWishUI();
}

/* ---------------- Global wiring ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  /* Restore theme */
  if (localStorage.getItem("ka_theme") === "dark") {
    document.documentElement.setAttribute("data-theme","dark");
    const btn = document.querySelector("[data-theme-toggle]");
    if (btn) btn.classList.add("on");
  }
  updateBadges();
  renderCart();
  initCardActions();
  initAccordions();

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-menu]")) { document.querySelector("[data-mob-nav]").classList.toggle("on"); document.querySelector(".hamburger").classList.toggle("on"); return; }
    if (e.target.closest("[data-mob-nav] a") || e.target.closest(".mob-link")) { closeMenu(); }
    if (e.target.closest("[data-open-search]")) { closeMenu(); openSearch(); return; }
    if (e.target.closest("[data-mob-collapse]")) { const btn = e.target.closest("[data-mob-collapse]"); btn.classList.toggle("open"); const sub = btn.nextElementSibling; if (sub && sub.matches("[data-mob-sub]")) sub.classList.toggle("open"); return; }
    if (e.target.closest("[data-open-cart]")) openCart();
    if (e.target.closest("[data-close-cart]") || e.target.closest("[data-scrim]")) closeCart();
    if (e.target.closest("[data-close-search]")) { closeSearch(); document.querySelector("[data-search-results]").innerHTML = ""; return; }
    if (e.target.closest("[data-close-modal]")) closeModal();
    if (e.target.closest("[data-checkout]")) openModal(CHECKOUT_MOCK_HTML);
    if (e.target.closest("[data-open-sizeguide]")) { e.preventDefault(); openModal(SIZE_GUIDE_HTML); }
    if (e.target.closest("[data-theme-toggle]")) {
      const btn = document.querySelector("[data-theme-toggle]");
      const isDark = document.documentElement.getAttribute("data-theme") === "dark";
      if (isDark) { document.documentElement.removeAttribute("data-theme"); btn.classList.remove("on"); localStorage.setItem("ka_theme","light"); }
      else { document.documentElement.setAttribute("data-theme","dark"); btn.classList.add("on"); localStorage.setItem("ka_theme","dark"); }
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
    news.innerHTML = '<p class="small" style="color:var(--gold-soft)">You are on the list. (Mockup only, no email was sent.)</p>';
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { closeCart(); closeSearch(); closeModal(); }
  });

  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "plp") initPLP();
  if (page === "pdp") initPDP();
});
