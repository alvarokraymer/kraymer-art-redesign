# Kraymer Art — Redesign Mockup v1

Mockup visual e interactivo para decidir la dirección de diseño del rebuild de
kraymerart.com. **No es producción ni Shopify**: es una maqueta navegable para
iterar rápido. Un desarrollador Shopify portará las decisiones a Horizon después.

## Cómo verlo

Opción rápida: doble clic en `index.html` (funciona desde `file://`).

Opción recomendada (más parecida al deploy):

```powershell
cd A:\Kraymer\02_Website\liveDesign
python -m http.server 8000
# abre http://localhost:8000
```

Mira todo en **vista móvil** (DevTools → 375–414px). Ese es el diseño real;
desktop es solo una cortesía.

## Qué contiene

| Página | Archivo | URLs de ejemplo |
|---|---|---|
| Home | `index.html` | `/` |
| Colección (PLP) | `coleccion.html` | `/coleccion.html`, `?collection=jjk`, `?collection=kny`, `?collection=genshin`, `?type=sets` |
| Producto (PDP) | `producto.html` | `?id=the-limitless-ring`, `?id=hinokami-kagura-pendant`, `?id=vision-gemstone-collector-box` |

Componentes transversales: header con buscador funcional, wishlist, drawer de
carrito con una sola CTA (checkout **simulado**: es un mock, está marcado en el
código), quiz "Find Your Domain", guía de tallas, sticky add-to-cart en PDP.

Carrito y wishlist persisten en `localStorage`. Para reiniciarlos: DevTools →
Application → Local Storage → borrar `ka_cart` y `ka_wishlist`.

## Placeholders (intencionados)

- Imágenes: bloques oscuros `.ph` con etiqueta de qué foto iría ahí.
- Ratings/reviews/cifras sociales: marcados como `[RATING PLACEHOLDER]`,
  `[SOCIAL PROOF PLACEHOLDER]`, etc. **Nunca** poner cifras inventadas que
  parezcan reales.
- Checkout: modal simulado, sin integración real.

## Cómo iterar (esto es lo importante)

Todo el look vive en variables CSS en `:root` dentro de `assets/css/styles.css`:
colores, tipografías, espaciados, radios. Para cambios de dirección visual, toca
la variable, no las reglas. Los productos se editan en `assets/js/data.js`.

Ejemplos de cambios típicos y dónde van:

- "Otro tono de dorado" → `--gold` en `styles.css`.
- "Más aire entre secciones" → `--space-7` / clases `.section`.
- "Otro producto / precio / badge" → `PRODUCTS` en `assets/js/data.js`.
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

## Deploy a Cloudflare Pages (cuando validemos la v1)

1. Crear repo en GitHub (usuario y nombre a decidir) y hacer push de esta carpeta:
   ```powershell
   git init
   git add -A
   git commit -m "Kraymer Art redesign mockup v1"
   git remote add origin https://github.com/<usuario>/<repo>.git
   git push -u origin main
   ```
2. En Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Elegir el repo. Config: framework **None**, build command **vacío**,
   output directory **`/`** (raíz del repo).
4. Deploy. Cada `git push` a `main` redespliega solo (iteración live).

No hace falta compartir tokens ni claves: la conexión GitHub↔Cloudflare se hace
desde el dashboard con la cuenta propia.

## Decisiones de diseño ya tomadas (no deshacer sin hablarlo)

Mobile-first, navegación por fandom con nombres completos, una CTA dominante,
sin temporizadores falsos, sold-out al final atenuado, timeline de fabricación
(9–20 días) bajo el botón de compra, copy sin la palabra "premium" y sin guiones
como puntuación. Contexto completo en `AGENTS.md`.
