import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLanguage } from "@/components/language-provider";
import { useMetaTags } from "@/hooks/use-meta-tags";
import { PageShell, Crumbs } from "@/components/page-shell";
import {
  api,
  getForumToken,
  setForumToken,
  translateError,
  type ApiForumThread,
  type ApiForumPost,
  type ForumUser,
} from "@/lib/api";
import { getMetaTranslation } from "@/lib/meta-translations";
import { resolveLocale, getAlternateHrefs } from "@/lib/i18n-routing";
import ogImage from "@/assets/rocsta-hero.jpg";
import {
  MessageSquare,
  Search,
  Plus,
  ArrowLeft,
  Send,
  Eye,
  MessageCircle,
  Clock,
  User,
  Loader2,
  AlertCircle,
  Tag,
  LogIn,
  LogOut,
  Shield,
  Trash2,
  Check,
  X,
  Users,
  Heart,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const SITE_URL = "https://muhaddil.github.io/asia-rocsta-hub";

const forumSearchSchema = z.object({
  category: z.string().optional(),
  threadId: z.number().optional(),
  search: z.string().optional(),
  tab: z.enum(["threads", "pending"]).optional(),
});

export const Route = createFileRoute("/{-$locale}/forum")({
  validateSearch: (search) => forumSearchSchema.parse(search),
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return {
      meta: [
        { title: getMetaTranslation("meta.forum.title", locale) },
        {
          name: "description",
          content: getMetaTranslation("meta.forum.description", locale),
        },
        { property: "og:title", content: getMetaTranslation("meta.forum.ogTitle", locale) },
        {
          property: "og:description",
          content: getMetaTranslation("meta.forum.ogDescription", locale),
        },
        { property: "og:url", content: `${SITE_URL}/${locale}/forum` },
        { property: "og:image", content: ogImage },
        { name: "twitter:image", content: ogImage },
      ],
      links: [
        { rel: "canonical", href: `${SITE_URL}/${locale}/forum` },
        ...getAlternateHrefs("/forum", SITE_URL).map((a) => ({
          rel: "alternate" as const,
          hrefLang: a.hreflang,
          href: a.href,
        })),
      ],
    };
  },
  component: ForumPage,
});

const CATEGORIES = ["general", "mechanical", "electrical", "body", "marketplace"] as const;

function getCategoryColor(cat: string) {
  switch (cat) {
    case "mechanical":
      return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "electrical":
      return "bg-amber-500/10 text-amber-500 border-amber-500/20";
    case "body":
      return "bg-purple-500/10 text-purple-500 border-purple-500/20";
    case "marketplace":
      return "bg-green-500/10 text-green-500 border-green-500/20";
    default:
      return "bg-slate-500/10 text-slate-500 border-slate-500/20";
  }
}

