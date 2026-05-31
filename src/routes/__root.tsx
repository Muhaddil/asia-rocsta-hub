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
import ogImage from "../assets/rocsta-hero.jpg";
const BASE = (import.meta as { env: Record<string, string> }).env?.BASE_URL || "/";
const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

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
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-rocsta-green px-6 py-3 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm"
            >
              {t("notFound.back")}
            </Link>
            <Link
              to="/parts"
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
      {
        name: "google-site-verification",
        content: "bzPq3iFrBUmU5sXmM9rQUqTjD9BGTs14nv_OppxH8E8",
      },
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
      { property: "og:image", content: ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: ogImage },
    ],
    links: [
      { rel: "canonical", href: `${SITE_URL}/` },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "manifest", href: `${BASE}manifest.json` },
      { rel: "icon", type: "image/svg+xml", href: `${BASE}favicon.svg` },
      { rel: "apple-touch-icon", href: `${BASE}favicon.svg` },
      { rel: "preload", as: "image", href: ogImage },
    ],
  }),
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var fl = document.createElement("link");
                fl.rel = "stylesheet";
                fl.href = "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap";
                fl.media = "print";
                fl.onload = function() { fl.media = "all"; };
                document.head.appendChild(fl);
              })();
            `,
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
          />
        </noscript>
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
          <div className="logo-box">
            <span>AR</span>
          </div>
          <div className="spinner" />
          {/* <div className="loading-text">Cargando...</div> */}
        </div>
        <LanguageProvider>
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
  const [ready, setReady] = useState(false);

  const TRANSITION_DELAY = 1000;
  const MIN_EXTRA_DELAY = 1000;
  const FONTS_TIMEOUT = 3000;

  useEffect(() => {
    let cancelled = false;
    const start = performance.now();

    const finishLoading = async () => {
      const fontTimeout = new Promise<void>((resolve) => setTimeout(resolve, FONTS_TIMEOUT));
      await Promise.race([document.fonts.ready, fontTimeout]);
      if (cancelled) return;

      await new Promise<void>((resolve) => {
        if ("requestIdleCallback" in window) {
          requestIdleCallback(() => resolve());
        } else {
          setTimeout(resolve, 0);
        }
      });
      if (cancelled) return;

      const elapsed = performance.now() - start;
      const remaining = Math.max(MIN_EXTRA_DELAY - elapsed, 0);

      setTimeout(() => {
        const el = document.getElementById("loading-overlay");
        if (el) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          setReady(true);
          setTimeout(() => el.remove(), TRANSITION_DELAY);
        } else {
          setReady(true);
        }
      }, remaining);
    };

    finishLoading();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{ opacity: ready ? 1 : 0, transition: `opacity ${TRANSITION_DELAY}ms ease-in-out` }}
    >
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

// function RootComponent() {
//   const { queryClient } = Route.useRouteContext();
//   const [ready, setReady] = useState(false);

//   useEffect(() => {
//     const el = document.getElementById("loading-overlay");
//     if (el) {
//       el.style.opacity = "0";
//       el.style.pointerEvents = "none";
//       setReady(true);
//       setTimeout(() => el.remove(), 350);
//     } else {
//       setReady(true);
//     }
//   }, []);

//   return (
//     <QueryClientProvider client={queryClient}>
//       <ThemeProvider>
//         <div
//           className="min-h-screen flex flex-col bg-background text-foreground"
//           style={{ opacity: ready ? 1 : 0, transition: "opacity 350ms ease-in-out" }}
//         >
//           <SiteHeader />
//           <div className="flex-1">
//             <Outlet />
//           </div>
//           <SiteFooter />
//         </div>
//       </ThemeProvider>
//     </QueryClientProvider>
//   );
// }
