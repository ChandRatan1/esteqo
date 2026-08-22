/**
 * Page SEO overrides — per-path meta title/description, editable at
 * /admin/seo without touching code. Same backend origin as the blog/services
 * API; same admin password for writes.
 */

import { AdminError, getKey } from './blogAdmin';

const API = (import.meta.env.VITE_SERVICES_API || import.meta.env.VITE_BLOG_API || '').replace(
  /\/$/,
  ''
);

export const pageSeoApiConfigured = Boolean(API);

/**
 * Public read, used by <Seo> on every page. Fails silently — an unreachable
 * API or a path with no override just means the page's own defaults are used.
 */
export async function fetchPageSeoOverride(path) {
  if (!API) return null;
  try {
    const response = await fetch(`${API}/api/page-seo?path=${encodeURIComponent(path)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.data || null;
  } catch {
    return null;
  }
}

async function adminRequest(path, { method = 'GET', body } = {}) {
  if (!API) {
    throw new AdminError(
      'The authoring API is not configured. Set VITE_BLOG_API in react-app/.env.'
    );
  }

  let response;
  try {
    response = await fetch(`${API}/api${path}`, {
      method,
      headers: {
        Accept: 'application/json',
        'x-admin-key': getKey(),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AdminError(`Could not reach the API at ${API}. Is the backend running?`);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new AdminError(
      payload.error || `Request failed (${response.status})`,
      response.status,
      payload.details
    );
  }

  return payload;
}

export const pageSeoAdmin = {
  /** Same public endpoint — the data isn't sensitive, only writing it is. */
  load: (path) => adminRequest(`/page-seo?path=${encodeURIComponent(path)}`),
  save: (path, metaTitle, metaDescription) =>
    adminRequest('/admin/page-seo', { method: 'PUT', body: { path, metaTitle, metaDescription } }),
};
