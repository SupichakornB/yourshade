// import { useState } from "react";
import type { ProductImage } from "@/types/product";
import arrowLeft from "@/assets/product/product-arrow-left.png";
import arrowRight from "@/assets/product/product-arrow-right.png";

type Props = {
  images: ProductImage[];
  selectedIndex: number;
  onChange: (index: number) => void;
};

const ProductImageSlider = ({ images, selectedIndex, onChange }: Props) => {
  const next = () => {
    onChange((selectedIndex + 1) % images.length);
  };

  const prev = () => {
    onChange((selectedIndex - 1 + images.length) % images.length);
  };

  if (!images.length) return null;

  return (
    <div className="relative w-full max-w-147.5 aspect-square overflow-hidden rounded-xl">
      <img
        src={images[selectedIndex].url}
        alt="product"
        className="w-full h-full object-cover object-center"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <img src={arrowLeft} alt="arrowLeft" />
          </button>

          <button
            onClick={next}
            className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center cursor-pointer"
          >
            <img src={arrowRight} alt="arrowRight" />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductImageSlider;
