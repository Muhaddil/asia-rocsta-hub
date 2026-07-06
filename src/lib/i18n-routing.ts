import type { Language } from "@/components/language-provider";

export type { Language };

export const DEFAULT_LOCALE: Language = "es";
export const LOCALES: Language[] = ["es", "en", "fr", "pt", "de"];

export function isValidLocale(value: string | undefined): value is Language {
  return LOCALES.includes(value as Language);
}

export function resolveLocale(locale: string | undefined): Language {
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function getAlternateHrefs(
  path: string,
  siteUrl: string,
): { hreflang: string; href: string }[] {
  const trailing = path === "/" ? path : `${path}/`;
  const alternates: { hreflang: string; href: string }[] = LOCALES.map((l) => ({
    hreflang: l,
    href: `${siteUrl}/${l}${trailing}`,
  }));
  alternates.push({ hreflang: "x-default", href: `${siteUrl}/${DEFAULT_LOCALE}${trailing}` });
  return alternates;
}
