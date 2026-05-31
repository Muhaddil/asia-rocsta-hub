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

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "bypass-tunnel-reminder": "true",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.error || `Error ${res.status}`, res.status);
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
};
