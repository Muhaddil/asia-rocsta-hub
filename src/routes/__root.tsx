import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { ThemeProvider } from "../components/theme-provider";
import { LanguageProvider, useLanguage } from "../components/language-provider";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";

function LangSync() {
  const { language } = useLanguage();
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);
  return null;
}

function NotFoundComponent() {
  const { t } = useLanguage();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-rocsta-accent mb-3">
          Error 404
        </p>
        <h1 className="text-4xl font-extrabold text-foreground tracking-tight">
          {t("notFound.title")}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{t("notFound.desc")}</p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-rocsta-green px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
          >
            {t("notFound.back")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useLanguage();
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
            href="/"
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Asia Rocsta Archive — Wiki técnica, piezas y guías" },
      {
        name: "description",
        content:
          "Plataforma de referencia para el Asia Rocsta: base de datos de piezas, equivalencias OEM, guías de reparación, manuales y comunidad de restauradores.",
      },
      { name: "author", content: "Asia Rocsta Archive" },
      { property: "og:title", content: "Asia Rocsta Archive" },
      {
        property: "og:description",
        content:
          "Wiki técnica + foro + base de datos mecánica dedicada exclusivamente al Asia Rocsta.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <HeadContent />
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
                  if (
                    stored === "light" ||
                    stored === "dark" ||
                    stored === "system"
                  ) {
                    theme = stored;
                  }
                  
                  const resolved = theme === "system" ? getSystem() : theme;
                  document.documentElement.classList.toggle("dark", resolved === "dark");
                } catch (e) {}
              })();
            `,
          }}
        />
        <style
          dangerouslySetInnerHTML={{
            __html: `
#loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background, #f7f8fa);
  color: var(--foreground, #1a1c2e);
  transition: opacity 0.35s ease;
}
.dark #loading-overlay {
  background: var(--background, #12131c);
  color: var(--foreground, #eceded);
}
#loading-overlay .logo-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--rocsta-green, #3e7a4e);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
#loading-overlay .logo-box span {
  color: var(--primary-foreground, #f7f8fa);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}
#loading-overlay .spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border, #d6d8e0);
  border-top-color: var(--rocsta-green, #3e7a4e);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }
#loading-overlay .loading-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--muted-foreground, #6b6f82);
  letter-spacing: 0.02em;
}
            `,
          }}
        />
      </head>
      <body>
        <div id="loading-overlay">
          <div className="logo-box"><span>AR</span></div>
          <div className="spinner" />
          {/* <div className="loading-text">Cargando...</div> */}
        </div>
        <LanguageProvider>
          <LangSync />
          {children}
        </LanguageProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [ready, setReady] = useState(false);

  const TRANSITION_DELAY = 1000;

  useEffect(() => {
    const start = performance.now();

    const MIN_EXTRA_DELAY = 1000;

    const finishLoading = async () => {
      await document.fonts.ready;

      await new Promise<void>((resolve) => {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => resolve());
        } else {
          setTimeout(resolve, 0);
        }
      });

      const elapsed = performance.now() - start;

      // Extra delay
      const remaining = Math.max(MIN_EXTRA_DELAY - elapsed, 0);

      setTimeout(() => {
        const el = document.getElementById("loading-overlay");

        if (el) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";

          setReady(true);

          setTimeout(() => {
            el.remove();
          }, TRANSITION_DELAY);
        } else {
          setReady(true);
        }
      }, remaining);
    };

    finishLoading();
  }, []);

  return (
    <div style={{ opacity: ready ? 1 : 0, transition: `opacity ${TRANSITION_DELAY}ms ease-in-out` }}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <SiteHeader />
            <div className="flex-1">
              <Outlet />
            </div>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </div>
  );
}
