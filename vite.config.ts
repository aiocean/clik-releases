import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import annotator from "vite-plugin-ai-annotator";

export default defineConfig({
  plugins: [tailwindcss(), annotator({ port: 7318 })],
  // Site is served at the root of the custom domain clik.aiocean.io
  base: "/",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
});
