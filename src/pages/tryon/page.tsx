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
type Finish = "matte" | "gloss" | "shimmer" | "blush" | "liner" | "eye" | "contour";

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

// ─── Eye Shadow Landmarks ─────────────────────────────────────────────────────
const LEFT_EYE_UPPER  = [246, 161, 160, 159, 158, 157, 173];
const LEFT_EYE_INNER  = 133;
const LEFT_EYE_OUTER  = 33;

const RIGHT_EYE_UPPER = [466, 388, 387, 386, 385, 384, 398];
const RIGHT_EYE_INNER = 362;
const RIGHT_EYE_OUTER = 263;

const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];

// ─── Contour / Highlight Landmarks ───────────────────────────────────────────
const NOSE_TIP_IDX       = 4;
const NOSE_BRIDGE_IDX    = 168;
const LEFT_NOSE_ALA_IDX  = 129;
const RIGHT_NOSE_ALA_IDX = 358;
const LEFT_TEMPLE_IDX    = 21;
const RIGHT_TEMPLE_IDX   = 251;
const FOREHEAD_TOP_IDX   = 10;
const CHIN_IDX           = 152;
const LEFT_JAW_IDX       = 172;
const RIGHT_JAW_IDX      = 397;
const LEFT_CHEEK_HL_IDX  = 116;
const RIGHT_CHEEK_HL_IDX = 345;
const LEFT_EYE_IN_IDX    = 133;
const RIGHT_EYE_IN_IDX   = 362;
const LEFT_CHEEK_SHADOW_OUTER_IDX  = 123;
const LEFT_CHEEK_SHADOW_INNER_IDX  = 205;
const RIGHT_CHEEK_SHADOW_OUTER_IDX = 352;
const RIGHT_CHEEK_SHADOW_INNER_IDX = 425;

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
  if (combined.includes("shimmer")) return "shimmer";
  if (combined.includes("jewelry") || combined.includes("glitter")) return "eye";
  if (combined.includes("contour")) return "contour";
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
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);
const hairSegmenterRef = useRef<ImageSegmenter | null>(null);
  const hairSegReadyRef  = useRef(false);
const cachedHairMaskRef  = useRef<Float32Array | null>(null);
const cachedMaskDimsRef  = useRef({ w: 0, h: 0 });
const hairSegFrameRef    = useRef(0);

