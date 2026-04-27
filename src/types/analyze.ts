export type VeinType = "cool" | "warm";
export type ToneType = "bright" | "soft";
export type LevelType = "low" | "medium" | "high";

export interface AnalyzeState {
  image: File | null;
  vein: VeinType | null;
  tone: ToneType | null;
  brightness: LevelType | null; // ← เพิ่ม
  saturation: LevelType | null; // ← เพิ่ม
  contrast:   LevelType | null; // ← เพิ่ม
  result: string | null;
}