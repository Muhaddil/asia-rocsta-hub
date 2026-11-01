import { DEFAULT_LOCALE, isValidLocale, type Language } from "@/lib/i18n-routing";

const BASE = (import.meta as { env: Record<string, string> }).env?.BASE_URL || "/";
const BASE_PATH = BASE.replace(/\/$/, "");

export function getCurrentLocale(): Language {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const path = window.location.pathname.replace(BASE_PATH, "");
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  return isValidLocale(first) ? first : DEFAULT_LOCALE;
}

export function localePath(path: string, locale: Language = DEFAULT_LOCALE): string {
  const trailing = path === "/" ? "" : "/";
  return `/${locale}${path}${trailing}`;
}

export function stripBase(path: string): string {
  return path.replace(BASE_PATH, "");
}
