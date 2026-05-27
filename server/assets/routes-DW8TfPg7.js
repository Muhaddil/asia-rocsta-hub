import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { t as parts } from "./parts-CLQe3VeO.js";
import { t as guides } from "./guides-DNGOFuzs.js";
import { t as problems } from "./problems-BEUt0oUr.js";
import { t as localize } from "./types-CK3cC6px.js";
import { n as PageShell } from "./page-shell-BXSgiXDA.js";
import { t as rocsta_hero_default } from "./rocsta-hero-SZUdCGg4.js";
import { n as getApiBase, t as api } from "./api-ClaFnBZV.js";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { AlertTriangle, ArrowRight, BookOpen, Box, CircleDot, Cog, Disc, FileText, GitBranch, GitCompare, Loader2, Search, Users, Wrench, Zap } from "lucide-react";
//#region src/components/home/system-diagram.tsx
var HOTSPOTS = [
	{
		id: "engine",
		labelKey: "cat.engine",
		category: "engine",
		x: 168,
		y: 158,
		icon: Cog
	},
	{
		id: "electrical",
		labelKey: "cat.electrical",
		category: "electrical",
		x: 80,
		y: 202,
		icon: Zap
	},
	{
		id: "transmission",
		labelKey: "cat.transmission",
		category: "transmission",
		x: 302,
		y: 248,
		icon: GitBranch
	},
	{
		id: "suspension",
		labelKey: "cat.suspension",
		category: "suspension",
		x: 190,
		y: 208,
		icon: CircleDot
	},
	{
		id: "brakes",
		labelKey: "cat.brakes",
		category: "brakes",
		x: 532,
		y: 271,
		icon: Disc
	},
	{
		id: "body",
		labelKey: "cat.body",
		category: "body",
		x: 410,
		y: 92,
		icon: Box
	}
];
function SystemDiagram() {
	const navigate = useNavigate();
	const { t } = useLanguage();
	const [hovered, setHovered] = useState(null);
	const go = (category) => navigate({
		to: "/parts",
		search: { category }
	});
	return /* @__PURE__ */ jsxs("section", {
		className: "mb-12",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "mb-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold tracking-tight",
					children: t("home.diagram.title")
				}), /* @__PURE__ */ jsx("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: t("home.diagram.desc")
				})]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "hidden sm:block rounded-2xl border border-border bg-card overflow-hidden shadow-sm",
				children: [/* @__PURE__ */ jsx("div", {
					className: "relative w-full",
					children: /* @__PURE__ */ jsxs("svg", {
						viewBox: "0 0 700 380",
						className: "w-full h-auto",
						role: "img",
						"aria-label": t("home.diagram.title"),
						children: [/* @__PURE__ */ jsx("image", {
							href: rocsta_hero_default,
							x: "0",
							y: "0",
							width: "700",
							height: "380",
							preserveAspectRatio: "xMidYMid meet"
						}), HOTSPOTS.map((h) => {
							const active = hovered === h.id;
							const labelWidth = t(h.labelKey).length * 6.8 + 20;
							const tooltipX = h.x + 14 + labelWidth > 700 ? h.x - labelWidth - 14 : h.x + 14;
							return /* @__PURE__ */ jsxs("g", {
								onMouseEnter: () => setHovered(h.id),
								onMouseLeave: () => setHovered(null),
								onClick: () => go(h.category),
								className: "cursor-pointer",
								children: [
									/* @__PURE__ */ jsx("circle", {
										cx: h.x,
										cy: h.y,
										r: active ? 20 : 14,
										className: "fill-rocsta-green/25 transition-all duration-150"
									}),
									/* @__PURE__ */ jsx("circle", {
										cx: h.x,
										cy: h.y,
										r: "7",
										className: "fill-rocsta-green stroke-white stroke-[1.5]"
									}),
									active && /* @__PURE__ */ jsxs("g", { children: [/* @__PURE__ */ jsx("rect", {
										x: tooltipX,
										y: h.y - 24,
										width: labelWidth,
										height: "22",
										rx: "5",
										className: "fill-rocsta-dark",
										opacity: "0.92"
									}), /* @__PURE__ */ jsx("text", {
										x: tooltipX + 10,
										y: h.y - 9,
										className: "fill-white font-bold",
										fontSize: "11",
										children: t(h.labelKey)
									})] })
								]
							}, h.id);
						})]
					})
				}), /* @__PURE__ */ jsx("p", {
					className: "py-3 text-[11px] text-muted-foreground text-center font-mono uppercase tracking-widest border-t border-border",
					children: t("home.diagram.hint")
				})]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "sm:hidden grid grid-cols-2 gap-3",
				children: HOTSPOTS.map((h) => /* @__PURE__ */ jsxs("button", {
					onClick: () => go(h.category),
					className: "flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left hover:border-rocsta-green/40 transition-colors",
					children: [/* @__PURE__ */ jsx("div", {
						className: "h-9 w-9 rounded-md bg-rocsta-green/10 flex items-center justify-center text-rocsta-green shrink-0",
						children: /* @__PURE__ */ jsx(h.icon, { className: "size-4" })
					}), /* @__PURE__ */ jsx("span", {
						className: "text-xs font-extrabold leading-tight text-foreground",
						children: t(h.labelKey)
					})]
				}, h.id))
			})
		]
	});
}
//#endregion
//#region src/components/home/maintenance-schedule.tsx
var ROWS = [
	{
		itemKey: "maint.oil",
		interval: "5.000 km",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.oilFilter",
		interval: "5.000 km",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.airFilter",
		interval: "20.000 km",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.fuelFilter",
		interval: "20.000 km",
		motors: ["R2"]
	},
	{
		itemKey: "maint.timingBelt",
		interval: "80.000 km",
		motors: ["R2"],
		critical: true
	},
	{
		itemKey: "maint.coolant",
		interval: "40.000 km / 2 ",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.gearbox",
		interval: "40.000 km",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.diff",
		interval: "40.000 km",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.grease",
		interval: "10.000 km",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.brakeFluid",
		interval: "2 ",
		motors: ["F8", "R2"]
	},
	{
		itemKey: "maint.spark",
		interval: "30.000 km",
		motors: ["F8"]
	}
];
function MaintenanceSchedule() {
	const { t } = useLanguage();
	const [motor, setMotor] = useState("all");
	const rows = ROWS.filter((r) => motor === "all" || r.motors.includes(motor));
	return /* @__PURE__ */ jsxs("section", {
		className: "mb-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6 flex items-end justify-between flex-wrap gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold tracking-tight",
				children: t("home.maint.title")
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: t("home.maint.desc")
			})] }), /* @__PURE__ */ jsx("div", {
				className: "inline-flex rounded-md border border-border bg-card p-1 text-xs font-bold",
				children: [
					"all",
					"F8",
					"R2"
				].map((m) => /* @__PURE__ */ jsx("button", {
					onClick: () => setMotor(m),
					className: ["px-3 py-1.5 rounded transition-colors", motor === m ? "bg-rocsta-green text-primary-foreground" : "text-muted-foreground hover:text-foreground"].join(" "),
					children: m === "all" ? t("home.maint.all") : m
				}, m))
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
			children: /* @__PURE__ */ jsx("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ jsxs("table", {
					className: "w-full border-collapse text-left",
					children: [/* @__PURE__ */ jsx("thead", {
						className: "bg-muted/65 border-b border-border",
						children: /* @__PURE__ */ jsxs("tr", { children: [
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
								children: t("home.maint.item")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
								children: t("home.maint.interval")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
								children: t("home.maint.motor")
							}),
							/* @__PURE__ */ jsx("th", {
								className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right",
								children: t("home.maint.severity")
							})
						] })
					}), /* @__PURE__ */ jsx("tbody", {
						className: "divide-y divide-border/60",
						children: rows.map((r) => /* @__PURE__ */ jsxs("tr", {
							className: "hover:bg-muted/40 transition-colors",
							children: [
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-3 text-sm font-semibold text-foreground",
									children: t(r.itemKey)
								}),
								/* @__PURE__ */ jsxs("td", {
									className: "px-6 py-3 font-mono text-xs font-bold text-foreground",
									children: [r.interval, r.interval.endsWith(" ") && t("home.maint.years")]
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-3 text-xs font-mono font-bold text-muted-foreground",
									children: r.motors.join(" · ")
								}),
								/* @__PURE__ */ jsx("td", {
									className: "px-6 py-3 text-right",
									children: r.critical ? /* @__PURE__ */ jsxs("span", {
										className: "inline-flex items-center gap-1 rounded-full bg-red-50 dark:bg-red-500/10 px-2.5 py-0.5 text-[11px] font-bold text-red-700 dark:text-red-400",
										children: [
											/* @__PURE__ */ jsx(AlertTriangle, { className: "size-3" }),
											" ",
											t("home.maint.critical")
										]
									}) : /* @__PURE__ */ jsx("span", {
										className: "inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-[11px] font-bold text-green-700 dark:text-green-400",
										children: t("home.maint.routine")
									})
								})
							]
						}, r.itemKey))
					})]
				})
			})
		})]
	});
}
//#endregion
//#region src/components/home/community-gallery.tsx
var API_BASE = getApiBase();
function imageUrl(path) {
	if (path.startsWith("http")) return path;
	return `${API_BASE}${path}`;
}
function CommunityGallery() {
	const { t } = useLanguage();
	const [entries, setEntries] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		api.getGallery().then(setEntries).catch(() => setEntries([])).finally(() => setLoading(false));
	}, []);
	return /* @__PURE__ */ jsxs("section", {
		className: "mb-12",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-6 flex items-end justify-between flex-wrap gap-3",
			children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
				className: "text-2xl font-bold tracking-tight",
				children: t("home.gallery.title")
			}), /* @__PURE__ */ jsx("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: t("home.gallery.desc")
			})] }), /* @__PURE__ */ jsx(Link, {
				to: "/community",
				search: { tab: "photo" },
				className: "text-sm font-bold text-rocsta-green hover:underline",
				children: t("home.gallery.cta")
			})]
		}), /* @__PURE__ */ jsx("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",
			children: loading ? /* @__PURE__ */ jsx("div", {
				className: "col-span-full flex justify-center py-12",
				children: /* @__PURE__ */ jsx(Loader2, { className: "size-6 animate-spin text-muted-foreground" })
			}) : entries.length === 0 ? /* @__PURE__ */ jsx("p", {
				className: "col-span-full text-center text-sm text-muted-foreground py-12",
				children: t("home.gallery.empty")
			}) : entries.filter((e) => e.verified).map((e) => /* @__PURE__ */ jsxs("article", {
				className: "group overflow-hidden rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all",
				children: [/* @__PURE__ */ jsx("div", {
					className: "aspect-[4/3] overflow-hidden bg-muted",
					children: /* @__PURE__ */ jsx("img", {
						src: imageUrl(e.image),
						alt: `Asia Rocsta ${e.year}`,
						loading: "lazy",
						className: "w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
					})
				}), /* @__PURE__ */ jsx("div", {
					className: "p-4 flex items-center justify-between",
					children: /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
						className: "text-sm font-extrabold text-foreground",
						children: [
							"Rocsta ",
							e.year,
							" · ",
							e.motor
						]
					}), /* @__PURE__ */ jsxs("div", {
						className: "text-xs text-muted-foreground mt-0.5",
						children: [e.country && `${e.country} — `, e.owner]
					})] })
				})]
			}, e.id))
		})]
	});
}
//#endregion
//#region src/routes/index.tsx?tsr-split=component
function Index() {
	const navigate = useNavigate();
	const { t, language } = useLanguage();
	const popularParts = useMemo(() => {
		return [
			"p-001",
			"p-002",
			"p-011",
			"p-015",
			"p-031"
		].map((id) => parts.find((p) => p.id === id)).filter((p) => Boolean(p));
	}, []);
	const popularProblems = useMemo(() => {
		return [
			"pr-001",
			"pr-002",
			"pr-005"
		].map((id) => problems.find((prob) => prob.id === id)).filter((p) => Boolean(p));
	}, []);
	const recentGuides = useMemo(() => {
		return ["g-001", "g-002"].map((id) => guides.find((g) => g.id === id)).filter((g) => Boolean(g));
	}, []);
	const STATS = [
		{
			label: t("home.stats.years"),
			value: "1990–99"
		},
		{
			label: t("home.stats.engines"),
			value: "2"
		},
		{
			label: t("home.stats.markets"),
			value: "30+"
		},
		{
			label: t("home.stats.units"),
			value: "~77k"
		}
	];
	const QUICK_ACCESS = [
		{
			to: "/parts",
			icon: Wrench,
			label: t("home.quick.parts"),
			desc: t("home.quick.partsDesc")
		},
		{
			to: "/compatibility",
			icon: GitCompare,
			label: t("home.quick.comp"),
			desc: t("home.quick.compDesc")
		},
		{
			to: "/guides",
			icon: BookOpen,
			label: t("home.quick.guides"),
			desc: t("home.quick.guidesDesc")
		},
		{
			to: "/problems",
			icon: AlertTriangle,
			label: t("home.quick.problems"),
			desc: t("home.quick.problemsDesc")
		},
		{
			to: "/manuals",
			icon: FileText,
			label: t("home.quick.manuals"),
			desc: t("home.quick.manualsDesc")
		},
		{
			to: "/community",
			icon: Users,
			label: t("home.quick.community"),
			desc: t("home.quick.communityDesc")
		}
	];
	return /* @__PURE__ */ jsxs(PageShell, { children: [
		/* @__PURE__ */ jsxs("div", {
			className: "mb-8",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground",
					children: [
						/* @__PURE__ */ jsx("span", { children: t("ui.archive") }),
						/* @__PURE__ */ jsx("span", { children: "/" }),
						/* @__PURE__ */ jsx("span", {
							className: "text-rocsta-green font-semibold",
							children: t("nav.home")
						})
					]
				}),
				/* @__PURE__ */ jsxs("h1", {
					className: "text-4xl md:text-5xl font-extrabold tracking-tight text-foreground text-balance",
					children: [
						t("home.title"),
						" ",
						/* @__PURE__ */ jsx("span", {
							className: "text-rocsta-green",
							children: "Asia Rocsta"
						})
					]
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-4 text-lg text-muted-foreground max-w-2xl text-pretty leading-relaxed",
					children: t("home.desc")
				}),
				/* @__PURE__ */ jsxs("div", {
					onClick: () => {
						document.dispatchEvent(new KeyboardEvent("keydown", {
							key: "k",
							ctrlKey: true
						}));
					},
					className: "mt-8 relative group max-w-2xl cursor-pointer",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" }),
						/* @__PURE__ */ jsx("input", {
							type: "text",
							readOnly: true,
							placeholder: t("search.heroPlaceholder"),
							className: "w-full h-14 rounded-xl border border-border bg-card pl-12 pr-24 text-sm shadow-sm focus:border-rocsta-green focus:outline-none focus:ring-2 focus:ring-rocsta-green/20 transition-all cursor-pointer select-none"
						}),
						/* @__PURE__ */ jsx("kbd", {
							className: "absolute right-4 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center rounded border border-border bg-background px-2 py-1 text-[10px] font-mono text-muted-foreground",
							children: "⌘K"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ jsx(SystemDiagram, {}),
		/* @__PURE__ */ jsx("div", {
			className: "mb-12 grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border",
			children: STATS.map((s) => /* @__PURE__ */ jsxs("div", {
				className: "bg-card p-6",
				children: [/* @__PURE__ */ jsx("p", {
					className: "text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1",
					children: s.label
				}), /* @__PURE__ */ jsx("p", {
					className: "text-3xl font-extrabold text-foreground font-mono",
					children: s.value
				})]
			}, s.label))
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mb-12",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "mb-6 text-2xl font-bold tracking-tight text-foreground",
				children: t("home.quickAccess")
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
				children: QUICK_ACCESS.map((q) => /* @__PURE__ */ jsxs(Link, {
					to: q.to,
					className: "group rounded-xl border border-border bg-card p-5 transition-all hover:border-rocsta-green/40 hover:shadow-md",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between mb-3",
							children: [/* @__PURE__ */ jsx("div", {
								className: "h-9 w-9 rounded-md bg-rocsta-green/10 flex items-center justify-center text-rocsta-green",
								children: /* @__PURE__ */ jsx(q.icon, { className: "size-4" })
							}), /* @__PURE__ */ jsx(ArrowRight, { className: "size-4 text-muted-foreground group-hover:text-rocsta-green group-hover:translate-x-0.5 transition-all" })]
						}),
						/* @__PURE__ */ jsx("h3", {
							className: "text-sm font-extrabold mb-1 text-foreground",
							children: q.label
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: q.desc
						})
					]
				}, q.to + q.label))
			})]
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mb-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: t("home.popular")
				}), /* @__PURE__ */ jsx(Link, {
					to: "/parts",
					className: "text-sm font-bold text-rocsta-green hover:underline",
					children: t("home.popular.viewAll")
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "overflow-hidden rounded-xl border border-border bg-card shadow-sm",
				children: /* @__PURE__ */ jsx("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ jsxs("table", {
						className: "w-full border-collapse text-left",
						children: [/* @__PURE__ */ jsx("thead", {
							className: "bg-muted/65 border-b border-border",
							children: /* @__PURE__ */ jsxs("tr", { children: [
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
									children: t("home.popular.part")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
									children: t("home.popular.oem")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
									children: t("home.popular.equiv")
								}),
								/* @__PURE__ */ jsx("th", {
									className: "px-6 py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-right",
									children: t("home.popular.status")
								})
							] })
						}), /* @__PURE__ */ jsx("tbody", {
							className: "divide-y divide-border/60",
							children: popularParts.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", {
								colSpan: 4,
								className: "px-6 py-10 text-center text-sm text-muted-foreground",
								children: t("home.noPopularParts")
							}) }) : popularParts.map((p) => {
								const name = localize(p.name, language);
								const desc = localize(p.description, language);
								const equiv = p.equiv.slice(0, 2).join(" / ");
								return /* @__PURE__ */ jsxs("tr", {
									className: "hover:bg-muted/40 transition-colors cursor-pointer",
									onClick: () => navigate({
										to: "/parts",
										search: { search: name }
									}),
									children: [
										/* @__PURE__ */ jsxs("td", {
											className: "px-6 py-4",
											children: [/* @__PURE__ */ jsx("div", {
												className: "font-extrabold text-sm text-foreground",
												children: name
											}), /* @__PURE__ */ jsx("div", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: desc
											})]
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4 font-mono text-xs font-semibold text-foreground",
											children: p.oem
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4 text-xs text-muted-foreground font-medium",
											children: equiv
										}),
										/* @__PURE__ */ jsx("td", {
											className: "px-6 py-4 text-right",
											children: p.status === "verified" ? /* @__PURE__ */ jsx("span", {
												className: "inline-flex items-center rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-700 dark:text-green-400",
												children: t("home.popular.verified")
											}) : /* @__PURE__ */ jsx("span", {
												className: "inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700 dark:text-amber-400",
												children: t("home.popular.requiresMod")
											})
										})
									]
								}, p.id);
							})
						})]
					})
				})
			})]
		}),
		/* @__PURE__ */ jsx(MaintenanceSchedule, {}),
		/* @__PURE__ */ jsxs("section", {
			className: "mb-12",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-6 flex items-center justify-between",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold tracking-tight text-foreground",
					children: t("home.guides.recent")
				}), /* @__PURE__ */ jsx(Link, {
					to: "/guides",
					className: "text-sm font-bold text-rocsta-green hover:underline",
					children: t("home.guides.all")
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-6",
				children: recentGuides.map((guide) => /* @__PURE__ */ jsx(GuideCard, {
					img: guide.image || "",
					level: guide.level,
					time: guide.time,
					title: localize(guide.title, language),
					desc: localize(guide.description, language),
					contributions: guide.contributions,
					advanced: guide.level !== "Principiante"
				}, guide.id))
			})]
		}),
		/* @__PURE__ */ jsx(CommunityGallery, {}),
		/* @__PURE__ */ jsxs("section", {
			className: "rounded-2xl bg-rocsta-dark p-6 md:p-8 text-white shadow-md",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "mb-8 flex items-end justify-between gap-4 flex-wrap",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "text-2xl font-bold",
					children: t("home.issues.timeline")
				}), /* @__PURE__ */ jsx("p", {
					className: "text-slate-400 text-sm mt-0.5",
					children: t("home.issues.desc")
				})] }), /* @__PURE__ */ jsx(Link, {
					to: "/problems",
					className: "rounded-md bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20 transition-all shadow-sm border border-white/5",
					children: t("home.issues.viewAll")
				})]
			}), /* @__PURE__ */ jsx("div", {
				className: "space-y-1",
				children: popularProblems.map((i) => {
					const title = localize(i.title, language);
					const symptom = localize(i.symptom, language);
					return /* @__PURE__ */ jsxs("div", {
						onClick: () => navigate({
							to: "/problems",
							search: { search: title.substring(0, 15) }
						}),
						className: "flex items-start gap-4 border-b border-white/10 py-4 last:border-0 cursor-pointer hover:bg-white/[0.03] px-2 rounded-lg transition-colors",
						children: [/* @__PURE__ */ jsx("div", {
							className: [
								"h-10 w-10 shrink-0 rounded flex items-center justify-center font-bold",
								i.severity === "critical" && "bg-red-500/20 text-red-400",
								i.severity === "warn" && "bg-amber-500/20 text-amber-400",
								i.severity === "info" && "bg-blue-500/20 text-blue-400"
							].filter(Boolean).join(" "),
							children: i.severity === "info" ? "i" : "!"
						}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
							className: "font-bold text-slate-100 hover:text-rocsta-green transition-colors",
							children: title
						}), /* @__PURE__ */ jsx("p", {
							className: "text-sm text-slate-400 mt-1 leading-relaxed",
							children: symptom
						})] })]
					}, i.id);
				})
			})]
		})
	] });
}
var LEVEL_KEYS = {
	Principiante: "guides.level.beginner",
	Intermedio: "guides.level.intermediate",
	Avanzado: "guides.level.advanced"
};
function GuideCard({ img, level, time, title, desc, contributions, advanced }) {
	const { t } = useLanguage();
	return /* @__PURE__ */ jsxs(Link, {
		to: "/guides",
		search: { search: title },
		className: "group overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg block cursor-pointer",
		children: [/* @__PURE__ */ jsx("div", {
			className: "aspect-video bg-muted overflow-hidden",
			children: /* @__PURE__ */ jsx("img", {
				src: img,
				alt: title,
				width: 1280,
				height: 720,
				loading: "lazy",
				className: "w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
			})
		}), /* @__PURE__ */ jsxs("div", {
			className: "p-6",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-2 mb-2",
					children: [/* @__PURE__ */ jsx("span", {
						className: ["rounded px-2 py-0.5 text-[10px] font-bold uppercase", advanced ? "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400" : "bg-rocsta-green/10 text-rocsta-green"].join(" "),
						children: t(LEVEL_KEYS[level])
					}), /* @__PURE__ */ jsx("span", {
						className: "text-[10px] font-bold text-muted-foreground uppercase",
						children: time
					})]
				}),
				/* @__PURE__ */ jsx("h3", {
					className: "text-lg font-extrabold text-foreground group-hover:text-rocsta-green transition-colors leading-snug",
					children: title
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2",
					children: desc
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-4 flex items-center justify-between border-t border-border/40 pt-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "text-xs font-bold uppercase tracking-wider text-rocsta-accent",
						children: t("home.guides.read")
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-[10px] text-muted-foreground font-semibold",
						children: [
							contributions,
							" ",
							t("home.guides.contribs")
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { Index as component };
