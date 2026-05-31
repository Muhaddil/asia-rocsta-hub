import React, { createContext, useContext, useEffect, useState } from "react";
import esJson from "@/locales/es.json";
import enJson from "@/locales/en.json";

export type Language = "es" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const UI_TRANSLATIONS: Record<string, Record<Language, string>> = {};
for (const key of Object.keys(esJson)) {
  UI_TRANSLATIONS[key] = {
    es: esJson[key as keyof typeof esJson],
    en: enJson[key as keyof typeof enJson] as string,
  };
}

const detectLanguage = (): Language => {
  try {
    const saved = localStorage.getItem("rocsta-lang") as Language | null;
    if (saved === "es" || saved === "en") {
      return saved;
    }

    const browserLang = navigator.language.split("-")[0];
    return browserLang === "es" ? "es" : "en";
  } catch {
    return "en";
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setLanguageState(detectLanguage());
    setIsHydrated(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("rocsta-lang", lang);
    } catch {
      /* Malo */
    }
  };

  const t = (key: string, replacements?: Record<string, string | number>): string => {
    const entry = UI_TRANSLATIONS[key];
    if (!entry) return key;
    let text = entry[language] || entry["en"] || key;
    if (replacements) {
      Object.entries(replacements).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }
    return text;
  };

  if (!isHydrated) {
    return (
      <LanguageContext.Provider value={{ language: "en", setLanguage, t }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};