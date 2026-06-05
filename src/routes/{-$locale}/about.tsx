import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Info } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import {
  aboutHero,
  aboutSections,
  aboutMission,
  type Localized,
  type AboutInfo,
} from "@/data/about";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import heroImg from "@/assets/rocsta-hero.jpg";
import ogImage from "@/assets/rocsta-hero.jpg";
import { localePath } from "@/lib/locale-helpers";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

export const Route = createFileRoute("/{-$locale}/about")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.about.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.about.description", locale),
        },
        { property: "og:title", content: getMetaTranslation("meta.about.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.about.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/about` },
        { property: "og:type", content: "article" },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/about` },
        ...getAlternateHrefs("/about", SITE_URL).map((a) => ({
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
            "@type": "Vehicle",
            name: "Asia Rocsta",
            manufacturer: { "@type": "Organization", name: "Asia Motors (KIA)" },
            productionDate: "1990/1997",
            vehicleConfiguration: "4x4 SUV",
            fuelType: ["Gasoline", "Diesel"],
          }),
        },
      ],
    };
  },
  component: AboutPage,
});

function InfoIcon({ info, lang }: { info: AboutInfo; lang: "es" | "en" }) {
  const [open, setOpen] = useState(false);
  const tooltipText = info.tooltip[lang] ?? info.tooltip.es;
  const dialogTitle = info.dialog.title[lang] ?? info.dialog.title.es;
  const dialogBody = info.dialog.body[lang] ?? info.dialog.body.es;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="ml-1.5 inline-flex items-center justify-center size-4 rounded-full bg-muted text-muted-foreground hover:bg-rocsta-green hover:text-white transition-colors cursor-pointer align-middle relative -top-0.5"
            aria-label={tooltipText}
          >
            <Info className="size-2.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogDescription asChild>
              <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line mt-2">
                {dialogBody}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AboutPage() {
  const { language, t } = useLanguage();
  const L = (v: Localized) => v[language] ?? v.es;
  const { locale } = Route.useParams();
  const lang = resolveLocale(locale);

  useMetaTags({
    title: getMetaTranslation("meta.about.title", lang),
    description: getMetaTranslation("meta.about.description", lang),
    ogTitle: getMetaTranslation("meta.about.ogTitle", lang),
    ogDescription: getMetaTranslation("meta.about.ogDescription", lang),
    ogImage: ogImage,
  });

  return (
    <TooltipProvider delayDuration={300}>
      <PageShell>
        <div className="mb-8">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>{t("ui.archive")}</span>
            <span>/</span>
            <span className="text-rocsta-green font-semibold">{L(aboutHero.crumb)}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
            {L(aboutHero.title)}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {L(aboutHero.lead)}
          </p>
        </div>

        <div className="mb-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <img
            src={heroImg}
            alt="Asia Rocsta"
            width={1600}
            height={900}
            loading="lazy"
            className="w-full aspect-[16/8] object-cover"
          />
        </div>

        <nav className="mb-12 rounded-xl border border-border bg-card p-5">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
            {language === "es" ? "Contenido" : "Contents"}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
            {aboutSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="text-foreground hover:text-rocsta-green transition-colors"
                >
                  {L(s.title)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-14">
          {aboutSections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
                {L(section.title)}
              </h2>

              {"intro" in section && section.intro && (
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed max-w-3xl">
                  {L(section.intro)}
                </p>
              )}

              {section.kind === "prose" && (
                <div className="space-y-4 max-w-3xl">
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="text-sm text-foreground leading-relaxed">
                      {L(p)}
                    </p>
                  ))}
                </div>
              )}

              {section.kind === "facts" && (
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border">
                  {section.facts.map((f, i) => (
                    <div key={i} className="bg-card p-5">
                      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {L(f.label)}
                        {f.info && <InfoIcon info={f.info} lang={lang as "es" | "en"} />}
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-foreground">{L(f.value)}</dd>
                    </div>
                  ))}
                </dl>
              )}

              {section.kind === "engines" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.engines.map((e) => (
                    <div
                      key={e.code.es}
                      className="rounded-xl border border-border bg-card p-6 shadow-sm"
                    >
                      <div className="flex items-baseline justify-between gap-2 mb-4">
                        <h3 className="text-base font-extrabold font-mono">{L(e.code)}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-rocsta-green">
                          {L(e.fuel)}
                        </span>
                      </div>
                      <dl className="grid grid-cols-2 gap-3 text-xs">
                        {e.specs.map((s, i) => (
                          <div key={i}>
                            <dt className="text-muted-foreground uppercase tracking-wider text-[10px] font-bold">
                              {L(s.label)}
                              {s.info && <InfoIcon info={s.info} lang={lang as "es" | "en"} />}
                            </dt>
                            <dd className="font-mono font-bold text-foreground mt-0.5">
                              {L(s.value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                        {L(e.notes)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {section.kind === "dimensions" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {section.sets.map((set) => (
                    <div
                      key={set.id}
                      className="rounded-xl border border-border bg-card p-6 shadow-sm"
                    >
                      <h3 className="text-sm font-extrabold text-foreground">{L(set.name)}</h3>
                      <p className="text-xs text-muted-foreground mb-4 mt-0.5">{L(set.tagline)}</p>
                      <dl className="divide-y divide-border/60">
                        {set.rows.map((r, i) => (
                          <div key={i} className="flex justify-between gap-4 py-2 text-xs">
                            <dt className="text-muted-foreground">
                              {L(r.label)}
                              {r.info && <InfoIcon info={r.info} lang={lang as "es" | "en"} />}
                            </dt>
                            <dd className="font-mono font-bold text-foreground text-right">
                              {L(r.value)}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              )}

              {section.kind === "list" && (
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                      <h3 className="text-sm font-extrabold text-foreground">{L(item.title)}</h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        {L(item.description)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}

              {section.kind === "timeline" && (
                <ol className="relative border-l-2 border-border/70 ml-3 space-y-6">
                  {section.entries.map((p) => (
                    <li key={p.year} className="pl-6 relative">
                      <span className="absolute -left-[9px] top-1 size-4 rounded-full bg-rocsta-green border-4 border-background" />
                      <div className="text-xs font-mono font-bold text-rocsta-accent uppercase tracking-widest">
                        {p.year}
                      </div>
                      <p className="mt-1 text-sm text-foreground leading-relaxed">{L(p.text)}</p>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <section className="mt-14 rounded-2xl bg-rocsta-dark p-6 md:p-8 text-white">
          <h2 className="text-2xl font-bold mb-3">{L(aboutMission.title)}</h2>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{L(aboutMission.desc)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={localePath("/community")}
              className="rounded-md bg-rocsta-green px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
            >
              {L(aboutMission.cta)}
            </Link>
            <Link
              to={localePath("/parts")}
              className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold border border-white/10 hover:bg-white/20"
            >
              {L(aboutMission.cta2)}
            </Link>
          </div>
        </section>
      </PageShell>
    </TooltipProvider>
  );
}
