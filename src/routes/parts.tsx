import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { PageShell, Crumbs } from "@/components/page-shell";
import { useLanguage, type Language } from "@/components/language-provider";
import { useDebounce } from "@/lib/utils";
import { parts as staticParts } from "@/data/parts";
import { api, type ApiPart } from "@/lib/api";
import type { Part, PartCategory, Motor, VerificationStatus } from "@/data/types";
import { localize } from "@/data/types";
import {
  Search,
  FilterX,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Wrench,
  BookOpen,
  Info,
  Layers,
  Sparkles,
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

const partsSearchSchema = z.object({
  category: z
    .enum(["engine", "transmission", "suspension", "electrical", "brakes", "tires", "body"])
    .optional(),
  search: z.string().optional(),
  motor: z.enum(["F8", "R2", "ambos"]).optional(),
  status: z.enum(["verified", "mod", "unverified"]).optional(),
});

type PartsSearch = z.infer<typeof partsSearchSchema>;

export const Route = createFileRoute("/parts")({
  validateSearch: (search) => partsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Catálogo de Piezas y Repuestos — Asia Rocsta Archive" },
      {
        name: "description",
        content:
          "Encuentra referencias OEM, equivalencias de la gama Mazda (B2200, 626), medidas y compatibilidad de piezas para reparar tu Asia Rocsta.",
      },
      { property: "og:title", content: "Catálogo de Piezas — Asia Rocsta Archive" },
      { property: "og:url", content: "/parts" },
    ],
    links: [{ rel: "canonical", href: "/parts" }],
  }),
  component: PartsPage,
});

