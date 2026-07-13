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
          if (id.includes("react-dom") || id.includes("/react/") || id.includes("react-router")) return "vendor-react";
          if (id.includes("@radix-ui")) return "vendor-radix";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (id.includes("xlsx")) return "vendor-xlsx";
          if (id.includes("@fortawesome")) return "vendor-fontawesome";
          if (id.includes("@tanstack")) return "vendor-query";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("date-fns")) return "vendor-date";
          if (id.includes("zod")) return "vendor-zod";
          if (id.includes("react-hook-form") || id.includes("@hookform")) return "vendor-forms";
          return "vendor";
        },
      },
    },
  },
}));
