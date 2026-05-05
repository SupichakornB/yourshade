"use client";


import { useReducer } from "react";
import { AnalyzeContext } from "./AnalyzeContext";
import { reducer, initialState } from "./analyzeReducer";

export function AnalyzeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AnalyzeContext.Provider value={{ state, dispatch }}>
      {children}
    </AnalyzeContext.Provider>
  );
}
