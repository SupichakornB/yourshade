import type { AnalyzeState } from "@/types/analyze";

type Season = "winter" | "summer" | "autumn" | "spring";

export function analyzeResult(state: AnalyzeState): Season {
  if (state.vein === "cool") {
    // winter = bright + high contrast
    // summer = soft + low contrast
    if (state.tone === "bright") return "winter";
    if (state.tone === "soft")   return "summer";
  } else {
    if (state.tone === "bright") return "spring";
    if (state.tone === "soft")   return "autumn";
  }
  return state.vein === "cool" ? "summer" : "autumn";
}