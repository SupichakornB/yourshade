import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

export default defineConfig({
  plugins: [ViteImageOptimizer({
      jpg: { quality: 80 },
      png: { quality: 80 },
    }), 
    react(),
    tailwindcss()],
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
    sourcemap: false,
  }
});