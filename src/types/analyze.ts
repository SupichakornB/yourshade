export type VeinType = "cool" | "warm";
export type ToneType = "bright" | "soft";

export interface AnalyzeState {
  image: File | null;
  vein: VeinType | null;
  tone: ToneType | null;
  result: string | null;
}