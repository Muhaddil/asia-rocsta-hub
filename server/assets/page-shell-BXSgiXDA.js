import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
//#region src/components/site-sidebar.tsx
function SiteSidebar() {
	const { t } = useLanguage();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const searchStr = useRouterState({ select: (s) => s.location.searchStr });
	const SYSTEMS = [
		{
			label: t("cat.engine"),
			to: "/parts",
			tag: "engine"
		},
		{
			label: t("cat.transmission"),
			to: "/parts",
			tag: "transmission"
		},
		{
			label: t("cat.suspension"),
			to: "/parts",
			tag: "suspension"
		},
		{
			label: t("cat.electrical"),
			to: "/parts",
			tag: "electrical"
		},
		{
			label: t("cat.brakes"),
			to: "/parts",
			tag: "brakes"
		},
		{
			label: t("cat.tires"),
			to: "/parts",
			tag: "tires"
		}
	];
	const COMMUNITY = [
		{
			label: t("comm.contrib"),
			to: "/community",
			tab: "comp"
		},
		{
			label: t("comm.part"),
			to: "/community",
			tab: "part"
		},
		{
			label: t("comm.guide"),
			to: "/community",
			tab: "guide"
		},
		{
			label: t("comm.problem"),
			to: "/community",
			tab: "problem"
		},
		{
			label: t("comm.bug"),
			to: "/community",
			tab: "bug"
		},
		{
			label: t("comm.partwrong"),
			to: "/community",
			tab: "partwrong"
		}
	];
	const currentCategory = useMemo(() => {
		return new URLSearchParams(searchStr).get("category") || void 0;
	}, [searchStr]);
	const currentTab = useMemo(() => {
		return new URLSearchParams(searchStr).get("tab") || void 0;
	}, [searchStr]);
	return /* @__PURE__ */ jsx("aside", {
		className: "hidden lg:block w-64 shrink-0",
		children: /* @__PURE__ */ jsxs("div", {
			className: "sticky top-24 space-y-8",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground",
					children: t("sidebar.systems")
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-1 text-sm",
					children: SYSTEMS.map((s) => {
						const active = pathname === s.to && currentCategory === s.tag;
						return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: s.to,
							search: { category: s.tag },
							className: ["block rounded-md px-3 py-2 transition-colors", active ? "text-rocsta-green bg-rocsta-green/5 font-semibold" : "text-muted-foreground hover:bg-muted"].join(" "),
							children: s.label
						}) }, s.label);
					})
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h3", {
					className: "mb-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground",
					children: t("sidebar.community")
				}), /* @__PURE__ */ jsx("ul", {
					className: "space-y-1 text-sm",
					children: COMMUNITY.map((c) => {
						const active = pathname === c.to && currentTab === c.tab;
						return /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: c.to,
							search: { tab: c.tab },
							className: ["block rounded-md px-3 py-2 transition-colors", active ? "text-rocsta-green bg-rocsta-green/5 font-semibold" : "text-muted-foreground hover:bg-muted"].join(" "),
							children: c.label
						}) }, c.label);
					})
				})] }),
				/* @__PURE__ */ jsxs("div", {
					className: "rounded-lg border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ jsx("h4", {
							className: "mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground",
							children: t("sidebar.missingPart")
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground leading-relaxed mb-3",
							children: t("sidebar.missingPartDesc")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/community",
							className: "inline-flex text-xs font-bold text-rocsta-green hover:underline",
							children: t("sidebar.contribute")
						})
					]
				})
			]
		})
	});
}
//#endregion
//#region src/components/page-shell.tsx
function PageShell({ children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "mx-auto max-w-[1800px] flex gap-8 px-6 py-10",
		children: [/* @__PURE__ */ jsx(SiteSidebar, {}), /* @__PURE__ */ jsx("main", {
			className: "min-w-0 flex-1 overflow-x-hidden",
			children
		})]
	});
}
function Crumbs({ items }) {
	return /* @__PURE__ */ jsx("div", {
		className: "mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground",
		children: items.map((c, i) => /* @__PURE__ */ jsxs("span", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ jsx("span", {
				className: c.active ? "text-rocsta-green" : "",
				children: c.label
			}), i < items.length - 1 && /* @__PURE__ */ jsx("span", { children: "/" })]
		}, i))
	});
}
//#endregion
export { PageShell as n, Crumbs as t };
