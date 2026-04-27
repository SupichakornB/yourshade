"use client";

import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalyze } from "@/context/useAnalyze";
import { analyzeResult } from "@/lib/analyze";
import { loadFaceModels } from "@/lib/faceApi";
import { detectFace } from "@/lib/detectFace";
import { fileToImage } from "@/lib/fileToImage";
import type { ToneType, LevelType } from "@/types/analyze";

// ─────────────────────────────────────────────
// Color Math Utilities
// ─────────────────────────────────────────────

function linearize(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const rl = linearize(r);
  const gl = linearize(g);
  const bl = linearize(b);

  let X = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
  let Y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.0721750;
  let Z = rl * 0.0193339 + gl * 0.1191920 + bl * 0.9503041;

  X /= 0.95047;
  Y /= 1.0;
  Z /= 1.08883;

  const f = (t: number) =>
    t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116;

  const L = 116 * f(Y) - 16;
  const a = 500 * (f(X) - f(Y));
  const bStar = 200 * (f(Y) - f(Z));

  return [L, a, bStar];
}

function chroma(a: number, b: number): number {
  return Math.sqrt(a * a + b * b);
}

// ─────────────────────────────────────────────
// Skin Pixel Detection
// ─────────────────────────────────────────────

function isSkinPixel(r: number, g: number, b: number): boolean {
  if (r < 45 || g < 20 || b < 10) return false;
  if (r > 250 && g > 250 && b > 250) return false;
  if (Math.max(r, g, b) - Math.min(r, g, b) < 8) return false;
  return r > g && r > b && r - b > 15;
}

// ─────────────────────────────────────────────
// Skin Lab Sampling (ใช้สำหรับ tone + saturation)
// ─────────────────────────────────────────────

interface LabResult {
  L: number;
  a: number;
  b: number;
  count: number;
}

function averageSkinLab(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): LabResult | null {
  const data = ctx.getImageData(0, 0, width, height).data;
  let sumL = 0, sumA = 0, sumB = 0, count = 0;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3];
    if (alpha < 128 || !isSkinPixel(r, g, b)) continue;
    const [L, a, bv] = rgbToLab(r, g, b);
    sumL += L; sumA += a; sumB += bv; count++;
  }

  if (count < 50) return null;
  return { L: sumL / count, a: sumA / count, b: sumB / count, count };
}

// ─────────────────────────────────────────────
// Overall Image Brightness (ใช้สำหรับ brightness)
// วัดจาก L* เฉลี่ยของทั้งภาพ (ไม่กรอง skin)
// ─────────────────────────────────────────────

function averageImageLightness(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): number {
  const data = ctx.getImageData(0, 0, width, height).data;
  let sumL = 0, count = 0;

  for (let i = 0; i < data.length; i += 32) {
    const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3];
    if (alpha < 128) continue;
    const [L] = rgbToLab(r, g, b);
    sumL += L;
    count++;
  }

  return count > 0 ? sumL / count : 50;
}

// ─────────────────────────────────────────────
// Hair Zone Lightness (ใช้สำหรับ contrast)
// ─────────────────────────────────────────────

function averageHairLab(
  img: HTMLImageElement,
  box: { x: number; y: number; width: number; height: number }
): number | null {
  const cropX = box.x + box.width * 0.20;
  const cropY = box.y;
  const cropW = box.width * 0.60;
  const cropH = box.height * 0.20;

  if (cropW < 10 || cropH < 10) return null;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropW);
  canvas.height = Math.round(cropH);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(
    img,
    Math.round(cropX), Math.round(cropY),
    Math.round(cropW), Math.round(cropH),
    0, 0, canvas.width, canvas.height
  );

  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let sumL = 0, count = 0;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3];
    if (alpha < 128) continue;
    const [L] = rgbToLab(r, g, b);
    sumL += L;
    count++;
  }

  return count > 0 ? sumL / count : null;
}

// ─────────────────────────────────────────────
// Crop Skin Zone
// ─────────────────────────────────────────────

