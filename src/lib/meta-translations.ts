import esJson from "@/locales/es.json";
import enJson from "@/locales/en.json";
import type { Language } from "@/components/language-provider";
import { DEFAULT_LOCALE, resolveLocale } from "@/lib/i18n-routing";
import { stripBase } from "@/lib/locale-helpers";

type MetaKey = keyof typeof esJson;

function getTranslations(lang: Language) {
  return lang === "en" ? enJson : esJson;
}

export function getMetaTranslation(key: MetaKey, lang: Language): string {
  const translations = getTranslations(lang);
  return translations[key] || esJson[key] || "";
}

/** Locale detected from the URL. Falls back to stored/browser preference only on the client. */
export function getInitialLanguage(pathname?: string): Language {
  if (pathname !== undefined) {
    const match = stripBase(pathname).match(/^\/(es|en)\b/);
    return match ? resolveLocale(match[1]) : DEFAULT_LOCALE;
  }

  try {
    const saved = localStorage.getItem("rocsta-lang") as Language | null;
    if (saved === "es" || saved === "en") {
      return saved;
    }
    const browserLang = navigator.language.split("-")[0];
    return browserLang === "en" ? "en" : "es";
  } catch {
    return "es";
  }
}
