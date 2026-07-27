/* ============================================================
   KRAYMER ART — Mock product catalog
   ------------------------------------------------------------
   SHOPIFY HORIZON MAPPING:
   Each object below mirrors the shape of a Shopify `product`
   so a Horizon developer can port 1:1:
     handle          -> product.handle
     title           -> product.title
     collection      -> collection handle (jjk / kny / genshin)
     character       -> product metafield: kraymer.character
     technique       -> product metafield: kraymer.technique
     type            -> product.product_type (rings/necklaces/...)
     price/compareAt -> variant.price / variant.compare_at_price
                        (in cents, same as Shopify)
     pieces          -> product metafield: kraymer.pieces_in_set
     batch           -> product metafield: kraymer.batch_label
     soldOut         -> !product.available
     metals/sizes    -> variant options (Metal, Size)
   Ratings/reviews are ALWAYS placeholders. Never ship numbers
   that look real until a real review app provides them.
   ============================================================ */

const COLLECTIONS = {
  jjk:     { name: "Collection JJ", abbr: "JJ", accent: "jjk" },
  kny:     { name: "Collection KN", abbr: "KN", accent: "kny" },
  genshin: { name: "Collection GI", abbr: "GI",  accent: "genshin" },
};

const PRODUCT_TYPES = [
  { id: "rings",     name: "Rings" },
  { id: "necklaces", name: "Necklaces" },
  { id: "earrings",  name: "Earrings" },
  { id: "bracelets", name: "Bracelets" },
  { id: "sets",      name: "Collector Sets" },
];

