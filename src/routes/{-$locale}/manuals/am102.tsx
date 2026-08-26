import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { PageShell, Crumbs } from "@/components/page-shell";
import { AM102_SECTIONS, sectionForPage } from "@/data/manual/am102-sections";
import { PARTS_SECTIONS, partsSectionForPage } from "@/data/manual/am102-parts-sections";
import { localize } from "@/data/types";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import { localePath } from "@/lib/locale-helpers";
import { useDebounce, normalizeString, compactString, cn } from "@/lib/utils";
import { ManualPdfViewer } from "@/components/manual/manual-pdf-viewer";
import { ManualTechData } from "@/components/manual/manual-tech-data";
import ogImage from "@/assets/rocsta-hero.jpg";
import {
  BookOpen,
  Search,
  FileText,
  Gauge,
  LayoutList,
  ListOrdered,
  ArrowLeft,
  FileDown,
  Loader2,
  ChevronRight,
  Database,
  BookMarked,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";
const TEXT_URL = `${import.meta.env.BASE_URL}manual/am102-text.json`;
const ES_TEXT_URL = `${import.meta.env.BASE_URL}manual/am102-text.es.json`;
const PDF_URL = `${import.meta.env.BASE_URL}manual/am102.pdf`;
const ES_PDF_URL = `${import.meta.env.BASE_URL}manual/am102-es.pdf`;

const manualSearchSchema = z.object({
  tab: z.enum(["toc", "search", "tech", "reader"]).optional(),
  page: z.coerce.number().int().min(0).optional(),
  motor: z.enum(["all", "F8", "R2"]).optional(),
  pdf: z.string().optional(),
  q: z.string().optional(),
});

type ManualSearch = z.infer<typeof manualSearchSchema>;
type Tab = NonNullable<ManualSearch["tab"]>;

const TABS: { id: Tab; icon: typeof LayoutList; labelKey: string }[] = [
  { id: "toc", icon: ListOrdered, labelKey: "manual.tabs.toc" },
  { id: "search", icon: Search, labelKey: "manual.tabs.search" },
  { id: "tech", icon: Gauge, labelKey: "manual.tabs.tech" },
  { id: "reader", icon: BookOpen, labelKey: "manual.tabs.reader" },
];

export const Route = createFileRoute("/{-$locale}/manuals/am102")({
  validateSearch: (search) => manualSearchSchema.parse(search),
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.manualsReader.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.manualsReader.description", locale),
        },
        { name: "keywords", content: getMetaTranslation("meta.manualsReader.keywords", locale) },
        { property: "og:title", content: getMetaTranslation("meta.manualsReader.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.manualsReader.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/manuals/am102` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/manuals/am102` },
        ...getAlternateHrefs("/manuals/am102", SITE_URL).map((a) => ({
          rel: "alternate" as const,
          hrefLang: a.hreflang,
          href: a.href,
        })),
      ],
    };
  },
  component: Am102Page,
});

type PageDoc = { page: number; text: string };

