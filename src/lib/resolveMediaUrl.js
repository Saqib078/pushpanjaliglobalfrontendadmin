/**
 * Resolve media URLs for the Admin UI so **old and new** stored values all display:
 * - New: `/uploads/products/...` (Vite proxies to Admin API in dev)
 * - Legacy: full `http(s)://.../uploads/...` or any external URL
 * - Web-style fallbacks: `/images/...` (Vite proxies to Web portal in dev)
 *
 * In production, set `VITE_ADMIN_API_URL` and optionally `VITE_WEB_PORTAL_ORIGIN`
 * for `/images/` paths if the shop is on another host.
 */
const DEFAULT_API = "http://localhost:8081";
const DEFAULT_WEB = "http://localhost:5173";

function getApiOrigin() {
  const base = import.meta.env.VITE_ADMIN_API_URL?.replace(/\/+$/, "") || DEFAULT_API;
  try {
    return new URL(base).origin;
  } catch {
    return DEFAULT_API;
  }
}

function getWebOrigin() {
  const w = import.meta.env.VITE_WEB_PORTAL_ORIGIN?.replace(/\/+$/, "");
  if (w) {
    try {
      return new URL(w).origin;
    } catch {
      return DEFAULT_WEB;
    }
  }
  return DEFAULT_WEB;
}

/**
 * @param {string} s
 * @returns {string | null}
 */
function toUploadsPath(s) {
  const t = s.trim();
  if (!t) return null;
  if (t.startsWith("/uploads")) return t.split("#")[0];
  if (t.startsWith("//")) {
    try {
      const u = new URL(`https:${t}`);
      if (u.pathname.startsWith("/uploads")) return u.pathname + u.search;
    } catch {
      return null;
    }
  }
  try {
    const u = new URL(t);
    if (u.pathname.startsWith("/uploads")) return u.pathname + u.search;
  } catch {
    /* ignore */
  }
  if (t.startsWith("uploads/")) return `/${t}`;
  return null;
}

/**
 * @param {unknown} raw — image_url from API / DB
 * @returns {string | null}
 */
export function resolveAdminMediaUrl(raw) {
  if (raw == null) return null;
  const s = typeof raw === "string" ? raw.trim() : String(raw).trim();
  if (!s) return null;

  if (s.startsWith("data:")) return s;

  const uploadsPath = toUploadsPath(s);
  if (uploadsPath) {
    if (import.meta.env.DEV) {
      return uploadsPath;
    }
    return `${getApiOrigin()}${uploadsPath}`;
  }

  // Any absolute http(s) URL (legacy full admin URL, CDN, etc.) — unchanged
  if (/^https?:\/\//i.test(s)) {
    return s;
  }

  // Web portal public folder (same paths as FeaturedPickles fallbacks)
  if (s.startsWith("/images/")) {
    if (import.meta.env.DEV) {
      return s;
    }
    const web = import.meta.env.VITE_WEB_PORTAL_ORIGIN?.replace(/\/+$/, "");
    if (web) {
      try {
        return `${new URL(web).origin}${s}`;
      } catch {
        return `${getWebOrigin()}${s}`;
      }
    }
    return `${getWebOrigin()}${s}`;
  }

  // Other root-relative paths — do not prefix with Admin API (fixes bad legacy behavior)
  if (s.startsWith("/")) {
    return s;
  }

  return s;
}
