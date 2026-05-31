import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getMetaTranslation } from "@/lib/meta-translations";
import type { Language } from "@/lib/i18n-routing";
import ogImage from "@/assets/rocsta-hero.jpg";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";
const BASE = (import.meta as { env: Record<string, string> }).env?.BASE_URL || "/";

function detectLocale(): Language {
  try {
    const saved = localStorage.getItem("rocsta-lang");
    if (saved === "en" || saved === "es") return saved;
    return navigator.language.startsWith("en") ? "en" : "es";
  } catch {
    return "es";
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: getMetaTranslation("meta.root.title", "es") },
      { name: "description", content: getMetaTranslation("meta.root.description", "es") },
      { property: "og:title", content: getMetaTranslation("meta.root.ogTitle", "es") },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "alternate", hrefLang: "es", href: `${SITE_URL}/es/` },
      { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/en/` },
      { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/es/` },
    ],
  }),
  component: RootIndex,
});

function RootIndex() {
  const navigate = useNavigate();
  useEffect(() => {
    const locale = detectLocale();
    navigate({ to: `/${locale}/`, replace: true });
  }, [navigate]);

  return (
    <nav>
      <a href={`${BASE}es/`}>Español</a>
      <a href={`${BASE}en/`}>English</a>
    </nav>
  );
}
