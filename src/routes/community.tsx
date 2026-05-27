import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useLanguage } from "@/components/language-provider";
import { PageShell, Crumbs } from "@/components/page-shell";
import { api, type ApiMember, type ApiStats, type FormType } from "@/lib/api";
import {
  Users,
  Award,
  Heart,
  Send,
  MessageSquare,
  BookOpen,
  GitCompare,
  AlertCircle,
  Loader2,
  Package,
  Bug,
  FileX,
  Camera,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

const communitySearchSchema = z.object({
  tab: z.enum(["comp", "part", "guide", "problem", "bug", "partwrong", "photo"]).optional(),
});

type CommunitySearch = z.infer<typeof communitySearchSchema>;

export const Route = createFileRoute("/community")({
  validateSearch: (search) => communitySearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Comunidad y Colaboración — Asia Rocsta Archive" },
      {
        name: "description",
        content:
          "Súmate a la comunidad mundial del Asia Rocsta. Aporta guías, códigos OEM o reporta equivalencias para que la base de datos crezca.",
      },
      { property: "og:title", content: "Comunidad — Asia Rocsta Archive" },
      { property: "og:url", content: "/community" },
    ],
    links: [{ rel: "canonical", href: "/community" }],
  }),
  component: CommunityPage,
});

const TABS: { key: FormType; icon: typeof GitCompare; labelKey: string }[] = [
  { key: "comp", icon: GitCompare, labelKey: "comm.form.tab.comp" },
  { key: "part", icon: Package, labelKey: "comm.form.tab.part" },
  { key: "guide", icon: BookOpen, labelKey: "comm.form.tab.guide" },
  { key: "problem", icon: AlertCircle, labelKey: "comm.form.tab.problem" },
  { key: "bug", icon: Bug, labelKey: "comm.form.tab.bug" },
  { key: "partwrong", icon: FileX, labelKey: "comm.form.tab.partwrong" },
  { key: "photo", icon: Camera, labelKey: "comm.form.tab.photo" },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-muted-foreground uppercase">{label}</label>
      {children}
    </div>
  );
}

function renderInput(
  name: string,
  value: string,
  placeholder: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  opts?: { type?: string; required?: boolean; suppressHydrationWarning?: boolean },
) {
  const { type, required, ...rest } = opts || {};
  return (
    <Input
      type={type || "text"}
      id={name}
      name={name}
      required={required ?? true}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="bg-muted/30 focus-visible:ring-rocsta-green"
      {...rest}
    />
  );
}

function renderTextarea(
  name: string,
  value: string,
  placeholder: string,
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
  rows = 4,
) {
  return (
    <textarea
      id={name}
      name={name}
      required
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
    />
  );
}

