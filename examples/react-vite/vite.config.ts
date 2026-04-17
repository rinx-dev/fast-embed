import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@fast-embed/react/styles.css",
        replacement: resolve(__dirname, "../../packages/react/src/styles.css")
      },
      {
        find: "@fast-embed/core/providers/youtube",
        replacement: resolve(__dirname, "../../packages/core/src/providers/youtube.ts")
      },
      {
        find: "@fast-embed/core",
        replacement: resolve(__dirname, "../../packages/core/src/index.ts")
      },
      {
        find: "@fast-embed/react",
        replacement: resolve(__dirname, "../../packages/react/src/index.ts")
      }
    ]
  }
});
