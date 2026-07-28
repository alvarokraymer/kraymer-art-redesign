const COLLECTIONS = {
  jjk:     { name: "JJK", abbr: "JJ", accent: "jjk" },
  kny:     { name: "KNY", abbr: "KN", accent: "kny" },
  genshin: { name: "Genshin", abbr: "GI",  accent: "genshin" },
  all:     { name: "Full Collection", abbr: "", accent: "" },
};

const PRODUCT_TYPES = [
  { id: "rings",     name: "Rings" },
  { id: "necklaces", name: "Necklaces" },
  { id: "earrings",  name: "Earrings" },
  { id: "bracelets", name: "Bracelets" },
  { id: "sets",      name: "Collector Sets" },
  { id: "pins",      name: "Enamel Pins" },
];

const PHOTOS = {
  "anyaXyor_PP": ["anyaXyor_hero","anyaXyor_front","anyaXyor_model1","anyaXyor_model2","anyaXyor_detail","anyaXyor_scale","anaXyor_variation"],
  "giyuPin_PP":  ["giyuPin_hero","giyuPin_front","giyuPin_model","giyuPin_detail1","giyuPin_detail2","giyuPin_GID","giyuPin_GID_detail"],
  "giyuRing_PP": ["giyuRing_hero","giyuRing_front","giyuRing_model1","giyuRing_model2","giyuRing_detail","giyuRing_scale","giyuRing_variation"],
  "gojoXgeto_PP":["gojoXgeto_hero","gojoXgeto_front","gojoXgeto_model1","gojoXgeto_model2","gojoXgeto_detail","gojoXgeto_detail1","gojoXgeto_scale"],
};

const PRODUCTS = [
  { handle:"anya-x-yor", title:"Anya x Yor", type:"earrings", price:12500, compareAt:15500, pieces:1, badges:["bestseller"], batch:"", soldOut:false, metals:["925 Sterling Silver","18K Gold Plated"], sizes:[], line:"", gem:"", phId:1, imgDir: "anyaXyor_PP", images: PHOTOS["anyaXyor_PP"].map((f) => "assets/productPhotos/anyaXyor_PP/"+f+".webp"), collection: "all" },
  { handle:"giyu-pin", title:"Giyu Pin", type:"pins", price:2895, compareAt:null, pieces:1, badges:[], batch:"", soldOut:false, metals:[], sizes:[], line:"", gem:"", phId:2, imgDir: "giyuPin_PP", images: PHOTOS["giyuPin_PP"].map((f) => "assets/productPhotos/giyuPin_PP/"+f+".webp"), collection: "all" },
  { handle:"giyu-ring", title:"Giyu Ring", type:"rings", price:18500, compareAt:22000, pieces:1, badges:["bestseller"], batch:"", soldOut:false, metals:["925 Sterling Silver","18K Gold Plated"], sizes:["5","6","7","8","9","10","11","12"], line:"", gem:"Sapphire", phId:3, imgDir: "giyuRing_PP", images: PHOTOS["giyuRing_PP"].map((f) => "assets/productPhotos/giyuRing_PP/"+f+".webp"), collection: "all" },
  { handle:"gojo-x-geto", title:"Gojo x Geto", type:"rings", price:16500, compareAt:null, pieces:1, badges:[], batch:"", soldOut:false, metals:["18K Gold Plated","925 Sterling Silver"], sizes:["5","6","7","8","9","10","11","12"], line:"", gem:"Citrine", phId:4, imgDir: "gojoXgeto_PP", images: PHOTOS["gojoXgeto_PP"].map((f) => "assets/productPhotos/gojoXgeto_PP/"+f+".webp"), collection: "all" },
];

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
const RATING_PLACEHOLDER = "[RATING PLACEHOLDER]";
