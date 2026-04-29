import type { Product } from "@/types/product";
import type { ClothesColor } from "./clothes.types";
export type { ClothesColor };




// ─── 🎨 สีสำหรับ TryOn ───────────────────────────────────────────────────────
export const WINTER_CLOTHES_COLORS: ClothesColor[] = [
{ id: "c-win-01", name: "Pure White",  colorHex: "#f8f8f8" },
{ id: "c-win-02", name: "Icy Blue",    colorHex: "#cce0f0" },
{ id: "c-win-03", name: "True Black",  colorHex: "#1a1a1a" },
{ id: "c-win-04", name: "Royal Blue",  colorHex: "#2a52be" },
{ id: "c-win-05", name: "Emerald",     colorHex: "#2e8b57" },
{ id: "c-win-06", name: "Fuchsia",     colorHex: "#c0207c" },
{ id: "c-win-07", name: "Deep Purple", colorHex: "#4b0082" },
{ id: "c-win-08", name: "Crimson",     colorHex: "#b30000" },
{ id: "c-win-09", name: "Charcoal",    colorHex: "#3c3c3c" },
{ id: "c-win-10", name: "Navy",        colorHex: "#1a2a5e" },
{ id: "c-win-11", name: "Silver Gray", colorHex: "#a8a8b0" },
{ id: "c-win-12", name: "Cobalt",      colorHex: "#0047ab" },
];




// ─── 👗 สินค้าจริง (แสดงในหน้า Product) ─────────────────────────────────────
export const WINTER_CLOTHES: Product[] = [
{ id: "173", name: "Broderie anglaise blouse",          brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/broderie-anglaise-blouse-1244171001.html", images: [{ url: "/products/winter/clothes/broderie-anglaise-blouse-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/broderie-anglaise-blouse-2.jpg" }, { url: "/products/winter/clothes/broderie-anglaise-blouse-3.jpg" }, { url: "/products/winter/clothes/broderie-anglaise-blouse-4.jpg" }] },
{ id: "134", name: "Cable-knit jumper",                 brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/cable-knit-jumper-1288743004.html", images: [{ url: "/products/winter/clothes/cable-knit-jumper-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/cable-knit-jumper-2.jpg" }] },
{ id: "135", name: "Loose Fit Utility Oxford shirt",    brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/loose-fit-utility-oxford-shirt-1307965001.html", images: [{ url: "/products/winter/clothes/loose-fit-utility-oxford-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/loose-fit-utility-oxford-shirt-2.jpg" }] },
{ id: "136", name: "Peplum top Black",                  brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/peplum-top-1328257002.html", images: [{ url: "/products/winter/clothes/peplum-top-black-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/peplum-top-black-2.jpg" }] },
{ id: "137", name: "Peplum top Red",                    brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/peplum-top-1328257002.html", images: [{ url: "/products/winter/clothes/peplum-top-red-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/peplum-top-red-2.jpg" }] },
{ id: "138", name: "Poplin shirt Blue",                 brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/poplin-shirt-1270878007.html", images: [{ url: "/products/winter/clothes/poplin-shirt-blue-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/poplin-shirt-blue-2.jpg" }, { url: "/products/winter/clothes/poplin-shirt-blue-3.jpg" }, { url: "/products/winter/clothes/poplin-shirt-blue-4.jpg" }] },
{ id: "139", name: "Poplin shirt Navy Blue/Striped",    brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/catalogsearch/result/?q=Poplin+shirt", images: [{ url: "/products/winter/clothes/poplin-shirt-navy-blue-striped-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/poplin-shirt-navy-blue-striped-2.jpg" }, { url: "/products/winter/clothes/poplin-shirt-navy-blue-striped-3.jpg" }, { url: "/products/winter/clothes/poplin-shirt-navy-blue-striped-4.jpg" }] },
{ id: "140", name: "Regular Fit Easy-iron shirt",       brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/regular-fit-easy-iron-shirt-0977237001.html", images: [{ url: "/products/winter/clothes/regular-fit-easy-iron-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/regular-fit-easy-iron-shirt-2.jpg" }, { url: "/products/winter/clothes/regular-fit-easy-iron-shirt-3.jpg" }] },
{ id: "141", name: "Regular Fit Oxford shirt",          brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/regular-fit-oxford-shirt-1013956010.html", images: [{ url: "/products/winter/clothes/regular-fit-oxford-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/regular-fit-oxford-shirt-2.jpg" }, { url: "/products/winter/clothes/regular-fit-oxford-shirt-3.jpg" }, { url: "/products/winter/clothes/regular-fit-oxford-shirt-4.jpg" }] },
{ id: "142", name: "Relaxed Fit Twill overshirt",       brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/relaxed-fit-twill-overshirt-1297572005.html", images: [{ url: "/products/winter/clothes/relaxed-fit-twill-overshirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/relaxed-fit-twill-overshirt-2.jpg" }] },
{ id: "143", name: "Slim Fit Easy-iron shirt",          brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/slim-fit-easy-iron-shirt-1242812006.html", images: [{ url: "/products/winter/clothes/slim-fit-easy-iron-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/slim-fit-easy-iron-shirt-2.jpg" }, { url: "/products/winter/clothes/slim-fit-easy-iron-shirt-3.jpg" }, { url: "/products/winter/clothes/slim-fit-easy-iron-shirt-4.jpg" }] },
{ id: "144", name: "Slim Fit Polo shirt Navy Blue",     brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/slim-fit-polo-shirt-1247834007.html", images: [{ url: "/products/winter/clothes/slim-fit-polo-shirt-navy-blue-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/slim-fit-polo-shirt-navy-blue-2.jpg" }, { url: "/products/winter/clothes/slim-fit-polo-shirt-navy-blue-3.jpg" }] },
{ id: "145", name: "Slim Fit Shirt",                    brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/slim-fit-shirt-0841808013.html", images: [{ url: "/products/winter/clothes/slim-fit-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/slim-fit-shirt-2.jpg" }] },
{ id: "146", name: "Slim Fit Textured jersey polo shirt", brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/slim-fit-textured-jersey-polo-shirt-1241753002.html", images: [{ url: "/products/winter/clothes/slim-fit-textured-jersey-polo-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/slim-fit-textured-jersey-polo-shirt-2.jpg" }] },
{ id: "147", name: "Tie-front poplin shirt",            brand: "H&M", type: "clothes", choice: false, season: "winter", buttonlink: "https://th.hm.com/th_en/tie-front-poplin-shirt-1327619002.html", images: [{ url: "/products/winter/clothes/tie-front-poplin-shirt-1.jpg", isPrimary: true }, { url: "/products/winter/clothes/tie-front-poplin-shirt-2.jpg" }, { url: "/products/winter/clothes/tie-front-poplin-shirt-3.jpg" }, { url: "/products/winter/clothes/tie-front-poplin-shirt-4.jpg" }, { url: "/products/winter/clothes/tie-front-poplin-shirt-5.jpg" }] },
];





