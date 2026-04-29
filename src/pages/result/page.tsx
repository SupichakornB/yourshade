"use client";

import { useAnalyze } from "@/context/useAnalyze";
import { useEffect, useState } from "react";

import StartNewAnalysis from '@/components/StartNewAnalysis'
import backIcon from "@/assets/icon/ep_back.svg";

import ScrollToTop from "@/components/ScrollToTop";

import summer from "@/assets/result/banner-summer.png";
import autumn from "@/assets/result/banner-autumn.png";
import winter from "@/assets/result/banner-winter.png";
import spring from "@/assets/result/banner-spring.png";
import summerMb from "@/assets/result/banner-summer-mobile.png";
import autumnMb from "@/assets/result/banner-autumn-mobile.png";
import winterMb from "@/assets/result/banner-winter-mobile.png";
import springMb from "@/assets/result/banner-spring-mobile.png";


import summerRecommended1 from "@/assets/result/summer-recommend-1.png";
import summerRecommended2 from "@/assets/result/summer-recommend-2.png";
import summerRecommended3 from "@/assets/result/summer-recommend-3.png";
import summerRecommended4 from "@/assets/result/summer-recommend-4.png";
import summerRecommended5 from "@/assets/result/summer-recommend-5.png";
import summerRecommended6 from "@/assets/result/summer-recommend-6.png";
import autumnRecommended1 from "@/assets/result/autumn-recommend-1.png";
import autumnRecommended2 from "@/assets/result/autumn-recommend-2.png";
import autumnRecommended3 from "@/assets/result/autumn-recommend-3.png";
import autumnRecommended4 from "@/assets/result/autumn-recommend-4.png";
import autumnRecommended5 from "@/assets/result/autumn-recommend-5.png";
import autumnRecommended6 from "@/assets/result/autumn-recommend-6.png";
import winterRecommended1 from "@/assets/result/winter-recommend-1.png";
import winterRecommended2 from "@/assets/result/winter-recommend-2.png";
import winterRecommended3 from "@/assets/result/winter-recommend-3.png";
import winterRecommended4 from "@/assets/result/winter-recommend-4.png";
import winterRecommended5 from "@/assets/result/winter-recommend-5.png";
import winterRecommended6 from "@/assets/result/winter-recommend-6.png";
import springRecommended1 from "@/assets/result/spring-recommend-1.png";
import springRecommended2 from "@/assets/result/spring-recommend-2.png";
import springRecommended3 from "@/assets/result/spring-recommend-3.png";
import springRecommended4 from "@/assets/result/spring-recommend-4.png";
import springRecommended5 from "@/assets/result/spring-recommend-5.png";
import springRecommended6 from "@/assets/result/spring-recommend-6.png";

import springresultclothe from "@/assets/result/spring-result-clothe.png"
import summerresultclothe from "@/assets/result/summer-result-clothe.png"
import autumnresultclothe from "@/assets/result/autumn-result-clothe.png"
import winterresultclothe from "@/assets/result/winter-result-clothe.png"

import summerLip1 from "@/assets/result/summer-lip-1.png";
import summerLip2 from "@/assets/result/summer-lip-2.png";
import summerLip3 from "@/assets/result/summer-lip-3.png";
import summerLip4 from "@/assets/result/summer-lip-4.png";
import summerLip5 from "@/assets/result/summer-lip-5.png";
import autumnLip1 from "@/assets/result/autumn-lip-1.png";
import autumnLip2 from "@/assets/result/autumn-lip-2.png";
import autumnLip3 from "@/assets/result/autumn-lip-3.png";
import autumnLip4 from "@/assets/result/autumn-lip-4.png";
import autumnLip5 from "@/assets/result/autumn-lip-5.png";
import winterLip1 from "@/assets/result/winter-lip-1.png";
import winterLip2 from "@/assets/result/winter-lip-2.png";
import winterLip3 from "@/assets/result/winter-lip-3.png";
import winterLip4 from "@/assets/result/winter-lip-4.png";
import winterLip5 from "@/assets/result/winter-lip-5.png";
import springLip1 from "@/assets/result/spring-lip-1.png";
import springLip2 from "@/assets/result/spring-lip-2.png";
import springLip3 from "@/assets/result/spring-lip-3.png";
import springLip4 from "@/assets/result/spring-lip-4.png";
import springLip5 from "@/assets/result/spring-lip-5.png";


