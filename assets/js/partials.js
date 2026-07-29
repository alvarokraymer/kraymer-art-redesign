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
  <span>10,000+ clients</span><span>&middot;</span>
  <span>Free delivery over $150</span><span>&middot;</span>
  <span>Lifetime warranty</span><span>&middot;</span>
  <span>Handcrafted to order</span>
  <span>10,000+ clients</span><span>&middot;</span>
  <span>Free delivery over $150</span><span>&middot;</span>
  <span>Lifetime warranty</span><span>&middot;</span>
  <span>Handcrafted to order</span>
</div></div>`;

const HEADER_HTML = `
<header class="site-header">
  <div class="hdr-bar">
    <button class="hamburger" data-open-menu aria-label="Menu"><span></span><span></span><span></span></button>
    <a class="hdr-logo" href="index.html"><img src="assets/SVG/logoProv.svg" alt="Kraymer" height="12"></a>
    <div class="hdr-actions">
      <a class="ico" href="#" aria-label="Account" title="Not in mockup">${ICONS.account}</a>
      <button class="ico" data-open-cart aria-label="Cart">${ICONS.bag}<span class="n" data-cart-count hidden>0</span></button>
    </div>
  </div>
</header>
<nav class="mob-nav" data-mob-nav>
  <button class="mob-search-row" data-open-search style="margin-top:1.5rem">
    <svg viewBox="0 0 24 24" style="width:18px;height:18px;stroke:var(--accent);fill:none;stroke-width:1.5;flex:none"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>
    Search
  </button>
  <div class="mob-links">
    <a class="mob-link" href="coleccion.html">All Collections</a>
    <button class="mob-label-btn" data-mob-collapse>COLLECTIONS <span class="mob-arrow"></span></button>
    <div class="mob-sub" data-mob-sub>
      <a class="mob-link mob-link--sub" href="coleccion.html?collection=jjk">JJK</a>
      <a class="mob-link mob-link--sub" href="coleccion.html?collection=kny">KNY</a>
      <a class="mob-link mob-link--sub" href="coleccion.html?collection=genshin">Genshin</a>
      <a class="mob-link mob-link--sub" href="coleccion.html">Best Sellers</a>
      <a class="mob-link mob-link--sub" href="coleccion.html?type=sets">Collector Sets</a>
    </div>
    <a class="mob-link" href="#">Mystery Box</a>
    <a class="mob-link" href="#" data-open-wishlist>Wishlist</a>
    <button class="mob-label-btn" data-mob-collapse>BRAND <span class="mob-arrow"></span></button>
    <div class="mob-sub" data-mob-sub>
      <a class="mob-link mob-link--sub" href="index.html#craft">Our Story</a>
      <a class="mob-link mob-link--sub" href="index.html#craft">The Craft</a>
      <a class="mob-link mob-link--sub" href="index.html#reviews">Reviews</a>
      <a class="mob-link mob-link--sub" href="index.html#faq">FAQ</a>
    </div>
  </div>
  <div class="mob-foot">
    <div class="mob-foot-row"><a href="#" data-open-wishlist>Wishlist</a></div>
    <div class="mob-foot-icons">
      <a href="https://instagram.com/kraymer.art" target="_blank" rel="noopener" aria-label="Instagram" class="mob-soc">IG</a>
      <a href="https://youtube.com/@KraymerArt" target="_blank" rel="noopener" aria-label="YouTube" class="mob-soc">YT</a>
      <a href="https://tiktok.com/@kraymer.art" target="_blank" rel="noopener" aria-label="TikTok" class="mob-soc">TK</a>
    </div>
    <div class="mob-foot-row">
      <span>Dark mode</span>
      <button class="theme-btn" data-theme-toggle>
        <svg class="theme-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
        <svg class="theme-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      </button>
    </div>
  </div>
</nav>
<!-- Search overlay (lightbox) -->
<div class="search" data-search-overlay>
  <div class="search__bar">
    <input type="search" placeholder="Search pieces..." data-search-input aria-label="Search">
    <button data-close-search style="font-size:1.5rem;color:var(--muted);padding:0 1rem">&times;</button>
  </div>
  <div class="search__body" data-search-results>
    <p class="search__hint">Try "sapphire", "garnet" or "topaz".</p>
  </div>
</div>
`;

const FOOTER_HTML = `
<footer class="ft">
  <div class="w">
    <div class="ft-news">
      <h2>Join 10,000+ collectors</h2>
      <p>First access to new pieces, private offers, and a look inside the workshop.</p>
      <form data-newsletter>
        <input type="email" placeholder="Your email" aria-label="Email" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>
    <div class="ft-cols">
      <div>
        <h3>Shop</h3>
        <a href="coleccion.html">All Collections</a>
        <a href="coleccion.html?collection=jjk">JJ</a>
        <a href="coleccion.html?collection=kny">KN</a>
        <a href="coleccion.html?collection=genshin">GI</a>
        <a href="coleccion.html?type=sets">Collector Sets</a>
        <a href="#">Mystery Box</a>
      </div>
      <div>
        <h3>Customer Care</h3>
        <a href="#" data-open-sizeguide>Ring Size Guide</a>
        <a href="#">Shipping &amp; Handmade Timeline</a>
        <a href="#">60-Day Returns</a>
        <a href="#">Lifetime Warranty</a>
        <a href="index.html#faq">FAQ</a>
        <a href="mailto:support@kraymerart.com" class="mail">support@kraymerart.com</a>
      </div>
      <div>
        <h3>Brand</h3>
        <a href="index.html#craft">Our Story</a>
        <a href="index.html#craft">The Craft</a>
        <a href="index.html#reviews">Customer Reviews</a>
        <a href="#">Instagram</a>
        <a href="#">YouTube</a>
      </div>
    </div>
    <div class="ft-trust">
      <span><i data-lucide="shield-check" style="width:16px;height:16px;stroke:var(--accent)"></i> Lifetime Warranty</span>
      <span><i data-lucide="rotate-ccw" style="width:16px;height:16px;stroke:var(--accent)"></i> 60-Day Returns</span>
      <span><i data-lucide="scroll-text" style="width:16px;height:16px;stroke:var(--accent)"></i> Certificate of Authenticity</span>
    </div>
    <div class="ft-pay">
      <span>VISA</span><span>MASTERCARD</span><span>AMEX</span>
      <span>APPLE PAY</span><span>GOOGLE PAY</span><span>PAYPAL</span>
    </div>
    <div class="ft-copy">
      <p>&copy; 2026 Kraymer. All rights reserved.</p>
      <p>Privacy Policy &middot; Terms of Service &middot; Refund Policy</p>
      <p style="margin-top:.75rem;opacity:.5">Kraymer designs are original handcrafted works.</p>
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
    <p class="drawer__note">Free shipping over $150 &middot; 60-day returns</p>
  </div>
</aside>
`;

(function injectPartials() {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = HEADER_HTML;
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;
  const cartHost = document.createElement("div");
  cartHost.innerHTML = CART_HTML + `<div class="scrim mob-scrim" data-close-menu></div>`;
  document.body.appendChild(cartHost);
  if (typeof lucide !== "undefined") lucide.createIcons();
})();
