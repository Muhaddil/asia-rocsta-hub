import { AM102_TECH_DATA } from "@/data/manual/am102-techdata";
import { localize } from "@/data/types";
import { useLanguage } from "@/components/language-provider";
import { ExternalLink, Info, Table2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type MotorFilter = "all" | "F8" | "R2";

export function ManualTechData({
  motor,
  onMotorChange,
  onViewPage,
}: {
  motor: MotorFilter;
  onMotorChange: (m: MotorFilter) => void;
  onViewPage: (page: number) => void;
}) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-extrabold text-foreground flex items-center gap-2">
          <Table2 className="size-5 text-rocsta-green" /> {t("manual.tech.title")}
        </h2>
        <div className="inline-flex rounded-md border border-border bg-card p-1 text-xs font-bold">
          {(["all", "F8", "R2"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onMotorChange(m)}
              className={cn(
                "px-3 py-1.5 rounded transition-colors",
                motor === m
                  ? "bg-rocsta-green text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "all" ? t("manual.tech.all") : m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-rocsta-accent/20 bg-rocsta-accent/5 p-3.5 text-[11px] leading-relaxed text-muted-foreground">
        <Info className="size-4 text-rocsta-accent mt-0.5 shrink-0" />
        <p>{t("manual.tech.disclaimer")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {AM102_TECH_DATA.map((table) => {
          const columnCount = table.split ? (motor === "all" ? 3 : 2) : 2;
          return (
            <div
              key={table.id}
              className={cn(
                "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
                table.split && columnCount === 3 && "lg:col-span-2",
              )}
            >
              <div className="flex items-center justify-between gap-2 border-b border-border bg-muted/40 px-4 py-2.5">
                <h3 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                  {localize(table.title, language)}
                </h3>
                <button
                  type="button"
                  onClick={() => onViewPage(table.sourcePage)}
                  className="inline-flex items-center gap-1 rounded-md bg-card border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground hover:text-rocsta-green transition-colors"
                >
                  <ExternalLink className="size-3" /> {t("manual.tech.viewPage")}
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-border/60 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2">{t("manual.tech.item")}</th>
                      {table.split && motor !== "R2" && (
                        <th className="px-4 py-2 border-l border-border/40">R2 (diésel)</th>
                      )}
                      {table.split && motor !== "F8" && (
                        <th className="px-4 py-2 border-l border-border/40">F8 (gasolina)</th>
                      )}
                      {!table.split && (
                        <th className="px-4 py-2 border-l border-border/40">
                          {t("manual.tech.value")}
                        </th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {table.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-muted/40 transition-colors align-top">
                        <td className="px-4 py-2 text-xs font-bold text-foreground">
                          {localize(row.label, language)}
                        </td>
                        {table.split && motor !== "R2" && (
                          <td className="px-4 py-2 text-xs text-muted-foreground border-l border-border/40 font-mono">
                            {row.r2 || "—"}
                          </td>
                        )}
                        {table.split && motor !== "F8" && (
                          <td className="px-4 py-2 text-xs text-muted-foreground border-l border-border/40 font-mono">
                            {row.f8 || "—"}
                          </td>
                        )}
                        {!table.split && (
                          <td className="px-4 py-2 text-xs text-muted-foreground border-l border-border/40 font-mono">
                            {row.value || "—"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
