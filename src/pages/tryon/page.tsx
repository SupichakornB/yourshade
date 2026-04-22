import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import backIcon from "@/assets/icon/ep_back.svg";
import { TRYON_SETS } from "@/data/products";
import logo from "@/assets/full-logo.png";
import type {
  ImageSegmenter,
  ImageSegmenterResult
} from "@mediapipe/tasks-vision";

// ─── Hair Color Imports ────────────────────────────────────────────────────────
import { AUTUMN_HAIR_COLORS } from "@/data/products/autumn.haircolor";
import { WINTER_HAIR_COLORS } from "@/data/products/winter.haircolor";
import { SUMMER_HAIR_COLORS } from "@/data/products/summer.haircolor";
import { SPRING_HAIR_COLORS } from "@/data/products/spring.haircolor";
import type { HairColor } from "@/data/products/autumn.haircolor";

// ─── Clothes Color (inline — ย้ายไปไฟล์แยกได้ทีหลัง) ─────────────────────────
import { SUMMER_CLOTHES_COLORS } from "@/data/products/summer.clothes";
import { WINTER_CLOTHES_COLORS } from "@/data/products/winter.clothes";
import { SPRING_CLOTHES_COLORS }  from "@/data/products/spring.clothes";
import { AUTUMN_CLOTHES_COLORS }  from "@/data/products/autumn.clothes";
import type { ClothesColor } from "@/data/products/summer.clothes";

const SEASON_CLOTHES_COLORS: Record<string, ClothesColor[]> = {
  summer: SUMMER_CLOTHES_COLORS,
  winter: WINTER_CLOTHES_COLORS,
  spring: SPRING_CLOTHES_COLORS,
  autumn: AUTUMN_CLOTHES_COLORS,
};

// ─── Types ────────────────────────────────────────────────────────────────────
type Season = "spring" | "summer" | "autumn" | "winter";
type Tab = "makeup" | "clothes" | "accessories" | "haircolor";
type Finish = "matte" | "gloss" | "shimmer" | "blush" | "liner";

interface ColorVariant {
  color: string;
  colorHex: string;
  name: string;
  finish: Finish;
}

interface TryOnProduct {
  id: string;
  name: string;
  brand: string;
  primaryImage: string;
  variants: ColorVariant[];
}

