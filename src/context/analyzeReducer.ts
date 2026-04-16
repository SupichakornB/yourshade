import type { AnalyzeState, VeinType, ToneType } from "@/types/analyze";

export const initialState: AnalyzeState = {
  image: null,
  vein: null,
  tone: null,
  result: null,
};

export type Action =
  | { type: "SET_IMAGE"; payload: File | null }
  | { type: "SET_VEIN"; payload: VeinType }
  | { type: "SET_TONE"; payload: ToneType }
  | { type: "SET_RESULT"; payload: string }
  | { type: "RESET" };

export function reducer(state: AnalyzeState, action: Action): AnalyzeState {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, image: action.payload };
    case "SET_VEIN":
      return { ...state, vein: action.payload };
    case "SET_TONE":
      return { ...state, tone: action.payload };
    case "SET_RESULT":
      return { ...state, result: action.payload };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}