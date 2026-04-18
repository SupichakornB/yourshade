import { Link, useNavigate, useParams } from "react-router-dom";
import { PRODUCTS } from "@/data/products";
import logo from "@/assets/full-logo.png";
import backIcon from "@/assets/icon/ep_back.svg";
import ProductImageSlider from "@/components/ProductImageSlider";
import { useEffect, useMemo, useState } from "react";

const ProductDetailPage = () => {
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const product = PRODUCTS.find((p) => p.id === productId);

  const colorImages = useMemo(() => {
    return product?.images.filter((img) => img.colorHex);
  }, [product]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const images = product?.images ?? [];

  const primaryIndex = useMemo(() => {
    const found = images.findIndex((img) => img.isPrimary);
    return found >= 0 ? found : 0;
  }, [images]);

  const [selectedIndex, setSelectedIndex] = useState(primaryIndex);
  const selectedImage = product?.images?.[selectedIndex];

  useEffect(() => {
    setSelectedIndex(primaryIndex);
  }, [primaryIndex]);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="pb-10">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-3">
          <div className="self-center p-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition">
          <img src={backIcon} alt="back" className="max-w-9 cursor-pointer" />
        </button>
          </div>
          <Link to="/">
            <div className="py-4 flex justify-center">
              <img src={logo} alt="logo" className="w-40 h-7 md:w-60 md:h-13" />
            </div>
          </Link>
        </div>
        <div className="w-full flex justify-center pt-8 px-4 md:px-6">
          <div className="w-full max-w-147.5">
            <ProductImageSlider
              images={product.images}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            />

            <div className="mt-6 text-[16px] xl:text-[24px] 2xl:text-[32px] font-semibold">

              <p className="text-gray-500">
  Color : {product.choice && selectedImage?.color &&(
    <span className="text-[#8E1616]">
      {selectedImage.color}
    </span>
  )}
</p>

            </div>
            {product.choice && (
              <div className="flex gap-6 mt-2">
                {colorImages && colorImages?.length > 0 && (
                  <div className="flex gap-4 mt-3">
                    {colorImages.map((img) => {
                      const isActive =
                        product.images[selectedIndex]?.url === img.url;

                      return (
                        <button
                          key={img.url}
                          onClick={() => {
                            const index = product.images.findIndex(
                              (image) => image.url === img.url,
                            );
                            if (index !== -1) setSelectedIndex(index);
                          }}
                          className={`h-6 w-6 rounded-full border-2 transition cursor-pointer ${isActive ? "border-[#8E1616] scale-110" : "border-[#FAFAFA]"}`}
                          style={{ backgroundColor: img.colorHex }}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
            <div className="my-6 text-[16px] xl:text-[24px] 2xl:text-[32px] font-semibold">
              {product.name}
            </div>
            <div className="text-[16px] xl:text-[24px] 2xl:text-[32px] font-semibold">
              Brand: {product.brand}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;