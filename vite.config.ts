import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { vitonApiPlugin } from "./vite-plugin-viton-api.js";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: [
        path.resolve(__dirname),                // main folder
        path.resolve("C:\\Users\\Shivaay Dhondiyal\\Desktop\\shivaay\\coding\\2_projects\\12_clothes_tryon\\ezyZip") // external project folder
      ]
    },
    proxy: {
      // VITON Frontend Routes
      '/viton/front': {
        target: 'http://localhost:5173',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/viton\/front/, '')
      },
      // VITON Backend API Routes  
      '/viton/back': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/viton\/back/, '')
      }
    }
  },
  plugins: [
    react(),
    vitonApiPlugin(),
    // mode === 'development'
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