function Am102Page() {
  const { t, language } = useLanguage();
  const { locale } = Route.useParams();
  const lang = resolveLocale(locale);
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const tab: Tab = search.tab ?? "toc";
  const page = search.page ?? 0;
  const motor = search.motor ?? "all";
  const isExternalPdf = Boolean(search.pdf);
  const [pdfPageCount, setPdfPageCount] = useState(isExternalPdf ? 466 : 427);

  const activePdfUrl = search.pdf
    ? `${import.meta.env.BASE_URL}${search.pdf}`
    : language === "es"
      ? ES_PDF_URL
      : PDF_URL;
  const activeTextUrl = search.pdf
    ? `${import.meta.env.BASE_URL}${search.pdf.replace(/\.pdf$/, "-text.json")}`
    : language === "es"
      ? ES_TEXT_URL
      : TEXT_URL;
  const highlightQuery = search.q ?? "";

  useMetaTags({
    title: getMetaTranslation("meta.manualsReader.title", lang),
    description: getMetaTranslation("meta.manualsReader.description", lang),
    ogTitle: getMetaTranslation("meta.manualsReader.ogTitle", lang),
    ogDescription: getMetaTranslation("meta.manualsReader.ogDescription", lang),
    ogImage: ogImage,
  });

  const setTab = (t: Tab) => navigate({ search: (prev) => ({ ...prev, tab: t }) });
  const goPage = (p: number) =>
    navigate({ search: (prev) => ({ ...prev, tab: "reader", page: p }) });
  const setMotor = (m: ManualSearch["motor"]) =>
    navigate({ search: (prev) => ({ ...prev, motor: m }) });

  const textUrl = activeTextUrl;
  const [corpus, setCorpus] = useState<PageDoc[] | null>(null);
  const [corpusLoadedUrl, setCorpusLoadedUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    fetch(textUrl)
      .then((r) => r.json())
      .then((d) => {
        if (alive) {
          setCorpus(d as PageDoc[]);
          setCorpusLoadedUrl(textUrl);
        }
      })
      .catch(() => {
        if (alive) {
          setCorpus([]);
          setCorpusLoadedUrl(textUrl);
        }
      });
    return () => {
      alive = false;
    };
  }, [textUrl]);
  const corpusLoading = corpusLoadedUrl !== textUrl;

  const currentSection = useMemo(
    () => (isExternalPdf ? partsSectionForPage(page) : sectionForPage(page)),
    [page, isExternalPdf],
  );
  const pageDoc = useMemo(() => corpus?.find((d) => d.page === page), [corpus, page]);

  return (
    <PageShell>
      <div className="space-y-6">
        {!isExternalPdf && (
          <>
            <Crumbs
              items={[
                { label: t("ui.archive") },
                { label: t("nav.manuals"), active: false },
                { label: "AM102 Workshop Manual", active: true },
              ]}
            />

            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    variant="secondary"
                    className="font-mono text-[10px] font-bold uppercase bg-rocsta-green/10 text-rocsta-green border border-rocsta-green/20"
                  >
                    AM102 · 1994
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] font-bold uppercase">
                    Asia Motors
                  </Badge>
                </div>
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                  <BookOpen className="size-8 text-rocsta-green" /> {t("manual.title")}
                </h1>
                <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("manual.subtitle")}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground font-mono">
                  <span className="flex items-center gap-1">
                    <FileText className="size-3.5 text-rocsta-accent" /> {t("manual.stats.pages")}
                  </span>
                  <span className="flex items-center gap-1">
                    <LayoutList className="size-3.5 text-rocsta-accent" /> {t("manual.stats.sections")}
                  </span>
                  <span className="flex items-center gap-1">
                    <Database className="size-3.5 text-rocsta-accent" /> {t("manual.stats.ocr")}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  to={localePath("/manuals")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-md bg-card border border-border px-4 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="size-3.5" /> {t("manual.backToManuals")}
                </Link>
                {language === "es" ? (
                  <>
                    <a
                      href={ES_PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                    >
                      <FileDown className="size-3.5" /> {t("manual.downloadEs")}
                    </a>
                    <a
                      href={PDF_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-1.5 rounded-md bg-card border border-border px-4 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <FileText className="size-3.5" /> {t("manual.downloadOriginal")}
                    </a>
                  </>
                ) : (
                  <a
                    href={PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
                  >
                    <FileDown className="size-3.5" /> {t("manual.downloadPdf")}
                  </a>
                )}
              </div>
            </div>
          </>
        )}

        {isExternalPdf && (
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={localePath("/manuals")}
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-card border border-border px-4 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="size-3.5" /> {t("nav.manuals")}
            </Link>
            <a
              href={`${import.meta.env.BASE_URL}manual/am102-parts.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
            >
              <FileDown className="size-3.5" /> {t("manual.downloadPdf")}
            </a>
          </div>
        )}

        <div className="inline-flex rounded-xl border border-border bg-card p-1 text-sm font-bold shadow-sm">
          {(isExternalPdf ? TABS.filter((t) => t.id === "toc" || t.id === "search" || t.id === "reader") : TABS).map((tabs) => {
            const Icon = tabs.icon;
            const active = tab === tabs.id;
            return (
              <button
                key={tabs.id}
                type="button"
                onClick={() => setTab(tabs.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-4 py-2 transition-colors",
                  active
                    ? "bg-rocsta-green text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-4" /> {t(tabs.labelKey)}
              </button>
            );
          })}
        </div>

        {tab === "toc" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                {isExternalPdf ? t("manual.toc.titleParts") : t("manual.toc.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isExternalPdf ? t("manual.toc.descParts") : t("manual.toc.desc")}
              </p>
            </div>
            {isExternalPdf && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">{t("manual.filter.motor")}:</span>
                {(["all", "F8", "R2"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMotor(m)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs font-bold transition-colors",
                      motor === m
                        ? "bg-rocsta-green text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "all" ? t("manual.motor.all") : m}
                  </button>
                ))}
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(isExternalPdf ? PARTS_SECTIONS : AM102_SECTIONS)
                .filter((s) => isExternalPdf ? (motor === "all" || s.motor === motor || s.motor === "ambos") : true)
                .map((s) => {
                const isCurrent = currentSection?.code === s.code;
                const pageCount = s.end - s.start + 1;
                return (
                  <button
                    key={s.code}
                    type="button"
                    onClick={() => goPage(s.start)}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-rocsta-green/40 hover:shadow-md",
                      isCurrent && "border-rocsta-green/40 bg-rocsta-green/5",
                    )}
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-rocsta-green/10 text-rocsta-green font-mono text-xs font-extrabold">
                      {s.code}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-extrabold text-sm text-foreground group-hover:text-rocsta-green transition-colors">
                          {localize(s.title, language)}
                        </span>
                        {s.motor !== "ambos" && (
                          <Badge
                            variant="secondary"
                            className="text-[9px] font-bold font-mono uppercase py-0.5 px-1.5"
                          >
                            {s.motor}
                          </Badge>
                        )}
                      </div>
                      <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {t("manual.section")} {s.code} · {t("manual.page")} {s.start + 1}–
                        {s.end + 1} · {pageCount} {t("manual.pages")}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground group-hover:text-rocsta-green shrink-0 transition-colors" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {tab === "search" && (
          <SearchPanel corpus={corpus} loading={corpusLoading} onGoPage={goPage} isPartsCatalog={isExternalPdf} />
        )}

        {tab === "tech" && (
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">{t("manual.tech.title")}</h2>
              <p className="text-sm text-muted-foreground">{t("manual.tech.desc")}</p>
            </div>
            <ManualTechData motor={motor} onMotorChange={setMotor} onViewPage={goPage} />
          </section>
        )}

        {tab === "reader" && (
          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
                  <BookMarked className="size-5 text-rocsta-green" />
                  {currentSection
                    ? localize(currentSection.title, language)
                    : t("manual.reader.title")}
                </h2>
                <p className="text-xs font-mono text-muted-foreground">
                  {currentSection ? `${t("manual.section")} ${currentSection.code} · ` : ""}
                  {t("manual.reader.pageOf", { page: page + 1, total: pdfPageCount })}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setTab("toc")}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-card border border-border px-4 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <LayoutList className="size-3.5" /> {t("manual.reader.openToc")}
              </button>
            </div>

            {language === "es" && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-muted-foreground">
                {t("manual.reader.esNote")}
              </p>
            )}

            <ManualPdfViewer
              page={page}
              onPageChange={goPage}
              pdfUrl={activePdfUrl}
              onPageCountChange={setPdfPageCount}
              highlightQuery={highlightQuery}
            />

            {!isExternalPdf && language !== "en" && (
              <OcrPanel doc={pageDoc} loading={corpusLoading} highlightQuery={highlightQuery} />
            )}
          </section>
        )}

        <div className="rounded-xl border border-border bg-card p-4 text-center">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {t("manual.copyright")}{" "}
            <a
              href="https://www.facebook.com/groups/622611641812238/permalink/1831859074220816"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-rocsta-green transition-colors"
            >
              Facebook Group
            </a>
          </p>
        </div>
      </div>
    </PageShell>
  );
}

function OcrPanel({ doc, loading, highlightQuery }: { doc: PageDoc | undefined; loading: boolean; highlightQuery?: string }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(Boolean(highlightQuery));
  const text = doc?.text?.trim();

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 bg-muted/40 px-4 py-3 text-xs font-extrabold text-foreground"
      >
        <span className="flex items-center gap-2">
          <Search className="size-4 text-rocsta-accent" /> {t("manual.reader.ocrToggle")}
        </span>
        <span className="text-muted-foreground font-mono text-[11px]">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="p-4">
          {loading ? (
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="size-3.5 animate-spin" /> {t("manual.reader.loading")}
            </p>
          ) : text ? (
            <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-muted-foreground font-mono">
              {highlightQuery ? <HighlightText text={text} query={highlightQuery} /> : text}
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">{t("manual.reader.ocrEmpty")}</p>
          )}
        </div>
      )}
    </div>
  );
}

function HighlightText({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>;
  const q = normalizeString(query);
  const parts: React.ReactNode[] = [];
  let lastIdx = 0;
  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();
  let idx = lowerText.indexOf(lowerQ, lastIdx);
  while (idx !== -1) {
    if (idx > lastIdx) parts.push(<span key={lastIdx}>{text.slice(lastIdx, idx)}</span>);
    parts.push(
      <mark key={idx} className="rounded bg-rocsta-green/25 px-0.5 text-foreground font-bold">
        {text.slice(idx, idx + q.length)}
      </mark>,
    );
    lastIdx = idx + q.length;
    idx = lowerText.indexOf(lowerQ, lastIdx);
  }
  if (lastIdx < text.length) parts.push(<span key={lastIdx}>{text.slice(lastIdx)}</span>);
  return <>{parts}</>;
}

function SearchPanel({
  corpus,
  loading,
  onGoPage,
  isPartsCatalog,
}: {
  corpus: PageDoc[] | null;
  loading: boolean;
  onGoPage: (page: number) => void;
  isPartsCatalog?: boolean;
}) {
  const { t, language } = useLanguage();
  const [input, setInput] = useState("");
  const debounced = useDebounce(input, 250);
  const query = debounced.trim();

  const results = useMemo(() => {
    if (query.length < 2 || !corpus) return [];
    const q = normalizeString(query);
    const qCompact = compactString(query);
    const found: {
      page: number;
      snippet: string;
      sectionCode: string;
      sectionTitle: string;
      match: string;
    }[] = [];
    for (const doc of corpus) {
      const normalized = normalizeString(doc.text);
      let idx = normalized.indexOf(q);
      if (idx === -1 && qCompact.length >= 2) {
        const compact = compactString(doc.text);
        const ci = compact.indexOf(qCompact);
        if (ci !== -1) {
          let charCount = 0;
          idx = 0;
          while (idx < normalized.length && charCount < ci) {
            if (/\S/.test(normalized[idx])) charCount++;
            idx++;
          }
        }
      }
      if (idx === -1) continue;
      const rawIdx = findRawIndex(doc.text, query, idx);
      const snippet = makeSnippet(doc.text, rawIdx, q.length);
      const section = isPartsCatalog ? partsSectionForPage(doc.page) : sectionForPage(doc.page);
      found.push({
        page: doc.page,
        snippet,
        sectionCode: section?.code ?? "",
        sectionTitle: section ? localize(section.title, language) : "",
        match: query,
      });
      if (found.length >= 60) break;
    }
    return found;
  }, [query, corpus, language, isPartsCatalog]);

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-extrabold text-foreground">{t("manual.search.title")}</h2>
        <p className="text-sm text-muted-foreground">{t("manual.search.desc")}</p>
      </div>

      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={t("manual.search.placeholder")}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="pl-9 bg-card focus-visible:ring-rocsta-green"
        />
      </div>

      {query.length > 0 && query.length < 2 && (
        <p className="text-xs text-muted-foreground">{t("manual.search.hint")}</p>
      )}

      {query.length >= 2 && (
        <>
          <div className="text-xs text-muted-foreground font-bold">
            {t("manual.search.results", { count: results.length })}
          </div>

          {results.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center shadow-sm">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3">
                <Search className="size-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">
                {t("manual.search.noResults")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground max-w-xs mx-auto">
                {t("manual.search.noResultsDesc")}
              </p>
            </div>
          )}

          <ul className="space-y-2">
            {results.map((r) => (
              <li key={r.page}>
                <button
                  type="button"
                  onClick={() => onGoPage(r.page)}
                  className="w-full rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-all hover:border-rocsta-green/40 hover:shadow-md"
                >
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="font-mono text-[11px] font-extrabold text-rocsta-green">
                      {t("manual.page")} {r.page + 1}
                    </span>
                    {r.sectionCode && (
                      <span className="text-[10px] font-bold uppercase text-muted-foreground font-mono">
                        {r.sectionCode} · {r.sectionTitle}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <Highlight text={r.snippet} query={r.match} />
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {query.length === 0 && loading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" /> {t("manual.reader.loading")}
        </p>
      )}
    </section>
  );
}

function findRawIndex(raw: string, query: string, normalizedIdx: number): number {
  if (normalizedIdx <= 0) return 0;
  const prefix = normalizeString(raw.slice(0, normalizedIdx));
  const qNorm = normalizeString(query);
  let i = prefix.length;
  while (i > 0 && !prefix.endsWith(qNorm.slice(0, 1))) i--;
  return Math.max(0, i - 2);
}

function makeSnippet(raw: string, rawIdx: number, qLen: number): string {
  const start = Math.max(0, rawIdx - 60);
  const end = Math.min(raw.length, rawIdx + qLen + 110);
  const pre = start > 0 ? "…" : "";
  const post = end < raw.length ? "…" : "";
  return pre + raw.slice(start, end).replace(/\s+/g, " ") + post;
}

function Highlight({ text, query }: { text: string; query: string }) {
  const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, "ig"));
  return (
    <>
      {parts.map((p, i) =>
        normalizeString(p) === normalizeString(query) ? (
          <mark key={i} className="rounded bg-rocsta-green/20 px-0.5 text-foreground">
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
