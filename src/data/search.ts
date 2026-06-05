import { parts } from "./parts";
import { compatibilities } from "./compatibility";
import { guides } from "./guides";
import { problems } from "./problems";
import { manuals } from "./manuals";
import { localize, type LocalizedString, type SearchResult } from "./types";
import type { Language } from "@/components/language-provider";
import { normalizeString } from "@/lib/utils";

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
        description: `OEM: ${localize(part.oem, lang)} | Cat: ${part.category} | Motor: ${part.motor}`,
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
        title: `Equivalencia: ${rocstaPart}`,
        description: `Donante: ${donorVehicle} (${comp.type})`,
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
        description: `Guía (${guide.level}) | ${guide.time} | Motor: ${guide.motor}`,
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
        title: `Fallo: ${title}`,
        description: `Severidad: ${prob.severity} | ${symptom.substring(0, 80)}...`,
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
        description: `Documento (${man.format.toUpperCase()}) | Idioma: ${man.language.toUpperCase()}`,
        to: "/manuals",
        params: { search: title },
      });
    }
  }

  return results.slice(0, 20);
}