function PartsPage() {
  const { t, language } = useLanguage();
  const CATEGORY_LABELS: Record<PartCategory, string> = {
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

  const [parts, setParts] = useState<Part[]>(staticParts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadParts = async () => {
      setLoading(true);
      try {
        const apiParts = await api.getParts();
        const convertedParts: Part[] = apiParts.map((ap) => ({
          id: ap.id,
          name: ap.name,
          category: ap.category as PartCategory,
          description: ap.description,
          oem: ap.oem,
          equiv: ap.equiv,
          status: ap.status as VerificationStatus,
          motor: ap.motor as Motor,
          notes: ap.notes,
          refs: ap.refs || [],
        }));
        setParts(convertedParts);
      } catch (err) {
        console.warn("Failed to load parts from API, using static data:", err);
        setParts(staticParts);
      } finally {
        setLoading(false);
      }
    };
    loadParts();
    const interval = setInterval(loadParts, 30000);
    return () => clearInterval(interval);
  }, []);

  const [selectedPart, setSelectedPart] = useState<Part | null>(null);

  const updateSearch = (newParams: Partial<PartsSearch>) => {
    navigate({
      search: (prev) => {
        const next = { ...prev, ...newParams };
        Object.keys(next).forEach((key) => {
          const k = key as keyof PartsSearch;
          if (next[k] === undefined || next[k] === "") {
            delete next[k];
          }
        });
        return next;
      },
    });
  };

  const currentCategory = searchParams.category;
  const currentSearch = searchParams.search || "";
  const currentMotor = searchParams.motor;
  const currentStatus = searchParams.status;

  const [searchInput, setSearchInput] = useState(currentSearch);
  const debouncedSearch = useDebounce(searchInput, 300);
  useEffect(() => {
    updateSearch({ search: debouncedSearch || undefined });
  }, [debouncedSearch]);
  useEffect(() => {
    setSearchInput(currentSearch);
  }, [searchParams.search]);

  const hasActiveFilters = Boolean(
    currentCategory || currentSearch || currentMotor || currentStatus,
  );

  const clearFilters = () => {
    navigate({
      search: () => ({}),
    });
  };

  const filteredParts = useMemo(() => {
    return parts.filter((part) => {
      // 1. Category Filter
      if (currentCategory && part.category !== currentCategory) return false;

      // 2. Motor Filter
      if (currentMotor) {
        if (currentMotor === "F8" && part.motor === "R2") return false;
        if (currentMotor === "R2" && part.motor === "F8") return false;
      }

      // 3. Status Filter
      if (currentStatus && part.status !== currentStatus) return false;

      // 4. Text Search Filter (name, oem, description, equivalents, refs)
      if (currentSearch) {
        const query = currentSearch
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const name = localize(part.name, language)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const oem = localize(part.oem, language).toLowerCase();
        const desc = localize(part.description, language)
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");
        const equivs = part.equiv.map((e) =>
          e
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, ""),
        );
        const refs = (part.refs || []).map((r) => r.toLowerCase());

        const matchesName = name.includes(query);
        const matchesOem = oem.includes(query);
        const matchesDesc = desc.includes(query);
        const matchesEquiv = equivs.some((e) => e.includes(query));
        const matchesRefs = refs.some((r) => r.includes(query));

        if (!matchesName && !matchesOem && !matchesDesc && !matchesEquiv && !matchesRefs) {
          return false;
        }
      }

      return true;
    });
  }, [currentCategory, currentSearch, currentMotor, currentStatus, language, parts]);

  return (
    <PageShell>
      <div className="space-y-6">
        <Crumbs items={[{ label: t("ui.archive") }, { label: t("nav.parts"), active: true }]} />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            {currentCategory ? CATEGORY_LABELS[currentCategory] : t("parts.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("parts.desc")}</p>
        </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t("parts.searchPartsPlaceholder")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
                />
              </div>

              <div>
                <select
                  value={currentCategory || ""}
                  onChange={(e) =>
                    updateSearch({ category: (e.target.value || undefined) as PartCategory | undefined })
                  }
                  className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
                >
                  <option value="">{t("parts.filter.allCategories")}</option>
                  <option value="engine">{t("cat.engine")}</option>
                  <option value="transmission">{t("cat.transmission")}</option>
                  <option value="suspension">{t("cat.suspension")}</option>
                  <option value="electrical">{t("cat.electrical")}</option>
                  <option value="brakes">{t("cat.brakes")}</option>
                  <option value="tires">{t("cat.tires")}</option>
                  <option value="body">{t("cat.body")}</option>
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
                  <option value="">{t("parts.filter.allEnginesLabel")}</option>
                  <option value="F8">{t("parts.filter.engineF8")}</option>
                  <option value="R2">{t("parts.filter.engineR2")}</option>
                  <option value="ambos">{t("parts.filter.engineBothOption")}</option>
                </select>
              </div>

              <div>
                <select
                  value={currentStatus || ""}
                  onChange={(e) =>
                    updateSearch({
                      status: (e.target.value || undefined) as VerificationStatus | undefined,
                    })
                  }
                  className="w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
                >
                  <option value="">{t("parts.filter.allStatusLabel")}</option>
                  <option value="verified">{t("parts.filter.verified100")}</option>
                  <option value="mod">{t("parts.filter.requiresMod")}</option>
                  <option value="unverified">{t("parts.filter.unverified")}</option>
                </select>
              </div>
            </div>

          {hasActiveFilters && (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-muted-foreground font-semibold">{t("ui.filters")}</span>
                {currentCategory && (
                  <Badge
                    variant="secondary"
                    className="bg-rocsta-green/10 text-rocsta-green hover:bg-rocsta-green/15 font-semibold"
                  >
                    {t("ui.category")}: {CATEGORY_LABELS[currentCategory]}
                  </Badge>
                )}
                {currentSearch && (
                  <Badge variant="secondary" className="font-mono">
                    {t("ui.search")}: "{currentSearch}"
                  </Badge>
                )}
                {currentMotor && (
                  <Badge variant="secondary">
                    {t("ui.motor")}:{" "}
                    {currentMotor === "F8"
                      ? t("parts.filter.engineF8")
                      : currentMotor === "R2"
                        ? t("parts.filter.engineR2")
                        : t("parts.filter.engineBothOption")}
                  </Badge>
                )}
                {currentStatus && (
                  <Badge variant="secondary">
                    {t("ui.status")}:{" "}
                    {currentStatus === "verified"
                      ? t("parts.badge.verified")
                      : currentStatus === "mod"
                        ? t("parts.badge.mod")
                        : t("parts.badge.unverified")}
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

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-2">
            {loading && <Loader2 className="size-3.5 animate-spin" />}
            {t("ui.showing")} <strong className="text-foreground">{filteredParts.length}</strong>{" "}
            {t("ui.of")} <strong className="text-foreground">{parts.length}</strong>{" "}
            {t("ui.partsDocumented")}.
          </span>
          {currentCategory && (
            <Link to="/parts" className="font-bold text-rocsta-green hover:underline">
              {t("parts.viewAllCats")}
            </Link>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/55 border-b border-border">
                <TableRow>
                  <TableHead className="px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("parts.table.name")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("parts.table.oem")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("parts.table.crossover")}
                  </TableHead>
                  <TableHead className="px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {t("parts.table.engine")}
                  </TableHead>
                  <TableHead className="px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground text-right">
                    {t("parts.table.status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredParts.length > 0 ? (
                  filteredParts.map((part) => (
                    <TableRow
                      key={part.id}
                      onClick={() => setSelectedPart(part)}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="font-bold text-sm text-foreground">{localize(part.name, language)}</div>
                        <div className="text-xs text-muted-foreground font-normal max-w-sm truncate mt-0.5">
                          {localize(part.description, language)}
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <span className="font-mono text-xs px-2 py-1 bg-muted rounded border border-border/40 text-foreground font-semibold">
                          {localize(part.oem, language)}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-4 text-xs text-muted-foreground font-medium max-w-xs truncate">
                        {part.equiv.length > 0 ? part.equiv.join(", ") : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-4">
                        <Badge
                          variant="outline"
                          className={[
                            "text-[10px] font-bold uppercase py-0.5",
                            part.motor === "F8" &&
                            "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400",
                            part.motor === "R2" &&
                            "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                            part.motor === "ambos" &&
                            "border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400",
                          ]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {part.motor === "ambos" ? t("parts.badge.common") : part.motor}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <StatusBadge status={part.status} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3">
                        <FilterX className="size-6" />
                      </div>
                      <h3 className="text-base font-bold text-foreground">{t("ui.noResults")}</h3>
                      <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                        {t("parts.noResultsDesc")}
                      </p>
                      <button
                        onClick={clearFilters}
                        className="mt-4 inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all"
                      >
                        {t("ui.resetFilters")}
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <Dialog open={selectedPart !== null} onOpenChange={(open) => !open && setSelectedPart(null)}>
        {selectedPart && (
          <DialogContent className="max-w-xl sm:rounded-2xl border-border bg-card">
            <DialogHeader className="pb-4 border-b border-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono">
                  ID: {selectedPart.id}
                </span>
                <span className="text-muted-foreground/60">•</span>
                <Badge variant="outline" className="text-[10px] font-bold uppercase bg-muted/40">
                  {CATEGORY_LABELS[selectedPart.category]}
                </Badge>
              </div>
              <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground">
                {localize(selectedPart.name, language)}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground text-pretty mt-1 leading-relaxed">
                {localize(selectedPart.description, language)}
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-muted/35 p-3 rounded-lg border border-border/40">
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("parts.dialog.oem")}
                  </h4>
                  <div className="font-mono text-xs font-bold text-foreground">
                    {localize(selectedPart.oem, language)}
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("parts.engineCompat")}
                  </h4>
                  <Badge
                    variant="outline"
                    className={[
                      "text-[9px] font-bold uppercase py-0.5",
                      selectedPart.motor === "F8" &&
                      "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400",
                      selectedPart.motor === "R2" &&
                      "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
                      selectedPart.motor === "ambos" &&
                      "border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {selectedPart.motor === "F8"
                      ? "Mazda F8 1.8 Gasolina"
                      : selectedPart.motor === "R2"
                        ? "Mazda R2 2.2 Diésel"
                        : t("parts.badge.engineBoth")}
                  </Badge>
                </div>
                <div className="col-span-2 border-t border-border/40 pt-2">
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {t("parts.verificationStatus")}
                  </h4>
                  <div className="inline-flex items-center gap-2 mt-0.5">
                    <StatusBadge status={selectedPart.status} />
                    <span className="text-xs text-muted-foreground">
                      {selectedPart.status === "verified" && t("parts.statusVerifiedDesc")}
                      {selectedPart.status === "mod" && t("parts.statusModDesc")}
                      {selectedPart.status === "unverified" && t("parts.statusUnverifiedDesc")}
                    </span>
                  </div>
                </div>
              </div>

              {selectedPart.refs && selectedPart.refs.length > 0 && (
                <div>
                  <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    {t("parts.crossRefs")}
                  </h4>
                  <div className="flex flex-wrap gap-1.5 font-mono text-xs">
                    {selectedPart.refs.map((r, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-muted rounded border border-border/40 text-foreground font-semibold"
                      >
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {t("parts.equivVehicles")}
                </h4>
                {selectedPart.equiv.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPart.equiv.map((e, i) => (
                      <Badge
                        key={i}
                        variant="secondary"
                        className="text-xs py-0.5 px-2 bg-muted border border-border/20 text-muted-foreground font-semibold"
                      >
                        {e}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">{t("parts.noDonors")}</p>
                )}
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Info className="size-3 text-rocsta-accent" /> {t("parts.installNotes")}
                </h4>
                <div className="rounded-lg border border-rocsta-accent/15 bg-rocsta-accent/[0.02] p-3 text-xs leading-relaxed text-muted-foreground">
                  {selectedPart.notes ? localize(selectedPart.notes, language) : t("parts.noNotes")}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3 text-rocsta-accent" /> {t("parts.classicParts")}
              </span>
              <button
                onClick={() => setSelectedPart(null)}
                className="inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors"
              >
                {t("parts.dialog.close")}
              </button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </PageShell>
  );
}

function StatusBadge({ status }: { status: VerificationStatus }) {
  const { t } = useLanguage();
  if (status === "verified") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-400 border border-green-600/10">
        <CheckCircle2 className="size-3" /> {t("parts.badge.verified")}
      </span>
    );
  }
  if (status === "mod") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20">
        <Wrench className="size-3" /> {t("parts.badge.mod")}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground border border-border/80">
      <HelpCircle className="size-3" /> {t("parts.badge.unverified")}
    </span>
  );
}
