let API_BASE = "";
try {
  API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";
} catch {} /* import.meta.env only available in Vite */

export function getApiBase() {
  return API_BASE;
}

export interface ApiMember {
  id: string;
  name: string;
  country: string;
  avatar_color: string;
  contributions: number;
  speciality: string;
  joined_year: number;
}

export interface ApiStats {
  partsCatalog: number;
  partsDocumented: number;
  verifiedEquivalences: number;
  repairGuides: number;
  registeredProblems: number;
  totalContributions: number;
}

export interface ApiCompatibility {
  id: string;
  rocstaPart: { es: string; en: string };
  donorVehicle: { es: string; en: string };
  donorRef: string;
  type: "directo" | "adaptación";
  difficulty: string;
  motor: string;
  verified: boolean;
  confirmations: number;
  notes?: { es: string; en: string };
  category: string;
}

export interface ApiPart {
  id: string;
  name: { es: string; en: string };
  category: string;
  description: { es: string; en: string };
  oem: string | { es: string; en: string };
  equiv: string[];
  status: "verified" | "mod" | "unverified";
  motor: string;
  notes?: { es: string; en: string };
  refs?: string[];
}

export interface ApiGuideTool {
  name: { es: string; en: string };
  quantity: number;
  image?: string;
}

export interface ApiGuideStep {
  title: { es: string; en: string };
  content: { es: string; en: string };
  images?: string[];
}

export interface ApiGalleryEntry {
  id: string;
  image: string;
  year: string;
  motor: string;
  country: string;
  owner: string;
  verified: boolean;
}

export interface ApiProblem {
  id: string;
  title: { es: string; en: string };
  severity: "critical" | "warn" | "info";
  motor: string;
  km: string;
  symptom: { es: string; en: string };
  cause: { es: string; en: string };
  solution: { es: string; en: string };
  cost: string;
  difficulty: string;
  category: string;
  reports: number;
}

export interface ApiGuide {
  id: string;
  slug: string;
  title: { es: string; en: string };
  description: { es: string; en: string };
  level: string;
  time: string;
  image?: string;
  motor: string;
  category: string;
  tools: ApiGuideTool[];
  steps: ApiGuideStep[];
  tags: string[];
  contributions: number;
}

export type FormType = "comp" | "part" | "guide" | "problem" | "bug" | "partwrong" | "photo";

export interface ApiSubmission {
  type: FormType;
  username: string;
  email: string;
  title: string;
  description?: string;
  data?: Record<string, string>;
}

export interface ApiForumThread {
  id: number;
  category: "general" | "mechanical" | "electrical" | "body" | "marketplace";
  author_name: string;
  user_id: number | null;
  title: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  views: number;
  replies_count: number;
  last_activity: string;
  likes_count: number;
  liked: boolean;
}

export interface ApiForumPost {
  id: number;
  thread_id: number;
  author_name: string;
  user_id: number | null;
  content: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  likes_count: number;
  liked: boolean;
}

export interface ForumUser {
  id: number;
  username: string;
  role: "admin" | "moderator" | "user";
  displayName: string;
}


export class ApiError extends Error {
  status: number;
  errorCode?: string;
  constructor(message: string, status: number, errorCode?: string) {
    super(message);
    this.status = status;
    this.errorCode = errorCode;
  }
}

const FORUM_TOKEN_KEY = "rocsta-forum-token";