import springmakeup from "@/assets/result/spring-result-makeup.png"
import wintermakeup from "@/assets/result/winter-result-makeup.png"
import summermakeup from "@/assets/result/summer-result-makeup.png"
import autumnmakeup from "@/assets/result/autumn-result-makeup.png"


import summerAccsessoriesMb from "@/assets/result/summer-accessories.png";
import springAccsessoriesMb from "@/assets/result/spring-accessories.png";
import autumnAccsessoriesMb from "@/assets/result/autumn-accessories.png";
import winterAccsessoriesMb from "@/assets/result/winter-accessories.png";

import summerAccsessories from "@/assets/result/accessories-summer.png";
import springAccsessories from "@/assets/result/accessories-spring.png";
import autumnAccsessories from "@/assets/result/accessories-autumn.png";
import winterAccsessories from "@/assets/result/accessories-winter.png";
import { Link, useNavigate } from "react-router-dom";
import { COLOR_SETS, isColorSetKey } from "@/types/colorSets";
import logo from "@/assets/logo.png";
import bannerShopping from "@/assets/result/banner-shopping.png";
import bannerShoppingMb from "@/assets/result/banner-shopping-mobile.png";
import springCareer from "@/assets/result/spring-fortune-career.png";

import springLove from "@/assets/result/spring-fortune-love.png";
import springWealth from "@/assets/result/spring-fortune-wealth.png";
import summerCareer from "@/assets/result/summer-fortune-career.png";
import summerLove from "@/assets/result/summer-fortune-love.png";
import summerWealth from "@/assets/result/summer-fortune-wealth.png";
import autumnCareer from "@/assets/result/autumn-fortune-career.png";
import autumnLove from "@/assets/result/autumn-fortune-love.png";
import autumnWealth from "@/assets/result/autumn-fortune-wealth.png";
import winterCareer from "@/assets/result/winter-fortune-career.png";
import winterLove from "@/assets/result/winter-fortune-love.png";
import winterWealth from "@/assets/result/winter-fortune-wealth.png";

import springresult from "@/assets/result/spring-result.png"
import summerresult from "@/assets/result/summer-result.png"
import autumnresult from "@/assets/result/autumn-result.png"
import winterresult from "@/assets/result/winter-result.png"


