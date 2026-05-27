/** Part system categories matching the sidebar SYSTEMS navigation */
export type PartCategory =
  | "engine"
  | "transmission"
  | "suspension"
  | "electrical"
  | "brakes"
  | "tires"
  | "body";

/** Verification status of a part or compatibility entry */
export type VerificationStatus = "verified" | "mod" | "unverified";

/** Engine variant */
export type Motor = "F8" | "R2" | "ambos";

/** Severity level for problems */
export type Severity = "critical" | "warn" | "info";

/** Difficulty level for guides and repairs */
export type Difficulty = "Fácil" | "Media" | "Alta";

/** Guide skill level */
export type GuideLevel = "Principiante" | "Intermedio" | "Avanzado";

/** Manual document type */
export type ManualType = "workshop" | "electrical" | "catalog" | "datasheet" | "other";

/** Manual format */
export type ManualFormat = "pdf" | "image" | "web";

/** Manual language */
export type ManualLanguage = "es" | "en" | "ko" | "fr" | "de";

import type { Language } from "@/components/language-provider";

export type LocalizedString = Record<string, string>;

export function localize(value: string | LocalizedString, lang: Language): string {
  if (typeof value === "string") return value;
  return value[lang] || value["es"] || "";
}

export interface Part {
  id: string;
  name: LocalizedString;
  category: PartCategory;
  description: LocalizedString;
  oem: string;
  equiv: string[];
  status: VerificationStatus;
  motor: Motor;
  notes?: LocalizedString;
  /** Optional OEM reference numbers for cross-referencing */
  refs?: string[];
}

export interface Compatibility {
  id: string;
  /** Name of the Rocsta part */
  rocstaPart: LocalizedString;
  /** Donor vehicle(s) */
  donorVehicle: LocalizedString;
  /** Donor part reference / OEM */
  donorRef: string;
  /** Direct fit or requires adaptation */
  type: "directo" | "adaptación";
  difficulty: Difficulty;
  motor: Motor;
  verified: boolean;
  /** How many community members confirmed this */
  confirmations: number;
  notes?: LocalizedString;
  category: PartCategory;
}

export interface GuideStep {
  title: LocalizedString;
  content: LocalizedString;
}

export interface Guide {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  level: GuideLevel;
  time: string;
  /** Asset image path or external URL */
  image?: string;
  motor: Motor;
  tools: LocalizedString[];
  steps: GuideStep[];
  tags: string[];
  contributions: number;
  category: PartCategory;
}

export interface Problem {
  id: string;
  title: LocalizedString;
  severity: Severity;
  motor: Motor;
  /** Mileage range where the issue typically appears */
  km: string;
  symptom: LocalizedString;
  cause: LocalizedString;
  solution: LocalizedString;
  cost: string;
  difficulty: Difficulty;
  /** Related part categories */
  category: PartCategory;
  /** Number of community reports */
  reports: number;
}

export interface Manual {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  type: ManualType;
  format: ManualFormat;
  language: ManualLanguage;
  motor: Motor;
  /** External URL to the document */
  url?: string;
  /** Year of publication or reference */
  year?: string;
  /** Number of pages (if applicable) */
  pages?: number;
}

export interface CommunityMember {
  id: string;
  name: string;
  /** Country flag emoji */
  country: string;
  /** Avatar placeholder color */
  avatarColor: string;
  contributions: number;
  speciality: string;
  joinedYear: number;
}

export type SearchResultType = "part" | "compatibility" | "guide" | "problem" | "manual";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  description: string;
  /** Route path to navigate to */
  to: string;
  /** Optional search params to apply */
  params?: Record<string, string>;
}
