import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { n as compatibilities, t as Route } from "./compatibility-CliJfuCo.js";
import { t as localize } from "./types-CK3cC6px.js";
import { t as Input } from "./input-CdTd0dHn.js";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogDescription, t as Dialog } from "./dialog-nSNR3NZm.js";
import { n as PageShell, t as Crumbs } from "./page-shell-BXSgiXDA.js";
import { t as api } from "./api-ClaFnBZV.js";
import { t as Badge } from "./badge-CJVoSNqU.js";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-BAC7NIsq.js";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Car, CheckCircle2, FilterX, Flame, Gauge, GitCompare, Info, Loader2, Search, ThumbsUp, Users, Wrench } from "lucide-react";
import { z } from "zod";
//#region src/routes/compatibility.tsx?tsr-split=component
var DIFFICULTY_KEYS = {
	"Fácil": "comp.diff.easy",
	"Media": "comp.diff.medium",
	"Alta": "comp.diff.hard"
};
z.object({
	search: z.string().optional(),
	type: z.enum(["directo", "adaptación"]).optional(),
	difficulty: z.enum([
		"Fácil",
		"Media",
		"Alta"
	]).optional()
});
function toCompat(item) {
	return {
		id: item.id,
		rocstaPart: item.rocstaPart,
		donorVehicle: item.donorVehicle,
		donorRef: item.donorRef,
		type: item.type,
		difficulty: item.difficulty,
		motor: item.motor,
		verified: item.verified,
		confirmations: item.confirmations,
		notes: item.notes,
		category: item.category
	};
}
function CompatibilityPage() {
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
	const [compatibilities$1, setCompatibilities] = useState([]);
	const [confirmed, setConfirmed] = useState(() => {
		try {
			const stored = localStorage.getItem("rocsta_confirmed");
			return stored ? new Set(JSON.parse(stored)) : /* @__PURE__ */ new Set();
		} catch {
			return /* @__PURE__ */ new Set();
		}
	});
	const [loading, setLoading] = useState(true);
	const [pendingConfirmId, setPendingConfirmId] = useState(null);
	const [confirming, setConfirming] = useState(false);
	const markConfirmed = (id) => {
		setConfirmed((prev) => {
			const next = new Set(prev);
			next.add(id);
			try {
				localStorage.setItem("rocsta_confirmed", JSON.stringify([...next]));
			} catch {}
			return next;
		});
	};
	const fetchData = () => {
		setLoading(true);
		api.getCompatibilities().then((list) => setCompatibilities(list.map(toCompat))).catch(() => setCompatibilities(compatibilities)).finally(() => setLoading(false));
	};
	useEffect(() => {
		fetchData();
		const interval = setInterval(fetchData, 3e4);
		return () => clearInterval(interval);
	}, []);
	const [selectedComp, setSelectedComp] = useState(null);
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
	const currentDifficulty = searchParams.difficulty;
	const hasActiveFilters = Boolean(currentSearch || currentType || currentDifficulty);
	const clearFilters = () => {
		navigate({ search: () => ({}) });
	};
	const filteredList = useMemo(() => {
		return compatibilities$1.filter((item) => {
			if (currentType && item.type !== currentType) return false;
			if (currentDifficulty && item.difficulty !== currentDifficulty) return false;
			if (currentSearch) {
				const query = currentSearch.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const rocstaPart = localize(item.rocstaPart, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const donorVehicle = localize(item.donorVehicle, language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				const donorRef = item.donorRef.toLowerCase();
				const notes = localize(item.notes || "", language).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
				if (!rocstaPart.includes(query) && !donorVehicle.includes(query) && !donorRef.includes(query) && !notes.includes(query)) return false;
			}
			return true;
		});
	}, [
		currentSearch,
		currentType,
		currentDifficulty,
		language,
		compatibilities$1
	]);
	const requestConfirm = (id, e) => {
		e.stopPropagation();
		if (confirmed.has(id)) return;
		setPendingConfirmId(id);
	};
	const handleConfirm = async () => {
		const id = pendingConfirmId;
		if (!id) return;
		setConfirming(true);
		try {
			const result = await api.confirmCompatibility(id);
			setCompatibilities((prev) => prev.map((c) => c.id === id ? {
				...c,
				confirmations: result.confirmations
			} : c));
			markConfirmed(id);
		} catch (err) {
			if ((err instanceof Error ? err.message : "").includes("Ya has confirmado")) {
				markConfirmed(id);
				try {
					const status = await api.getConfirmationStatus(id);
					setCompatibilities((prev) => prev.map((c) => c.id === id ? {
						...c,
						confirmations: status.confirmations
					} : c));
				} catch {}
			} else console.error("Confirm error:", err);
		} finally {
			setConfirming(false);
			setPendingConfirmId(null);
		}
	};
	return /* @__PURE__ */ jsxs(PageShell, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ jsx(Crumbs, { items: [{ label: t("ui.archive") }, {
					label: t("nav.compatibility"),
					active: true
				}] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
					className: "text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3",
					children: [
						/* @__PURE__ */ jsx(GitCompare, { className: "size-8 text-rocsta-green" }),
						" ",
						t("comp.title")
					]
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-base text-muted-foreground max-w-3xl",
					children: t("comp.desc")
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
									placeholder: t("comp.searchCompatPlaceholder"),
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
										children: t("comp.filter.allFitTypes")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "directo",
										children: t("comp.fitDirectOption")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "adaptación",
										children: t("comp.fitAdaptOption")
									})
								]
							}) }),
							/* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsxs("select", {
								value: currentDifficulty || "",
								onChange: (e) => updateSearch({ difficulty: e.target.value || void 0 }),
								className: "w-full h-9 rounded-md border border-input bg-card px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green",
								children: [
									/* @__PURE__ */ jsx("option", {
										value: "",
										children: t("comp.filter.allDifficultyLabel")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Fácil",
										children: t("comp.diffEasyOption")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Media",
										children: t("comp.diffMediumOption")
									}),
									/* @__PURE__ */ jsx("option", {
										value: "Alta",
										children: t("comp.diffHardOption")
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
										t("ui.contains"),
										" \"",
										currentSearch,
										"\""
									]
								}),
								currentType && /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									children: [
										t("ui.type"),
										" ",
										currentType === "directo" ? t("comp.dialog.directFit") : t("comp.dialog.requiresAdapt")
									]
								}),
								currentDifficulty && /* @__PURE__ */ jsxs(Badge, {
									variant: "secondary",
									children: [
										t("ui.difficulty"),
										" ",
										t(DIFFICULTY_KEYS[currentDifficulty])
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
					children: loading ? /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin inline" }) : t("comp.resultsFound", { count: filteredList.length })
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
									children: t("comp.table.part")
								}),
								/* @__PURE__ */ jsx(TableHead, {
									className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
									children: t("comp.table.donor")
								}),
								/* @__PURE__ */ jsx(TableHead, {
									className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
									children: t("comp.table.ref")
								}),
								/* @__PURE__ */ jsx(TableHead, {
									className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
									children: t("comp.table.fit")
								}),
								/* @__PURE__ */ jsx(TableHead, {
									className: "px-4 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground",
									children: t("ui.difficulty")
								}),
								/* @__PURE__ */ jsx(TableHead, {
									className: "px-6 font-bold py-3 text-[11px] uppercase tracking-wider text-muted-foreground text-right",
									children: t("comp.table.confirmations")
								})
							] })
						}), /* @__PURE__ */ jsx(TableBody, { children: loading ? /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsx(TableCell, {
							colSpan: 6,
							className: "py-16 text-center",
							children: /* @__PURE__ */ jsx(Loader2, { className: "size-6 animate-spin mx-auto text-muted-foreground" })
						}) }) : filteredList.length > 0 ? filteredList.map((item) => /* @__PURE__ */ jsxs(TableRow, {
							onClick: () => setSelectedComp(item),
							className: "cursor-pointer hover:bg-muted/30 transition-colors",
							children: [
								/* @__PURE__ */ jsxs(TableCell, {
									className: "px-6 py-4",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold text-sm text-foreground",
										children: localize(item.rocstaPart, language)
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground font-mono mt-0.5 uppercase",
										children: CATEGORY_LABELS[item.category]
									})]
								}),
								/* @__PURE__ */ jsxs(TableCell, {
									className: "px-4 py-4 text-xs text-foreground font-semibold flex items-center gap-1.5 mt-2 md:mt-0",
									children: [
										/* @__PURE__ */ jsx(Car, { className: "size-3 text-muted-foreground shrink-0" }),
										" ",
										localize(item.donorVehicle, language)
									]
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "px-4 py-4",
									children: /* @__PURE__ */ jsx("span", {
										className: "font-mono text-xs px-2 py-0.5 bg-muted rounded border border-border/40 text-foreground font-medium",
										children: item.donorRef
									})
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "px-4 py-4",
									children: /* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: ["text-[10px] font-bold py-0.5", item.type === "directo" ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400" : "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400"].join(" "),
										children: item.type === "directo" ? t("comp.fit.direct") : t("comp.fit.mod")
									})
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "px-4 py-4",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center gap-1 text-xs text-muted-foreground font-semibold",
										children: [
											/* @__PURE__ */ jsx(Gauge, { className: "size-3 text-rocsta-accent" }),
											" ",
											t(DIFFICULTY_KEYS[item.difficulty])
										]
									})
								}),
								/* @__PURE__ */ jsx(TableCell, {
									className: "px-6 py-4 text-right",
									children: /* @__PURE__ */ jsxs("div", {
										className: "flex items-center justify-end gap-2",
										children: [/* @__PURE__ */ jsxs("span", {
											className: "inline-flex items-center gap-1 text-xs font-bold text-rocsta-green",
											children: [
												/* @__PURE__ */ jsx(Users, { className: "size-3" }),
												" ",
												item.confirmations,
												" ",
												t("comp.table.confirmedCount")
											]
										}), /* @__PURE__ */ jsxs("button", {
											onClick: (e) => requestConfirm(item.id, e),
											disabled: confirmed.has(item.id),
											className: ["inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-bold transition-all", confirmed.has(item.id) ? "bg-green-500/10 text-green-600 cursor-default" : "bg-muted hover:bg-rocsta-green/10 hover:text-rocsta-green text-muted-foreground"].join(" "),
											children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "size-3" }), confirmed.has(item.id) ? t("comp.confirmed") : t("comp.confirm")]
										})]
									})
								})
							]
						}, item.id)) : /* @__PURE__ */ jsx(TableRow, { children: /* @__PURE__ */ jsxs(TableCell, {
							colSpan: 6,
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
									children: t("comp.noResultsDesc")
								})
							]
						}) }) })] })
					})
				})
			]
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: selectedComp !== null,
			onOpenChange: (open) => !open && setSelectedComp(null),
			children: selectedComp && /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-w-lg sm:rounded-2xl border-border bg-card",
				children: [
					/* @__PURE__ */ jsxs(DialogHeader, {
						className: "pb-4 border-b border-border",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-2 mb-1.5",
								children: [
									/* @__PURE__ */ jsxs("span", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider font-mono",
										children: ["ID: ", selectedComp.id]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-muted-foreground/60",
										children: "•"
									}),
									/* @__PURE__ */ jsx(Badge, {
										variant: "outline",
										className: "text-[10px] font-bold uppercase bg-muted/40",
										children: CATEGORY_LABELS[selectedComp.category]
									})
								]
							}),
							/* @__PURE__ */ jsxs(DialogTitle, {
								className: "text-2xl font-extrabold tracking-tight text-foreground",
								children: [
									t("comp.table.part"),
									": ",
									localize(selectedComp.rocstaPart, language)
								]
							}),
							/* @__PURE__ */ jsx(DialogDescription, {
								className: "text-xs text-muted-foreground mt-1",
								children: t("comp.dialog.desc", { vehicle: localize(selectedComp.donorVehicle, language) })
							})
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "py-4 space-y-4 text-sm",
						children: [
							/* @__PURE__ */ jsxs("div", {
								className: "grid grid-cols-2 gap-4 bg-muted/30 p-3 rounded-lg border border-border/40",
								children: [
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: t("comp.dialog.donorVehicle")
									}), /* @__PURE__ */ jsxs("div", {
										className: "font-semibold text-foreground flex items-center gap-1.5",
										children: [
											/* @__PURE__ */ jsx(Car, { className: "size-3 text-rocsta-accent" }),
											" ",
											localize(selectedComp.donorVehicle, language)
										]
									})] }),
									/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
										className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
										children: t("comp.dialog.donorRef")
									}), /* @__PURE__ */ jsx("div", {
										className: "font-mono text-xs font-bold text-foreground",
										children: selectedComp.donorRef
									})] }),
									/* @__PURE__ */ jsxs("div", {
										className: "border-t border-border/40 pt-2",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
											children: t("comp.dialog.fitType")
										}), /* @__PURE__ */ jsx(Badge, {
											variant: "outline",
											className: ["text-[9px] font-bold py-0.5 mt-0.5", selectedComp.type === "directo" ? "border-green-500/20 bg-green-500/5 text-green-600 dark:text-green-400" : "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400"].join(" "),
											children: selectedComp.type === "directo" ? t("comp.dialog.directFit") : t("comp.dialog.requiresAdapt")
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "border-t border-border/40 pt-2",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1",
											children: t("comp.dialog.difficultyLabel")
										}), /* @__PURE__ */ jsxs("div", {
											className: "flex items-center gap-1 text-xs text-muted-foreground font-semibold mt-1",
											children: [
												/* @__PURE__ */ jsx(Gauge, { className: "size-3 text-rocsta-accent animate-pulse" }),
												" ",
												t(DIFFICULTY_KEYS[selectedComp.difficulty])
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ jsxs("div", {
								className: "flex items-center gap-3 border-y border-border/50 py-3",
								children: [selectedComp.verified ? /* @__PURE__ */ jsx("div", {
									className: "h-8 w-8 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ jsx(CheckCircle2, { className: "size-4" })
								}) : /* @__PURE__ */ jsx("div", {
									className: "h-8 w-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ jsx(Wrench, { className: "size-4" })
								}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h5", {
									className: "font-bold text-xs text-foreground",
									children: selectedComp.verified ? t("comp.swapVerified") : t("comp.swapCaution")
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted-foreground",
									children: t("comp.confirmedBy", { count: selectedComp.confirmations })
								})] })]
							}),
							/* @__PURE__ */ jsx("div", {
								className: "flex justify-center",
								children: /* @__PURE__ */ jsxs("button", {
									onClick: (e) => requestConfirm(selectedComp.id, e),
									disabled: confirmed.has(selectedComp.id),
									className: ["inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold transition-all", confirmed.has(selectedComp.id) ? "bg-green-500/10 text-green-600 cursor-default border border-green-500/20" : "bg-rocsta-green text-primary-foreground hover:opacity-90 shadow-sm"].join(" "),
									children: [/* @__PURE__ */ jsx(ThumbsUp, { className: "size-4" }), confirmed.has(selectedComp.id) ? `✓ ${t("comp.confirmed")}` : `${t("comp.confirm")} (${selectedComp.confirmations})`]
								})
							}),
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h4", {
								className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1",
								children: [
									/* @__PURE__ */ jsx(Info, { className: "size-3 text-rocsta-accent" }),
									" ",
									t("comp.installInstr")
								]
							}), /* @__PURE__ */ jsx("div", {
								className: "rounded-lg border border-rocsta-accent/15 bg-rocsta-accent/[0.02] p-3 text-xs leading-relaxed text-muted-foreground text-pretty",
								children: selectedComp.notes ? localize(selectedComp.notes, language) : t("comp.noNotes")
							})] })
						]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "pt-4 border-t border-border flex items-center justify-between text-xs",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "text-muted-foreground flex items-center gap-1 font-mono",
							children: [
								/* @__PURE__ */ jsx(Flame, { className: "size-3 text-rocsta-accent animate-bounce" }),
								" ",
								t("comp.swapsLabel")
							]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => setSelectedComp(null),
							className: "inline-flex h-9 items-center justify-center rounded-md bg-muted px-4 font-bold text-foreground hover:bg-muted/70 transition-colors",
							children: t("ui.close")
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ jsx(Dialog, {
			open: pendingConfirmId !== null,
			onOpenChange: (open) => !open && setPendingConfirmId(null),
			children: /* @__PURE__ */ jsxs(DialogContent, {
				className: "max-w-md sm:rounded-2xl border-border bg-card",
				children: [/* @__PURE__ */ jsxs(DialogHeader, { children: [/* @__PURE__ */ jsxs(DialogTitle, {
					className: "text-xl font-extrabold tracking-tight text-foreground flex items-center gap-2",
					children: [/* @__PURE__ */ jsx(GitCompare, { className: "size-5 text-rocsta-green" }), t("comp.confirmDialog.title")]
				}), /* @__PURE__ */ jsx(DialogDescription, {
					className: "text-sm text-muted-foreground mt-2",
					children: t("comp.confirmDialog.desc")
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-end gap-3 pt-4 border-t border-border mt-4",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => setPendingConfirmId(null),
						disabled: confirming,
						className: "inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-bold text-foreground hover:bg-muted hover:text-muted-foreground transition-colors disabled:opacity-50",
						children: t("comp.confirmDialog.no")
					}), /* @__PURE__ */ jsxs("button", {
						onClick: handleConfirm,
						disabled: confirming,
						className: "inline-flex h-9 items-center justify-center rounded-md bg-rocsta-green px-4 text-sm font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50",
						children: [confirming && /* @__PURE__ */ jsx(Loader2, { className: "size-4 animate-spin mr-2" }), t("comp.confirmDialog.yes")]
					})]
				})]
			})
		})
	] });
}
//#endregion
export { CompatibilityPage as component };
