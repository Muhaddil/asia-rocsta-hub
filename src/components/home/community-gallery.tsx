import { Link } from "@tanstack/react-router";
import { useLanguage } from "@/components/language-provider";
import { api, getApiBase, type ApiGalleryEntry } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { localePath } from "@/lib/locale-helpers";

const API_BASE = getApiBase();

function imageUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export function CommunityGallery() {
  const { t } = useLanguage();

  const { data: entries = [], isLoading: loading } = useQuery({
    queryKey: ["gallery"],
    queryFn: () => api.getGallery(),
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("home.gallery.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("home.gallery.desc")}</p>
        </div>
        <Link
          to={localePath("/community")}
          search={{ tab: "photo" }}
          className="text-sm font-bold text-rocsta-green hover:underline"
        >
          {t("home.gallery.cta")}
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : entries.length === 0 ? (
          <p className="col-span-full text-center text-sm text-muted-foreground py-12">
            {t("home.gallery.empty")}
          </p>
        ) : (
          entries
            .filter((e) => e.verified)
            .map((e) => (
              <article
                key={e.id}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all"
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
                  {/* <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  {t("home.gallery.placeholder")}
                </span> */}
                </div>
              </article>
            ))
        )}
      </div>
    </section>
  );
}
