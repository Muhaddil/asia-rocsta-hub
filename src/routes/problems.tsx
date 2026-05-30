import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { PageShell, Crumbs } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { normalizeString } from "@/lib/utils";
import { problems as staticProblems } from "@/data/problems";
import type { Problem, Motor, Severity, Difficulty } from "@/data/types";
import { localize } from "@/data/types";
import { api, ApiError, type ApiProblem } from "@/lib/api";
import ogImage from "@/assets/rocsta-hero.jpg";

const DIFFICULTY_KEYS: Record<Difficulty, string> = {
  Fácil: "comp.diff.easy",
  Media: "comp.diff.medium",
  Alta: "comp.diff.hard",
};
import {
  Search,
  FilterX,
  AlertTriangle,
  AlertOctagon,
  Info,
  DollarSign,
  Gauge,
  Sparkles,
  Users,
  Compass,
  FileText,
  Activity,
  ThumbsUp,
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

const problemsSearchSchema = z.object({
  search: z.string().optional(),
  severity: z.enum(["critical", "warn", "info"]).optional(),
  motor: z.enum(["F8", "R2", "ambos"]).optional(),
});

type ProblemsSearch = z.infer<typeof problemsSearchSchema>;

export const Route = createFileRoute("/problems")({
  validateSearch: (search) => problemsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Problemas Comunes y Averías — Asia Rocsta Archive" },
      {
        name: "description",
        content:
          "Registro e historial de fallos mecánicos típicos del Asia Rocsta. Diagnóstico de averías, síntomas, causas, soluciones y costes estimados.",
      },
      { property: "og:title", content: "Problemas Comunes — Asia Rocsta Archive" },
      {
        property: "og:description",
        content:
          "Registro de fallos mecánicos típicos del Asia Rocsta: diagnóstico, síntomas, causas, soluciones y costes.",
      },
      { property: "og:url", content: "/problems" },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "/problems" }],
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
              name: "Inicio",
              item: "https://muhaddil.github.io/asia-rocsta-hub/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Problemas Comunes",
              item: "https://muhaddil.github.io/asia-rocsta-hub/problems",
            },
          ],
        }),
      },
    ],
  }),
  component: ProblemsPage,
});

function toProblem(item: ApiProblem): Problem {
  return {
    id: item.id,
    title: item.title,
    severity: item.severity as Severity,
    motor: item.motor as Motor,
    km: item.km,
    symptom: item.symptom,
    cause: item.cause,
    solution: item.solution,
    cost: item.cost,
    difficulty: item.difficulty as Difficulty,
    category: item.category as Problem["category"],
    reports: item.reports,
  };
}

