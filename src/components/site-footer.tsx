import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { localePath } from "@/lib/locale-helpers";
import { CURRENT_VERSION } from "@/data/version";

export function SiteFooter() {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <footer className="border-t border-border bg-card mt-12">
      <div className="mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          © {mounted ? new Date().getFullYear() : 2026} Asia Rocsta Archive · {t("footer.tagline")}
        </div>
        <div className="flex items-center gap-6">
          <Link
            to={localePath("/about")}
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.about")}
          </Link>
          <Link
            to={localePath("/coming-soon")}
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.docs")}
          </Link>
          <Link
            to={localePath("/coming-soon")}
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.api")}
          </Link>
          <Link
            to={localePath("/community")}
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.contribute")}
          </Link>
        </div>
        <Link
          to={localePath("/changelog")}
          className="rounded border border-border/60 bg-muted/40 px-2 py-0.5 text-[11px] font-mono text-muted-foreground/70 hover:bg-muted/60"
        >
          v{CURRENT_VERSION}
        </Link>
      </div>
    </footer>
  );
}
