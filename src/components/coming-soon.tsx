import { PageShell, Crumbs } from "@/components/page-shell";
import { Construction } from "lucide-react";

export function ComingSoon({
  crumb,
  title,
  description,
}: {
  crumb: string;
  title: string;
  description: string;
}) {
  return (
    <PageShell>
      <Crumbs items={[{ label: "Archivo" }, { label: crumb, active: true }]} />
      <h1 className="text-4xl font-extrabold tracking-tight text-foreground">{title}</h1>
      <p className="mt-3 text-lg text-muted-foreground max-w-2xl">{description}</p>

      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-rocsta-green/10 text-rocsta-green mb-4">
          <Construction className="size-6" />
        </div>
        <h2 className="text-xl font-bold">Sección en construcción</h2>
        <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
          Esta sección necesita la base de datos conectada para mostrar contenido real (piezas,
          manuales, comentarios, usuarios).
        </p>
      </div>
    </PageShell>
  );
}
