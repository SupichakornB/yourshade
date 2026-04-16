import type { Product } from "@/types/product";
import type { ClothesColor } from "./products/clothes.types";

// 🌸 SPRING
import { SPRING_CLOTHES, SPRING_CLOTHES_COLORS } from "./products/spring.clothes";
import { SPRING_MAKEUP } from "./products/spring.makeup";
import { SPRING_ACCESSORISE } from "./products/spring.accessories";

// ☀️ SUMMER
import { SUMMER_CLOTHES, SUMMER_CLOTHES_COLORS } from "./products/summer.clothes";
import { SUMMER_MAKEUP } from "./products/summer.makeup";
import { SUMMER_ACCESSORISE } from "./products/summer.accessories";

// 🍂 AUTUMN
import { AUTUMN_CLOTHES, AUTUMN_CLOTHES_COLORS } from "./products/autumn.clothes";
import { AUTUMN_MAKEUP } from "./products/autumn.makeup";
import { AUTUMN_ACCESSORISE } from "./products/autumn.accessories";

// ❄️ WINTER
import { WINTER_CLOTHES, WINTER_CLOTHES_COLORS } from "./products/winter.clothes";
import { WINTER_MAKEUP } from "./products/winter.makeup";
import { WINTER_ACCESSORISE } from "./products/winter.accessories";


// 🧠 helper: แปลง ClothesColor → Product (ใช้ใน TryOn เท่านั้น)
function mapClothesToProduct(
  colors: ClothesColor[],
  season: "spring" | "summer" | "autumn" | "winter"
): Product[] {
  return colors.map((c) => ({
    id: `tryon-${c.id}`,
    name: c.name,
    brand: "Generic",
    type: "clothes" as const,
    choice: true,
    season,
    images: [{ colorHex: c.colorHex }],
  }));
}


// ✅ PRODUCT SETS — clothes ใช้สินค้าจริง, TryOn colors แยกไว้ใน TRYON_SETS
export const PRODUCT_SETS: Record<
  string,
  { clothes: Product[]; makeup: Product[]; accessories: Product[] }
> = {
  spring: {
    clothes: SPRING_CLOTHES,
    makeup: SPRING_MAKEUP,
    accessories: SPRING_ACCESSORISE,
  },
  summer: {
    clothes: SUMMER_CLOTHES,
    makeup: SUMMER_MAKEUP,
    accessories: SUMMER_ACCESSORISE,
  },
  autumn: {
    clothes: AUTUMN_CLOTHES,
    makeup: AUTUMN_MAKEUP,
    accessories: AUTUMN_ACCESSORISE,
  },
  winter: {
    clothes: WINTER_CLOTHES,
    makeup: WINTER_MAKEUP,
    accessories: WINTER_ACCESSORISE,
  },
};

// ✅ TRYON SETS — ใช้ใน TryOn page สำหรับ virtual try-on สีเสื้อผ้า
export const TRYON_SETS: Record<
  string,
  { clothes: Product[]; makeup: Product[]; accessories: Product[] }
> = {
  spring: {
    clothes: mapClothesToProduct(SPRING_CLOTHES_COLORS, "spring"),
    makeup: SPRING_MAKEUP,
    accessories: SPRING_ACCESSORISE,
  },
  summer: {
    clothes: mapClothesToProduct(SUMMER_CLOTHES_COLORS, "summer"),
    makeup: SUMMER_MAKEUP,
    accessories: SUMMER_ACCESSORISE,
  },
  autumn: {
    clothes: mapClothesToProduct(AUTUMN_CLOTHES_COLORS, "autumn"),
    makeup: AUTUMN_MAKEUP,
    accessories: AUTUMN_ACCESSORISE,
  },
  winter: {
    clothes: mapClothesToProduct(WINTER_CLOTHES_COLORS, "winter"),
    makeup: WINTER_MAKEUP,
    accessories: WINTER_ACCESSORISE,
  },
};


// ✅ flat list สำหรับหน้า Product (สินค้าจริงทั้งหมด)
export const PRODUCTS: Product[] = [
  ...PRODUCT_SETS.spring.clothes,
  ...PRODUCT_SETS.spring.makeup,
  ...PRODUCT_SETS.spring.accessories,

  ...PRODUCT_SETS.summer.clothes,
  ...PRODUCT_SETS.summer.makeup,
  ...PRODUCT_SETS.summer.accessories,

  ...PRODUCT_SETS.autumn.clothes,
  ...PRODUCT_SETS.autumn.makeup,
  ...PRODUCT_SETS.autumn.accessories,

  ...PRODUCT_SETS.winter.clothes,
  ...PRODUCT_SETS.winter.makeup,
  ...PRODUCT_SETS.winter.accessories,
];