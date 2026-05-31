import { resolveLocale, type Language } from "@/lib/i18n-routing";

export function getCurrentLocale(): Language {
  if (typeof window === "undefined") return "es";
  const path = window.location.pathname;
  const segments = path.split("/").filter(Boolean);
  const first = segments[0];
  if (first === "es" || first === "en") return first;
  return "es";
}

export function localePath(path: string, locale?: Language): string {
  const lang = locale || getCurrentLocale();
  return `/${lang}${path}`;
}
