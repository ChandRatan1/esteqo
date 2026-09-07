/**
 * Gift card request admin client — same key/session as the blog admin.
 */

import { getKey } from './blogAdmin';
import { API_ORIGIN as API } from './apiOrigin';

export class GiftCardAdminError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'GiftCardAdminError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, params } = {}) {
  if (!API) {
    throw new GiftCardAdminError('The API is not configured. Set VITE_BLOG_API in react-app/.env.');
  }

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params || {})) {
    if (value !== undefined && value !== null && value !== '') query.set(key, value);
  }
  const qs = query.toString();

  let response;
  try {
    response = await fetch(`${API}/api${path}${qs ? `?${qs}` : ''}`, {
      method,
      headers: {
        Accept: 'application/json',
        'x-admin-key': getKey(),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new GiftCardAdminError(`Could not reach ${API}. Is the backend running?`);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new GiftCardAdminError(payload.error || `Request failed (${response.status})`, response.status);
  }

  return payload;
}

export const giftCardsAdmin = {
  list: (params) => request('/admin/gift-cards', { params }),
  update: (id, changes) => request(`/admin/gift-cards/${id}`, { method: 'PUT', body: changes }),
};

export const GIFT_CARD_STATUSES = ['pending', 'verified', 'issued', 'rejected'];