export default function ResultPage() {
const { state, dispatch } = useAnalyze();
  const navigate = useNavigate();

  const key = state.result?.toLowerCase();
  const data = key && isColorSetKey(key) ? COLOR_SETS[key] : undefined;

  const getPersonalDescription = () => {
    switch (state.result) {
      case "summer":
        return "Summer Type gives a soft, calm, and gentle impression with cool-toned skin and muted hair and eye colors. They suit dusty pink, powder blue, lavender, and milky white, while strong warm colors can dull their look. Overall, they appear refined and approachable.";
      case "spring":
        return "Spring types suit bright, clear, and lively colors, similar to the natural hues of the spring season. These colors convey a friendly, approachable, and cheerful impression.";
      case "autumn":
        return "Autumn types suit muted and relatively deep colors, similar to the natural hues of the fall season or earth tones. These colors convey a sense of seriousness, maturity, and reliability.";
      case "winter":
        return "Winter types suit colors that are both deep and vivid, similar to the natural hues of the winter season. These colors convey a sense of strength, confidence, and sharpness in both actions and speech.";
      default:
        return "";
    }
  };

  
  useEffect(() => {
    const id = setTimeout(() => {
      if (!state.result) navigate("/");
    }, 0);
    return () => clearTimeout(id);
  }, []); 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

const [showModal, setShowModal] = useState(false)

const handleConfirm = () => {
  setShowModal(false)
  dispatch({ type: "SET_IMAGE", payload: null })
  dispatch({ type: "SET_VEIN", payload: null })
  dispatch({ type: "SET_CONTRAST", payload: null })
  dispatch({ type: "SET_BRIGHTNESS", payload: null })
  dispatch({ type: "SET_SATURATION", payload: null })
  navigate('/upload')
}

const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const navigateToProduct = () => {
    navigate(`/product/${state?.result?.toLowerCase()}`);
  };

const hasValues = [state.vein, state.contrast, state.brightness, state.saturation].some(v => v)

const handleBack = () => {
  if (hasValues) {
    setShowModal(true)
  } else {
    navigate('/')
  }
}

  if (!data) return null;

  return (
    <div className="pb-10">
            <ScrollToTop />
      <div className="w-full mx-auto relative">
  <div className="relative w-full">
    {/* Mobile banner */}
    <img
      src={state.result == "summer" ? summerMb : state.result == "autumn" ? autumnMb : state.result == "winter" ? winterMb : springMb}
      alt="result"
      className="w-full h-auto rounded-lg block md:hidden"
    />
    {/* Desktop banner */}
    <img
      src={state.result == "summer" ? summer : state.result == "autumn" ? autumn : state.result == "winter" ? winter : spring}
      alt="result"
      className="w-full h-auto rounded-lg hidden md:block"
    />


  <div className="self-center p-3">
    <button
      onClick={handleBack}
      className="absolute top-6 left-4  p-2 rounded-full  hover:bg-white/60 transition"
    >
      <img src={backIcon} alt="back" className="w-9 h-9" />
    </button>
  </div>
    <Link to="/">
      <img
        src={logo}
        alt="logo"
        className="absolute top-4 xl:top-6 2xl:top-6 left-1/2 -translate-x-1/2 w-10 h-8 md:w-28 md:h-20 z-10"
      />
    </Link>
  </div>
</div>


{hasValues && (
  <div className="grid grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4 mx-auto xl:mx-32 2xl:mx-32 text-center gap-y-4 gap-x-4 pt-4 xl:pt-12 2xl:pt-12 px-6 pb-6">
    {[
      { label: "Undertone", value: state.vein },
      { label: "Contrast",  value: state.contrast },
      { label: "Brightness", value: state.brightness },
      { label: "Saturation", value: state.saturation },
    ].map(({ label, value }) => (
      <div
        key={label}
        className="w-full items-center font-normal rounded-[16px] xl:rounded-[24px] 2xl:rounded-[24px] bg-[#F4E8E8] p-4 xl:p-5 2xl:p-6 text-[14px] xl:text-[24px] 2xl:text-[24px] text-[#8E1616]"
      >
        <span>{label} : </span>
        <span className="font-semibold capitalize">{value ?? "—"}</span>
      </div>
    ))}
  </div>
)}


      <div className="mx-auto xl:mx-32 2xl:mx-32 text-center text-[14px] xl:text-[24px] 2xl:text-[32px] leading-relaxed px-6 pt-6 xl:py-6 2xl:py-6">
        {getPersonalDescription()}
      </div>


      <div className="mt-12 relative px-2 md:px-32">
      
  <div className="mt-12 mx-4 md:mx-0">

  {/* ======== MOBILE ======== */}
  <div
    className="flex md:hidden items-center rounded-2xl overflow-hidden px-4  pt-8  pb-4 "
    style={{
      backgroundImage: `url(${bannerShoppingMb})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="flex flex-col items-start gap-4 text-left max-w-[90%]">
      <p className="text-[20px] font text-[#1E2A38] leading-tight">
        Find products that match <br />
        your personal color
      </p>
      <button
        onClick={navigateToProduct}
        className="bg-[#8E1616] text-white text-[16px] font rounded-full px-6 py-3 shadow-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
      >
        Discover your matches
      </button>
    </div>
  </div>

  {/* ======== DESKTOP ======== */}
  <div
    className="hidden md:flex items-center justify-center rounded-3xl overflow-hidden px-8 py-16 max-w-[100%]"
    style={{
      backgroundImage: `url(${bannerShopping})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="xl:text-[36px] 2xl:text-[48px] font text-[#1E2A38] leading-tight">
        Find products that match <br />
        your personal color
      </p>
      <button
        onClick={navigateToProduct}
        className="bg-[#8E1616] text-white xl:text-[24px] 2xl:text-[32px] font rounded-full px-10 py-4 shadow-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
      >
        Discover your matches
      </button>
    </div>
  </div>

</div>
</div>

<div className="mt-12 bg-[url(@/assets/result/bg.png)] bg-center bg-no-repeat bg-cover min-h-95 xl:min-h-180 2xl:min-h-280 pt-6 pb-15 xl:pb-0 2xl:pt-6">
      <div className="px-2 md:px-32">
            <h3 className="text-[#8E1616] text-center font-semibold text-[24px] xl:text-[36px] 2xl:text-[48px] py-4 xl:py-6 2xl:py-6">
              Your Personal Color Guide
            </h3>

      <div className="grid xl:grid-cols-2 2xl:grid-cols-2 gap-6 xl:gap-10 2xl:gap-10 items-stretch">
        {/* Recommended colors */}
  <div className="grid justify-center order-2 xl:order-1 2xl:order-1">
    <div className="h-[420px] w-[360px] xl:h-[500px] xl:w-[500px] 2xl:h-[876px] 2xl:w-[876px] rounded-3xl bg-white p-4 xl:p-6 2xl:p-6">
           <h3 className="text-[#8E1616] font-semibold text-[16px] xl:text-[24px] 2xl:text-[32px] p-4 xl:px-6 2xl:p-6 order-2 xl:order-1 2xl:order-1">
              Recommended colors
            </h3>
            <div className="grid grid-cols-3 gap-6 xl:gap-3 2xl:gap-3 px-4 pb-6 xl:pb-3 2xl:pb-6 xl:px-6 2xl:px-3">
              {[1, 2, 3, 4, 5, 6].map((num) => {
                const map: Record<string, Record<number, string>> = {
                  summer: { 1: summerRecommended1, 2: summerRecommended2, 3: summerRecommended3, 4: summerRecommended4, 5: summerRecommended5, 6: summerRecommended6 },
                  autumn: { 1: autumnRecommended1, 2: autumnRecommended2, 3: autumnRecommended3, 4: autumnRecommended4, 5: autumnRecommended5, 6: autumnRecommended6 },
                  winter: { 1: winterRecommended1, 2: winterRecommended2, 3: winterRecommended3, 4: winterRecommended4, 5: winterRecommended5, 6: winterRecommended6 },
                  spring: { 1: springRecommended1, 2: springRecommended2, 3: springRecommended3, 4: springRecommended4, 5: springRecommended5, 6: springRecommended6 },
                };
                const season = state.result && state.result in map ? state.result : "spring";
                return (
                  <img
                    key={num}
                    src={map[season][num]}
                    alt={`recommended-${num}`}
                    className="w-full h-auto rounded-lg xl:px-3 2xl:px-9 xl:pb-3 2xl:py-3"
                  />
                );
              })}
            </div>
          <div className="px-4 xl:px-6 2xl:px-6">
            <hr className="text-[#8E1616] border-1 xl:border-2 2xl:border-3"/>
          </div>

            <h3 className="text-[#8E1616] font-semibold text-[16px] xl:text-[24px] 2xl:text-[32px] px-4 xl:px-6 2xl:px-6 py-4 xl:py-3 2xl:py-6">
              Avoid colors
            </h3>
    <div className="  grid grid-cols-5 px-6 xl:px-6 2xl:px-9 gap-4 xl:gap-6 2xl:gap-9">
  {data.avoidColor.map((hex, i) => (
    <div
      key={i}
      className="w-full aspect-square rounded-full"
      style={{ backgroundColor: hex }}
    />
  ))}
            </div>
          </div>
        </div>
        

        {/* clothe mood */}
  <div className="grid text-center justify-center order-1 xl:order-2 2xl:order-2">
                        <img
       src={
          state.result === "summer" ? summerresultclothe
          : state.result === "autumn" ? autumnresultclothe
          : state.result === "winter" ? winterresultclothe
          : springresultclothe
        }
              alt="Accessories"
              className="max-w-[360px] xl:max-w-[500px] 2xl:max-w-[876px] h-auto xl:h-[500px] 2xl:h-[876px] rounded-3xl "
            />
        </div>

      </div>
      </div>
</div>

<div className="px-4 xl:px-32 2xl:px-32 mt-11 py-4 xl:py-6 2xl:py-6 justify-center">
  <div className="text-center text-[24px] xl:text-[36px] 2xl:text-[48px] font-bold text-[#8E1616] pb-5 xl:pb-10 2xl:pb-10">
    Makeup
  </div>

  <div className="flex flex-col xl:grid xl:grid-cols-2 gap-6 xl:gap-10 2xl:gap-10 items-center xl:items-stretch">

    {/* รูป makeup */}
    <div className="mx-auto h-[360px] w-[360px] xl:h-[500px] xl:w-[500px] 2xl:h-[876px] 2xl:w-[876px] rounded-3xl bg-white object-cover">
      <img
        src={
          state.result === "summer" ? summermakeup
          : state.result === "autumn" ? autumnmakeup
          : state.result === "winter" ? wintermakeup
          : springmakeup
        }
        alt="Accessories"
        className="w-full h-full rounded-3xl object-cover"
      />
    </div>

    {/* Eyeshadow / Blush / Lip */}
    <div className="mx-auto w-[360px] xl:h-[500px] xl:w-[500px] 2xl:h-[876px] 2xl:w-[876px] xl:p-6 2xl:p-6">
      <h3 className="text-[#8E1616] font-semibold text-[16px] xl:text-[24px] 2xl:text-[32px] px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-9">
        Eyeshadow
      </h3>
      <div className="grid grid-cols-5 px-6 xl:px-6 2xl:px-9 gap-4 xl:gap-6 2xl:gap-9">
        {data.eyeshadowColor.map((hex, i) => (
          <div key={i} className="w-full aspect-square rounded-full" style={{ backgroundColor: hex }} />
        ))}
      </div>

      <h3 className="text-[#8E1616] font-semibold text-[16px] xl:text-[24px] 2xl:text-[32px] px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-9">
        Blush
      </h3>
      <div className="grid grid-cols-5 px-6 xl:px-6 2xl:px-9 gap-4 xl:gap-6 2xl:gap-9">
        {data.blushColor.map((hex, i) => (
          <div key={i} className="w-full aspect-square rounded-full" style={{ backgroundColor: hex }} />
        ))}
      </div>

      <h3 className="text-[#8E1616] font-semibold text-[16px] xl:text-[24px] 2xl:text-[32px] px-4 xl:px-6 2xl:px-6 py-4 xl:py-6 2xl:py-9">
        Lip color
      </h3>
      <div className="grid grid-cols-5 gap-6 xl:gap-3 2xl:gap-3 px-6 pb-6 xl:pb-3 2xl:pb-6 xl:px-6 2xl:px-3">
        {[1, 2, 3, 4, 5].map((num) => {
          const map: Record<string, Record<number, string>> = {
            summer: { 1: summerLip1, 2: summerLip2, 3: summerLip3, 4: summerLip4, 5: summerLip5 },
            autumn: { 1: autumnLip1, 2: autumnLip2, 3: autumnLip3, 4: autumnLip4, 5: autumnLip5 },
            winter: { 1: winterLip1, 2: winterLip2, 3: winterLip3, 4: winterLip4, 5: winterLip5 },
            spring: { 1: springLip1, 2: springLip2, 3: springLip3, 4: springLip4, 5: springLip5 },
          };
          const season = state.result && state.result in map ? state.result : "spring";
          return <img key={num} src={map[season][num]} alt={`lip-${num}`} className="w-full h-auto rounded-lg" />;
        })}
      </div>
    </div>

  </div>
</div>

      <div className="mx-4 md:mx-32 justify-center xl:mt-10 2xl:mt-10 py-6">
          <div className="text-center text-[24px] xl:text-[36px] 2xl:text-[48px] font-bold text-[#8E1616] pb-5 xl:pb-10 2xl:pb-10">
    Accessories
  </div>

          <img

              src={
              state.result == "summer"
                ? summerAccsessories
                : state.result == "autumn"
                  ? autumnAccsessories
                  : state.result == "winter"
                    ? winterAccsessories
                    : springAccsessories
            }
            
            alt="result"
            className="max-w-[360px] xl:w-full 2xl:w-full h-auto rounded-lg block md:hidden mx-auto"
          />
          {/* Desktop banner */}
          <img
            src={
              state.result == "summer"
                ? summerAccsessoriesMb
                : state.result == "autumn"
                  ? autumnAccsessoriesMb
                  : state.result == "winter"
                    ? winterAccsessoriesMb
                    : springAccsessoriesMb
            }
            alt="result"
            className="w-full h-auto rounded-lg hidden md:block"
          />
      </div>


<div className="mt-12 bg-[url(@/assets/result/bg.png)] bg-center bg-no-repeat bg-cover min-h-180 xl:min-h-230 2xl:min-h-330 pb-20 xl:pb-24 2xl:pb-32">
<div className="w-full mx-auto mt-10 pt-6 px-10 xl:px-32 2xl:px-32 ">

    <h3 className="text-center text-[#8E1616] font-semibold text-[24px] xl:text-[36px] 2xl:text-[48px] pt-4 xl:pt-6 2xl:pt-6">
      Color of good fortune
    </h3>
    <div className="text-center text-[16px] xl:text-[24px] 2xl:text-[24px] pb-6 xl:pb-10 2xl:pb-10">
      Lucky colors for your <span className="text-[#8E1616]">Career</span>
      , <span className="text-[#8E1616]">Love </span>and<span className="text-[#8E1616]"> Wealth—</span>selected to support each part of your life.
    </div>

    <div className="grid xl:grid-cols-3 2xl:grid-cols-3 gap-4 xl:gap-20 2xl:gap-20 ">
      {/* Career */}
      <img
        src={state.result == "summer" ? summerCareer : state.result == "autumn" ? autumnCareer : state.result == "winter" ? winterCareer : springCareer}
        alt="Career fortune"
        className="w-full h-auto rounded-2xl"
      />

      {/* Love */}
      <img
        src={state.result == "summer" ? summerLove : state.result == "autumn" ? autumnLove : state.result == "winter" ? winterLove : springLove}
        alt="Love fortune"
        className="w-full h-auto rounded-2xl"
      />

      {/* Wealth */}
      <img
        src={state.result == "summer" ? summerWealth : state.result == "autumn" ? autumnWealth : state.result == "winter" ? winterWealth : springWealth}
        alt="Wealth fortune"
        className="w-full h-auto rounded-2xl"
      />
    </div>
  </div>
</div>

<div className="xl:px-32 2xl:px-32 pt-4 xl:pt-10 2xl:pt-10 py-4 xl:py-6 2xl:py-6 justify-center">
<div className="flex flex-col xl:grid xl:grid-cols-[1fr_1.4fr] gap-6 xl:gap-10 items-center">
  <div className="mx-auto  h-[360px] w-auto xl:h-[500px] 2xl:h-[876px] rounded-xl object-cover relative group">
  {/* Blurred Image */}
  <img
    src={
      state.result === "summer" ? summerresult
      : state.result === "autumn" ? autumnresult
      : state.result === "winter" ? winterresult
      : springresult
    }
    alt="Result"
    className="w-full h-full rounded-3xl object-cover blur-[2px] hover:bg-white/30 transition-all duration-300"
  />

  {/* Preview Button Overlay */}
  <div className="absolute inset-0 flex items-center justify-center">
    <button
      onClick={() => setIsPreviewOpen(true)}
      className="flex items-center gap-2 px-5 py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-normal rounded-full border border-white/40 shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
      Preview
    </button>
  </div>

  {/* Popup Modal */}
  {isPreviewOpen && (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={() => setIsPreviewOpen(false)}
    >
      <div
        className="relative h-[450px] w-auto xl:h-[700px] 2xl:h-[876px] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={
            state.result === "summer" ? summerresult
            : state.result === "autumn" ? autumnresult
            : state.result === "winter" ? winterresult
            : springresult
          }
          alt="Preview"
          className="w-full h-full object-cover"
        />

        {/* Close Button */}
        <button
          onClick={() => setIsPreviewOpen(false)}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/50 hover:bg-white/70 text-white transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )}
</div>
<div className="w-full flex flex-col items-center gap-y-4 xl:gap-y-6 2xl:gap-6">      
  <h3 className="w-full text-center text-[#8E1616] font-bold text-[24px] xl:text-[36px] 2xl:text-[48px]">
    Don't lose your colors
    <br />
    <span className="text-[#14110F] font-normal text-[16px] xl:text-[24px] 2xl:text-[36px]">
      Save your personal color, makeup tones, accessories, and lucky colors for easy access anytime.
    </span>
  </h3>
      
       <a href={
          state.result === "summer" ? summerresult
          : state.result === "autumn" ? autumnresult
          : state.result === "winter" ? winterresult
          : springresult
        }
     download="my-personal-color.png"
    className="self-center flex items-center gap-2 bg-[#8E1616] text-white font-normal text-[16px] xl:text-[24px] 2xl:text-[32px] px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
  >
       <svg xmlns="http://www.w3.org/2000/svg"viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8"
      >
<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/></svg>
Save result
      </a>
    </div>

  </div>
</div>
 {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <StartNewAnalysis
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
          />
        </div>
      )}
    </div>
  )
}