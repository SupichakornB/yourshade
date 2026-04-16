"use client";

import { useContext } from "react";
import { AnalyzeContext } from "./AnalyzeContext";
import type { AnalyzeContextValue } from "./AnalyzeContext";

export function useAnalyze(): AnalyzeContextValue {
  const context = useContext(AnalyzeContext);
  if (!context) {
    throw new Error("useAnalyze must be used within AnalyzeProvider");
  }
  return context;
}
