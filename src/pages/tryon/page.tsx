import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import backIcon from "@/assets/icon/ep_back.svg";
import { TRYON_SETS } from "@/data/products";
import logo from "@/assets/full-logo.webp";
import type {
  ImageSegmenter,
  ImageSegmenterResult
} from "@mediapipe/tasks-vision";

import { AUTUMN_HAIR_COLORS } from "@/data/products/autumn.haircolor";
import { WINTER_HAIR_COLORS } from "@/data/products/winter.haircolor";
import { SUMMER_HAIR_COLORS } from "@/data/products/summer.haircolor";
import { SPRING_HAIR_COLORS } from "@/data/products/spring.haircolor";
import type { HairColor } from "@/data/products/autumn.haircolor";

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

interface Landmark { x: number; y: number; z: number }

interface FaceMeshResults {
  image: HTMLVideoElement | HTMLCanvasElement | HTMLImageElement;
  multiFaceLandmarks?: Landmark[][];
}

// type ของ FaceMesh / Camera จาก MediaPipe CDN 
interface MediaPipeFaceMesh {
  setOptions: (options: Record<string, unknown>) => void;
  onResults: (callback: (results: FaceMeshResults) => void) => void;
  send: (input: { image: HTMLVideoElement }) => Promise<void>;
}
interface MediaPipeCamera {
  start: () => void;
  stop: () => void;
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
    Camera: new (
      video: HTMLVideoElement,
      config: { onFrame: () => Promise<void>; width: number; height: number }
    ) => MediaPipeCamera;
  }
}

// landmark บนหน้า (index จาก MediaPipe Face Mesh 468 จุด)

// ขอบริมฝีปากนอก / ใน – ใช้วาดสีลิปสติก
const OUTER_LIP = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 409, 270, 269, 267, 0, 37, 39, 40, 185];
const INNER_LIP = [78, 95, 88, 178, 87, 14, 317, 402, 318, 324, 308, 415, 310, 311, 312, 13, 82, 81, 80, 191];

// ขอบตาบน ซ้าย / ขวา – ใช้วาด eyeshadow
const LEFT_EYE_UPPER  = [246, 161, 160, 159, 158, 157, 173];
const LEFT_EYE_INNER  = 133;
const LEFT_EYE_OUTER  = 33;

const RIGHT_EYE_UPPER = [466, 388, 387, 386, 385, 384, 398];
const RIGHT_EYE_INNER = 362;
const RIGHT_EYE_OUTER = 263;

// เส้นขอบใบหน้า – ใช้ clip บริเวณที่วาดสีผมไม่ให้สีล้นออกไปนอกหน้า
const FACE_OVAL = [
  10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
  397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136,
  172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
];

// จุดต่างๆ บนหน้า – contour
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

// จุดแก้ม – blush
const LEFT_CHEEK_INNER  = [117, 118, 101, 36,  205, 187];
const LEFT_CHEEK_OUTER  = [123, 50,  31,  228, 229, 230];
const RIGHT_CHEEK_INNER = [346, 347, 330, 266, 425, 411];
const RIGHT_CHEEK_OUTER = [352, 280, 261, 448, 449, 450];


// แปลง hex สี → rgba (พร้อมกำหนด opacity)
function hexToRgba(hex: string, alpha = 0.55): string {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

// แปลง RGB → HSL  (ใช้ในการเปลี่ยนสีผม โดยคง Lightness ของพิกเซลเดิมไว้)
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

// แปลง HSL → RGB (ใช้คู่กับ rgbToHsl)
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

// เดาประเภท finish จากชื่อสินค้า / สี เช่น "gloss" → finish = "gloss"
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

// สร้าง list สินค้า try-on จาก data ที่มี  (กรองเฉพาะ tab ที่เลือก)
function buildTryOnProducts(season: Season, tab: Tab): TryOnProduct[] {
  if (tab === "haircolor" || tab === "clothes") return []; // tab พวกนี้ไม่ใช้สินค้า
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
          color: hexToRgba(img.colorHex!, finish === "blush" ? 0.4 : finish === "gloss" ? 0.28 : 0.52),
          finish,
        };
      });

      return { id: p.id, name: p.name, brand: p.brand, primaryImage: primaryImg?.url || "", variants } as TryOnProduct;
    })
    .filter(Boolean) as TryOnProduct[];
}

// คืน palette สีผมตามฤดู
function getSeasonHairColors(season: Season): HairColor[] {
  switch (season) {
    case "autumn": return AUTUMN_HAIR_COLORS;
    case "winter": return WINTER_HAIR_COLORS;
    case "summer": return SUMMER_HAIR_COLORS;
    case "spring": return SPRING_HAIR_COLORS;
  }
}

