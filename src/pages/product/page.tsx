import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { PRODUCT_TYPES, type ProductType, type Season } from "@/types/product";
import { PRODUCTS } from "@/data/products";
import logo from "@/assets/full-logo.png";
import backIcon from "@/assets/icon/ep_back.svg";
import { FiGrid, FiList } from 'react-icons/fi';

import springBanner from "@/assets/product/product-spring-banner.png";
import summerBanner from "@/assets/product/product-summer-banner.png";
import autumnBanner from "@/assets/product/product-autumn-banner.png";
import winterBanner from "@/assets/product/product-winter-banner.png";

import springBannerMb from "@/assets/product/product-spring-banner-mobile.png";
import summerBannerMb from "@/assets/product/product-summer-banner-mobile.png";
import autumnBannerMb from "@/assets/product/product-autumn-banner-mobile.png";
import winterBannerMb from "@/assets/product/product-winter-banner-mobile.png";

import { motion } from "framer-motion";
import { capitalizeFirst } from "@/lib/string";
import { getPrimaryImage } from "@/lib/product";
import { useSearchParams } from "react-router-dom";
import { useAnalyze } from "@/context/useAnalyze";

const ProductPage = () => {
  const navigate = useNavigate();
  useAnalyze();
  const [searchParams, setSearchParams] = useSearchParams();
  const { resultData } = useParams();

  const season = resultData?.toLowerCase() as Season;
  const activeTab = (searchParams.get("tab") as ProductType) || "clothes";
  const setActiveTab = (tab: ProductType) => {
    setSearchParams({ tab });
  };

  const products = useMemo(() => {
    return PRODUCTS.filter((p) => p.season === season && p.type === activeTab);
  }, [season, activeTab]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // เลือก Banner images ตาม season
  const getDesktopBanner = () => {
    switch (season) {
      case "summer":
        return summerBanner;
      case "autumn":
        return autumnBanner;
      case "winter":
        return winterBanner;
      case "spring":
      default:
        return springBanner;
    }
  };

  const getMobileBanner = () => {
    switch (season) {
      case "summer":
        return summerBannerMb;
      case "autumn":
        return autumnBannerMb;
      case "winter":
        return winterBannerMb;
      case "spring":
      default:
        return springBannerMb;
    }
  };

  const [viewMode, setViewMode] = useState<'grid-1' | 'grid-2'>('grid-2');
  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'grid-2' ? 'grid-1' : 'grid-2'));
  };

  return (
    <div className="pb-10">
      <div className="w-full mx-auto">
        {/* Header */}
        <div className="grid grid-cols-3">
          <div className="self-center p-3">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-200 transition">
          <img src={backIcon} alt="back" className="max-w-9 cursor-pointer" />
        </button>
          </div>
          <Link to="/">
            <div className="flex justify-center py-4">
              <img src={logo} alt="logo" className="w-40 h-7 md:w-60 md:h-13" />
            </div>
          </Link>
        </div>

        {/* Banner สำหรับ Desktop และ Mobile โดยใช้ Tailwind responsive classes */}
        <div className="relative w-full">
          {/* สำหรับ Desktop: ซ่อนใน mobile */}
          <img
            src={getDesktopBanner()}
            alt="result"
            className="w-full h-auto hidden md:block"
          />
          {/* สำหรับ Mobile: ซ่อนใน desktop */}
          <img
            src={getMobileBanner()}
            alt="result"
            className="w-full h-auto md:hidden"
          />



<div className="absolute left-8 md:left-52 top-[50%] -translate-y-1/2">
            <div className="text-[16px] xl:text-[36px] 2xl:text-[56px] text-center">
              Try your perfect <br />
              shades in real time
            </div>

            <div
              onClick={() => navigate("/tryon", { state: { season } })}
              className="inline-flex items-center justify-center bg-[#8E1616] text-[16px] xl:text-[24px] 2xl:text-[32px] mt-4 text-white rounded-full px-6 py-2 md:px-10 md:py-4 shadow-lg shadow-[#8E1616]/20 hover:scale-105 transition cursor-pointer"
            >
              Virtual Try-On
            </div>




          </div>
        </div>

        
        {/* ตัวเลือก Tab */}
        <div className="flex justify-center mt-10">
          <div className="flex gap-6 md:gap-20">
            {PRODUCT_TYPES.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative pb-3 text-[20px] xl:text-[24px] 2xl:text-[28px] font-semibold transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "text-black"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {capitalizeFirst(tab)}
                {activeTab === tab && (
                  <motion.div
                    layoutId="underline"
                    className="absolute bottom-0 left-0 right-0 h-0.75 rounded-full bg-[#8E1616]"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end px-10 md:px-30 mb-4 md:mb-10">
          {/* ปุ่มเดียวที่เปลี่ยนไอคอนและโหมด */}
          <button
            onClick={toggleViewMode}
            className="p-2 rounded-full border-2 border-gray-300 focus:outline-none xl:hidden 2xl:hidden"
            aria-label="Toggle View Mode"
          >
            {viewMode === 'grid-2' ? <FiGrid className="w-5 h-5" /> : <FiList className="w-5 h-5" />}
          </button>
        </div>

        {/* รายการสินค้า */}
        <div
          className={`grid gap-x-6 gap-y-14 px-10 md:px-30 ${
            viewMode === 'grid-1' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'
          }`}
        >
          {products.map((product, index) => (
            <Link
              key={product.id + index}
              to={`/products/${product.season}/${product.id}?tab=${activeTab}`}
            >
              <div className="grid gap-2 md:gap-6 mt-4 md:mt-1">
                <div className="w-full aspect-[384/346] overflow-hidden rounded-xl group">
                  <img
                    src={getPrimaryImage(product)?.url}
                    className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="text-center md:text-left text-[16px] xl:text-[24px] 2xl:text-[32px] px-4">
                  {product.name}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
export default ProductPage;