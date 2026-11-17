import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AM102_TECH_DATA,
  type TechGroup,
  type TechRow,
  type TechTable,
} from "@/data/manual/am102-techdata";
import { localize, type LocalizedString } from "@/data/types";
import { useLanguage, type Language } from "@/components/language-provider";
import { cn, normalizeString } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronsDownUp,
  ChevronsUpDown,
  ExternalLink,
  Info,
  Search,
  Table2,
  X,
} from "lucide-react";

export type MotorFilter = "all" | "F8" | "R2";

const GROUP_ORDER: TechGroup[] = ["engine", "drivetrain", "chassis", "body"];

const GROUP_LABEL_KEY: Record<TechGroup, string> = {
  engine: "manual.tech.group.engine",
  drivetrain: "manual.tech.group.drivetrain",
  chassis: "manual.tech.group.chassis",
  body: "manual.tech.group.body",
};

const TOTAL_VALUES = AM102_TECH_DATA.reduce((sum, table) => sum + table.rows.length, 0);

function valueText(value: string | LocalizedString | undefined, language: Language): string {
  if (!value) return "";
  return typeof value === "string" ? value : localize(value, language);
}

function cellText(
  specific: string | LocalizedString | undefined,
  fallback: string | LocalizedString | undefined,
  language: Language,
): string {
  const text = valueText(specific, language);
  if (text) return text;
  return valueText(fallback, language) || "—";
}

/** Every language variant of a row, so search works in ES and EN. */
function rowSearchText(row: TechRow): string {
  const parts = [row.label.es, row.label.en];
  for (const value of [row.value, row.r2, row.f8]) {
    if (typeof value === "string") parts.push(value);
    else if (value) parts.push(value.es, value.en);
  }
  return parts.join(" \u0001 ");
}

/** Lowercase, accent- and punctuation-insensitive text used as a search fallback. */
function compactForSearch(text: string): string {
  return normalizeString(text).replace(/[^a-z0-9]/g, "");
}

function matchesSearch(text: string, normalizedQuery: string, compactQuery: string): boolean {
  if (normalizeString(text).includes(normalizedQuery)) return true;
  // Also match when the user skips spaces/punctuation, e.g. "kgm" or "ftlb".
  return compactQuery.length >= 3 && compactForSearch(text).includes(compactQuery);
}

/**
 * Fold accents/case while keeping a map back to the original string, so a
 * match can be highlighted without altering the printed text.
 */
function buildNormalizedMap(text: string): { normalized: string; map: number[] } {
  let normalized = "";
  const map: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const folded = text[i]
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    for (let j = 0; j < folded.length; j++) {
      normalized += folded[j];
      map.push(i);
    }
  }
  return { normalized, map };
}