export default function TryOnPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // รับ season ที่ส่งมาจากหน้าก่อนหน้า (default: summer)
  const season: Season = ((location.state as { season?: string })?.season as Season) || "summer";

  // ---- Refs (ไม่ trigger re-render เมื่อเปลี่ยน) ----
  const videoRef  = useRef<HTMLVideoElement>(null);   // กล้อง webcam
  const canvasRef = useRef<HTMLCanvasElement>(null);  // canvas วาด AR ทับวิดีโอ
  const cameraRef = useRef<MediaPipeCamera | null>(null);

  // เก็บ landmarks ที่ smooth แล้ว (ลด jitter)
  const smoothLandmarksRef = useRef<Landmark[] | null>(null);

  // ค่า AR ปัจจุบัน – ใช้ ref เพื่อให้ drawFace อ่านได้ทันทีโดยไม่รอ re-render
  const lipColorRef      = useRef<string>("rgba(220,20,60,0.5)");
  const lipFinishRef     = useRef<Finish>("matte");
  const hairColorRef     = useRef<string | null>(null);      // hex สีผม (null = ไม่เปลี่ยนสี)
  const clothesColorRef  = useRef<string | null>(null);      // hex สีเสื้อ
  const tempCanvasRef    = useRef<HTMLCanvasElement | null>(null); // canvas ชั่วคราวสำหรับ hair coloring

  // Hair segmenter (MediaPipe Tasks-Vision)
  const hairSegmenterRef = useRef<ImageSegmenter | null>(null);
  const hairSegReadyRef  = useRef(false); // ป้องกันโหลดซ้ำ

  // mask ผมที่ smooth แล้ว + cache ขนาด
  const cachedHairMaskRef  = useRef<Float32Array | null>(null);
  const cachedMaskDimsRef  = useRef({ w: 0, h: 0 });
  const hairSegFrameRef    = useRef(0); // นับ frame เพื่อ segment ทุก 3 frames

  const applyMakeupRef = useRef(false); // เปิด/ปิดการวาด makeup

  // texture รูปภาพสำหรับ lip finish (matte / gloss / shimmer)
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
  const [showColorSheet, setShowColorSheet]     = useState(false); // bottom sheet บนมือถือ

  // state ของแต่ละ tab เมื่อสลับ tab แล้วกลับมาจะยังอยู่สถานะเดิม
  const tabUIStateRef = useRef<Record<string, {
    selectedProduct: TryOnProduct | null;
    activeVariantIdx: number | null;
  }>>({});

  // เปลี่ยน tab: บันทึก state เก่า → restore state ของ tab ใหม่
  const handleSetActiveTab = (newTab: Tab) => {
    tabUIStateRef.current[activeTab] = { selectedProduct, activeVariantIdx };
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

  // โหลดรายการสินค้าใหม่ทุกครั้งที่ฤดู/tab เปลี่ยน
  useEffect(() => {
    setProducts(buildTryOnProducts(season, activeTab));
  }, [season, activeTab]);

  // โหลด texture รูปสำหรับ lip finish ครั้งเดียวตอน mount
  useEffect(() => {
    texturesRef.current.matte.src   = "/textures/lip-matte-noise.webp";
    texturesRef.current.gloss.src   = "/textures/lip-gloss.webp";
    texturesRef.current.shimmer.src = "/textures/lip-shimmer.webp";
  }, []);

  // ---- โหลด Hair Segmenter (MediaPipe Tasks-Vision) ----
  // โมเดล .tflite จะแบ่งภาพออกเป็น "ผม" vs "ไม่ใช่ผม" แบบ per-pixel
  useEffect(() => {
    if (hairSegReadyRef.current) return; // โหลดครั้งเดียว
    hairSegReadyRef.current = true;
    (async () => {
      try {
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
          outputConfidenceMasks: true, // คืนค่าความน่าจะเป็น 0-1 ต่อพิกเซล
          runningMode: "VIDEO",
        });
        console.log("[HairSegmenter] ready ✓");
      } catch (e) {
        console.error("[HairSegmenter] failed to load:", e);
      }
    })();
  }, []);

  // ---- โหลด FaceMesh + Camera script จาก CDN ----
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
    ]).then(() => setMediapipeLoaded(true)).catch(console.error);
  }, []);

  // ---- Smooth landmarks ----
  // ค่า x, y ของ landmark แต่ละ frame จะกระโดดนิดหน่อย
  // ใช้ exponential moving average (alpha=0.35) เพื่อให้ smooth
  const smoothPoints = useCallback((newPoints: Landmark[]) => {
    if (!smoothLandmarksRef.current) {
      smoothLandmarksRef.current = newPoints.map((p) => ({ ...p }));
      return smoothLandmarksRef.current;
    }
    const alpha = 0.35; // น้ำหนักของค่าเก่า (ยิ่งสูง ยิ่ง smooth แต่ lag มากขึ้น)
    for (let i = 0; i < newPoints.length; i++) {
      smoothLandmarksRef.current[i].x = smoothLandmarksRef.current[i].x * alpha + newPoints[i].x * (1 - alpha);
      smoothLandmarksRef.current[i].y = smoothLandmarksRef.current[i].y * alpha + newPoints[i].y * (1 - alpha);
    }
    return smoothLandmarksRef.current;
  }, []);

  // ============================================================
  // drawFace – ฟังก์ชันหลัก เรียกทุก frame จาก FaceMesh
  // ขั้นตอน: วาด video → สีผม → เสื้อ → makeup
  // ============================================================
  const drawFace = useCallback((results: FaceMeshResults) => {
    const canvas = canvasRef.current;
    const video  = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // คำนวณ scale เพื่อให้วิดีโอ "cover" canvas (ไม่มีขอบดำ)
    const imgW = video.videoWidth  || 1280;
    const imgH = video.videoHeight || 720;
    const coverScale = Math.max(canvas.width / imgW, canvas.height / imgH);
    const drawW   = imgW * coverScale;
    const drawH   = imgH * coverScale;
    const offsetX = (canvas.width  - drawW) / 2;
    const offsetY = (canvas.height - drawH) / 2;

    // วาดวิดีโอแบบ mirror (scaleX(-1)) เพราะกล้องหน้าจะกลับซ้าย-ขวา
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(results.image, offsetX, offsetY, drawW, drawH);
    ctx.restore();

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) return;

    // smooth landmarks แล้วแปลง normalized (0-1) → pixel บน canvas
    const landmarks = smoothPoints(results.multiFaceLandmarks[0]);
    const getXY = (i: number) => ({
      x: (1 - landmarks[i].x) * drawW + offsetX, // กลับด้านเพราะ mirror
      y: landmarks[i].y * drawH + offsetY,
    });

    // ----------------------------------------------------------
    // 1) HAIR COLORING
    // ทำงานระดับพิกเซล: เปลี่ยน Hue+Saturation ของพิกเซลผม
    // แต่ยังคง Lightness (ความสว่าง) เดิมไว้ → ดูเป็นธรรมชาติ
    // ----------------------------------------------------------
    if (hairColorRef.current && hairSegmenterRef.current) {
      // segment ทุก 3 frames เพื่อประหยัด CPU
      hairSegFrameRef.current = (hairSegFrameRef.current + 1) % 3;

      if (hairSegFrameRef.current === 0 || !cachedHairMaskRef.current) {
        const segResult = hairSegmenterRef.current.segmentForVideo(
          results.image as HTMLVideoElement,
          performance.now()
        ) as ImageSegmenterResult;

        // confidenceMasks[1] = mask ของ "ผม" (0.0 ไม่ใช่ผม → 1.0 ใช่ผม)
        const hairMask = segResult?.confidenceMasks?.[1];
        if (hairMask) {
          const newRaw = hairMask.getAsFloat32Array() as Float32Array;
          const mW     = hairMask.width  as number;
          const mH     = hairMask.height as number;

          // Temporal smoothing ของ mask เพื่อลดการกระพริบ
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
          hairMask.close(); // free memory
        }
      }

      const smoothedMask = cachedHairMaskRef.current;
      const maskW        = cachedMaskDimsRef.current.w;
      const maskH        = cachedMaskDimsRef.current.h;

      if (smoothedMask && maskW > 0) {
        // สำรอง canvas ปัจจุบัน (วิดีโอ) ไว้ใน tempCanvas
        if (!tempCanvasRef.current) {
          tempCanvasRef.current = document.createElement("canvas");
        }
        const tmpC = tempCanvasRef.current;
        if (tmpC.width !== canvas.width || tmpC.height !== canvas.height) {
          tmpC.width  = canvas.width;
          tmpC.height = canvas.height;
        }
        tmpC.getContext("2d")!.drawImage(canvas, 0, 0);

        // แยก H, S จากสีที่ user เลือก
        const hex = hairColorRef.current.replace("#", "");
        const tR  = parseInt(hex.slice(0, 2), 16);
        const tG  = parseInt(hex.slice(2, 4), 16);
        const tB  = parseInt(hex.slice(4, 6), 16);
        const [tH, tS] = rgbToHsl(tR, tG, tB);

        // วน loop ทุกพิกเซลบน canvas
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels  = imgData.data;
        const cW = canvas.width;
        const cH = canvas.height;

        // smoothstep – ทำให้ขอบเส้นผมดูนุ่มนวลขึ้น (ไม่คม)
        const smoothstep = (e0: number, e1: number, x: number) => {
          const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
          return t * t * (3 - 2 * t);
        };

        for (let y = 0; y < cH; y++) {
          for (let x = 0; x < cW; x++) {
            // แปลงพิกัด canvas → พิกัดใน mask
            const relX = ((cW - 1 - x) - offsetX) / drawW;
            const relY = (y - offsetY) / drawH;
            if (relX < 0 || relX > 1 || relY < 0 || relY > 1) continue;

            const mx   = Math.min(maskW - 1, Math.round(relX * maskW));
            const my   = Math.min(maskH - 1, Math.round(relY * maskH));
            const conf = smoothedMask[my * maskW + mx]; // 0-1 โอกาสเป็นผม

            const edgeMask = smoothstep(0.18, 0.58, conf);
            if (edgeMask < 0.01) continue; // ไม่ใช่ผม → ข้าม

            const idx = (y * cW + x) * 4;
            const r   = pixels[idx];
            const g   = pixels[idx + 1];
            const b   = pixels[idx + 2];

            // รักษา Lightness เดิมของพิกเซล
            const [, , l] = rgbToHsl(r, g, b);

            // ลดความเข้มที่บริเวณสว่างมาก (highlight) เพื่อดูเป็นธรรมชาติ
            const highlightFade =
              l > 0.65 ? Math.pow(1 - (l - 0.65) / 0.35, 1.8) : 1.0;

            // คำนวณสีใหม่: H,S จากสีที่เลือก + L เดิม
            const [nr, ng, nb] = hslToRgb(tH, Math.min(1, tS * 1.05), l);
            const strength      = edgeMask * highlightFade * 0.88;

            // blend สีใหม่เข้ากับสีเดิม
            pixels[idx]     = Math.round(r + (nr - r) * strength);
            pixels[idx + 1] = Math.round(g + (ng - g) * strength);
            pixels[idx + 2] = Math.round(b + (nb - b) * strength);
          }
        }

        ctx.putImageData(imgData, 0, 0);

        // clip ด้วย FACE_OVAL: ลบสีที่ไปติดพื้นหลัง (หลัง clip วาดทับด้วย tempCanvas)
        const faceOvalPath = new Path2D();
        FACE_OVAL.forEach((fIdx, i) => {
          const pt = getXY(fIdx);
          if (i === 0) faceOvalPath.moveTo(pt.x, pt.y);
          else         faceOvalPath.lineTo(pt.x, pt.y);
        });
        faceOvalPath.closePath();

        ctx.save();
        ctx.clip(faceOvalPath);
        ctx.drawImage(tmpC, 0, 0); // คืนสีเดิมในบริเวณใบหน้า
        ctx.restore();
      }
    }

    // ----------------------------------------------------------
    // 2) CLOTHES COLORING
    // วาดสีเสื้อทับส่วนล่างของ canvas แบบ fixed (ไม่ track ตัว)
    // ใช้ bezierCurve สร้าง neckline แบบ V-shape
    // ----------------------------------------------------------
    if (clothesColorRef.current) {
      const hex = clothesColorRef.current;
      const cW  = canvas.width;
      const cH  = canvas.height;
      const r   = parseInt(hex.slice(1, 3), 16);
      const g   = parseInt(hex.slice(3, 5), 16);
      const b   = parseInt(hex.slice(5, 7), 16);

      const neckCenterX = cW / 2;
      const neckHalfW   = cW * 0.23;
      const neckTopY    = cH * 0.56;
      const neckBotY    = neckTopY + cW * 0.22;

      ctx.save();
      const shirtPath = new Path2D();
      shirtPath.moveTo(0, cH * 0.64);
      shirtPath.lineTo(neckCenterX - neckHalfW, neckTopY);
      // bezier สร้าง neckline โค้ง (V-neck)
      shirtPath.bezierCurveTo(
        neckCenterX - neckHalfW * 0.3, neckBotY,
        neckCenterX + neckHalfW * 0.3, neckBotY,
        neckCenterX + neckHalfW, neckTopY
      );
      shirtPath.lineTo(cW, cH * 0.64);
      shirtPath.lineTo(cW, cH);
      shirtPath.lineTo(0, cH);
      shirtPath.closePath();

      // เติมสีหลัก
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill(shirtPath);

      // เพิ่ม gradient เงาบนล่าง (ทำให้มีมิติ)
      const topShadow = ctx.createLinearGradient(0, neckTopY, 0, cH);
      topShadow.addColorStop(0,    "rgba(0,0,0,0.09)");
      topShadow.addColorStop(0.18, "rgba(0,0,0,0.08)");
      topShadow.addColorStop(0.5,  "rgba(0,0,0,0)");
      topShadow.addColorStop(1,    "rgba(0,0,0,0.15)");
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = topShadow;
      ctx.fill(shirtPath);

      // เพิ่ม gradient เงาซ้าย-ขวา
      const sideShadow = ctx.createLinearGradient(0, 0, cW, 0);
      sideShadow.addColorStop(0,    "rgba(0,0,0,0.1)");
      sideShadow.addColorStop(0.15, "rgba(0,0,0,0)");
      sideShadow.addColorStop(0.85, "rgba(0,0,0,0)");
      sideShadow.addColorStop(1,    "rgba(0,0,0,0.04)");
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = sideShadow;
      ctx.fill(shirtPath);

      ctx.restore();
    }

    // ถ้า user ยังไม่ได้เลือก makeup → จบแค่นี้
    if (!applyMakeupRef.current) return;

    const finish = lipFinishRef.current;
    const color  = lipColorRef.current;

    // ----------------------------------------------------------
    // 3) CONTOUR
    // วาด shadow / highlight ตามโครงสร้างใบหน้า
    // ใช้ radial gradient + composite mode "multiply" / "screen"
    // ----------------------------------------------------------
    if (finish === "contour") {
      const cMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      const cR = cMatch ? +cMatch[1] : 130;
      const cG = cMatch ? +cMatch[2] : 80;
      const cB = cMatch ? +cMatch[3] : 40;

      // helper วาด ellipse gradient (shadow หรือ highlight)
      const drawZone = (
        cx: number, cy: number,
        rx: number, ry: number,
        angle: number,
        rgba: string,
        blurPx: number,
        composite: GlobalCompositeOperation,
        stops?: [number, string][]
      ) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(1, ry / rx); // ทำให้เป็น ellipse

        const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        if (stops) {
          stops.forEach(([pos, c]) => grad.addColorStop(pos, c));
        } else {
          const base = parseFloat(rgba.match(/[\d.]+(?=\))/)?.[0] ?? "0.4");
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

      // ดึง landmark ที่จำเป็น
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
      const unit   = faceW * 0.08; // หน่วยวัดสัมพัทธ์กับใบหน้า

      // Shadow ข้างจมูก
      [
        { cx: leftAla.x + unit * 0.4,  cy: (leftAla.y  + noseBridge.y) / 2 + noseH * 0.15, angle:  0.15 },
        { cx: rightAla.x - unit * 0.4, cy: (rightAla.y + noseBridge.y) / 2 + noseH * 0.15, angle: -0.15 },
      ].forEach(({ cx, cy, angle }) =>
        drawZone(cx, cy, unit * 0.9, noseH * 0.55, angle,
          `rgba(${cR},${cG},${cB},0.18)`, 6, "multiply")
      );

      // Shadow แก้ม
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
          `rgba(${cR},${cG},${cB},0.15)`, 14, "multiply")
      );

      // Shadow ขมับ
      [
        { pt: leftTemple,  angle:  0.55 },
        { pt: rightTemple, angle: -0.55 },
      ].forEach(({ pt, angle }) =>
        drawZone(pt.x, pt.y + unit * 0.3, unit * 1.6, unit * 1.1, angle,
          `rgba(${cR},${cG},${cB},0.18)`, 16, "multiply")
      );

      // Shadow กราม
      [jawL, jawR_pt].forEach((pt) =>
        drawZone(pt.x, pt.y, unit * 1.3, unit * 0.9, 0,
          `rgba(${cR},${cG},${cB},0.16)`, 10, "multiply")
      );

      const HL = "rgba(255,248,228"; // highlight สีวอร์ม

      // Highlight สันจมูก
      drawZone(
        (noseBridge.x + noseTip.x) / 2,
        (noseBridge.y + noseTip.y) / 2,
        unit * 0.5, noseH * 0.6, 0,
        `${HL},0.9)`, 4, "screen"
      );

      // Highlight แก้ม
      [
        { x: (eyeIn_L.x + cheekHL_L.x) / 2, y: (eyeIn_L.y + cheekHL_L.y) / 2 + unit * 1.4 },
        { x: (eyeIn_R.x + cheekHL_R.x) / 2, y: (eyeIn_R.y + cheekHL_R.y) / 2 + unit * 1.4 },
      ].forEach(({ x, y }) =>
        drawZone(x, y, unit * 2.8, unit * 1.6, 0, `${HL},0.60)`, 12, "screen")
      );

      // Highlight หน้าผาก
      drawZone(
        forehead.x,
        forehead.y + unit * 0.5,
        unit * 1.8, unit * 1.4, 0,
        `${HL},0.45)`, 16, "screen"
      );

      // Highlight คาง
      drawZone(chin.x, chin.y, unit * 1.3, unit * 0.9, 0,
        `${HL},0.50)`, 9, "screen"
      );

      // Highlight ข้างจมูก
      [
        { x: leftAla.x  - unit * 1.2, y: leftAla.y  + unit * 0.8 },
        { x: rightAla.x + unit * 1.2, y: rightAla.y + unit * 0.8 },
      ].forEach(({ x, y }) =>
        drawZone(x, y, unit * 1.4, unit * 1.2, 0, `${HL},0.35)`, 10, "screen")
      );

      // เส้นกราม contour (stroke)
      const jawPath = new Path2D();
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

      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.filter = `blur(${unit * 1.2}px)`;
      ctx.strokeStyle = `rgba(${cR},${cG},${cB},0.15)`;
      ctx.lineWidth   = unit * 1.0;
      ctx.lineJoin    = "round";
      ctx.lineCap     = "round";
      ctx.stroke(jawPath);
      ctx.restore();

      return;
    }

    // ----------------------------------------------------------
    // 4) BLUSH – วาด radial gradient ทรงรีบนแก้มสองข้าง
    // ----------------------------------------------------------
    if (finish === "blush") {
      const cheekSides = [
        { inner: LEFT_CHEEK_INNER,  outer: LEFT_CHEEK_OUTER  },
        { inner: RIGHT_CHEEK_INNER, outer: RIGHT_CHEEK_OUTER },
      ];

      cheekSides.forEach(({ inner, outer }) => {
        // หาจุดศูนย์กลางของกลุ่ม inner / outer
        let ix = 0, iy = 0;
        inner.forEach((idx) => { ix += getXY(idx).x; iy += getXY(idx).y; });
        ix /= inner.length; iy /= inner.length;

        let ox = 0, oy = 0;
        outer.forEach((idx) => { ox += getXY(idx).x; oy += getXY(idx).y; });
        ox /= outer.length; oy /= outer.length;

        // จุดกึ่งกลาง + ขนาดของ blush
        const cx = ix * 0.35 + ox * 0.65;
        const cy = (iy + oy) / 2 - Math.abs(oy - iy) * 0.25;
        const halfW = Math.sqrt((ox - ix) ** 2 + (oy - iy) ** 2) * 2.75;
        const halfH = halfW * 0.75;
        const angle = Math.atan2(oy - iy, ox - ix);

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);
        ctx.scale(1, halfH / halfW); // ทำให้เป็น ellipse

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

    // ----------------------------------------------------------
    // 5) EYE SHADOW – วาด gradient ที่เปลือกตาบน
    // ----------------------------------------------------------
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
        const shadowHeight = eyeWidth * 0.55;
        const lidTopY      = Math.min(...upperPts.map((p) => p.y));
        const lidBotY      = (innerPt.y + outerPt.y) / 2;

        // path รูปร่างตา (เส้นบนตา + เส้นสมมติด้านบน)
        const path = new Path2D();
        path.moveTo(innerPt.x, innerPt.y);
        upper.forEach((i) => {
          const pt = getXY(i);
          path.lineTo(pt.x, pt.y);
        });
        path.lineTo(outerPt.x, outerPt.y);

        const TAPER = 0.6;
        path.lineTo(outerPt.x, outerPt.y - shadowHeight * TAPER);
        [...upper].reverse().forEach((i) => {
          const pt = getXY(i);
          path.lineTo(pt.x, pt.y - shadowHeight);
        });
        path.lineTo(innerPt.x, innerPt.y - shadowHeight * TAPER);
        path.closePath();

        // gradient: เข้มที่เปลือกตา → จางขึ้นด้านบน
        const grad = ctx.createLinearGradient(0, lidBotY, 0, lidTopY - shadowHeight);
        grad.addColorStop(0,    color.replace(/[\d.]+\)$/, "0.72)"));
        grad.addColorStop(0.2,  color.replace(/[\d.]+\)$/, "0.48)"));
        grad.addColorStop(0.55, color.replace(/[\d.]+\)$/, "0.18)"));
        grad.addColorStop(1,    color.replace(/[\d.]+\)$/, "0)"));

        ctx.save();
        ctx.globalCompositeOperation = "multiply";
        ctx.filter = "blur(7px)";
        ctx.fillStyle = grad;
        ctx.fill(path);
        ctx.restore();

        // gradient เส้นขนตา (얇고 dense ที่ขอบล่าง)
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

    // ----------------------------------------------------------
    // 6) LIP LINER – วาดเส้นขอบปากแบบ stroke
    // ----------------------------------------------------------
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

      // เติมสีจางๆ ด้านใน (evenodd = ตัดพื้นที่ inner lip ออก)
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

