import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";

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
          <a
            href="/about"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.about")}
          </a>
          <a
            href="/coming-soon"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.docs")}
          </a>
          <a
            href="/coming-soon"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.api")}
          </a>
          <a
            href="/community"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.contribute")}
          </a>
        </div>
      </div>
    </footer>
  );
}