function cropSkinRegion(
  img: HTMLImageElement,
  box: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement {
  const cropX = box.x + box.width * 0.20;
  const cropY = box.y + box.height * 0.20;
  const cropW = box.width * 0.60;
  const cropH = box.height * 0.55;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(cropW);
  canvas.height = Math.round(cropH);
  canvas.getContext("2d")!.drawImage(
    img,
    Math.round(cropX), Math.round(cropY),
    Math.round(cropW), Math.round(cropH),
    0, 0, canvas.width, canvas.height
  );
  return canvas;
}

// ─────────────────────────────────────────────
// Classifiers
// ─────────────────────────────────────────────

const CHROMA_THRESHOLD = 18;
const LIGHTNESS_THRESHOLD = 65;

function classifyTone(L: number, a: number, b: number): ToneType {
  const C = chroma(a, b);
  console.log(`[Tone] L=${L.toFixed(2)}, a=${a.toFixed(2)}, b=${b.toFixed(2)}, C*=${C.toFixed(2)}`);
  if (C >= CHROMA_THRESHOLD) return "bright";
  if (L >= LIGHTNESS_THRESHOLD && C >= 14) return "bright";
  return "soft";
}

function classifyBrightness(imageLightness: number): LevelType {
  console.log(`[Brightness] imageL*=${imageLightness.toFixed(2)}`);
  if (imageLightness < 40) return "low";
  if (imageLightness > 70) return "high";
  return "medium";
}

function classifySaturation(a: number, b: number): LevelType {
  const C = chroma(a, b);
  console.log(`[Saturation] C*=${C.toFixed(2)}`);
  if (C < 14) return "low";
  if (C > 20) return "high";
  return "medium";
}

function classifyContrast(skinL: number, hairL: number | null): LevelType {
  if (hairL === null) {
    console.log(`[Contrast] no hair zone detected → fallback medium`);
    return "medium";
  }
  const delta = Math.abs(skinL - hairL);
  console.log(`[Contrast] skinL=${skinL.toFixed(2)}, hairL=${hairL.toFixed(2)}, ΔL*=${delta.toFixed(2)}`);
  if (delta < 20) return "low";
  if (delta > 40) return "high";
  return "medium";
}

// ─────────────────────────────────────────────
// Loading Page
// ─────────────────────────────────────────────

export default function LoadingPage() {
  const { state, dispatch } = useAnalyze();
  const navigate = useNavigate();

  // ── Guard: กัน StrictMode double-run ──────────────────────────────────
  // ไม่ reset ใน cleanup เพราะเราต้องการให้ run แค่ครั้งเดียวตลอด lifecycle
  const hasRun = useRef(false);

  // สร้าง objectURL ครั้งเดียว และ revoke ตอน component unmount จริงๆ
  // (ไม่ใช่ตอน StrictMode cleanup ที่ยังไม่ได้ unmount จริง)
  const imageUrl = useMemo(() => {
    return state.image ? URL.createObjectURL(state.image) : null;
  }, [state.image]);

  // Revoke เฉพาะตอน unmount จริง (แยกออกมาเป็น effect ของตัวเอง)
  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [imageUrl]);

  useEffect(() => {
    if (!state.image) {
      navigate("/upload");
      return;
    }

    // ── กัน double-run: ถ้ารันไปแล้วให้ข้าม ────────────────────────────
    if (hasRun.current) return;
    hasRun.current = true;

    const executeAnalysis = async () => {
      try {
        await loadFaceModels();

        await Promise.all([
          (async () => {
            const img = await fileToImage(state.image!);
            const detection = await detectFace(img);

            // ── 1. Skin zone canvas ──────────────────────────
            let skinCanvas: HTMLCanvasElement;
            if (detection) {
              skinCanvas = cropSkinRegion(img, detection.detection.box);
            } else {
              skinCanvas = document.createElement("canvas");
              skinCanvas.width = img.naturalWidth || img.width;
              skinCanvas.height = img.naturalHeight || img.height;
              skinCanvas.getContext("2d")!.drawImage(img, 0, 0);
            }

            // ── 2. Full image canvas (สำหรับ brightness) ────
            const fullCanvas = document.createElement("canvas");
            fullCanvas.width = img.naturalWidth || img.width;
            fullCanvas.height = img.naturalHeight || img.height;
            fullCanvas.getContext("2d")!.drawImage(img, 0, 0);

            // ── 3. คำนวณ skin Lab ────────────────────────────
            const skinCtx = skinCanvas.getContext("2d")!;
            const lab = averageSkinLab(skinCtx, skinCanvas.width, skinCanvas.height);
            if (!lab) throw new Error("ตรวจจับสีผิวไม่เพียงพอ");

            // ── 4. คำนวณ image brightness ────────────────────
            const fullCtx = fullCanvas.getContext("2d")!;
            const imageLightness = averageImageLightness(fullCtx, fullCanvas.width, fullCanvas.height);

            // ── 5. คำนวณ hair zone สำหรับ contrast ──────────
            const hairL = detection
              ? averageHairLab(img, detection.detection.box)
              : null;

            // ── 6. Classify ทุกค่า ────────────────────────────
            const detectedTone       = classifyTone(lab.L, lab.a, lab.b);
            const detectedBrightness = classifyBrightness(imageLightness);
            const detectedSaturation = classifySaturation(lab.a, lab.b);
            const detectedContrast   = classifyContrast(lab.L, hairL);

            console.log(`[Result] tone=${detectedTone}, brightness=${detectedBrightness}, saturation=${detectedSaturation}, contrast=${detectedContrast}`);

            // ── 7. คำนวณ season result ────────────────────────
            const result = analyzeResult({
              ...state,
              tone:       detectedTone,
              brightness: detectedBrightness,
              saturation: detectedSaturation,
              contrast:   detectedContrast,
            });

            // ── 8. Dispatch ครั้งเดียว (SET_ANALYSIS ครอบทุกค่า) ────────
            // ไม่ต้อง dispatch SET_TONE/BRIGHTNESS/SATURATION/CONTRAST แยก
            // เพราะ SET_ANALYSIS มีทุกค่าครบอยู่แล้ว → ลด re-render และ
            // ป้องกัน result page อ่าน state ที่ยังไม่ครบ
            dispatch({
              type: "SET_ANALYSIS",
              payload: {
                tone:       detectedTone,
                brightness: detectedBrightness,
                saturation: detectedSaturation,
                contrast:   detectedContrast,
                result,
              },
            });
          })(),

          // minimum loading time 2 วินาที
          new Promise((res) => setTimeout(res, 2000)),
        ]);

        navigate("/result");
      } catch (err: unknown) {
        console.error("Analysis error:", (err as Error)?.message);
        navigate("/result");
      }
    };

    executeAnalysis();

    // ── ไม่ revoke imageUrl ที่นี่ → ย้ายไป effect แยกข้างบนแล้ว ──────
  }, [state.image]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#8E1616]">
      {imageUrl && (
        <div className="w-[318px] h-[354px] xl:w-[512px] xl:h-[569px] 2xl:w-[512px] 2xl:h-[569px] overflow-hidden bg-white shadow-lg [clip-path:ellipse(50%_50%_at_50%_50%)] opacity-60">
          <img src={imageUrl} className="w-full h-full object-cover" alt="analyzing" />
        </div>
      )}
      <p className="text-[24px] xl:text-[48px] 2xl:text-[72px] text-white mt-8 animate-pulse">
        Loading...
      </p>
    </div>
  );
}