"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAnalyze } from "@/context/useAnalyze";

import backIcon from "@/assets/icon/ep_back.svg";
import { analyzeResult } from "@/lib/analyze";
import { loadFaceModels } from "@/lib/faceApi";
import { detectFace } from "@/lib/detectFace";
import { fileToImage } from "@/lib/fileToImage";
import type { ToneType } from "@/types/analyze";

type Status = "loading" | "done" | "error";

// ─── LAB color helpers ────────────────────────────────────────────────────────

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

// ─── Skin pixel filter ────────────────────────────────────────────────────────

function isSkinPixel(r: number, g: number, b: number): boolean {
  if (r < 45 || g < 20 || b < 10) return false;
  if (r > 250 && g > 250 && b > 250) return false;
  if (Math.max(r, g, b) - Math.min(r, g, b) < 8) return false;
  return r > g && r > b && r - b > 15;
}

function averageSkinLab(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): { L: number; a: number; b: number; count: number } | null {
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

// ─── Tone classification ──────────────────────────────────────────────────────
//
//  Bright = chroma สูง (สีผิวใส ชัด) → Spring / Winter
//  Soft   = chroma ต่ำ (สีผิว muted ขุ่น) → Summer / Autumn
//
const CHROMA_THRESHOLD = 18;
const LIGHTNESS_THRESHOLD = 65;

function classifyTone(L: number, a: number, b: number): ToneType {
  const C = chroma(a, b);
  console.log(`[ColorAnalysis] L: ${L.toFixed(2)}, a: ${a.toFixed(2)}, b: ${b.toFixed(2)}, C*: ${C.toFixed(2)}`);
  
  // bright ถ้า chroma สูง หรือ ผิวสว่างพอและ chroma ไม่ต่ำเกินไป
  if (C >= CHROMA_THRESHOLD) return "bright";
  if (L >= LIGHTNESS_THRESHOLD && C >= 14) return "bright";
  return "soft";
}

// ─── Crop skin region from face detection result ──────────────────────────────

function cropSkinRegion(
  img: HTMLImageElement,
  box: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement {
  // ตัดผม หู คาง ออก — เหลือแต่แก้ม+หน้าผาก
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StepsPage() {
  const { state, dispatch } = useAnalyze();
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("loading");
  const [tone, setTone] = useState<ToneType | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const imageUrl = useMemo(
    () => (state.image ? URL.createObjectURL(state.image) : null),
    [state.image]
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    if (!state.image) {
      navigate("/upload");
      return;
    }
    runAnalysis();
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, []);

  const runAnalysis = async () => {
    try {
      // 1. โหลด face model (ถ้า upload page โหลดไว้แล้ว จะ skip อัตโนมัติ)
      await loadFaceModels();

      // 2. แปลง File → HTMLImageElement (ใช้ lib เดิม)
      const img = await fileToImage(state.image!);

      // 3. Detect face (ใช้ detectFace lib เดิม)
      const detection = await detectFace(img);

      let skinCanvas: HTMLCanvasElement;

      if (detection) {
        const box = detection.detection.box;
        skinCanvas = cropSkinRegion(img, box);
        console.log("[FaceDetect] Face found", box);
      } else {
        // Fallback: ใช้รูปเต็ม
        console.warn("[FaceDetect] No face — using full image");
        skinCanvas = document.createElement("canvas");
        skinCanvas.width = img.naturalWidth || img.width;
        skinCanvas.height = img.naturalHeight || img.height;
        skinCanvas.getContext("2d")!.drawImage(img, 0, 0);
      }

      // 4. คำนวณค่าสีผิวเฉลี่ยใน LAB space
      const ctx = skinCanvas.getContext("2d")!;
      const lab = averageSkinLab(ctx, skinCanvas.width, skinCanvas.height);

      if (!lab) {
        throw new Error("ตรวจจับสีผิวไม่เพียงพอ ลองใช้รูปที่แสงดีกว่านี้");
      }

      const C = chroma(lab.a, lab.b);
      setDebugInfo(
        `Face: ${detection ? "✅" : "⚠️ fallback"} | pixels: ${lab.count} | L: ${lab.L.toFixed(1)} | C*: ${C.toFixed(1)}`
      );

      // 5. ตัดสิน Bright / Soft
      const detectedTone = classifyTone(lab.L, lab.a, lab.b);
      console.log("[ToneResult]", detectedTone);

      setTone(detectedTone);
      dispatch({ type: "SET_TONE", payload: detectedTone });

      const result = analyzeResult({ ...state, tone: detectedTone });
      dispatch({ type: "SET_RESULT", payload: result });

      setStatus("done");
      setTimeout(() => navigate("/loading"), 1500);
    } catch (err: any) {
      console.error("Analysis error:", err?.message);
      setDebugInfo(err?.message ?? "Unknown error");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen p-6 pb-20">
      <div>
        <img
          src={backIcon}
          alt="back"
          className="max-w-9 cursor-pointer"
          onClick={() => navigate("/veins")}
        />
      </div>


      <h1 className="font-semibold mb-4 text-center text-3xl md:text-5xl text-[#8E1616]">
        Analyzing your personal color...
      </h1>

      <div className="flex flex-col items-center mt-10 gap-6">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="preview"
            className="w-60 h-80 object-cover rounded-2xl shadow-lg"
          />
        )}

        {status === "loading" && (
          <p className="text-gray-500 text-lg animate-pulse">
            Running analysis...
          </p>
        )}

        {status === "done" && tone && (
          <div className="text-center">
            <p className="text-2xl font-semibold text-[#8E1616]">
              {tone === "bright" ? "✨ Bright" : "🌸 Soft"}
            </p>
            <p className="text-gray-400 mt-2">Redirecting to your result...</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-center">
            <p className="text-red-500 text-lg">
              Something went wrong. Please try again.
            </p>
            {debugInfo && (
              <p className="text-gray-400 text-sm mt-2">{debugInfo}</p>
            )}
            <button
              onClick={() => navigate("/upload")}
              className="mt-4 text-[#8E1616] underline"
            >
              Start over
            </button>
          </div>
        )}

        {/* Debug — ลบออกก่อน deploy */}
        {debugInfo && status !== "error" && (
          <p className="text-xs text-gray-300 mt-2">{debugInfo}</p>
        )}
      </div>
    </div>
  );
}