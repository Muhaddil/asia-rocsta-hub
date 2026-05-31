import { Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Moon,
  Sun,
  Menu,
  Wrench,
  GitCompare,
  BookOpen,
  AlertTriangle,
  FileText,
  Sparkles,
  Home,
  Users,
} from "lucide-react";
import { useTheme } from "./theme-provider";
import { useState, useEffect, useMemo } from "react";
import { globalSearch } from "@/data/search";
import type { SearchResult } from "@/data/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useLanguage, type Language } from "@/components/language-provider";

const SUGGESTED_SEARCHES: { term: Record<Language, string>; typeKey: string }[] = [
  { term: { es: "Bomba inyectora", en: "Injection pump" }, typeKey: "header.badgeSwap" },
  { term: { es: "Correa de distribución", en: "Timing belt" }, typeKey: "header.badgeGuide" },
  { term: { es: "Pastillas de freno", en: "Brake pads" }, typeKey: "header.badgePart" },
  { term: { es: "Caja de dirección", en: "Steering box" }, typeKey: "header.badgeIssue" },
];

const MOBILE_CATEGORIES = (t: (key: string) => string) => [
  { label: t("cat.engine"), to: "/parts" as const, tag: "engine" as const },
  { label: t("cat.transmission"), to: "/parts" as const, tag: "transmission" as const },
  { label: t("cat.suspension"), to: "/parts" as const, tag: "suspension" as const },
  { label: t("cat.electrical"), to: "/parts" as const, tag: "electrical" as const },
  { label: t("cat.brakes"), to: "/parts" as const, tag: "brakes" as const },
  { label: t("cat.tires"), to: "/parts" as const, tag: "tires" as const },
];

