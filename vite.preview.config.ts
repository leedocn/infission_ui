import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: [
    { find: "infisson_ui/styles.css", replacement: fileURLToPath(new URL("./packages/infisson_ui/src/styles.css", import.meta.url)) },
    { find: /^infisson_ui$/, replacement: fileURLToPath(new URL("./packages/infisson_ui/src/index.ts", import.meta.url)) },
  ] },
  server: { port: 4173, strictPort: true },
  build: { outDir: ".preview-build", rollupOptions: { input: "preview-entry.html" } },
});
