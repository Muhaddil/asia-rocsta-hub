import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Crumbs } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { CHANGELOG, CURRENT_VERSION } from "@/data/version";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import { getMetaTranslation } from "@/lib/meta-translations";
import { Tag, History } from "lucide-react";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

export const Route = createFileRoute("/{-$locale}/changelog")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.changelog.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.changelog.description", locale),
        },
        { property: "og:title", content: getMetaTranslation("meta.changelog.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.changelog.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/changelog` },
        { property: "og:type", content: "website" },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/changelog` },
        ...getAlternateHrefs("/changelog", SITE_URL).map((a) => ({
          rel: "alternate" as const,
          hrefLang: a.hreflang,
          href: a.href,
        })),
      ],
    };
  },
  component: ChangelogPage,
});

function ChangelogPage() {
  const { t, language } = useLanguage();
  useMetaTags({
    title: t("meta.changelog.title"),
    description: t("meta.changelog.description"),
    ogTitle: t("meta.changelog.ogTitle"),
    ogDescription: t("meta.changelog.ogDescription"),
  });

  return (
    <PageShell>
      <Crumbs items={[{ label: t("ui.archive") }, { label: t("nav.changelog"), active: true }]} />

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl bg-rocsta-green/10 flex items-center justify-center">
            <History className="size-5 text-rocsta-green" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              {t("changelog.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("changelog.subtitle")} v{CURRENT_VERSION}
            </p>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-border" />

        <div className="space-y-8">
          {CHANGELOG.map((entry) => (
            <div key={entry.version} className="relative pl-12">
              <div className="absolute left-2.5 top-1.5 h-[14px] w-[14px] rounded-full border-2 border-rocsta-green bg-background z-10" />

              <div className="rounded-xl border border-border bg-card p-5 hover:border-rocsta-green/30 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="size-3.5 text-rocsta-green" />
                    <span className="font-mono text-sm font-bold text-rocsta-green">
                      v{entry.version}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {new Date(entry.date).toLocaleDateString(
                      language === "en" ? "en-US" : "es-ES",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </span>
                  {entry.version === CURRENT_VERSION && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-rocsta-green/10 text-rocsta-green border border-rocsta-green/20">
                      {t("changelog.current")}
                    </span>
                  )}
                </div>

                <ul className="space-y-1.5">
                  {entry.changes.map((change, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-rocsta-green/50 shrink-0" />
                      {change[language] ?? change.es}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
