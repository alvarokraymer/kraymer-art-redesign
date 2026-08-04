/* ============================================================
   KRAYMER ART — Shared partials v7
   Announce bar (not sticky) before header.
   ============================================================ */

const ICONS = {
  search: '<i data-lucide="search" style="width:20px;height:20px"></i>',
  account: '<i data-lucide="user" style="width:20px;height:20px"></i>',
  heart: '<i data-lucide="heart" style="width:20px;height:20px"></i>',
  bag: '<i data-lucide="shopping-bag" style="width:20px;height:20px"></i>',
};

const ANNOUNCE_HTML = `
<div class="marquee"><div class="marquee__track">
  <span>10,000+ collectors</span><span>&middot;</span>
  <span>Free delivery over $150</span><span>&middot;</span>
  <span>Lifetime warranty</span><span>&middot;</span>
  <span>Made to order, by hand</span><span>&middot;</span>
  <span>10,000+ collectors</span><span>&middot;</span>
  <span>Free delivery over $150</span><span>&middot;</span>
  <span>Lifetime warranty</span><span>&middot;</span>
  <span>Made to order, by hand</span><span>&middot;</span>
</div></div>`;

const HEADER_HTML = `
<header class="site-header">
  <div class="hdr-bar">
    <button class="hamburger" data-open-menu aria-label="Menu"><span></span><span></span><span></span></button>
    <a class="hdr-logo" href="index.html"><img src="assets/SVG/kraymer-logo.svg" alt="Kraymer" height="14"></a>
    <nav class="dsk-nav" data-dsk-nav aria-label="Main">
      <div class="dsk-drop">
        <a href="coleccion.html">All Collections</a>
        <div class="dsk-drop__panel">
          <a href="coleccion.html?collection=jjk">Jujutsu Kaisen</a>
          <a href="coleccion.html?collection=kny">Demon Slayer</a>
          <a href="coleccion.html?collection=genshin">Genshin Impact</a>
          <a href="coleccion.html?type=sets">Collector Sets</a>
        </div>
      </div>
      <a href="about.html">Our Story</a>
      <a href="blog.html">Journal</a>
      <a href="quiz.html" class="dsk-nav__cta">Take the Quiz</a>
    </nav>
    <div class="hdr-actions">
      <button class="ico dsk-only" data-open-search aria-label="Search">${ICONS.search}</button>
      <button class="ico dsk-only" data-open-wishlist aria-label="Wishlist">${ICONS.heart}</button>
      <button class="ico dsk-only theme-btn" data-theme-toggle aria-label="Toggle dark mode">
        <svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
      <a class="ico" href="#" aria-label="Account" title="Not in mockup">${ICONS.account}</a>
      <button class="ico" data-open-cart aria-label="Cart">${ICONS.bag}<span class="n" data-cart-count hidden>0</span></button>
    </div>
  </div>
</header>
<nav class="mob-nav" data-mob-nav>
  <button class="mob-search-row" data-open-search style="margin-top:1.5rem">
    <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:var(--dark);fill:none;stroke-width:1.5;flex:none"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    Search
  </button>
  <div class="mob-links">
    <a class="mob-link" href="coleccion.html">All Collections</a>
    <button class="mob-label-btn" data-mob-collapse>COLLECTIONS <span class="mob-arrow"></span></button>
    <div class="mob-sub" data-mob-sub>
      <a class="mob-link mob-link--sub" href="coleccion.html?collection=jjk">Jujutsu Kaisen</a>
      <a class="mob-link mob-link--sub" href="coleccion.html?collection=kny">Demon Slayer</a>
      <a class="mob-link mob-link--sub" href="coleccion.html?collection=genshin">Genshin Impact</a>
      <a class="mob-link mob-link--sub" href="coleccion.html?type=sets">Collector Sets</a>
    </div>
    <a class="mob-link" href="#">Mystery Box</a>
    <button class="mob-label-btn open" data-mob-collapse>BRAND <span class="mob-arrow"></span></button>
    <div class="mob-sub open" data-mob-sub>
      <a class="mob-link mob-link--sub" href="about.html">Our Story</a>
      <a class="mob-link mob-link--sub" href="blog.html">Journal</a>
      <a class="mob-link mob-link--sub" href="quiz.html">Find Your Piece</a>
      <a class="mob-link mob-link--sub" href="index.html#reviews">Reviews</a>
      <a class="mob-link mob-link--sub" href="index.html#faq">FAQ</a>
    </div>
  </div>
  <div class="mob-foot">
    <div class="mob-foot-actions">
      <button class="mob-action-btn" data-open-wishlist>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" width="18" height="18"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>
        Wishlist
      </button>
      <button class="mob-action-btn theme-btn" data-theme-toggle>
        <svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <span class="theme-label">Dark Mode</span>
      </button>
    </div>
    <div class="mob-foot-icons">
      <a href="https://instagram.com/kraymer.art" target="_blank" rel="noopener" aria-label="Instagram" class="mob-soc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></a>
      <a href="https://youtube.com/@KraymerArt" target="_blank" rel="noopener" aria-label="YouTube" class="mob-soc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l6 3-6 3z" fill="currentColor" stroke="none"/></svg></a>
      <a href="https://tiktok.com/@kraymer.art" target="_blank" rel="noopener" aria-label="TikTok" class="mob-soc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 3c.5 2.5 2 4 4.5 4.3"/></svg></a>
    </div>
  </div>
</nav>
<!-- Search overlay (lightbox) -->
<div class="search" data-search-overlay>
  <div class="search__bar">
    <input type="search" placeholder="What are you hunting for?" data-search-input aria-label="Search">
    <button data-close-search style="font-size:1.5rem;color:var(--muted);padding:0 1rem">&times;</button>
  </div>
  <div class="search__body" data-search-results>
    <p class="search__hint">Try a stone, a character, or a series. Sapphire. Gojo. Genshin Impact.</p>
  </div>
</div>
`;