export function SiteHeader() {
  const { resolved, setTheme } = useTheme();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const results = useMemo(() => {
    return globalSearch(query, language);
  }, [query, language]);

  const handleResultClick = (item: SearchResult) => {
    setSearchOpen(false);
    setQuery("");
    navigate({
      to: item.to,
      search: item.params,
    });
  };

  const getResultIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "part":
        return <Wrench className="size-4 text-green-500 shrink-0" />;
      case "compatibility":
        return <GitCompare className="size-4 text-blue-500 shrink-0" />;
      case "guide":
        return <BookOpen className="size-4 text-amber-500 shrink-0" />;
      case "problem":
        return <AlertTriangle className="size-4 text-red-500 shrink-0" />;
      case "manual":
        return <FileText className="size-4 text-purple-500 shrink-0" />;
    }
  };

  const getResultBadgeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "part":
        return t("header.badgePart");
      case "compatibility":
        return t("header.badgeSwap");
      case "guide":
        return t("header.badgeGuide");
      case "problem":
        return t("header.badgeIssue");
      case "manual":
        return t("header.badgeManual");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-6 xl:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-rocsta-green flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">AR</span>
              </div>
              <span className="text-lg font-bold tracking-tight uppercase">
                Rocsta<span className="text-rocsta-accent">Archive</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-4 xl:gap-6 text-sm font-medium text-muted-foreground whitespace-nowrap">
              <Link to="/parts" className="hover:text-foreground transition-colors">
                {t("nav.parts")}
              </Link>
              <Link to="/compatibility" className="hover:text-foreground transition-colors">
                {t("nav.compatibility")}
              </Link>
              <Link to="/guides" className="hover:text-foreground transition-colors">
                {t("nav.guides")}
              </Link>
              <Link to="/problems" className="hover:text-foreground transition-colors">
                {t("nav.problems")}
              </Link>
              <Link to="/manuals" className="hover:text-foreground transition-colors">
                {t("nav.manuals")}
              </Link>
              <Link to="/community" className="hover:text-foreground transition-colors">
                {t("nav.community")}
              </Link>
              <Link to="/about" className="hover:text-foreground transition-colors">
                {t("nav.about")}
              </Link>
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 xl:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="relative hidden lg:flex h-9 w-64 xl:w-72 items-center justify-between rounded-md border border-border bg-muted/50 px-3 text-xs text-muted-foreground hover:bg-muted/80 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Search className="size-4" /> {t("search.placeholder")}
              </span>
              <kbd className="inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-muted-foreground">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label={t("header.ariaSearch")}
              className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
            >
              <Search className="size-4" />
            </button>

            <button
              onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
              aria-label={t("header.ariaTheme")}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
            >
              {!mounted ? (
                <div className="size-4" />
              ) : resolved === "dark" ? (
                <Sun className="size-4" />
              ) : (
                <Moon className="size-4" />
              )}
            </button>

            <button
              onClick={() => setLanguage(language === "es" ? "en" : "es")}
              aria-label={language === "es" ? "Switch to English" : "Cambiar a Español"}
              className="h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors text-xs font-extrabold uppercase tracking-wider"
            >
              {language === "es" ? "EN" : "ES"}
            </button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors"
                  aria-label={t("header.ariaMenu")}
                >
                  <Menu className="size-4" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] bg-card border-border p-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <SheetHeader className="text-left pb-4 border-b border-border/60">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded bg-rocsta-green flex items-center justify-center text-primary-foreground font-bold text-xs">
                        AR
                      </div>
                      <span className="text-base font-bold uppercase tracking-tight">
                        Rocsta<span className="text-rocsta-accent">Archive</span>
                      </span>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-4">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {t("header.sections")}
                    </h3>
                    <div className="grid grid-cols-1 gap-2 text-sm font-semibold text-foreground pl-1">
                      <Link
                        to="/"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <Home className="size-4 text-rocsta-accent" /> {t("header.mobileHome")}
                      </Link>
                      <Link
                        to="/parts"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <Wrench className="size-4 text-rocsta-accent" /> {t("header.mobileParts")}
                      </Link>
                      <Link
                        to="/compatibility"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <GitCompare className="size-4 text-rocsta-accent" />{" "}
                        {t("header.mobileCompat")}
                      </Link>
                      <Link
                        to="/guides"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <BookOpen className="size-4 text-rocsta-accent" />{" "}
                        {t("header.mobileGuides")}
                      </Link>
                      <Link
                        to="/problems"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <AlertTriangle className="size-4 text-rocsta-accent" />{" "}
                        {t("header.mobileProblems")}
                      </Link>
                      <Link
                        to="/manuals"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <FileText className="size-4 text-rocsta-accent" />{" "}
                        {t("header.mobileManuals")}
                      </Link>
                      <Link
                        to="/community"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <Users className="size-4 text-rocsta-accent" />{" "}
                        {t("header.mobileCommunity")}
                      </Link>
                      <Link
                        to="/about"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors"
                      >
                        <FileText className="size-4 text-rocsta-accent" /> {t("header.mobileAbout")}
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      {t("header.systems")}
                    </h3>
                    <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground font-medium pl-1">
                      {MOBILE_CATEGORIES(t).map((cat, i) => (
                        <Link
                          key={i}
                          to={cat.to}
                          search={{ category: cat.tag as any }}
                          onClick={() => setMobileMenuOpen(false)}
                          className="py-1 hover:text-rocsta-green transition-colors"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-muted-foreground font-semibold text-center border-t border-border/40 pt-4">
                  Asia Rocsta Archive © {new Date().getFullYear()}
                  <div className="text-[9px] font-normal text-muted-foreground/60 mt-0.5">
                    {t("header.tagline")}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="p-0 max-w-xl border-border bg-card shadow-2xl overflow-hidden sm:rounded-2xl gap-0">
          <div className="flex items-center border-b border-border/80 px-4 py-3">
            <Search className="size-4.5 text-muted-foreground shrink-0" />
            <Input
              type="text"
              autoFocus
              placeholder={t("header.searchDialogPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="ml-3 h-8 w-full border-0 bg-transparent p-0 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus-visible:border-0 select-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-xs text-muted-foreground hover:text-foreground font-bold px-1.5 py-0.5 rounded bg-muted font-mono"
              >
                ESC
              </button>
            )}
          </div>

          <div className="max-h-[380px] overflow-y-auto py-2">
            {!query && (
              <div className="px-4 py-2 space-y-2">
                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="size-3 text-rocsta-accent" /> {t("search.suggested")}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {SUGGESTED_SEARCHES.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(s.term[language] || s.term["es"])}
                      className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-2.5 text-left text-xs hover:bg-muted/65 hover:border-rocsta-green/20 transition-all"
                    >
                      <span className="font-semibold text-foreground">
                        {s.term[language] || s.term["es"]}
                      </span>
                      <span className="text-[9px] font-bold uppercase text-muted-foreground">
                        {t(s.typeKey)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {query && (
              <div className="space-y-1 px-2">
                <div className="px-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {t("search.results")} ({results.length})
                </div>
                {results.length > 0 ? (
                  results.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleResultClick(item)}
                      className="w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-xs hover:bg-muted/50 transition-colors"
                    >
                      <div className="mt-0.5">{getResultIcon(item.type)}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-extrabold text-foreground truncate">
                            {item.title}
                          </span>
                          <span className="shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60">
                            {getResultBadgeLabel(item.type)}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {item.description}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    {t("search.noMatches")} "<strong className="text-foreground">{query}</strong>"
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border/70 bg-muted/40 px-4 py-2 text-[10px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">{t("search.info")}</span>
            <kbd className="font-mono text-[9px] px-1 py-0.5 rounded bg-muted border border-border/60">
              {t("search.esc")}
            </kbd>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
