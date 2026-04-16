"use client";

import { createContext } from "react";
import type { AnalyzeState } from "@/types/analyze";
import type { Action } from "./analyzeReducer";

export type AnalyzeContextValue = {
  state: AnalyzeState;
  dispatch: React.Dispatch<Action>;
};

export const AnalyzeContext = createContext<
  AnalyzeContextValue | undefined
>(undefined);