const FOOTER_HTML = `
<footer class="ft">
  <div class="w">
    <div class="ft-founder">
      <div class="ft-founder__row">
        <img class="ft-founder__avatar" src="assets/kraymerProfile.jpg" alt="Kraymer" style="object-fit:cover">
        <div class="ft-founder__text">
          <div><div class="ft-founder__name">Kraymer</div><div class="ft-founder__role">Founder</div></div>
        </div>
        <div class="ft-social">
          <a href="https://instagram.com/kraymer.art" target="_blank" rel="noopener" aria-label="Instagram, 50k followers"><span class="ft-soc__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg></span><span class="ft-soc__count">50k</span></a>
          <a href="https://youtube.com/@KraymerArt" target="_blank" rel="noopener" aria-label="YouTube, 85k subscribers"><span class="ft-soc__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="M10 9l6 3-6 3z" fill="currentColor" stroke="none"/></svg></span><span class="ft-soc__count">85k</span></a>
          <a href="https://tiktok.com/@kraymer.art" target="_blank" rel="noopener" aria-label="TikTok, 10k followers"><span class="ft-soc__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 3c.5 2.5 2 4 4.5 4.3"/></svg></span><span class="ft-soc__count">10k</span></a>
        </div>
      </div>
      <p class="ft-founder__bio">Hi, I'm Kraymer. Before jewelry, I was teaching art online. The standard hasn't moved. I only make what I'd wear myself.</p>
      <a class="ft-founder__cta" href="about.html">Our Story &rarr;</a>
    </div>
    <div class="ft-cols">
      <div>
        <h3>Shop</h3>
        <a href="coleccion.html">All Collections</a>
        <a href="coleccion.html?collection=jjk">Jujutsu Kaisen</a>
        <a href="coleccion.html?collection=kny">Demon Slayer</a>
        <a href="coleccion.html?collection=genshin">Genshin Impact</a>
        <a href="coleccion.html?type=sets">Collector Sets</a>
        <a href="#">Mystery Box</a>
      </div>
      <div>
        <h3>Brand</h3>
        <a href="about.html">Our Story</a>
        <a href="about.html#craft">The Craft</a>
        <a href="blog.html">Journal</a>
        <a href="quiz.html">Find Your Piece</a>
        <a href="index.html#reviews">Customer Reviews</a>
        <a href="https://instagram.com/kraymer.art" target="_blank" rel="noopener">Instagram</a>
        <a href="https://youtube.com/@KraymerArt" target="_blank" rel="noopener">YouTube</a>
      </div>
      <div class="ft-care">
        <h3>Customer Care</h3>
        <a href="#" data-open-sizeguide>Ring Size Guide</a>
        <a href="#">Shipping &amp; Made-to-Order Timeline</a>
        <a href="#">60 Day Returns</a>
        <a href="#">Lifetime Warranty</a>
        <a href="index.html#faq">FAQ</a>
        <a href="mailto:support@kraymerart.com" class="mail">support@kraymerart.com</a>
      </div>
    </div>
    <div class="ft-news">
      <h2>Join 10,000+ collectors</h2>
      <p>First access to new pieces, private offers, and a look inside the studio.</p>
      <form data-newsletter>
        <input type="email" placeholder="Your email" aria-label="Email" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
    <div class="ft-pay">
      <span>VISA</span><span>MASTERCARD</span><span>AMEX</span>
      <span>APPLE PAY</span><span>GOOGLE PAY</span><span>PAYPAL</span>
    </div>
    <div class="ft-copy">
      <p>&copy; 2026 Kraymer. All rights reserved.</p>
      <p>Privacy Policy &middot; Terms of Service &middot; Refund Policy</p>
      <p style="margin-top:.75rem;opacity:.5">Every Kraymer design is an original, hand-sculpted work.</p>
    </div>
  </div>
</footer>
`;

const CART_HTML = `
<div class="scrim" data-scrim></div>
<aside class="drawer" data-cart-drawer aria-label="Cart">
  <div class="drawer__top">
    <h2>Your Cart <span data-cart-headcount></span></h2>
    <button class="ico" data-close-cart aria-label="Close">&times;</button>
  </div>
  <div class="drawer__body" data-cart-body></div>
  <div class="drawer__bot" data-cart-foot hidden>
    <div class="drawer__sub"><span>Subtotal</span><b data-cart-subtotal>$0</b></div>
    <button class="btn btn--dark btn--full" data-checkout>Checkout</button>
    <p class="drawer__note">Free shipping over $150 &middot; 60 day returns</p>
  </div>
</aside>
`;

const PROMO_FAB_HTML = `
<button class="promo-fab" data-promo-fab hidden aria-label="10% off your first piece">
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8"/><path d="M16.5 8a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8"/></svg>
</button>
`;

(function injectPartials() {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = HEADER_HTML;
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;
  const cartHost = document.createElement("div");
  cartHost.innerHTML = CART_HTML + `<div class="scrim mob-scrim" data-close-menu></div>` + PROMO_FAB_HTML;
  document.body.appendChild(cartHost);
  if (typeof lucide !== "undefined") lucide.createIcons();
})();
