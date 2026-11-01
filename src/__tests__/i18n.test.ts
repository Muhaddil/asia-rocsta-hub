import { describe, expect, it } from "vitest";
import es from "@/locales/es.json";
import en from "@/locales/en.json";
import { DEFAULT_LOCALE, LOCALES, getAlternateHrefs, resolveLocale } from "@/lib/i18n-routing";
import { getMetaTranslation } from "@/lib/meta-translations";

describe("i18n parity", () => {
  it("has exactly the same keys in ES and EN", () => {
    const esKeys = Object.keys(es).sort();
    const enKeys = Object.keys(en).sort();
    expect(enKeys).toEqual(esKeys);
  });

  it("has no empty translations", () => {
    for (const [locale, dict] of [
      ["es", es],
      ["en", en],
    ] as const) {
      for (const [key, value] of Object.entries(dict)) {
        expect(typeof value, `${locale}:${key}`).toBe("string");
        expect(value.trim(), `${locale}:${key}`).not.toBe("");
      }
    }
  });

  it("keeps only ES and EN locales", () => {
    expect(LOCALES).toEqual(["es", "en"]);
    expect(DEFAULT_LOCALE).toBe("es");
  });

  it("resolves legacy and unknown locales to the default", () => {
    expect(resolveLocale("es")).toBe("es");
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("fr")).toBe("es");
    expect(resolveLocale(undefined)).toBe("es");
  });

  it("generates ES, EN and x-default alternates", () => {
    const alternates = getAlternateHrefs("/parts", "https://example.com");
    expect(alternates).toEqual([
      { hreflang: "es", href: "https://example.com/es/parts/" },
      { hreflang: "en", href: "https://example.com/en/parts/" },
      { hreflang: "x-default", href: "https://example.com/es/parts/" },
    ]);
  });

  it("returns localized metadata instead of falling back to Spanish", () => {
    const esTitle = getMetaTranslation("meta.guides.title", "es");
    const enTitle = getMetaTranslation("meta.guides.title", "en");
    expect(esTitle).not.toBe("");
    expect(enTitle).not.toBe("");
    expect(enTitle).not.toBe(esTitle);
  });
});
