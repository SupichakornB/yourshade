import type { AnalyzeState } from "@/types/analyze";

type Season = "winter" | "summer" | "autumn" | "spring";

export function analyzeResult(state: AnalyzeState): Season {
  if (state.vein === "cool" && state.tone === "bright") return "winter";
  if (state.vein === "cool" && state.tone === "soft")   return "summer";
  if (state.vein === "warm" && state.tone === "bright") return "autumn";
  return "spring"; // warm + soft
}