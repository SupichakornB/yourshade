import type { Product } from "@/types/product";
import type { ClothesColor } from "./clothes.types";
export type { ClothesColor };




// ─── 🎨 สีสำหรับ TryOn ───────────────────────────────────────────────────────
export const SUMMER_CLOTHES_COLORS: ClothesColor[] = [
{ id: "c-sum-01", name: "Soft white",  colorHex: "#f5f0eb" },
{ id: "c-sum-02", name: "Powder blue", colorHex: "#b8cfe0" },
{ id: "c-sum-03", name: "Dusty rose",  colorHex: "#d4a5a5" },
{ id: "c-sum-04", name: "Lavender",    colorHex: "#c5b8d4" },
{ id: "c-sum-05", name: "Sky blue",    colorHex: "#8ab4cc" },
{ id: "c-sum-06", name: "Sage green",  colorHex: "#a8b8a0" },
{ id: "c-sum-07", name: "Lilac mist",  colorHex: "#c4b0d0" },
{ id: "c-sum-08", name: "Blush pink",  colorHex: "#e8c4c4" },
{ id: "c-sum-09", name: "Cool gray",   colorHex: "#b0b4bc" },
{ id: "c-sum-10", name: "Ice blue",    colorHex: "#d0e4ee" },
{ id: "c-sum-11", name: "Mauve",       colorHex: "#b89898" },
{ id: "c-sum-12", name: "Periwinkle",  colorHex: "#9090c0" },
];