export function getForumToken(): string | null {
  try {
    return localStorage.getItem(FORUM_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setForumToken(token: string | null) {
  try {
    if (token) {
      localStorage.setItem(FORUM_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(FORUM_TOKEN_KEY);
    }
  } catch {}
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getForumToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "bypass-tunnel-reminder": "true",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Error ${res.status}`, res.status, body.errorCode);
  }

  return res.json();
}

export const api = {
  getStats(): Promise<ApiStats> {
    return request("/api/stats");
  },

  getMembers(): Promise<ApiMember[]> {
    return request("/api/members");
  },

  getCompatibilities(): Promise<ApiCompatibility[]> {
    return request("/api/compatibilities");
  },

  getGuides(): Promise<ApiGuide[]> {
    return request("/api/guides");
  },

  getParts(params?: { category?: string; motor?: string; status?: string }): Promise<ApiPart[]> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const path = queryString ? `/api/parts?${queryString}` : "/api/parts";
    return request(path);
  },

  confirmCompatibility(
    id: string,
  ): Promise<{ id: string; confirmations: number; message: string }> {
    return request(`/api/compatibilities/${id}/confirm`, { method: "POST" });
  },

  getConfirmationStatus(
    id: string,
  ): Promise<{ id: string; confirmations: number; userConfirmed: boolean }> {
    return request(`/api/compatibilities/${id}/confirmations/count`);
  },

  submit(data: ApiSubmission): Promise<{ id: number; message: string }> {
    return request("/api/submissions", { method: "POST", body: JSON.stringify(data) });
  },

  getGallery(): Promise<ApiGalleryEntry[]> {
    return request("/api/gallery");
  },

  getProblems(params?: {
    category?: string;
    motor?: string;
    severity?: string;
  }): Promise<ApiProblem[]> {
    const queryString = new URLSearchParams(params as Record<string, string>).toString();
    const path = queryString ? `/api/problems?${queryString}` : "/api/problems";
    return request(path);
  },

  confirmProblem(id: string): Promise<{ id: string; reports: number; message: string }> {
    return request(`/api/problems/${id}/confirm`, { method: "POST" });
  },

  getProblemConfirmationStatus(
    id: string,
  ): Promise<{ id: string; reports: number; userConfirmed: boolean }> {
    return request(`/api/problems/${id}/confirmations/count`);
  },

  submitGalleryPhoto(formData: FormData): Promise<{ id: string; image: string; message: string }> {
    return fetch(`${API_BASE}/api/gallery/submit`, {
      method: "POST",
      body: formData,
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Error ${res.status}`);
      }
      return res.json();
    });
  },

  getForumThreads(category?: string, includePending?: boolean): Promise<ApiForumThread[]> {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (includePending) params.set("includePending", "true");
    const qs = params.toString();
    const path = qs ? `/api/forum/threads?${qs}` : "/api/forum/threads";
    return request(path);
  },

  getForumThread(id: number): Promise<{ thread: ApiForumThread; posts: ApiForumPost[] }> {
    return request(`/api/forum/threads/${id}`);
  },

  createForumThread(data: {
    category: string;
    author_name: string;
    title: string;
    content: string;
  }): Promise<{ id: number; status: string; message: string }> {
    return request("/api/forum/threads", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  createForumPost(
    threadId: number,
    data: { author_name: string; content: string }
  ): Promise<{ status: string; message: string }> {
    return request(`/api/forum/threads/${threadId}/posts`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forumRegister(data: {
    username: string;
    password: string;
    display_name?: string;
  }): Promise<{ token: string; user: ForumUser }> {
    return request("/api/forum/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forumLogin(data: {
    username: string;
    password: string;
  }): Promise<{ token: string; user: ForumUser }> {
    return request("/api/forum/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forumLogout(): Promise<{ message: string }> {
    return request("/api/forum/logout", { method: "POST" });
  },

  forumMe(): Promise<{ user: ForumUser | null }> {
    return request("/api/forum/me");
  },

  deleteForumThread(id: number): Promise<{ message: string }> {
    return request(`/api/forum/threads/${id}`, { method: "DELETE" });
  },

  deleteForumPost(id: number): Promise<{ message: string }> {
    return request(`/api/forum/posts/${id}`, { method: "DELETE" });
  },

  setForumThreadStatus(id: number, status: "approved" | "rejected" | "pending"): Promise<{ message: string }> {
    return request(`/api/forum/threads/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  setForumPostStatus(id: number, status: "approved" | "rejected" | "pending"): Promise<{ message: string }> {
    return request(`/api/forum/posts/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },

  likeForumThread(id: number): Promise<{ liked: boolean; likes: number }> {
    return request(`/api/forum/threads/${id}/like`, {
      method: "POST",
    });
  },

  likeForumPost(id: number): Promise<{ liked: boolean; likes: number }> {
    return request(`/api/forum/posts/${id}/like`, {
      method: "POST",
    });
  },

  getForumPending(): Promise<{ threads: ApiForumThread[]; posts: ApiForumPost[] & { thread_title: string }[] }> {
    return request("/api/forum/admin/pending");
  },

  getForumUsers(): Promise<(ForumUser & { created_at: string; last_login: string | null })[]> {
    return request("/api/forum/admin/users");
  },

  setForumUserRole(id: number, role: "admin" | "moderator" | "user"): Promise<{ message: string }> {
    return request(`/api/forum/admin/users/${id}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role }),
    });
  },
};

const ERROR_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    MISSING_FIELDS: "Faltan campos obligatorios",
    INVALID_CATEGORY: "Categoría de foro inválida",
    AUTHOR_TOO_SHORT: "Nombre de autor muy corto",
    TITLE_TOO_SHORT: "Título muy corto",
    CONTENT_TOO_SHORT: "Contenido del hilo muy corto",
    REPLY_TOO_SHORT: "Respuesta muy corta",
    THREAD_NOT_FOUND: "Hilo no encontrado",
    POST_NOT_FOUND: "Post no encontrado",
    USER_NOT_FOUND: "Usuario no encontrado",
    INVALID_ROLE: "Rol inválido",
    LAST_ADMIN: "No puedes eliminar el único admin",
  },
  en: {
    MISSING_FIELDS: "Missing required fields",
    INVALID_CATEGORY: "Invalid forum category",
    AUTHOR_TOO_SHORT: "Author name too short",
    TITLE_TOO_SHORT: "Title too short",
    CONTENT_TOO_SHORT: "Thread content too short",
    REPLY_TOO_SHORT: "Reply too short",
    THREAD_NOT_FOUND: "Thread not found",
    POST_NOT_FOUND: "Post not found",
    USER_NOT_FOUND: "User not found",
    INVALID_ROLE: "Invalid role",
    LAST_ADMIN: "Cannot delete the only admin",
  },
  fr: {
    MISSING_FIELDS: "Champs obligatoires manquants",
    INVALID_CATEGORY: "Catégorie de forum invalide",
    AUTHOR_TOO_SHORT: "Nom d'auteur trop court",
    TITLE_TOO_SHORT: "Titre trop court",
    CONTENT_TOO_SHORT: "Contenu du fil trop court",
    REPLY_TOO_SHORT: "Réponse trop courte",
    THREAD_NOT_FOUND: "Fil non trouvé",
    POST_NOT_FOUND: "Post non trouvé",
    USER_NOT_FOUND: "Utilisateur non trouvé",
    INVALID_ROLE: "Rôle invalide",
    LAST_ADMIN: "Impossible de supprimer le seul admin",
  },
  pt: {
    MISSING_FIELDS: "Campos obrigatórios faltando",
    INVALID_CATEGORY: "Categoria de fórum inválida",
    AUTHOR_TOO_SHORT: "Nome do autor muito curto",
    TITLE_TOO_SHORT: "Título muito curto",
    CONTENT_TOO_SHORT: "Conteúdo do tópico muito curto",
    REPLY_TOO_SHORT: "Resposta muito curta",
    THREAD_NOT_FOUND: "Tópico não encontrado",
    POST_NOT_FOUND: "Post não encontrado",
    USER_NOT_FOUND: "Usuário não encontrado",
    INVALID_ROLE: "Função inválida",
    LAST_ADMIN: "Não é possível excluir o único admin",
  },
  de: {
    MISSING_FIELDS: "Pflichtfelder fehlen",
    INVALID_CATEGORY: "Ungültige Forum-Kategorie",
    AUTHOR_TOO_SHORT: "Autorenname zu kurz",
    TITLE_TOO_SHORT: "Titel zu kurz",
    CONTENT_TOO_SHORT: "Beitragsinhalt zu kurz",
    REPLY_TOO_SHORT: "Antwort zu kurz",
    THREAD_NOT_FOUND: "Thread nicht gefunden",
    POST_NOT_FOUND: "Beitrag nicht gefunden",
    USER_NOT_FOUND: "Benutzer nicht gefunden",
    INVALID_ROLE: "Ungültige Rolle",
    LAST_ADMIN: "Der einzige Admin kann nicht gelöscht werden",
  },
};

export function translateError(errorCode: string | undefined, locale: string, fallback?: string): string {
  if (!errorCode) return fallback || "Error";
  const lang = locale in ERROR_TRANSLATIONS ? locale : "en";
  return ERROR_TRANSLATIONS[lang][errorCode] || fallback || errorCode;
}
