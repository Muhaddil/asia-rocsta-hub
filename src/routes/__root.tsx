import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  redirect,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "../components/theme-provider";
import { LanguageProvider, useLanguage, type Language } from "../components/language-provider";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { UpdateBanner } from "../components/update-banner";
import { getMetaTranslation, getInitialLanguage } from "../lib/meta-translations";
import { getAlternateHrefs } from "../lib/i18n-routing";
import ogImage from "../assets/rocsta-hero.jpg";
import { absoluteUrl } from "../lib/site";
import { localePath } from "@/lib/locale-helpers";

const BASE = (import.meta as { env: Record<string, string> }).env?.BASE_URL || "/";
const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

function LangSync() {
  const { language, setLanguage } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /* Sync language context when URL locale changes (SPA navigation) */
  useEffect(() => {
    const m = pathname.match(/^\/(es|en)\b/);
    if (m) {
      const urlLang = m[1] as Language;
      if (urlLang !== language) {
        setLanguage(urlLang);
      }
    }
  }, [pathname, language, setLanguage]);

  return null;
}

function NotFoundComponent() {
  const { t, language } = useLanguage();
  return (
    <div className="mx-auto max-w-[1800px] flex gap-8 px-6 py-10">
      <main id="main-content" className="min-w-0 flex-1 overflow-x-hidden">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>{t("ui.archive")}</span>
          <span>/</span>
          <span className="text-rocsta-green font-semibold">404</span>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="rounded-2xl bg-rocsta-dark p-6 mb-6">
            <span className="font-mono text-5xl font-extrabold text-white">404</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            {t("notFound.title")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground max-w-md">{t("notFound.desc")}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to={localePath("/", language)}
              className="inline-flex items-center justify-center rounded-xl bg-rocsta-green px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
            >
              {t("notFound.back")}
            </Link>
            <Link
              to={localePath("/parts", language)}
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-all"
            >
              {t("home.quick.parts")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  const { t, language } = useLanguage();
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{t("error.title")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("error.desc")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-rocsta-green px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            {t("error.retry")}
          </button>
          <a
            href={localePath("/", language)}
            className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            {t("nav.home")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  beforeLoad: ({ location }) => {
    const legacy = location.pathname.match(/^\/(?:fr|pt|de)(\/.*)?$/);
    if (legacy) {
      throw redirect({ to: `/en${legacy[1] || "/"}` as "/{-$locale}/", replace: true });
    }
  },
  head: ({ matches }) => {
    const lang = getInitialLanguage(matches[matches.length - 1]?.pathname);
    return {
      meta: [
        { charSet: "utf-8" },
        {
          name: "google-site-verification",
          content: "bzPq3iFrBUmU5sXmM9rQUqTjD9BGTs14nv_OppxH8E8",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { title: getMetaTranslation("meta.root.title", lang) },
        {
          name: "description",
          content: getMetaTranslation("meta.root.description", lang),
        },
        { name: "author", content: "Asia Rocsta Archive" },
        { name: "theme-color", content: "#3e7a4e" },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: getMetaTranslation("meta.root.ogTitle", lang) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.root.ogDescription", lang),
        },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Asia Rocsta Archive" },
        { property: "og:locale", content: lang === "en" ? "en_US" : "es_ES" },
        {
          property: "og:locale:alternate",
          content: lang === "en" ? "es_ES" : "en_US",
        },
        { property: "og:image", content: absoluteUrl(ogImage) },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: absoluteUrl(ogImage) },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Asia Rocsta Archive",
            url: SITE_URL,
            description: getMetaTranslation("meta.root.description", lang),
            inLanguage: lang,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Asia Rocsta Archive",
            url: SITE_URL,
            description: getMetaTranslation("meta.root.ogDescription", lang),
          }),
        },
      ],
      links: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
        { rel: "preconnect", href: "https://asiarocstahub.dpdns.org" },
        { rel: "manifest", href: `${BASE}manifest.json` },
        { rel: "icon", type: "image/svg+xml", href: `${BASE}favicon.svg` },
        { rel: "icon", type: "image/png", sizes: "192x192", href: `${BASE}icons/icon-192.png` },
        { rel: "apple-touch-icon", sizes: "180x180", href: `${BASE}icons/apple-touch-icon.png` },
        ...getAlternateHrefs("/", SITE_URL).map((a) => ({
          rel: "alternate" as const,
          hrefLang: a.hreflang,
          href: a.href,
        })),
      ],
    };
  },
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function SkipToContent() {
  const { t } = useLanguage();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100000] focus:px-4 focus:py-2 focus:bg-rocsta-green focus:text-white focus:rounded-md focus:text-sm focus:font-bold focus:outline-none"
    >
      {t("home.content.main.jump")}
    </a>
  );
}

function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const initialLang = getInitialLanguage(pathname);
  return (
    <html lang={initialLang} suppressHydrationWarning>
      <head>
        <HeadContent />
        <link rel="stylesheet" href={appCss} />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const stored = localStorage.getItem("rocsta-theme");
                  const getSystem = function() {
                    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  };
                  let theme = "system";
                  if (stored === "light" || stored === "dark" || stored === "system") {
                    theme = stored;
                  }
                  const resolved = theme === "system" ? getSystem() : theme;
                  document.documentElement.classList.toggle("dark", resolved === "dark");
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <LanguageProvider initialLanguage={initialLang}>
          <LangSync />
          <SkipToContent />
          {children}
        </LanguageProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker.register("${BASE}sw.js").catch(() => {});
                });
              }
            `,
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <UpdateBanner />
          <SiteHeader />
          <div className="flex-1">
            <Outlet />
          </div>
          <SiteFooter />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
