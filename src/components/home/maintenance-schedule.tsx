import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

type Motor = "F8" | "R2";

type Row = {
  itemKey: string;
  interval: string;
  motors: Motor[];
  critical?: boolean;
};

const ROWS: Row[] = [
  { itemKey: "maint.oil", interval: "5.000 km", motors: ["F8", "R2"] },
  { itemKey: "maint.oilFilter", interval: "5.000 km", motors: ["F8", "R2"] },
  { itemKey: "maint.airFilter", interval: "20.000 km", motors: ["F8", "R2"] },
  { itemKey: "maint.fuelFilter", interval: "20.000 km", motors: ["R2"] },
  { itemKey: "maint.timingBelt", interval: "80.000 km", motors: ["R2"], critical: true },
  { itemKey: "maint.coolant", interval: "40.000 km / 2 " , motors: ["F8", "R2"] },
  { itemKey: "maint.gearbox", interval: "40.000 km", motors: ["F8", "R2"] },
  { itemKey: "maint.diff", interval: "40.000 km", motors: ["F8", "R2"] },
  { itemKey: "maint.grease", interval: "10.000 km", motors: ["F8", "R2"] },
  { itemKey: "maint.brakeFluid", interval: "2 ", motors: ["F8", "R2"] },
  { itemKey: "maint.spark", interval: "30.000 km", motors: ["F8"] },
];

export function MaintenanceSchedule() {
  const { t } = useLanguage();
  const [motor, setMotor] = useState<"all" | Motor>("all");

  const rows = ROWS.filter((r) => motor === "all" || r.motors.includes(motor));

  return (
    <section className="mb-12">
      <div className="mb-6 flex items-end justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t("home.maint.title")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("home.maint.desc")}</p>
        </div>
        <div className="inline-flex rounded-md border border-border bg-card p-1 text-xs font-bold">
          {(["all", "F8", "R2"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMotor(m)}
              className={[
                "px-3 py-1.5 rounded transition-colors",
                motor === m
                  ? "bg-rocsta-green text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {m === "all" ? t("home.maint.all") : m}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-muted/65 border-b border-border">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("home.maint.item")}
                </th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("home.maint.interval")}
                </th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {t("home.maint.motor")}
                </th>
                <th className="px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right">
                  {t("home.maint.severity")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {rows.map((r) => (
                <tr key={r.itemKey} className="hover:bg-muted/40 transition-colors">
                  <td className="px-6 py-3 text-sm font-semibold text-foreground">
                    {t(r.itemKey)}
                  </td>
                  <td className="px-6 py-3 font-mono text-xs font-bold text-foreground">
                    {r.interval}
                    {r.interval.endsWith(" ") && t("home.maint.years")}
                  </td>
                  <td className="px-6 py-3 text-xs font-mono font-bold text-muted-foreground">
                    {r.motors.join(" · ")}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {r.critical ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:text-red-400">
                        <AlertTriangle className="size-3" /> {t("home.maint.critical")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-[11px] font-bold text-green-700 dark:text-green-400">
                        {t("home.maint.routine")}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
