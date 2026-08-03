import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

const corpusPath = process.argv[2] ?? resolve(root, "public/manual/am102-text.json");
const outPath = process.argv[3] ?? resolve(root, "public/manual/am102-text.es.json");
const cacheDir =
  process.argv[4] ?? "C:/Users/naike/AppData/Local/Temp/opencode/manual_es_translations";

const TL = "es";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64)";
const GLOBAL_COOLDOWN_MS = 90000;
const PROVIDER_COOLDOWN_MS = 180000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

mkdirSync(cacheDir, { recursive: true });

const corpus = JSON.parse(readFileSync(corpusPath, "utf-8"));
if (!Array.isArray(corpus)) {
  console.error("✗ Corpus is not an array:", corpusPath);
  process.exit(1);
}

function pageCachePath(page) {
  return join(cacheDir, `${page}.txt`);
}

function pageProvPath(page) {
  return join(cacheDir, `${page}.prov`);
}

/** Split text into chunks of at most `max` chars, preserving line breaks. */
function chunkLines(text, max) {
  const lines = text.split("\n");
  const chunks = [];
  let current = [];
  let len = 0;
  for (const line of lines) {
    if (len + line.length + 1 > max && current.length) {
      chunks.push(current.join("\n"));
      current = [];
      len = 0;
    }
    current.push(line);
    len += line.length + 1;
  }
  if (current.length) chunks.push(current.join("\n"));
  return chunks;
}

async function googleChunk(chunk, url, client) {
  const params = new URLSearchParams();
  params.set("client", client);
  params.set("sl", "en");
  params.set("tl", TL);
  params.set("dt", "t");
  params.set("q", chunk);
  const res = await fetch(`${url}?${params.toString()}`, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const segments = Array.isArray(data?.[0]) ? data[0] : [];
  return segments.map((seg) => seg?.[0] ?? "").join("");
}

async function mymemoryChunk(chunk) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en%7C${TL}`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }
  const data = await res.json();
  const t = data?.responseData?.translatedText;
  if (!t || t.startsWith("MYMEMORY WARNING")) throw new Error("mymemory reject");
  return t;
}

const providers = [
  {
    name: "gm-mobile",
    chunkMax: 900,
    async translateChunk(chunk) {
      const url = `https://translate.google.com/m?sl=en&tl=${TL}&q=${encodeURIComponent(chunk)}`;
      const res = await fetch(url, {
        headers: { "User-Agent": UA, "Accept-Language": "es-ES" },
      });
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        throw err;
      }
      const html = await res.text();
      const textarea = html.match(/<textarea[^>]*>([\s\S]*?)<\/textarea>/);
      const fallback = html.match(/class="result-container"[^>]*>([\s\S]*?)</);
      const t = textarea?.[1] ?? fallback?.[1];
      if (t == null) throw new Error("gm-mobile reject");
      return t
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
    },
  },
  {
    name: "lingva",
    chunkMax: 900,
    async translateChunk(chunk) {
      const url = `https://lingva.ml/api/v1/en/es/${encodeURIComponent(chunk)}`;
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (!res.ok) {
        const err = new Error(`HTTP ${res.status}`);
        err.status = res.status;
        throw err;
      }
      const data = await res.json();
      const t = data?.translation;
      if (!t) throw new Error("lingva reject");
      return t;
    },
  },
  {
    name: "gtx-googleapis",
    chunkMax: 1500,
    async translateChunk(chunk) {
      return googleChunk(chunk, "https://translate.googleapis.com/translate_a/single", "gtx");
    },
  },
  {
    name: "at-google",
    chunkMax: 1500,
    async translateChunk(chunk) {
      return googleChunk(chunk, "https://translate.google.com/translate_a/single", "at");
    },
  },
  {
    name: "mymemory",
    chunkMax: 450,
    translateChunk: mymemoryChunk,
  },
];

const providerCooldown = {}; // name -> timestamp when usable again
const cooldownMs = (name) => (name === "lingva" ? 60000 : PROVIDER_COOLDOWN_MS);
function usableProviders() {
  return providers.filter(
    (p) => !providerCooldown[p.name] || Date.now() > providerCooldown[p.name],
  );
}

async function translatePage(text) {
  const available = usableProviders();
  for (const provider of available) {
    try {
      const parts = [];
      for (const chunk of chunkLines(text, provider.chunkMax)) {
        if (!chunk.trim()) {
          parts.push("");
          continue;
        }
        parts.push(await provider.translateChunk(chunk));
      }
      return { text: parts.join("\n"), provider: provider.name };
    } catch (e) {
      const status = e?.status ?? 0;
      if (status === 429) {
        providerCooldown[provider.name] = Date.now() + cooldownMs(provider.name);
        console.warn(
          `  ${provider.name} cooled down until ${new Date(providerCooldown[provider.name]).toISOString()}`,
        );
      } else {
        console.warn(`  ${provider.name} failed (${e.message})`);
      }
    }
  }
  return null;
}

(async () => {
  const start = Date.now();

  while (true) {
    let done = 0;
    let skipped = 0;
    let pending = 0;
    let consecutiveFailures = 0;

    for (const entry of corpus) {
      const page = entry.page;
      const text = (entry.text ?? "").trim();
      if (existsSync(pageCachePath(page))) {
        skipped++;
        continue;
      }
      if (!text) {
        writeFileSync(pageCachePath(page), "", "utf-8");
        writeFileSync(pageProvPath(page), "empty", "utf-8");
        skipped++;
        continue;
      }

      const result = await translatePage(text);
      if (result) {
        writeFileSync(pageCachePath(page), result.text, "utf-8");
        writeFileSync(pageProvPath(page), result.provider, "utf-8");
        done++;
        consecutiveFailures = 0;
      } else {
        pending++;
        consecutiveFailures++;
        console.error(`  page ${page} pending (all providers unavailable)`);
        if (consecutiveFailures >= 4) {
          console.warn(
            `  ${consecutiveFailures} consecutive failures; global cooldown ${GLOBAL_COOLDOWN_MS / 1000}s`,
          );
          await sleep(GLOBAL_COOLDOWN_MS);
          consecutiveFailures = 0;
        }
      }

      if ((done + skipped) % 10 === 0 || done + skipped === 1) {
        const el = Math.round((Date.now() - start) / 1000);
        console.log(
          `  [${new Date().toISOString()}] progress: ${done} done, ${skipped} cached, ${pending} pending (${el}s)`,
        );
      }
    }

    if (pending > 0) {
      console.log(`… ${pending} pages still pending; retrying in 30s`);
      await sleep(30000);
      continue;
    }
    break;
  }

  const result = corpus.map((entry) => {
    const text = existsSync(pageCachePath(entry.page))
      ? readFileSync(pageCachePath(entry.page), "utf-8")
      : (entry.text ?? "");
    return { page: entry.page, text };
  });

  writeFileSync(outPath, JSON.stringify(result), "utf-8");
  const totalChars = result.reduce((sum, p) => sum + p.text.length, 0);
  console.log(`✓ ${outPath} written (${result.length} pages, ${totalChars} chars)`);
})().catch((e) => {
  console.error("✗ fatal:", e);
  process.exit(1);
});
