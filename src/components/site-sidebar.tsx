import { Link, useRouterState } from "@tanstack/react-router";
import { useMemo } from "react";
import { useLanguage } from "@/components/language-provider";

export function SiteSidebar() {
  const { t } = useLanguage();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });

  const SYSTEMS = [
    { label: t("cat.engine"), to: "/parts" as const, tag: "engine" as const },
    { label: t("cat.transmission"), to: "/parts" as const, tag: "transmission" as const },
    { label: t("cat.suspension"), to: "/parts" as const, tag: "suspension" as const },
    { label: t("cat.electrical"), to: "/parts" as const, tag: "electrical" as const },
    { label: t("cat.brakes"), to: "/parts" as const, tag: "brakes" as const },
    { label: t("cat.tires"), to: "/parts" as const, tag: "tires" as const },
  ];

  const COMMUNITY = [
    { label: t("comm.contrib"), to: "/community" as const, tab: "comp" as const },
    { label: t("comm.part"), to: "/community" as const, tab: "part" as const },
    { label: t("comm.guide"), to: "/community" as const, tab: "guide" as const },
    { label: t("comm.problem"), to: "/community" as const, tab: "problem" as const },
    { label: t("comm.bug"), to: "/community" as const, tab: "bug" as const },
    { label: t("comm.partwrong"), to: "/community" as const, tab: "partwrong" as const },
  ];

  const currentCategory = useMemo(() => {
    const params = new URLSearchParams(searchStr);
    return params.get("category") || undefined;
  }, [searchStr]);

  const currentTab = useMemo(() => {
    const params = new URLSearchParams(searchStr);
    return params.get("tab") || undefined;
  }, [searchStr]);

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("sidebar.systems")}
          </h3>
          <ul className="space-y-1 text-sm">
            {SYSTEMS.map((s) => {
              const active = pathname === s.to && currentCategory === s.tag;
              return (
                <li key={s.label}>
                  <Link
                    to={s.to}
                    search={{ category: s.tag }}
                    className={[
                      "block rounded-md px-3 py-2 transition-colors",
                      active
                        ? "text-rocsta-green bg-rocsta-green/5 font-semibold"
                        : "text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {s.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("sidebar.community")}
          </h3>
          <ul className="space-y-1 text-sm">
            {COMMUNITY.map((c) => {
              const active = pathname === c.to && currentTab === c.tab;
              return (
                <li key={c.label}>
                  <Link
                    to={c.to}
                    search={{ tab: c.tab }}
                    className={[
                      "block rounded-md px-3 py-2 transition-colors",
                      active
                        ? "text-rocsta-green bg-rocsta-green/5 font-semibold"
                        : "text-muted-foreground hover:bg-muted",
                    ].join(" ")}
                  >
                    {c.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h4 className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {t("sidebar.missingPart")}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed mb-3">
            {t("sidebar.missingPartDesc")}
          </p>
          <Link
            to="/community"
            className="inline-flex text-xs font-bold text-rocsta-green hover:underline"
          >
            {t("sidebar.contribute")}
          </Link>
        </div>
      </div>
    </aside>
  );
}
