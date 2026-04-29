import type { Product } from "@/types/product";
import type { ClothesColor } from "./clothes.types";
export type { ClothesColor };


// ─── 🎨 สีสำหรับ TryOn ───────────────────────────────────────────────────────
export const SPRING_CLOTHES_COLORS: ClothesColor[] = [
 { id: "c-spr-01", name: "Coral",         colorHex: "#f4845f" },
 { id: "c-spr-02", name: "Peach",         colorHex: "#ffb899" },
 { id: "c-spr-03", name: "Warm Mint",     colorHex: "#a8d8b0" },
 { id: "c-spr-04", name: "Golden Yellow", colorHex: "#f4c842" },
 { id: "c-spr-05", name: "Ivory",         colorHex: "#f8f0e0" },
 { id: "c-spr-06", name: "Light Aqua",    colorHex: "#8ed8d0" },
 { id: "c-spr-07", name: "Salmon",        colorHex: "#e8856a" },
 { id: "c-spr-08", name: "Warm Pink",     colorHex: "#f0a0a8" },
 { id: "c-spr-09", name: "Lime Green",    colorHex: "#a0c848" },
 { id: "c-spr-10", name: "Tangerine",     colorHex: "#f08030" },
 { id: "c-spr-11", name: "Buttercup",     colorHex: "#f8d060" },
 { id: "c-spr-12", name: "Sky Mint",      colorHex: "#b8e8d8" },
];


// ─── 👗 สินค้าจริง (แสดงในหน้า Product) ─────────────────────────────────────
export const SPRING_CLOTHES: Product[] = [
 { id: "1",  name: "Cable-knit cardigan",                 brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/cable-knit-cardigan-1239430001.html", images: [{ url: "/products/spring/clothes/cable-knit-cardigan-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/cable-knit-cardigan-2.jpg" }, { url: "/products/spring/clothes/cable-knit-cardigan-3.jpg" }, { url: "/products/spring/clothes/cable-knit-cardigan-4.jpg" }, { url: "/products/spring/clothes/cable-knit-cardigan-5.jpg" }] },
 { id: "2",  name: "Collared cardigan Cream",             brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/collared-cardigan-1297892012.html", images: [{ url: "/products/spring/clothes/collared-cardigan-cream-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/collared-cardigan-cream-2.jpg" }] },
 { id: "3",  name: "Collared cardigan Pale pink",         brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/collared-cardigan-1280770002.html", images: [{ url: "/products/spring/clothes/collared-cardigan-pale-pink-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/collared-cardigan-pale-pink-2.jpg" }] },
 { id: "4",  name: "Crêpe shirt",                         brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/crepe-shirt-1243139001.html", images: [{ url: "/products/spring/clothes/crepe-shirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/crepe-shirt-2.jpg" }, { url: "/products/spring/clothes/crepe-shirt-3.jpg" }, { url: "/products/spring/clothes/crepe-shirt-4.jpg" }] },
 { id: "5",  name: "Crinkled blouse",                     brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/crinkled-blouse-1214992002.html", images: [{ url: "/products/spring/clothes/crinkled-blouse-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/crinkled-blouse-2.jpg" }, { url: "/products/spring/clothes/crinkled-blouse-3.jpg" }] },
 { id: "6",  name: "Lace-inset peplum blouse Cream",      brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/lace-inset-peplum-blouse-1290571001.html", images: [{ url: "/products/spring/clothes/lace-inset-peplum-blouse-cream-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/lace-inset-peplum-blouse-cream-2.jpg" }, { url: "/products/spring/clothes/lace-inset-peplum-blouse-cream-3.jpg" }] },
 { id: "7",  name: "Long-sleeved shirt",                  brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/long-sleeved-t-shirt-1199862010.html", images: [{ url: "/products/spring/clothes/long-sleeved-shirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/long-sleeved-shirt-2.jpg" }, { url: "/products/spring/clothes/long-sleeved-shirt-3.jpg" }, { url: "/products/spring/clothes/long-sleeved-shirt-4.jpg" }, { url: "/products/spring/clothes/long-sleeved-shirt-5.jpg" }] },
 { id: "8",  name: "Crochet-look top",             brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/crochet-look-top-1338865001.html", images: [{ url: "/products/spring/clothes/crochet-look-top-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/crochet-look-top-2.jpg" }, { url: "/products/spring/clothes/crochet-look-top-3.jpg" }, { url: "/products/spring/clothes/crochet-look-top-4.jpg" }] },
 { id: "9",  name: "Poplin shirt",                        brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/poplin-shirt-1265984002.html", images: [{ url: "/products/spring/clothes/poplin-shirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/poplin-shirt-2.jpg" }, { url: "/products/spring/clothes/poplin-shirt-3.jpg" }, { url: "/products/spring/clothes/poplin-shirt-4.jpg" }] },
 { id: "10", name: "Poplin wrap shirt",                   brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/poplin-wrap-shirt-1175788002.html", images: [{ url: "/products/spring/clothes/poplin-wrap-shirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/poplin-wrap-shirt-2.jpg" }, { url: "/products/spring/clothes/poplin-wrap-shirt-3.jpg" }, { url: "/products/spring/clothes/poplin-wrap-shirt-4.jpg" }, { url: "/products/spring/clothes/poplin-wrap-shirt-5.jpg" }, { url: "/products/spring/clothes/poplin-wrap-shirt-6.jpg" }] },
 { id: "11", name: "Regular Fit Corduroy shirt",          brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/regular-fit-corduroy-shirt-1289456001.html", images: [{ url: "/products/spring/clothes/regular-fit-corduroy-shirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/regular-fit-corduroy-shirt-2.jpg" }, { url: "/products/spring/clothes/regular-fit-corduroy-shirt-3.jpg" }, { url: "/products/spring/clothes/regular-fit-corduroy-shirt-4.jpg" }] },
 { id: "12", name: "Regular Fit Linen-blend grandad shirt", brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/regular-fit-linen-blend-grandad-shirt-1277533001.html", images: [{ url: "/products/spring/clothes/regular-fit-linen-blend-grandad-shirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/regular-fit-linen-blend-grandad-shirt-2.jpg" }, { url: "/products/spring/clothes/regular-fit-linen-blend-grandad-shirt-3.jpg" }] },
 { id: "13", name: "Relaxed Fit Twill overshirt",         brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/relaxed-fit-twill-overshirt-1297572001.html", images: [{ url: "/products/spring/clothes/relaxed-fit-twill-overshirt-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/relaxed-fit-twill-overshirt-2.jpg" }] },
 { id: "14", name: "Teddy jacket Light beige",            brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/teddy-jacket-1318809003.html", images: [{ url: "/products/spring/clothes/teddy-jacket-light-beige-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/teddy-jacket-light-beige-2.jpg" }, { url: "/products/spring/clothes/teddy-jacket-light-beige-3.jpg" }, { url: "/products/spring/clothes/teddy-jacket-light-beige-4.jpg" }] },
 { id: "15", name: "Tie-detail top",                     brand: "H&M", type: "clothes", choice: false, season: "spring", buttonlink: "https://th.hm.com/th_en/tie-detail-top-1153518002.html", images: [{ url: "/products/spring/clothes/tie-detail-top-1.jpg", isPrimary: true }, { url: "/products/spring/clothes/tie-detail-top-2.jpg" }, { url: "/products/spring/clothes/tie-detail-top-3.jpg" }, { url: "/products/spring/clothes/tie-detail-top-4.jpg" }, { url: "/products/spring/clothes/tie-detail-top-5.jpg" }] },
];

