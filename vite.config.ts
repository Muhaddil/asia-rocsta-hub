// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";
import path from "node:path";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const basePath = isGitHubPages ? "/asia-rocsta-hub" : "";
const basePathWithSlash = isGitHubPages ? "/asia-rocsta-hub/" : "/";

export default defineConfig({
  base: basePathWithSlash,
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
        prerender: {
          enabled: true,
        },
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
        failOnError: false,
        autoSubfolderIndex: true,
      },
      router: {
        basepath: basePath,
      },
      client: {
        base: basePathWithSlash,
      },
    }),
    react(),
    tailwindcss(),
    ViteImageOptimizer({
      jpeg: { quality: 75, progressive: true },
      jpg: { quality: 75, progressive: true },
      png: { quality: 75 },
      webp: { quality: 75 },
    }),
  ],

  resolve: {
    tsconfigPaths: true,

    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    dedupe: ["react", "react-dom", "@tanstack/react-router"],
  },

  // server: {
  //   host: true,
  //   strictPort: true,
  //   port: 3000,
  //   allowedHosts: true,
  //   proxy: {
  //     "/api": {
  //       target: "http://localhost:3001",
  //       changeOrigin: true,
  //     },
  //     "/assets": {
  //       target: "http://localhost:3001",
  //       changeOrigin: true,
  //     },
  //     "/uploads": {
  //       target: "http://localhost:3001",
  //       changeOrigin: true,
  //     },
  //   },
  // },

  preview: {
    host: true,
    strictPort: true,
    port: 3000,
  },

  define: {
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || ""),
    "process.env.GITHUB_PAGES": JSON.stringify(process.env.GITHUB_PAGES || ""),
  },
});
