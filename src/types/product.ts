export const SEASONS = ["summer", "spring", "autumn", "winter"] as const;

export const PRODUCT_TYPES = ["makeup", "accessories", "clothes"] as const;

export type Season = (typeof SEASONS)[number];

export type ProductType = (typeof PRODUCT_TYPES)[number];

type Finish = "matte" | "gloss" | "shimmer" | "blush" | "liner" | "glitter" ;  // ← เพิ่ม blush

export type ProductImage = {
  url: string;
  alt?: string;
  isPrimary?: boolean;
  color?: string;
  colorHex?: string;
  finish?: Finish; 
};

export type Product = {
  id: string;
  name: string;
  brand: string;
  type: ProductType;
  choice: boolean;
  season: Season;
  images: ProductImage[];
  buttonlink: string;
};

export const SEASON_LABEL: Record<Season, string> = {
  summer: "Summer",
  spring: "Spring",
  autumn: "Autumn",
  winter: "Winter",
};

export const PRODUCT_TYPE_LABEL: Record<ProductType, string> = {
  clothes: "Clothes",
  makeup: "Makeup",
  accessories: "Accessories",
};
