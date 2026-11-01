const SITE_ORIGIN = "https://muhaddil.github.io";
const BASE = import.meta.env.BASE_URL || "/";
const BASE_PATH = BASE.replace(/\/$/, "");

/** Absolute public URL of the site, including the deployment base path. */
export const SITE_URL = `${SITE_ORIGIN}${BASE_PATH}`;

/**
 * Converts a site-relative asset path into an absolute URL.
 * Imported assets already include the base path, so they are not prefixed twice.
 */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  if (!path) return SITE_URL;
  if (BASE !== "/" && path.startsWith(BASE)) {
    return `${SITE_ORIGIN}${path}`;
  }
  const withBase = `${BASE_PATH}${path.startsWith("/") ? path : `/${path}`}`;
  return `${SITE_ORIGIN}${withBase}`;
}
