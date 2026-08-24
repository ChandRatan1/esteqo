/**
 * Base URL for the backend API — blog, services, contacts, admin and SEO
 * endpoints all live at this origin's /api/*.
 *
 * VITE_BLOG_API (and friends) still work as an explicit override — useful in
 * local dev, where the frontend runs on Vite's dev server (4142) and the API
 * runs on a different port (4143), so it can't be inferred from the page's
 * own origin.
 *
 * When none of those are set, this falls back to the page's own origin at
 * runtime (window.location.origin) rather than staying blank. In production
 * the frontend and the API are served from the same domain, so this means a
 * plain build works there with zero configuration — and if the site is ever
 * moved to a different domain, it adapts automatically with no rebuild.
 */
export const API_ORIGIN = (
  import.meta.env.VITE_BLOG_API ||
  import.meta.env.VITE_SERVICES_API ||
  import.meta.env.VITE_CONTACT_API ||
  (typeof window !== 'undefined' ? window.location.origin : '')
).replace(/\/$/, '');
