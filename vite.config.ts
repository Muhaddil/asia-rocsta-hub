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
const apiUrl = (process.env.VITE_API_URL || "").trim();

if (isGitHubPages && apiUrl && !apiUrl.startsWith("https://")) {
  throw new Error("VITE_API_URL debe usar HTTPS en producción.");
}
if (isGitHubPages && !apiUrl) {
  console.warn(
    "[config] VITE_API_URL no está definido; el sitio se compilará sin API y las funciones dinámicas fallarán.",
  );
}

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
        ...["es", "en"].flatMap((locale) =>
          [
            "",
            "about",
            "parts",
            "guides",
            "problems",
            "manuals",
            "manuals/am102",
            "compatibility",
            "community",
            "coming-soon",
            "forum",
            "changelog",
            "gallery",
          ].map((page) => ({ path: `/${locale}/${page}${page ? "/" : ""}` })),
        ),
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
      exclude: ["favicon.svg"],
      jpeg: { quality: 75, progressive: true },
      jpg: { quality: 75, progressive: true },
      png: { quality: 75 },
      webp: { quality: 75 },
    }),
  ],

  resolve: {
    tsconfigPaths: true,

    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
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
