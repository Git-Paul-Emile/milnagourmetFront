import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          /* IMPORTANT : ne JAMAIS séparer React des librairies qui en dépendent au
             niveau module (@radix-ui, lucide-react, recharts, react-router,
             @tanstack, react-hook-form…). L'ancien découpage faisait s'exécuter
             vendor-radix avant l'initialisation de React en production :
             "TypeError: Cannot read properties of undefined (reading 'useLayoutEffect')"
             → page blanche. On ne sépare que des librairies 100 % indépendantes de React. */
          if (id.includes("xlsx")) return "vendor-xlsx";
          if (id.includes("@fortawesome") && !id.includes("react-fontawesome")) return "vendor-fontawesome";
          if (id.includes("date-fns")) return "vendor-date";
          if (id.includes("zod")) return "vendor-zod";
          // React + tout l'écosystème React dans un seul chunk : ordre d'exécution garanti
          return "vendor";
        },
      },
    },
  },
}));
