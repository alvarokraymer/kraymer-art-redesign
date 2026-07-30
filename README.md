# Kraymer Art — Redesign Mockup

Mockup visual e interactivo para decidir la dirección de diseño del rebuild de
kraymerart.com. **No es producción ni Shopify**: es una maqueta navegable para
iterar rápido, y se trata como un **documento de diseño ejecutable**: las
reglas de `AGENTS.md` describen el estado real y verificado del código, no
aspiraciones. Un desarrollador Shopify portará las decisiones a Horizon después.

## Cómo verlo

Opción rápida: doble clic en `index.html` (funciona desde `file://`).

Opción recomendada (más parecida al deploy):

```bash
npx http-server -p 8000 .
```

Abre `http://localhost:8000`. (No hay Python instalado en este entorno — no
uses `python -m http.server`.)

Mira todo en **vista móvil** (DevTools → 375–414px) **y prueba el toggle de
dark mode** (menú hamburguesa → "Dark mode"). Ese es el diseño real; desktop es
solo una cortesía, y varias secciones solo se rompen visualmente en dark mode
si no las revisas con el toggle activado.

## Qué contiene

| Página | Archivo | URLs de ejemplo |
|---|---|---|
| Home | `index.html` | `/` |
| Colección (PLP) | `coleccion.html` | `?collection=jjk`, `?collection=kny`, `?collection=genshin`, `?type=sets` |
| Producto (PDP) | `producto.html` | `?id=<handle>&approach=1\|2\|3\|4` — 4 layouts distintos, ver `AGENTS.md` |
| Journal / blog | `blog.html` | grid de `BLOG_POSTS` (`assets/js/data.js`); `blog.html#slug` va directo a un post |
| Our Story | `about.html` | fundador, "The Craft", CTA a colecciones |

Componentes transversales: header con buscador funcional, wishlist, drawer de
carrito con una sola CTA (checkout **simulado**: es un mock, está marcado en el
código), quiz "Find Your Domain", guía de tallas, sticky add-to-cart en PDP,
toggle de dark mode.

Carrito, wishlist y el tema (claro/oscuro) persisten en `localStorage`. Para
reiniciarlos: DevTools → Application → Local Storage → borrar `ka_cart`,
`ka_wishlist` y la clave de tema.

## Placeholders (intencionados)

- Imágenes: bloques oscuros `.ph` con etiqueta de qué foto iría ahí.
- Ratings/reviews/cifras sociales: marcados como `RATING_PLACEHOLDER`,
  `[REVIEWER N PLACEHOLDER]`, `[SOCIAL PROOF PLACEHOLDER]`,
  `[QUOTE N PLACEHOLDER]`. **Nunca** poner cifras o nombres inventados que
  parezcan reales — esto ya se regresó una vez (una PDP con "5.0" y reseñas
  falsas de "Verified Buyer") y se corrigió el 2026-07-30.
- Checkout: modal simulado, sin integración real.

Nota: el marquee/footer afirman "10,000+ clients/collectors" en cada página,
mientras la sección del fundador dice "more than 2,000 collectors" y la
sección de confianza usa `[SOCIAL PROOF PLACEHOLDER]`. Esas tres cifras no
coinciden entre sí — es una decisión de contenido pendiente (qué cifra real
usar en todos lados), no algo para resolver inventando un número.

## Cómo iterar (esto es lo importante)

Todo el look vive en variables CSS en `:root` dentro de `assets/css/styles.css`:
colores, tipografías, espaciados, radios. Para cambios de dirección visual,
toca la variable, no las reglas — y antes de borrar una variable, busca
`var(--nombre)` tanto en `assets/css` como en `assets/js` (varias solo se usan
desde `style=""` inline en el JS). El listado completo y actualizado de tokens
está en `AGENTS.md`, no aquí, para no duplicar y desincronizarse otra vez.

Los productos se editan en `assets/js/data.js`.

Ejemplos de cambios típicos y dónde van:

- "Otro tono de dorado" → `--accent` en `styles.css` (no `--gold`, se
  consolidó en `--accent` el 2026-07-30, mismo valor).
- "Más aire entre secciones" → clases `.sec` y variantes.
- "Otro producto / precio / badge" → `PRODUCTS` en `assets/js/data.js`. Si
  añades un campo nuevo (otra badge, otro estado), confirma que realmente se
  vea en algún lado antes de darlo por terminado — un campo de datos que no
  renderiza en ningún sitio es un bug, no un gancho para el futuro.
- "Mover un bloque de la home" → reordenar `<section>` en `index.html`.

## Portar a Shopify Horizon (para el developer)

- Cada token de `:root` = un setting de tema en `settings_schema.json`.
- Cada `<!-- section: ... -->` = un futuro `sections/*.liquid`.
- `data.js` copia la forma del objeto `product` de Shopify (precios en céntimos,
  `compareAt`, opciones de variante). Campos custom documentados como metafields:
  `kraymer.character`, `kraymer.technique`, `kraymer.pieces_in_set`,
  `kraymer.batch_label`.
- El drawer de carrito y el sticky ATC describen el UX esperado del drawer/ATC
  de Horizon.

## Deploy a Cloudflare Pages

Ya en marcha: `.github/workflows/deploy.yml` despliega a Cloudflare Pages
(proyecto `kraymer-art-redesign`) en cada push a `master`, sin build, output
dir la raíz del repo. El sitio en vivo está protegido con una pantalla de PIN
(`functions/_middleware.js`) — es opacidad intencional para que sea privado,
no una vulnerabilidad que corregir.

## Decisiones de diseño ya tomadas (no deshacer sin hablarlo)

Mobile-first, navegación por fandom con nombres completos, una CTA dominante,
sin temporizadores falsos, sold-out al final atenuado, timeline de fabricación
(9–20 días) bajo el botón de compra, copy sin la palabra "premium" y sin guiones
como puntuación. Contexto completo, tokens reales y el detalle de cómo funciona
el dark mode (y su trampa más común) están en `AGENTS.md` — léelo antes de
tocar colores o fondos de sección.