const [hairSegReady, setHairSegReady] = useState(false);


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
            delegate: "CPU",
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
if (hairColorRef.current && hairSegmenterRef.current) {
  hairSegFrameRef.current = (hairSegFrameRef.current + 1) % 3;

  if (hairSegFrameRef.current === 0 || !cachedHairMaskRef.current) {
    const segResult = hairSegmenterRef.current.segmentForVideo(
      results.image as HTMLVideoElement,
      performance.now()
    ) as ImageSegmenterResult;

    const hairMask = segResult?.confidenceMasks?.[1];
    if (hairMask) {
      const newRaw = hairMask.getAsFloat32Array() as Float32Array;
      const mW     = hairMask.width  as number;
      const mH     = hairMask.height as number;

      if (
        cachedHairMaskRef.current &&
        cachedHairMaskRef.current.length === newRaw.length
      ) {
        const ALPHA = 0.55;
        for (let i = 0; i < newRaw.length; i++) {
          cachedHairMaskRef.current[i] =
            cachedHairMaskRef.current[i] * (1 - ALPHA) + newRaw[i] * ALPHA;
        }
      } else {
        cachedHairMaskRef.current = new Float32Array(newRaw);
      }

      cachedMaskDimsRef.current = { w: mW, h: mH };
      hairMask.close();
    }
  }

  const smoothedMask = cachedHairMaskRef.current;
  const maskW        = cachedMaskDimsRef.current.w;
  const maskH        = cachedMaskDimsRef.current.h;

  if (smoothedMask && maskW > 0) {
    // ── 1. Snapshot frame ก่อนทาสี (ใช้ restore หน้า) ──────────────
    if (!tempCanvasRef.current) {
      tempCanvasRef.current = document.createElement("canvas");
    }
    const tmpC = tempCanvasRef.current;
    if (tmpC.width !== canvas.width || tmpC.height !== canvas.height) {
      tmpC.width  = canvas.width;
      tmpC.height = canvas.height;
    }
    tmpC.getContext("2d")!.drawImage(canvas, 0, 0);

    // ── 2. ทาสีผม per-pixel ────────────────────────────────────────
    const hex = hairColorRef.current.replace("#", "");
    const tR  = parseInt(hex.slice(0, 2), 16);
    const tG  = parseInt(hex.slice(2, 4), 16);
    const tB  = parseInt(hex.slice(4, 6), 16);
    const [tH, tS] = rgbToHsl(tR, tG, tB);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels  = imgData.data;
    const cW = canvas.width;
    const cH = canvas.height;

    const smoothstep = (e0: number, e1: number, x: number) => {
      const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
      return t * t * (3 - 2 * t);
    };

    for (let y = 0; y < cH; y++) {
      for (let x = 0; x < cW; x++) {
        const relX = ((cW - 1 - x) - offsetX) / drawW;
        const relY = (y - offsetY) / drawH;
        if (relX < 0 || relX > 1 || relY < 0 || relY > 1) continue;

        const mx   = Math.min(maskW - 1, Math.round(relX * maskW));
        const my   = Math.min(maskH - 1, Math.round(relY * maskH));
        const conf = smoothedMask[my * maskW + mx];

        const edgeMask = smoothstep(0.18, 0.58, conf);
        if (edgeMask < 0.01) continue;

        const idx = (y * cW + x) * 4;
        const r   = pixels[idx];
        const g   = pixels[idx + 1];
        const b   = pixels[idx + 2];

        const [, , l] = rgbToHsl(r, g, b);
        const highlightFade =
          l > 0.65 ? Math.pow(1 - (l - 0.65) / 0.35, 1.8) : 1.0;

        const [nr, ng, nb] = hslToRgb(tH, Math.min(1, tS * 1.05), l);
        const strength      = edgeMask * highlightFade * 0.88;

        pixels[idx]     = Math.round(r + (nr - r) * strength);
        pixels[idx + 1] = Math.round(g + (ng - g) * strength);
        pixels[idx + 2] = Math.round(b + (nb - b) * strength);
      }
    }

    ctx.putImageData(imgData, 0, 0);

    // ── 3. Face Shield — restore pixel ในโซนใบหน้ากลับ ───────────
    // สร้าง face oval path จาก landmarks ปัจจุบัน (update ทุก frame)
    const faceOvalPath = new Path2D();
    FACE_OVAL.forEach((fIdx, i) => {
      const pt = getXY(fIdx);
      if (i === 0) faceOvalPath.moveTo(pt.x, pt.y);
      else         faceOvalPath.lineTo(pt.x, pt.y);
    });
    faceOvalPath.closePath();

    ctx.save();
    ctx.clip(faceOvalPath);
    ctx.drawImage(tmpC, 0, 0); // restore หน้าเดิม ไม่มีสีผม
    ctx.restore();
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
// 🎨 CONTOUR + HIGHLIGHT
// ════════════════════════════════════
if (finish === "contour") {
  // ── parse contour RGB จาก color string ──────────────────────────────
  const cMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  const cR = cMatch ? +cMatch[1] : 130;
  const cG = cMatch ? +cMatch[2] : 80;
  const cB = cMatch ? +cMatch[3] : 40;

  // ── helper: วาด radial gradient ellipse (contour หรือ highlight) ────
  const drawZone = (
    cx: number, cy: number,
    rx: number, ry: number,
    angle: number,
    rgba: string,
    blurPx: number,
    composite: GlobalCompositeOperation,
    stops?: [number, string][]           // optional custom stops
  ) => {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(1, ry / rx);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    if (stops) {
      stops.forEach(([pos, c]) => grad.addColorStop(pos, c));
    } else {
      const base    = parseFloat(rgba.match(/[\d.]+(?=\))/)?.[0] ?? "0.4");
      grad.addColorStop(0,    rgba);
      grad.addColorStop(0.35, rgba.replace(/[\d.]+(?=\))/, String(+(base * 0.55).toFixed(2))));
      grad.addColorStop(1,    rgba.replace(/[\d.]+(?=\))/, "0"));
    }

    ctx.globalCompositeOperation = composite;
    ctx.filter = `blur(${blurPx}px)`;
    ctx.fillStyle = grad;
    ctx.fillRect(-rx * 1.3, -rx * 1.3, rx * 2.6, rx * 2.6);
    ctx.restore();
  };

  // ── geometry ─────────────────────────────────────────────────────────
  const noseTip    = getXY(NOSE_TIP_IDX);
  const noseBridge = getXY(NOSE_BRIDGE_IDX);
  const leftAla    = getXY(LEFT_NOSE_ALA_IDX);
  const rightAla   = getXY(RIGHT_NOSE_ALA_IDX);
  const leftTemple = getXY(LEFT_TEMPLE_IDX);
  const rightTemple= getXY(RIGHT_TEMPLE_IDX);
  const forehead   = getXY(FOREHEAD_TOP_IDX);
  const chin       = getXY(CHIN_IDX);
  const jawL       = getXY(LEFT_JAW_IDX);
  const jawR_pt    = getXY(RIGHT_JAW_IDX);
  const cheekHL_L  = getXY(LEFT_CHEEK_HL_IDX);
  const cheekHL_R  = getXY(RIGHT_CHEEK_HL_IDX);
  const eyeIn_L    = getXY(LEFT_EYE_IN_IDX);
  const eyeIn_R    = getXY(RIGHT_EYE_IN_IDX);
  const cShadowOL  = getXY(LEFT_CHEEK_SHADOW_OUTER_IDX);
  const cShadowIL  = getXY(LEFT_CHEEK_SHADOW_INNER_IDX);
  const cShadowOR  = getXY(RIGHT_CHEEK_SHADOW_OUTER_IDX);
  const cShadowIR  = getXY(RIGHT_CHEEK_SHADOW_INNER_IDX);

  const noseH  = Math.abs(noseTip.y - noseBridge.y);
  const faceW  = Math.abs(rightTemple.x - leftTemple.x);
  const unit   = faceW * 0.08;  // base sizing unit

  // ════════ CONTOUR ZONES (multiply = darkening) ════════

  // 1. ข้างจมูก (slim nose)
  [
    { cx: leftAla.x + unit * 0.4,  cy: (leftAla.y  + noseBridge.y) / 2 + noseH * 0.15, angle:  0.15 },
    { cx: rightAla.x - unit * 0.4, cy: (rightAla.y + noseBridge.y) / 2 + noseH * 0.15, angle: -0.15 },
  ].forEach(({ cx, cy, angle }) =>
    drawZone(cx, cy, unit * 0.9, noseH * 0.55, angle,
      `rgba(${cR},${cG},${cB},0.42)`, 9, "multiply")
  );

  // 2. Cheek hollows (ใต้โหนกแก้ม)
  [
    {
      cx: cShadowOL.x * 0.5 + cShadowIL.x * 0.5,
      cy: cShadowOL.y * 0.45 + cShadowIL.y * 0.55 + unit * 0.5,
      angle: -0.28,
    },
    {
      cx: cShadowOR.x * 0.5 + cShadowIR.x * 0.5,
      cy: cShadowOR.y * 0.45 + cShadowIR.y * 0.55 + unit * 0.5,
      angle: 0.28,
    },
  ].forEach(({ cx, cy, angle }) =>
    drawZone(cx, cy, unit * 2.2, unit * 0.85, angle,
      `rgba(${cR},${cG},${cB},0.35)`, 20, "multiply")
  );

  // 3. Temples (ขมับ)
  [
    { pt: leftTemple,  angle:  0.55 },
    { pt: rightTemple, angle: -0.55 },
  ].forEach(({ pt, angle }) =>
    drawZone(pt.x, pt.y + unit * 0.3, unit * 1.6, unit * 1.1, angle,
      `rgba(${cR},${cG},${cB},0.24)`, 22, "multiply")
  );

  // 4. Jawline corners
  [jawL, jawR_pt].forEach((pt) =>
    drawZone(pt.x, pt.y, unit * 1.3, unit * 0.9, 0,
      `rgba(${cR},${cG},${cB},0.22)`, 14, "multiply")
  );

  // ════════ HIGHLIGHT ZONES (screen = brightening) ════════

  const HL = "rgba(255,248,228";   // warm champagne

  // 5. สันจมูก (nose bridge center)
  drawZone(
    (noseBridge.x + noseTip.x) / 2,
    (noseBridge.y + noseTip.y) / 2,
    unit * 0.55, noseH * 0.48, 0,
    `${HL},0.6)`, 5, "screen"
  );

  // 6. Under-eye triangle / cheek highlight
  [
    { x: (eyeIn_L.x + cheekHL_L.x) / 2, y: (eyeIn_L.y + cheekHL_L.y) / 2 + unit * 0.6 },
    { x: (eyeIn_R.x + cheekHL_R.x) / 2, y: (eyeIn_R.y + cheekHL_R.y) / 2 + unit * 0.6 },
  ].forEach(({ x, y }) =>
    drawZone(x, y, unit * 1.8, unit * 1.3, 0, `${HL},0.42)`, 13, "screen")
  );

  // 7. กลางหน้าผาก (forehead center)
  drawZone(
    forehead.x,
    forehead.y + unit * 0.5,
    unit * 1.3, unit * 1.0, 0,
    `${HL},0.28)`, 20, "screen"
  );

  // 8. คางกลาง (chin)
  drawZone(chin.x, chin.y, unit * 1.0, unit * 0.7, 0,
    `${HL},0.33)`, 11, "screen"
  );

  // 9. สร้าง path จาก FACE_OVAL landmarks
  // landmark แนว jaw ด้านล่าง (ไม่เอาหน้าผาก)
  const JAW_INDICES = [
    172, 136, 150, 149, 176, 148, 152,   // คางกลาง
    377, 400, 378, 379, 365, 397,         // ขากรรไกรขวา
    132, 93, 234, 127,                    // แก้มซ้ายล่าง
    352, 280, 261, 448,                   // แก้มขวาล่าง
  ];

  const jawPath = new Path2D();
  // เริ่มจากแก้มซ้าย → คาง → แก้มขวา
  const jawPts = [
    getXY(127), getXY(234), getXY(93), getXY(132),
    getXY(172), getXY(136), getXY(150), getXY(149),
    getXY(176), getXY(148), getXY(152),
    getXY(377), getXY(400), getXY(378), getXY(379),
    getXY(365), getXY(397), getXY(448), getXY(261), getXY(280), getXY(352),
  ];
  jawPts.forEach((pt, i) => {
    if (i === 0) jawPath.moveTo(pt.x, pt.y);
    else         jawPath.lineTo(pt.x, pt.y);
  });
  // ไม่ closePath — วาดแค่เส้นโค้งล่าง ไม่ปิดด้านบน

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = `blur(${unit * 1.2}px)`;
  ctx.strokeStyle = `rgba(${cR},${cG},${cB},0.30)`;
  ctx.lineWidth   = unit * 1.6;
  ctx.lineJoin    = "round";
  ctx.lineCap     = "round";
  ctx.stroke(jawPath);
  ctx.restore();


  return;
}


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


    if (finish === "eye") {
  const eyes = [
    { upper: LEFT_EYE_UPPER,  innerIdx: LEFT_EYE_INNER,  outerIdx: LEFT_EYE_OUTER  },
    { upper: RIGHT_EYE_UPPER, innerIdx: RIGHT_EYE_INNER, outerIdx: RIGHT_EYE_OUTER },
  ];

  eyes.forEach(({ upper, innerIdx, outerIdx }) => {
    const innerPt  = getXY(innerIdx);
    const outerPt  = getXY(outerIdx);
    const upperPts = upper.map((i) => getXY(i));

    const eyeWidth     = Math.abs(outerPt.x - innerPt.x);
    const shadowHeight = eyeWidth * 0.55; // ความสูง shadow เหนือ lid
    const lidTopY      = Math.min(...upperPts.map((p) => p.y));
    const lidBotY      = (innerPt.y + outerPt.y) / 2;

    // ── Path: ขอบล่าง = lash line, ขอบบน = เหนือ crease ──
    const path = new Path2D();
    path.moveTo(innerPt.x, innerPt.y);

    // ขึ้นไปตาม upper lid (lash line)
    upper.forEach((i) => {
      const pt = getXY(i);
      path.lineTo(pt.x, pt.y);
    });
    path.lineTo(outerPt.x, outerPt.y);

    // วนกลับด้านบน (offset ขึ้นไป) outer → inner
    const TAPER = 0.6; // ปลายตาหน้าและหลังเรียวกว่ากลาง
    path.lineTo(outerPt.x, outerPt.y - shadowHeight * TAPER);
    [...upper].reverse().forEach((i) => {
      const pt = getXY(i);
      path.lineTo(pt.x, pt.y - shadowHeight);
    });
    path.lineTo(innerPt.x, innerPt.y - shadowHeight * TAPER);
    path.closePath();

    // ── Gradient: เข้มที่ lash line → จางขึ้นด้านบน ──
    const grad = ctx.createLinearGradient(0, lidBotY, 0, lidTopY - shadowHeight);
    grad.addColorStop(0,    color.replace(/[\d.]+\)$/, "0.72)"));
    grad.addColorStop(0.2,  color.replace(/[\d.]+\)$/, "0.48)"));
    grad.addColorStop(0.55, color.replace(/[\d.]+\)$/, "0.18)"));
    grad.addColorStop(1,    color.replace(/[\d.]+\)$/, "0)"));

    // ── Pass 1: base shadow ──
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.filter = "blur(7px)";
    ctx.fillStyle = grad;
    ctx.fill(path);
    ctx.restore();

    // ── Pass 2: ขอบ lash เข้มขึ้นเล็กน้อย (depth) ──
    const lashGrad = ctx.createLinearGradient(0, lidBotY, 0, lidTopY);
    lashGrad.addColorStop(0,   color.replace(/[\d.]+\)$/, "0.35)"));
    lashGrad.addColorStop(0.3, color.replace(/[\d.]+\)$/, "0)"));
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.filter = "blur(3px)";
    ctx.fillStyle = lashGrad;
    ctx.fill(path);
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


  const tabConfig: { key: Tab; label: string;}[] = [
    { key: "makeup",      label: "Makeup"},
    { key: "haircolor",   label: "Hair"},
    { key: "clothes",     label: "Clothes"},
  ];

  const seasonHairColors = getSeasonHairColors(season);
  const seasonClothesColors: ClothesColor[] = SEASON_CLOTHES_COLORS[season] ?? [];

