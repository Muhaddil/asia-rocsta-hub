import { n as useLanguage, t as LanguageProvider } from "./language-provider-DC0kt9mf.js";
import { t as parts } from "./parts-CLQe3VeO.js";
import { n as compatibilities, t as Route$4 } from "./compatibility-CliJfuCo.js";
import { t as guides } from "./guides-DNGOFuzs.js";
import { t as problems } from "./problems-BEUt0oUr.js";
import { n as manuals, t as Route$5 } from "./manuals-hhxuwyUT.js";
import { t as localize } from "./types-CK3cC6px.js";
import { n as cn, t as Input } from "./input-CdTd0dHn.js";
import { n as DialogContent, t as Dialog } from "./dialog-nSNR3NZm.js";
import { t as Route$6 } from "./problems-Bv1OZ9Ca.js";
import { t as Route$7 } from "./parts-B6qyhB1E.js";
import { t as Route$8 } from "./guides-B1i8fSnO.js";
import { t as Route$9 } from "./community-EHmpW2N0.js";
import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, useNavigate, useRouter } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertTriangle, BookOpen, FileText, GitCompare, Home, Menu, Moon, Search, Sparkles, Sun, Users, Wrench, X } from "lucide-react";
import * as SheetPrimitive from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
//#region src/styles.css?url
var styles_default = "/assets/styles-BuYZKZB8.css";
//#endregion
//#region src/components/theme-provider.tsx
var ThemeCtx = createContext(null);
function getSystemTheme() {
	return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function ThemeProvider({ children }) {
	const [theme, setThemeState] = useState("system");
	const [resolved, setResolved] = useState("light");
	useEffect(() => {
		const stored = localStorage.getItem("rocsta-theme");
		const initialTheme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
		setThemeState(initialTheme);
		setResolved(initialTheme === "system" ? getSystemTheme() : initialTheme);
	}, []);
	useEffect(() => {
		document.documentElement.classList.toggle("dark", resolved === "dark");
	}, [resolved]);
	useEffect(() => {
		if (theme !== "system") return;
		const media = window.matchMedia("(prefers-color-scheme: dark)");
		const listener = () => {
			setResolved(getSystemTheme());
		};
		media.addEventListener("change", listener);
		return () => {
			media.removeEventListener("change", listener);
		};
	}, [theme]);
	const setTheme = (t) => {
		localStorage.setItem("rocsta-theme", t);
		setThemeState(t);
		if (t === "system") setResolved(getSystemTheme());
		else setResolved(t);
	};
	return /* @__PURE__ */ jsx(ThemeCtx.Provider, {
		value: {
			theme,
			resolved,
			setTheme
		},
		children
	});
}
function useTheme() {
	const ctx = useContext(ThemeCtx);
	if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
	return ctx;
}
//#endregion
//#region src/data/search.ts
/** Normalizes a string by lowercasing and stripping diacritics. */
function normalizeString(str) {
	return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
/** Joins all localized variants of a value for indexing across languages. */
function indexed(value) {
	if (!value) return "";
	if (typeof value === "string") return value;
	return Object.values(value).join(" ");
}
/**
* Performs a global unified search across all static collections.
* Indexing is language-agnostic; display strings use the active language.
*/
function globalSearch(query, lang = "es") {
	const cleanQuery = normalizeString(query.trim());
	if (!cleanQuery) return [];
	const results = [];
	for (const part of parts) if (normalizeString([
		indexed(part.name),
		part.oem,
		indexed(part.description),
		part.equiv.join(" "),
		(part.refs || []).join(" ")
	].join(" ")).includes(cleanQuery)) {
		const name = localize(part.name, lang);
		results.push({
			type: "part",
			id: part.id,
			title: name,
			description: `OEM: ${part.oem} | Cat: ${part.category} | Motor: ${part.motor}`,
			to: "/parts",
			params: {
				search: name,
				category: part.category
			}
		});
	}
	for (const comp of compatibilities) if (normalizeString([
		indexed(comp.rocstaPart),
		indexed(comp.donorVehicle),
		comp.donorRef,
		indexed(comp.notes)
	].join(" ")).includes(cleanQuery)) {
		const rocstaPart = localize(comp.rocstaPart, lang);
		const donorVehicle = localize(comp.donorVehicle, lang);
		results.push({
			type: "compatibility",
			id: comp.id,
			title: `Equivalencia: ${rocstaPart}`,
			description: `Donante: ${donorVehicle} (${comp.type})`,
			to: "/compatibility",
			params: {
				search: rocstaPart,
				category: comp.category
			}
		});
	}
	for (const guide of guides) if (normalizeString([
		indexed(guide.title),
		indexed(guide.description),
		guide.tools.map((t) => indexed(t)).join(" "),
		guide.tags.join(" ")
	].join(" ")).includes(cleanQuery)) results.push({
		type: "guide",
		id: guide.id,
		title: localize(guide.title, lang),
		description: `Guía (${guide.level}) | ${guide.time} | Motor: ${guide.motor}`,
		to: "/guides",
		params: { slug: guide.slug }
	});
	for (const prob of problems) if (normalizeString([
		indexed(prob.title),
		indexed(prob.symptom),
		indexed(prob.cause),
		indexed(prob.solution)
	].join(" ")).includes(cleanQuery)) {
		const title = localize(prob.title, lang);
		const symptom = localize(prob.symptom, lang);
		results.push({
			type: "problem",
			id: prob.id,
			title: `Fallo: ${title}`,
			description: `Severidad: ${prob.severity} | ${symptom.substring(0, 80)}...`,
			to: "/problems",
			params: { search: title }
		});
	}
	for (const man of manuals) if (normalizeString([
		indexed(man.title),
		indexed(man.description),
		man.year || ""
	].join(" ")).includes(cleanQuery)) {
		const title = localize(man.title, lang);
		results.push({
			type: "manual",
			id: man.id,
			title,
			description: `Documento (${man.format.toUpperCase()}) | Idioma: ${man.language.toUpperCase()}`,
			to: "/manuals",
			params: { search: title }
		});
	}
	return results.slice(0, 20);
}
//#endregion
//#region src/components/ui/sheet.tsx
var Sheet = SheetPrimitive.Root;
var SheetTrigger = SheetPrimitive.Trigger;
var SheetPortal = SheetPrimitive.Portal;
var SheetOverlay = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Overlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = React.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SheetPortal, { children: [/* @__PURE__ */ jsx(SheetOverlay, {}), /* @__PURE__ */ jsxs(SheetPrimitive.Content, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ jsxs(SheetPrimitive.Close, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ jsx(X, { className: "h-4 w-4" }), /* @__PURE__ */ jsx("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = SheetPrimitive.Content.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ jsx("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Title, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = SheetPrimitive.Title.displayName;
var SheetDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SheetPrimitive.Description, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = SheetPrimitive.Description.displayName;
//#endregion
//#region src/components/site-header.tsx
var SUGGESTED_SEARCHES = [
	{
		term: {
			es: "Bomba inyectora",
			en: "Injection pump"
		},
		typeKey: "header.badgeSwap"
	},
	{
		term: {
			es: "Correa de distribución",
			en: "Timing belt"
		},
		typeKey: "header.badgeGuide"
	},
	{
		term: {
			es: "Pastillas de freno",
			en: "Brake pads"
		},
		typeKey: "header.badgePart"
	},
	{
		term: {
			es: "Caja de dirección",
			en: "Steering box"
		},
		typeKey: "header.badgeIssue"
	}
];
var MOBILE_CATEGORIES = (t) => [
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
function SiteHeader() {
	const { resolved, setTheme } = useTheme();
	const navigate = useNavigate();
	const { t, language, setLanguage } = useLanguage();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	const [searchOpen, setSearchOpen] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [query, setQuery] = useState("");
	useEffect(() => {
		const down = (e) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setSearchOpen((o) => !o);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);
	const results = useMemo(() => {
		return globalSearch(query, language);
	}, [query, language]);
	const handleResultClick = (item) => {
		setSearchOpen(false);
		setQuery("");
		navigate({
			to: item.to,
			search: item.params
		});
	};
	const getResultIcon = (type) => {
		switch (type) {
			case "part": return /* @__PURE__ */ jsx(Wrench, { className: "size-4 text-green-500 shrink-0" });
			case "compatibility": return /* @__PURE__ */ jsx(GitCompare, { className: "size-4 text-blue-500 shrink-0" });
			case "guide": return /* @__PURE__ */ jsx(BookOpen, { className: "size-4 text-amber-500 shrink-0" });
			case "problem": return /* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-red-500 shrink-0" });
			case "manual": return /* @__PURE__ */ jsx(FileText, { className: "size-4 text-purple-500 shrink-0" });
		}
	};
	const getResultBadgeLabel = (type) => {
		switch (type) {
			case "part": return t("header.badgePart");
			case "compatibility": return t("header.badgeSwap");
			case "guide": return t("header.badgeGuide");
			case "problem": return t("header.badgeIssue");
			case "manual": return t("header.badgeManual");
		}
	};
	return /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("nav", {
		className: "sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex min-w-0 items-center gap-6 xl:gap-8",
				children: [/* @__PURE__ */ jsxs(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ jsx("div", {
						className: "h-8 w-8 rounded bg-rocsta-green flex items-center justify-center",
						children: /* @__PURE__ */ jsx("span", {
							className: "text-primary-foreground font-bold text-xs",
							children: "AR"
						})
					}), /* @__PURE__ */ jsxs("span", {
						className: "text-lg font-bold tracking-tight uppercase",
						children: ["Rocsta", /* @__PURE__ */ jsx("span", {
							className: "text-rocsta-accent",
							children: "Archive"
						})]
					})]
				}), /* @__PURE__ */ jsxs("div", {
					className: "hidden md:flex items-center gap-4 xl:gap-6 text-sm font-medium text-muted-foreground whitespace-nowrap",
					children: [
						/* @__PURE__ */ jsx(Link, {
							to: "/parts",
							className: "hover:text-foreground transition-colors",
							children: t("nav.parts")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/compatibility",
							className: "hover:text-foreground transition-colors",
							children: t("nav.compatibility")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/guides",
							className: "hover:text-foreground transition-colors",
							children: t("nav.guides")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/problems",
							className: "hover:text-foreground transition-colors",
							children: t("nav.problems")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/manuals",
							className: "hover:text-foreground transition-colors",
							children: t("nav.manuals")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/community",
							className: "hover:text-foreground transition-colors",
							children: t("nav.community")
						}),
						/* @__PURE__ */ jsx(Link, {
							to: "/about",
							className: "hover:text-foreground transition-colors",
							children: t("nav.about")
						})
					]
				})]
			}), /* @__PURE__ */ jsxs("div", {
				className: "ml-auto flex shrink-0 items-center gap-2 xl:gap-3",
				children: [
					/* @__PURE__ */ jsxs("button", {
						onClick: () => setSearchOpen(true),
						className: "relative hidden lg:flex h-9 w-64 xl:w-72 items-center justify-between rounded-md border border-border bg-muted/50 px-3 text-xs text-muted-foreground hover:bg-muted/80 transition-colors",
						children: [/* @__PURE__ */ jsxs("span", {
							className: "flex items-center gap-2",
							children: [
								/* @__PURE__ */ jsx(Search, { className: "size-4" }),
								" ",
								t("search.placeholder")
							]
						}), /* @__PURE__ */ jsx("kbd", {
							className: "inline-flex items-center rounded border border-border bg-background px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest text-muted-foreground",
							children: "⌘K"
						})]
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setSearchOpen(true),
						"aria-label": t("header.ariaSearch"),
						className: "lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors",
						children: /* @__PURE__ */ jsx(Search, { className: "size-4" })
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setTheme(resolved === "dark" ? "light" : "dark"),
						"aria-label": t("header.ariaTheme"),
						className: "h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors",
						children: !mounted ? /* @__PURE__ */ jsx("div", { className: "size-4" }) : resolved === "dark" ? /* @__PURE__ */ jsx(Sun, { className: "size-4" }) : /* @__PURE__ */ jsx(Moon, { className: "size-4" })
					}),
					/* @__PURE__ */ jsx("button", {
						onClick: () => setLanguage(language === "es" ? "en" : "es"),
						"aria-label": language === "es" ? "Switch to English" : "Cambiar a Español",
						className: "h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors text-xs font-extrabold uppercase tracking-wider",
						children: language === "es" ? "EN" : "ES"
					}),
					/* @__PURE__ */ jsxs(Sheet, {
						open: mobileMenuOpen,
						onOpenChange: setMobileMenuOpen,
						children: [/* @__PURE__ */ jsx(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ jsx("button", {
								className: "md:hidden h-9 w-9 inline-flex items-center justify-center rounded-md border border-border hover:bg-muted transition-colors",
								"aria-label": t("header.ariaMenu"),
								children: /* @__PURE__ */ jsx(Menu, { className: "size-4" })
							})
						}), /* @__PURE__ */ jsxs(SheetContent, {
							side: "right",
							className: "w-[280px] bg-card border-border p-6 flex flex-col justify-between",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ jsx(SheetHeader, {
										className: "text-left pb-4 border-b border-border/60",
										children: /* @__PURE__ */ jsxs(SheetTitle, {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ jsx("div", {
												className: "h-7 w-7 rounded bg-rocsta-green flex items-center justify-center text-primary-foreground font-bold text-xs",
												children: "AR"
											}), /* @__PURE__ */ jsxs("span", {
												className: "text-base font-bold uppercase tracking-tight",
												children: ["Rocsta", /* @__PURE__ */ jsx("span", {
													className: "text-rocsta-accent",
													children: "Archive"
												})]
											})]
										})
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-4",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
											children: t("header.sections")
										}), /* @__PURE__ */ jsxs("div", {
											className: "grid grid-cols-1 gap-2 text-sm font-semibold text-foreground pl-1",
											children: [
												/* @__PURE__ */ jsxs(Link, {
													to: "/",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(Home, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileHome")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/parts",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(Wrench, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileParts")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/compatibility",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(GitCompare, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileCompat")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/guides",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(BookOpen, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileGuides")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/problems",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(AlertTriangle, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileProblems")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/manuals",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(FileText, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileManuals")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/community",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(Users, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileCommunity")
													]
												}),
												/* @__PURE__ */ jsxs(Link, {
													to: "/about",
													onClick: () => setMobileMenuOpen(false),
													className: "flex items-center gap-2 py-1.5 hover:text-rocsta-green transition-colors",
													children: [
														/* @__PURE__ */ jsx(FileText, { className: "size-4 text-rocsta-accent" }),
														" ",
														t("header.mobileAbout")
													]
												})
											]
										})]
									}),
									/* @__PURE__ */ jsxs("div", {
										className: "space-y-3 pt-2",
										children: [/* @__PURE__ */ jsx("h4", {
											className: "text-[10px] font-bold text-muted-foreground uppercase tracking-widest",
											children: t("header.systems")
										}), /* @__PURE__ */ jsx("div", {
											className: "grid grid-cols-1 gap-1 text-xs text-muted-foreground font-medium pl-1",
											children: MOBILE_CATEGORIES(t).map((cat, i) => /* @__PURE__ */ jsx(Link, {
												to: cat.to,
												search: { category: cat.tag },
												onClick: () => setMobileMenuOpen(false),
												className: "py-1 hover:text-rocsta-green transition-colors",
												children: cat.label
											}, i))
										})]
									})
								]
							}), /* @__PURE__ */ jsxs("div", {
								className: "text-[10px] text-muted-foreground font-semibold text-center border-t border-border/40 pt-4",
								children: [
									"Asia Rocsta Archive © ",
									(/* @__PURE__ */ new Date()).getFullYear(),
									/* @__PURE__ */ jsx("div", {
										className: "text-[9px] font-normal text-muted-foreground/60 mt-0.5",
										children: t("header.tagline")
									})
								]
							})]
						})]
					})
				]
			})]
		})
	}), /* @__PURE__ */ jsx(Dialog, {
		open: searchOpen,
		onOpenChange: setSearchOpen,
		children: /* @__PURE__ */ jsxs(DialogContent, {
			className: "p-0 max-w-xl border-border bg-card shadow-2xl overflow-hidden sm:rounded-2xl gap-0",
			children: [
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center border-b border-border/80 px-4 py-3",
					children: [
						/* @__PURE__ */ jsx(Search, { className: "size-4.5 text-muted-foreground shrink-0" }),
						/* @__PURE__ */ jsx(Input, {
							type: "text",
							autoFocus: true,
							placeholder: t("header.searchDialogPlaceholder"),
							value: query,
							onChange: (e) => setQuery(e.target.value),
							className: "ml-3 h-8 w-full border-0 bg-transparent p-0 text-sm shadow-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus-visible:border-0 select-none"
						}),
						query && /* @__PURE__ */ jsx("button", {
							onClick: () => setQuery(""),
							className: "text-xs text-muted-foreground hover:text-foreground font-bold px-1.5 py-0.5 rounded bg-muted font-mono",
							children: "ESC"
						})
					]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "max-h-[380px] overflow-y-auto py-2",
					children: [!query && /* @__PURE__ */ jsxs("div", {
						className: "px-4 py-2 space-y-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1",
							children: [
								/* @__PURE__ */ jsx(Sparkles, { className: "size-3 text-rocsta-accent" }),
								" ",
								t("search.suggested")
							]
						}), /* @__PURE__ */ jsx("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1",
							children: SUGGESTED_SEARCHES.map((s, idx) => /* @__PURE__ */ jsxs("button", {
								onClick: () => setQuery(s.term[language] || s.term["es"]),
								className: "flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 p-2.5 text-left text-xs hover:bg-muted/65 hover:border-rocsta-green/20 transition-all",
								children: [/* @__PURE__ */ jsx("span", {
									className: "font-semibold text-foreground",
									children: s.term[language] || s.term["es"]
								}), /* @__PURE__ */ jsx("span", {
									className: "text-[9px] font-bold uppercase text-muted-foreground",
									children: t(s.typeKey)
								})]
							}, idx))
						})]
					}), query && /* @__PURE__ */ jsxs("div", {
						className: "space-y-1 px-2",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "px-2 pb-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider",
							children: [
								t("search.results"),
								" (",
								results.length,
								")"
							]
						}), results.length > 0 ? results.map((item) => /* @__PURE__ */ jsxs("button", {
							onClick: () => handleResultClick(item),
							className: "w-full flex items-start gap-3 rounded-lg px-3 py-2.5 text-left text-xs hover:bg-muted/50 transition-colors",
							children: [/* @__PURE__ */ jsx("div", {
								className: "mt-0.5",
								children: getResultIcon(item.type)
							}), /* @__PURE__ */ jsxs("div", {
								className: "flex-1 min-w-0",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ jsx("span", {
										className: "font-extrabold text-foreground truncate",
										children: item.title
									}), /* @__PURE__ */ jsx("span", {
										className: "shrink-0 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60",
										children: getResultBadgeLabel(item.type)
									})]
								}), /* @__PURE__ */ jsx("p", {
									className: "text-[11px] text-muted-foreground truncate mt-0.5",
									children: item.description
								})]
							})]
						}, item.id)) : /* @__PURE__ */ jsxs("div", {
							className: "py-12 text-center text-xs text-muted-foreground",
							children: [
								t("search.noMatches"),
								" \"",
								/* @__PURE__ */ jsx("strong", {
									className: "text-foreground",
									children: query
								}),
								"\""
							]
						})]
					})]
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "flex items-center justify-between border-t border-border/70 bg-muted/40 px-4 py-2 text-[10px] text-muted-foreground font-semibold",
					children: [/* @__PURE__ */ jsx("span", {
						className: "flex items-center gap-1",
						children: t("search.info")
					}), /* @__PURE__ */ jsx("kbd", {
						className: "font-mono text-[9px] px-1 py-0.5 rounded bg-muted border border-border/60",
						children: t("search.esc")
					})]
				})
			]
		})
	})] });
}
//#endregion
//#region src/components/site-footer.tsx
function SiteFooter() {
	const { t } = useLanguage();
	const [mounted, setMounted] = useState(false);
	useEffect(() => {
		setMounted(true);
	}, []);
	return /* @__PURE__ */ jsx("footer", {
		className: "border-t border-border bg-card mt-12",
		children: /* @__PURE__ */ jsxs("div", {
			className: "mx-auto max-w-7xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "text-xs text-muted-foreground",
				children: [
					"© ",
					mounted ? (/* @__PURE__ */ new Date()).getFullYear() : 2026,
					" Asia Rocsta Archive · ",
					t("footer.tagline")
				]
			}), /* @__PURE__ */ jsxs("div", {
				className: "flex items-center gap-6",
				children: [
					/* @__PURE__ */ jsx("a", {
						href: "/about",
						className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
						children: t("nav.about")
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#",
						className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
						children: t("footer.docs")
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#",
						className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
						children: t("footer.api")
					}),
					/* @__PURE__ */ jsx("a", {
						href: "#",
						className: "text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors",
						children: t("footer.contribute")
					})
				]
			})]
		})
	});
}
//#endregion
//#region src/routes/__root.tsx
function LangSync() {
	const { language } = useLanguage();
	useEffect(() => {
		document.documentElement.lang = language;
	}, [language]);
	return null;
}
function NotFoundComponent() {
	const { t } = useLanguage();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("p", {
					className: "font-mono text-xs uppercase tracking-widest text-rocsta-accent mb-3",
					children: "Error 404"
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "text-4xl font-extrabold text-foreground tracking-tight",
					children: t("notFound.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: t("notFound.desc")
				}),
				/* @__PURE__ */ jsx("div", {
					className: "mt-6",
					children: /* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-rocsta-green px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90",
						children: t("notFound.back")
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const { t } = useLanguage();
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: t("error.title")
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: t("error.desc")
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-rocsta-green px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90",
						children: t("error.retry")
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted",
						children: t("nav.home")
					})]
				})
			]
		})
	});
}
var Route$3 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Asia Rocsta Archive — Wiki técnica, piezas y guías" },
			{
				name: "description",
				content: "Plataforma de referencia para el Asia Rocsta: base de datos de piezas, equivalencias OEM, guías de reparación, manuales y comunidad de restauradores."
			},
			{
				name: "author",
				content: "Asia Rocsta Archive"
			},
			{
				property: "og:title",
				content: "Asia Rocsta Archive"
			},
			{
				property: "og:description",
				content: "Wiki técnica + foro + base de datos mecánica dedicada exclusivamente al Asia Rocsta."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "es",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsxs("head", { children: [
			/* @__PURE__ */ jsx(HeadContent, {}),
			/* @__PURE__ */ jsx("script", { dangerouslySetInnerHTML: { __html: `
              (function() {
                try {
                  const stored = localStorage.getItem("rocsta-theme");
                  const getSystem = function() {
                    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
                  };
                  
                  let theme = "system";
                  if (
                    stored === "light" ||
                    stored === "dark" ||
                    stored === "system"
                  ) {
                    theme = stored;
                  }
                  
                  const resolved = theme === "system" ? getSystem() : theme;
                  document.documentElement.classList.toggle("dark", resolved === "dark");
                } catch (e) {}
              })();
            ` } }),
			/* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: `
#loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: var(--background, #f7f8fa);
  color: var(--foreground, #1a1c2e);
  transition: opacity 0.35s ease;
}
.dark #loading-overlay {
  background: var(--background, #12131c);
  color: var(--foreground, #eceded);
}
#loading-overlay .logo-box {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: var(--rocsta-green, #3e7a4e);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}
#loading-overlay .logo-box span {
  color: var(--primary-foreground, #f7f8fa);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: -0.02em;
}
#loading-overlay .spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border, #d6d8e0);
  border-top-color: var(--rocsta-green, #3e7a4e);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}
@keyframes spin { to { transform: rotate(360deg); } }
#loading-overlay .loading-text {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--muted-foreground, #6b6f82);
  letter-spacing: 0.02em;
}
            ` } })
		] }), /* @__PURE__ */ jsxs("body", { children: [
			/* @__PURE__ */ jsxs("div", {
				id: "loading-overlay",
				children: [/* @__PURE__ */ jsx("div", {
					className: "logo-box",
					children: /* @__PURE__ */ jsx("span", { children: "AR" })
				}), /* @__PURE__ */ jsx("div", { className: "spinner" })]
			}),
			/* @__PURE__ */ jsxs(LanguageProvider, { children: [/* @__PURE__ */ jsx(LangSync, {}), children] }),
			/* @__PURE__ */ jsx(Scripts, {})
		] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$3.useRouteContext();
	const [ready, setReady] = useState(false);
	const TRANSITION_DELAY = 1e3;
	useEffect(() => {
		const start = performance.now();
		const MIN_EXTRA_DELAY = 1e3;
		const finishLoading = async () => {
			await document.fonts.ready;
			await new Promise((resolve) => {
				if ("requestIdleCallback" in window) requestIdleCallback(() => resolve());
				else setTimeout(resolve, 0);
			});
			const elapsed = performance.now() - start;
			const remaining = Math.max(MIN_EXTRA_DELAY - elapsed, 0);
			setTimeout(() => {
				const el = document.getElementById("loading-overlay");
				if (el) {
					el.style.opacity = "0";
					el.style.pointerEvents = "none";
					setReady(true);
					setTimeout(() => {
						el.remove();
					}, TRANSITION_DELAY);
				} else setReady(true);
			}, remaining);
		};
		finishLoading();
	}, []);
	return /* @__PURE__ */ jsx("div", {
		style: {
			opacity: ready ? 1 : 0,
			transition: `opacity ${TRANSITION_DELAY}ms ease-in-out`
		},
		children: /* @__PURE__ */ jsx(QueryClientProvider, {
			client: queryClient,
			children: /* @__PURE__ */ jsx(ThemeProvider, { children: /* @__PURE__ */ jsxs("div", {
				className: "min-h-screen flex flex-col bg-background text-foreground",
				children: [
					/* @__PURE__ */ jsx(SiteHeader, {}),
					/* @__PURE__ */ jsx("div", {
						className: "flex-1",
						children: /* @__PURE__ */ jsx(Outlet, {})
					}),
					/* @__PURE__ */ jsx(SiteFooter, {})
				]
			}) })
		})
	});
}
//#endregion
//#region src/routes/sitemap[.]xml.ts
var BASE_URL = "";
var Route$2 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[
			{
				path: "/",
				changefreq: "weekly",
				priority: "1.0"
			},
			{
				path: "/parts",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/compatibility",
				changefreq: "weekly",
				priority: "0.9"
			},
			{
				path: "/guides",
				changefreq: "weekly",
				priority: "0.8"
			},
			{
				path: "/problems",
				changefreq: "weekly",
				priority: "0.8"
			},
			{
				path: "/manuals",
				changefreq: "monthly",
				priority: "0.7"
			},
			{
				path: "/community",
				changefreq: "daily",
				priority: "0.6"
			}
		].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter$1 = () => import("./about-DmiAClfw.js");
var Route$1 = createFileRoute("/about")({
	head: () => ({
		meta: [
			{ title: "Acerca del Asia Rocsta — Historia, motores y dimensiones" },
			{
				name: "description",
				content: "Análisis técnico en profundidad del Asia Rocsta (1990–1997): origen militar KIA KM410, motores Mazda F8 y R2, dimensiones SWB/LWB, suspensiones, capacidades off-road y variantes."
			},
			{
				property: "og:title",
				content: "Acerca del Asia Rocsta"
			},
			{
				property: "og:description",
				content: "Origen, motorizaciones, dimensiones, frenos, capacidades off-road y línea temporal del 4x4 clásico coreano de Asia Motors (KIA)."
			},
			{
				property: "og:url",
				content: "/about"
			},
			{
				property: "og:type",
				content: "article"
			}
		],
		links: [{
			rel: "canonical",
			href: "/about"
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "Vehicle",
				name: "Asia Rocsta",
				manufacturer: {
					"@type": "Organization",
					name: "Asia Motors (KIA)"
				},
				productionDate: "1990/1997",
				vehicleConfiguration: "4x4 SUV",
				fuelType: ["Gasoline", "Diesel"]
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter = () => import("./routes-DW8TfPg7.js");
var Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Asia Rocsta Archive — Wiki técnica y base de datos de piezas" },
			{
				name: "description",
				content: "Todo sobre el Asia Rocsta: piezas, equivalencias OEM, guías de reparación, problemas comunes y comunidad de restauradores."
			},
			{
				property: "og:title",
				content: "Asia Rocsta Archive"
			},
			{
				property: "og:url",
				content: "/"
			}
		],
		links: [{
			rel: "canonical",
			href: "/"
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
//#region src/routeTree.gen.ts
var SitemapDotxmlRoute = Route$2.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$3
});
var ProblemsRoute = Route$6.update({
	id: "/problems",
	path: "/problems",
	getParentRoute: () => Route$3
});
var PartsRoute = Route$7.update({
	id: "/parts",
	path: "/parts",
	getParentRoute: () => Route$3
});
var ManualsRoute = Route$5.update({
	id: "/manuals",
	path: "/manuals",
	getParentRoute: () => Route$3
});
var GuidesRoute = Route$8.update({
	id: "/guides",
	path: "/guides",
	getParentRoute: () => Route$3
});
var CompatibilityRoute = Route$4.update({
	id: "/compatibility",
	path: "/compatibility",
	getParentRoute: () => Route$3
});
var CommunityRoute = Route$9.update({
	id: "/community",
	path: "/community",
	getParentRoute: () => Route$3
});
var AboutRoute = Route$1.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	AboutRoute,
	CommunityRoute,
	CompatibilityRoute,
	GuidesRoute,
	ManualsRoute,
	PartsRoute,
	ProblemsRoute,
	SitemapDotxmlRoute
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
