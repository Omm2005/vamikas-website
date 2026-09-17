import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Builds the whole site into two flat files — ./app.js and ./styles.css — so the
// static shells (index.html plus the /about, /project, … route folders) keep working
// exactly as before behind `python3 -m http.server`.
export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(process.cwd(), "src") } },
  build: {
    outDir: "dist",
    assetsDir: ".",
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(process.cwd(), "src/index.jsx"),
      output: {
        format: "iife",
        inlineDynamicImports: true,
        entryFileNames: "app.js",
        assetFileNames: (asset) =>
          asset.name && asset.name.endsWith(".css") ? "styles.css" : "assets/[name][extname]",
      },
    },
  },
});
