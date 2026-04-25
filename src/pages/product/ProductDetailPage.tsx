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
    <div>
      <div className="w-full mx-auto">
        <div className="grid grid-cols-3">
          <div className="self-center p-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition">
              <img src={backIcon} alt="back" className="max-w-9 cursor-pointer" />
            </button>
          </div>
          <Link to="/">
            <div className="py-4 xl:py-6 2xl:py-6 2xl:py-6 flex justify-center">
              <img src={logo} alt="logo" className="w-40 h-7 xl:w-60 xl:h-13 2xl:w-60 2xl:h-13" />
            </div>
          </Link>
        </div>
        <div className="w-full flex justify-center pb-4 xl:pb-6 2xl:pb-6 px-4 xl:px-6 2xl:px-6">
          <div className="w-[382px] h-[382px] xl:w-[510px] xl:h-[510px] 2xl:w-[590px] 2xl:h-[590px]">
            <ProductImageSlider
              images={product.images}
              selectedIndex={selectedIndex}
              onChange={setSelectedIndex}
            />

            <div className="mt-6">

{product.choice && (
  <p className="text-[14px] xl:text-[20px] 2xl:text-[24px] font-semibold">
    Color :{" "}
    {selectedImage?.color && (
      <span className="text-[#8E1616]">
        {selectedImage.color}
      </span>
    )}
  </p>
)}

            </div>
            {product.choice && (
              <div className="flex pb-4 xl:pb-6 2xl:pb-6 items-center">
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
            <div className=" text-[16px] xl:text-[24px] 2xl:text-[28px] font-semibold">
              {product.name}
            </div>
            <div className="text-[16px] xl:text-[24px] 2xl:text-[28px] font-semibold">
              Brand: {product.brand}
            </div>
        <div
          className="flex w-full justify-center"
          onClick={() => dispatch({ type: "SET_IMAGE", payload: null })}
        >
          <Link
            to="/upload"
            className="bg-[#8E1616] px-6 py-4 font-thin text-[20px] xl:text-[28px] 2xl:text-[36px] text-white rounded-full shadow-lg shadow-[#8E1616]/20bg-[#8E1616] font rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
          >
            Discover Your Personal Color →
          </Link>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;