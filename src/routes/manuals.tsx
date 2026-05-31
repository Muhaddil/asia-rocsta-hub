import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { normalizeString } from "@/lib/utils";
import { PageShell, Crumbs } from "@/components/page-shell";
import { manuals } from "@/data/manuals";
import type { ManualType, ManualLanguage } from "@/data/types";
import { localize } from "@/data/types";
import { getMetaTranslation, getInitialLanguage } from "@/lib/meta-translations";
import ogImage from "@/assets/rocsta-hero.jpg";
import {
  Search,
  FilterX,
  FileText,
  FileDown,
  BookOpen,
  Globe,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

const manualsSearchSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["workshop", "electrical", "catalog", "datasheet", "other"]).optional(),
  language: z.enum(["es", "en", "ko", "fr", "de"]).optional(),
  motor: z.enum(["F8", "R2", "ambos"]).optional(),
});

type ManualsSearch = z.infer<typeof manualsSearchSchema>;

export const Route = createFileRoute("/manuals")({
  validateSearch: (search) => manualsSearchSchema.parse(search),
  head: () => {
    const lang = getInitialLanguage();
    return {
      meta: [
        { title: getMetaTranslation("meta.manuals.title", lang) },
        {
          name: "description",
          content: getMetaTranslation("meta.manuals.description", lang),
        },
        { property: "og:title", content: getMetaTranslation("meta.manuals.ogTitle", lang) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.manuals.ogDescription", lang),
        },
        { property: "og:url", content: `${SITE_URL}/manuals` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/manuals` },
        { rel: "alternate", hrefLang: "es", href: `${SITE_URL}/manuals?lang=es` },
        { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/manuals?lang=en` },
        { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/manuals` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: lang === "en" ? "Home" : "Inicio",
                item: "https://muhaddil.github.io/asia-rocsta-hub/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: lang === "en" ? "Technical Manuals" : "Manuales Técnicos",
                item: "https://muhaddil.github.io/asia-rocsta-hub/manuals",
              },
            ],
          }),
        },
      ],
    };
  },
  component: ManualsPage,
});

function ManualsPage() {
  const { t, language } = useLanguage();
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  useMetaTags({
    title: getMetaTranslation("meta.manuals.title", language),
    description: getMetaTranslation("meta.manuals.description", language),
    ogTitle: getMetaTranslation("meta.manuals.ogTitle", language),
    ogDescription: getMetaTranslation("meta.manuals.ogDescription", language),
    ogImage: ogImage,
  });

  const TYPE_LABELS: Record<ManualType, string> = {
    workshop: t("manuals.type.workshop"),
    electrical: t("manuals.type.electrical"),
    catalog: t("manuals.type.catalog"),
    datasheet: t("manuals.type.datasheet"),
    other: t("manuals.filter.allTypesLabel"),
  };

  const LANG_LABELS: Record<ManualLanguage, { label: string; flag: string }> = {
    es: { label: t("manuals.lang.es"), flag: "🇪🇸" },
    en: { label: t("manuals.lang.en"), flag: "🇬🇧" },
    ko: { label: t("manuals.lang.ko"), flag: "🇰🇷" },
    fr: { label: t("manuals.lang.fr"), flag: "🇫🇷" },
    de: { label: t("manuals.lang.de"), flag: "🇩🇪" },
  };

  const updateSearch = (newParams: Partial<ManualsSearch>) => {
    navigate({
      search: (prev) => {
        const next = { ...prev, ...newParams };
        Object.keys(next).forEach((key) => {
          const k = key as keyof ManualsSearch;
          if (next[k] === undefined || next[k] === "") {
            delete next[k];
          }
        });
        return next;
      },
    });
  };

  const currentSearch = searchParams.search || "";
  const currentType = searchParams.type;
  const currentLanguage = searchParams.language;
  const currentMotor = searchParams.motor;

  const hasActiveFilters = Boolean(currentSearch || currentType || currentLanguage || currentMotor);

  const clearFilters = () => {
    navigate({
      search: () => ({}),
    });
  };

  const filteredList = useMemo(() => {
    return manuals.filter((manual) => {
      // 1. Type Filter
      if (currentType && manual.type !== currentType) return false;

      // 2. Language Filter
      if (currentLanguage && manual.language !== currentLanguage) return false;

      // 3. Motor Filter
      if (currentMotor) {
        if (currentMotor === "F8" && manual.motor === "R2") return false;
        if (currentMotor === "R2" && manual.motor === "F8") return false;
      }

      // 4. Text Search
      if (currentSearch) {
        const query = normalizeString(currentSearch);
        const title = normalizeString(localize(manual.title, language));
        const desc = normalizeString(localize(manual.description, language));

        if (!title.includes(query) && !desc.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [currentSearch, currentType, currentLanguage, currentMotor, language]);

  return (
    <PageShell>
      <div className="space-y-6">
        <Crumbs items={[{ label: t("ui.archive") }, { label: t("nav.manuals"), active: true }]} />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="size-8 text-rocsta-green" /> {t("manuals.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("manuals.desc")}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("manuals.searchManualsPlaceholder")}
                value={currentSearch}
                onChange={(e) => updateSearch({ search: e.target.value })}
                className="pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
              />
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={currentType || ""}
                onChange={(e) =>
                  updateSearch({
                    type: (e.target.value || undefined) as ManualType | undefined,
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("manuals.filter.allTypesLabel")}</option>
                <option value="workshop">{t("manuals.labelWorkshop")}</option>
                <option value="electrical">{t("manuals.labelElectrical")}</option>
                <option value="catalog">{t("manuals.labelCatalog")}</option>
                <option value="datasheet">{t("manuals.labelDatasheet")}</option>
              </select>
            </div>

            <div>
              <select
                value={currentLanguage || ""}
                onChange={(e) =>
                  updateSearch({
                    language: (e.target.value || undefined) as ManualLanguage | undefined,
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("manuals.filter.allLangs")}</option>
                <option value="es">{t("manuals.lang.es")} 🇪🇸</option>
                <option value="en">{t("manuals.lang.en")} 🇬🇧</option>
                <option value="ko">{t("manuals.lang.ko")} 🇰🇷</option>
                <option value="fr">{t("manuals.lang.fr")} 🇫🇷</option>
                <option value="de">{t("manuals.lang.de")} 🇩🇪</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground font-semibold">{t("ui.filters")}</span>
                {currentSearch && (
                  <Badge variant="secondary" className="font-mono">
                    {t("ui.search")}: "{currentSearch}"
                  </Badge>
                )}
                {currentType && (
                  <Badge variant="secondary">
                    {t("ui.type")}: {TYPE_LABELS[currentType]}
                  </Badge>
                )}
                {currentLanguage && (
                  <Badge variant="secondary">
                    {t("ui.language")}: {LANG_LABELS[currentLanguage].label}
                  </Badge>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-rocsta-accent hover:underline"
              >
                <FilterX className="size-3" /> {t("ui.clearFilters")}
              </button>
            </div>
          )}
        </div>

        <div className="text-xs text-muted-foreground">
          {t("manuals.libraryCount", { count: filteredList.length })}
        </div>

        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredList.map((man) => {
              const lang = LANG_LABELS[man.language];
              return (
                <div
                  key={man.id}
                  className="rounded-xl border border-border bg-card p-5 shadow-sm hover:border-rocsta-green/30 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider">
                        {t("manuals.idLabel")}: {man.id}
                      </span>
                      <Badge
                        variant="secondary"
                        className={[
                          "text-[9px] font-bold uppercase py-0.5 px-2",
                          man.type === "workshop" &&
                            "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/10",
                          man.type === "electrical" &&
                            "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/10",
                          man.type === "catalog" &&
                            "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/10",
                          man.type === "datasheet" &&
                            "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        {TYPE_LABELS[man.type]}
                      </Badge>
                    </div>

                    <h3 className="font-extrabold text-base text-foreground leading-snug">
                      {localize(man.title, language)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {localize(man.description, language)}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1">
                        <Globe className="size-3.5 text-rocsta-accent" /> {lang.flag} {lang.label}
                      </span>
                      <span className="flex items-center gap-1 font-mono">
                        <FileText className="size-3.5 text-rocsta-accent" /> {man.pages}{" "}
                        {t("manuals.pages")} ({man.format.toUpperCase()})
                      </span>
                      {man.year && (
                        <span className="flex items-center gap-1 font-mono">
                          <Calendar className="size-3.5 text-rocsta-accent" /> {t("manuals.year")}:{" "}
                          {man.year}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border/20 mt-4 flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase">
                      {t("manuals.engineLabel")}:{" "}
                      {man.motor === "ambos" ? t("manuals.bothEngines") : man.motor}
                    </span>
                    <a
                      href={man.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-rocsta-green/10 hover:bg-rocsta-green px-4 text-xs font-bold text-rocsta-green hover:text-white transition-all shadow-sm"
                    >
                      <FileDown className="size-3.5" /> {t("manuals.card.download")}{" "}
                      <ExternalLink className="size-3 stroke-[1.5]" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3">
              <FilterX className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">{t("manuals.noResults")}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
              {t("manuals.noResultsDesc")}
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all"
            >
              {t("ui.resetFilters")}
            </button>
          </div>
        )}
      </div>
    </PageShell>
  );
}
