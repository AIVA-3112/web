import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,  // Changed from 5173 to 8080 to match Azure App Service default port
    strictPort: true,
    proxy: {
      "/api": {
        target: "https://web-production-50913.up.railway.app",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  preview: {
    host: true,
    port: 8080,  // Changed from 5173 to 8080 to match Azure App Service default port
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
  build: {
    outDir: "dist",
    assetsDir: "assets",
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
        }
      }
    }
  }
}));