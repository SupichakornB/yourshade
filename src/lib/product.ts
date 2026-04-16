import type { Product } from "@/types/product";

export const getPrimaryImage = (product: Product) => {
  return (
    product.images.find(img => img.isPrimary) ??
    product.images[0]
  );
};