import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Crumbs } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import { Construction } from "lucide-react";
import ogImage from "@/assets/rocsta-hero.jpg";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

export const Route = createFileRoute("/{-$locale}/coming-soon")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.comingSoon.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.comingSoon.description", locale),
        },
        { name: "keywords", content: getMetaTranslation("meta.comingSoon.keywords", locale) },
        { property: "og:title", content: getMetaTranslation("meta.comingSoon.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.comingSoon.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/coming-soon` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/coming-soon` },
        ...getAlternateHrefs("/coming-soon", SITE_URL).map((a) => ({
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
                name: "Próximamente",
                item: `${SITE_URL}/${locale}/coming-soon`,
              },
            ],
          }),
        },
      ],
    };
  },
  component: ComingSoonPage,
});

function ComingSoonPage() {
  const { t, language } = useLanguage();
  const { locale } = Route.useParams();
  const lang = resolveLocale(locale);

  useMetaTags({
    title: getMetaTranslation("meta.comingSoon.title", lang),
    description: getMetaTranslation("meta.comingSoon.description", lang),
    ogTitle: getMetaTranslation("meta.comingSoon.ogTitle", lang),
    ogDescription: getMetaTranslation("meta.comingSoon.ogDescription", lang),
    ogImage: ogImage,
  });

  return (
    <PageShell>
      <Crumbs
        items={[{ label: t("ui.archive") }, { label: t("comingSoon.crumb"), active: true }]}
      />
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        {t("comingSoon.title")}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{t("comingSoon.desc")}</p>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-rocsta-green/10 text-rocsta-green mb-4">
          <Construction className="size-6" />
        </div>
        <h2 className="text-xl font-bold">{t("comingSoon.heading")}</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          {t("comingSoon.body")}
        </p>
      </div>
    </PageShell>
  );
}
