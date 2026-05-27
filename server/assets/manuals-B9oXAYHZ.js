import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { n as manuals, t as Route } from "./manuals-hhxuwyUT.js";
import { t as localize } from "./types-CK3cC6px.js";
import { t as Input } from "./input-CdTd0dHn.js";
import { n as PageShell, t as Crumbs } from "./page-shell-BXSgiXDA.js";
import { t as Badge } from "./badge-CJVoSNqU.js";
import { useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BookOpen, Calendar, ExternalLink, FileDown, FileText, FilterX, Globe, Search } from "lucide-react";
import { z } from "zod";
//#region src/routes/manuals.tsx?tsr-split=component
z.object({
	search: z.string().optional(),
	type: z.enum([
		"workshop",
		"electrical",
		"catalog",
		"datasheet",
		"other"
	]).optional(),
	language: z.enum([
		"es",
		"en",
		"ko",
		"fr",
		"de"
	]).optional(),
	motor: z.enum([
		"F8",
		"R2",
		"ambos"
	]).optional()
});
function ManualsPage() {
	const { t, language } = useLanguage();
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const TYPE_LABELS = {
		workshop: t("manuals.type.workshop"),
		electrical: t("manuals.type.electrical"),
		catalog: t("manuals.type.catalog"),
		datasheet: t("manuals.type.datasheet"),
		other: t("manuals.filter.allTypesLabel")
	};
	const LANG_LABELS = {
		es: {
			label: t("manuals.lang.es"),
			flag: "🇪🇸"
		},
		en: {
			label: t("manuals.lang.en"),
			flag: "🇬🇧"
		},
		ko: {
			label: t("manuals.lang.ko"),
			flag: "🇰🇷"
		},
		fr: {
			label: t("manuals.lang.fr"),
			flag: "🇫🇷"
		},
		de: {
			label: t("manuals.lang.de"),
			flag: "🇩🇪"
		}
	};
	const updateSearch = (newParams) => {
		navigate({ search: (prev) => {
			const next = {
				...prev,
				...newParams
			};
			Object.keys(next).forEach((key) => {
				const k = key;
				if (next[k] === void 0 || next[k] === "") delete next[k];
			});
			return next;
		} });
	};
	const currentSearch = searchParams.search || "";
	const currentType = searchParams.type;
	const currentLanguage = searchParams.language;
	const currentMotor = searchParams.motor;
	const hasActiveFilters = Boolean(currentSearch || currentType || currentLanguage || currentMotor);
	const clearFilters = () => {
		navigate({ search: () => ({}) });
	};
	const filteredList = useMemo(() => {
		return manuals.filter((manual) => {
			if (currentType && manual.type !== currentType) return false;
			if (currentLanguage && manual.language !== currentLanguage) return false;
			if (currentMotor) {
				if (currentMotor === "F8" && manual.motor === "R2") return false;
				if (currentMotor === "R2" && manual.motor === "F8") return false;
			}
			if (currentSearch) {
				const query = currentSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const title = localize(manual.title, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const desc = localize(manual.description, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (!title.includes(query) && !desc.includes(query)) return false;
			}
			return true;
		});
	}, [
		currentSearch,
		currentType,
		currentLanguage,
		currentMotor,
		language
	]);
	return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(Crumbs, { items: [{ label: t("ui.archive") }, {
				label: t("nav.manuals"),
				active: true
			}] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
				className: "text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(BookOpen, { className: "size-8 text-rocsta-green" }),
					" ",
					t("manuals.title")
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-base text-muted-foreground max-w-3xl",
				children: t("manuals.desc")
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-4 shadow-sm space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative md:col-span-2",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								type: "text",
								placeholder: t("manuals.searchManualsPlaceholder"),
								value: currentSearch,
								onChange: (e) => updateSearch({ search: e.target.value }),
								className: "pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
							})]
						}),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentType || "",
							onChange: (e) => updateSearch({ type: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("manuals.filter.allTypesLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "workshop",
									children: t("manuals.labelWorkshop")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "electrical",
									children: t("manuals.labelElectrical")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "catalog",
									children: t("manuals.labelCatalog")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "datasheet",
									children: t("manuals.labelDatasheet")
								})
							]
						}) }),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentLanguage || "",
							onChange: (e) => updateSearch({ language: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("manuals.filter.allLangs")
								}),
								/* @__PURE__ */ jsxs("option", {
									value: "es",
									children: [t("manuals.lang.es"), " 🇪🇸"]
								}),
								/* @__PURE__ */ jsxs("option", {
									value: "en",
									children: [t("manuals.lang.en"), " 🇬🇧"]
								}),
								/* @__PURE__ */ jsxs("option", {
									value: "ko",
									children: [t("manuals.lang.ko"), " 🇰🇷"]
								}),
								/* @__PURE__ */ jsxs("option", {
									value: "fr",
									children: [t("manuals.lang.fr"), " 🇫🇷"]
								}),
								/* @__PURE__ */ jsxs("option", {
									value: "de",
									children: [t("manuals.lang.de"), " 🇩🇪"]
								})
							]
						}) })
					]
				}), hasActiveFilters && /* @__PURE__ */ jsxs("div", {
					className: "flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "flex flex-wrap items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ jsx("span", {
								className: "text-muted-foreground font-semibold",
								children: t("ui.filters")
							}),
							currentSearch && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: "font-mono",
								children: [
									t("ui.search"),
									": \"",
									currentSearch,
									"\""
								]
							}),
							currentType && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.type"),
									": ",
									TYPE_LABELS[currentType]
								]
							}),
							currentLanguage && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.language"),
									": ",
									LANG_LABELS[currentLanguage].label
								]
							})
						]
					}), /* @__PURE__ */ jsxs("button", {
						onClick: clearFilters,
						className: "inline-flex items-center gap-1 text-xs font-bold text-rocsta-accent hover:underline",
						children: [
							/* @__PURE__ */ jsx(FilterX, { className: "size-3" }),
							" ",
							t("ui.clearFilters")
						]
					})]
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "text-xs text-muted-foreground",
				children: t("manuals.libraryCount", { count: filteredList.length })
			}),
			filteredList.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-6",
				children: filteredList.map((man) => {
					const lang = LANG_LABELS[man.language];
					return /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-5 shadow-sm hover:border-rocsta-green/30 hover:shadow-md transition-all flex flex-col justify-between",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-bold text-muted-foreground uppercase font-mono tracking-wider",
										children: [
											t("manuals.idLabel"),
											": ",
											man.id
										]
									}), /* @__PURE__ */ jsx(Badge, {
										variant: "secondary",
										className: [
											"text-[9px] font-bold uppercase py-0.5 px-2",
											man.type === "workshop" && "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/10",
											man.type === "electrical" && "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/10",
											man.type === "catalog" && "bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/10",
											man.type === "datasheet" && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/10"
										].filter(Boolean).join(" "),
										children: TYPE_LABELS[man.type]
									})]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-extrabold text-base text-foreground leading-snug",
									children: localize(man.title, language)
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: localize(man.description, language)
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-x-4 gap-y-2 pt-2 text-xs text-muted-foreground font-semibold",
									children: [
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ jsx(Globe, { className: "size-3.5 text-rocsta-accent" }),
												" ",
												lang.flag,
												" ",
												lang.label
											]
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1 font-mono",
											children: [
												/* @__PURE__ */ jsx(FileText, { className: "size-3.5 text-rocsta-accent" }),
												" ",
												man.pages,
												" ",
												t("manuals.pages"),
												" (",
												man.format.toUpperCase(),
												")"
											]
										}),
										man.year && /* @__PURE__ */ jsxs("span", {
											className: "flex items-center gap-1 font-mono",
											children: [
												/* @__PURE__ */ jsx(Calendar, { className: "size-3.5 text-rocsta-accent" }),
												" ",
												t("manuals.year"),
												":",
												" ",
												man.year
											]
										})
									]
								})
							]
						}), /* @__PURE__ */ jsxs("div", {
							className: "pt-4 border-t border-border/20 mt-4 flex items-center justify-between",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "text-[10px] text-muted-foreground font-bold uppercase",
								children: [
									t("manuals.engineLabel"),
									":",
									" ",
									man.motor === "ambos" ? t("manuals.bothEngines") : man.motor
								]
							}), /* @__PURE__ */ jsxs("a", {
								href: man.url,
								target: "_blank",
								rel: "noopener noreferrer",
								className: "inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-rocsta-green/10 hover:bg-rocsta-green px-4 text-xs font-bold text-rocsta-green hover:text-white transition-all shadow-sm",
								children: [
									/* @__PURE__ */ jsx(FileDown, { className: "size-3.5" }),
									" ",
									t("manuals.card.download"),
									" ",
									/* @__PURE__ */ jsx(ExternalLink, { className: "size-3 stroke-[1.5]" })
								]
							})]
						})]
					}, man.id);
				})
			}) : /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-12 text-center shadow-sm",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3",
						children: /* @__PURE__ */ jsx(FilterX, { className: "size-6" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-foreground",
						children: t("manuals.noResults")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground max-w-xs mx-auto",
						children: t("manuals.noResultsDesc")
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: clearFilters,
						className: "mt-4 inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all",
						children: t("ui.resetFilters")
					})
				]
			})
		]
	}) });
}
//#endregion
export { ManualsPage as component };
