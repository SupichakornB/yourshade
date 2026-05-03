"use client";

import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalyze } from "@/context/useAnalyze";
import { analyzeResult } from "@/lib/analyze";
import { loadFaceModels } from "@/lib/faceApi";
import { detectFace } from "@/lib/detectFace";
import { fileToImage } from "@/lib/fileToImage";
import type { ToneType } from "@/types/analyze";

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

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === rn
    ? ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6
    : max === gn
    ? ((bn - rn) / d + 2) / 6
    : ((rn - gn) / d + 4) / 6;
  return [h * 360, s, l];
}

function trimmedMean(arr: number[], trimRatio = 0.10): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  const cut = Math.floor(sorted.length * trimRatio);
  const trimmed = sorted.slice(cut, sorted.length - cut);
  return trimmed.reduce((s, v) => s + v, 0) / trimmed.length;
}

function isSkinPixel(r: number, g: number, b: number): boolean {
  if (r > 235 && g > 215 && b > 200) return false;
  if (r < 45 || g < 20 || b < 10) return false;
  const [h, s, l] = rgbToHsl(r, g, b);
  if (s < 0.08) return false;
  if (l > 0.88) return false;
  if (l < 0.15) return false;
  if (h > 50 && h < 330) return false;
  return r > g && r > b && r - b > 10;
}

// ─────────────────────────────────────────────
// Skin Lab Sampling
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
  const Ls: number[] = [], As: number[] = [], Bs: number[] = [];

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i], g = data[i + 1], b = data[i + 2], alpha = data[i + 3];
    if (alpha < 128 || !isSkinPixel(r, g, b)) continue;
    const [L, a, bv] = rgbToLab(r, g, b);
    Ls.push(L); As.push(a); Bs.push(bv);
  }

  if (Ls.length < 50) return null;
  return {
    L: trimmedMean(Ls),
    a: trimmedMean(As),
    b: trimmedMean(Bs),
    count: Ls.length,
  };
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
// Tone Classifier
// ─────────────────────────────────────────────

function classifyTone(L: number, a: number, b: number): ToneType {
  const C = chroma(a, b);
  console.log(`[Tone] L=${L.toFixed(2)}, a=${a.toFixed(2)}, b=${b.toFixed(2)}, C*=${C.toFixed(2)}`);

  // C* สูงมาก + a* สูงมากพร้อมกัน = warm lighting inflate ค่า → soft
  if (C >= 26 && a >= 17) return "soft";

  // C* สูง = vivid/bright
  if (C >= 18) return "bright";

  // C* ต่ำมาก = muted/soft
  if (C < 14) return "soft";

  // กลาง → ใช้ a* ตัดสิน
  return a >= 11 ? "bright" : "soft";
}

// ─────────────────────────────────────────────
// Loading Page
// ─────────────────────────────────────────────

export default function LoadingPage() {
  const { state, dispatch } = useAnalyze();
  const navigate = useNavigate();

  const hasRun = useRef(false);

  const imageUrl = useMemo(() => {
    return state.image ? URL.createObjectURL(state.image) : null;
  }, [state.image]);

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

    if (hasRun.current) return;
    hasRun.current = true;

    const executeAnalysis = async () => {
      try {
        await loadFaceModels();

        await Promise.all([
          (async () => {
            const img = await fileToImage(state.image!);
            const detection = await detectFace(img);

            // ── Skin zone canvas ─────────────────────────────
            let skinCanvas: HTMLCanvasElement;
            if (detection) {
              skinCanvas = cropSkinRegion(img, detection.detection.box);
            } else {
              skinCanvas = document.createElement("canvas");
              skinCanvas.width = img.naturalWidth || img.width;
              skinCanvas.height = img.naturalHeight || img.height;
              skinCanvas.getContext("2d")!.drawImage(img, 0, 0);
            }

            // ── คำนวณ skin Lab ───────────────────────────────
            const skinCtx = skinCanvas.getContext("2d")!;
            const lab = averageSkinLab(skinCtx, skinCanvas.width, skinCanvas.height);
            if (!lab) throw new Error("ตรวจจับสีผิวไม่เพียงพอ");

            // ── Classify tone ────────────────────────────────
            const detectedTone = classifyTone(lab.L, lab.a, lab.b);

            console.log(`[Result] tone=${detectedTone}, L=${lab.L.toFixed(2)}, a=${lab.a.toFixed(2)}, b=${lab.b.toFixed(2)}, C*=${chroma(lab.a, lab.b).toFixed(2)}`);

            const result = analyzeResult({
              ...state,
              tone: detectedTone,
            });

            dispatch({
              type: "SET_ANALYSIS",
              payload: {
                tone:       detectedTone,
                brightness: "medium",
                saturation: "medium",
                contrast:   "medium",
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

  }, [state.image]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#8E1616]">
      {imageUrl && (
        <div className="w-[318px] h-[354px] xl:w-[512px] xl:h-[569px] 2xl:w-[512px] 2xl:h-[569px] overflow-hidden bg-white shadow-lg [clip-path:ellipse(50%_50%_at_50%_50%)] opacity-60">
          <img src={imageUrl} className="w-full h-full object-cover" alt="analyzing" />
        </div>
      )}
      <p className="text-[24px] xl:text-[48px] 2xl:text-[72px] text-white mt-8">
        Loading
        <span className="inline-flex gap-1 ml-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            >
              .
            </span>
          ))}
        </span>
      </p>
    </div>
  );
}