function highlight(text: string, query: string, keyPrefix: string): ReactNode {
  const normalizedQuery = normalizeString(query.trim());
  if (!normalizedQuery) return text;

  const { normalized, map } = buildNormalizedMap(text);
  const nodes: ReactNode[] = [];
  let cursor = 0;
  let match = normalized.indexOf(normalizedQuery);
  let key = 0;

  while (match !== -1) {
    const start = map[match];
    const end = Math.max(start + 1, map[match + normalizedQuery.length - 1] + 1);
    if (start > cursor) nodes.push(text.slice(cursor, start));
    nodes.push(
      <mark
        key={`${keyPrefix}-${key++}`}
        className="rounded-[2px] bg-rocsta-accent/30 px-0.5 text-foreground"
      >
        {text.slice(start, end)}
      </mark>,
    );
    cursor = end;
    match = normalized.indexOf(normalizedQuery, match + normalizedQuery.length);
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes.length ? nodes : text;
}

export function ManualTechData({
  motor,
  onMotorChange,
  onViewPage,
}: {
  motor: MotorFilter;
  onMotorChange: (m: MotorFilter) => void;
  onViewPage: (page: number) => void;
}) {
  const { t, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLInputElement>(null);

  const trimmedQuery = query.trim();
  const normalizedQuery = normalizeString(trimmedQuery);
  const compactQuery = compactForSearch(trimmedQuery);
  const searching = normalizedQuery.length > 0;

  const filtered = useMemo(() => {
    if (!searching) {
      return AM102_TECH_DATA.map((table) => ({ table, rows: table.rows, titleMatch: false }));
    }
    return AM102_TECH_DATA.map((table) => {
      const titleMatch = matchesSearch(
        `${table.title.es} ${table.title.en}`,
        normalizedQuery,
        compactQuery,
      );
      const rows = titleMatch
        ? table.rows
        : table.rows.filter((row) =>
            matchesSearch(rowSearchText(row), normalizedQuery, compactQuery),
          );
      return { table, rows, titleMatch };
    }).filter((entry) => entry.rows.length > 0);
  }, [searching, normalizedQuery, compactQuery]);

  const grouped = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        entries: filtered.filter((entry) => entry.table.group === group),
      })).filter((group) => group.entries.length > 0),
    [filtered],
  );

  const visibleRows = useMemo(
    () => filtered.reduce((sum, entry) => sum + entry.rows.length, 0),
    [filtered],
  );

  const allOpen = filtered.length > 0 && filtered.every((entry) => expanded.has(entry.table.id));

  const setAll = (open: boolean) => {
    setExpanded(open ? new Set(filtered.map((entry) => entry.table.id)) : new Set());
  };

  const handleQuery = (value: string) => {
    setQuery(value);
    // Searching opens every table; clearing the box returns to the compact list.
    setExpanded(value.trim() ? new Set(AM102_TECH_DATA.map((table) => table.id)) : new Set());
  };

  const toggleTable = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);

      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (event.key === "Escape" && document.activeElement === searchRef.current) {
        setQuery("");
        setExpanded(new Set());
        searchRef.current?.blur();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
              <Table2 className="size-5 text-rocsta-green" /> {t("manual.tech.title")}
            </h2>
            <span className="rounded-full border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
              {t("manual.tech.stats", {
                tables: AM102_TECH_DATA.length,
                values: TOTAL_VALUES,
              })}
            </span>
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{t("manual.tech.desc")}</p>
        </div>

        <div
          role="group"
          aria-label={t("manual.filter.motor")}
          className="inline-flex rounded-lg border border-border bg-card p-1 text-xs font-bold"
        >
          {(["all", "F8", "R2"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={motor === m}
              onClick={() => onMotorChange(m)}
              className={cn(
                "rounded px-3 py-1.5 transition-colors",
                motor === m
                  ? "bg-rocsta-green text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "all" ? t("manual.tech.all") : m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-rocsta-accent/20 bg-rocsta-accent/5 p-3.5 text-[11px] leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-rocsta-accent" />
        <p>{t("manual.tech.disclaimer")}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => handleQuery(event.target.value)}
            aria-label={t("manual.tech.searchPlaceholder")}
            placeholder={t("manual.tech.searchPlaceholder")}
            className="bg-card pl-9 pr-14 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => handleQuery("")}
              aria-label={t("manual.tech.clearSearch")}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="size-3.5" />
            </button>
          ) : (
            <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground sm:block">
              /
            </kbd>
          )}
        </div>

        <button
          type="button"
          onClick={() => setAll(!allOpen)}
          className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-3 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          {allOpen ? (
            <ChevronsDownUp className="size-3.5" />
          ) : (
            <ChevronsUpDown className="size-3.5" />
          )}
          {allOpen ? t("manual.tech.collapseAll") : t("manual.tech.expandAll")}
        </button>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={cn("text-xs font-bold text-muted-foreground", !searching && "sr-only")}
      >
        {searching ? t("manual.tech.results", { count: visibleRows, total: TOTAL_VALUES }) : ""}
      </p>

      {filtered.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-10 text-center shadow-sm">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent">
            <Search className="size-6" />
          </div>
          <h3 className="text-base font-bold text-foreground">{t("manual.tech.noResults")}</h3>
          <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
            {t("manual.tech.noResultsDesc")}
          </p>
          <button
            type="button"
            onClick={() => handleQuery("")}
            className="mt-4 rounded-md bg-rocsta-green px-4 py-2 text-xs font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {t("manual.tech.clearSearch")}
          </button>
        </div>
      )}

      {grouped.map(({ group, entries }) => (
        <section key={group} className="space-y-2.5">
          <div className="flex items-center gap-2 pt-1">
            <h3 className="text-[11px] font-extrabold uppercase tracking-widest text-muted-foreground">
              {t(GROUP_LABEL_KEY[group])}
            </h3>
            <span className="rounded-full bg-muted px-1.5 py-0.5 font-mono text-[10px] font-bold text-muted-foreground">
              {entries.length}
            </span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <div className="space-y-2.5">
            {entries.map(({ table, rows, titleMatch }) => (
              <TechTableCard
                key={table.id}
                table={table}
                rows={rows}
                titleMatch={titleMatch}
                open={expanded.has(table.id)}
                motor={motor}
                language={language}
                query={trimmedQuery}
                searching={searching}
                onToggle={() => toggleTable(table.id)}
                onViewPage={onViewPage}
                t={t}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function TechTableCard({
  table,
  rows,
  titleMatch,
  open,
  motor,
  language,
  query,
  searching,
  onToggle,
  onViewPage,
  t,
}: {
  table: TechTable;
  rows: TechRow[];
  titleMatch: boolean;
  open: boolean;
  motor: MotorFilter;
  language: Language;
  query: string;
  searching: boolean;
  onToggle: () => void;
  onViewPage: (page: number) => void;
  t: (key: string, replacements?: Record<string, string | number>) => string;
}) {
  const panelId = `tech-panel-${table.id}`;
  // Section 22 opens at PDF page 409, which is printed as 22-2.
  const printedPage = `22-${table.sourcePage - 407}`;
  const countLabel =
    searching && !titleMatch
      ? t("manual.tech.matchesOf", { count: rows.length, total: table.rows.length })
      : t("manual.tech.rows", { count: rows.length });

  return (
    <div
      id={`tech-${table.id}`}
      className="scroll-mt-24 overflow-hidden rounded-xl border border-border bg-card shadow-sm"
    >
      <div className="flex items-stretch gap-1 pr-2">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/40"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              !open && "-rotate-90",
            )}
          />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-foreground">
              {highlight(localize(table.title, language), query, `${table.id}-title`)}
            </span>
            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-muted-foreground">
              <span className="rounded bg-muted px-1.5 py-0.5 font-bold">p. {printedPage}</span>
              <span>{countLabel}</span>
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => onViewPage(table.sourcePage)}
          title={t("manual.tech.viewPage")}
          className="my-auto inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[10px] font-bold text-muted-foreground transition-colors hover:text-rocsta-green"
        >
          <ExternalLink className="size-3" />
          <span className="hidden md:inline">{t("manual.tech.viewPage")}</span>
        </button>
      </div>

      {open && (
        <div id={panelId} className="border-t border-border/60">
          {table.note && (
            <div className="flex items-start gap-2 border-b border-border/60 bg-muted/20 px-4 py-2.5 text-[11px] leading-relaxed text-muted-foreground">
              <Info className="mt-0.5 size-3.5 shrink-0 text-rocsta-accent" />
              <p>{highlight(localize(table.note, language), query, `${table.id}-note`)}</p>
            </div>
          )}
          <div className="overflow-x-auto">
            <table
              className={cn(
                "w-full border-collapse text-left",
                table.split ? "min-w-[34rem]" : "min-w-[20rem]",
              )}
            >
              <thead>
                <tr className="border-b border-border/60 bg-muted/20 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="px-4 py-2">{t("manual.tech.item")}</th>
                  {table.split && motor !== "F8" && (
                    <th className="border-l border-border/40 px-4 py-2">
                      {t("manual.tech.col.r2")}
                    </th>
                  )}
                  {table.split && motor !== "R2" && (
                    <th className="border-l border-border/40 px-4 py-2">
                      {t("manual.tech.col.f8")}
                    </th>
                  )}
                  {!table.split && (
                    <th className="border-l border-border/40 px-4 py-2">
                      {t("manual.tech.value")}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className="align-top transition-colors hover:bg-muted/40 even:bg-muted/10"
                  >
                    <td className="px-4 py-2 text-xs font-semibold text-foreground">
                      {highlight(
                        localize(row.label, language),
                        query,
                        `${table.id}-${index}-label`,
                      )}
                    </td>
                    {table.split && motor !== "F8" && (
                      <td className="border-l border-border/40 px-4 py-2 font-mono text-[11px] text-muted-foreground sm:text-xs">
                        {highlight(
                          cellText(row.r2, row.value, language),
                          query,
                          `${table.id}-${index}-r2`,
                        )}
                      </td>
                    )}
                    {table.split && motor !== "R2" && (
                      <td className="border-l border-border/40 px-4 py-2 font-mono text-[11px] text-muted-foreground sm:text-xs">
                        {highlight(
                          cellText(row.f8, row.value, language),
                          query,
                          `${table.id}-${index}-f8`,
                        )}
                      </td>
                    )}
                    {!table.split && (
                      <td className="border-l border-border/40 px-4 py-2 font-mono text-[11px] text-muted-foreground sm:text-xs">
                        {highlight(
                          cellText(row.value, undefined, language),
                          query,
                          `${table.id}-${index}-value`,
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
