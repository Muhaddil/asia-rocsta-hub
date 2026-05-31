import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { useDebounce, normalizeString } from "@/lib/utils";
import { PageShell, Crumbs } from "@/components/page-shell";
import { guides as staticGuides } from "@/data/guides";
import { api, type ApiGuide } from "@/lib/api";
import type { Guide, Motor, GuideLevel, PartCategory } from "@/data/types";
import { localize } from "@/data/types";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import ogImage from "@/assets/rocsta-hero.jpg";
import {
  Search,
  FilterX,
  Clock,
  BookOpen,
  Wrench,
  Sparkles,
  Info,
  Layers,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

const guidesSearchSchema = z.object({
  search: z.string().optional(),
  motor: z.enum(["F8", "R2", "ambos"]).optional(),
  level: z.enum(["Principiante", "Intermedio", "Avanzado"]).optional(),
});

type GuidesSearch = z.infer<typeof guidesSearchSchema>;

export const Route = createFileRoute("/{-$locale}/guides")({
  validateSearch: (search) => guidesSearchSchema.parse(search),
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.guides.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.guides.description", locale),
        },
        { property: "og:title", content: getMetaTranslation("meta.guides.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.guides.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/guides` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/guides` },
        ...getAlternateHrefs("/guides", SITE_URL).map((a) => ({
          rel: "alternate" as const,
          hrefLang: a.hreflang,
          href: a.href,
        })),
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
                name: locale === "en" ? "Home" : "Inicio",
                item: "https://muhaddil.github.io/asia-rocsta-hub/",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: locale === "en" ? "Technical Guides" : "Guías Técnicas",
                item: "https://muhaddil.github.io/asia-rocsta-hub/guides",
              },
            ],
          }),
        },
      ],
    };
  },
  component: GuidesPage,
});

const LEVEL_KEYS = {
  Principiante: "guides.level.beginner",
  Intermedio: "guides.level.intermediate",
  Avanzado: "guides.level.advanced",
} as const;

function toGuide(ag: ApiGuide): Guide {
  return {
    id: ag.id,
    slug: ag.slug,
    title: ag.title,
    description: ag.description,
    level: ag.level as GuideLevel,
    time: ag.time,
    image: ag.image,
    motor: ag.motor as Motor,
    tools: ag.tools.map((t) => ({
      name: t.name,
      quantity: t.quantity,
      image: t.image,
    })),
    steps: ag.steps.map((s) => ({
      title: s.title,
      content: s.content,
      images: s.images || [],
    })),
    tags: ag.tags,
    contributions: ag.contributions,
    category: ag.category as PartCategory,
  };
}

