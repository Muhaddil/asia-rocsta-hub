import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { t as problems } from "./problems-BEUt0oUr.js";
import { t as localize } from "./types-CK3cC6px.js";
import { t as Input } from "./input-CdTd0dHn.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-nSNR3NZm.js";
import { t as Route } from "./problems-Bv1OZ9Ca.js";
import { n as PageShell, t as Crumbs } from "./page-shell-BXSgiXDA.js";
import { t as Badge } from "./badge-CJVoSNqU.js";
import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Activity, AlertOctagon, AlertTriangle, Compass, DollarSign, FileText, FilterX, Gauge, Info, Search, Sparkles, Users } from "lucide-react";
import { z } from "zod";
//#region src/routes/problems.tsx?tsr-split=component
var DIFFICULTY_KEYS = {
	"Fácil": "comp.diff.easy",
	"Media": "comp.diff.medium",
	"Alta": "comp.diff.hard"
};
z.object({
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
function ProblemsPage() {
	const { t, language } = useLanguage();
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const CATEGORY_LABELS = {
		engine: t("cat.engine"),
		transmission: t("cat.transmission"),
		suspension: t("cat.suspension"),
		electrical: t("cat.electrical"),
		brakes: t("cat.brakes"),
		tires: t("cat.tires"),
		body: t("cat.body")
	};
	const [selectedProblem, setSelectedProblem] = useState(null);
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
	const currentSeverity = searchParams.severity;
	const currentMotor = searchParams.motor;
	const hasActiveFilters = Boolean(currentSearch || currentSeverity || currentMotor);
	const clearFilters = () => {
		navigate({ search: () => ({}) });
	};
	const filteredList = useMemo(() => {
		return problems.filter((prob) => {
			if (currentSeverity && prob.severity !== currentSeverity) return false;
			if (currentMotor) {
				if (currentMotor === "F8" && prob.motor === "R2") return false;
				if (currentMotor === "R2" && prob.motor === "F8") return false;
			}
			if (currentSearch) {
				const query = currentSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const title = localize(prob.title, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const symptom = localize(prob.symptom, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const cause = localize(prob.cause, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const solution = localize(prob.solution, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (!title.includes(query) && !symptom.includes(query) && !cause.includes(query) && !solution.includes(query)) return false;
			}
			return true;
		});
	}, [
		currentSearch,
		currentSeverity,
		currentMotor,
		language
	]);
	return /* @__PURE__ */ jsxs(PageShell, { children: [/* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(Crumbs, { items: [{ label: t("ui.archive") }, {
				label: t("nav.problems"),
				active: true
			}] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
				className: "text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(AlertOctagon, { className: "size-8 text-red-500 animate-pulse" }),
					" ",
					t("problems.title")
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-base text-muted-foreground max-w-3xl",
				children: t("problems.desc")
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
								placeholder: t("problems.searchProblemsPlaceholder"),
								value: currentSearch,
								onChange: (e) => updateSearch({ search: e.target.value }),
								className: "pl-9 bg-muted/40 focus-visible:ring-rocsta-green"
							})]
						}),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentSeverity || "",
							onChange: (e) => updateSearch({ severity: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("problems.filter.allSeverityLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "critical",
									children: t("problems.severityCriticalOption")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "warn",
									children: t("problems.severityWarnOption")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "info",
									children: t("problems.severityInfoOption")
								})
							]
						}) }),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentMotor || "",
							onChange: (e) => updateSearch({ motor: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("problems.filter.allMotorsLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "F8",
									children: t("problems.filter.motorF8")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "R2",
									children: t("problems.filter.motorR2")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "ambos",
									children: t("problems.filter.motorBoth")
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
							currentSeverity && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.severity"),
									":",
									" ",
									currentSeverity === "critical" ? t("problems.severity.critical") : currentSeverity === "warn" ? t("problems.severity.warn") : t("problems.severity.info")
								]
							}),
							currentMotor && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.motor"),
									":",
									" ",
									currentMotor === "F8" ? "Gasolina" : currentMotor === "R2" ? "Diésel" : "Común"
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
				children: t("problems.resultsFound", { count: filteredList.length })
			}),
			filteredList.length > 0 ? /* @__PURE__ */ jsx("div", {
				className: "space-y-4",
				children: filteredList.map((prob) => /* @__PURE__ */ jsxs("div", {
					onClick: () => setSelectedProblem(prob),
					className: "group cursor-pointer rounded-xl border border-border bg-card p-5 transition-all hover:border-rocsta-green/30 hover:shadow-sm flex flex-col md:flex-row items-start gap-4",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: [
								"h-10 w-10 shrink-0 rounded-lg flex items-center justify-center font-bold",
								prob.severity === "critical" && "bg-red-500/10 text-red-600 dark:text-red-400",
								prob.severity === "warn" && "bg-amber-500/10 text-amber-600 dark:text-amber-400",
								prob.severity === "info" && "bg-sky-500/10 text-sky-600 dark:text-sky-400"
							].filter(Boolean).join(" "),
							children: [
								prob.severity === "critical" && /* @__PURE__ */ jsx(AlertTriangle, { className: "size-5" }),
								prob.severity === "warn" && /* @__PURE__ */ jsx(AlertOctagon, { className: "size-5" }),
								prob.severity === "info" && /* @__PURE__ */ jsx(Info, { className: "size-5" })
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "flex-1 space-y-2",
							children: [
								/* @__PURE__ */ jsxs("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [
										/* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: "text-[10px] font-bold uppercase font-mono bg-muted/40",
											children: CATEGORY_LABELS[prob.category]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-muted-foreground/60 text-xs",
											children: "•"
										}),
										/* @__PURE__ */ jsxs("span", {
											className: "text-xs text-muted-foreground font-semibold",
											children: [
												t("problems.typicalMileage"),
												": ",
												prob.km
											]
										})
									]
								}),
								/* @__PURE__ */ jsx("h3", {
									className: "font-extrabold text-base text-foreground leading-snug group-hover:text-rocsta-green transition-colors",
									children: localize(prob.title, language)
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground leading-relaxed line-clamp-2",
									children: [
										/* @__PURE__ */ jsxs("strong", {
											className: "text-foreground",
											children: [t("problems.symptomLabel"), ":"]
										}),
										" ",
										localize(prob.symptom, language)
									]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t border-border/20 md:border-0 flex md:flex-col items-center md:items-end justify-between md:justify-center gap-2",
							children: [/* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 font-mono",
								children: [
									/* @__PURE__ */ jsx(DollarSign, { className: "size-3" }),
									" ",
									prob.cost
								]
							}), /* @__PURE__ */ jsxs("span", {
								className: "inline-flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase",
								children: [
									/* @__PURE__ */ jsx(Users, { className: "size-3" }),
									" ",
									prob.reports,
									" ",
									t("problems.reportsCount")
								]
							})]
						})
					]
				}, prob.id))
			}) : /* @__PURE__ */ jsxs("div", {
				className: "rounded-xl border border-border bg-card p-12 text-center shadow-sm",
				children: [
					/* @__PURE__ */ jsx("div", {
						className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3",
						children: /* @__PURE__ */ jsx(FilterX, { className: "size-6" })
					}),
					/* @__PURE__ */ jsx("h3", {
						className: "text-base font-bold text-foreground",
						children: t("problems.noResults")
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground max-w-xs mx-auto",
						children: t("problems.noResultsDesc")
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
		open: selectedProblem !== null,
		onOpenChange: (open) => !open && setSelectedProblem(null),
		children: selectedProblem && /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-xl sm:rounded-2xl border-border bg-card max-h-[90vh] overflow-y-auto",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, {
					className: "pb-4 border-b border-border",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex flex-wrap items-center gap-2 mb-2",
							children: [
								/* @__PURE__ */ jsxs(Badge, {
									variant: "outline",
									className: [
										"text-[10px] font-bold uppercase py-0.5",
										selectedProblem.severity === "critical" && "border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400",
										selectedProblem.severity === "warn" && "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
										selectedProblem.severity === "info" && "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400"
									].join(" "),
									children: [
										t("ui.severity"),
										":",
										" ",
										selectedProblem.severity === "critical" ? t("problems.severity.critical") : selectedProblem.severity === "warn" ? t("problems.severity.warn") : t("problems.severity.info")
									]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground/60",
									children: "•"
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "text-[10px] font-bold uppercase bg-muted/40 font-mono",
									children: CATEGORY_LABELS[selectedProblem.category]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground/60",
									children: "•"
								}),
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase font-mono flex items-center gap-0.5",
									children: [
										/* @__PURE__ */ jsx(Activity, { className: "size-3" }),
										" ",
										selectedProblem.reports,
										" ",
										t("problems.card.reports")
									]
								})
							]
						}),
						/* @__PURE__ */ jsx(DialogTitle, {
							className: "text-2xl font-extrabold tracking-tight text-foreground text-pretty",
							children: localize(selectedProblem.title, language)
						}),
						/* @__PURE__ */ jsx(DialogDescription, {
							className: "text-xs text-muted-foreground mt-1",
							children: t("problems.dialog.desc")
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "py-4 space-y-5 text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/40",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
									children: t("problems.dialog.cost")
								}), /* @__PURE__ */ jsxs("div", {
									className: "font-mono text-sm font-bold text-red-600 dark:text-red-400 flex items-center gap-0.5",
									children: [
										/* @__PURE__ */ jsx(DollarSign, { className: "size-4" }),
										" ",
										selectedProblem.cost
									]
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
									children: t("problems.dialog.difficulty")
								}), /* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-1 text-xs text-muted-foreground font-semibold mt-1",
									children: [
										/* @__PURE__ */ jsx(Gauge, { className: "size-3 text-rocsta-accent" }),
										" ",
										t(DIFFICULTY_KEYS[selectedProblem.difficulty])
									]
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-2 border-t border-border/40 pt-2",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: t("problems.dialog.mileage")
									}), /* @__PURE__ */ jsx("span", {
										className: "text-xs text-foreground font-bold font-mono",
										children: selectedProblem.km
									})]
								})
							]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Activity, { className: "size-3 text-rocsta-accent" }),
									" ",
									t("problems.dialog.symptomsTitle")
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs leading-relaxed text-foreground bg-muted/20 p-3 rounded-lg border border-border/40 text-pretty",
								children: localize(selectedProblem.symptom, language)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Compass, { className: "size-3 text-rocsta-accent" }),
									" ",
									t("problems.dialog.causesTitle")
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs leading-relaxed text-muted-foreground bg-muted/20 p-3 rounded-lg border border-border/40 text-pretty",
								children: localize(selectedProblem.cause, language)
							})]
						}),
						/* @__PURE__ */ jsxs("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ jsxs("h4", {
								className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(FileText, { className: "size-3 text-rocsta-green" }),
									" ",
									t("problems.dialog.solutionTitle")
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "text-xs leading-relaxed text-muted-foreground bg-rocsta-green/[0.01] p-3 rounded-lg border border-rocsta-green/15 whitespace-pre-line text-pretty",
								children: localize(selectedProblem.solution, language)
							})]
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
							t("problems.registryLabel")
						]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setSelectedProblem(null),
						className: "inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors",
						children: t("ui.close")
					})]
				})
			]
		})
	})] });
}
//#endregion
export { ProblemsPage as component };
