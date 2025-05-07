
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure compatibility with Cloudflare
  build: {
    target: "esnext",
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      // Explicitly mark these packages as external if needed
      // or ensure they are properly bundled
      external: [],
    }
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable'],
  }
}));
