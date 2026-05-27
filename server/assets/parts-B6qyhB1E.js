import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/parts.tsx
var $$splitComponentImporter = () => import("./parts-5xAImgd1.js");
var partsSearchSchema = z.object({
	category: z.enum([
		"engine",
		"transmission",
		"suspension",
		"electrical",
		"brakes",
		"tires",
		"body"
	]).optional(),
	search: z.string().optional(),
	motor: z.enum([
		"F8",
		"R2",
		"ambos"
	]).optional(),
	status: z.enum([
		"verified",
		"mod",
		"unverified"
	]).optional()
});
var Route = createFileRoute("/parts")({
	validateSearch: (search) => partsSearchSchema.parse(search),
	head: () => ({
		meta: [
			{ title: "Catálogo de Piezas y Repuestos — Asia Rocsta Archive" },
			{
				name: "description",
				content: "Encuentra referencias OEM, equivalencias de la gama Mazda (B2200, 626), medidas y compatibilidad de piezas para reparar tu Asia Rocsta."
			},
			{
				property: "og:title",
				content: "Catálogo de Piezas — Asia Rocsta Archive"
			},
			{
				property: "og:url",
				content: "/parts"
			}
		],
		links: [{
			rel: "canonical",
			href: "/parts"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