// ─── MediaPipe Types ──────────────────────────────────────────────────────────
interface Landmark { x: number; y: number; z: number }
interface FaceMeshResults {
  image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement;
  multiFaceLandmarks?: Landmark[][];
}
interface MediaPipeFaceMesh {
  setOptions: (options: Record<string, unknown>) => void;
  onResults: (callback: (results: FaceMeshResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
}
interface MediaPipeCamera {
  start: () => void;
  stop: () => void;
}

// ─── Pose Types ───────────────────────────────────────────────────────────────
interface PoseLandmark { x: number; y: number; z: number; visibility?: number }
interface PoseResults {
  poseLandmarks?: PoseLandmark[];
}
interface MediaPipePose {
  setOptions: (options: Record<string, unknown>) => void;
  onResults: (callback: (results: PoseResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
}

interface ProductImage {
  colorHex?: string;
  isPrimary?: boolean;
  color?: string;
  finish?: string;
  url?: string;
}

declare global {
  interface Window {
    FaceMesh: new (config: { locateFile: (file: string) => string }) => MediaPipeFaceMesh;
    Pose: new (config: { locateFile: (file: string) => string }) => MediaPipePose;
    Camera: new (
      video: HTMLVideoElement,
      config: { onFrame: () => Promise<void>; width: number; height: number }
    ) => MediaPipeCamera;
  }
}

// ─── Lip Landmarks ────────────────────────────────────────────────────────────
const OUTER_LIP = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
const INNER_LIP = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191];

// ─── Cheek Landmarks ──────────────────────────────────────────────────────────
const LEFT_CHEEK_INNER  = [117, 118, 101, 36,  205, 187];
const LEFT_CHEEK_OUTER  = [123, 50,  31,  228, 229, 230];
const RIGHT_CHEEK_INNER = [346, 347, 330, 266, 425, 411];
const RIGHT_CHEEK_OUTER = [352, 280, 261, 448, 449, 450];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function hexToRgba(hex: string, alpha = 0.55): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r)      h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else                h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  return [
    Math.round(hue2rgb(p, q, h + 1/3) * 255),
    Math.round(hue2rgb(p, q, h)       * 255),
    Math.round(hue2rgb(p, q, h - 1/3) * 255),
  ];
}

function guessFinish(name: string, productName: string): Finish {
  const combined = (name + productName).toLowerCase();
  if (combined.includes("liner") || combined.includes("lip liner")) return "liner";
  if (combined.includes("blush") || combined.includes("liquid blush")) return "blush";
  if (combined.includes("gloss") || combined.includes("oil") || combined.includes("glassy") || combined.includes("water tint")) return "gloss";
  if (combined.includes("shimmer") || combined.includes("glitter") || combined.includes("jewelry")) return "shimmer";
  return "matte";
}

function buildTryOnProducts(season: Season, tab: Tab): TryOnProduct[] {
  if (tab === "haircolor" || tab === "clothes") return [];
  const set = TRYON_SETS[season];
  const filtered = tab === "makeup" ? set.makeup : set.accessories;

  return filtered
    .map((p) => {
      const colorImages = (p.images as ProductImage[]).filter((img) => img.colorHex);
      if (colorImages.length === 0) return null;

      const primaryImg = (p.images as ProductImage[]).find((img) => img.isPrimary) || p.images[0] as ProductImage;
      const variants: ColorVariant[] = colorImages.map((img) => {
        const finish: Finish = (img.finish as Finish) ?? guessFinish(img.color || "", p.name);
        return {
          name: img.color || "",
          colorHex: img.colorHex!,
          color: hexToRgba(img.colorHex!, finish === "blush" ? 0.4 : 0.55),
          finish,
        };
      });

      return { id: p.id, name: p.name, brand: p.brand, primaryImage: primaryImg?.url || "", variants } as TryOnProduct;
    })
    .filter(Boolean) as TryOnProduct[];
}

function getSeasonHairColors(season: Season): HairColor[] {
  switch (season) {
    case "autumn": return AUTUMN_HAIR_COLORS;
    case "winter": return WINTER_HAIR_COLORS;
    case "summer": return SUMMER_HAIR_COLORS;
    case "spring": return SPRING_HAIR_COLORS;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TryOnPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const season: Season = ((location.state as { season?: string })?.season as Season) || "summer";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cameraRef = useRef<MediaPipeCamera | null>(null);
  const smoothLandmarksRef = useRef<Landmark[] | null>(null);

  const lipColorRef      = useRef<string>("rgba(220,20,60,0.5)");
  const lipFinishRef     = useRef<Finish>("matte");
  const hairColorRef     = useRef<string | null>(null);
  const clothesColorRef  = useRef<string | null>(null);
  const poseLandmarksRef = useRef<PoseLandmark[] | null>(null);
const hairSegmenterRef = useRef<ImageSegmenter | null>(null);
  const hairSegReadyRef  = useRef(false);
  const applyMakeupRef   = useRef(false);

  const texturesRef = useRef<Record<string, HTMLImageElement>>({
    matte: new Image(),
    gloss: new Image(),
    shimmer: new Image(),
  });

  const [activeTab, setActiveTab]               = useState<Tab>("makeup");
  const [selectedProduct, setSelectedProduct]   = useState<TryOnProduct | null>(null);
  const [activeVariantIdx, setActiveVariantIdx] = useState<number | null>(null);
  const [products, setProducts]                 = useState<TryOnProduct[]>([]);
  const [isCameraReady, setIsCameraReady]       = useState(false);
  const [mediapipeLoaded, setMediapipeLoaded]   = useState(false);
  const [selectedHairColor, setSelectedHairColor] = useState<HairColor | null>(null);
  const [selectedClothesColor, setSelectedClothesColor] = useState<ClothesColor | null>(null);

  // ── Per-tab saved UI state (ไม่แตะ AR refs — effect ทำงานต่อเนื่องข้าม tab) ──
  const tabUIStateRef = useRef<Record<string, {
    selectedProduct: TryOnProduct | null;
    activeVariantIdx: number | null;
  }>>({});

  const handleSetActiveTab = (newTab: Tab) => {
    // บันทึก UI state ของ tab เก่า
    tabUIStateRef.current[activeTab] = { selectedProduct, activeVariantIdx };

    // Restore UI state ของ tab ใหม่ (ถ้ามี) หรือ reset UI เฉยๆ
    // *** ไม่แตะ lipColorRef / hairColorRef / applyMakeupRef เลย ***
    const saved = tabUIStateRef.current[newTab];
    if (saved) {
      setSelectedProduct(saved.selectedProduct);
      setActiveVariantIdx(saved.activeVariantIdx);
    } else {
      setSelectedProduct(null);
      setActiveVariantIdx(null);
    }

    setActiveTab(newTab);
  };

  useEffect(() => {
    setProducts(buildTryOnProducts(season, activeTab));
  }, [season, activeTab]);

  useEffect(() => {
    texturesRef.current.matte.src   = "/textures/lip-matte-noise.png";
    texturesRef.current.gloss.src   = "/textures/lip-gloss.png";
    texturesRef.current.shimmer.src = "/textures/lip-shimmer.png";
  }, []);

  // ── โหลด MediaPipe Hair Segmenter ─────────────────────────────────────
  useEffect(() => {
    if (hairSegReadyRef.current) return;
    hairSegReadyRef.current = true;
    (async () => {
      try {
        // dynamic import — ต้อง npm install @mediapipe/tasks-vision
        const { ImageSegmenter, FilesetResolver } = await import("@mediapipe/tasks-vision");
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
        );
        hairSegmenterRef.current = await ImageSegmenter.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/image_segmenter/hair_segmenter/float32/latest/hair_segmenter.tflite",
            delegate: "GPU",
          },
          outputCategoryMask:    false,
          outputConfidenceMasks: true,
          runningMode: "VIDEO",
        });
        console.log("[HairSegmenter] ready ✓");
      } catch (e) {
        console.error("[HairSegmenter] failed to load:", e);
      }
    })();
  }, []);

  useEffect(() => {
    const isLoaded = () => typeof window.FaceMesh !== "undefined" && typeof window.Camera !== "undefined";
    if (isLoaded()) { setMediapipeLoaded(true); return; }
    const loadScript = (src: string): Promise<void> =>
      new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = src; s.onload = () => res(); s.onerror = () => rej();
        document.head.appendChild(s);
      });
    Promise.all([
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"),
      loadScript("https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"),
    ]).then(() => setMediapipeLoaded(true)).catch(console.error);
  }, []);

  // ── MediaPipe Pose — detect ไหล่จริง ──────────────────────────────────
  useEffect(() => {
    if (!mediapipeLoaded) return;
    const video = videoRef.current;
    if (!video) return;

    let destroyed = false;
    let rafId: number;

    const pose = new window.Pose({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    pose.setOptions({
      modelComplexity: 0,       // 0=lite เร็วที่สุด
      smoothLandmarks: true,
      enableSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    pose.onResults((results: PoseResults) => {
      if (results.poseLandmarks) {
        poseLandmarksRef.current = results.poseLandmarks;
      }
    });

    // วน loop แยกจาก FaceMesh — ทุก ~3 frame (ไหล่ไม่ต้องอัปเดตทุก frame)
    let frameCount = 0;
    const loop = async () => {
      if (destroyed) return;
      frameCount++;
      if (frameCount % 3 === 0 && video.readyState >= 2) {
        try { await pose.send({ image: video }); } catch { /* ignore */ }
      }
      rafId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
    };
  }, [mediapipeLoaded]);

  const smoothPoints = useCallback((newPoints: Landmark[]) => {
    if (!smoothLandmarksRef.current) {
      smoothLandmarksRef.current = newPoints.map((p) => ({ ...p }));
      return smoothLandmarksRef.current;
    }
    const alpha = 0.35;
    for (let i = 0; i < newPoints.length; i++) {
      smoothLandmarksRef.current[i].x = smoothLandmarksRef.current[i].x * alpha + newPoints[i].x * (1 - alpha);
      smoothLandmarksRef.current[i].y = smoothLandmarksRef.current[i].y * alpha + newPoints[i].y * (1 - alpha);
    }
    return smoothLandmarksRef.current;
  }, []);

  // ── Draw ───────────────────────────────────────────────────────────────────
  const drawFace = useCallback((results: FaceMeshResults) => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ── object-cover: วาด video เต็ม canvas โดยไม่บีบ ──
    const imgW = video.videoWidth  || 1280;
    const imgH = video.videoHeight || 720;
    const coverScale = Math.max(canvas.width / imgW, canvas.height / imgH);
    const drawW   = imgW * coverScale;
    const drawH   = imgH * coverScale;
    const offsetX = (canvas.width  - drawW) / 2;
    const offsetY = (canvas.height - drawH) / 2;

    // Mirror video with cover
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

    const landmarks = smoothPoints(results.multiFaceLandmarks[0]);
    const getXY = (i: number) => ({
      x: (1 - landmarks[i].x) * drawW + offsetX,
      y: landmarks[i].y * drawH + offsetY,
    });

    // ════════════════════════════════════
    // 💇 HAIR COLOR — MediaPipe Hair Segmenter
    // ════════════════════════════════════
    if (hairColorRef.current && hairSegmenterRef.current) {
      // ส่ง results.image (frame ปัจจุบันจาก FaceMesh pipeline) เข้า segmenter
      // ไม่ใช้ videoRef เพราะ timing อาจไม่ตรง
const segResult = hairSegmenterRef.current?.segmentForVideo(
  results.image as HTMLVideoElement, // 👈 สำคัญ
  performance.now()
) as ImageSegmenterResult;

      // confidenceMasks[1] = hair confidence 0.0–1.0
      const hairMask = segResult?.confidenceMasks?.[1];
      if (hairMask) {
        const rawMask = hairMask.getAsFloat32Array() as Float32Array;
        const maskW   = hairMask.width  as number;
        const maskH   = hairMask.height as number;

        // ── Erode mask: ทุก pixel ใช้ค่า min ของตัวเอง + เพื่อนบ้าน 8 ทิศ ──
        // ทำให้ขอบผมหด inward → ไม่เลือดออกนอกเส้นผม
        const ERODE_R = 2; // radius erosion (pixel บน mask 512×512)
        const erodedMask = new Float32Array(maskW * maskH);
        for (let my = 0; my < maskH; my++) {
          for (let mx = 0; mx < maskW; mx++) {
            let minVal = rawMask[my * maskW + mx];
            for (let dy = -ERODE_R; dy <= ERODE_R; dy++) {
              for (let dx = -ERODE_R; dx <= ERODE_R; dx++) {
                const nx = mx + dx, ny = my + dy;
                if (nx < 0 || nx >= maskW || ny < 0 || ny >= maskH) continue;
                const v = rawMask[ny * maskW + nx];
                if (v < minVal) minVal = v;
              }
            }
            erodedMask[my * maskW + mx] = minVal;
          }
        }

        // parse target hair color → H, S
        const hex = hairColorRef.current!.replace("#", "");
        const tR  = parseInt(hex.slice(0, 2), 16);
        const tG  = parseInt(hex.slice(2, 4), 16);
        const tB  = parseInt(hex.slice(4, 6), 16);
        const [tH, tS] = rgbToHsl(tR, tG, tB);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels  = imgData.data;
        const cW = canvas.width;
        const cH = canvas.height;

        // smoothstep: เส้นโค้งที่ตัดขอบชัด ไม่ linear
        const smoothstep = (edge0: number, edge1: number, x: number) => {
          const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
          return t * t * (3 - 2 * t);
        };

        for (let y = 0; y < cH; y++) {
          for (let x = 0; x < cW; x++) {
            const videoX = cW - 1 - x;
            const relX = (videoX - offsetX) / drawW;
            const relY = (y - offsetY) / drawH;
            if (relX < 0 || relX > 1 || relY < 0 || relY > 1) continue;
            const mx = Math.min(maskW - 1, Math.round(relX * maskW));
            const my = Math.min(maskH - 1, Math.round(relY * maskH));

            const conf = erodedMask[my * maskW + mx];

            // smoothstep: ต่ำกว่า 0.55 = 0, สูงกว่า 0.80 = 1 → ตัดขอบคม
            const edgeMask = smoothstep(0.55, 0.80, conf);
            if (edgeMask < 0.01) continue;

            const i = (y * cW + x) * 4;
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];

            // HSL hue-shift: คง L ไว้ → texture เส้นผมยังอยู่
            const [, , l] = rgbToHsl(r, g, b);
            // ผมเข้ม (l ต่ำ) blend เต็ม, highlight blend น้อย
            const depthFactor = Math.min(1, (1 - l) * 1.5 + 0.25);
            const strength    = edgeMask * depthFactor;

            const [nr, ng, nb] = hslToRgb(tH, tS * 0.92, l);
            pixels[i]     = Math.round(r + (nr - r) * strength);
            pixels[i + 1] = Math.round(g + (ng - g) * strength);
            pixels[i + 2] = Math.round(b + (nb - b) * strength);
          }
        }

        ctx.putImageData(imgData, 0, 0);
        hairMask.close();
      }
    }

    // ════════════════════════════════════
    // 👗 CLOTHES — จับไหล่จาก MediaPipe Pose
    // ════════════════════════════════════
    if (clothesColorRef.current) {
      const hex = clothesColorRef.current;
      const cW  = canvas.width;
      const cH  = canvas.height;
      const r   = parseInt(hex.slice(1, 3), 16);
      const g   = parseInt(hex.slice(3, 5), 16);
      const b   = parseInt(hex.slice(5, 7), 16);

      // ── Fixed shirt position — ไม่ขยับตามร่างกาย ──────────────────────
      const leftShoulderX  = 0;
      const rightShoulderX = cW;
      const leftShoulderY  = cH * 0.64;
      const rightShoulderY = cH * 0.64;
      const neckCenterX    = cW / 2;
      const neckHalfW      = cW * 0.23;
      const neckTopY       = cH * 0.56;
      const neckBotY       = neckTopY + cW * 0.22;

      // ── วาด shirt path ────────────────────────────────────────────
      ctx.save();
      const shirtPath = new Path2D();

      // ซ้ายสุด canvas → เฉียงขึ้นไหล่ซ้าย → คอซ้าย
      shirtPath.moveTo(0, leftShoulderY + Math.abs(leftShoulderX) * 0.15);
      shirtPath.lineTo(neckCenterX - neckHalfW, neckTopY);

      // crew neck โค้ง
      shirtPath.bezierCurveTo(
        neckCenterX - neckHalfW * 0.3, neckBotY,
        neckCenterX + neckHalfW * 0.3, neckBotY,
        neckCenterX + neckHalfW, neckTopY
      );

      // คอขวา → ไหล่ขวา → ขวาสุด canvas → ล่างสุด
      shirtPath.lineTo(cW, rightShoulderY + Math.abs(cW - rightShoulderX) * 0.15);
      shirtPath.lineTo(cW, cH);
      shirtPath.lineTo(0, cH);
      shirtPath.closePath();

      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill(shirtPath);

      // ── เงา: บนไหล่เข้มกว่า (แสงมาจากบน) ──
      const topShadow = ctx.createLinearGradient(0, neckTopY, 0, cH);
      topShadow.addColorStop(0,    "rgba(0, 0, 0, 0.09)");
      topShadow.addColorStop(0.18, "rgba(0,0,0,0.08)");
      topShadow.addColorStop(0.5,  "rgba(0,0,0,0)");
      topShadow.addColorStop(1,    "rgba(0,0,0,0.15)");
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = topShadow;
      ctx.fill(shirtPath);

      // ── เงาขอบซ้าย/ขวา (เสื้อโค้งเข้า) ──
      const sideShadow = ctx.createLinearGradient(0, 0, cW, 0);
      sideShadow.addColorStop(0,    "rgba(0, 0, 0, 0.1)");
      sideShadow.addColorStop(0.15, "rgba(0,0,0,0)");
      sideShadow.addColorStop(0.85, "rgba(0,0,0,0)");
      sideShadow.addColorStop(1,    "rgba(0, 0, 0, 0.04)");
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = sideShadow;
      ctx.fill(shirtPath);

      // // ── highlight กลางอก (แสงสะท้อน) ──
      // const highlight = ctx.createRadialGradient(
      //   neckCenterX, neckBotY + (cH - neckBotY) * 0.15, 0,
      //   neckCenterX, neckBotY + (cH - neckBotY) * 0.25, cW * 0.28
      // );
      // highlight.addColorStop(0,   "rgba(255,255,255,0.13)");
      // highlight.addColorStop(0.5, "rgba(255,255,255,0.04)");
      // highlight.addColorStop(1,   "rgba(255,255,255,0)");
      // ctx.globalCompositeOperation = "screen";
      // ctx.fillStyle = highlight;
      // ctx.fill(shirtPath);

      // ── เงาใน neckline (ลึกกว่าพื้นเสื้อ) ──
      // const neckShadow = ctx.createRadialGradient(
      //   neckCenterX, neckBotY, 0,
      //   neckCenterX, neckBotY, neckHalfW * 1.4
      // );
      // neckShadow.addColorStop(0,   "rgba(255, 255, 255, 0.18)");
      // neckShadow.addColorStop(0.5, "rgba(255, 255, 255, 0.1)");
      // neckShadow.addColorStop(1,   "rgba(0,0,0,0)");
      // ctx.globalCompositeOperation = "multiply";
      // ctx.fillStyle = neckShadow;
      // ctx.fill(shirtPath);

      ctx.restore();
    }

    // ── Skip makeup if no filter selected ────────────────────────────────
    if (!applyMakeupRef.current) return;

    const finish = lipFinishRef.current;
    const color  = lipColorRef.current;

    // ════════════════════════════════════
    // 🌸 BLUSH
    // ════════════════════════════════════
    if (finish === "blush") {
      const cheekSides = [
        { inner: LEFT_CHEEK_INNER,  outer: LEFT_CHEEK_OUTER  },
        { inner: RIGHT_CHEEK_INNER, outer: RIGHT_CHEEK_OUTER },
      ];

      cheekSides.forEach(({ inner, outer }) => {
        let ix = 0, iy = 0;
        inner.forEach((idx) => { ix += getXY(idx).x; iy += getXY(idx).y; });
        ix /= inner.length; iy /= inner.length;

        let ox = 0, oy = 0;
        outer.forEach((idx) => { ox += getXY(idx).x; oy += getXY(idx).y; });
        ox /= outer.length; oy /= outer.length;

        const cx = ix * 0.35 + ox * 0.65;
        const cy = (iy + oy) / 2 - Math.abs(oy - iy) * 0.25;
        const halfW = Math.sqrt((ox - ix) ** 2 + (oy - iy) ** 2) * 2.75;
        const halfH = halfW * 0.75;
        const angle = Math.atan2(oy - iy, ox - ix);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(1, halfH / halfW);

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, halfW);
        grad.addColorStop(0,    color.replace(/[\d.]+\)$/, "0.5)"));
        grad.addColorStop(0.3,  color.replace(/[\d.]+\)$/, "0.32)"));
        grad.addColorStop(0.65, color.replace(/[\d.]+\)$/, "0.12)"));
        grad.addColorStop(1,    color.replace(/[\d.]+\)$/, "0)"));

        ctx.globalCompositeOperation = "multiply";
        ctx.filter = "blur(25px)";
        ctx.fillStyle = grad;
        ctx.fillRect(-halfW * 1.1, -halfW * 1.1, halfW * 2.2, halfW * 2.2);
        ctx.restore();
      });

      return;
    }

    // ════════════════════════════════════
    // 💋 LINER
    // ════════════════════════════════════
    if (finish === "liner") {
      const linerPairs: [number[], "outer" | "inner"][] = [
        [OUTER_LIP, "outer"],
        [INNER_LIP, "inner"],
      ];

      linerPairs.forEach(([lipPoints]) => {
        const path = new Path2D();
        lipPoints.forEach((idx, i) => {
          const pt = getXY(idx);
          if (i === 0) { path.moveTo(pt.x, pt.y); } else { path.lineTo(pt.x, pt.y); }
        });
        path.closePath();

        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.filter = "blur(2.5px)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 5;
        ctx.lineJoin = "round";
        ctx.lineCap  = "round";
        ctx.stroke(path);
        ctx.restore();
      });

      const combinedPath = new Path2D();
      OUTER_LIP.forEach((idx, i) => {
        const pt = getXY(idx);
        if (i === 0) { combinedPath.moveTo(pt.x, pt.y); } else { combinedPath.lineTo(pt.x, pt.y); }
      });
      combinedPath.closePath();
      INNER_LIP.forEach((idx, i) => {
        const pt = getXY(idx);
        if (i === 0) { combinedPath.moveTo(pt.x, pt.y); } else { combinedPath.lineTo(pt.x, pt.y); }
      });
      combinedPath.closePath();

      ctx.save();
      ctx.clip(combinedPath, "evenodd");
      ctx.globalCompositeOperation = "multiply";
      ctx.filter = "blur(3px)";
      ctx.fillStyle = color.replace(/[\d.]+\)$/, "0.18)");
      ctx.fill(combinedPath, "evenodd");
      ctx.restore();

      return;
    }

    // ════════════════════════════════════
    // 💄 LIP
    // ════════════════════════════════════
    const combinedPath = new Path2D();
    OUTER_LIP.forEach((idx, i) => {
      const pt = getXY(idx);
      if (i === 0) { combinedPath.moveTo(pt.x, pt.y); } else { combinedPath.lineTo(pt.x, pt.y); }
    });
    combinedPath.closePath();
    INNER_LIP.forEach((idx, i) => {
      const pt = getXY(idx);
      if (i === 0) { combinedPath.moveTo(pt.x, pt.y); } else { combinedPath.lineTo(pt.x, pt.y); }
    });
    combinedPath.closePath();

    ctx.save();
    ctx.clip(combinedPath, "evenodd");

    // Base color
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.filter = "blur(1.5px)";
    ctx.fillStyle = color;
    ctx.fill(combinedPath, "evenodd");
    ctx.restore();

    // Shading
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    OUTER_LIP.forEach((i) => {
      const pt = getXY(i);
      minX = Math.min(minX, pt.x); minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x); maxY = Math.max(maxY, pt.y);
    });
    const cX = minX + (maxX - minX) / 2;
    const cY = minY + (maxY - minY) / 2;
    const lipSize = Math.max(maxX - minX, maxY - minY);
    const grad = ctx.createRadialGradient(cX, cY, lipSize * 0.2, cX, cY, lipSize * 0.8);
    grad.addColorStop(0, "rgba(255,255,255,0.2)");
    grad.addColorStop(0.5, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = grad;
    ctx.fill(combinedPath, "evenodd");

    // Texture
    const tex = texturesRef.current[finish];
    if (tex && tex.complete && tex.naturalWidth > 0) {
      ctx.globalCompositeOperation = finish === "matte" ? "multiply" : "screen";
      ctx.globalAlpha = 0.3;
      ctx.drawImage(tex, minX, minY, maxX - minX, maxY - minY);
    }

    ctx.restore();
  }, [smoothPoints]);

  useEffect(() => {
    if (!mediapipeLoaded) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let destroyed = false;
    let rvfcId: number | null = null;

    const faceMesh = new window.FaceMesh({
  locateFile: (file) =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`,
});
    faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
    faceMesh.onResults(drawFace);

    // ── frame loop ใช้ requestVideoFrameCallback (ถ้าบราวเซอร์รองรับ)
    // หรือ fallback เป็น requestAnimationFrame ถ้าไม่รองรับ
    const startFrameLoop = () => {
      const sendFrame = async () => {
        if (destroyed) return;
        if (video.readyState >= 2) {
          try { await faceMesh.send({ image: video }); } catch { /* ignore */ }
        }
        if ("requestVideoFrameCallback" in video) {
          rvfcId = (video as HTMLVideoElement & { requestVideoFrameCallback: (cb: () => void) => number })
            .requestVideoFrameCallback(sendFrame);
        } else {
          rvfcId = requestAnimationFrame(sendFrame) as unknown as number;
        }
      };
      sendFrame();
    };

    // ── sync canvas buffer ให้ตรงกับ container จริง ──
    const syncCanvasSize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w || 382;
        canvas.height = h || 510;
        smoothLandmarksRef.current = null;
      }
    };

    // ── ประกาศก่อน getUserMedia เพื่อให้ cleanup เข้าถึงได้ ──
    const resizeObserver = new ResizeObserver(() => syncCanvasSize());
    resizeObserver.observe(canvas);

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((stream) => {
        if (destroyed) { stream.getTracks().forEach((t) => t.stop()); return; }
        video.srcObject = stream;

        const onCanPlay = () => {
          video.removeEventListener("canplay", onCanPlay);
          if (destroyed) return;

          syncCanvasSize(); // ← แทน videoWidth/videoHeight

          video.play().then(() => {
            setIsCameraReady(true);
            // ใช้ frame loop โดยตรง — ไม่ใช้ window.Camera เพราะมัน crop/zoom frame
            startFrameLoop();
          }).catch((err) => {
            console.error("[Camera] video.play() failed:", err);
            video.muted = true;
            video.play().then(() => { setIsCameraReady(true); startFrameLoop(); }).catch(console.error);
          });
        };

        video.addEventListener("canplay", onCanPlay);
        setTimeout(() => {
          if (!destroyed && !isCameraReady) {
            video.removeEventListener("canplay", onCanPlay);
            onCanPlay();
          }
        }, 5000);
      })
      .catch((err) => {
        console.error("[Camera] getUserMedia failed:", err);
      });

    return () => {
      destroyed = true;
      resizeObserver.disconnect(); // ✅ เข้าถึงได้แล้ว
      if (cameraRef.current?.stop) cameraRef.current.stop();
      if (rvfcId !== null) {
        if ("cancelVideoFrameCallback" in video) {
          (video as HTMLVideoElement & { cancelVideoFrameCallback: (id: number) => void })
            .cancelVideoFrameCallback(rvfcId);
        } else {
          cancelAnimationFrame(rvfcId as unknown as number);
        }
      }
      const tracks = (video.srcObject as MediaStream)?.getTracks?.();
      tracks?.forEach((t) => t.stop());
    };
  }, [mediapipeLoaded, drawFace]);
  const handleSelectVariant = (product: TryOnProduct, variantIdx: number) => {
    const variant = product.variants[variantIdx];
    lipColorRef.current  = variant.color;
    lipFinishRef.current = variant.finish;
    applyMakeupRef.current = true;
    setSelectedProduct(product);
    setActiveVariantIdx(variantIdx);
  };

  const handleSelectHairColor = (hairColor: HairColor) => {
    hairColorRef.current = hairColor.colorHex;
    setSelectedHairColor(hairColor);
  };

  const handleClearHairColor = () => {
    hairColorRef.current = null;
    setSelectedHairColor(null);
  };

  const handleClearMakeup = () => {
    applyMakeupRef.current = false;
    setSelectedProduct(null);
    setActiveVariantIdx(null);
  };

  const tabConfig: { key: Tab; label: string;}[] = [
    { key: "makeup",      label: "Makeup"},
    { key: "haircolor",   label: "Hair"},
    { key: "clothes",     label: "Clothes"},
  ];

  const seasonHairColors = getSeasonHairColors(season);
  const seasonClothesColors: ClothesColor[] = SEASON_CLOTHES_COLORS[season] ?? [];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
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

      {/* Camera */}
      <div>
<div
  className="relative w-[384px] h-[512px] xl:w-[660px] xl:h-[440px] 2xl:w-[976px] 2xl:h-[674px] mx-auto rounded-3xl overflow-hidden border border-gray"
>
  <video
    ref={videoRef}
    autoPlay
    muted
    playsInline
    className="w-full h-full object-cover"
    style={{ transform: "scaleX(-1)" }}
  />
  
  <canvas
    ref={canvasRef}
    className="absolute inset-0 w-full h-full"
  />

  {!isCameraReady && (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-2">
      <div className="w-10 h-10 border-4 border-[#8E1616] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm">
        {mediapipeLoaded ? "Starting camera..." : "Loading AR..."}
      </p>
    </div>
  )}
</div>
  {/* Badge — makeup */}


</div>

      {/* Controls */}
      <div className="mx-auto w-[382px] h-[200px] xl:w-[1276px] xl:h-[328px] 2xl:w-[1276px] 2xl:h-[330px] bg-white rounded-2xl shadow-md px-4 py-4 xl:px-6 xl:py-6 2xl:py-6 2xl:px-6 mt-4 xl:mt-6 2xl:mt-6 flex flex-col">
        {/* Tabs */}
        <div className="flex gap-2 mb-3 xl:px-32 2xl:px-32">
          {tabConfig.map(({ key, label}) => (
            <button key={key} onClick={() => handleSetActiveTab(key)}
              className={`flex-1 rounded-full font-inter text-[20px] xl:text-[20px] 2xl:text-[24px] font-semibold capitalize transition ${
                activeTab === key ? "bg-[#8E1616] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
            >
              <span className="mr-1"></span>{label}
            </button>
          ))}
        </div>

        {/* ── Hair Color Panel ── */}
{activeTab === "haircolor" && (
  <div className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium">
        Color : {selectedHairColor && (
          <span className="text-xs text-[#8E1616] font-medium">
            {selectedHairColor.name}
          </span>
        )}
      </p>
    </div>
    <div className="flex-1 flex items-center justify-center overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-4 min-w-max">
        {/* No Filter */}
              {/* No Filter swatch */}
              <button
                title="No Filter"
                onClick={handleClearHairColor}
                className={`relative w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform hover:scale-110 flex items-center justify-center bg-gray-100 ${
                  selectedHairColor === null
                    ? "border-[#8E1616] scale-110"
                    : "border-white"
                }`}
              >
                <svg viewBox="0 0 36 36" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="14" stroke="#9CA3AF" strokeWidth="2.5"/>
                  <line x1="7" y1="29" x2="29" y2="7" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                {selectedHairColor === null && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-[#8E1616] ring-offset-1" />
                )}
              </button>
              {seasonHairColors.map((hc) => (
                <button
                  key={hc.id}
                  title={hc.name}
                  onClick={() => handleSelectHairColor(hc)}
                  className={`relative w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform hover:scale-110 ${
                    selectedHairColor?.id === hc.id
                      ? "border-[#8E1616] scale-110"
                      : "border-white"
                  }`}
                  style={{ backgroundColor: hc.colorHex }}
                >
                  {selectedHairColor?.id === hc.id && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-[#8E1616] ring-offset-1" />
                  )}
                </button>
              ))}
            </div>
            </div>

            
          </div>
        )}

        {/* ── Makeup / Accessories Panel ── */}
        {activeTab !== "haircolor" && activeTab !== "clothes" && (
          <>
            {products.length === 0 ? (
              <p className="text-center text-sm py-4">
                No {activeTab} products for {season} season
              </p>
            ) : (
              <div className="flex gap-3 overflow-x-auto py-4 xl:py-6 2xl:py-6 scrollbar-hide mx-auto px-4">
                {/* No Filter card */}
                <button
                  onClick={handleClearMakeup}
                  className={`flex-none flex flex-col items-center gap-1 p-1 rounded-xl transition ${
                    selectedProduct === null
                      ? "ring-2 ring-[#8E1616] bg-red-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-[75px] h-[75px] rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center">
                    <svg viewBox="0 0 36 36" width="32" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="14" stroke="#9CA3AF" strokeWidth="2.2"/>
                      <line x1="7" y1="29" x2="29" y2="7" stroke="#9CA3AF" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="text-[10px] text-gray-600 max-w-[60px] text-center leading-tight">
                    No Filter
                  </span>
                </button>
                {products.map((product) => (
                  <button key={product.id}
                    onClick={() => { setSelectedProduct(product); setActiveVariantIdx(null); }}
                    className={`flex-none flex flex-col items-center gap-1 p-1 rounded-xl transition ${
                      selectedProduct?.id === product.id
                        ? "ring-2 ring-[#8E1616] bg-red-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <img src={product.primaryImage} alt={product.name}
                      className="w-[75px] h-[75px] rounded-lg object-cover border border-gray-100" />
                    <span className="text-[10px] max-w-[60px] text-center leading-tight line-clamp-2">
                      {product.name.replace(/^4U2 /i, "")}
                    </span>
                  </button>
                ))}
              </div>
            )}


            {selectedProduct && selectedProduct.variants.length > 0 && (
              <div className="pt-4 xl:pt-6 2xl:pt-6 border-t border-gray-100">
<p className="text-xs font-medium">
  Color : {selectedProduct.variants[activeVariantIdx] && (
    <span className="text-xs text-[#8E1616] font-medium">
      {selectedProduct.variants[activeVariantIdx].name}
    </span>
  )}
</p>

                <div className="flex flex-wrap gap-3 justify-center">
                  {selectedProduct.variants.map((variant, idx) => (
                    <button key={idx} title={variant.name}
                      onClick={() => handleSelectVariant(selectedProduct, idx)}
                      className={`relative w-9 h-9 rounded-full border-[3px] shadow-sm transition-transform hover:scale-110 ${
                        activeVariantIdx === idx ? "border-[#8E1616] scale-110" : "border-white"
                      }`}
                      style={{ backgroundColor: variant.colorHex }}
                    >
                      {activeVariantIdx === idx && (
                        <span className="absolute inset-0 rounded-full ring-2 ring-[#8E1616] ring-offset-1" />
                      )}
                    </button>
                  ))}
                </div>

              </div>
            )}

            {selectedProduct && selectedProduct.variants.length === 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 text-center text-xs text-gray-400">
                AR try-on for accessories coming soon
              </div>
            )}
          </>
        )}

        {/* ── Clothes Color Panel ── */}
{activeTab === "clothes" && (
  <div className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium">
        Color : {selectedClothesColor && (
          <span className="text-xs text-[#8E1616] font-medium">
            {selectedClothesColor.name}
          </span>
        )}
      </p>
    </div>
    <div className="flex-1 flex items-center justify-center overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 px-4 min-w-max">
        {/* No Color */}
              {/* No Color */}
              <button
                title="No Color"
                onClick={() => { clothesColorRef.current = null; setSelectedClothesColor(null); }}
                className={`relative w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform hover:scale-110 flex items-center justify-center bg-gray-100 ${
                  selectedClothesColor === null ? "border-[#8E1616] scale-110" : "border-white"
                }`}
              >

                
                <svg viewBox="0 0 36 36" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="18" cy="18" r="14" stroke="#9CA3AF" strokeWidth="2.5"/>
                  <line x1="7" y1="29" x2="29" y2="7" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                {selectedClothesColor === null && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-[#8E1616] ring-offset-1" />
                )}
              </button>


              {seasonClothesColors.map((cc) => (
                <button
                  key={cc.id}
                  title={cc.name}
                  onClick={() => { clothesColorRef.current = cc.colorHex; setSelectedClothesColor(cc); }}
                  className={`relative w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform hover:scale-110 ${
                    selectedClothesColor?.id === cc.id ? "border-[#8E1616] scale-110" : "border-white"
                  }`}
                  style={{ backgroundColor: cc.colorHex }}
                >
                  {selectedClothesColor?.id === cc.id && (
                    <span className="absolute inset-0 rounded-full ring-2 ring-[#8E1616] ring-offset-1" />
                  )}
                </button>
              ))}
            </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}