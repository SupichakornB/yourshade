import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AnalyzeProvider } from "@/context/AnalyzeProvider.tsx";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AnalyzeProvider>
      <App />
    </AnalyzeProvider>
  </StrictMode>
);
