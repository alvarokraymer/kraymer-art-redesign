/* ============================================================
   KRAYMER ART — Shared partials
   Header, nav strip, footer, cart drawer, search overlay.
   Injected as template strings so the mockup works even from
   file:// with zero build step and zero fetch() calls.

   SHOPIFY HORIZON MAPPING:
     HEADER_HTML  -> sections/header.liquid (+ snippets)
     FOOTER_HTML  -> sections/footer.liquid
     CART_HTML    -> snippets/cart-drawer.liquid
     SEARCH_HTML  -> predictive search component
   ============================================================ */

const ICONS = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  account: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8L5 8z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/></svg>',
};

const HEADER_HTML = `
<div class="announce">
  <span>Free worldwide shipping over $150</span>
  <span>Lifetime warranty on every piece</span>
</div>
<header class="site-header">
  <div class="header-bar">
    <a class="header-logo" href="index.html">Kraymer <em>Art</em></a>
    <div class="header-actions">
      <button class="icon-btn" data-open-search aria-label="Search">${ICONS.search}</button>
      <a class="icon-btn" href="#" aria-label="Account (not part of mockup)" title="Account is out of scope for this mockup">${ICONS.account}</a>
      <button class="icon-btn" data-open-wishlist aria-label="Wishlist">${ICONS.heart}<span class="count" data-wishlist-count hidden>0</span></button>
      <button class="icon-btn" data-open-cart aria-label="Cart">${ICONS.bag}<span class="count" data-cart-count hidden>0</span></button>
    </div>
  </div>
  <nav class="nav-strip" aria-label="Collections">
    <a href="coleccion.html?collection=jjk" data-nav="jjk">Jujutsu Kaisen <small>JJK</small></a>
    <a href="coleccion.html?collection=kny" data-nav="kny">Demon Slayer <small>KNY</small></a>
    <a href="coleccion.html?collection=genshin" data-nav="genshin">Genshin Impact <small>GI</small></a>
    <a href="coleccion.html" data-nav="all">Best Sellers</a>
    <a href="coleccion.html?type=sets" data-nav="sets">Collector Sets</a>
  </nav>
</header>
`;

const FOOTER_HTML = `
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-news">
      <h2>Join the Inner Circle</h2>
      <p>Early access to limited batch drops, and 10% off your first piece.</p>
      <form data-newsletter>
        <input type="email" placeholder="Your email" aria-label="Email address" required>
        <button type="submit">Join</button>
      </form>
    </div>
    <div class="footer-cols">
      <div>
        <h3>Shop</h3>
        <a href="coleccion.html?collection=jjk">Jujutsu Kaisen</a>
        <a href="coleccion.html?collection=kny">Demon Slayer</a>
        <a href="coleccion.html?collection=genshin">Genshin Impact</a>
        <a href="coleccion.html">Best Sellers</a>
        <a href="coleccion.html?type=sets">Collector Sets</a>
      </div>
      <div>
        <h3>Support</h3>
        <a href="producto.html?id=the-limitless-ring" data-open-sizeguide>Ring Size Guide</a>
        <a href="#">Shipping &amp; Handmade Timeline</a>
        <a href="#">60-Day Returns</a>
        <a href="#">Lifetime Warranty</a>
        <a class="mail" href="mailto:support@kraymerart.com">support@kraymerart.com</a>
      </div>
      <div>
        <h3>Brand</h3>
        <a href="index.html#story">Our Story</a>
        <a href="index.html#craft">The Craft</a>
        <a href="index.html#reviews">Reviews</a>
        <a href="index.html#faq">FAQ</a>
      </div>
    </div>
    <div class="footer-pay" aria-label="Accepted payments">
      <span>VISA</span><span>MASTERCARD</span><span>AMEX</span>
      <span>APPLE PAY</span><span>GOOGLE PAY</span><span>PAYPAL</span><span>SHOP PAY</span>
    </div>
    <div class="footer-legal">
      <p>&copy; 2026 Kraymer Art. All rights reserved.</p>
      <p>Kraymer Art designs are original works inspired by the series we love. We are not affiliated with, endorsed by, or sponsored by any studio or license holder.</p>
    </div>
  </div>
</footer>
`;

/* Cart drawer: ONE dominant CTA by design decision (see brief).
   MOCKUP NOTE: the checkout button opens a simulated modal only.
   There is NO real checkout integration in this file. */
const CART_HTML = `
<div class="scrim" data-scrim></div>
<aside class="drawer" data-cart-drawer aria-label="Shopping cart">
  <div class="drawer__head">
    <h2>Your Cart <span data-cart-headcount></span></h2>
    <button class="drawer__close" data-close-cart aria-label="Close cart">&times;</button>
  </div>
  <div class="drawer__body" data-cart-body></div>
  <div class="drawer__foot" data-cart-foot hidden>
    <div class="drawer__subtotal"><span>Subtotal</span><b data-cart-subtotal>$0</b></div>
    <button class="btn btn--primary" data-checkout>Checkout</button>
    <p class="drawer__note">Free worldwide shipping over $150 · 60-day returns</p>
  </div>
</aside>
`;

const SEARCH_HTML = `
<div class="search-overlay" data-search-overlay>
  <div class="search-overlay__bar">
    <input type="search" placeholder="Search by character, series or gem..." data-search-input aria-label="Search products">
    <button class="drawer__close" data-close-search aria-label="Close search">&times;</button>
  </div>
  <div class="search-results" data-search-results>
    <p class="search-hint">Try "Gojo", "Demon Slayer" or "sapphire".</p>
  </div>
</div>
`;

/* Inject everything into the page */
(function injectPartials() {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");

  if (headerMount) headerMount.innerHTML = HEADER_HTML;
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;

  const cartHost = document.createElement("div");
  cartHost.innerHTML = CART_HTML + SEARCH_HTML;
  document.body.appendChild(cartHost);
})();
