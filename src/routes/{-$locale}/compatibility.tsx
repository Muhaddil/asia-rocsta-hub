import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell, Crumbs } from "@/components/page-shell";
import { compatibilities as staticCompatibilities } from "@/data/compatibility";
import type { Compatibility, Difficulty } from "@/data/types";
import { localize } from "@/data/types";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { api, ApiError, type ApiCompatibility } from "@/lib/api";
import { useDebounce, normalizeString } from "@/lib/utils";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import ogImage from "@/assets/rocsta-hero.jpg";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

const DIFFICULTY_KEYS: Record<Difficulty, string> = {
  Fácil: "comp.diff.easy",
  Media: "comp.diff.medium",
  Alta: "comp.diff.hard",
};
import {
  Search,
  FilterX,
  CheckCircle2,
  Wrench,
  GitCompare,
  Car,
  Gauge,
  Flame,
  Info,
  Users,
  ThumbsUp,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const compatibilitySearchSchema = z.object({
  search: z.string().optional(),
  type: z.enum(["directo", "adaptación"]).optional(),
  difficulty: z.enum(["Fácil", "Media", "Alta"]).optional(),
});

type CompatibilitySearch = z.infer<typeof compatibilitySearchSchema>;

function toCompat(item: ApiCompatibility): Compatibility {
  return {
    id: item.id,
    rocstaPart: item.rocstaPart,
    donorVehicle: item.donorVehicle,
    donorRef: item.donorRef,
    type: item.type as "directo" | "adaptación",
    difficulty: item.difficulty as Difficulty,
    motor: item.motor as "F8" | "R2" | "ambos",
    verified: item.verified,
    confirmations: item.confirmations,
    notes: item.notes,
    category: item.category as Compatibility["category"],
  };
}

export const Route = createFileRoute("/{-$locale}/compatibility")({
  validateSearch: (search) => compatibilitySearchSchema.parse(search),
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.compatibility.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.compatibility.description", locale),
        },
        { property: "og:title", content: getMetaTranslation("meta.compatibility.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.compatibility.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/compatibility` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/compatibility` },
        ...getAlternateHrefs("/compatibility", SITE_URL).map((a) => ({
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
                name: locale === "en" ? "Compatibility" : "Compatibilidades",
                item: "https://muhaddil.github.io/asia-rocsta-hub/compatibility",
              },
            ],
          }),
        },
      ],
    };
  },
  component: CompatibilityPage,
});

