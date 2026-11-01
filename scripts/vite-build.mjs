// Ejecuta el build completo de Vite (cliente + SSR + prerender) mediante su
// builder API y fuerza una salida limpia. El CLI de `vite build` puede quedarse
// vivo tras el prerender en Windows (proceso sin CPU y sin handles de red),
// impidiendo que se ejecute el paso siguiente del script `build`.
import { createBuilder } from "vite";

try {
  const builder = await createBuilder();
  await builder.buildApp();
} catch (err) {
  console.error(err);
  process.exit(1);
}

// Deja que se vacíen los buffers de stdout/stderr antes de salir.
await new Promise((resolve) => setTimeout(resolve, 250));
process.exit(0);
