import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/guides.tsx
var $$splitComponentImporter = () => import("./guides-DsUPIyxy.js");
var guidesSearchSchema = z.object({
	search: z.string().optional(),
	motor: z.enum([
		"F8",
		"R2",
		"ambos"
	]).optional(),
	level: z.enum([
		"Principiante",
		"Intermedio",
		"Avanzado"
	]).optional()
});
var Route = createFileRoute("/guides")({
	validateSearch: (search) => guidesSearchSchema.parse(search),
	head: () => ({
		meta: [
			{ title: "Guías y Tutoriales de Reparación — Asia Rocsta Archive" },
			{
				name: "description",
				content: "Manuales paso a paso con imágenes y herramientas necesarias para realizar el mantenimiento y reparar averías de tu Asia Rocsta."
			},
			{
				property: "og:title",
				content: "Guías Técnicas — Asia Rocsta Archive"
			},
			{
				property: "og:url",
				content: "/guides"
			}
		],
		links: [{
			rel: "canonical",
			href: "/guides"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
