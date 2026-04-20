"use client";

import { useAnalyze } from "@/context/useAnalyze";
import { useEffect, useState } from "react";
import summer from "@/assets/result/banner-summer.png";
import autumn from "@/assets/result/banner-autumn.png";
import winter from "@/assets/result/banner-winter.png";
import spring from "@/assets/result/banner-spring.png";
import summerMb from "@/assets/result/banner-summer-mobile.png";
import autumnMb from "@/assets/result/banner-autumn-mobile.png";
import winterMb from "@/assets/result/banner-winter-mobile.png";
import springMb from "@/assets/result/banner-spring-mobile.png";

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
import springCardCareer from "@/assets/result/spring-card-career.png";
import springLove from "@/assets/result/spring-fortune-love.png";
import springCardLove from "@/assets/result/spring-card-love.png";
import springWealth from "@/assets/result/spring-fortune-wealth.png";
import springCardWealth from "@/assets/result/spring-card-wealth.png";

import summerCareer from "@/assets/result/summer-fortune-career.png";
import summerCardCareer from "@/assets/result/summer-card-career.png";
import summerLove from "@/assets/result/summer-fortune-love.png";
import summerCardLove from "@/assets/result/summer-card-love.png";
import summerWealth from "@/assets/result/summer-fortune-wealth.png";
import summerCardWealth from "@/assets/result/summer-card-wealth.png";

import autumnCareer from "@/assets/result/autumn-fortune-career.png";
import autumnCardCareer from "@/assets/result/autumn-card-career.png";
import autumnLove from "@/assets/result/autumn-fortune-love.png";
import autumnCardLove from "@/assets/result/autumn-card-love.png";
import autumnWealth from "@/assets/result/autumn-fortune-wealth.png";
import autumnCardWealth from "@/assets/result/autumn-card-wealth.png";

import winterCareer from "@/assets/result/winter-fortune-career.png";
import winterCardCareer from "@/assets/result/winter-card-career.png";
import winterLove from "@/assets/result/winter-fortune-love.png";
import winterCardLove from "@/assets/result/winter-card-love.png";
import winterWealth from "@/assets/result/winter-fortune-wealth.png";
import winterCardWealth from "@/assets/result/winter-card-wealth.png";

