import { fileURLToPath } from "node:url";
import { defineProject } from "vitest/config";

export default defineProject({
  resolve: {
    alias: [
      {
        find: "@fast-embed/core/providers/youtube",
        replacement: fileURLToPath(new URL("../core/src/providers/youtube.ts", import.meta.url))
      },
      {
        find: "@fast-embed/core",
        replacement: fileURLToPath(new URL("../core/src/index.ts", import.meta.url))
      }
    ]
  },
  test: {
    name: "react",
    environment: "jsdom",
    include: ["tests/**/*.test.tsx"]
  }
});
