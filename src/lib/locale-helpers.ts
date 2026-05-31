import { resolveLocale, type Language } from "@/lib/i18n-routing";

const BASE = (import.meta as { env: Record<string, string> }).env?.BASE_URL || "/";
const BASE_PATH = BASE.replace(/\/$/, "");

export function getCurrentLocale(): Language {
  if (typeof window === "undefined") return "es";
  const path = window.location.pathname.replace(BASE_PATH, "");
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first === "es" || first === "en" || first === "fr" || first === "pt" || first === "de")
    return first;
  return "es";
}

export function localePath(path: string, locale?: Language): string {
  const lang = locale || getCurrentLocale();
  return `/${lang}${path}`;
}

export function stripBase(path: string): string {
  return path.replace(BASE_PATH, "");
}
