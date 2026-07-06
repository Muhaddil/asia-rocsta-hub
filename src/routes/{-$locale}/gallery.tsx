import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { PageShell, Crumbs } from "@/components/page-shell";
import { api } from "@/lib/api";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import { Loader2, ChevronLeft, ChevronRight, Camera } from "lucide-react";
import { GalleryLightbox } from "@/components/gallery-lightbox";
import ogImage from "@/assets/rocsta-hero.jpg";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";
const ITEMS_PER_PAGE = 12;

const gallerySearchSchema = z.object({
  page: z.number().min(1).optional(),
});

export const Route = createFileRoute("/{-$locale}/gallery")({
  validateSearch: (search) => gallerySearchSchema.parse(search),
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.gallery.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.gallery.description", locale),
        },
        { name: "keywords", content: getMetaTranslation("meta.gallery.keywords", locale) },
        { property: "og:title", content: getMetaTranslation("meta.gallery.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.gallery.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/gallery` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/gallery` },
        ...getAlternateHrefs("/gallery", SITE_URL).map((a) => ({
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
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/${locale}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Galería",
                item: `${SITE_URL}/${locale}/gallery`,
              },
            ],
          }),
        },
      ],
    };
  },
  component: GalleryPage,
});

const API_BASE =
  typeof import.meta !== "undefined" &&
  (import.meta as { env?: Record<string, string> }).env?.VITE_API_URL
    ? (import.meta as { env: Record<string, string> }).env.VITE_API_URL
    : "http://localhost:3001";

function imageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

function GalleryPage() {
  const { t } = useLanguage();
  const { locale } = Route.useParams();
  const searchParams = Route.useSearch();
  const navigate = Route.useNavigate();

  const currentPage = searchParams.page || 1;
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useMetaTags({
    title: getMetaTranslation("meta.gallery.title", resolveLocale(locale)),
    description: getMetaTranslation("meta.gallery.description", resolveLocale(locale)),
    ogTitle: getMetaTranslation("meta.gallery.ogTitle", resolveLocale(locale)),
    ogDescription: getMetaTranslation("meta.gallery.ogDescription", resolveLocale(locale)),
    ogImage: ogImage,
  });

  const { data: allEntries = [], isLoading: loading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => api.getGallery(),
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  const verifiedEntries = useMemo(() => allEntries.filter((e) => e.verified), [allEntries]);

  const totalPages = Math.ceil(verifiedEntries.length / ITEMS_PER_PAGE);
  const pageEntries = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return verifiedEntries.slice(start, start + ITEMS_PER_PAGE);
  }, [verifiedEntries, currentPage]);

  const goToPage = (page: number) => {
    navigate({ search: { page } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const paginationRange = useMemo(() => {
    const range: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      range.push(1);
      if (currentPage > 3) range.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) range.push(i);
      if (currentPage < totalPages - 2) range.push("...");
      range.push(totalPages);
    }
    return range;
  }, [currentPage, totalPages]);

  return (
    <PageShell>
      <div className="space-y-6">
        <Crumbs items={[{ label: t("nav.gallery"), active: true }]} />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Camera className="size-8 text-rocsta-green" /> {t("home.gallery.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("home.gallery.desc")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center py-12">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : pageEntries.length === 0 ? (
            <p className="col-span-full text-center text-sm text-muted-foreground py-12">
              {t("home.gallery.empty")}
            </p>
          ) : (
            pageEntries.map((e, idx) => (
              <article
                key={e.id}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all cursor-pointer"
                onClick={() => setLightboxIndex(idx)}
                onKeyDown={(ev) => {
                  if (ev.key === "Enter" || ev.key === " ") {
                    ev.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={imageUrl(e.image)}
                    alt={`Asia Rocsta ${e.year}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-extrabold text-foreground">
                      Rocsta {e.year} · {e.motor}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {e.country && `${e.country} — `}
                      {e.owner}
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <nav className="flex items-center justify-center gap-1.5 pt-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-9 w-9 rounded-md border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="size-4" />
            </button>

            {paginationRange.map((p, i) =>
              p === "..." ? (
                <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={[
                    "h-9 min-w-[2.25rem] rounded-md border text-sm font-bold transition-all",
                    p === currentPage
                      ? "border-rocsta-green bg-rocsta-green/10 text-rocsta-green"
                      : "border-border bg-card text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-9 w-9 rounded-md border border-border bg-card flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="size-4" />
            </button>
          </nav>
        )}

        {lightboxIndex !== null && (
          <GalleryLightbox
            entries={pageEntries}
            open={lightboxIndex !== null}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </div>
    </PageShell>
  );
}
