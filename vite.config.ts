// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import path from "node:path";

export default defineConfig({
  plugins: [
    tanstackStart(),
    react(),
    tailwindcss(),
  ],

  resolve: {
    tsconfigPaths: true,

    alias: {
      "@": path.resolve(__dirname, "./src"),
    },

    dedupe: [
      "react",
      "react-dom",
      "@tanstack/react-router",
    ],
  },

  // server: {
  //   host: true,
  //   strictPort: true,
  //   port: 3000,
  //   allowedHosts: true,
  //   // proxy: {
  //   //   "/api": {
  //   //     target: "http://localhost:3001",
  //   //     changeOrigin: true,
  //   //   },
  //   //   "/uploads": {
  //   //     target: "http://localhost:3001",
  //   //     changeOrigin: true,
  //   //   },
  //   // },
  // },

  preview: {
    host: true,
    strictPort: true,
    port: 3000,
  },

  define: {
    "process.env": process.env,
  },
});