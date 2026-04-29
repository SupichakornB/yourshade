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
    setSelectedIndex(0);
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
          <div className="w-[382px] h-[382px] xl:w-[436px] xl:h-[436px] 2xl:w-[590px] 2xl:h-[590px] relative">
  <ProductImageSlider
    images={product.images}
    selectedIndex={selectedIndex}
    onChange={setSelectedIndex}
  />

  {product.images.length > 1 && (
    <div className="absolute bottom-3 left-0 right-0 flex justify-center items-center gap-2">
      {product.images.map((_, index) => (
        <button
          key={index}
          onClick={() => setSelectedIndex(index)}
          className={`rounded-full transition-all duration-300 cursor-pointer ${
            selectedIndex === index
              ? "w-5 h-[6px] bg-[#8E1616]"
              : "w-[6px] h-[6px] bg-gray-300 hover:bg-gray-400"
          }`}
        />
      ))}
    </div>
  )}

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
<div className="flex justify-center pt-4 2xl:pt-6">
{product.buttonlink && (
  
  <a href={product.buttonlink}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-[#8E1616] w-full py-3 font-normal text-[16px] xl:text-[24px] 2xl:text-[24px] text-white rounded-full shadow-lg shadow-[#8E1616]/20 hover:scale-105 transition-transform cursor-pointer whitespace-nowrap justify-center flex items-center"
  >
    Shop now
    <span className="pl-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 xl:w-6 xl:h-6 2xl:w-6 2xl:h-6"
      >
        <path d="M7 7h10v10"/>
        <path d="M7 17 17 7"/>
      </svg>
    </span>
  </a>
)}
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;