// ─── 👗 สินค้าจริง (แสดงในหน้า Product) ─────────────────────────────────────
export const SUMMER_CLOTHES: Product[] = [
{ id: "94",  name: "Broderie anglaise blouse",          brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/broderie-anglaise-blouse-1262638001.html", images: [{ url: "/products/summer/clothes/broderie-anglaise-blouse-1.webp", isPrimary: true }, { url: "/products/summer/clothes/broderie-anglaise-blouse-2.webp" }, { url: "/products/summer/clothes/broderie-anglaise-blouse-3.webp" }, { url: "/products/summer/clothes/broderie-anglaise-blouse-4.webp" }, { url: "/products/summer/clothes/broderie-anglaise-blouse-5.webp" }] },
{ id: "95",  name: "Collared cardigan",                 brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/collared-cardigan-1280770001.html", images: [{ url: "/products/summer/clothes/collared-cardigan-1.webp", isPrimary: true }, { url: "/products/summer/clothes/collared-cardigan-2.webp" }] },
{ id: "96",  name: "Corduroy Overshirt",                brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/corduroy-overshirt-1309685002.html", images: [{ url: "/products/summer/clothes/corduroy-overshirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/corduroy-overshirt-2.webp" }] },
{ id: "97",  name: "Puff-sleeved poplin dress",                   brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/puff-sleeved-poplin-dress-1325635002.html", images: [{ url: "/products/summer/clothes/puff-sleeved-poplin-dress-1.webp", isPrimary: true }, { url: "/products/summer/clothes/puff-sleeved-poplin-dress-2.webp" }, { url: "/products/summer/clothes/puff-sleeved-poplin-dress-3.webp" }, { url: "/products/summer/clothes/puff-sleeved-poplin-dress-4.webp" }] },
{ id: "98",  name: "Lace-inset peplum blouse Light beige:Floral", brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/lace-inset-peplum-blouse-1290571004.html", images: [{ url: "/products/summer/clothes/lace-inset-peplum-blouse-light-beige-floral-1.webp", isPrimary: true }, { url: "/products/summer/clothes/lace-inset-peplum-blouse-light-beige-floral-2.webp" }, { url: "/products/summer/clothes/lace-inset-peplum-blouse-light-beige-floral-3.webp" }, { url: "/products/summer/clothes/lace-inset-peplum-blouse-light-beige-floral-4.webp" }] },
{ id: "99",  name: "Loose Fit Utility Oxford shirt",    brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/loose-fit-utility-oxford-shirt-1307965001.html", images: [{ url: "/products/summer/clothes/loose-fit-utility-oxford-shirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/loose-fit-utility-oxford-shirt-2.webp" }] },
{ id: "100", name: "Poplin shirt Blue/White Striped",   brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/poplin-shirt-1270878006.html", images: [{ url: "/products/summer/clothes/poplin-shirt-blue-white-striped-1.webp", isPrimary: true }, { url: "/products/summer/clothes/poplin-shirt-blue-white-striped-2.webp" }, { url: "/products/summer/clothes/poplin-shirt-blue-white-striped-3.webp" }, { url: "/products/summer/clothes/poplin-shirt-blue-white-striped-4.webp" }] },
{ id: "101", name: "Poplin shirt Dusty blue/Striped",   brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/poplin-shirt-1270878005.html", images: [{ url: "/products/summer/clothes/poplin-shirt-dusty-blue-striped-1.webp", isPrimary: true }, { url: "/products/summer/clothes/poplin-shirt-dusty-blue-striped-2.webp" }, { url: "/products/summer/clothes/poplin-shirt-dusty-blue-striped-3.webp" }, { url: "/products/summer/clothes/poplin-shirt-dusty-blue-striped-4.webp" }, { url: "/products/summer/clothes/poplin-shirt-dusty-blue-striped-5.webp" }] },
{ id: "102", name: "Regular Fit Oxford shirt",          brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/regular-fit-oxford-shirt-1013956010.html", images: [{ url: "/products/summer/clothes/regular-fit-oxford-shirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/regular-fit-oxford-shirt-2.webp" }] },
{ id: "103", name: "Relaxed Fit Resort shirt",          brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/relaxed-fit-resort-shirt-1315746001.html", images: [{ url: "/products/summer/clothes/relaxed-fit-resort-shirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/relaxed-fit-resort-shirt-2.webp" }] },
{ id: "104", name: "Relaxed Fit Twill overshirt",       brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/relaxed-fit-twill-overshirt-1297572001.html", images: [{ url: "/products/summer/clothes/relaxed-fit-twill-overshirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/relaxed-fit-twill-overshirt-2.webp" }, { url: "/products/summer/clothes/relaxed-fit-twill-overshirt-3.webp" }] },
{ id: "105", name: "Slim Fit Polo shirt Blue",          brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/slim-fit-polo-shirt-0956343102.html", images: [{ url: "/products/summer/clothes/slim-fit-polo-shirt-blue-1.webp", isPrimary: true }, { url: "/products/summer/clothes/slim-fit-polo-shirt-blue-2.webp" }, { url: "/products/summer/clothes/slim-fit-polo-shirt-blue-3.webp" }] },
{ id: "106", name: "Slim Fit Textured jersey polo shirt", brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/slim-fit-textured-jersey-polo-shirt-1241753002.html", images: [{ url: "/products/summer/clothes/slim-fit-textured-jersey-polo-shirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/slim-fit-textured-jersey-polo-shirt-2.webp" }] },
{ id: "107", name: "Tie-detail top",                    brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/tie-detail-top-1299848002.html", images: [{ url: "/products/summer/clothes/tie-detail-top-1.webp", isPrimary: true }, { url: "/products/summer/clothes/tie-detail-top-2.webp" }, { url: "/products/summer/clothes/tie-detail-top-3.webp" }, { url: "/products/summer/clothes/tie-detail-top-4.webp" }] },
{ id: "108", name: "Tie-front poplin shirt",            brand: "H&M", type: "clothes", choice: false, season: "summer", buttonlink: "https://th.hm.com/th_en/tie-front-poplin-shirt-1327619001.html", images: [{ url: "/products/summer/clothes/tie-front-poplin-shirt-1.webp", isPrimary: true }, { url: "/products/summer/clothes/tie-front-poplin-shirt-2.webp" }, { url: "/products/summer/clothes/tie-front-poplin-shirt-3.webp" }, { url: "/products/summer/clothes/tie-front-poplin-shirt-4.webp" }] },
];





