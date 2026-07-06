import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://muhaddil.github.io/asia-rocsta-hub";
const LOCALES = ["es", "en", "fr", "pt", "de"];
const DEFAULT_LOCALE = "es";

const PAGE_META = {
  "/": { changefreq: "weekly", priority: "1.0" },
  "/parts": { changefreq: "weekly", priority: "0.9" },
  "/compatibility": { changefreq: "weekly", priority: "0.9" },
  "/guides": { changefreq: "weekly", priority: "0.8" },
  "/problems": { changefreq: "weekly", priority: "0.8" },
  "/manuals": { changefreq: "monthly", priority: "0.7" },
  "/community": { changefreq: "daily", priority: "0.6" },
  "/forum": { changefreq: "daily", priority: "0.7" },
  "/about": { changefreq: "monthly", priority: "0.5" },
  "/coming-soon": { changefreq: "monthly", priority: "0.3" },
  "/changelog": { changefreq: "monthly", priority: "0.4" },
  "/gallery": { changefreq: "monthly", priority: "0.5" },
};

const now = new Date().toISOString().split("T")[0];

const urlEntries = [];

urlEntries.push({
  loc: `${BASE_URL}/`,
  changefreq: "weekly",
  priority: "1.0",
  lastmod: now,
  alternates: LOCALES.map((l) => ({ lang: l, href: `${BASE_URL}/${l}/` })),
});

for (const locale of LOCALES) {
  for (const [path, meta] of Object.entries(PAGE_META)) {
    const pathPart = path === "/" ? "/" : path;
    const loc = `${BASE_URL}/${locale}${pathPart}`;

    const alternates = LOCALES.map((l) => ({
      lang: l,
      href: `${BASE_URL}/${l}${pathPart}`,
    }));
    alternates.push({
      lang: "x-default",
      href: `${BASE_URL}/${DEFAULT_LOCALE}${pathPart}`,
    });

    urlEntries.push({
      loc,
      changefreq: meta.changefreq,
      priority: meta.priority,
      lastmod: now,
      alternates,
    });
  }
}

function buildUrlXml(entry) {
  const alternateLinks = entry.alternates
    .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${a.href}" />`)
    .join("\n");

  return `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
${alternateLinks}
  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.map(buildUrlXml).join("\n")}
</urlset>`;

const outPath = resolve(__dirname, "..", "public", "sitemap.xml");
writeFileSync(outPath, xml, "utf-8");
console.log(`✓ sitemap.xml generado: ${urlEntries.length} URLs → ${outPath}`);
