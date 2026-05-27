import { SiteSidebar } from "./site-sidebar";

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-[1800px] flex gap-8 px-6 py-10">
      <SiteSidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}

export function Crumbs({ items }: { items: { label: string; active?: boolean }[] }) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
      {items.map((c, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className={c.active ? "text-rocsta-green" : ""}>{c.label}</span>
          {i < items.length - 1 && <span>/</span>}
        </span>
      ))}
    </div>
  );
}
