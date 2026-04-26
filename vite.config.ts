import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
optimizeDeps: {
  include: ["@mediapipe/tasks-vision", "face-api.js"],
},
  server: {
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/package.json", "**/tsconfig*.json"],
    },
  },
    build: {
    sourcemap: false
  }
});