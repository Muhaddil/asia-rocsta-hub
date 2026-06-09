import { parts } from "./parts";
import { compatibilities } from "./compatibility";
import { guides } from "./guides";
import { problems } from "./problems";
import { manuals } from "./manuals";
import { localize, type LocalizedString, type SearchResult } from "./types";
import type { Language } from "@/components/language-provider";
import { normalizeString } from "@/lib/utils";

/** Simple translation map for search result labels (avoids importing React context). */
const SEARCH_LABELS: Record<string, Record<Language, string>> = {
  "search.prefix.oem": { es: "OEM", en: "OEM", fr: "OEM", pt: "OEM", de: "OEM" },
  "search.prefix.cat": { es: "Cat", en: "Cat", fr: "Cat", pt: "Cat", de: "Kat" },
  "search.prefix.motor": { es: "Motor", en: "Engine", fr: "Moteur", pt: "Motor", de: "Motor" },
  "search.prefix.swap": {
    es: "Equivalencia",
    en: "Equivalent",
    fr: "Équivalent",
    pt: "Equivalente",
    de: "Äquivalent",
  },
  "search.prefix.donor": {
    es: "Donante",
    en: "Donor",
    fr: "Donateur",
    pt: "Doador",
    de: "Spender",
  },
  "search.prefix.guide": { es: "Guía", en: "Guide", fr: "Guide", pt: "Guia", de: "Anleitung" },
  "search.prefix.issue": { es: "Fallo", en: "Issue", fr: "Problème", pt: "Falha", de: "Fehler" },
  "search.prefix.severity": {
    es: "Severidad",
    en: "Severity",
    fr: "Sévérité",
    pt: "Gravidade",
    de: "Schweregrad",
  },
  "search.prefix.doc": {
    es: "Documento",
    en: "Document",
    fr: "Document",
    pt: "Documento",
    de: "Dokument",
  },
  "search.prefix.lang": { es: "Idioma", en: "Language", fr: "Langue", pt: "Idioma", de: "Sprache" },
};

function searchLabel(key: string, lang: Language): string {
  return SEARCH_LABELS[key]?.[lang] || SEARCH_LABELS[key]?.["es"] || key;
}

/** Joins all localized variants of a value for indexing across languages. */
function indexed(value: string | LocalizedString | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return Object.values(value).join(" ");
}

/**
 * Performs a global unified search across all static collections.
 * Indexing is language-agnostic; display strings use the active language.
 */
export function globalSearch(query: string, lang: Language = "es"): SearchResult[] {
  const cleanQuery = normalizeString(query.trim());
  if (!cleanQuery) return [];

  const results: SearchResult[] = [];

  // 1. Parts
  for (const part of parts) {
    const target = normalizeString(
      [
        indexed(part.name),
        indexed(part.oem),
        indexed(part.description),
        part.equiv.join(" "),
        (part.refs || []).join(" "),
      ].join(" "),
    );
    if (target.includes(cleanQuery)) {
      const name = localize(part.name, lang);
      results.push({
        type: "part",
        id: part.id,
        title: name,
        description: `${searchLabel("search.prefix.oem", lang)}: ${localize(part.oem, lang)} | ${searchLabel("search.prefix.cat", lang)}: ${part.category} | ${searchLabel("search.prefix.motor", lang)}: ${part.motor}`,
        to: "/parts",
        params: { search: name, category: part.category },
      });
    }
  }

  // 2. Compatibilities
  for (const comp of compatibilities) {
    const target = normalizeString(
      [
        indexed(comp.rocstaPart),
        indexed(comp.donorVehicle),
        comp.donorRef,
        indexed(comp.notes),
      ].join(" "),
    );
    if (target.includes(cleanQuery)) {
      const rocstaPart = localize(comp.rocstaPart, lang);
      const donorVehicle = localize(comp.donorVehicle, lang);
      results.push({
        type: "compatibility",
        id: comp.id,
        title: `${searchLabel("search.prefix.swap", lang)}: ${rocstaPart}`,
        description: `${searchLabel("search.prefix.donor", lang)}: ${donorVehicle} (${comp.type})`,
        to: "/compatibility",
        params: { search: rocstaPart, category: comp.category },
      });
    }
  }

  // 3. Guides
  for (const guide of guides) {
    const target = normalizeString(
      [
        indexed(guide.title),
        indexed(guide.description),
        guide.tools.map((t) => indexed(t.name)).join(" "),
        guide.tags.join(" "),
      ].join(" "),
    );
    if (target.includes(cleanQuery)) {
      results.push({
        type: "guide",
        id: guide.id,
        title: localize(guide.title, lang),
        description: `${searchLabel("search.prefix.guide", lang)} (${guide.level}) | ${guide.time} | ${searchLabel("search.prefix.motor", lang)}: ${guide.motor}`,
        to: "/guides",
        params: { slug: guide.slug },
      });
    }
  }

  // 4. Problems
  for (const prob of problems) {
    const target = normalizeString(
      [
        indexed(prob.title),
        indexed(prob.symptom),
        indexed(prob.cause),
        indexed(prob.solution),
      ].join(" "),
    );
    if (target.includes(cleanQuery)) {
      const title = localize(prob.title, lang);
      const symptom = localize(prob.symptom, lang);
      results.push({
        type: "problem",
        id: prob.id,
        title: `${searchLabel("search.prefix.issue", lang)}: ${title}`,
        description: `${searchLabel("search.prefix.severity", lang)}: ${prob.severity} | ${symptom.substring(0, 80)}...`,
        to: "/problems",
        params: { search: title },
      });
    }
  }

  // 5. Manuals
  for (const man of manuals) {
    const target = normalizeString(
      [indexed(man.title), indexed(man.description), man.year || ""].join(" "),
    );
    if (target.includes(cleanQuery)) {
      const title = localize(man.title, lang);
      results.push({
        type: "manual",
        id: man.id,
        title,
        description: `${searchLabel("search.prefix.doc", lang)} (${man.format.toUpperCase()}) | ${searchLabel("search.prefix.lang", lang)}: ${man.language.toUpperCase()}`,
        to: "/manuals",
        params: { search: title },
      });
    }
  }

  return results.slice(0, 20);
}