const [showColorSheet, setShowColorSheet] = useState(false);

// handleClearMakeup — เพิ่ม setShowColorSheet(false)
const handleClearMakeup = () => {
  applyMakeupRef.current = false;
  setSelectedProduct(null);
  setActiveVariantIdx(null);
  setShowColorSheet(false); // ← ADD
};


  return (
    <>
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
<img src={logo} alt="logo" className="w-40 xl:w-60 2xl:w-60 object-contain" />
            </div>
          </Link>
        </div>

      {/* Camera */}
      <div>
<div
  className="relative w-[376px] h-[492px] xl:w-[660px] xl:h-[440px] 2xl:w-[916px] 2xl:h-[634px] mx-auto rounded-3xl overflow-hidden"
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
<div className="mx-auto w-[382px] h-[220px] xl:w-[1276px] xl:h-[328px] 2xl:w-[1276px] 2xl:h-[362px] bg-white rounded-2xl shadow-md my-10 px-4 py-4 xl:px-6 xl:py-6 2xl:py-6 2xl:px-6 mt-auto xl:mt-6 2xl:mt-6 flex flex-col overflow-hidden">    <div className="flex gap-2 mb-2 xl:px-32 2xl:px-32">
          {tabConfig.map(({ key, label}) => (
            <button key={key} onClick={() => handleSetActiveTab(key)}
              className={`p-1 flex-1 rounded-full font-inter text-[20px] xl:text-[20px] 2xl:text-[24px] font-semibold capitalize transition ${
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
      <p className="text-[#14110F] text-[16px] xl:text-[24px] 2xl:text-[24px] font-semibold">
        Color : {selectedHairColor && (
          <span className="text-[16px] xl:text-[24px] 2xl:text-[24px] text-[#8E1616] font-semibold">
            {selectedHairColor.name}
          </span>
        )}
      </p>
    </div>
<div className="flex-1 flex items-center justify-start xl:justify-center overflow-x-auto scrollbar-hide">
  <div className="flex gap-3 px-4 xl:px-0 min-w-max xl:flex-wrap xl:justify-center xl:min-w-0">
        <button
          title="No Filter"
          onClick={handleClearHairColor}
          className={`relative w-10 h-10 rounded-full border-[3px] shadow-sm transition-transform hover:scale-110 flex items-center justify-center bg-gray-100 ${
            selectedHairColor === null ? "border-[#8E1616] scale-110" : "border-white"
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
              selectedHairColor?.id === hc.id ? "border-[#8E1616] scale-110" : "border-white"
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
           <div className="flex gap-3 overflow-x-auto py-4  2xl:py-6 scrollbar-hide px-1 flex-shrink-0">               {/* No Filter card */}
                <button
                  onClick={handleClearMakeup}
                  className={`flex-none flex flex-col items-center gap-1 px-1 rounded-xl transition ${
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
<span className="text-[10px] text-gray-600 max-w-[60px] text-center leading-tight block h-8 overflow-hidden">
                  No Filter
                  </span>
                </button>
                {products.map((product) => (
                  <button key={product.id}
                    onClick={() => {
  setSelectedProduct(product);
  setActiveVariantIdx(null);
  applyMakeupRef.current = false;
  setShowColorSheet(true);
}}
                    className={`flex-none flex flex-col items-center gap-1 p-1 rounded-xl transition ${
                      selectedProduct?.id === product.id
                        ? "ring-2 ring-[#8E1616] bg-red-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <img src={product.primaryImage} alt={product.name}
                      className="w-[75px] h-[75px] rounded-lg object-cover border border-gray-100 " />
<span className="text-[10px] max-w-[70px] text-center leading-tight block h-8 overflow-hidden">
                     {product.name.replace(/^4U2 /i, "")}
                    </span>
                  </button>
                )
                )}
                
              </div>
            )}


            {selectedProduct && selectedProduct.variants.length > 0 && (
  <div className="hidden xl:flex flex-col items-center justify-center flex-1 border-t border-gray-100 gap-3">
      <p className="text-[#14110F] text-[16px] xl:text-[24px] 2xl:text-[24px] font-semibold text-center">
  Color : {activeVariantIdx !== null && selectedProduct.variants[activeVariantIdx] && (
          <span className="text-[16px] xl:text-[24px] 2xl:text-[24px] text-[#8E1616] font-semibold">
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

          </>
        )}

        {/* ── Clothes Color Panel ── */}
{activeTab === "clothes" && (
  <div className="flex-1 flex flex-col">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[#14110F] text-[16px] xl:text-[24px] 2xl:text-[24px] font-semibold">
        Color : {selectedClothesColor && (
          <span className="text-[16px] xl:text-[24px] 2xl:text-[24px] text-[#8E1616] font-semibold">
            {selectedClothesColor.name}
          </span>
        )}
      </p>
    </div>
<div className="flex-1 flex items-center justify-start xl:justify-center overflow-x-auto scrollbar-hide">
  <div className="flex gap-3 px-4 xl:px-0 min-w-max xl:flex-wrap xl:justify-center xl:min-w-0">
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
    {/* ── Backdrop ── */}
  {showColorSheet && selectedProduct && (
    <div
      className="xl:hidden fixed inset-0 z-40"
      onClick={() => setShowColorSheet(false)}
    />
  )}

  {/* ── Mobile Color Sheet ── */}
  <div
    className={`xl:hidden fixed z-50 inset-x-0 bottom-0 transition-all duration-300 ease-out ${
      showColorSheet && selectedProduct
        ? "translate-y-0 opacity-100 pointer-events-auto"
        : "translate-y-full opacity-0 pointer-events-none"
    }`}
  >
    <div className="bg-white rounded-t-2xl shadow-2xl px-6 py-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-[14px] font-semibold text-[#14110F]">
          Color :{" "}
          {activeVariantIdx !== null && selectedProduct?.variants[activeVariantIdx] && (
            <span className="text-[#8E1616]">
              {selectedProduct.variants[activeVariantIdx].name}
            </span>
          )}
        </p>
        <button
          onClick={() => setShowColorSheet(false)}
          className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-xs font-bold"
        >
          ✕
        </button>
      </div>

      {/* Swatches */}
      {selectedProduct && selectedProduct.variants.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center pb-2">
          {selectedProduct.variants.map((variant, idx) => (
            <button
              key={idx}
              title={variant.name}
              onClick={() => handleSelectVariant(selectedProduct, idx)}
              className={`relative w-9 h-9 rounded-full border-[3px] shadow-sm transition-transform active:scale-110 ${
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
      )}

      {selectedProduct && selectedProduct.variants.length === 0 && (
        <p className="text-center text-xs text-gray-400 py-2">
          AR try-on for accessories coming soon
        </p>
      )}
    </div>
  </div>

</> 
  );
}