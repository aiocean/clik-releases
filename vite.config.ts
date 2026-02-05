import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import annotator from "vite-plugin-ai-annotator";

export default defineConfig({
  plugins: [tailwindcss(), annotator({ port: 7318, autoSetupMcp: true })],
  base: "/clik-releases/",
  build: {
    outDir: ".",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        assetFileNames: "assets/[name]-[hash][extname]",
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
});
