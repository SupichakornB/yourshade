"use client";

import { createContext, useReducer } from "react";
import type { AnalyzeState, ToneType, LevelType } from "@/types/analyze";

// ─────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────

type Action =
  | { type: "SET_IMAGE";      payload: File | null }
  | { type: "SET_VEIN";       payload: "warm" | "cool" }
  | { type: "SET_TONE";       payload: ToneType }
  | { type: "SET_BRIGHTNESS"; payload: LevelType }
  | { type: "SET_SATURATION"; payload: LevelType }
  | { type: "SET_CONTRAST";   payload: LevelType }
  | { type: "SET_RESULT";     payload: string }
  | { type: "SET_ANALYSIS";   payload: {        // ← เพิ่ม
      tone: ToneType;
      brightness: LevelType;
      saturation: LevelType;
      contrast: LevelType;
      result: string;
    }}
  | { type: "RESET" };

// ─────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────

const initialState: AnalyzeState = {
  image:      null,
  vein:       null,
  tone:       null,
  brightness: null,
  saturation: null,
  contrast:   null,
  result:     null,
};

// ─────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────

function analyzeReducer(state: AnalyzeState, action: Action): AnalyzeState {
  switch (action.type) {
    case "SET_IMAGE":      return { ...state, image:      action.payload };
    case "SET_VEIN":       return { ...state, vein:       action.payload };
    case "SET_TONE":       return { ...state, tone:       action.payload };
    case "SET_BRIGHTNESS": return { ...state, brightness: action.payload };
    case "SET_SATURATION": return { ...state, saturation: action.payload };
    case "SET_CONTRAST":   return { ...state, contrast:   action.payload };
    case "SET_RESULT":     return { ...state, result:     action.payload };
    case "SET_ANALYSIS":
  return {
    ...state,
    tone:       action.payload.tone,
    brightness: action.payload.brightness,
    saturation: action.payload.saturation,
    contrast:   action.payload.contrast,
    result:     action.payload.result,
  };
    case "RESET":          return initialState;
    default:               return state;
  }
}

// ─────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────

export interface AnalyzeContextValue {
  state: AnalyzeState;
  dispatch: React.Dispatch<Action>;
}

export const AnalyzeContext = createContext<AnalyzeContextValue | null>(null);

export function AnalyzeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(analyzeReducer, initialState);

  return (
    <AnalyzeContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalyzeContext.Provider>
  );
}