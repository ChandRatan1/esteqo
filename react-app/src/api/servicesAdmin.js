/**
 * Services & departments authoring client.
 *
 * Talks to the PHP endpoints under /api/admin/services and /api/admin/categories,
 * protected by the same `x-admin-key` header and the same sessionStorage key as
 * the blog admin — sign in once at either screen and both work.
 */

import { AdminError, getKey } from './blogAdmin';
import { API_ORIGIN as API } from './apiOrigin';

export const servicesApiConfigured = Boolean(API);

async function request(path, { method = 'GET', body } = {}) {
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

export const servicesAdmin = {
  list: () => request('/admin/services'),
  get: (id) => request(`/admin/services/${id}`),
  create: (service) => request('/admin/services', { method: 'POST', body: service }),
  update: (id, service) => request(`/admin/services/${id}`, { method: 'PUT', body: service }),
  remove: (id) => request(`/admin/services/${id}`, { method: 'DELETE' }),
};

export const categoriesAdmin = {
  list: () => request('/admin/categories'),
  create: (category) => request('/admin/categories', { method: 'POST', body: category }),
  update: (id, category) => request(`/admin/categories/${id}`, { method: 'PUT', body: category }),
  remove: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
};

export const settingsAdmin = {
  get: (key) => request(`/admin/settings/${key}`),
  update: (key, value) => request(`/admin/settings/${key}`, { method: 'PUT', body: { value } }),
};
