/**
 * Blog authoring client.
 *
 * Talks to the Express endpoints under /api/admin/blog/*, which are protected
 * by a shared secret sent as the `x-admin-key` header. The key is whatever is
 * set as admin_key in backend-php/config.php.
 *
 * The key is kept in sessionStorage, so it is cleared when the browser tab
 * closes and never written to disk. It is a shared password, not a per-user
 * login — anyone who has it can publish.
 */

const API = (import.meta.env.VITE_BLOG_API || import.meta.env.VITE_CONTACT_API || '').replace(
  /\/$/,
  ''
);

const KEY_STORAGE = 'esteqo.adminKey';

export const adminApiConfigured = Boolean(API);

export const getKey = () => {
  try {
    return window.sessionStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
};

export const setKey = (key) => {
  try {
    window.sessionStorage.setItem(KEY_STORAGE, key);
  } catch {
    /* storage unavailable — the session simply will not persist a reload */
  }
};

export const clearKey = () => {
  try {
    window.sessionStorage.removeItem(KEY_STORAGE);
  } catch {
    /* nothing to do */
  }
};

export class AdminError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'AdminError';
    this.status = status;
    this.details = details;
  }
}

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
    throw new AdminError(
      `Could not reach the API at ${API}. Is the backend running?`
    );
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

export const blogAdmin = {
  /** Any authenticated call doubles as a password check. */
  verify: () => request('/admin/blog/posts'),

  list: () => request('/admin/blog/posts'),
  get: (id) => request(`/admin/blog/posts/${id}`),
  create: (post) => request('/admin/blog/posts', { method: 'POST', body: post }),
  update: (id, post) => request(`/admin/blog/posts/${id}`, { method: 'PUT', body: post }),
  remove: (id) => request(`/admin/blog/posts/${id}`, { method: 'DELETE' }),
  /** Sends the chosen file as a data URL; the server writes a real file. */
  upload: (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new AdminError('Could not read that file.'));
      reader.onload = () => {
        request('/admin/blog/upload', {
          method: 'POST',
          body: { dataUrl: reader.result, filename: file.name },
        }).then(resolve, reject);
      };
      reader.readAsDataURL(file);
    }),

  createCategory: (category) =>
    request('/admin/blog/categories', { method: 'POST', body: category }),
};
