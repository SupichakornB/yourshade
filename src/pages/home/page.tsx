import { Link } from "react-router-dom";
import banner from "@/assets/home-banner.png";
import autumnImage from "@/assets/home-autumn-tone-banner.png";
import springImage from "@/assets/home-spring-tone-banner.png";
import summerImage from "@/assets/home-summer-tone-banner.png";
import winterImage from "@/assets/home-winter-tone-banner.png";
import autumnImageMb from "@/assets/home-autumn-tone-banner-mb.png";
import springImageMb from "@/assets/home-spring-tone-banner-mb.png";
import summerImageMb from "@/assets/home-summer-tone-banner-mb.png";
import winterImageMb from "@/assets/home-winter-tone-banner-mb.png";
import { useAnalyze } from "@/context/useAnalyze";
import logo from "@/assets/full-logo.png";

export default function Home() {
  const { dispatch } = useAnalyze();

  return (
    <div className="pb-20">
      <div className="relative w-full h-79.75 md:h-full">
        <img
          src={banner}
          alt="banner"
          className="w-full h-full object-cover md:object-fill"
        />

        <img
          src={logo}
          alt="logo"
          className="absolute top-4 xl:top-6 2xl:top-6 left-1/2 -translate-x-1/2 w-40 h-7 xl:w-60 xl:h-13 2xl:w-60 2xl:h-13"
        />
      </div>

      <div className="space-y-6 py-6 px-4">
        <div
          className="flex justify-center"
          onClick={() => dispatch({ type: "SET_IMAGE", payload: null })}
        >
          <Link
            to="/upload"
            className="bg-[#8E1616] px-6 py-4 font-thin text-[20px] xl:text-[28px] 2xl:text-[36px] text-white rounded-full shadow-lg shadow-[#8E1616]/20bg-[#8E1616] font rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer whitespace-nowrap"
          >
            Discover Your Personal Color →
          </Link>
        </div>
        <div className="text-[24px] xl:text-[40px] 2xl:text-[56px] text-center font-bold text-[#8E1616]">
          What is Personal Color ?
        </div>

        <div className="flex justify-center">
          <div className="text-center xl:w-[1196px] 2xl:w-[1400px] :text-[16px] xl:text-[28px] 2xl:text-[32px]">
            Colors that match our skin tone will make shadows on the face appear
            less noticeable, reducing the appearance of wrinkles, laugh lines,
            and under-eye circles. This makes the face look brighter and
            healthier. However, using personal color is just one option for
            dressing. It can be adapted to suit your style and confidence level.
          </div>
        </div>

        <div className="text-[24px] xl:text-[36px] 2xl:text-[48px] text-center font-bold text-[#8E1616]">
          Personal Color Types
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={springImage}
              alt="homeImage"
              className="hidden md:block h-full xl:w-[796px] 2xl:w-[970px]"
            />
            <img
              src={springImageMb}
              alt="homeImage"
              className="block md:hidden w-full h-full"
            />
          </div>
          <div
            className="flex justify-center"
            onClick={() => dispatch({ type: "SET_RESULT", payload: "spring" })}
          >
            <Link
              to="/result"
              className="border border-[#8E1616] px-6 py-2 font-light text-[16px] xl:text-[24px] 2xl:text-[32px] text-[#8E1616] rounded-full shadow-lg shadow-black/10"
            >
              View Spring tone
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={summerImage}
              alt="homeImage"
              className="hidden md:block h-full xl:w-[796px] 2xl:w-[970px]"
            />
            <img
              src={summerImageMb}
              alt="homeImage"
              className="block md:hidden h-full w-full"
            />
          </div>
          <div
            className="flex justify-center"
            onClick={() => dispatch({ type: "SET_RESULT", payload: "summer" })}
          >
            <Link
              to="/result"
              className="border border-[#8E1616] px-6 py-2 font-light text-[16px] xl:text-[24px] 2xl:text-[32px] text-[#8E1616] rounded-full shadow-lg shadow-black/10"
            >
              View Summer tone
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={autumnImage}
              alt="homeImage"
              className="hidden md:block h-full xl:w-[796px] 2xl:w-[970px]"
            />
            <img
              src={autumnImageMb}
              alt="homeImage"
              className="block md:hidden h-full w-full"
            />
          </div>
          <div
            className="flex justify-center"
            onClick={() => dispatch({ type: "SET_RESULT", payload: "autumn" })}
          >
            <Link
              to="/result"
              className="border border-[#8E1616] px-6 py-2 font-light text-[16px] xl:text-[24px] 2xl:text-[32px] text-[#8E1616] rounded-full shadow-lg shadow-black/10"
            >
              View Autumn tone
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center">
            <img
              src={winterImage}
              alt="homeImage"
              className="hidden md:block h-full xl:w-[796px] 2xl:w-[970px]"
            />
            <img
              src={winterImageMb}
              alt="homeImage"
              className="block md:hidden h-full w-full"
            />
          </div>
          <div
            className="flex justify-center"
            onClick={() => dispatch({ type: "SET_RESULT", payload: "winter" })}
          >
            <Link
              to="/result"
              className="border border-[#8E1616] px-6 py-2 font-light text-[16px] xl:text-[24px] 2xl:text-[32px] text-[#8E1616] rounded-full shadow-lg shadow-black/10"
            >
              View Winter tone
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