const PRODUCTS = [
  {
    handle: "the-limitless-ring",
    title: "The Limitless Ring",
    collection: "jjk",
    character: "Gojo Satoru",
    technique: "the Limitless technique",
    type: "rings",
    price: 18500, compareAt: 22000, pieces: 1,
    badges: ["bestseller"], batch: "Batch #04", soldOut: false,
    metals: ["925 Sterling Silver", "18K Gold Plated"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    line: "Inspired by Gojo Satoru's Limitless. Infinity, rendered as an unbroken circle of hand-set sapphire.",
    gem: "Sapphire",
  },
  {
    handle: "king-of-curses-pendant",
    title: "King of Curses Pendant",
    collection: "jjk",
    character: "Ryomen Sukuna",
    technique: "the Shrine technique",
    type: "necklaces",
    price: 14500, compareAt: null, pieces: 1,
    badges: [], batch: "Batch #02", soldOut: false,
    metals: ["925 Sterling Silver", "18K Gold Plated"],
    sizes: [],
    line: "A pendant for the King of Curses. Carved flame motifs around a deep garnet core.",
    gem: "Garnet",
  },
  {
    handle: "domain-expansion-set",
    title: "Domain Expansion Set",
    collection: "jjk",
    character: "Gojo Satoru",
    technique: "Domain Expansion",
    type: "sets",
    price: 29500, compareAt: 33000, pieces: 2,
    badges: ["collector-set"], batch: "Batch #04", soldOut: false,
    metals: ["925 Sterling Silver"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    line: "Ring and pendant, one domain. The Limitless circle paired with the Six Eyes sapphire drop.",
    gem: "Sapphire",
  },
  {
    handle: "cursed-energy-studs",
    title: "Cursed Energy Studs",
    collection: "jjk",
    character: "Ryomen Sukuna",
    technique: "cursed energy",
    type: "earrings",
    price: 8500, compareAt: null, pieces: 1,
    badges: [], batch: "Batch #01", soldOut: true,
    metals: ["925 Sterling Silver"],
    sizes: [],
    line: "Small studs, heavy presence. Black onyx cut to hold the light like cursed energy does.",
    gem: "Onyx",
  },
  {
    handle: "hinokami-kagura-pendant",
    title: "Hinokami Kagura Pendant",
    collection: "kny",
    character: "Tanjiro Kamado",
    technique: "the Hinokami Kagura dance",
    type: "necklaces",
    price: 13500, compareAt: 15500, pieces: 1,
    badges: ["bestseller"], batch: "Batch #03", soldOut: false,
    metals: ["925 Sterling Silver", "18K Gold Plated"],
    sizes: [],
    line: "The dance of the fire god, caught in a flame-cut garnet that moves with you.",
    gem: "Garnet",
  },
  {
    handle: "water-breathing-ring",
    title: "Water Breathing Ring",
    collection: "kny",
    character: "Giyu Tomioka",
    technique: "Water Breathing, Eleventh Form",
    type: "rings",
    price: 12500, compareAt: null, pieces: 1,
    badges: [], batch: "Batch #02", soldOut: false,
    metals: ["925 Sterling Silver"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    line: "Dead calm. A still-water band with a single channel of blue topaz, cut like a blade's edge.",
    gem: "Blue Topaz",
  },
  {
    handle: "nezuko-bamboo-cuff",
    title: "Nezuko Bamboo Cuff",
    collection: "kny",
    character: "Nezuko Kamado",
    technique: "her bamboo muzzle",
    type: "bracelets",
    price: 9500, compareAt: null, pieces: 1,
    badges: ["bestseller"], batch: "Batch #03", soldOut: false,
    metals: ["925 Sterling Silver", "18K Gold Plated"],
    sizes: ["S", "M", "L"],
    line: "Bamboo, reimagined as a cuff. Gentle to look at, stubborn in the fire.",
    gem: "Pink Opal",
  },
  {
    handle: "nichirin-blade-set",
    title: "Nichirin Blade Set",
    collection: "kny",
    character: "Tanjiro Kamado",
    technique: "the Nichirin blade",
    type: "sets",
    price: 34000, compareAt: 38000, pieces: 2,
    badges: ["collector-set"], batch: "Batch #01", soldOut: true,
    metals: ["925 Sterling Silver"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    line: "Pendant and ring in one collector box. The blade that changes color, set in stone and steel.",
    gem: "Onyx",
  },
  {
    handle: "electro-vision-ring",
    title: "Electro Vision Ring",
    collection: "genshin",
    character: "Raiden Shogun",
    technique: "the Electro Vision",
    type: "rings",
    price: 15500, compareAt: 17500, pieces: 1,
    badges: [], batch: "Batch #02", soldOut: false,
    metals: ["925 Sterling Silver", "18K Gold Plated"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    line: "Eternity, held still. An amethyst Vision in a storm-setting of polished silver.",
    gem: "Amethyst",
  },
  {
    handle: "anemo-vision-pendant",
    title: "Anemo Vision Pendant",
    collection: "genshin",
    character: "Venti",
    technique: "the Anemo Vision",
    type: "necklaces",
    price: 12000, compareAt: null, pieces: 1,
    badges: [], batch: "Batch #01", soldOut: false,
    metals: ["925 Sterling Silver"],
    sizes: [],
    line: "A wind that remembers every song. Peridot cut light, on a chain that barely weighs a breath.",
    gem: "Peridot",
  },
  {
    handle: "geo-archon-signet",
    title: "Geo Archon Signet",
    collection: "genshin",
    character: "Zhongli",
    technique: "the Geo Archon's contracts",
    type: "rings",
    price: 16500, compareAt: null, pieces: 1,
    badges: ["bestseller"], batch: "Batch #02", soldOut: false,
    metals: ["18K Gold Plated", "925 Sterling Silver"],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12"],
    line: "A contract sealed in stone. Citrine set deep, the way Liyue sets its word.",
    gem: "Citrine",
  },
  {
    handle: "vision-gemstone-collector-box",
    title: "Vision Gemstone Collector Box",
    collection: "genshin",
    character: "The Seven",
    technique: "all seven Visions",
    type: "sets",
    price: 42000, compareAt: null, pieces: 3,
    badges: ["collector-set"], batch: "Batch #01", soldOut: false,
    metals: ["925 Sterling Silver", "18K Gold Plated"],
    sizes: [],
    line: "Three Visions, one vault box. Certificate of authenticity numbered by hand.",
    gem: "Mixed",
  },
];

/* Helpers shared by all pages */
function kaProduct(handle) {
  return PRODUCTS.find((p) => p.handle === handle);
}
function kaMoney(cents) {
  return "$" + (cents / 100).toFixed(cents % 100 === 0 ? 0 : 2);
}
function kaTypeName(typeId) {
  const t = PRODUCT_TYPES.find((t) => t.id === typeId);
  return t ? t.name : typeId;
}
/* Rating is ALWAYS a placeholder. Replace with a real reviews app. */
const RATING_PLACEHOLDER = "[RATING PLACEHOLDER]";
