import esJson from "@/locales/es.json";
import enJson from "@/locales/en.json";
import type { Language } from "@/components/language-provider";

type MetaKey = keyof typeof esJson;

function getTranslations(lang: Language) {
  return lang === "en" ? enJson : esJson;
}

export function getMetaTranslation(key: MetaKey, lang: Language): string {
  const translations = getTranslations(lang);
  return translations[key] || esJson[key] || "";
}

export function getInitialLanguage(): Language {
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