// ----------------------------------------------------------
// 6.5) GLOSS – glass lip / water tint effect
// เน้น specular highlight แบบ wet look
// ----------------------------------------------------------
if (finish === "gloss") {
  const glossPath = new Path2D();
  OUTER_LIP.forEach((idx, i) => {
    const pt = getXY(idx);
    if (i === 0) glossPath.moveTo(pt.x, pt.y); else glossPath.lineTo(pt.x, pt.y);
  });
  glossPath.closePath();
  INNER_LIP.forEach((idx, i) => {
    const pt = getXY(idx);
    if (i === 0) glossPath.moveTo(pt.x, pt.y); else glossPath.lineTo(pt.x, pt.y);
  });
  glossPath.closePath();

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  OUTER_LIP.forEach((i) => {
    const pt = getXY(i);
    minX = Math.min(minX, pt.x); minY = Math.min(minY, pt.y);
    maxX = Math.max(maxX, pt.x); maxY = Math.max(maxY, pt.y);
  });
  const cX = (minX + maxX) / 2;
  const cY = (minY + maxY) / 2;
  const lipW = maxX - minX;
  const lipH = maxY - minY;

  ctx.save();
  ctx.clip(glossPath, "evenodd");

  // 1. Sheer base color (เบามาก เห็นสีปากเดิม)
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = "blur(0.2px)";
  ctx.fillStyle = color;
  ctx.fill(glossPath, "evenodd");
  ctx.fill(glossPath, "evenodd");
  

  // 2. Tint concentrate ตรงกลาง (water tint look)
  const tintGrad = ctx.createRadialGradient(cX, cY + lipH * 0.12, 0, cX, cY, lipW * 0.82);
  tintGrad.addColorStop(0,   color.replace(/[\d.]+\)$/, "0.22)"));
  tintGrad.addColorStop(0.5, color.replace(/[\d.]+\)$/, "0.08)"));
  tintGrad.addColorStop(1,   color.replace(/[\d.]+\)$/, "0)"));
  ctx.globalCompositeOperation = "multiply";
  ctx.filter = "blur(3px)";
  ctx.fillStyle = tintGrad;
  ctx.fill(glossPath, "evenodd");

  // 3. Main specular highlight – ริมฝีปากล่าง (จุดสว่างใหญ่)
  const hl1X = cX - lipW * 0.04;
  const hl1Y = cY + lipH * 0.2;
  const hl1 = ctx.createRadialGradient(hl1X, hl1Y, 0, hl1X, hl1Y, lipW * 0.03);
  hl1.addColorStop(0,    "rgba(255,255,255,0.95)");
  hl1.addColorStop(0.2,  "rgba(255,255,255,0.72)");
  hl1.addColorStop(0.55, "rgba(255,255,255,0.22)");
  hl1.addColorStop(1,    "rgba(255,255,255,0)");
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(12px)";
  ctx.fillStyle = hl1;
  ctx.fill(glossPath, "evenodd");
  ctx.fill(glossPath, "evenodd");

  // 4. Secondary highlight – ริมฝีปากบน (จุดสว่างเล็ก)
  const hl2X = cX + lipW * 0.08;
  const hl2Y = cY - lipH * 0.06;
  const hl2 = ctx.createRadialGradient(hl2X, hl2Y, 0, hl2X, hl2Y, lipW * 0.03);
  hl2.addColorStop(0,   "rgba(255,255,255,0.80)");
  hl2.addColorStop(0.4, "rgba(255,255,255,0.28)");
  hl2.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(15px)";
  ctx.fillStyle = hl2;
  ctx.fill(glossPath, "evenodd");

  // 5. Overall wet sheen บน-ล่าง
  const sheen = ctx.createLinearGradient(0, minY, 0, maxY);
  sheen.addColorStop(0,    "rgba(255,255,255,0.38)");
  sheen.addColorStop(0.3,  "rgba(255,255,255,0.06)");
  sheen.addColorStop(0.7,  "rgba(255,255,255,0.04)");
  sheen.addColorStop(1,    "rgba(255,255,255,0.18)");
  ctx.globalCompositeOperation = "screen";
  ctx.filter = "blur(1.5px)";
  ctx.fillStyle = sheen;
  ctx.fill(glossPath, "evenodd");


  ctx.restore();
  return;
}
    // ----------------------------------------------------------
    // 7) LIP COLOR (matte / gloss / shimmer)
    // ใช้ clip path รูปปาก → เติมสี → เพิ่ม highlight/shadow
    // → วาง texture ทับเพื่อให้ดูเป็น finish นั้นๆ
    // ----------------------------------------------------------
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
    ctx.clip(combinedPath, "evenodd"); // ตัดพื้นที่ inner lip ออก (เฉพาะผิวปาก)

    // เติมสีหลัก (multiply = blend กับสีผิวปากเดิม)
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    ctx.filter = "blur(1.5px)";
    ctx.fillStyle = color;
    ctx.fill(combinedPath, "evenodd");
    ctx.restore();

    // คำนวณ bounding box ของปากสำหรับ gradient
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    OUTER_LIP.forEach((i) => {
      const pt = getXY(i);
      minX = Math.min(minX, pt.x); minY = Math.min(minY, pt.y);
      maxX = Math.max(maxX, pt.x); maxY = Math.max(maxY, pt.y);
    });
    const cX = minX + (maxX - minX) / 2;
    const cY = minY + (maxY - minY) / 2;
    const lipSize = Math.max(maxX - minX, maxY - minY);

    // radial gradient: สว่างตรงกลาง → มืดขอบ (ทำให้ดูมีมิติ 3D)
    const grad = ctx.createRadialGradient(cX, cY, lipSize * 0.2, cX, cY, lipSize * 0.8);
    grad.addColorStop(0, "rgba(255,255,255,0.2)");
    grad.addColorStop(0.5, "rgba(0,0,0,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.3)");
    ctx.globalCompositeOperation = "soft-light";
    ctx.fillStyle = grad;
    ctx.fill(combinedPath, "evenodd");

    // วาง texture (matte = multiply ทำให้หมองนวล, gloss = screen ทำให้เงา)
    const tex = texturesRef.current[finish];
    if (tex && tex.complete && tex.naturalWidth > 0) {
      ctx.globalCompositeOperation = finish === "matte" ? "multiply" : "screen";
      ctx.globalAlpha = 0.3;
      ctx.drawImage(tex, minX, minY, maxX - minX, maxY - minY);
    }

    ctx.restore();
  }, [smoothPoints]);

  // ============================================================
  // useEffect: เริ่มกล้อง + loop FaceMesh
  // ============================================================
  useEffect(() => {
    if (!mediapipeLoaded) return;
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    let destroyed = false;
    let rvfcId: number | null = null;

    // สร้าง FaceMesh instance
    const faceMesh = new window.FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh@0.4.1633559619/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,            // track แค่ 1 หน้า
      refineLandmarks: true,     // เพิ่มความแม่นยำ (468+จุดรอบดวงตา/ริมฝีปาก)
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(drawFace); // เรียก drawFace ทุก frame

    // loop ส่ง frame ไปให้ FaceMesh วิเคราะห์
    const startFrameLoop = () => {
      const sendFrame = async () => {
        if (destroyed) return;
        if (video.readyState >= 2) {
          try { await faceMesh.send({ image: video }); } catch { /* ignore */ }
        }
        // ใช้ requestVideoFrameCallback ถ้ามี (sync กับ frame rate วิดีโอ)
        // fallback เป็น requestAnimationFrame
        if ("requestVideoFrameCallback" in video) {
          rvfcId = (video as HTMLVideoElement & { requestVideoFrameCallback: (cb: () => void) => number })
            .requestVideoFrameCallback(sendFrame);
        } else {
          rvfcId = requestAnimationFrame(sendFrame) as unknown as number;
        }
      };
      sendFrame();
    };

    // sync ขนาด canvas ให้ตรงกับ element ที่แสดงผล
    const syncCanvasSize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width  = w || 382;
        canvas.height = h || 510;
        smoothLandmarksRef.current = null; // reset smooth เมื่อ resize
      }
    };

    const resizeObserver = new ResizeObserver(() => syncCanvasSize());
    resizeObserver.observe(canvas);

    // ขอ permission กล้อง → เล่น video → เริ่ม loop
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 720 } } })
      .then((stream) => {
        if (destroyed) { stream.getTracks().forEach((t) => t.stop()); return; }
        video.srcObject = stream;

        const onCanPlay = () => {
          video.removeEventListener("canplay", onCanPlay);
          if (destroyed) return;
          syncCanvasSize();
          video.play().then(() => {
            setIsCameraReady(true);
            startFrameLoop();
          }).catch((err) => {
            // บาง browser บังคับ muted ก่อนถึงจะ autoplay ได้
            console.error("[Camera] video.play() failed:", err);
            video.muted = true;
            video.play().then(() => { setIsCameraReady(true); startFrameLoop(); }).catch(console.error);
          });
        };

        video.addEventListener("canplay", onCanPlay);
        // timeout fallback กรณี event ไม่ fire
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

    // cleanup เมื่อ component unmount
    return () => {
      destroyed = true;
      resizeObserver.disconnect();
      if (cameraRef.current?.stop) cameraRef.current.stop();
      if (rvfcId !== null) {
        if ("cancelVideoFrameCallback" in video) {
          (video as HTMLVideoElement & { cancelVideoFrameCallback: (id: number) => void })
            .cancelVideoFrameCallback(rvfcId);
        } else {
          cancelAnimationFrame(rvfcId as unknown as number);
        }
      }
      // หยุด stream กล้อง
      const tracks = (video.srcObject as MediaStream)?.getTracks?.();
      tracks?.forEach((t) => t.stop());
    };
  }, [mediapipeLoaded, drawFace]);

  // ---- Event handlers ----

  // user คลิกเลือก variant สี → อัป ref ทันที (drawFace จะใช้ค่าใหม่ใน frame ถัดไป)
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
    setShowColorSheet(false);
  };

  const tabConfig: { key: Tab; label: string }[] = [
    { key: "makeup",    label: "Makeup" },
    { key: "haircolor", label: "Hair" },
    { key: "clothes",   label: "Clothes" },
  ];

  const seasonHairColors    = getSeasonHairColors(season);
  const seasonClothesColors: ClothesColor[] = SEASON_CLOTHES_COLORS[season] ?? [];

  // ============================================================
  // JSX / UI
  // ============================================================
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
            <div className="py-4 xl:py-6 2xl:py-6 flex justify-center">
              <img src={logo} alt="logo" className="w-40 xl:w-60 2xl:w-60 object-contain" />
            </div>
          </Link>
        </div>

        {/* กล้อง + Canvas AR */}
        <div>
          <div className="relative w-[376px] h-[492px] xl:w-[660px] xl:h-[440px] 2xl:w-[916px] 2xl:h-[634px] mx-auto rounded-3xl overflow-hidden">
            {/* video จาก webcam (ซ่อนไว้ใต้ canvas) */}
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }} // mirror เพื่อความเป็นธรรมชาติ
            />
            {/* canvas วาดทับ – AR layer */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

            {/* loading overlay */}
            {!isCameraReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white gap-2">
                <div className="w-10 h-10 border-4 border-[#8E1616] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm">
                  {mediapipeLoaded ? "Starting camera..." : "Loading AR..."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Product Panel ด้านล่าง */}
        <div className="mx-auto w-[382px] h-[220px] xl:w-[1276px] xl:h-[328px] 2xl:w-[1276px] 2xl:h-[362px] bg-white rounded-2xl shadow-md my-10 px-4 py-4 xl:px-6 xl:py-6 2xl:py-6 2xl:px-6 mt-auto xl:mt-6 2xl:mt-6 flex flex-col overflow-hidden">

          {/* Tab bar */}
          <div className="flex gap-2 mb-2 xl:px-32 2xl:px-32">
            {tabConfig.map(({ key, label }) => (
              <button key={key} onClick={() => handleSetActiveTab(key)}
                className={`p-1 flex-1 rounded-full font-inter text-[20px] xl:text-[20px] 2xl:text-[24px] font-semibold capitalize transition ${
                  activeTab === key ? "bg-[#8E1616] text-white" : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* แสดง palette สีผม */}
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
                  {/* ปุ่ม clear */}
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
                  {/* palette สีผมตามฤดู */}
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

          {/* แสดง list สินค้า makeup / accessories */}
          {activeTab !== "haircolor" && activeTab !== "clothes" && (
            <>
              {products.length === 0 ? (
                <p className="text-center text-sm py-4">
                  No {activeTab} products for {season} season
                </p>
              ) : (
                <div className="flex gap-3 overflow-x-auto py-4 2xl:py-6 scrollbar-hide px-1 flex-shrink-0">
                  {/* ปุ่ม No Filter */}
                  <button
                    onClick={handleClearMakeup}
                    className={`flex-none flex flex-col items-center gap-1 px-1 rounded-xl transition ${
                      selectedProduct === null ? "ring-2 ring-[#8E1616] bg-red-50" : "hover:bg-gray-50"
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

                  {/* card สินค้าแต่ละชิ้น */}
                  {products.map((product) => (
                    <button key={product.id}
                      onClick={() => {
                        setSelectedProduct(product);
                        setActiveVariantIdx(null);
                        applyMakeupRef.current = false;
                        setShowColorSheet(true); // เปิด bottom sheet เลือกสีบนมือถือ
                      }}
                      className={`flex-none flex flex-col items-center gap-1 p-1 rounded-xl transition ${
                        selectedProduct?.id === product.id ? "ring-2 ring-[#8E1616] bg-red-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <img src={product.primaryImage} alt={product.name}
                        className="w-[75px] h-[75px] rounded-lg object-cover border border-gray-100" />
                      <span className="text-[10px] max-w-[70px] text-center leading-tight block h-8 overflow-hidden">
                        {product.name.replace(/^4U2 /i, "")}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* color picker บน desktop (xl+) */}
              {selectedProduct && selectedProduct.variants.length > 0 && (
                <div className="hidden xl:flex flex-col items-center justify-center flex-1 border-t border-gray-100 gap-3">
                  <p className="text-[#14110F] text-[16px] xl:text-[24px] 2xl:text-[24px] font-semibold w-full text-left">
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

          {/* แสดง palette สีเสื้อ */}
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
                  {/* ปุ่ม clear */}
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
                  {/* palette สีเสื้อ */}
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

      {/* backdrop สำหรับ bottom sheet บนมือถือ */}
      {showColorSheet && selectedProduct && (
        <div
          className="xl:hidden fixed inset-0 z-40"
          onClick={() => setShowColorSheet(false)}
        />
      )}

      {/* Bottom Sheet – color picker บนมือถือ (slide up) */}
      <div
        className={`xl:hidden fixed z-50 inset-x-0 bottom-0 transition-all duration-300 ease-out ${
          showColorSheet && selectedProduct
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-t-2xl shadow-2xl px-6 py-5">
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