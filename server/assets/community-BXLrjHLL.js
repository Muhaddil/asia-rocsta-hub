import { n as useLanguage } from "./language-provider-DC0kt9mf.js";
import { n as cn, t as Input } from "./input-CdTd0dHn.js";
import { t as Route } from "./community-EHmpW2N0.js";
import { n as PageShell, t as Crumbs } from "./page-shell-BXSgiXDA.js";
import { t as api } from "./api-ClaFnBZV.js";
import * as React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AlertCircle, Award, BookOpen, Bug, Camera, Check, ChevronDown, ChevronUp, FileX, GitCompare, Heart, Loader2, MessageSquare, Package, Send, Users } from "lucide-react";
import { z } from "zod";
import * as SelectPrimitive from "@radix-ui/react-select";
//#region src/components/ui/select.tsx
var Select = SelectPrimitive.Root;
var SelectValue = SelectPrimitive.Value;
var SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Trigger, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ jsx(SelectPrimitive.Icon, {
		asChild: true,
		children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
var SelectScrollUpButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollUpButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;
var SelectScrollDownButton = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.ScrollDownButton, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ jsx(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;
var SelectContent = React.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(SelectPrimitive.Content, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ jsx(SelectScrollUpButton, {}),
		/* @__PURE__ */ jsx(SelectPrimitive.Viewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ jsx(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectPrimitive.Content.displayName;
var SelectLabel = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Label, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectPrimitive.Label.displayName;
var SelectItem = React.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxs(SelectPrimitive.Item, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ jsx("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })]
}));
SelectItem.displayName = SelectPrimitive.Item.displayName;
var SelectSeparator = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(SelectPrimitive.Separator, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;
//#endregion
//#region src/routes/community.tsx?tsr-split=component
z.object({ tab: z.enum([
	"comp",
	"part",
	"guide",
	"problem",
	"bug",
	"partwrong",
	"photo"
]).optional() });
var TABS = [
	{
		key: "comp",
		icon: GitCompare,
		labelKey: "comm.form.tab.comp"
	},
	{
		key: "part",
		icon: Package,
		labelKey: "comm.form.tab.part"
	},
	{
		key: "guide",
		icon: BookOpen,
		labelKey: "comm.form.tab.guide"
	},
	{
		key: "problem",
		icon: AlertCircle,
		labelKey: "comm.form.tab.problem"
	},
	{
		key: "bug",
		icon: Bug,
		labelKey: "comm.form.tab.bug"
	},
	{
		key: "partwrong",
		icon: FileX,
		labelKey: "comm.form.tab.partwrong"
	},
	{
		key: "photo",
		icon: Camera,
		labelKey: "comm.form.tab.photo"
	}
];
function Field({ label, children }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ jsx("label", {
			className: "text-xs font-bold text-muted-foreground uppercase",
			children: label
		}), children]
	});
}
function renderInput(name, value, placeholder, onChange, opts) {
	const { type, required, ...rest } = opts || {};
	return /* @__PURE__ */ jsx(Input, {
		type: type || "text",
		id: name,
		name,
		required: required ?? true,
		value,
		onChange,
		placeholder,
		className: "bg-muted/30 focus-visible:ring-rocsta-green",
		...rest
	});
}
function renderTextarea(name, value, placeholder, onChange, rows = 4) {
	return /* @__PURE__ */ jsx("textarea", {
		id: name,
		name,
		required: true,
		rows,
		value,
		onChange,
		placeholder,
		className: "w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
	});
}
function renderSelect(name, value, options, onChangeFn) {
	return /* @__PURE__ */ jsxs(Select, {
		value,
		onValueChange: onChangeFn(name),
		children: [/* @__PURE__ */ jsx(SelectTrigger, {
			id: name,
			className: "w-full",
			children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "Select an option" })
		}), /* @__PURE__ */ jsx(SelectContent, { children: options.map((opt) => /* @__PURE__ */ jsx(SelectItem, {
			value: opt.value,
			children: opt.label
		}, opt.value)) })]
	});
}
function CommunityPage() {
	const { t } = useLanguage();
	const searchParams = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const formType = searchParams.tab || "comp";
	const isValidTab = (v) => [
		"comp",
		"part",
		"guide",
		"problem",
		"bug",
		"partwrong",
		"photo"
	].includes(v);
	const setFormType = (tab) => {
		if (!isValidTab(tab)) return;
		navigate({ search: (prev) => ({
			...prev,
			tab
		}) });
	};
	const [stats, setStats] = useState(null);
	const [members, setMembers] = useState([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const fetchData = () => Promise.all([api.getStats(), api.getMembers()]).then(([s, m]) => {
			setStats(s);
			setMembers(m);
		}).catch((err) => console.error("API error:", err)).finally(() => setLoading(false));
		fetchData();
		const interval = setInterval(fetchData, 3e4);
		return () => clearInterval(interval);
	}, []);
	const [submitted, setSubmitted] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [photoFile, setPhotoFile] = useState(null);
	const [extra, setExtra] = useState({});
	const handleExtra = (e) => {
		setExtra((prev) => ({
			...prev,
			[e.target.name]: e.target.value
		}));
	};
	const handleExtraValue = (name) => (value) => {
		setExtra((prev) => ({
			...prev,
			[name]: value
		}));
	};
	const resetForm = () => {
		setUsername("");
		setEmail("");
		setExtra({});
		setPhotoFile(null);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (formType === "photo") {
				const fd = new FormData();
				fd.append("owner", username);
				fd.append("year", extra.photo_year || "");
				fd.append("motor", extra.photo_motor || "ambos");
				fd.append("country", extra.photo_country || "");
				if (photoFile) fd.append("photo", photoFile);
				await api.submitGalleryPhoto(fd);
			} else await api.submit({
				type: formType,
				username,
				email,
				title: extra[`${formType}_title`] || "",
				description: extra[`${formType}_description`] || "",
				data: extra
			});
			setSubmitted(true);
			resetForm();
			setTimeout(() => setSubmitted(false), 4500);
		} catch {
			alert("Error al enviar la propuesta. ¿El servidor está corriendo?");
		} finally {
			setSubmitting(false);
		}
	};
	function renderCommonFields() {
		return /* @__PURE__ */ jsxs("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
			children: [/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.name"),
				children: renderInput("username", username, t("comm.form.namePlaceholder"), (e) => setUsername(e.target.value))
			}), /* @__PURE__ */ jsx(Field, {
				label: t("comm.form.email"),
				children: renderInput("email", email, t("comm.form.emailPlaceholder"), (e) => setEmail(e.target.value), {
					type: "email",
					suppressHydrationWarning: true
				})
			})]
		});
	}
	function renderCompFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.comp.title"),
				children: renderInput("comp_title", extra.comp_title || "", t("comm.form.comp.titlePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.comp.donorVehicle"),
				children: renderInput("comp_donorVehicle", extra.comp_donorVehicle || "", t("comm.form.comp.donorVehiclePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.comp.donorRef"),
				children: renderInput("comp_donorRef", extra.comp_donorRef || "", t("comm.form.comp.donorRefPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsx(Field, {
					label: t("comm.form.comp.swapType"),
					children: renderSelect("comp_swapType", extra.comp_swapType || "directo", [{
						value: "directo",
						label: t("comm.form.comp.swapType.directo")
					}, {
						value: "adaptacion",
						label: t("comm.form.comp.swapType.adaptacion")
					}], handleExtraValue)
				}), /* @__PURE__ */ jsx(Field, {
					label: t("comm.form.comp.motor"),
					children: renderSelect("comp_motor", extra.comp_motor || "ambos", [
						{
							value: "F8",
							label: "F8"
						},
						{
							value: "R2",
							label: "R2"
						},
						{
							value: "ambos",
							label: "F8 / R2"
						}
					], handleExtraValue)
				})]
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.comp.notes"),
				children: renderTextarea("comp_notes", extra.comp_notes || "", t("comm.form.comp.notesPlaceholder"), handleExtra, 3)
			})
		] });
	}
	function renderPartFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.part.title"),
				children: renderInput("part_title", extra.part_title || "", t("comm.form.part.titlePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.part.oem"),
				children: renderInput("part_oem", extra.part_oem || "", t("comm.form.part.oemPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsx(Field, {
					label: t("comm.form.part.category"),
					children: renderSelect("part_category", extra.part_category || "engine", [
						{
							value: "engine",
							label: t("cat.engine")
						},
						{
							value: "transmission",
							label: t("cat.transmission")
						},
						{
							value: "suspension",
							label: t("cat.suspension")
						},
						{
							value: "electrical",
							label: t("cat.electrical")
						},
						{
							value: "brakes",
							label: t("cat.brakes")
						},
						{
							value: "tires",
							label: t("cat.tires")
						},
						{
							value: "body",
							label: t("cat.body")
						}
					], handleExtraValue)
				}), /* @__PURE__ */ jsx(Field, {
					label: t("comm.form.part.motor"),
					children: renderSelect("part_motor", extra.part_motor || "ambos", [
						{
							value: "F8",
							label: "F8"
						},
						{
							value: "R2",
							label: "R2"
						},
						{
							value: "ambos",
							label: "F8 / R2"
						}
					], handleExtraValue)
				})]
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.part.description"),
				children: renderTextarea("part_description", extra.part_description || "", t("comm.form.part.descriptionPlaceholder"), handleExtra)
			})
		] });
	}
	function renderGuideFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.guide.title"),
				children: renderInput("guide_title", extra.guide_title || "", t("comm.form.guide.titlePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.guide.category"),
				children: renderSelect("guide_category", extra.guide_category || "mecanica", [
					{
						value: "mecanica",
						label: "Mecánica"
					},
					{
						value: "electricidad",
						label: "Electricidad"
					},
					{
						value: "carroceria",
						label: "Carrocería"
					},
					{
						value: "mantenimiento",
						label: "Mantenimiento"
					},
					{
						value: "otro",
						label: "Otro"
					}
				], handleExtraValue)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.guide.tools"),
				children: renderInput("guide_tools", extra.guide_tools || "", t("comm.form.guide.toolsPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.guide.content"),
				children: renderTextarea("guide_content", extra.guide_content || "", t("comm.form.guide.contentPlaceholder"), handleExtra, 6)
			})
		] });
	}
	function renderProblemFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.problem.title"),
				children: renderInput("problem_title", extra.problem_title || "", t("comm.form.problem.titlePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsx(Field, {
					label: t("comm.form.problem.motor"),
					children: renderSelect("problem_motor", extra.problem_motor || "ambos", [
						{
							value: "F8",
							label: "F8"
						},
						{
							value: "R2",
							label: "R2"
						},
						{
							value: "ambos",
							label: "F8 / R2"
						}
					], handleExtraValue)
				}), /* @__PURE__ */ jsx(Field, {
					label: t("comm.form.problem.mileage"),
					children: renderInput("problem_mileage", extra.problem_mileage || "", t("comm.form.problem.mileagePlaceholder"), handleExtra, { type: "number" })
				})]
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.problem.symptoms"),
				children: renderTextarea("problem_symptoms", extra.problem_symptoms || "", t("comm.form.problem.symptomsPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.problem.solution"),
				children: renderTextarea("problem_solution", extra.problem_solution || "", t("comm.form.problem.solutionPlaceholder"), handleExtra)
			})
		] });
	}
	function renderBugFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.bug.title"),
				children: renderInput("bug_title", extra.bug_title || "", t("comm.form.bug.titlePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.bug.url"),
				children: renderInput("bug_url", extra.bug_url || "", t("comm.form.bug.urlPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.bug.browser"),
				children: renderInput("bug_browser", extra.bug_browser || "", t("comm.form.bug.browserPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.bug.description"),
				children: renderTextarea("bug_description", extra.bug_description || "", t("comm.form.bug.descriptionPlaceholder"), handleExtra)
			})
		] });
	}
	function renderPartwrongFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.partwrong.title"),
				children: renderInput("partwrong_title", extra.partwrong_title || "", t("comm.form.partwrong.titlePlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.partwrong.currentInfo"),
				children: renderTextarea("partwrong_currentInfo", extra.partwrong_currentInfo || "", t("comm.form.partwrong.currentInfoPlaceholder"), handleExtra, 3)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.partwrong.correction"),
				children: renderTextarea("partwrong_correction", extra.partwrong_correction || "", t("comm.form.partwrong.correctionPlaceholder"), handleExtra, 3)
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.partwrong.source"),
				children: renderInput("partwrong_source", extra.partwrong_source || "", t("comm.form.partwrong.sourcePlaceholder"), handleExtra)
			})
		] });
	}
	function renderPhotoFields() {
		return /* @__PURE__ */ jsxs(Fragment, { children: [
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.photo.year"),
				children: renderInput("photo_year", extra.photo_year || "", t("comm.form.photo.yearPlaceholder"), handleExtra)
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
				children: [/* @__PURE__ */ jsx(Field, {
					label: t("comm.form.photo.motor"),
					children: renderSelect("photo_motor", extra.photo_motor || "ambos", [
						{
							value: "F8",
							label: "F8"
						},
						{
							value: "R2",
							label: "R2"
						},
						{
							value: "ambos",
							label: "F8 / R2"
						}
					], handleExtraValue)
				}), /* @__PURE__ */ jsx(Field, {
					label: t("comm.form.photo.country"),
					children: renderInput("photo_country", extra.photo_country || "", t("comm.form.photo.countryPlaceholder"), handleExtra)
				})]
			}),
			/* @__PURE__ */ jsx(Field, {
				label: t("comm.form.photo.photo"),
				children: /* @__PURE__ */ jsx("input", {
					type: "file",
					accept: "image/jpeg,image/png,image/webp,image/gif",
					onChange: (e) => setPhotoFile(e.target.files?.[0] || null),
					className: "w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-xs shadow-sm file:mr-2 file:rounded-md file:border-0 file:bg-rocsta-green file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-primary-foreground"
				})
			})
		] });
	}
	function renderFormFields() {
		switch (formType) {
			case "comp": return renderCompFields();
			case "part": return renderPartFields();
			case "guide": return renderGuideFields();
			case "problem": return renderProblemFields();
			case "bug": return renderBugFields();
			case "partwrong": return renderPartwrongFields();
			case "photo": return renderPhotoFields();
		}
	}
	return /* @__PURE__ */ jsx(PageShell, { children: /* @__PURE__ */ jsxs("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ jsx(Crumbs, { items: [{
				label: t("nav.community"),
				active: true
			}] }),
			/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h1", {
				className: "text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3",
				children: [
					/* @__PURE__ */ jsx(Users, { className: "size-8 text-rocsta-green" }),
					" ",
					t("comm.title")
				]
			}), /* @__PURE__ */ jsx("p", {
				className: "mt-2 text-base text-muted-foreground max-w-3xl",
				children: t("comm.desc")
			})] }),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider",
							children: t("comm.stats.parts")
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1",
							children: [
								loading ? /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin" }) : stats?.partsDocumented ?? "-",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-rocsta-green font-semibold",
									children: t("comm.statsItems")
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider",
							children: t("comm.stats.swaps")
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1",
							children: [
								loading ? /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin" }) : stats?.verifiedEquivalences ?? "-",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-rocsta-green font-semibold",
									children: t("comm.statsSwaps")
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider",
							children: t("comm.stats.guides")
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1",
							children: [
								loading ? /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin" }) : stats?.repairGuides ?? "-",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-rocsta-green font-semibold",
									children: t("comm.statsBricos")
								})
							]
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between",
						children: [/* @__PURE__ */ jsx("div", {
							className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider",
							children: t("comm.stats.logs")
						}), /* @__PURE__ */ jsxs("div", {
							className: "text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1",
							children: [
								loading ? /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin" }) : stats?.totalContributions ?? "-",
								" ",
								/* @__PURE__ */ jsx("span", {
									className: "text-xs text-rocsta-green font-semibold",
									children: t("comm.statsLogs")
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-1 lg:grid-cols-3 gap-8",
				children: [/* @__PURE__ */ jsx("div", {
					className: "lg:col-span-2 space-y-6",
					children: /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-6 shadow-sm space-y-4",
						children: [
							/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
								className: "text-xl font-extrabold text-foreground flex items-center gap-2",
								children: [
									/* @__PURE__ */ jsx(Send, { className: "size-5 text-rocsta-green" }),
									" ",
									t("comm.form.title")
								]
							}), /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground mt-1",
								children: t("comm.form.desc")
							})] }),
							/* @__PURE__ */ jsx("div", {
								className: "flex border-b border-border pb-1 gap-2 text-xs font-bold text-muted-foreground overflow-x-auto",
								children: TABS.map((tab) => /* @__PURE__ */ jsxs("button", {
									type: "button",
									onClick: () => setFormType(tab.key),
									className: ["pb-2 px-1 border-b-2 transition-all flex items-center gap-1 shrink-0", formType === tab.key ? "border-rocsta-green text-foreground" : "border-transparent hover:text-foreground"].join(" "),
									children: [
										/* @__PURE__ */ jsx(tab.icon, { className: "size-3.5" }),
										" ",
										t(tab.labelKey)
									]
								}, tab.key))
							}),
							submitted ? /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center space-y-3 animate-fade-in",
								children: [
									/* @__PURE__ */ jsx("div", {
										className: "inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600",
										children: /* @__PURE__ */ jsx(Heart, { className: "size-5 animate-pulse" })
									}),
									/* @__PURE__ */ jsx("h3", {
										className: "text-base font-extrabold text-foreground",
										children: t("comm.form.submitted")
									}),
									/* @__PURE__ */ jsx("p", {
										className: "text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed",
										children: t("comm.form.submittedDesc")
									})
								]
							}) : /* @__PURE__ */ jsxs("form", {
								onSubmit: handleSubmit,
								className: "space-y-4",
								children: [
									renderCommonFields(),
									renderFormFields(),
									/* @__PURE__ */ jsxs("button", {
										type: "submit",
										disabled: submitting,
										className: "inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50",
										children: [
											submitting ? /* @__PURE__ */ jsx(Loader2, { className: "size-3.5 animate-spin" }) : /* @__PURE__ */ jsx(Send, { className: "size-3.5" }),
											" ",
											t("comm.form.submit")
										]
									})
								]
							})
						]
					})
				}), /* @__PURE__ */ jsxs("div", {
					className: "space-y-6",
					children: [/* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-border bg-card p-6 shadow-sm space-y-4",
						children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("h2", {
							className: "text-base font-extrabold text-foreground flex items-center gap-1.5",
							children: [
								/* @__PURE__ */ jsx(Award, { className: "size-5 text-rocsta-green" }),
								" ",
								t("comm.leaders.title")
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground mt-0.5",
							children: t("comm.leaders.desc")
						})] }), /* @__PURE__ */ jsx("div", {
							className: "space-y-3.5",
							children: loading ? /* @__PURE__ */ jsx("div", {
								className: "flex justify-center py-6",
								children: /* @__PURE__ */ jsx(Loader2, { className: "size-5 animate-spin text-muted-foreground" })
							}) : members.length === 0 ? /* @__PURE__ */ jsx("p", {
								className: "text-xs text-muted-foreground text-center py-6",
								children: "Sin miembros todavía"
							}) : members.map((member) => /* @__PURE__ */ jsxs("div", {
								className: "flex items-center justify-between gap-3 text-xs",
								children: [/* @__PURE__ */ jsxs("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ jsx("div", {
										className: ["h-8 w-8 rounded-full flex items-center justify-center font-extrabold tracking-tight text-[11px]", member.avatar_color].join(" "),
										children: member.name.substring(0, 2).toUpperCase()
									}), /* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsxs("div", {
										className: "font-extrabold text-foreground flex items-center gap-1",
										children: [
											member.name,
											" ",
											/* @__PURE__ */ jsx("span", {
												className: "text-xs shrink-0",
												children: member.country
											})
										]
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[10px] text-muted-foreground mt-0.5 max-w-[140px] truncate",
										children: member.speciality
									})] })]
								}), /* @__PURE__ */ jsxs("div", {
									className: "text-right",
									children: [/* @__PURE__ */ jsx("div", {
										className: "font-bold text-foreground font-mono",
										children: member.contributions
									}), /* @__PURE__ */ jsx("div", {
										className: "text-[9px] text-muted-foreground uppercase font-bold",
										children: t("comm.leadersLogs")
									})]
								})]
							}, member.id))
						})]
					}), /* @__PURE__ */ jsxs("div", {
						className: "rounded-xl border border-rocsta-accent/15 bg-rocsta-accent/[0.01] p-4 space-y-2",
						children: [/* @__PURE__ */ jsxs("h3", {
							className: "text-xs font-bold text-foreground flex items-center gap-1.5 uppercase",
							children: [
								/* @__PURE__ */ jsx(MessageSquare, { className: "size-4 text-rocsta-accent" }),
								" ",
								t("comm.pr.title")
							]
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: t("comm.pr.desc")
						})]
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { CommunityPage as component };
