import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/problems.tsx
var $$splitComponentImporter = () => import("./problems-B_cegI4m.js");
var problemsSearchSchema = z.object({
	search: z.string().optional(),
	severity: z.enum([
		"critical",
		"warn",
		"info"
	]).optional(),
	motor: z.enum([
		"F8",
		"R2",
		"ambos"
	]).optional()
});
var Route = createFileRoute("/problems")({
	validateSearch: (search) => problemsSearchSchema.parse(search),
	head: () => ({
		meta: [
			{ title: "Problemas Comunes y Averías — Asia Rocsta Archive" },
			{
				name: "description",
				content: "Registro e historial de fallos mecánicos típicos del Asia Rocsta. Diagnóstico de averías, síntomas, causas, soluciones y costes estimados."
			},
			{
				property: "og:title",
				content: "Problemas Comunes — Asia Rocsta Archive"
			},
			{
				property: "og:url",
				content: "/problems"
			}
		],
		links: [{
			rel: "canonical",
			href: "/problems"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
