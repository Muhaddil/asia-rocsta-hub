import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { t as guides } from "./guides-DNGOFuzs.js";
import { t as localize } from "./types-CK3cC6px.js";
import { n as cn, t as Input } from "./input-CdTd0dHn.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-nSNR3NZm.js";
import { t as Route } from "./guides-B1i8fSnO.js";
import { n as PageShell, t as Crumbs } from "./page-shell-BXSgiXDA.js";
import { t as api } from "./api-ClaFnBZV.js";
import { t as Badge } from "./badge-CJVoSNqU.js";
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { BookOpen, ChevronDown, Clock, FilterX, Info, Layers, Search, Sparkles, Wrench } from "lucide-react";
import { z } from "zod";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
//#region src/components/ui/accordion.tsx
var Accordion = AccordionPrimitive.Root;
var AccordionItem = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Item, {
	ref,
	className: cn("border-b", className),
	...props
}));
AccordionItem.displayName = "AccordionItem";
var AccordionTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Header, {
	className: "flex",
	children: /* @__PURE__ */ jsxs(AccordionPrimitive.Trigger, {
		ref,
		className: cn("flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180", className),
		...props,
		children: [children, /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })]
	})
}));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
var AccordionContent = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx(AccordionPrimitive.Content, {
	ref,
	className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
	...props,
	children: /* @__PURE__ */ jsx("div", {
		className: cn("pb-4 pt-0", className),
		children
	})
}));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;
//#endregion
//#region src/routes/guides.tsx?tsr-split=component
z.object({
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
var LEVEL_KEYS = {
	Principiante: "guides.level.beginner",
	Intermedio: "guides.level.intermediate",
	Avanzado: "guides.level.advanced"
};
function GuidesPage() {
	const { t, language } = useLanguage();
	const CATEGORY_LABELS = {
		engine: t("cat.engine"),
		transmission: t("cat.transmission"),
		suspension: t("cat.suspension"),
		electrical: t("cat.electrical"),
		brakes: t("cat.brakes"),
		tires: t("cat.tires"),
		body: t("cat.body")
	};
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const [selectedGuide, setSelectedGuide] = useState(null);
	const [guides$1, setGuides] = useState(guides);
	useEffect(() => {
		api.getGuides().then((data) => {
			setGuides(data);
		}).catch(() => {});
	}, []);
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
	const currentMotor = searchParams.motor;
	const currentLevel = searchParams.level;
	const hasActiveFilters = Boolean(currentSearch || currentMotor || currentLevel);
	const clearFilters = () => {
		navigate({ search: () => ({}) });
	};
	const filteredList = useMemo(() => {
		return guides$1.filter((guide) => {
			if (currentMotor) {
				if (currentMotor === "F8" && guide.motor === "R2") return false;
				if (currentMotor === "R2" && guide.motor === "F8") return false;
			}
			if (currentLevel && guide.level !== currentLevel) return false;
			if (currentSearch) {
				const query = currentSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const title = localize(guide.title, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const desc = localize(guide.description, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const tools = guide.tools.map((t) => localize(t, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
				const tags = guide.tags.map((t) => t.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
				if (!title.includes(query) && !desc.includes(query) && !tools.some((t) => t.includes(query)) && !tags.some((t) => t.includes(query))) return false;
			}
			return true;
		});
	}, [
		currentSearch,
		currentMotor,
		currentLevel,
		language
	]);
	return /* @__PURE__ */ jsxs(PageShell, { children: [/* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(Crumbs, { items: [{ label: t("ui.archive") }, {
				label: t("nav.guides"),
				active: true
			}] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
				className: "text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(BookOpen, { className: "size-8 text-rocsta-green" }),
					" ",
					t("guides.title")
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-base text-muted-foreground max-w-3xl",
				children: t("guides.desc")
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-4 shadow-sm space-y-4",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "relative",
							children: [/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }), /* @__PURE__ */ jsx(Input, {
								type: "text",
								placeholder: t("guides.searchGuidesPlaceholder"),
								value: currentSearch,
								onChange: (e) => updateSearch({ search: e.target.value }),
								className: "pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
							})]
						}),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentMotor || "",
							onChange: (e) => updateSearch({ motor: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("guides.filter.allMotorsLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "F8",
									children: t("guides.filter.motorF8")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "R2",
									children: t("guides.filter.motorR2")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "ambos",
									children: t("guides.filter.motorBoth")
								})
							]
						}) }),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentLevel || "",
							onChange: (e) => updateSearch({ level: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("guides.filter.allLevelsLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Principiante",
									children: t("guides.level.beginner")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Intermedio",
									children: t("guides.level.intermediate")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "Avanzado",
									children: t("guides.level.advanced")
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
							currentMotor && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.motor"),
									":",
									" ",
									currentMotor === "F8" ? t("guides.filter.motorF8") : currentMotor === "R2" ? t("guides.filter.motorR2") : t("guides.filter.motorBoth")
								]
							}),
							currentLevel && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.difficulty"),
									": ",
									t(LEVEL_KEYS[currentLevel])
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
				children: t("guides.resultsFound", { count: filteredList.length })
			}),
			filteredList.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				children: filteredList.map((guide) => /* @__PURE__ */ jsxs("article", {
					onClick: () => setSelectedGuide(guide),
					className: "group cursor-pointer overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-rocsta-green/40 hover:shadow-md flex flex-col justify-between",
					children: [/* @__PURE__ */ jsxs("div", { children: [guide.image ? /* @__PURE__ */ jsx("div", {
						className: "aspect-video bg-muted overflow-hidden relative",
						children: /* @__PURE__ */ jsx("img", {
							src: guide.image,
							alt: localize(guide.title, language),
							className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
							loading: "lazy"
						})
					}) : /* @__PURE__ */ jsx("div", {
						className: "aspect-video bg-muted/65 flex items-center justify-center border-b border-border/40 text-muted-foreground",
						children: /* @__PURE__ */ jsx(BookOpen, { className: "size-10 stroke-[1.2]" })
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-5 space-y-3",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ jsx(Badge, {
									variant: "secondary",
									className: [
										"text-[9px] font-bold uppercase px-2 py-0.5",
										guide.level === "Principiante" && "bg-green-500/10 text-green-700 dark:text-green-400",
										guide.level === "Intermedio" && "bg-amber-500/10 text-amber-700 dark:text-amber-400",
										guide.level === "Avanzado" && "bg-red-500/10 text-red-700 dark:text-red-400"
									].join(" "),
									children: t(LEVEL_KEYS[guide.level])
								}), /* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase font-mono flex items-center gap-0.5",
									children: [
										/* @__PURE__ */ jsx(Clock, { className: "size-3" }),
										" ",
										guide.time
									]
								})]
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "font-extrabold text-base text-foreground leading-snug group-hover:text-rocsta-green transition-colors",
								children: localize(guide.title, language)
							}),
							/* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground leading-relaxed line-clamp-3",
								children: localize(guide.description, language)
							})
						]
					})] }), /* @__PURE__ */ jsxs("div", {
						className: "p-5 pt-0 border-t border-border/20 mt-3 flex items-center justify-between text-[10px] text-muted-foreground font-semibold",
						children: [/* @__PURE__ */ jsx("span", {
							className: "font-mono uppercase",
							children: CATEGORY_LABELS[guide.category]
						}), /* @__PURE__ */ jsxs("span", { children: [
							guide.contributions,
							" ",
							t("guides.contributions")
						] })]
					})]
				}, guide.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-12 text-center shadow-sm",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3",
						children: /* @__PURE__ */ jsx(FilterX, { className: "size-6" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-foreground",
						children: t("guides.noResults")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground max-w-xs mx-auto",
						children: t("guides.noResultsDesc")
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: clearFilters,
						className: "mt-4 inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all",
						children: t("ui.resetFilters")
					})
				]
			})
		]
	}), /* @__PURE__ */ jsx(Dialog, {
		open: selectedGuide !== null,
		onOpenChange: (open) => !open && setSelectedGuide(null),
		children: selectedGuide && /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-2xl sm:rounded-2xl border-border bg-card max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, {
					className: "pb-4 border-b border-border",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 mb-2",
							children: [
								/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "text-[10px] font-bold uppercase bg-muted/40 font-mono",
									children: CATEGORY_LABELS[selectedGuide.category]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground/60",
									children: "•"
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: [
										"text-[10px] font-bold uppercase py-0.5",
										selectedGuide.level === "Principiante" && "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400",
										selectedGuide.level === "Intermedio" && "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
										selectedGuide.level === "Avanzado" && "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400"
									].join(" "),
									children: t(LEVEL_KEYS[selectedGuide.level])
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground/60",
									children: "•"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase font-mono flex items-center gap-0.5",
									children: [
										/* @__PURE__ */ jsx(Clock, { className: "size-3" }),
										" ",
										t("guides.dialog.time"),
										": ",
										selectedGuide.time
									]
								})
							]
						}),
						/* @__PURE__ */ jsx(DialogTitle, {
							className: "text-2xl font-extrabold tracking-tight text-foreground text-pretty",
							children: localize(selectedGuide.title, language)
						}),
						/* @__PURE__ */ jsx(DialogDescription, {
							className: "text-xs text-muted-foreground text-pretty mt-1 leading-relaxed",
							children: localize(selectedGuide.description, language)
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "py-4 space-y-6 text-sm",
					children: [
						selectedGuide.image && /* @__PURE__ */ jsx("div", {
							className: "overflow-hidden rounded-xl border border-border bg-muted",
							children: /* @__PURE__ */ jsx("img", {
								src: selectedGuide.image,
								alt: localize(selectedGuide.title, language),
								className: "w-full aspect-video object-cover"
							})
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "rounded-xl border border-rocsta-accent/15 bg-rocsta-accent/[0.01] p-4 space-y-2",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "text-xs font-bold text-foreground flex items-center gap-1.5 uppercase tracking-wider",
								children: [
									/* @__PURE__ */ jsx(Wrench, { className: "size-4 text-rocsta-accent" }),
									" ",
									t("guides.dialog.toolsLabel")
								]
							}), /* @__PURE__ */ jsx("ul", {
								className: "grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-1.5",
								children: selectedGuide.tools.map((tool, index) => /* @__PURE__ */ jsxs("li", {
									className: "text-xs text-muted-foreground flex items-start gap-2",
									children: [/* @__PURE__ */ jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-rocsta-accent mt-1.5 shrink-0" }), /* @__PURE__ */ jsx("span", { children: localize(tool, language) })]
								}, index))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5",
								children: [
									/* @__PURE__ */ jsx(Layers, { className: "size-4 text-rocsta-green" }),
									" ",
									t("guides.dialog.stepsLabel")
								]
							}), /* @__PURE__ */ jsx(Accordion, {
								type: "single",
								collapsible: true,
								className: "w-full space-y-2",
								children: selectedGuide.steps.map((step, index) => /* @__PURE__ */ jsxs(AccordionItem, {
									value: `step-${index}`,
									className: "border border-border rounded-lg bg-muted/20 px-4 overflow-hidden",
									children: [/* @__PURE__ */ jsx(AccordionTrigger, {
										className: "text-sm font-extrabold text-foreground py-3.5 hover:no-underline hover:text-rocsta-green transition-colors",
										children: localize(step.title, language)
									}), /* @__PURE__ */ jsx(AccordionContent, {
										className: "text-xs text-muted-foreground leading-relaxed pb-4 pt-1 whitespace-pre-line border-t border-border/40 text-pretty font-normal",
										children: localize(step.content, language)
									})]
								}, index))
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start gap-3 bg-muted/40 p-3 rounded-lg border border-border/60",
							children: [/* @__PURE__ */ jsx(Info, { className: "size-4 text-rocsta-accent mt-0.5 shrink-0" }), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
								className: "font-bold text-xs text-foreground",
								children: t("guides.safetyTip")
							}), /* @__PURE__ */ jsx("p", {
								className: "text-[11px] text-muted-foreground mt-0.5 leading-relaxed text-pretty",
								children: t("guides.safetyDesc")
							})] })]
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-4 border-t border-border flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground flex items-center gap-1 font-mono",
						children: [
							/* @__PURE__ */ jsx(Sparkles, { className: "size-3 text-rocsta-accent animate-pulse" }),
							" ",
							t("guides.wikiLabel")
						]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setSelectedGuide(null),
						className: "inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors",
						children: t("ui.close")
					})]
				})
			]
		})
	})] });
}
//#endregion
export { GuidesPage as component };
