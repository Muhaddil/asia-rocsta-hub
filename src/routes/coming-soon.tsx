import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Crumbs } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { getMetaTranslation, getInitialLanguage } from "@/lib/meta-translations";
import { Construction } from "lucide-react";
import ogImage from "@/assets/rocsta-hero.jpg";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

export const Route = createFileRoute("/coming-soon")({
  head: () => {
    const lang = getInitialLanguage();
    return {
      meta: [
        { title: getMetaTranslation("meta.comingSoon.title", lang) },
        {
          name: "description",
          content: getMetaTranslation("meta.comingSoon.description", lang),
        },
        { property: "og:title", content: getMetaTranslation("meta.comingSoon.ogTitle", lang) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.comingSoon.ogDescription", lang),
        },
        { property: "og:url", content: `${SITE_URL}/coming-soon` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/coming-soon` },
        { rel: "alternate", hrefLang: "es", href: `${SITE_URL}/coming-soon?lang=es` },
        { rel: "alternate", hrefLang: "en", href: `${SITE_URL}/coming-soon?lang=en` },
        { rel: "alternate", hrefLang: "x-default", href: `${SITE_URL}/coming-soon` },
      ],
    };
  },
  component: ComingSoonPage,
});

function ComingSoonPage() {
  const { t, language } = useLanguage();

  useMetaTags({
    title: getMetaTranslation("meta.comingSoon.title", language),
    description: getMetaTranslation("meta.comingSoon.description", language),
    ogTitle: getMetaTranslation("meta.comingSoon.ogTitle", language),
    ogDescription: getMetaTranslation("meta.comingSoon.ogDescription", language),
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