function CompatibilityPage() {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const { locale } = Route.useParams();
  const lang = resolveLocale(locale);
  const CATEGORY_LABELS = {
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
    title: getMetaTranslation("meta.compatibility.title", lang),
    description: getMetaTranslation("meta.compatibility.description", lang),
    ogTitle: getMetaTranslation("meta.compatibility.ogTitle", lang),
    ogDescription: getMetaTranslation("meta.compatibility.ogDescription", lang),
    ogImage: ogImage,
  });

  const { data: compatibilities = [], isLoading: loading } = useQuery({
    queryKey: ["compatibilities"],
    queryFn: async () => {
      const list = await api.getCompatibilities();
      return list.map(toCompat);
    },
    initialData: staticCompatibilities,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  const [confirmed, setConfirmed] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("rocsta_confirmed");
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [pendingConfirmId, setPendingConfirmId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const markConfirmed = (id: string) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem("rocsta_confirmed", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const [selectedComp, setSelectedComp] = useState<Compatibility | null>(null);

  const updateSearch = (newParams: Partial<CompatibilitySearch>) => {
    navigate({
      search: (prev) => {
        const next = { ...prev, ...newParams };
        Object.keys(next).forEach((key) => {
          const k = key as keyof CompatibilitySearch;
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
  const currentDifficulty = searchParams.difficulty;

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 300);
  useEffect(() => {
    updateSearch({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [searchParams.search]);

  const hasActiveFilters = Boolean(currentSearch || currentType || currentDifficulty);

  const clearFilters = () => {
    navigate({
      search: () => ({}),
    });
  };

  const filteredList = useMemo(() => {
    return compatibilities.filter((item) => {
      if (currentType && item.type !== currentType) return false;
      if (currentDifficulty && item.difficulty !== currentDifficulty) return false;

      if (currentSearch) {
        const query = normalizeString(currentSearch);
        const rocstaPart = normalizeString(localize(item.rocstaPart, language));
        const donorVehicle = normalizeString(localize(item.donorVehicle, language));
        const donorRef = normalizeString(item.donorRef);
        const notes = normalizeString(localize(item.notes || "", language));

        if (
          !rocstaPart.includes(query) &&
          !donorVehicle.includes(query) &&
          !donorRef.includes(query) &&
          !notes.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [currentSearch, currentType, currentDifficulty, language, compatibilities]);

  const requestConfirm = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirmed.has(id)) return;
    setPendingConfirmId(id);
  };

  const handleConfirm = async () => {
    const id = pendingConfirmId;
    if (!id) return;
    setConfirming(true);
    try {
      const result = await api.confirmCompatibility(id);
      queryClient.setQueryData<Compatibility[]>(["compatibilities"], (prev) =>
        prev?.map((c) => (c.id === id ? { ...c, confirmations: result.confirmations } : c)),
      );
      markConfirmed(id);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        markConfirmed(id);
        try {
          const status = await api.getConfirmationStatus(id);
          queryClient.setQueryData<Compatibility[]>(["compatibilities"], (prev) =>
            prev?.map((c) => (c.id === id ? { ...c, confirmations: status.confirmations } : c)),
          );
        } catch {
          // If fallback fails, do not crash.
        }
      } else {
        console.error("Confirm error:", err);
      }
    } finally {
      setConfirming(false);
      setPendingConfirmId(null);
    }
  };

  return (
    <PageShell>
      <div className="space-y-6">
        <Crumbs
          items={[{ label: t("ui.archive") }, { label: t("nav.compatibility"), active: true }]}
        />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <GitCompare className="size-8 text-rocsta-green" /> {t("comp.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("comp.desc")}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("comp.searchCompatPlaceholder")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
              />
            </div>
            <div>
              <select
                value={currentType || ""}
                onChange={(e) =>
                  updateSearch({
                    type: (e.target.value || undefined) as "directo" | "adaptación" | undefined,
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("comp.filter.allFitTypes")}</option>
                <option value="directo">{t("comp.fitDirectOption")}</option>
                <option value="adaptación">{t("comp.fitAdaptOption")}</option>
              </select>
            </div>
            <div>
              <select
                value={currentDifficulty || ""}
                onChange={(e) =>
                  updateSearch({
                    difficulty: (e.target.value || undefined) as Difficulty | undefined,
                  })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("comp.filter.allDifficultyLabel")}</option>
                <option value="Fácil">{t("comp.diffEasyOption")}</option>
                <option value="Media">{t("comp.diffMediumOption")}</option>
                <option value="Alta">{t("comp.diffHardOption")}</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground font-semibold">{t("ui.filters")}</span>
                {currentSearch && (
                  <Badge variant="secondary" className="font-mono">
                    {t("ui.contains")} "{currentSearch}"
                  </Badge>
                )}
                {currentType && (
                  <Badge variant="secondary">
                    {t("ui.type")}{" "}
                    {currentType === "directo"
                      ? t("comp.dialog.directFit")
                      : t("comp.dialog.requiresAdapt")}
                  </Badge>
                )}
                {currentDifficulty && (
                  <Badge variant="secondary">
                    {t("ui.difficulty")} {t(DIFFICULTY_KEYS[currentDifficulty])}
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
          {loading ? (
            <Loader2 className="size-4 animate-spin inline" />
          ) : (
            t("comp.resultsFound", { count: filteredList.length })
          )}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/55 border-b border-border">
                <TableRow>
                  <TableHead className="px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("comp.table.part")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("comp.table.donor")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("comp.table.ref")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("comp.table.fit")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("ui.difficulty")}
                  </TableHead>
                  <TableHead className="px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground text-right">
                    {t("comp.table.confirmations")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="py-16 text-center">
                      <Loader2 className="size-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : filteredList.length > 0 ? (
                  filteredList.map((item) => (
                    <TableRow
                      key={item.id}
                      onClick={() => setSelectedComp(item)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelectedComp(item);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      className="cursor-pointer hover:bg-muted/30 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rocsta-green/30"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="font-bold text-sm text-foreground">
                          {localize(item.rocstaPart, language)}
                        </div>
                        <div className="text-[10px] text-muted-foreground font-mono mt-0.5 uppercase">
                          {CATEGORY_LABELS[item.category]}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-xs text-foreground font-semibold flex items-center gap-1.5 mt-2 md:mt-0">
                        <Car className="size-3 text-muted-foreground shrink-0" />{" "}
                        {localize(item.donorVehicle, language)}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <span className="font-mono text-xs px-2 py-0.5 bg-muted rounded border border-border/40 text-foreground font-medium">
                          {item.donorRef}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={[
                            "text-[10px] font-bold py-0.5",
                            item.type === "directo"
                              ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400"
                              : "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                          ].join(" ")}
                        >
                          {item.type === "directo" ? t("comp.fit.direct") : t("comp.fit.mod")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                          <Gauge className="size-3 text-rocsta-accent" />{" "}
                          {t(DIFFICULTY_KEYS[item.difficulty])}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-rocsta-green">
                            <Users className="size-3" /> {item.confirmations}{" "}
                            {t("comp.table.confirmedCount")}
                          </span>
                          <button
                            onClick={(e) => requestConfirm(item.id, e)}
                            disabled={confirmed.has(item.id)}
                            className={[
                              "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-all",
                              confirmed.has(item.id)
                                ? "bg-green-500/10 text-green-600 cursor-default"
                                : "bg-muted hover:bg-rocsta-green/10 hover:text-rocsta-green text-muted-foreground",
                            ].join(" ")}
                          >
                            <ThumbsUp className="size-3" />
                            {confirmed.has(item.id) ? t("comp.confirmed") : t("comp.confirm")}
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="py-12 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3">
                        <FilterX className="size-6" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{t("ui.noResults")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                        {t("comp.noResultsDesc")}
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={selectedComp !== null} onOpenChange={(open) => !open && setSelectedComp(null)}>
        {selectedComp && (
          <DialogContent className="max-w-lg sm:rounded-2xl border-border bg-card">
            <DialogHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  ID: {selectedComp.id}
                </span>
                <span className="text-muted-foreground/60">•</span>
                <Badge variant="outline" className="text-[10px] font-bold uppercase bg-muted/40">
                  {CATEGORY_LABELS[selectedComp.category]}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
                {t("comp.table.part")}: {localize(selectedComp.rocstaPart, language)}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {t("comp.dialog.desc", { vehicle: localize(selectedComp.donorVehicle, language) })}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/40">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("comp.dialog.donorVehicle")}
                  </h4>
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <Car className="size-3 text-rocsta-accent" />{" "}
                    {localize(selectedComp.donorVehicle, language)}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("comp.dialog.donorRef")}
                  </h4>
                  <div className="font-mono text-xs font-bold text-foreground">
                    {selectedComp.donorRef}
                  </div>
                </div>
                <div className="border-t border-border/40 pt-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("comp.dialog.fitType")}
                  </h4>
                  <Badge
                    variant="outline"
                    className={[
                      "text-[9px] font-bold py-0.5 mt-0.5",
                      selectedComp.type === "directo"
                        ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400"
                        : "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                    ].join(" ")}
                  >
                    {selectedComp.type === "directo"
                      ? t("comp.dialog.directFit")
                      : t("comp.dialog.requiresAdapt")}
                  </Badge>
                </div>
                <div className="border-t border-border/40 pt-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("comp.dialog.difficultyLabel")}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold mt-1">
                    <Gauge className="size-3 text-rocsta-accent animate-pulse" />{" "}
                    {t(DIFFICULTY_KEYS[selectedComp.difficulty])}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-y border-border/50 py-3">
                {selectedComp.verified ? (
                  <div className="h-8 w-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="size-4" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                    <Wrench className="size-4" />
                  </div>
                )}
                <div>
                  <h5 className="font-bold text-xs text-foreground">
                    {selectedComp.verified ? t("comp.swapVerified") : t("comp.swapCaution")}
                  </h5>
                  <p className="text-[11px] text-muted-foreground">
                    {t("comp.confirmedBy", { count: selectedComp.confirmations })}
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={(e) => requestConfirm(selectedComp.id, e)}
                  disabled={confirmed.has(selectedComp.id)}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all",
                    confirmed.has(selectedComp.id)
                      ? "bg-green-500/10 text-green-600 cursor-default border border-green-500/20"
                      : "bg-rocsta-green text-primary-foreground hover:opacity-90 shadow-sm",
                  ].join(" ")}
                >
                  <ThumbsUp className="size-4" />
                  {confirmed.has(selectedComp.id)
                    ? `✓ ${t("comp.confirmed")}`
                    : `${t("comp.confirm")} (${selectedComp.confirmations})`}
                </button>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Info className="size-3 text-rocsta-accent" /> {t("comp.installInstr")}
                </h4>
                <div className="rounded-lg border border-rocsta-accent/15 bg-rocsta-accent/[0.02] p-3 text-xs leading-relaxed text-muted-foreground text-pretty">
                  {selectedComp.notes ? localize(selectedComp.notes, language) : t("comp.noNotes")}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1 font-mono">
                <Flame className="size-3 text-rocsta-accent animate-bounce" />{" "}
                {t("comp.swapsLabel")}
              </span>
              <button
                onClick={() => setSelectedComp(null)}
                className="inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors"
              >
                {t("ui.close")}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Dialog
        open={pendingConfirmId !== null}
        onOpenChange={(open) => !open && setPendingConfirmId(null)}
      >
        <DialogContent className="max-w-md sm:rounded-2xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <GitCompare className="size-5 text-rocsta-green" />
              {t("comp.confirmDialog.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {t("comp.confirmDialog.desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
            <button
              onClick={() => setPendingConfirmId(null)}
              disabled={confirming}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-bold text-foreground hover:bg-muted hover:text-muted-foreground transition-colors disabled:opacity-50"
            >
              {t("comp.confirmDialog.no")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {confirming && <Loader2 className="size-4 animate-spin mr-2" />}
              {t("comp.confirmDialog.yes")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
