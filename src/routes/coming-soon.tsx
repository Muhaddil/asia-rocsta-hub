import { createFileRoute } from "@tanstack/react-router";
import { PageShell, Crumbs } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { Construction } from "lucide-react";
import ogImage from "@/assets/rocsta-hero.jpg";

export const Route = createFileRoute("/coming-soon")({
  head: () => ({
    meta: [
      { title: "Sección en construcción — Asia Rocsta Archive" },
      {
        name: "description",
        content: "Esta sección del archivo Asia Rocsta está siendo desarrollada y estará disponible pronto.",
      },
      { property: "og:title", content: "Sección en construcción — Asia Rocsta Archive" },
      { property: "og:url", content: "/coming-soon" },
      { property: "og:image", content: ogImage },
      { name: "twitter:image", content: ogImage },
    ],
    links: [{ rel: "canonical", href: "/coming-soon" }],
  }),
  component: ComingSoonPage,
});

function ComingSoonPage() {
  const { t } = useLanguage();

  return (
    <PageShell>
      <Crumbs items={[{ label: t("ui.archive") }, { label: t("comingSoon.crumb"), active: true }]} />
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
        {t("comingSoon.title")}
      </h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-2xl">
        {t("comingSoon.desc")}
      </p>

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
