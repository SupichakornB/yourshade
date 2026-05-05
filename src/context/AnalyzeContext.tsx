"use client";

import { createContext } from "react";
import type { Action } from "./analyzeReducer";
import type { AnalyzeState } from "@/types/analyze";

export interface AnalyzeContextValue {
  state: AnalyzeState;
  dispatch: React.Dispatch<Action>;
}

export const AnalyzeContext = createContext<AnalyzeContextValue | null>(null);