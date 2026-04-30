"use client";

import { useAnalyze } from "@/context/useAnalyze";
import PrimaryButton from "@/components/PrimaryButton";

import { useNavigate } from "react-router-dom";
import backIcon from "@/assets/icon/ep_back.svg";
import clsx from "clsx";
import { useEffect } from "react";
import veinCoolTone from "@/assets/veins-cool-tone.png";
import veinWarmTone from "@/assets/veins-warm-tone.png";
import veinCoolToneMb from "@/assets/veins-cool-tone-mb.png";
import veinWarmToneMb from "@/assets/veins-warm-tone-mb.png";

export default function VeinsPage() {
  const { state, dispatch } = useAnalyze();
  const navigate = useNavigate();

  const selectVein = (value: "cool" | "warm") => {
    dispatch({ type: "SET_VEIN", payload: value });
  };

  useEffect(() => {
    if (!state.image) {
      navigate("/upload");
    }
  }, []);

  
useEffect(() => {
  const mediaQuery = window.matchMedia('(min-width: 1440px)'); // xl breakpoint

  const handleChange = (e: MediaQueryList | MediaQueryListEvent) => {
    document.body.style.overflow = e.matches ? 'hidden' : '';
  };

  handleChange(mediaQuery); // เช็คตอน mount
  mediaQuery.addEventListener('change', handleChange); // เช็คตอน resize

  return () => {
    mediaQuery.removeEventListener('change', handleChange);
    document.body.style.overflow = ''; // cleanup
  };
}, []);

  return (
    <div className="min-h-screen xl:overflow-hidden 2xl:overflow-hidden p-6 pb-20 md:bg-[url(@/assets/bg-upload-image.png)] bg-[length:800px] md:bg-[length:1300px] bg-no-repeat bg-fixed bg-center">
      {" "}
      <div>
<img
  src={backIcon}
  alt="homeImage"
  className="max-w-9 cursor-pointer"
  onClick={() => {
    dispatch({ type: "SET_IMAGE", payload: null })
    navigate("/upload")
  }}
/>
      </div>
      <h1 className="font-playfair font-semibold md:mt-2 xl:my-4 2xl:my-6 text-center text-[24px] xl:text-[32px] 2xl:text-[48px] text-[#8E1616]">
        Take a look at your wrist <br />
        what color do your veins appear?
      </h1>
      <div className="justify-center items-center w-full">
        <div className="grid md:flex md:justify-center py-4 2xl:py-0 xl:pb-0 2xl:pb-0 xl:gap-10  2xl:gap-10">
          <div className="grid text-center" onClick={() => selectVein("cool")}>
            <img
              src={veinCoolTone}
              alt="cool tone vein"
              className={clsx(
                "hidden md:block cursor-pointer rounded-3xl xl:w-[350px] xl:h-auto 2xl:w-[440px] 2xl:h-[590px] shadow-xl border border-[#7E7F83]",
                state.vein === "cool" && "border-2 border-[#8E1616]",
              )}
            />
            <img
              src={veinCoolToneMb}
              alt="cool tone vein"
              className={clsx(
                "block md:hidden cursor-pointer rounded-3xl w-[365px] h-[270px] shadow-xl border border-[#7E7F83]",
                state.vein === "cool" && "border-2 border-[#8E1616]",
              )}
            />

            <div className="py-4 xl:pt-6 2xl:py-6 text-center text-[16px] xl:text-[24px] 2xl:text-[32px] font-bold">
              Cool
            </div>
          </div>
          <div className="grid text-center" onClick={() => selectVein("warm")}>
            <img
              src={veinWarmTone}
              alt="warm tone vein"
              className={clsx(
                "hidden md:block cursor-pointer rounded-3xl xl:w-[350px] xl:h-auto 2xl:w-[440px] 2xl:h-[590px] shadow-xl border border-[#7E7F83]",
                state.vein === "warm" && "border-2 border-[#8E1616]",
              )}
            />
            <img
              src={veinWarmToneMb}
              alt="warm tone vein"
              className={clsx(
                "block md:hidden cursor-pointer rounded-3xl w-[365px] h-[270px] shadow-xl border border-[#7E7F83]",
                state.vein === "warm" && "border-2 border-[#8E1616]",
              )}
            />

            <div className="pt-4 xl:pt-6 2xl:py-6 text-center text-[16px] xl:text-[24px] 2xl:text-[32px] font-bold">
              Warm
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-[20px] xl:text-[24px] 2xl:text-[28px]">
        <PrimaryButton
          disabled={!state.vein}
          onClick={() => navigate("/loading")}
        >
          Next
        </PrimaryButton>
      </div>
    </div>
  );
}