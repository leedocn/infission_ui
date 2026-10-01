import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      // The published package should expose component declarations only.  Vite's
      // default declaration scan also picks up tests and local build configs,
      // which would make implementation-only files part of the install contract.
      include: ["src"],
      exclude: ["src/**/*.test.*", "src/test-setup.*"]
    })
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "InfissonUI",
      formats: ["es", "cjs"],
      fileName: (format) => (format === "es" ? "index.js" : "index.cjs")
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"]
    },
    emptyOutDir: true
  }
});