function ProblemsPage() {
  const queryClient = useQueryClient();
  const { t, language } = useLanguage();
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const CATEGORY_LABELS = {
    engine: t("cat.engine"),
    transmission: t("cat.transmission"),
    suspension: t("cat.suspension"),
    electrical: t("cat.electrical"),
    brakes: t("cat.brakes"),
    tires: t("cat.tires"),
    body: t("cat.body"),
  };

  const { data: problems = [], isLoading: loading } = useQuery({
    queryKey: ["problems"],
    queryFn: async () => {
      const list = await api.getProblems();
      return list.map(toProblem);
    },
    initialData: staticProblems,
    refetchInterval: 30000,
    refetchIntervalInBackground: false,
  });

  const [confirmed, setConfirmed] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("rocsta_problems_confirmed");
      return stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });
  const [pendingConfirmId, setPendingConfirmId] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);

  const markConfirmed = (id: string) => {
    setConfirmed((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem("rocsta_problems_confirmed", JSON.stringify([...next]));
      } catch {}
      return next;
    });
  };

  const updateSearch = (newParams: Partial<ProblemsSearch>) => {
    navigate({
      search: (prev) => {
        const next = { ...prev, ...newParams };
        Object.keys(next).forEach((key) => {
          const k = key as keyof ProblemsSearch;
          if (next[k] === undefined || next[k] === "") {
            delete next[k];
          }
        });
        return next;
      },
    });
  };

  const currentSearch = searchParams.search || "";
  const currentSeverity = searchParams.severity;
  const currentMotor = searchParams.motor;

  const hasActiveFilters = Boolean(currentSearch || currentSeverity || currentMotor);

  const clearFilters = () => {
    navigate({
      search: () => ({}),
    });
  };

  const filteredList = useMemo(() => {
    return problems.filter((prob) => {
      if (currentSeverity && prob.severity !== currentSeverity) return false;

      if (currentMotor) {
        if (currentMotor === "F8" && prob.motor === "R2") return false;
        if (currentMotor === "R2" && prob.motor === "F8") return false;
      }

      if (currentSearch) {
        const query = normalizeString(currentSearch);
        const title = normalizeString(localize(prob.title, language));
        const symptom = normalizeString(localize(prob.symptom, language));
        const cause = normalizeString(localize(prob.cause, language));
        const solution = normalizeString(localize(prob.solution, language));

        if (
          !title.includes(query) &&
          !symptom.includes(query) &&
          !cause.includes(query) &&
          !solution.includes(query)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [currentSearch, currentSeverity, currentMotor, language, problems]);

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
      const result = await api.confirmProblem(id);
      queryClient.setQueryData<Problem[]>(["problems"], (prev) =>
        prev?.map((p) => (p.id === id ? { ...p, reports: result.reports } : p)),
      );
      markConfirmed(id);
    } catch (err: unknown) {
      if (err instanceof ApiError && err.status === 409) {
        markConfirmed(id);
        try {
          const status = await api.getProblemConfirmationStatus(id);
          queryClient.setQueryData<Problem[]>(["problems"], (prev) =>
            prev?.map((p) => (p.id === id ? { ...p, reports: status.reports } : p)),
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
        <Crumbs items={[{ label: t("ui.archive") }, { label: t("nav.problems"), active: true }]} />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <AlertOctagon className="size-8 text-red-500 animate-pulse" /> {t("problems.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("problems.desc")}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("problems.searchProblemsPlaceholder")}
                value={currentSearch}
                onChange={(e) => updateSearch({ search: e.target.value })}
                className="pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
              />
            </div>

            <div>
              <select
                value={currentSeverity || ""}
                onChange={(e) =>
                  updateSearch({ severity: (e.target.value || undefined) as Severity | undefined })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("problems.filter.allSeverityLabel")}</option>
                <option value="critical">{t("problems.severityCriticalOption")}</option>
                <option value="warn">{t("problems.severityWarnOption")}</option>
                <option value="info">{t("problems.severityInfoOption")}</option>
              </select>
            </div>

            <div>
              <select
                value={currentMotor || ""}
                onChange={(e) =>
                  updateSearch({ motor: (e.target.value || undefined) as Motor | undefined })
                }
                className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
              >
                <option value="">{t("problems.filter.allMotorsLabel")}</option>
                <option value="F8">{t("problems.filter.motorF8")}</option>
                <option value="R2">{t("problems.filter.motorR2")}</option>
                <option value="ambos">{t("problems.filter.motorBoth")}</option>
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
                {currentSeverity && (
                  <Badge variant="secondary">
                    {t("ui.severity")}:{" "}
                    {currentSeverity === "critical"
                      ? t("problems.severity.critical")
                      : currentSeverity === "warn"
                        ? t("problems.severity.warn")
                        : t("problems.severity.info")}
                  </Badge>
                )}
                {currentMotor && (
                  <Badge variant="secondary">
                    {t("ui.motor")}:{" "}
                    {currentMotor === "F8"
                      ? "Gasolina"
                      : currentMotor === "R2"
                        ? "Diésel"
                        : "Común"}
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
            t("problems.resultsFound", { count: filteredList.length })
          )}
        </div>

        {filteredList.length > 0 ? (
          <div className="space-y-4">
            {filteredList.map((prob) => (
              <div
                key={prob.id}
                onClick={() => setSelectedProblem(prob)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSelectedProblem(prob);
                  }
                }}
                tabIndex={0}
                role="button"
                className="group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-rocsta-green/30 hover:shadow-sm flex flex-col md:flex-row items-start gap-4 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rocsta-green/30"
              >
                <div
                  className={[
                    "h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-bold",
                    prob.severity === "critical" && "bg-red-500/10 text-red-600 dark:text-red-400",
                    prob.severity === "warn" &&
                      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
                    prob.severity === "info" && "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {prob.severity === "critical" && <AlertTriangle className="size-5" />}
                  {prob.severity === "warn" && <AlertOctagon className="size-5" />}
                  {prob.severity === "info" && <Info className="size-5" />}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold uppercase font-mono bg-muted/40"
                    >
                      {CATEGORY_LABELS[prob.category]}
                    </Badge>
                    <span className="text-muted-foreground/60 text-xs">•</span>
                    <span className="text-xs text-muted-foreground font-semibold">
                      {t("problems.typicalMileage")}: {prob.km}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base text-foreground leading-snug group-hover:text-rocsta-green transition-colors">
                    {localize(prob.title, language)}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    <strong className="text-foreground">{t("problems.symptomLabel")}:</strong>{" "}
                    {localize(prob.symptom, language)}
                  </p>
                </div>

                <div className="w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t border-border/20 md:border-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 font-mono">
                    <DollarSign className="size-3" /> {prob.cost}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase">
                    <Users className="size-3" /> {prob.reports} {t("problems.reportsCount")}
                  </span>
                  <button
                    onClick={(e) => requestConfirm(prob.id, e)}
                    disabled={confirmed.has(prob.id)}
                    className={[
                      "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-all",
                      confirmed.has(prob.id)
                        ? "bg-green-500/10 text-green-600 cursor-default"
                        : "bg-muted hover:bg-rocsta-green/10 hover:text-rocsta-green text-muted-foreground",
                    ].join(" ")}
                  >
                    <ThumbsUp className="size-3" />
                    {confirmed.has(prob.id) ? t("problems.confirmed") : t("problems.confirm")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3">
              <FilterX className="size-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">{t("problems.noResults")}</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
              {t("problems.noResultsDesc")}
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
        open={selectedProblem !== null}
        onOpenChange={(open) => !open && setSelectedProblem(null)}
      >
        {selectedProblem && (
          <DialogContent className="max-w-xl sm:rounded-2xl border-border bg-card max-h-[90vh] overflow-y-auto">
            <DialogHeader className="pb-4 border-b border-border">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={[
                    "text-[10px] font-bold uppercase py-0.5",
                    selectedProblem.severity === "critical" &&
                      "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400",
                    selectedProblem.severity === "warn" &&
                      "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                    selectedProblem.severity === "info" &&
                      "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400",
                  ].join(" ")}
                >
                  {t("ui.severity")}:{" "}
                  {selectedProblem.severity === "critical"
                    ? t("problems.severity.critical")
                    : selectedProblem.severity === "warn"
                      ? t("problems.severity.warn")
                      : t("problems.severity.info")}
                </Badge>
                <span className="text-muted-foreground/60">•</span>
                <Badge
                  variant="outline"
                  className="text-[10px] font-bold uppercase bg-muted/40 font-mono"
                >
                  {CATEGORY_LABELS[selectedProblem.category]}
                </Badge>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase font-mono flex items-center gap-0.5">
                  <Activity className="size-3" /> {selectedProblem.reports}{" "}
                  {t("problems.card.reports")}
                </span>
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground text-pretty">
                {localize(selectedProblem.title, language)}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {t("problems.dialog.desc")}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-5 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/40">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("problems.dialog.cost")}
                  </h4>
                  <div className="font-mono text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-0.5">
                    <DollarSign className="size-4" /> {selectedProblem.cost}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("problems.dialog.difficulty")}
                  </h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold mt-1">
                    <Gauge className="size-3 text-rocsta-accent" />{" "}
                    {t(DIFFICULTY_KEYS[selectedProblem.difficulty])}
                  </div>
                </div>
                <div className="col-span-2 border-t border-border/40 pt-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("problems.dialog.mileage")}
                  </h4>
                  <span className="text-xs text-foreground font-bold font-mono">
                    {selectedProblem.km}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={(e) => requestConfirm(selectedProblem.id, e)}
                  disabled={confirmed.has(selectedProblem.id)}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all",
                    confirmed.has(selectedProblem.id)
                      ? "bg-green-500/10 text-green-600 cursor-default border border-green-500/20"
                      : "bg-rocsta-green text-primary-foreground hover:opacity-90 shadow-sm",
                  ].join(" ")}
                >
                  <ThumbsUp className="size-4" />
                  {confirmed.has(selectedProblem.id)
                    ? `✓ ${t("problems.confirmed")}`
                    : `${t("problems.confirm")} (${selectedProblem.reports})`}
                </button>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Activity className="size-3 text-rocsta-accent" />{" "}
                  {t("problems.dialog.symptomsTitle")}
                </h4>
                <div className="text-xs leading-relaxed text-foreground bg-muted/20 p-3 rounded-lg border border-border/40 text-pretty">
                  {localize(selectedProblem.symptom, language)}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Compass className="size-3 text-rocsta-accent" />{" "}
                  {t("problems.dialog.causesTitle")}
                </h4>
                <div className="text-xs leading-relaxed text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/40 text-pretty">
                  {localize(selectedProblem.cause, language)}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <FileText className="size-3 text-rocsta-green" />{" "}
                  {t("problems.dialog.solutionTitle")}
                </h4>
                <div className="text-xs leading-relaxed text-muted-foreground bg-rocsta-green/[0.01] p-3 rounded-lg border border-rocsta-green/15 whitespace-pre-line text-pretty">
                  {localize(selectedProblem.solution, language)}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1 font-mono">
                <Sparkles className="size-3 text-rocsta-accent animate-pulse" />{" "}
                {t("problems.registryLabel")}
              </span>
              <button
                onClick={() => setSelectedProblem(null)}
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
              <AlertOctagon className="size-5 text-red-500" />
              {t("problems.confirmDialog.title")}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {t("problems.confirmDialog.desc")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border mt-4">
            <button
              onClick={() => setPendingConfirmId(null)}
              disabled={confirming}
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-bold text-foreground hover:bg-muted hover:text-muted-foreground transition-colors disabled:opacity-50"
            >
              {t("problems.confirmDialog.no")}
            </button>
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
            >
              {confirming && <Loader2 className="size-4 animate-spin mr-2" />}
              {t("problems.confirmDialog.yes")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