export default function ResultPage() {
  const { state } = useAnalyze();
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState({ career: false, love: false, wealth: false });
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
    if (!state.result) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const navigateToProduct = () => {
    navigate(`/product/${state?.result?.toLowerCase()}`);
  };

  if (!data) return null;

  return (
    <div className="pb-10">
      <div className="w-full  mx-auto relative">
      <div className="relative w-full">
          {/* Mobile banner */}
          <img
            src={
              state.result == "summer"
                ? summerMb
                : state.result == "autumn"
                  ? autumnMb
                  : state.result == "winter"
                    ? winterMb
                    : springMb
            }
            alt="result"
            className="w-full h-auto rounded-lg block md:hidden"
          />
          {/* Desktop banner */}
          <img
            src={
              state.result == "summer"
                ? summer
                : state.result == "autumn"
                  ? autumn
                  : state.result == "winter"
                    ? winter
                    : spring
            }
            alt="result"
            className="w-full h-auto rounded-lg hidden md:block"
          />

          <Link to="/">
            <img
              src={logo}
              alt="logo"
              className="absolute top-4 xl:top-6 2xl:top-6 left-1/2 -translate-x-1/2 w-10 h-8 md:w-28 md:h-20 z-10"
            />
          </Link>
        </div>
      </div>

      <div className="mx-auto xl:mx-32 2xl:mx-32 text-center text-[16px] xl:text-[24px] 2xl:text-[32px] leading-relaxed px-6 py-6 xl:pt-12 xl:pb-6 2xl:pt-12 2xl:pb-6">
        {getPersonalDescription()}
      </div>

      <div className="mt-12 relative px-2 md:px-32">
  {/* <img
    src={bannerShoppingMb}
    alt="banner"
    className="w-full h-auto rounded-lg block md:hidden"
  /> */}
  {/* <img
    src={bannerShopping}
    alt="banner"
    className="w-full h-auto rounded-lg hidden md:block"
  /> */}
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

      <div className="text-center mt-10 md:mt-14 text-[24px] xl:text-[36px] 2xl:text-[48px] font-bold text-[#8E1616]">
        Recommended colors
      </div>

      <div className="mx-4 md:mx-32 justify-center mt-10 rounded-2xl p-6 shadow-sm bg-white">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
          {data.recommended.map((c: string, i: number) => (
            <div
              key={i}
              className="w-full aspect-square rounded-xl"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="px-4 md:px-32 mt-11 py-20 md:py-40 bg-[url(@/assets/result/bg.png)] bg-cover bg-center bg-no-repeat min-h-95 md:min-h-280 ">
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
          {/* Make up */}
          <div className="grid text-center justify-center">
            <h3 className="text-[#8E1616] font-semibold text-[24px] xl:text-[36px] 2xl:text-[48px] mb-4">
              Make up
            </h3>
            <div className="h-[360px] w-[360px] xl:h-[500px] xl:w-[500px] 2xl:h-[876px] 2xl:w-[876px] rounded-3xl bg-white shadow-md">
              <div className="grid grid-cols-2 w-full h-full gap-5 xl:gap-10 2xl:gap-10 p-5 xl:p-10 2xl:p-10">
                {data.makeup.map((color: string, i: number) => (
                  <div
                    key={i}
                    className={`bg-[${color}] w-full h-full rounded-lg`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Accessories */}
          <div className="grid text-center justify-center">
            <h3 className="text-[#8E1616] font-semibold text-[24px] xl:text-[36px] 2xl:text-[48px] mb-4 mt-11 md:mt-0">
              Accessories
            </h3>

            <div className="h-[360px] w-[360px] xl:h-[500px] xl:w-[500px] 2xl:h-[876px] 2xl:w-[876px] rounded-3xl bg-white shadow-md object-cover">
              <img
                src={
                  state.result === "summer"
                    ? summerAccsessories
                    : state.result === "autumn"
                      ? autumnAccsessories
                      : state.result === "winter"
                        ? winterAccsessories
                        : springAccsessories
                }
                alt="Accessories"
                className="w-full h-full rounded-3xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto space-y-10 mt-10">
        <div className="mt-12">
          <h3 className="text-center text-[#8E1616] font-semibold text-[24px] xl:text-[36px] 2xl:text-[48px] mb-6">
            Color of good fortune
          </h3>

          <style>{`
            .card-flip-container {
              perspective: 1000px;
              cursor: pointer;
            }
            .card-flip-inner {
              position: relative;
              width: 100%;
              transition: transform 0.7s cubic-bezier(0.4, 0.2, 0.2, 1);
              transform-style: preserve-3d;
            }
            .card-face {
              width: 100%;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
            .card-face-front {
              position: relative;
            }
            .card-face-back {
              position: absolute;
              top: 0;
              left: 0;
              transform: rotateY(180deg);
            }
            .card-flip-container.flipped .card-flip-inner {
              transform: rotateY(180deg);
            }
            .card-flip-inner {
              border-radius: 16px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.15);
            }
            .card-flip-container img {
              width: 100%;
              height: auto;
              border-radius: 16px;
              display: block;
            }
          `}</style>

          <div className="grid md:grid-cols-3 gap-20 px-14">
            {/* Career Card */}
            <div
              className={`card-flip-container ${flippedCards.career ? "flipped" : ""}`}
              onClick={() => setFlippedCards(prev => ({ ...prev, career: !prev.career }))}
            >
              <div className="card-flip-inner">
                <div className="card-face card-face-front">
                  <img
                    src={
                      state.result == "summer"
                        ? summerCardCareer
                        : state.result == "autumn"
                          ? autumnCardCareer
                          : state.result == "winter"
                            ? winterCardCareer
                            : springCardCareer
                    }
                    alt="Career card"
                  />
                </div>
                <div className="card-face card-face-back">
                  <img
                    src={
                      state.result == "summer"
                        ? summerCareer
                        : state.result == "autumn"
                          ? autumnCareer
                          : state.result == "winter"
                            ? winterCareer
                            : springCareer
                    }
                    alt="Career fortune"
                  />
                </div>
              </div>
            </div>

            {/* Love Card */}
            <div
              className={`card-flip-container ${flippedCards.love ? "flipped" : ""}`}
              onClick={() => setFlippedCards(prev => ({ ...prev, love: !prev.love }))}
            >
              <div className="card-flip-inner">
                <div className="card-face card-face-front">
                  <img
                    src={
                      state.result == "summer"
                        ? summerCardLove
                        : state.result == "autumn"
                          ? autumnCardLove
                          : state.result == "winter"
                            ? winterCardLove
                            : springCardLove
                    }
                    alt="Love card"
                  />
                </div>
                <div className="card-face card-face-back">
                  <img
                    src={
                      state.result == "summer"
                        ? summerLove
                        : state.result == "autumn"
                          ? autumnLove
                          : state.result == "winter"
                            ? winterLove
                            : springLove
                    }
                    alt="Love fortune"
                  />
                </div>
              </div>
            </div>

            {/* Wealth Card */}
            <div
              className={`card-flip-container ${flippedCards.wealth ? "flipped" : ""}`}
              onClick={() => setFlippedCards(prev => ({ ...prev, wealth: !prev.wealth }))}
            >
              <div className="card-flip-inner">
                <div className="card-face card-face-front">
                  <img
                    src={
                      state.result == "summer"
                        ? summerCardWealth
                        : state.result == "autumn"
                          ? autumnCardWealth
                          : state.result == "winter"
                            ? winterCardWealth
                            : springCardWealth
                    }
                    alt="Wealth card"
                  />
                </div>
                <div className="card-face card-face-back">
                  <img
                    src={
                      state.result == "summer"
                        ? summerWealth
                        : state.result == "autumn"
                          ? autumnWealth
                          : state.result == "winter"
                            ? winterWealth
                            : springWealth
                    }
                    alt="Wealth fortune"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}