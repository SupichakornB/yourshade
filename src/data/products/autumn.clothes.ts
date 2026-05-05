import type { Product } from "@/types/product";
import type { ClothesColor } from "./clothes.types";
export type { ClothesColor };




// ─── 🎨 สีสำหรับ TryOn ───────────────────────────────────────────────────────
export const AUTUMN_CLOTHES_COLORS: ClothesColor[] = [
{ id: "c-aut-01", name: "Camel",        colorHex: "#c19a6b" },
{ id: "c-aut-02", name: "Rust",         colorHex: "#b7410e" },
{ id: "c-aut-03", name: "Olive green",  colorHex: "#6b7c45" },
{ id: "c-aut-04", name: "Burnt orange", colorHex: "#cc5500" },
{ id: "c-aut-05", name: "Warm brown",   colorHex: "#7b4f2e" },
{ id: "c-aut-06", name: "Mustard",      colorHex: "#e1a020" },
{ id: "c-aut-07", name: "Forest green", colorHex: "#4a6741" },
{ id: "c-aut-08", name: "Terracotta",   colorHex: "#c0714f" },
{ id: "c-aut-09", name: "Dark teal",    colorHex: "#2d6e6e" },
{ id: "c-aut-10", name: "Chocolate",    colorHex: "#5c3a1e" },
{ id: "c-aut-11", name: "Burgundy",     colorHex: "#800020" },
{ id: "c-aut-12", name: "Warm cream",   colorHex: "#f5e6c8" },
];




// ─── 👗 สินค้าจริง (แสดงในหน้า Product) ─────────────────────────────────────
export const AUTUMN_CLOTHES: Product[] = [
{ id: "48", name: "Cable-knit jumper",                                          brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/cable-knit-jumper-1101022001.html", images: [{ url: "/products/autumn/clothes/cable-knit-jumper-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/cable-knit-jumper-2.webp" }] },
{ id: "49", name: "Collared cardigan Cream",                                    brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/collared-cardigan-1297892012.html", images: [{ url: "/products/autumn/clothes/collared-cardigan-cream-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/collared-cardigan-cream-2.webp" }] },
{ id: "50", name: "Collared cardigan Dark brown",                               brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/collared-cardigan-1297892010.html", images: [{ url: "/products/autumn/clothes/collared-cardigan-dark-brown-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/collared-cardigan-dark-brown-2.webp" }] },
{ id: "51", name: "Corduroy Overshirt",                                         brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/corduroy-overshirt-1173993001.html", images: [{ url: "/products/autumn/clothes/corduroy-overshirt-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/corduroy-overshirt-2.webp" }, { url: "/products/autumn/clothes/corduroy-overshirt-3.webp" }, { url: "/products/autumn/clothes/corduroy-overshirt-4.webp" }] },
{ id: "52", name: "Crinkled blouse",                                            brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/crinkled-blouse-1214992002.html", images: [{ url: "/products/autumn/clothes/crinkled-blouse-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/crinkled-blouse-2.webp" }, { url: "/products/autumn/clothes/crinkled-blouse-3.webp" }, { url: "/products/autumn/clothes/crinkled-blouse-4.webp" }] },
{ id: "53", name: "Lace-inset peplum blouse Brown",                            brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/lace-inset-peplum-blouse-1290571002.html", images: [{ url: "/products/autumn/clothes/lace-inset-peplum-blouse-brown-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-brown-2.webp" }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-brown-3.webp" }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-brown-4.webp" }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-brown-5.webp" }] },
{ id: "54", name: "Lace-inset peplum blouse Cream",                            brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/lace-inset-peplum-blouse-1290571001.html", images: [{ url: "/products/autumn/clothes/lace-inset-peplum-blouse-cream-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-cream-2.webp" }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-cream-3.webp" }] },
{ id: "55", name: "Lace-inset peplum blouse Light beige:Floral",               brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/lace-inset-peplum-blouse-1290571004.html", images: [{ url: "/products/autumn/clothes/lace-inset-peplum-blouse-light-beige-floral-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-light-beige-floral-2.webp" }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-light-beige-floral-3.webp" }, { url: "/products/autumn/clothes/lace-inset-peplum-blouse-light-beige-floral-4.webp" }] },
{ id: "56", name: "Regular Fit Patterned resort shirt Dark green/Floral",      brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/regular-fit-patterned-resort-shirt-1315962002.html", images: [{ url: "/products/autumn/clothes/regular-fit-patterned-resort-shirt-dark-green-floral-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/regular-fit-patterned-resort-shirt-dark-green-floral-2.webp" }] },
{ id: "57", name: "Regular Fit Patterned resort shirt Light beige/Floral",     brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/regular-fit-patterned-resort-shirt-1315962001.html", images: [{ url: "/products/autumn/clothes/regular-fit-patterned-resort-shirt-light-beige-floral-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/regular-fit-patterned-resort-shirt-light-beige-floral-2.webp" }] },
{ id: "58", name: "Relaxed Fit Resort shirt",                                  brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/relaxed-fit-resort-shirt-1315746001.html", images: [{ url: "/products/autumn/clothes/relaxed-fit-resort-shirt-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/relaxed-fit-resort-shirt-2.webp" }] },
{ id: "59", name: "Teddy jacket Dusty beige",                                  brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/teddy-jacket-1308700006.html", images: [{ url: "/products/autumn/clothes/teddy-jacket-dusty-beige-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/teddy-jacket-dusty-beige-2.webp" }] },
{ id: "60", name: "Teddy jacket Light beige",                                  brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/teddy-jacket-1314521001.html", images: [{ url: "/products/autumn/clothes/teddy-jacket-light-beige-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/teddy-jacket-light-beige-2.webp" }, { url: "/products/autumn/clothes/teddy-jacket-light-beige-3.webp" }, { url: "/products/autumn/clothes/teddy-jacket-light-beige-4.webp" }] },
{ id: "61", name: "Textured-knit collared top",                                brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/2-piece-textured-knit-set-1317536001.html", images: [{ url: "/products/autumn/clothes/textured-knit-collared-top-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/textured-knit-collared-top-2.webp" }, { url: "/products/autumn/clothes/textured-knit-collared-top-3.webp" }, { url: "/products/autumn/clothes/textured-knit-collared-top-4.webp" }, { url: "/products/autumn/clothes/textured-knit-collared-top-5.webp" }] },
{ id: "62", name: "Tie-detail top",                                            brand: "H&M", type: "clothes", choice: false, season: "autumn", buttonlink: "https://th.hm.com/th_en/tie-detail-top-1153518002.html", images: [{ url: "/products/autumn/clothes/tie-detail-top-1.webp", isPrimary: true }, { url: "/products/autumn/clothes/tie-detail-top-2.webp" }, { url: "/products/autumn/clothes/tie-detail-top-3.webp" }, { url: "/products/autumn/clothes/tie-detail-top-4.webp" }] },
];





