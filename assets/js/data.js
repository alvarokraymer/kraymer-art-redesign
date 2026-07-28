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

const PRODUCTS = [
  {"handle":"shenhe-necklace","title":"Shenhe Necklace","collection":"genshin","type":"necklaces","price":17895,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","phId":null,"images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign_7_f1a5a54a-ac6c-4f1d-885c-3b763a542b14.webp?v=1785137410"]},
  {"handle":"venti-bracelet","title":"Venti Bracelet","collection":"genshin","type":"bracelets","price":20995,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign-53.webp?v=1783534709"]},
  {"handle":"nahida-bracelet","title":"Nahida Bracelet","collection":"genshin","type":"bracelets","price":20195,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Silver","Gold"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/3_9459b841-6555-48cd-b044-918dd07ef09d.webp?v=1784888980"]},
  {"handle":"mavuika-necklace","title":"Mavuika Necklace","collection":"genshin","type":"necklaces","price":16795,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Mavuika.webp?v=1785053927"]},
  {"handle":"zhongli-necklace","title":"Zhongli Necklace","collection":"genshin","type":"necklaces","price":16195,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign-55.webp?v=1783659127"]},
  {"handle":"kinich-necklace","title":"Kinich Necklace","collection":"genshin","type":"necklaces","price":15995,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitled_design-52.webp?v=1783401129"]},
  {"handle":"durin-necklace","title":"Durin Necklace","collection":"genshin","type":"necklaces","price":16195,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign-38.webp?v=1782592071"]},
  {"handle":"lynette-necklace","title":"Lynette Necklace","collection":"genshin","type":"necklaces","price":14995,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/101.webp?v=1782228376"]},
  {"handle":"lyney-necklace","title":"Lyney Necklace","collection":"genshin","type":"necklaces","price":12495,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/97.webp?v=1782228376"]},
  {"handle":"lyney-x-lynette-necklace-set","title":"Lyney x Lynette Set","collection":"genshin","type":"necklaces","price":21795,"compareAt":null,"pieces":2,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/95.webp?v=1782228376"]},
  {"handle":"yae-miko-x-raiden-earrings","title":"Yae Miko x Raiden Earrings","collection":"genshin","type":"earrings","price":15495,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign-26.webp?v=1782123059"]},
  {"handle":"lyney-x-lynette-glow-pin","title":"Lyney x Lynette Glow Pin","collection":"genshin","type":"pins","price":2895,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign-54.webp?v=1783615495"]},
  {"handle":"higuruma-necklace","title":"Higuruma Necklace","collection":"jjk","type":"necklaces","price":14595,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitled_design-48.webp?v=1782988375"]},
  {"handle":"full-jjk-pin-set","title":"Full JJK Pin Set","collection":"jjk","type":"pins","price":29195,"compareAt":null,"pieces":1,"badges":["collector-set"],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/JJK_Pins_Banner_NEW.webp?v=1782371352"]},
  {"handle":"hinokami-kagura-pendant","title":"Hinokami Kagura Pendant","collection":"kny","type":"necklaces","price":13500,"compareAt":15500,"pieces":1,"badges":["bestseller"],"batch":"Batch #03","soldOut":false,"metals":["925 Sterling Silver","18K Gold Plated"],"sizes":[],"line":"","gem":"Garnet","phId":2,"images":["placeholder"]},
  {"handle":"water-breathing-ring","title":"Water Breathing Ring","collection":"kny","type":"rings","price":12500,"compareAt":null,"pieces":1,"badges":[],"batch":"Batch #02","soldOut":false,"metals":["925 Sterling Silver"],"sizes":["5","6","7","8","9","10","11","12"],"line":"","gem":"Blue Topaz","images":["placeholder"]},
  {"handle":"nezuko-bamboo-cuff","title":"Nezuko Bamboo Cuff","collection":"kny","type":"bracelets","price":9500,"compareAt":null,"pieces":1,"badges":["bestseller"],"batch":"Batch #03","soldOut":false,"metals":["925 Sterling Silver","18K Gold Plated"],"sizes":["S","M","L"],"line":"","gem":"Pink Opal","phId":3,"images":["placeholder"]},
  {"handle":"nichirin-blade-set","title":"Nichirin Blade Set","collection":"kny","type":"sets","price":34000,"compareAt":38000,"pieces":2,"badges":["collector-set"],"batch":"Batch #01","soldOut":true,"metals":["925 Sterling Silver"],"sizes":["5","6","7","8","9","10","11","12"],"line":"","gem":"Onyx","images":["placeholder"]},
  {"handle":"collector-club-box","title":"Collector Club Box","collection":"all","type":"sets","price":6995,"compareAt":null,"pieces":1,"badges":["bestseller"],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Slide_1.webp?v=1783052990"]},
  {"handle":"pride-anime-duos-pin-set","title":"Pride Anime Duos Pin Set","collection":"all","type":"sets","price":18195,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitled_design-25.webp?v=1781526611"]},
  {"handle":"pride-angel-wing-pendant","title":"Pride Angel Wing Pendant","collection":"all","type":"necklaces","price":11195,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitled_design-34.webp?v=1782389292"]},
  {"handle":"pride-heart-pendant","title":"Pride Heart Pendant","collection":"all","type":"necklaces","price":11195,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":["Gold","Silver"],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitled_design_2_922c48bb-51b2-4e01-b751-a5778d40b67a.webp?v=1783582686"]},
  {"handle":"pride-animals-pin-set","title":"Pride Animals Pin Set","collection":"all","type":"sets","price":31295,"compareAt":null,"pieces":1,"badges":[],"batch":"","soldOut":false,"metals":[],"sizes":[],"line":"","gem":"","images":["https://cdn.shopify.com/s/files/1/0666/9015/4658/files/Untitleddesign-22.webp?v=1781518750"]},
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
