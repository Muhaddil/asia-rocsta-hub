import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { t as parts } from "./parts-CLQe3VeO.js";
import { t as localize } from "./types-CK3cC6px.js";
import { t as Input } from "./input-CdTd0dHn.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-nSNR3NZm.js";
import { t as Route } from "./parts-B6qyhB1E.js";
import { n as PageShell, t as Crumbs } from "./page-shell-BXSgiXDA.js";
import { t as api } from "./api-ClaFnBZV.js";
import { t as Badge } from "./badge-CJVoSNqU.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BAC7NIsq.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { CheckCircle2, FilterX, HelpCircle, Info, Search, Sparkles, Wrench } from "lucide-react";
import { z } from "zod";
//#region src/routes/parts.tsx?tsr-split=component
z.object({
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
function PartsPage() {
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
	const [parts$1, setParts] = useState(parts);
	const [loading, setLoading] = useState(false);
	useEffect(() => {
		const loadParts = async () => {
			setLoading(true);
			try {
				setParts((await api.getParts()).map((ap) => ({
					id: ap.id,
					name: ap.name,
					category: ap.category,
					description: ap.description,
					oem: ap.oem,
					equiv: ap.equiv,
					status: ap.status,
					motor: ap.motor,
					notes: ap.notes,
					refs: ap.refs || []
				})));
			} catch (err) {
				console.warn("Failed to load parts from API, using static data:", err);
				setParts(parts);
			} finally {
				setLoading(false);
			}
		};
		loadParts();
		const interval = setInterval(loadParts, 3e4);
		return () => clearInterval(interval);
	}, []);
	const [selectedPart, setSelectedPart] = useState(null);
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
	const currentCategory = searchParams.category;
	const currentSearch = searchParams.search || "";
	const currentMotor = searchParams.motor;
	const currentStatus = searchParams.status;
	const hasActiveFilters = Boolean(currentCategory || currentSearch || currentMotor || currentStatus);
	const clearFilters = () => {
		navigate({ search: () => ({}) });
	};
	const filteredParts = useMemo(() => {
		return parts$1.filter((part) => {
			if (currentCategory && part.category !== currentCategory) return false;
			if (currentMotor) {
				if (currentMotor === "F8" && part.motor === "R2") return false;
				if (currentMotor === "R2" && part.motor === "F8") return false;
			}
			if (currentStatus && part.status !== currentStatus) return false;
			if (currentSearch) {
				const query = currentSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const name = localize(part.name, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const oem = part.oem.toLowerCase();
				const desc = localize(part.description, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const equivs = part.equiv.map((e) => e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
				const refs = (part.refs || []).map((r) => r.toLowerCase());
				const matchesName = name.includes(query);
				const matchesOem = oem.includes(query);
				const matchesDesc = desc.includes(query);
				const matchesEquiv = equivs.some((e) => e.includes(query));
				const matchesRefs = refs.some((r) => r.includes(query));
				if (!matchesName && !matchesOem && !matchesDesc && !matchesEquiv && !matchesRefs) return false;
			}
			return true;
		});
	}, [
		currentCategory,
		currentSearch,
		currentMotor,
		currentStatus,
		language
	]);
	return /* @__PURE__ */ jsxs(PageShell, { children: [/* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(Crumbs, { items: [{ label: t("ui.archive") }, {
				label: t("nav.parts"),
				active: true
			}] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h1", {
				className: "text-4xl font-extrabold tracking-tight text-foreground",
				children: currentCategory ? CATEGORY_LABELS[currentCategory] : t("parts.title")
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-base text-muted-foreground max-w-3xl",
				children: t("parts.desc")
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
								placeholder: t("parts.searchPartsPlaceholder"),
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
									children: t("parts.filter.allEnginesLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "F8",
									children: t("parts.filter.engineF8")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "R2",
									children: t("parts.filter.engineR2")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "ambos",
									children: t("parts.filter.engineBothOption")
								})
							]
						}) }),
						/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
							value: currentStatus || "",
							onChange: (e) => updateSearch({ status: e.target.value || void 0 }),
							className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
							children: [
								/* @__PURE__ */ jsx("option", {
									value: "",
									children: t("parts.filter.allStatusLabel")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "verified",
									children: t("parts.filter.verified100")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "mod",
									children: t("parts.filter.requiresMod")
								}),
								/* @__PURE__ */ jsx("option", {
									value: "unverified",
									children: t("parts.filter.unverified")
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
							currentCategory && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								className: "bg-rocsta-green/10 text-rocsta-green hover:bg-rocsta-green/15 font-semibold",
								children: [
									t("ui.category"),
									": ",
									CATEGORY_LABELS[currentCategory]
								]
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
									currentMotor === "F8" ? t("parts.filter.engineF8") : currentMotor === "R2" ? t("parts.filter.engineR2") : t("parts.filter.engineBothOption")
								]
							}),
							currentStatus && /* @__PURE__ */ jsxs(Badge, {
								variant: "secondary",
								children: [
									t("ui.status"),
									":",
									" ",
									currentStatus === "verified" ? t("parts.badge.verified") : currentStatus === "mod" ? t("parts.badge.mod") : t("parts.badge.unverified")
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
			/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between text-xs text-muted-foreground",
				children: [/* @__PURE__ */ jsxs("span", { children: [
					t("ui.showing"),
					" ",
					/* @__PURE__ */ jsx("strong", {
						className: "text-foreground",
						children: filteredParts.length
					}),
					" ",
					t("ui.of"),
					" ",
					/* @__PURE__ */ jsx("strong", {
						className: "text-foreground",
						children: parts$1.length
					}),
					" ",
					t("ui.partsDocumented"),
					"."
				] }), currentCategory && /* @__PURE__ */ jsx(Link, {
					to: "/parts",
					className: "font-bold text-rocsta-green hover:underline",
					children: t("parts.viewAllCats")
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "rounded-xl border border-border bg-card shadow-sm overflow-hidden",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs(Table, { children: [/* @__PURE__ */ jsx(TableHeader, {
						className: "bg-muted/55 border-b border-border",
						children: /* @__PURE__ */ jsxs(TableRow, { children: [
							/* @__PURE__ */ jsx(TableHead, {
								className: "px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
								children: t("parts.table.name")
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
								children: t("parts.table.oem")
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
								children: t("parts.table.crossover")
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
								children: t("parts.table.engine")
							}),
							/* @__PURE__ */ jsx(TableHead, {
								className: "px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground text-right",
								children: t("parts.table.status")
							})
						] })
					}), /* @__PURE__ */ jsx(TableBody, { children: filteredParts.length > 0 ? filteredParts.map((part) => /* @__PURE__ */ jsxs(TableRow, {
						onClick: () => setSelectedPart(part),
						className: "cursor-pointer hover:bg-muted/30 transition-colors",
						children: [
							/* @__PURE__ */ jsxs(TableCell, {
								className: "px-6 py-4",
								children: [/* @__PURE__ */ jsx("div", {
									className: "font-bold text-sm text-foreground",
									children: localize(part.name, language)
								}), /* @__PURE__ */ jsx("div", {
									className: "text-xs text-muted-foreground font-normal max-w-sm truncate mt-0.5",
									children: localize(part.description, language)
								})]
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "px-4 py-4",
								children: /* @__PURE__ */ jsx("span", {
									className: "font-mono text-xs px-2 py-1 bg-muted rounded border border-border/40 text-foreground font-semibold",
									children: part.oem
								})
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "px-4 py-4 text-xs text-muted-foreground font-medium max-w-xs truncate",
								children: part.equiv.length > 0 ? part.equiv.join(", ") : "—"
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "px-4 py-4",
								children: /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: [
										"text-[10px] font-bold uppercase py-0.5",
										part.motor === "F8" && "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400",
										part.motor === "R2" && "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
										part.motor === "ambos" && "border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400"
									].filter(Boolean).join(" "),
									children: part.motor === "ambos" ? t("parts.badge.common") : part.motor
								})
							}),
							/* @__PURE__ */ jsx(TableCell, {
								className: "px-6 py-4 text-right",
								children: /* @__PURE__ */ jsx(StatusBadge, { status: part.status })
							})
						]
					}, part.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, {
						colSpan: 5,
						className: "py-12 text-center",
						children: [
							/* @__PURE__ */ jsx("div", {
								className: "inline-flex h-12 w-12 items-center justify-center rounded-full bg-rocsta-accent/10 text-rocsta-accent mb-3",
								children: /* @__PURE__ */ jsx(FilterX, { className: "size-6" })
							}),
							/* @__PURE__ */ jsx("h3", {
								className: "text-base font-bold text-foreground",
								children: t("ui.noResults")
							}),
							/* @__PURE__ */ jsx("p", {
								className: "mt-1 text-sm text-muted-foreground max-w-xs mx-auto",
								children: t("parts.noResultsDesc")
							}),
							/* @__PURE__ */ jsx("button", {
								onClick: clearFilters,
								className: "mt-4 inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all",
								children: t("ui.resetFilters")
							})
						]
					}) }) })] })
				})
			})
		]
	}), /* @__PURE__ */ jsx(Dialog, {
		open: selectedPart !== null,
		onOpenChange: (open) => !open && setSelectedPart(null),
		children: selectedPart && /* @__PURE__ */ jsxs(DialogContent, {
			className: "max-w-xl sm:rounded-2xl border-border bg-card",
			children: [
				/* @__PURE__ */ jsxs(DialogHeader, {
					className: "pb-4 border-b border-border",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center gap-2 mb-2",
							children: [
								/* @__PURE__ */ jsxs("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono",
									children: ["ID: ", selectedPart.id]
								}),
								/* @__PURE__ */ jsx("span", {
									className: "text-muted-foreground/60",
									children: "•"
								}),
								/* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: "text-[10px] font-bold uppercase bg-muted/40",
									children: CATEGORY_LABELS[selectedPart.category]
								})
							]
						}),
						/* @__PURE__ */ jsx(DialogTitle, {
							className: "text-2xl font-extrabold tracking-tight text-foreground",
							children: localize(selectedPart.name, language)
						}),
						/* @__PURE__ */ jsx(DialogDescription, {
							className: "text-xs text-muted-foreground text-pretty mt-1 leading-relaxed",
							children: localize(selectedPart.description, language)
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "py-4 space-y-4 text-sm",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "grid grid-cols-2 gap-4 bg-muted/35 p-3 rounded-lg border border-border/40",
							children: [
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
									children: t("parts.dialog.oem")
								}), /* @__PURE__ */ jsx("div", {
									className: "font-mono text-xs font-bold text-foreground",
									children: selectedPart.oem
								})] }),
								/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
									children: t("parts.engineCompat")
								}), /* @__PURE__ */ jsx(Badge, {
									variant: "outline",
									className: [
										"text-[9px] font-bold uppercase py-0.5",
										selectedPart.motor === "F8" && "border-sky-500/20 bg-sky-500/5 text-sky-600 dark:text-sky-400",
										selectedPart.motor === "R2" && "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400",
										selectedPart.motor === "ambos" && "border-purple-500/20 bg-purple-500/5 text-purple-600 dark:text-purple-400"
									].filter(Boolean).join(" "),
									children: selectedPart.motor === "F8" ? "Mazda F8 1.8 Gasolina" : selectedPart.motor === "R2" ? "Mazda R2 2.2 Diésel" : t("parts.badge.engineBoth")
								})] }),
								/* @__PURE__ */ jsxs("div", {
									className: "col-span-2 border-t border-border/40 pt-2",
									children: [/* @__PURE__ */ jsx("h4", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: t("parts.verificationStatus")
									}), /* @__PURE__ */ jsxs("div", {
										className: "inline-flex items-center gap-2 mt-0.5",
										children: [/* @__PURE__ */ jsx(StatusBadge, { status: selectedPart.status }), /* @__PURE__ */ jsxs("span", {
											className: "text-xs text-muted-foreground",
											children: [
												selectedPart.status === "verified" && t("parts.statusVerifiedDesc"),
												selectedPart.status === "mod" && t("parts.statusModDesc"),
												selectedPart.status === "unverified" && t("parts.statusUnverifiedDesc")
											]
										})]
									})]
								})
							]
						}),
						selectedPart.refs && selectedPart.refs.length > 0 && /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5",
							children: t("parts.crossRefs")
						}), /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-1.5 font-mono text-xs",
							children: selectedPart.refs.map((r, i) => /* @__PURE__ */ jsx("span", {
								className: "px-2 py-0.5 bg-muted rounded border border-border/40 text-foreground font-semibold",
								children: r
							}, i))
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5",
							children: t("parts.equivVehicles")
						}), selectedPart.equiv.length > 0 ? /* @__PURE__ */ jsx("div", {
							className: "flex flex-wrap gap-1.5",
							children: selectedPart.equiv.map((e, i) => /* @__PURE__ */ jsx(Badge, {
								variant: "secondary",
								className: "text-xs py-0.5 px-2 bg-muted border border-border/20 text-muted-foreground font-semibold",
								children: e
							}, i))
						}) : /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground italic",
							children: t("parts.noDonors")
						})] }),
						/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h4", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Info, { className: "size-3 text-rocsta-accent" }),
								" ",
								t("parts.installNotes")
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "rounded-lg border border-rocsta-accent/15 bg-rocsta-accent/[0.02] p-3 text-xs leading-relaxed text-muted-foreground",
							children: selectedPart.notes ? localize(selectedPart.notes, language) : t("parts.noNotes")
						})] })
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "pt-4 border-t border-border flex items-center justify-between text-xs",
					children: [/* @__PURE__ */ jsxs("span", {
						className: "text-muted-foreground flex items-center gap-1",
						children: [
							/* @__PURE__ */ jsx(Sparkles, { className: "size-3 text-rocsta-accent" }),
							" ",
							t("parts.classicParts")
						]
					}), /* @__PURE__ */ jsx("button", {
						onClick: () => setSelectedPart(null),
						className: "inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors",
						children: t("parts.dialog.close")
					})]
				})
			]
		})
	})] });
}
function StatusBadge({ status }) {
	const { t } = useLanguage();
	if (status === "verified") return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-400 border border-green-600/10",
		children: [
			/* @__PURE__ */ jsx(CheckCircle2, { className: "size-3" }),
			" ",
			t("parts.badge.verified")
		]
	});
	if (status === "mod") return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400 border border-amber-500/20",
		children: [
			/* @__PURE__ */ jsx(Wrench, { className: "size-3" }),
			" ",
			t("parts.badge.mod")
		]
	});
	return /* @__PURE__ */ jsxs("span", {
		className: "inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-0.5 text-xs font-bold text-muted-foreground border border-border/80",
		children: [
			/* @__PURE__ */ jsx(HelpCircle, { className: "size-3" }),
			" ",
			t("parts.badge.unverified")
		]
	});
}
//#endregion
export { PartsPage as component };
