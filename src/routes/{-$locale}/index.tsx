import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  BookOpen,
  Wrench,
  AlertTriangle,
  FileText,
  Users,
  GitCompare,
  ArrowRight,
  MessageSquare,
} from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { SystemDiagram } from "@/components/home/system-diagram";
import { MaintenanceSchedule } from "@/components/home/maintenance-schedule";
import { CommunityGallery } from "@/components/home/community-gallery";
import { parts } from "@/data/parts";
import { problems } from "@/data/problems";
import { guides } from "@/data/guides";
import { localize, type GuideLevel } from "@/data/types";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import ogImage from "@/assets/rocsta-hero.jpg";
import { localePath } from "@/lib/locale-helpers";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

export const Route = createFileRoute("/{-$locale}/")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.home.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.home.description", locale),
        },
        { property: "og:title", content: getMetaTranslation("meta.home.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.home.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/` },
        ...getAlternateHrefs("/", SITE_URL).map((a) => ({
          rel: "alternate" as const,
          hrefLang: a.hreflang,
          href: a.href,
        })),
      ],
    };
  },
  component: LocaleIndex,
});

function LocaleIndex() {
  const { t, language } = useLanguage();
  const { locale } = Route.useParams();
  const navigate = useNavigate();

  useMetaTags({
    title: getMetaTranslation("meta.home.title", language),
    description: getMetaTranslation("meta.home.description", language),
    ogTitle: getMetaTranslation("meta.home.ogTitle", language),
    ogDescription: getMetaTranslation("meta.home.ogDescription", language),
    ogImage: ogImage,
  });

  const popularParts = useMemo(() => {
    const ids = ["p-001", "p-002", "p-011", "p-015", "p-031"];
    return ids
      .map((id) => parts.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, []);

  const popularProblems = useMemo(() => {
    const ids = ["pr-001", "pr-002", "pr-005"];
    return ids
      .map((id) => problems.find((prob) => prob.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
  }, []);

  const recentGuides = useMemo(() => {
    const ids = ["g-001", "g-002"];
    return ids
      .map((id) => guides.find((g) => g.id === id))
      .filter((g): g is NonNullable<typeof g> => Boolean(g));
  }, []);

  const STATS = [
    { label: t("home.stats.years"), value: "1990–99" },
    { label: t("home.stats.engines"), value: "2" },
    { label: t("home.stats.markets"), value: "30+" },
    { label: t("home.stats.units"), value: "~77k" },
  ];

  const QUICK_ACCESS = [
    {
      to: "/parts" as const,
      icon: Wrench,
      label: t("home.quick.parts"),
      desc: t("home.quick.partsDesc"),
    },
    {
      to: "/compatibility" as const,
      icon: GitCompare,
      label: t("home.quick.comp"),
      desc: t("home.quick.compDesc"),
    },
    {
      to: "/guides" as const,
      icon: BookOpen,
      label: t("home.quick.guides"),
      desc: t("home.quick.guidesDesc"),
    },
    {
      to: "/problems" as const,
      icon: AlertTriangle,
      label: t("home.quick.problems"),
      desc: t("home.quick.problemsDesc"),
    },
    {
      to: "/manuals" as const,
      icon: FileText,
      label: t("home.quick.manuals"),
      desc: t("home.quick.manualsDesc"),
    },
    {
      to: "/community" as const,
      icon: Users,
      label: t("home.quick.community"),
      desc: t("home.quick.communityDesc"),
    },
    {
      to: "/forum" as const,
      icon: MessageSquare,
      label: t("home.quick.forum"),
      desc: t("home.quick.forumDesc"),
    },
  ];

  return (
    <PageShell>
      <div className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>{t("ui.archive")}</span>
          <span>/</span>
          <span className="text-rocsta-green font-semibold">{t("nav.home")}</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-balance">
          {t("home.title")} <span className="text-rocsta-green">Asia Rocsta</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed">
          {t("home.desc")}
        </p>

        <div
          onClick={() => {
            document.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }));
          }}
          className="mt-8 relative group max-w-2xl cursor-pointer"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
          <input
            type="text"
            readOnly
            placeholder={t("search.heroPlaceholder")}
            className="w-full h-14 rounded-xl border border-border bg-card pl-12 pr-24 text-sm shadow-sm focus:border-rocsta-green focus:outline-none focus:ring-2 focus:ring-rocsta-green/20 transition-all cursor-pointer select-none"
          />
          <kbd className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-border bg-background px-2 py-1 text-[10px] font-mono text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      <SystemDiagram />

      <div className="mb-12 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
        {STATS.map((s) => (
          <div key={s.label} className="bg-card p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
              {s.label}
            </p>
            <p className="text-3xl font-extrabold text-foreground font-mono">{s.value}</p>
          </div>
        ))}
      </div>

      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground">
          {t("home.quickAccess")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {QUICK_ACCESS.map((q) => (
            <Link
              key={q.to + q.label}
              to={localePath(q.to)}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-rocsta-green/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="h-9 w-9 rounded-md bg-rocsta-green/10 flex items-center justify-center text-rocsta-green">
                  <q.icon className="size-4" />
                </div>
                <ArrowRight className="size-4 text-muted-foreground group-hover:text-rocsta-green group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-sm font-extrabold mb-1 text-foreground">{q.label}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{q.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">{t("home.popular")}</h2>
          <Link
            to={localePath("/parts")}
            className="text-sm font-bold text-rocsta-green hover:underline"
          >
            {t("home.popular.viewAll")}
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead className="bg-muted/65 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("home.popular.part")}
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("home.popular.oem")}
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {t("home.popular.equiv")}
                  </th>
                  <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">
                    {t("home.popular.status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {popularParts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-sm text-muted-foreground"
                    >
                      {t("home.noPopularParts")}
                    </td>
                  </tr>
                ) : (
                  popularParts.map((p) => {
                    const name = localize(p.name, language);
                    const desc = localize(p.description, language);
                    const equiv = p.equiv.slice(0, 2).join(" / ");
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-muted/40 transition-colors cursor-pointer"
                        onClick={() =>
                          navigate({ to: localePath("/parts"), search: { search: name } })
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate({ to: localePath("/parts"), search: { search: name } });
                          }
                        }}
                        tabIndex={0}
                        role="button"
                      >
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-sm text-foreground">{name}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-foreground">
                          {localize(p.oem, language)}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted-foreground font-medium">
                          {equiv}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {p.status === "verified" ? (
                            <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-400">
                              {t("home.popular.verified")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                              {t("home.popular.requiresMod")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <MaintenanceSchedule />

      {recentGuides.length > 0 && (
        <section className="mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              {t("home.guides.recent")}
            </h2>
            <Link
              to={localePath("/guides")}
              className="text-sm font-bold text-rocsta-green hover:underline"
            >
              {t("home.guides.all")}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recentGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                locale={locale || "en"}
                img={guide.image || ""}
                level={guide.level}
                time={guide.time}
                title={localize(guide.title, language)}
                desc={localize(guide.description, language)}
                contributions={guide.contributions}
                advanced={guide.level !== "Principiante"}
              />
            ))}
          </div>
        </section>
      )}

      <CommunityGallery />

      <section className="rounded-2xl bg-rocsta-dark p-6 md:p-8 text-white shadow-md">
        <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold">{t("home.issues.timeline")}</h2>
            <p className="text-slate-400 text-sm mt-0.5">{t("home.issues.desc")}</p>
          </div>
          <Link
            to={localePath("/problems")}
            className="rounded-md bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20 transition-all shadow-sm border border-white/5"
          >
            {t("home.issues.viewAll")}
          </Link>
        </div>
        <div className="space-y-1">
          {popularProblems.map((i) => {
            const title = localize(i.title, language);
            const symptom = localize(i.symptom, language);
            return (
              <div
                key={i.id}
                onClick={() =>
                  navigate({
                    to: localePath("/problems"),
                    search: { search: title.substring(0, 15) },
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate({
                      to: localePath("/problems"),
                      search: { search: title.substring(0, 15) },
                    });
                  }
                }}
                tabIndex={0}
                role="button"
                className="flex items-start gap-4 border-b border-white/10 py-4 last:border-0 cursor-pointer hover:bg-white/[0.03] px-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rocsta-green/40"
              >
                <div
                  className={[
                    "h-10 w-10 shrink-0 rounded flex items-center justify-center font-bold",
                    i.severity === "critical" && "bg-red-500/20 text-red-400",
                    i.severity === "warn" && "bg-amber-500/20 text-amber-400",
                    i.severity === "info" && "bg-blue-500/20 text-blue-400",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {i.severity === "info" ? "i" : "!"}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-100 hover:text-rocsta-green transition-colors">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1 leading-relaxed">{symptom}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

const LEVEL_KEYS = {
  Principiante: "guides.level.beginner",
  Intermedio: "guides.level.intermediate",
  Avanzado: "guides.level.advanced",
} as const;

function GuideCard({
  locale,
  img,
  level,
  time,
  title,
  desc,
  contributions,
  advanced,
}: {
  locale: string;
  img: string;
  level: GuideLevel;
  time: string;
  title: string;
  desc: string;
  contributions: number;
  advanced?: boolean;
}) {
  const { t } = useLanguage();
  return (
    <Link
      to={localePath("/guides")}
      search={{ search: title }}
      className="group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg block cursor-pointer"
    >
      <div className="aspect-video bg-muted overflow-hidden">
        <img
          src={img}
          alt={title}
          width={1280}
          height={720}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={[
              "rounded px-2 py-0.5 text-[10px] font-bold uppercase",
              advanced
                ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                : "bg-rocsta-green/10 text-rocsta-green",
            ].join(" ")}
          >
            {t(LEVEL_KEYS[level])}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{time}</span>
        </div>
        <h3 className="text-lg font-extrabold text-foreground group-hover:text-rocsta-green transition-colors leading-snug">
          {title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">{desc}</p>
        <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rocsta-accent">
            {t("home.guides.read")}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {contributions} {t("home.guides.contribs")}
          </span>
        </div>
      </div>
    </Link>
  );
}
