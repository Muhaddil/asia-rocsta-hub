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
        crawlLinks: false,
      },
      pages: [
        { path: "/" },
        { path: "/es/" },
        { path: "/en/" },
        { path: "/fr/" },
        { path: "/pt/" },
        { path: "/de/" },
        { path: "/es/about" },
        { path: "/en/about" },
        { path: "/fr/about" },
        { path: "/pt/about" },
        { path: "/de/about" },
        { path: "/es/parts" },
        { path: "/en/parts" },
        { path: "/fr/parts" },
        { path: "/pt/parts" },
        { path: "/de/parts" },
        { path: "/es/guides" },
        { path: "/en/guides" },
        { path: "/fr/guides" },
        { path: "/pt/guides" },
        { path: "/de/guides" },
        { path: "/es/problems" },
        { path: "/en/problems" },
        { path: "/fr/problems" },
        { path: "/pt/problems" },
        { path: "/de/problems" },
        { path: "/es/manuals" },
        { path: "/en/manuals" },
        { path: "/fr/manuals" },
        { path: "/pt/manuals" },
        { path: "/de/manuals" },
        { path: "/es/compatibility" },
        { path: "/en/compatibility" },
        { path: "/fr/compatibility" },
        { path: "/pt/compatibility" },
        { path: "/de/compatibility" },
        { path: "/es/community" },
        { path: "/en/community" },
        { path: "/fr/community" },
        { path: "/pt/community" },
        { path: "/de/community" },
        { path: "/es/coming-soon" },
        { path: "/en/coming-soon" },
        { path: "/fr/coming-soon" },
        { path: "/pt/coming-soon" },
        { path: "/de/coming-soon" },
        { path: "/es/forum" },
        { path: "/en/forum" },
        { path: "/fr/forum" },
        { path: "/pt/forum" },
        { path: "/de/forum" },
        { path: "/es/changelog" },
        { path: "/en/changelog" },
        { path: "/fr/changelog" },
        { path: "/pt/changelog" },
        { path: "/de/changelog" },
        { path: "/es/gallery" },
        { path: "/en/gallery" },
        { path: "/fr/gallery" },
        { path: "/pt/gallery" },
        { path: "/de/gallery" },
      ],
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
