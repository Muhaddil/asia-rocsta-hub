import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

const locales = ["", "/es", "/en"];
const pages = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/parts", changefreq: "weekly", priority: "0.9" },
  { path: "/compatibility", changefreq: "weekly", priority: "0.9" },
  { path: "/guides", changefreq: "weekly", priority: "0.8" },
  { path: "/problems", changefreq: "weekly", priority: "0.8" },
  { path: "/manuals", changefreq: "monthly", priority: "0.7" },
  { path: "/community", changefreq: "daily", priority: "0.6" },
  { path: "/about", changefreq: "monthly", priority: "0.5" },
  { path: "/coming-soon", changefreq: "monthly", priority: "0.3" },
];

const urls = locales
  .flatMap((locale) =>
    pages.map((p) => ({
      path: locale + p.path,
      changefreq: p.changefreq,
      priority: p.priority,
    })),
  )
  .map(
    (r) => `  <url>
    <loc>${BASE_URL}${r.path}</loc>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`,
  )
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`✓ sitemap.xml generado en ${outPath}`);
