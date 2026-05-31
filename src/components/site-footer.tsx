import { useLanguage } from "@/components/language-provider";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";

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
            to="/about"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/coming-soon"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.docs")}
          </Link>
          <Link
            to="/coming-soon"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.api")}
          </Link>
          <Link
            to="/community"
            className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            {t("footer.contribute")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