function formatDate(dateStr: string) {
  try {
    const date = new Date(dateStr.replace(" ", "T"));
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

function ForumPage() {
  const { t, language } = useLanguage();
  const { locale } = Route.useParams();
  const lang = resolveLocale(locale);
  const searchParams = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const queryClient = useQueryClient();

  const selectedCategory = searchParams.category;
  const activeThreadId = searchParams.threadId;
  const searchQuery = searchParams.search || "";
  const activeTab = searchParams.tab || "threads";

  useMetaTags({
    title: getMetaTranslation("meta.forum.title", lang),
    description: getMetaTranslation("meta.forum.description", lang),
    ogTitle: getMetaTranslation("meta.forum.ogTitle", lang),
    ogDescription: getMetaTranslation("meta.forum.ogDescription", lang),
    ogImage: ogImage,
  });

  const [forumUser, setForumUser] = useState<ForumUser | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authUsername, setAuthUsername] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authDisplayName, setAuthDisplayName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const isAdminOrMod = forumUser?.role === "admin" || forumUser?.role === "moderator";

  useEffect(() => {
    const token = getForumToken();
    if (token) {
      api
        .forumMe()
        .then(({ user }) => {
          if (user) setForumUser(user);
          else setForumToken(null);
        })
        .catch(() => setForumToken(null));
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      let result;
      if (authMode === "login") {
        result = await api.forumLogin({ username: authUsername, password: authPassword });
      } else {
        result = await api.forumRegister({
          username: authUsername,
          password: authPassword,
          display_name: authDisplayName || authUsername,
        });
      }
      setForumToken(result.token);
      setForumUser(result.user);
      setAuthOpen(false);
      setAuthUsername("");
      setAuthPassword("");
      setAuthDisplayName("");
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
    } catch (err: any) {
      setAuthError(
        translateError((err as any).errorCode, lang) || err.message || t("forum.auth.error"),
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await api.forumLogout();
    } catch {}
    setForumToken(null);
    setForumUser(null);
    queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
  };

  const [newThreadOpen, setNewThreadOpen] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadCategory, setNewThreadCategory] = useState<string>("general");
  const [newThreadContent, setNewThreadContent] = useState("");
  const [createThreadError, setCreateThreadError] = useState("");

  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);

  const showConfirm = (message: string, action: () => void) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    confirmAction?.();
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  const includePending = isAdminOrMod && activeTab === "pending";

  const { data: threads = [], isLoading: loadingThreads } = useQuery({
    queryKey: ["forum-threads", selectedCategory, includePending],
    queryFn: () => api.getForumThreads(selectedCategory, includePending),
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
  });

  const {
    data: threadDetails = null,
    isLoading: loadingDetails,
    refetch: refetchDetails,
  } = useQuery({
    queryKey: ["forum-thread", activeThreadId],
    queryFn: () => (activeThreadId ? api.getForumThread(activeThreadId) : Promise.resolve(null)),
    enabled: !!activeThreadId,
  });

  const { data: pendingData = null, isLoading: loadingPending } = useQuery({
    queryKey: ["forum-pending"],
    queryFn: () => api.getForumPending(),
    enabled: isAdminOrMod && activeTab === "pending",
  });

  const createThreadMutation = useMutation({
    mutationFn: api.createForumThread,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      setNewThreadOpen(false);
      resetNewThreadForm();
      if (data.id) {
        navigate({
          search: (prev) => ({ ...prev, threadId: data.id }),
        });
      }
    },
    onError: (err: any) => {
      setCreateThreadError(
        translateError((err as any).errorCode, lang) || err.message || t("forum.create.error"),
      );
    },
  });

  const createReplyMutation = useMutation({
    mutationFn: ({
      threadId,
      data,
    }: {
      threadId: number;
      data: { author_name: string; content: string };
    }) => api.createForumPost(threadId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-thread", activeThreadId] });
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      setReplyContent("");
      setReplyError("");
    },
    onError: (err: any) => {
      setReplyError(
        translateError((err as any).errorCode, lang) || err.message || t("forum.reply.error"),
      );
    },
  });

  const deleteThreadMutation = useMutation({
    mutationFn: (id: number) => api.deleteForumThread(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      queryClient.invalidateQueries({ queryKey: ["forum-pending"] });
      navigate({ search: (prev) => ({ ...prev, threadId: undefined }) });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => api.deleteForumPost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-thread", activeThreadId] });
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      queryClient.invalidateQueries({ queryKey: ["forum-pending"] });
    },
  });

  const moderateThreadMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" | "pending" }) =>
      api.setForumThreadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      queryClient.invalidateQueries({ queryKey: ["forum-pending"] });
      queryClient.invalidateQueries({ queryKey: ["forum-thread", activeThreadId] });
    },
  });

  const moderatePostMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: "approved" | "rejected" | "pending" }) =>
      api.setForumPostStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-thread", activeThreadId] });
      queryClient.invalidateQueries({ queryKey: ["forum-pending"] });
    },
  });

  const likeThreadMutation = useMutation({
    mutationFn: (threadId: number) => api.likeForumThread(threadId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-threads"] });
      queryClient.invalidateQueries({ queryKey: ["forum-thread", activeThreadId] });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: (postId: number) => api.likeForumPost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-thread", activeThreadId] });
    },
  });

  const resetNewThreadForm = () => {
    setNewThreadTitle("");
    setNewThreadCategory("general");
    setNewThreadContent("");
    setCreateThreadError("");
  };

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newThreadTitle || !newThreadContent) {
      setCreateThreadError(translateError("MISSING_FIELDS", lang));
      return;
    }
    const authorName = forumUser ? forumUser.displayName : "";
    if (!authorName) {
      setCreateThreadError(t("forum.auth.required"));
      return;
    }
    createThreadMutation.mutate({
      category: newThreadCategory,
      author_name: authorName,
      title: newThreadTitle,
      content: newThreadContent,
    });
  };

  const handleCreateReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeThreadId) return;
    if (!replyContent) {
      setReplyError(translateError("MISSING_FIELDS", lang));
      return;
    }
    const authorName = forumUser ? forumUser.displayName : "";
    if (!authorName) {
      setReplyError(t("forum.auth.required"));
      return;
    }
    createReplyMutation.mutate({
      threadId: activeThreadId,
      data: { author_name: authorName, content: replyContent },
    });
  };

  const handleCategorySelect = (category: string | undefined) => {
    navigate({
      search: (prev) => ({
        ...prev,
        category: category || undefined,
        threadId: undefined,
      }),
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        search: e.target.value || undefined,
      }),
    });
  };

  const handleTabChange = (tab: "threads" | "pending") => {
    navigate({
      search: (prev) => ({
        ...prev,
        tab: tab === "threads" ? undefined : tab,
        threadId: undefined,
      }),
    });
  };

  const filteredThreads = threads.filter((thr) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      thr.title.toLowerCase().includes(q) ||
      thr.content.toLowerCase().includes(q) ||
      thr.author_name.toLowerCase().includes(q)
    );
  });

  return (
    <PageShell>
      <Crumbs items={[{ label: t("ui.archive") }, { label: t("nav.forum"), active: true }]} />

      <div className="flex items-center justify-between mb-6">
        <div />
        {forumUser ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <div className="h-7 w-7 rounded-full bg-rocsta-green/10 flex items-center justify-center text-rocsta-green">
                <User className="size-3.5" />
              </div>
              <div>
                <span className="font-bold text-foreground">{forumUser.displayName}</span>
                <Badge variant="outline" className="ml-1.5 text-[8px] py-0 px-1 capitalize">
                  {forumUser.role}
                </Badge>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="size-3" />
              {t("forum.auth.logout")}
            </button>
          </div>
        ) : (
          <Dialog open={authOpen} onOpenChange={setAuthOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors">
                <LogIn className="size-3.5" />
                {t("forum.auth.login")}
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-sm border-border bg-card">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold">
                  {authMode === "login"
                    ? t("forum.auth.loginTitle")
                    : t("forum.auth.registerTitle")}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAuth} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    {t("forum.auth.username")}
                  </label>
                  <Input
                    required
                    value={authUsername}
                    onChange={(e) => setAuthUsername(e.target.value)}
                    placeholder="rocstero_88"
                    className="bg-muted/30 text-xs"
                    minLength={3}
                  />
                </div>
                {authMode === "register" && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-muted-foreground uppercase">
                      {t("forum.auth.displayName")}
                    </label>
                    <Input
                      value={authDisplayName}
                      onChange={(e) => setAuthDisplayName(e.target.value)}
                      placeholder={t("forum.auth.displayNamePlaceholder")}
                      className="bg-muted/30 text-xs"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    {t("forum.auth.password")}
                  </label>
                  <Input
                    required
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="bg-muted/30 text-xs"
                    minLength={6}
                  />
                </div>
                {authError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-2.5 text-xs text-red-600 dark:text-red-400">
                    {authError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={authLoading}
                  className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                >
                  {authLoading ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <LogIn className="size-3.5" />
                  )}
                  {authMode === "login"
                    ? t("forum.auth.loginSubmit")
                    : t("forum.auth.registerSubmit")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setAuthError("");
                  }}
                  className="w-full text-center text-[10px] font-bold text-rocsta-green hover:underline"
                >
                  {authMode === "login" ? t("forum.auth.noAccount") : t("forum.auth.hasAccount")}
                </button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {activeThreadId && threadDetails ? (
        <div className="space-y-6">
          <button
            onClick={() =>
              navigate({
                search: (prev) => ({ ...prev, threadId: undefined }),
              })
            }
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rocsta-green hover:underline mb-2"
          >
            <ArrowLeft className="size-3.5" />
            {t("forum.detail.back")}
          </button>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(threadDetails.thread.category)}>
                {t(`forum.cat.${threadDetails.thread.category}`)}
              </Badge>
              {threadDetails.thread.status === "pending" && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[9px]"
                >
                  {t("forum.status.pending")}
                </Badge>
              )}
              {threadDetails.thread.status === "rejected" && (
                <Badge
                  variant="outline"
                  className="bg-red-500/10 text-red-500 border-red-500/20 text-[9px]"
                >
                  {t("forum.status.rejected")}
                </Badge>
              )}
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-semibold">
                <Clock className="size-3" />
                <span>{formatDate(threadDetails.thread.created_at)}</span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-foreground tracking-tight leading-tight">
              {threadDetails.thread.title}
            </h1>

            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <div className="h-7 w-7 rounded-full bg-rocsta-green/10 flex items-center justify-center text-rocsta-green">
                <User className="size-4" />
              </div>
              <div className="text-xs">
                <span className="font-extrabold text-foreground">
                  {threadDetails.thread.author_name}
                </span>
                <span className="text-[10px] text-muted-foreground ml-1">
                  ({t("forum.detail.author")})
                </span>
              </div>
            </div>

            <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
              {threadDetails.thread.content}
            </p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
              <button
                onClick={() => {
                  if (forumUser) likeThreadMutation.mutate(threadDetails.thread.id);
                }}
                className={`flex items-center gap-1 transition-colors ${threadDetails.thread.liked ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}
                disabled={!forumUser}
                title={
                  forumUser
                    ? threadDetails.thread.liked
                      ? "Quitar me gusta"
                      : "Me gusta"
                    : "Inicia sesión"
                }
              >
                <Heart className={`size-4 ${threadDetails.thread.liked ? "fill-current" : ""}`} />{" "}
                {threadDetails.thread.likes_count} {t("forum.likes")}
              </button>
              <span className="flex items-center gap-1">
                <Eye className="size-4" /> {threadDetails.thread.views} {t("forum.views")}
              </span>
              <span className="flex items-center gap-1">
                <MessageCircle className="size-4" /> {threadDetails.thread.replies_count}{" "}
                {t("forum.replies")}
              </span>
            </div>

            {isAdminOrMod && (
              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                <span className="text-[10px] font-bold text-muted-foreground uppercase mr-1">
                  <Shield className="size-3 inline mr-0.5" />
                  {t("forum.moderation")}
                </span>
                {threadDetails.thread.status !== "approved" && (
                  <button
                    onClick={() =>
                      moderateThreadMutation.mutate({
                        id: threadDetails.thread.id,
                        status: "approved",
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-green-500/10 border border-green-500/20 px-2 py-1 text-[10px] font-bold text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                  >
                    <Check className="size-3" /> {t("forum.moderation.approve")}
                  </button>
                )}
                {threadDetails.thread.status !== "rejected" && (
                  <button
                    onClick={() =>
                      moderateThreadMutation.mutate({
                        id: threadDetails.thread.id,
                        status: "rejected",
                      })
                    }
                    className="inline-flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/20 px-2 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                  >
                    <X className="size-3" /> {t("forum.moderation.reject")}
                  </button>
                )}
                <button
                  onClick={() =>
                    showConfirm(t("forum.moderation.confirmDelete"), () =>
                      deleteThreadMutation.mutate(threadDetails.thread.id),
                    )
                  }
                  className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors"
                >
                  <Trash2 className="size-3" /> {t("forum.moderation.delete")}
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-4">
            <h2 className="text-lg font-bold text-foreground">
              {t("forum.detail.repliesTitle").replace(
                "{count}",
                String(threadDetails.posts.length),
              )}
            </h2>

            {threadDetails.posts.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center text-xs text-muted-foreground">
                {t("forum.detail.noReplies")}
              </div>
            ) : (
              <div className="space-y-3">
                {threadDetails.posts.map((post) => (
                  <div
                    key={post.id}
                    className={[
                      "rounded-xl border bg-card/65 p-4 space-y-2",
                      post.status === "pending"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : post.status === "rejected"
                          ? "border-red-500/30 bg-red-500/5 opacity-50"
                          : "border-border",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between border-b border-border/40 pb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                          <User className="size-3.5" />
                        </div>
                        <span className="text-xs font-bold text-foreground">
                          {post.author_name}
                        </span>
                        {post.status === "pending" && (
                          <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] py-0"
                          >
                            {t("forum.status.pending")}
                          </Badge>
                        )}
                        {post.status === "rejected" && (
                          <Badge
                            variant="outline"
                            className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] py-0"
                          >
                            {t("forum.status.rejected")}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-muted-foreground font-semibold">
                          {formatDate(post.created_at)}
                        </span>
                        {isAdminOrMod && (
                          <div className="flex items-center gap-1">
                            {post.status !== "approved" && (
                              <button
                                onClick={() =>
                                  moderatePostMutation.mutate({ id: post.id, status: "approved" })
                                }
                                className="rounded p-0.5 text-green-500 hover:bg-green-500/10 transition-colors"
                                title={t("forum.moderation.approve")}
                              >
                                <Check className="size-3" />
                              </button>
                            )}
                            {post.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  moderatePostMutation.mutate({ id: post.id, status: "rejected" })
                                }
                                className="rounded p-0.5 text-amber-500 hover:bg-amber-500/10 transition-colors"
                                title={t("forum.moderation.reject")}
                              >
                                <X className="size-3" />
                              </button>
                            )}
                            <button
                              onClick={() =>
                                showConfirm(t("forum.moderation.confirmDelete"), () =>
                                  deletePostMutation.mutate(post.id),
                                )
                              }
                              className="rounded p-0.5 text-red-500 hover:bg-red-500/10 transition-colors"
                              title={t("forum.moderation.delete")}
                            >
                              <Trash2 className="size-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-foreground/95 whitespace-pre-wrap leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-1 pt-1">
                      <button
                        onClick={() => {
                          if (forumUser) likePostMutation.mutate(post.id);
                        }}
                        className={`flex items-center gap-1 transition-colors ${post.liked ? "text-red-500" : "text-muted-foreground hover:text-red-400"}`}
                        disabled={!forumUser}
                        title={
                          forumUser
                            ? post.liked
                              ? "Quitar me gusta"
                              : "Me gusta"
                            : "Inicia sesión"
                        }
                      >
                        <Heart className={`size-3 ${post.liked ? "fill-current" : ""}`} />{" "}
                        {post.likes_count}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              <MessageSquare className="size-4 text-rocsta-green" />
              {t("forum.reply.title")}
            </h3>

            {forumUser ? (
              <form onSubmit={handleCreateReply} className="space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="size-3.5" />
                  <span>
                    {t("forum.reply.postingAs")}{" "}
                    <strong className="text-foreground">{forumUser.displayName}</strong>
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase">
                    {t("forum.reply.content")}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder={t("forum.reply.contentPlaceholder")}
                    className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
                  />
                </div>

                {replyError && (
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-400">
                    {replyError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={createReplyMutation.isPending}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                >
                  {createReplyMutation.isPending ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Send className="size-3.5" />
                  )}
                  {t("forum.reply.submit")}
                </button>
              </form>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-center text-xs text-muted-foreground">
                <p>{t("forum.auth.requiredToReply")}</p>
                <button
                  onClick={() => setAuthOpen(true)}
                  className="mt-2 inline-flex items-center gap-1 text-rocsta-green font-bold hover:underline"
                >
                  <LogIn className="size-3" /> {t("forum.auth.login")}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {t("forum.title")}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground max-w-2xl">{t("forum.desc")}</p>
            </div>

            {forumUser ? (
              <Dialog open={newThreadOpen} onOpenChange={setNewThreadOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm shrink-0">
                    <Plus className="size-4" />
                    {t("forum.newThread")}
                  </button>
                </DialogTrigger>

                <DialogContent className="max-w-md border-border bg-card text-foreground">
                  <DialogHeader>
                    <DialogTitle className="text-base font-bold">
                      {t("forum.create.title")}
                    </DialogTitle>
                  </DialogHeader>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <User className="size-3.5" />
                    <span>
                      {t("forum.reply.postingAs")}{" "}
                      <strong className="text-foreground">{forumUser.displayName}</strong>
                    </span>
                    {!forumUser && (
                      <Badge
                        variant="outline"
                        className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px]"
                      >
                        {t("forum.status.pending")}
                      </Badge>
                    )}
                  </div>

                  <form onSubmit={handleCreateThread} className="space-y-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t("forum.create.category")}
                      </label>
                      <Select value={newThreadCategory} onValueChange={setNewThreadCategory}>
                        <SelectTrigger className="bg-muted/30 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {t(`forum.cat.${cat}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t("forum.create.titleLabel")}
                      </label>
                      <Input
                        required
                        value={newThreadTitle}
                        onChange={(e) => setNewThreadTitle(e.target.value)}
                        placeholder={t("forum.create.titlePlaceholder")}
                        className="bg-muted/30 focus-visible:ring-rocsta-green text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">
                        {t("forum.create.content")}
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={newThreadContent}
                        onChange={(e) => setNewThreadContent(e.target.value)}
                        placeholder={t("forum.create.contentPlaceholder")}
                        className="w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rocsta-green"
                      />
                    </div>

                    {createThreadError && (
                      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-600 dark:text-red-400">
                        {createThreadError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={createThreadMutation.isPending}
                      className="inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-md bg-rocsta-green px-4 text-xs font-bold text-primary-foreground hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
                    >
                      {createThreadMutation.isPending ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Plus className="size-3.5" />
                      )}
                      {t("forum.create.submit")}
                    </button>
                  </form>
                </DialogContent>
              </Dialog>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-border bg-card px-4 text-xs font-bold text-foreground hover:bg-muted transition-all shrink-0"
              >
                <LogIn className="size-4" />
                {t("forum.auth.loginToPost")}
              </button>
            )}
          </div>

          {isAdminOrMod && (
            <div className="flex items-center gap-1 border-b border-border">
              <button
                onClick={() => handleTabChange("threads")}
                className={[
                  "px-4 py-2 text-xs font-bold border-b-2 transition-colors -mb-px",
                  activeTab === "threads"
                    ? "border-rocsta-green text-rocsta-green"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                {t("forum.tab.threads")}
              </button>
              <button
                onClick={() => handleTabChange("pending")}
                className={[
                  "px-4 py-2 text-xs font-bold border-b-2 transition-colors -mb-px flex items-center gap-1.5",
                  activeTab === "pending"
                    ? "border-amber-500 text-amber-500"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                ].join(" ")}
              >
                <Shield className="size-3" />
                {t("forum.tab.pending")}
                {pendingData && pendingData.threads.length + pendingData.posts.length > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[9px] font-bold text-amber-600 dark:text-amber-400">
                    {pendingData.threads.length + pendingData.posts.length}
                  </span>
                )}
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="space-y-2 lg:col-span-1">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-2">
                {t("forum.categories")}
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-1 text-xs">
                <button
                  onClick={() => handleCategorySelect(undefined)}
                  className={[
                    "w-full text-left rounded-md px-3 py-2 transition-colors font-semibold",
                    !selectedCategory
                      ? "text-rocsta-green bg-rocsta-green/5"
                      : "text-muted-foreground hover:bg-muted/50",
                  ].join(" ")}
                >
                  {t("forum.allCategories")}
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategorySelect(cat)}
                    className={[
                      "w-full text-left rounded-md px-3 py-2 transition-colors font-semibold",
                      selectedCategory === cat
                        ? "text-rocsta-green bg-rocsta-green/5"
                        : "text-muted-foreground hover:bg-muted/50",
                    ].join(" ")}
                  >
                    {t(`forum.cat.${cat}`)}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {activeTab === "pending" && isAdminOrMod ? (
                loadingPending ? (
                  <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                    <Loader2 className="size-6 animate-spin text-rocsta-green" />
                    <span>{t("ui.loading")}</span>
                  </div>
                ) : pendingData && pendingData.threads.length + pendingData.posts.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-500/10 text-green-500 mb-3">
                      <Check className="size-5" />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">
                      {t("forum.pending.empty")}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {t("forum.pending.emptyDesc")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingData!.threads.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                          <MessageSquare className="size-3" /> {t("forum.pending.threads")} (
                          {pendingData!.threads.length})
                        </h3>
                        <div className="divide-y divide-border/60 rounded-xl border border-border bg-card overflow-hidden">
                          {pendingData!.threads.map((thread) => (
                            <div key={thread.id} className="p-4 space-y-2 bg-amber-500/[0.02]">
                              <div className="flex items-center justify-between">
                                <Badge
                                  variant="outline"
                                  className={getCategoryColor(thread.category)}
                                >
                                  {t(`forum.cat.${thread.category}`)}
                                </Badge>
                                <span className="text-[9px] text-muted-foreground font-semibold">
                                  {formatDate(thread.created_at)}
                                </span>
                              </div>
                              <h4 className="text-sm font-extrabold text-foreground">
                                {thread.title}
                              </h4>
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {thread.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                  <User className="size-3" /> {thread.author_name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      moderateThreadMutation.mutate({
                                        id: thread.id,
                                        status: "approved",
                                      })
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-green-500/10 border border-green-500/20 px-2 py-1 text-[10px] font-bold text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                                  >
                                    <Check className="size-3" /> {t("forum.moderation.approve")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      moderateThreadMutation.mutate({
                                        id: thread.id,
                                        status: "rejected",
                                      })
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/20 px-2 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                                  >
                                    <X className="size-3" /> {t("forum.moderation.reject")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      showConfirm(t("forum.moderation.confirmDelete"), () =>
                                        deleteThreadMutation.mutate(thread.id),
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {pendingData!.posts.length > 0 && (
                      <div>
                        <h3 className="text-xs font-bold text-muted-foreground uppercase mb-2 flex items-center gap-1">
                          <MessageCircle className="size-3" /> {t("forum.pending.posts")} (
                          {pendingData!.posts.length})
                        </h3>
                        <div className="divide-y divide-border/60 rounded-xl border border-border bg-card overflow-hidden">
                          {(pendingData!.posts as any[]).map((post) => (
                            <div key={post.id} className="p-4 space-y-2 bg-amber-500/[0.02]">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-semibold">
                                  {t("forum.pending.inThread")}{" "}
                                  <strong className="text-foreground">{post.thread_title}</strong>
                                </span>
                                <span className="text-[9px] text-muted-foreground font-semibold">
                                  {formatDate(post.created_at)}
                                </span>
                              </div>
                              <p className="text-xs text-foreground/95 whitespace-pre-wrap">
                                {post.content}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                                  <User className="size-3" /> {post.author_name}
                                </span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() =>
                                      moderatePostMutation.mutate({
                                        id: post.id,
                                        status: "approved",
                                      })
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-green-500/10 border border-green-500/20 px-2 py-1 text-[10px] font-bold text-green-600 dark:text-green-400 hover:bg-green-500/20 transition-colors"
                                  >
                                    <Check className="size-3" /> {t("forum.moderation.approve")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      moderatePostMutation.mutate({
                                        id: post.id,
                                        status: "rejected",
                                      })
                                    }
                                    className="inline-flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/20 px-2 py-1 text-[10px] font-bold text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                                  >
                                    <X className="size-3" /> {t("forum.moderation.reject")}
                                  </button>
                                  <button
                                    onClick={() =>
                                      showConfirm(t("forum.moderation.confirmDelete"), () =>
                                        deletePostMutation.mutate(post.id),
                                      )
                                    }
                                    className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors"
                                  >
                                    <Trash2 className="size-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={t("forum.searchPlaceholder")}
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 bg-muted/20 focus-visible:ring-rocsta-green text-xs h-10 rounded-xl"
                    />
                  </div>

                  {loadingThreads ? (
                    <div className="py-20 text-center text-xs text-muted-foreground flex flex-col items-center justify-center gap-2">
                      <Loader2 className="size-6 animate-spin text-rocsta-green" />
                      <span>{t("ui.loading")}</span>
                    </div>
                  ) : filteredThreads.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border bg-card py-16 text-center">
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground mb-3">
                        <MessageSquare className="size-5" />
                      </div>
                      <h3 className="text-sm font-bold text-foreground">{t("forum.noThreads")}</h3>
                      <p className="mt-1 text-xs text-muted-foreground max-w-xs mx-auto">
                        {t("forum.noThreadsDesc")}
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/60 rounded-xl border border-border bg-card overflow-hidden shadow-sm">
                      {filteredThreads.map((thread) => (
                        <div
                          key={thread.id}
                          onClick={() =>
                            navigate({
                              search: (prev) => ({ ...prev, threadId: thread.id }),
                            })
                          }
                          className="p-4 hover:bg-muted/40 transition-colors cursor-pointer space-y-2 group"
                        >
                          <div className="flex flex-wrap items-center gap-2 justify-between">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className={[
                                  getCategoryColor(thread.category),
                                  "text-[9px] py-0 px-1.5",
                                ].join(" ")}
                              >
                                {t(`forum.cat.${thread.category}`)}
                              </Badge>
                              {thread.status === "pending" && (
                                <Badge
                                  variant="outline"
                                  className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-[8px] py-0 px-1"
                                >
                                  {t("forum.status.pending")}
                                </Badge>
                              )}
                              {thread.status === "rejected" && (
                                <Badge
                                  variant="outline"
                                  className="bg-red-500/10 text-red-500 border-red-500/20 text-[8px] py-0 px-1"
                                >
                                  {t("forum.status.rejected")}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 text-[9px] text-muted-foreground font-semibold">
                              <Clock className="size-3" />
                              <span>
                                {t("forum.lastActivity")}: {formatDate(thread.last_activity)}
                              </span>
                            </div>
                          </div>

                          <h3 className="text-sm font-extrabold text-foreground group-hover:text-rocsta-green transition-colors leading-tight">
                            {thread.title}
                          </h3>

                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {thread.content}
                          </p>

                          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-[10px] text-muted-foreground font-semibold">
                            <div className="flex items-center gap-1">
                              <User className="size-3 text-rocsta-accent" />
                              <span>{thread.author_name}</span>
                              <span className="text-slate-400 font-normal">
                                · {formatDate(thread.created_at)}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (forumUser) likeThreadMutation.mutate(thread.id);
                                }}
                                className={`flex items-center gap-1 transition-colors ${thread.liked ? "text-red-500" : "text-slate-400 hover:text-red-400"}`}
                                disabled={!forumUser}
                                title={
                                  forumUser
                                    ? thread.liked
                                      ? "Quitar me gusta"
                                      : "Me gusta"
                                    : "Inicia sesión"
                                }
                              >
                                <Heart className={`size-3 ${thread.liked ? "fill-current" : ""}`} />{" "}
                                {thread.likes_count}
                              </button>
                              <span className="flex items-center gap-1">
                                <Eye className="size-3 text-slate-400" /> {thread.views}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="size-3 text-slate-400" />{" "}
                                {thread.replies_count}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-sm border-border bg-card">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold">
              {t("forum.moderation.confirmTitle")}
            </DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">{confirmMessage}</p>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => setConfirmOpen(false)}
              className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-[10px] font-bold text-muted-foreground hover:bg-muted transition-colors"
            >
              {t("ui.cancel")}
            </button>
            <button
              onClick={handleConfirm}
              className="inline-flex h-8 items-center justify-center rounded-md bg-red-500 px-3 text-[10px] font-bold text-white hover:bg-red-600 transition-colors"
            >
              {t("ui.confirm")}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
