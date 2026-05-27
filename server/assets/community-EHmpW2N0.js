import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { z } from "zod";
//#region src/routes/community.tsx
var $$splitComponentImporter = () => import("./community-BXLrjHLL.js");
var communitySearchSchema = z.object({ tab: z.enum([
	"comp",
	"part",
	"guide",
	"problem",
	"bug",
	"partwrong",
	"photo"
]).optional() });
var Route = createFileRoute("/community")({
	validateSearch: (search) => communitySearchSchema.parse(search),
	head: () => ({
		meta: [
			{ title: "Comunidad y Colaboración — Asia Rocsta Archive" },
			{
				name: "description",
				content: "Súmate a la comunidad mundial del Asia Rocsta. Aporta guías, códigos OEM o reporta equivalencias para que la base de datos crezca."
			},
			{
				property: "og:title",
				content: "Comunidad — Asia Rocsta Archive"
			},
			{
				property: "og:url",
				content: "/community"
			}
		],
		links: [{
			rel: "canonical",
			href: "/community"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
