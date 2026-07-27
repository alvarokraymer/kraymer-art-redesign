/* ============================================================
   KRAYMER ART — Shared partials v3
   Hamburger nav, header, footer, cart drawer, search.
   ============================================================ */

const ICONS = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
  account: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.5C7 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.3.9 4.3 2.4 1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-4 7.2-9 11.2z"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12.2a1.8 1.8 0 0 1-1.8 1.8H8a1.8 1.8 0 0 1-1.8-1.8L5 8z"/><path d="M8.5 10V6.5a3.5 3.5 0 0 1 7 0V10"/></svg>',
};

const HEADER_HTML = `
<header class="site-header">
  <div class="hdr-bar">
    <button class="hamburger" data-open-menu aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
    <a class="hdr-logo" href="index.html">Kraymer <i>Art</i></a>
    <div class="hdr-actions">
      <button class="ico" data-open-search aria-label="Search">${ICONS.search}</button>
      <a class="ico" href="#" aria-label="Account" title="Account not in mockup">${ICONS.account}</a>
      <button class="ico" data-open-wishlist aria-label="Wishlist">${ICONS.heart}<span class="n" data-wishlist-count hidden>0</span></button>
      <button class="ico" data-open-cart aria-label="Cart">${ICONS.bag}<span class="n" data-cart-count hidden>0</span></button>
    </div>
  </div>
</header>
<!-- Mobile nav overlay -->
<nav class="mob-nav" data-mob-nav>
  <a href="coleccion.html?collection=jjk">Jujutsu Kaisen <small>JJK</small></a>
  <a href="coleccion.html?collection=kny">Demon Slayer <small>KNY</small></a>
  <a href="coleccion.html?collection=genshin">Genshin Impact</a>
  <a href="coleccion.html">Best Sellers</a>
  <a href="coleccion.html?type=sets">Collector Sets</a>
</nav>
`;

const FOOTER_HTML = `
<footer class="ft">
  <div class="w">
    <div class="ft-news">
      <h2>Join the Inner Circle</h2>
      <p>Early access to limited batch drops, and 10% off your first piece.</p>
      <form data-newsletter>
        <input type="email" placeholder="Your email" aria-label="Email" required>
        <button type="submit">Join</button>
      </form>
    </div>
    <div class="ft-cols">
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
        <a href="#" data-open-sizeguide>Ring Size Guide</a>
        <a href="#">Shipping &amp; Handmade Timeline</a>
        <a href="#">60-Day Returns</a>
        <a href="#">Lifetime Warranty</a>
        <a class="mail" href="mailto:support@kraymerart.com">support@kraymerart.com</a>
      </div>
      <div>
        <h3>Brand</h3>
        <a href="index.html#craft">Our Story</a>
        <a href="index.html#craft">The Craft</a>
        <a href="index.html#reviews">Reviews</a>
        <a href="index.html#faq">FAQ</a>
      </div>
    </div>
    <div class="ft-pay">
      <span>VISA</span><span>MASTERCARD</span><span>AMEX</span>
      <span>APPLE PAY</span><span>GOOGLE PAY</span><span>PAYPAL</span>
    </div>
    <div class="ft-copy">
      <p>&copy; 2026 Kraymer Art. All rights reserved.</p>
      <p>Kraymer Art designs are original works inspired by the series we love. Not affiliated with any studio or license holder.</p>
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
    <p class="drawer__note">Free shipping over $150 · 60-day returns</p>
  </div>
</aside>
`;

const SEARCH_HTML = `
<div class="search" data-search-overlay>
  <div class="search__bar">
    <input type="search" placeholder="Search by character, series or gem..." data-search-input aria-label="Search">
    <button data-close-search style="font-size:1.5rem;color:var(--muted);padding:0 1rem">&times;</button>
  </div>
  <div class="search__body" data-search-results>
    <p class="search__hint">Try "Gojo", "Demon Slayer" or "sapphire".</p>
  </div>
</div>
`;

(function injectPartials() {
  const headerMount = document.getElementById("site-header");
  const footerMount = document.getElementById("site-footer");
  if (headerMount) headerMount.innerHTML = HEADER_HTML;
  if (footerMount) footerMount.innerHTML = FOOTER_HTML;
  const cartHost = document.createElement("div");
  cartHost.innerHTML = CART_HTML + SEARCH_HTML;
  document.body.appendChild(cartHost);
})();
