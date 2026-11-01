// Verifica el resultado del build: HTML prerenderizado y sitemap.
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const client = path.join(root, "dist", "client");

const requiredPages = [
  "es/index.html",
  "en/index.html",
  "es/manuals/am102/index.html",
  "en/manuals/am102/index.html",
  "es/guides/index.html",
  "en/guides/index.html",
];

let failed = false;
for (const page of requiredPages) {
  const file = path.join(client, page);
  if (!existsSync(file)) {
    console.error(`[verify] Falta la página prerenderizada: ${page}`);
    failed = true;
    continue;
  }
  const html = readFileSync(file, "utf8");
  const locale = page.split("/")[0];
  if (!html.includes(`lang="${locale}"`)) {
    console.error(`[verify] ${page} no declara lang="${locale}"`);
    failed = true;
  }
}

const sitemapPath = path.join(client, "sitemap.xml");
if (!existsSync(sitemapPath)) {
  console.error("[verify] Falta sitemap.xml");
  failed = true;
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  for (const url of ["/es/manuals/am102/", "/en/manuals/am102/"]) {
    if (!sitemap.includes(url)) {
      console.error(`[verify] El sitemap no incluye ${url}`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log(`[verify] ${requiredPages.length} páginas y sitemap correctos.`);