function GuidesPage() {
  const { t, language } = useLanguage();
  const { locale } = Route.useParams();
  const lang = resolveLocale(locale);
  const CATEGORY_LABELS: Record<string, string> = {
    engine: t("cat.engine"),
    transmission: t("cat.transmission"),
    suspension: t("cat.suspension"),
    electrical: t("cat.electrical"),
    brakes: t("cat.brakes"),
    tires: t("cat.tires"),
    body: t("cat.body"),
  };
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  useMetaTags({
    title: getMetaTranslation("meta.guides.title", lang),
    description: getMetaTranslation("meta.guides.description", lang),
    ogTitle: getMetaTranslation("meta.guides.ogTitle", lang),
    ogDescription: getMetaTranslation("meta.guides.ogDescription", lang),
    ogImage: ogImage,
  });

  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);

  const { data: guides = staticGuides, isLoading: loading } = useQuery({
    queryKey: ["guides"],
    queryFn: async () => {
      const list = await api.getGuides();
      return list.map(toGuide);
    },
    initialData: staticGuides,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  const updateSearch = (newParams: Partial<GuidesSearch>) => {
    navigate({
      search: (prev) => {
        const next = { ...prev, ...newParams };
        Object.keys(next).forEach((key) => {
          const k = key as keyof GuidesSearch;
          if (next[k] === undefined || next[k] === "") {
            delete next[k];
          }
        });
        return next;
      },
    });
  };

  const currentSearch = searchParams.search || "";
  const currentMotor = searchParams.motor;
  const currentLevel = searchParams.level;

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 300);
  useEffect(() => {
    updateSearch({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [searchParams.search]);

  const hasActiveFilters = Boolean(currentSearch || currentMotor || currentLevel);

  const clearFilters = () => {
    navigate({
      search: () => ({}),
    });
  };

  const filteredList = useMemo(() => {
    return guides.filter((guide) => {
      if (currentMotor) {
        if (currentMotor === "F8" && guide.motor === "R2") return false;
        if (currentMotor === "R2" && guide.motor === "F8") return false;
      }

      if (currentLevel && guide.level !== currentLevel) return false;

      if (currentSearch) {
        const query = normalizeString(currentSearch);
        const title = normalizeString(localize(guide.title, language));
        const desc = normalizeString(localize(guide.description, language));
        const tools = guide.tools.map((t) => normalizeString(localize(t.name, language)));
        const tags = guide.tags.map((t) => normalizeString(t));

        if (
          !title.includes(query) &&
          !desc.includes(query) &&
          !tools.some((t) => t.includes(query)) &&
          !tags.some((t) => t.includes(query))
        ) {
          return false;
        }
      }

      return true;
    });
  }, [currentSearch, currentMotor, currentLevel, language, guides]);

  return (
    <PageShell>
      <div className="space-y-6">
        <Crumbs items={[{ label: t("ui.archive") }, { label: t("nav.guides"), active: true }]} />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <BookOpen className="size-8 text-rocsta-green" /> {t("guides.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("guides.desc")}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("guides.searchGuidesPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
              />
            </div>

            <div>
              <select
                value={currentMotor || ""}
                onChange={(e) =>
                  updateSearch({ motor: (e.target.value || undefined) as Motor | undefined })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("guides.filter.allMotorsLabel")}</option>
                <option value="F8">{t("guides.filter.motorF8")}</option>
                <option value="R2">{t("guides.filter.motorR2")}</option>
                <option value="ambos">{t("guides.filter.motorBoth")}</option>
              </select>
            </div>

            <div>
              <select
                value={currentLevel || ""}
                onChange={(e) =>
                  updateSearch({
                    level: (e.target.value || undefined) as GuideLevel | undefined,
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("guides.filter.allLevelsLabel")}</option>
                <option value="Principiante">{t("guides.level.beginner")}</option>
                <option value="Intermedio">{t("guides.level.intermediate")}</option>
                <option value="Avanzado">{t("guides.level.advanced")}</option>
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
                {currentMotor && (
                  <Badge variant="secondary">
                    {t("ui.motor")}:{" "}
                    {currentMotor === "F8"
                      ? t("guides.filter.motorF8")
                      : currentMotor === "R2"
                        ? t("guides.filter.motorR2")
                        : t("guides.filter.motorBoth")}
                  </Badge>
                )}
                {currentLevel && (
                  <Badge variant="secondary">
                    {t("ui.difficulty")}: {t(LEVEL_KEYS[currentLevel])}
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

        <div className="text-xs text-muted-foreground flex items-center gap-2">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {t("guides.resultsFound", { count: filteredList.length })}
        </div>

        {filteredList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((guide) => (
              <article
                key={guide.id}
                onClick={() => setSelectedGuide(guide)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedGuide(guide);
                  }
                }}
                tabIndex={0}
                role="button"
                className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-rocsta-green/40 hover:shadow-md flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rocsta-green/30"
              >
                <div>
                  {guide.image ? (
                    <div className="aspect-video bg-muted overflow-hidden relative">
                      <img
                        src={guide.image}
                        alt={localize(guide.title, language)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted/65 flex items-center justify-center border-b border-border/40 text-muted-foreground">
                      <BookOpen className="size-10 stroke-[1.2]" />
                    </div>
                  )}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={[
                          "text-[9px] font-bold uppercase px-2 py-0.5",
                          guide.level === "Principiante" &&
                            "bg-green-500/10 text-green-700 dark:text-green-400",
                          guide.level === "Intermedio" &&
                            "bg-amber-500/10 text-amber-700 dark:text-amber-400",
                          guide.level === "Avanzado" &&
                            "bg-red-500/10 text-red-700 dark:text-red-400",
                        ].join(" ")}
                      >
                        {t(LEVEL_KEYS[guide.level])}
                      </Badge>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono flex items-center gap-0.5">
                        <Clock className="size-3" /> {guide.time}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-rocsta-green transition-colors">
                      {localize(guide.title, language)}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                      {localize(guide.description, language)}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-border/20 mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                  <span className="font-mono uppercase">{CATEGORY_LABELS[guide.category]}</span>
                  <span>
                    {guide.contributions} {t("guides.contributions")}
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3">
              <FilterX className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">{t("guides.noResults")}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
              {t("guides.noResultsDesc")}
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

      <Dialog
        open={selectedGuide !== null}
        onOpenChange={(open) => !open && setSelectedGuide(null)}
      >
        {selectedGuide && (
          <DialogContent className="max-w-2xl sm:rounded-2xl border-border bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-border">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase bg-muted/40 font-mono"
                >
                  {CATEGORY_LABELS[selectedGuide.category]}
                </Badge>
                <span className="text-muted-foreground/60">•</span>
                <Badge
                  variant="outline"
                  className={[
                    "text-[10px] font-bold uppercase py-0.5",
                    selectedGuide.level === "Principiante" &&
                      "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400",
                    selectedGuide.level === "Intermedio" &&
                      "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                    selectedGuide.level === "Avanzado" &&
                      "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400",
                  ].join(" ")}
                >
                  {t(LEVEL_KEYS[selectedGuide.level])}
                </Badge>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono flex items-center gap-0.5">
                  <Clock className="size-3" /> {t("guides.dialog.time")}: {selectedGuide.time}
                </span>
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground text-pretty">
                {localize(selectedGuide.title, language)}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-pretty mt-1 leading-relaxed">
                {localize(selectedGuide.description, language)}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-6 text-sm">
              {selectedGuide.image && (
                <div className="overflow-hidden rounded-xl border border-border bg-muted">
                  <img
                    src={selectedGuide.image}
                    alt={localize(selectedGuide.title, language)}
                    className="w-full aspect-video object-cover"
                  />
                </div>
              )}

              <div className="rounded-xl border border-rocsta-accent/15 bg-rocsta-accent/[0.01] p-4 space-y-2">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider">
                  <Wrench className="size-4 text-rocsta-accent" /> {t("guides.dialog.toolsLabel")}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1.5">
                  {selectedGuide.tools.map((tool, index) => (
                    <li
                      key={index}
                      className="text-xs text-muted-foreground flex items-start gap-2"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-rocsta-accent mt-1.5 shrink-0" />
                      <span>
                        {tool.quantity > 1 && (
                          <span className="font-bold text-foreground">{tool.quantity}x </span>
                        )}
                        {localize(tool.name, language)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="size-4 text-rocsta-green" /> {t("guides.dialog.stepsLabel")}
                </h4>
                <Accordion type="single" collapsible className="w-full space-y-2">
                  {selectedGuide.steps.map((step, index) => (
                    <AccordionItem
                      key={index}
                      value={`step-${index}`}
                      className="border border-border rounded-lg bg-muted/20 px-4 overflow-hidden"
                    >
                      <AccordionTrigger className="text-sm font-extrabold text-foreground py-3.5 hover:no-underline hover:text-rocsta-green transition-colors">
                        {localize(step.title, language)}
                      </AccordionTrigger>
                      <AccordionContent className="text-xs text-muted-foreground leading-relaxed pb-4 pt-1 whitespace-pre-line border-t border-border/40 text-pretty font-normal">
                        {localize(step.content, language)}
                        {step.images && step.images.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 gap-2">
                            {step.images.map((img, imgIndex) => (
                              <div key={imgIndex} className="overflow-hidden rounded-lg border border-border bg-muted">
                                <img
                                  src={img}
                                  alt={`${localize(step.title, language)} - ${imgIndex + 1}`}
                                  className="w-full h-32 object-cover"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="flex items-start gap-3 bg-muted/40 p-3 rounded-lg border border-border/60">
                <Info className="size-4 text-rocsta-accent mt-0.5 shrink-0" />
                <div>
                  <h5 className="font-bold text-xs text-foreground">{t("guides.safetyTip")}</h5>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed text-pretty">
                    {t("guides.safetyDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1 font-mono">
                <Sparkles className="size-3 text-rocsta-accent animate-pulse" />{" "}
                {t("guides.wikiLabel")}
              </span>
              <button
                onClick={() => setSelectedGuide(null)}
                className="inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors"
              >
                {t("ui.close")}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageShell>
  );
}
