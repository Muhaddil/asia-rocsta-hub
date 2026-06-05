import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Cog, GitBranch, CircleDot, Disc, Zap, Box } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { PartCategory } from "@/data/types";
import { localePath } from "@/lib/locale-helpers";
import rocstaBlueprint from "@/assets/rocsta-hero.jpg";

type Hotspot = {
  id: string;
  labelKey: string;
  category: PartCategory;
  x: number;
  y: number;
  icon: React.ComponentType<{ className?: string }>;
};

const HOTSPOTS: Hotspot[] = [
  { id: "engine", labelKey: "cat.engine", category: "engine", x: 168, y: 158, icon: Cog },
  {
    id: "electrical",
    labelKey: "cat.electrical",
    category: "electrical",
    x: 80,
    y: 202,
    icon: Zap,
  },
  {
    id: "transmission",
    labelKey: "cat.transmission",
    category: "transmission",
    x: 302,
    y: 248,
    icon: GitBranch,
  },
  {
    id: "suspension",
    labelKey: "cat.suspension",
    category: "suspension",
    x: 190,
    y: 208,
    icon: CircleDot,
  },
  { id: "brakes", labelKey: "cat.brakes", category: "brakes", x: 532, y: 271, icon: Disc },
  { id: "body", labelKey: "cat.body", category: "body", x: 410, y: 92, icon: Box },
];

export function SystemDiagram() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [hovered, setHovered] = useState<string | null>(null);

  const go = (category: PartCategory) =>
    navigate({ to: localePath("/parts") as "/{-$locale}/parts", search: { category } });

  return (
    <section className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight">{t("home.diagram.title")}</h2>
        <p className="text-sm text-muted-foreground mt-1">{t("home.diagram.desc")}</p>
      </div>

      <div className="hidden sm:block rounded-2xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="relative w-full">
          <svg
            viewBox="0 0 700 380"
            className="w-full h-auto"
            role="img"
            aria-label={t("home.diagram.title")}
          >
            <image
              href={rocstaBlueprint}
              x="0"
              y="0"
              width="700"
              height="380"
              preserveAspectRatio="xMidYMid meet"
            />

            {HOTSPOTS.map((h) => {
              const active = hovered === h.id;
              const labelWidth = t(h.labelKey).length * 6.8 + 20;
              const tooltipX = h.x + 14 + labelWidth > 700 ? h.x - labelWidth - 14 : h.x + 14;

              return (
                <g
                  key={h.id}
                  onMouseEnter={() => setHovered(h.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => go(h.category)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") go(h.category);
                  }}
                  role="link"
                  tabIndex={0}
                  aria-label={`${t("home.diagram.title")}: ${t(h.labelKey)}`}
                  className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-rocsta-green focus:ring-offset-2 rounded-lg"
                >
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r={active ? 20 : 14}
                    className="fill-rocsta-green/25 transition-all duration-150"
                  />
                  <circle
                    cx={h.x}
                    cy={h.y}
                    r="7"
                    className="fill-rocsta-green stroke-white stroke-[1.5]"
                  />
                  {active && (
                    <g>
                      <rect
                        x={tooltipX}
                        y={h.y - 24}
                        width={labelWidth}
                        height="22"
                        rx="5"
                        className="fill-rocsta-dark"
                        opacity="0.92"
                      />
                      <text
                        x={tooltipX + 10}
                        y={h.y - 9}
                        className="fill-white font-bold"
                        fontSize="11"
                      >
                        {t(h.labelKey)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
        <p className="py-3 text-[11px] text-muted-foreground text-center font-mono uppercase tracking-widest border-t border-border">
          {t("home.diagram.hint")}
        </p>
      </div>

      <div className="sm:hidden grid grid-cols-2 gap-3">
        {HOTSPOTS.map((h) => (
          <button
            key={h.id}
            onClick={() => go(h.category)}
            className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:border-rocsta-green/40 transition-colors"
          >
            <div className="h-9 w-9 rounded-md bg-rocsta-green/10 flex items-center justify-center text-rocsta-green shrink-0">
              <h.icon className="size-4" />
            </div>
            <span className="text-xs font-extrabold leading-tight text-foreground">
              {t(h.labelKey)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
