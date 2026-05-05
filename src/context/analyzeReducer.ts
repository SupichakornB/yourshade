import type { AnalyzeState, VeinType, ToneType, LevelType } from "@/types/analyze";

export const initialState: AnalyzeState = {
  image:      null,
  vein:       null,
  tone:       null,
  brightness: null,
  saturation: null,
  contrast:   null,
  result:     null,
};

export type Action =
  | { type: "SET_IMAGE";      payload: File | null }
  | { type: "SET_VEIN";       payload: VeinType | null }
  | { type: "SET_TONE";       payload: ToneType | null }
  | { type: "SET_BRIGHTNESS"; payload: LevelType | null }
  | { type: "SET_SATURATION"; payload: LevelType | null }
  | { type: "SET_CONTRAST";   payload: LevelType | null  }
  | { type: "SET_RESULT";     payload: string | null }
  | { type: "SET_ANALYSIS";   payload: {
      tone:       ToneType;
      brightness: LevelType;
      saturation: LevelType;
      contrast:   LevelType;
      result:     string;
    }}
  | { type: "RESET" };

export function reducer(state: AnalyzeState, action: Action): AnalyzeState {
  switch (action.type) {
    case "SET_IMAGE":
      return { ...state, image:      action.payload };
    case "SET_VEIN":
      return { ...state, vein:       action.payload };
    case "SET_TONE":
      return { ...state, tone:       action.payload };
    case "SET_BRIGHTNESS":
      return { ...state, brightness: action.payload };
    case "SET_SATURATION":
      return { ...state, saturation: action.payload };
    case "SET_CONTRAST":
      return { ...state, contrast:   action.payload };
    case "SET_RESULT":
      return { ...state, result:     action.payload };
    case "SET_ANALYSIS":
      return {
        ...state,
        tone:       action.payload.tone,
        brightness: action.payload.brightness,
        saturation: action.payload.saturation,
        contrast:   action.payload.contrast,
        result:     action.payload.result,
      };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}