function renderSelect(
  name: string,
  value: string,
  options: { value: string; label: string }[],
  onChangeFn: (name: string) => (value: string) => void,
) {
  return (
    <Select value={value} onValueChange={onChangeFn(name)}>
      <SelectTrigger id={name} className="w-full">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>

      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function CommunityPage() {
  const { t } = useLanguage();
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const formType = searchParams.tab || "comp";
  const isValidTab = (v: string): v is FormType =>
    ["comp", "part", "guide", "problem", "bug", "partwrong", "photo"].includes(v);

  const setFormType = (tab: string) => {
    if (!isValidTab(tab)) return;

    navigate({
      search: (prev) => ({
        ...prev,
        tab,
      }),
    });
  };

  const [stats, setStats] = useState<ApiStats | null>(null);
  const [members, setMembers] = useState<ApiMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () =>
      Promise.all([api.getStats(), api.getMembers()])
        .then(([s, m]) => {
          setStats(s);
          setMembers(m);
        })
        .catch((err) => console.error("API error:", err))
        .finally(() => setLoading(false));
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [extra, setExtra] = useState<Record<string, string>>({});

  const handleExtra = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setExtra((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleExtraValue = (name: string) => (value: string) => {
    setExtra((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setExtra({});
    setPhotoFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      } else {
        await api.submit({
          type: formType,
          username,
          email,
          title: extra[`${formType}_title`] || "",
          description: extra[`${formType}_description`] || "",
          data: extra,
        });
      }
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
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={t("comm.form.name")}>
          {renderInput("username", username, t("comm.form.namePlaceholder"), (e) => setUsername(e.target.value))}
        </Field>
        <Field label={t("comm.form.email")}>
          {renderInput("email", email, t("comm.form.emailPlaceholder"), (e) => setEmail(e.target.value), { type: "email", suppressHydrationWarning: true })}
        </Field>
      </div>
    );
  }

  function renderCompFields() {
    return (
      <>
        <Field label={t("comm.form.comp.title")}>
          {renderInput("comp_title", extra.comp_title || "", t("comm.form.comp.titlePlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.comp.donorVehicle")}>
          {renderInput("comp_donorVehicle", extra.comp_donorVehicle || "", t("comm.form.comp.donorVehiclePlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.comp.donorRef")}>
          {renderInput("comp_donorRef", extra.comp_donorRef || "", t("comm.form.comp.donorRefPlaceholder"), handleExtra)}
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("comm.form.comp.swapType")}>
            {renderSelect("comp_swapType", extra.comp_swapType || "directo", [
              { value: "directo", label: t("comm.form.comp.swapType.directo") },
              { value: "adaptacion", label: t("comm.form.comp.swapType.adaptacion") },
            ], handleExtraValue)}
          </Field>
          <Field label={t("comm.form.comp.motor")}>
            {renderSelect("comp_motor", extra.comp_motor || "ambos", [
              { value: "F8", label: "F8" },
              { value: "R2", label: "R2" },
              { value: "ambos", label: "F8 / R2" },
            ], handleExtraValue)}
          </Field>
        </div>
        <Field label={t("comm.form.comp.notes")}>
          {renderTextarea("comp_notes", extra.comp_notes || "", t("comm.form.comp.notesPlaceholder"), handleExtra, 3)}
        </Field>
      </>
    );
  }

  function renderPartFields() {
    return (
      <>
        <Field label={t("comm.form.part.title")}>
          {renderInput("part_title", extra.part_title || "", t("comm.form.part.titlePlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.part.oem")}>
          {renderInput("part_oem", extra.part_oem || "", t("comm.form.part.oemPlaceholder"), handleExtra)}
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("comm.form.part.category")}>
            {renderSelect("part_category", extra.part_category || "engine", [
              { value: "engine", label: t("cat.engine") },
              { value: "transmission", label: t("cat.transmission") },
              { value: "suspension", label: t("cat.suspension") },
              { value: "electrical", label: t("cat.electrical") },
              { value: "brakes", label: t("cat.brakes") },
              { value: "tires", label: t("cat.tires") },
              { value: "body", label: t("cat.body") },
            ], handleExtraValue)}
          </Field>
          <Field label={t("comm.form.part.motor")}>
            {renderSelect("part_motor", extra.part_motor || "ambos", [
              { value: "F8", label: "F8" },
              { value: "R2", label: "R2" },
              { value: "ambos", label: "F8 / R2" },
            ], handleExtraValue)}
          </Field>
        </div>
        <Field label={t("comm.form.part.description")}>
          {renderTextarea("part_description", extra.part_description || "", t("comm.form.part.descriptionPlaceholder"), handleExtra)}
        </Field>
      </>
    );
  }

  function renderGuideFields() {
    return (
      <>
        <Field label={t("comm.form.guide.title")}>
          {renderInput("guide_title", extra.guide_title || "", t("comm.form.guide.titlePlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.guide.category")}>
          {renderSelect("guide_category", extra.guide_category || "mecanica", [
            { value: "mecanica", label: "Mecánica" },
            { value: "electricidad", label: "Electricidad" },
            { value: "carroceria", label: "Carrocería" },
            { value: "mantenimiento", label: "Mantenimiento" },
            { value: "otro", label: "Otro" },
          ], handleExtraValue)}
        </Field>
        <Field label={t("comm.form.guide.tools")}>
          {renderInput("guide_tools", extra.guide_tools || "", t("comm.form.guide.toolsPlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.guide.content")}>
          {renderTextarea("guide_content", extra.guide_content || "", t("comm.form.guide.contentPlaceholder"), handleExtra, 6)}
        </Field>
      </>
    );
  }

  function renderProblemFields() {
    return (
      <>
        <Field label={t("comm.form.problem.title")}>
          {renderInput("problem_title", extra.problem_title || "", t("comm.form.problem.titlePlaceholder"), handleExtra)}
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("comm.form.problem.motor")}>
            {renderSelect("problem_motor", extra.problem_motor || "ambos", [
              { value: "F8", label: "F8" },
              { value: "R2", label: "R2" },
              { value: "ambos", label: "F8 / R2" },
            ], handleExtraValue)}
          </Field>
          <Field label={t("comm.form.problem.mileage")}>
            {renderInput("problem_mileage", extra.problem_mileage || "", t("comm.form.problem.mileagePlaceholder"), handleExtra, { type: "number" })}
          </Field>
        </div>
        <Field label={t("comm.form.problem.symptoms")}>
          {renderTextarea("problem_symptoms", extra.problem_symptoms || "", t("comm.form.problem.symptomsPlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.problem.solution")}>
          {renderTextarea("problem_solution", extra.problem_solution || "", t("comm.form.problem.solutionPlaceholder"), handleExtra)}
        </Field>
      </>
    );
  }

  function renderBugFields() {
    return (
      <>
        <Field label={t("comm.form.bug.title")}>
          {renderInput("bug_title", extra.bug_title || "", t("comm.form.bug.titlePlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.bug.url")}>
          {renderInput("bug_url", extra.bug_url || "", t("comm.form.bug.urlPlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.bug.browser")}>
          {renderInput("bug_browser", extra.bug_browser || "", t("comm.form.bug.browserPlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.bug.description")}>
          {renderTextarea("bug_description", extra.bug_description || "", t("comm.form.bug.descriptionPlaceholder"), handleExtra)}
        </Field>
      </>
    );
  }

  function renderPartwrongFields() {
    return (
      <>
        <Field label={t("comm.form.partwrong.title")}>
          {renderInput("partwrong_title", extra.partwrong_title || "", t("comm.form.partwrong.titlePlaceholder"), handleExtra)}
        </Field>
        <Field label={t("comm.form.partwrong.currentInfo")}>
          {renderTextarea("partwrong_currentInfo", extra.partwrong_currentInfo || "", t("comm.form.partwrong.currentInfoPlaceholder"), handleExtra, 3)}
        </Field>
        <Field label={t("comm.form.partwrong.correction")}>
          {renderTextarea("partwrong_correction", extra.partwrong_correction || "", t("comm.form.partwrong.correctionPlaceholder"), handleExtra, 3)}
        </Field>
        <Field label={t("comm.form.partwrong.source")}>
          {renderInput("partwrong_source", extra.partwrong_source || "", t("comm.form.partwrong.sourcePlaceholder"), handleExtra)}
        </Field>
      </>
    );
  }

  function renderPhotoFields() {
    return (
      <>
        <Field label={t("comm.form.photo.year")}>
          {renderInput("photo_year", extra.photo_year || "", t("comm.form.photo.yearPlaceholder"), handleExtra)}
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label={t("comm.form.photo.motor")}>
            {renderSelect("photo_motor", extra.photo_motor || "ambos", [
              { value: "F8", label: "F8" },
              { value: "R2", label: "R2" },
              { value: "ambos", label: "F8 / R2" },
            ], handleExtraValue)}
          </Field>
          <Field label={t("comm.form.photo.country")}>
            {renderInput("photo_country", extra.photo_country || "", t("comm.form.photo.countryPlaceholder"), handleExtra)}
          </Field>
        </div>
        <Field label={t("comm.form.photo.photo")}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-xs shadow-sm file:mr-2 file:rounded-md file:border-0 file:bg-rocsta-green file:px-2 file:py-1 file:text-[10px] file:font-bold file:text-primary-foreground"
          />
        </Field>
      </>
    );
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

  return (
    <PageShell>
      <div className="space-y-6">
        <Crumbs items={[{ label: t("nav.community"), active: true }]} />

        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            <Users className="size-8 text-rocsta-green" /> {t("comm.title")}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-3xl">{t("comm.desc")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("comm.stats.parts")}
            </div>
            <div className="text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1">
              {loading ? <Loader2 className="size-5 animate-spin" /> : stats?.partsDocumented ?? "-"}{" "}
              <span className="text-xs text-rocsta-green font-semibold">
                {t("comm.statsItems")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("comm.stats.swaps")}
            </div>
            <div className="text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1">
              {loading ? <Loader2 className="size-5 animate-spin" /> : stats?.verifiedEquivalences ?? "-"}{" "}
              <span className="text-xs text-rocsta-green font-semibold">
                {t("comm.statsSwaps")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("comm.stats.guides")}
            </div>
            <div className="text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1">
              {loading ? <Loader2 className="size-5 animate-spin" /> : stats?.repairGuides ?? "-"}{" "}
              <span className="text-xs text-rocsta-green font-semibold">
                {t("comm.statsBricos")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm flex flex-col justify-between">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {t("comm.stats.logs")}
            </div>
            <div className="text-3xl font-extrabold text-foreground font-mono mt-2 flex items-baseline gap-1">
              {loading ? <Loader2 className="size-5 animate-spin" /> : stats?.totalContributions ?? "-"}{" "}
              <span className="text-xs text-rocsta-green font-semibold">{t("comm.statsLogs")}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                  <Send className="size-5 text-rocsta-green" /> {t("comm.form.title")}
                </h2>
                <p className="text-xs text-muted-foreground mt-1">{t("comm.form.desc")}</p>
              </div>

              <div className="flex border-b border-border pb-1 gap-2 text-xs font-bold text-muted-foreground overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFormType(tab.key)}
                    className={[
                      "pb-2 px-1 border-b-2 transition-all flex items-center gap-1 shrink-0",
                      formType === tab.key
                        ? "border-rocsta-green text-foreground"
                        : "border-transparent hover:text-foreground",
                    ].join(" ")}
                  >
                    <tab.icon className="size-3.5" /> {t(tab.labelKey)}
                  </button>
                ))}
              </div>

              {submitted ? (
                <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center space-y-3 animate-fade-in">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                    <Heart className="size-5 animate-pulse" />
                  </div>
                  <h3 className="text-base font-extrabold text-foreground">
                    {t("comm.form.submitted")}
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    {t("comm.form.submittedDesc")}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {renderCommonFields()}
                  {renderFormFields()}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="size-3.5 animate-spin" /> : <Send className="size-3.5" />} {t("comm.form.submit")}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div>
                <h2 className="text-base font-extrabold text-foreground flex items-center gap-1.5">
                  <Award className="size-5 text-rocsta-green" /> {t("comm.leaders.title")}
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">{t("comm.leaders.desc")}</p>
              </div>

              <div className="space-y-3.5">
                {loading ? (
                  <div className="flex justify-center py-6"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>
                ) : members.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-6">Sin miembros todavía</p>
                ) : (
                  members.map((member) => (
                    <div key={member.id} className="flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className={[
                            "h-8 w-8 rounded-full flex items-center justify-center font-extrabold tracking-tight text-[11px]",
                            member.avatar_color,
                          ].join(" ")}
                        >
                          {member.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-extrabold text-foreground flex items-center gap-1">
                            {member.name} <span className="text-xs shrink-0">{member.country}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground mt-0.5 max-w-[140px] truncate">
                            {member.speciality}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-foreground font-mono">
                          {member.contributions}
                        </div>
                        <div className="text-[9px] text-muted-foreground uppercase font-bold">
                          {t("comm.leadersLogs")}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-rocsta-accent/15 bg-rocsta-accent/[0.01] p-4 space-y-2">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5 uppercase">
                <MessageSquare className="size-4 text-rocsta-accent" /> {t("comm.pr.title")}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{t("comm.pr.desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
