/**
 * Enquiry admin client.
 *
 * Reads and updates the `contacts` table through the API. Shares the same
 * password and sessionStorage entry as the blog admin, so signing in once
 * covers both screens.
 */

import { getKey } from './blogAdmin';

const API = (import.meta.env.VITE_BLOG_API || import.meta.env.VITE_CONTACT_API || '').replace(
  /\/$/,
  ''
);

export const contactsApiConfigured = Boolean(API);

export class ContactsError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ContactsError';
    this.status = status;
  }
}

async function request(path, { method = 'GET', body, params } = {}) {
  if (!API) {
    throw new ContactsError('The API is not configured. Set VITE_BLOG_API in react-app/.env.');
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
    throw new ContactsError(`Could not reach ${API}. Is the backend running?`);
  }

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ContactsError(payload.error || `Request failed (${response.status})`, response.status);
  }

  return payload;
}

export const contactsAdmin = {
  list: (params) => request('/contacts', { params }),
  get: (id) => request(`/contacts/${id}`),
  update: (id, changes) => request(`/contacts/${id}`, { method: 'PUT', body: changes }),
  remove: (id) => request(`/contacts/${id}`, { method: 'DELETE' }),
  stats: () => request('/contacts/stats'),
};

/** The workflow states an enquiry moves through. */
export const STATUSES = ['new', 'read', 'responded', 'booked', 'closed'];

/**
 * Builds a CSV from the rows on screen, so enquiries can be opened in Excel
 * without anyone needing phpMyAdmin.
 */
export function toCsv(rows) {
  const columns = [
    ['reference', 'Reference'],
    ['created_at', 'Received'],
    ['form_type', 'Type'],
    ['status', 'Status'],
    ['full_name', 'Name'],
    ['phone', 'Mobile'],
    ['email', 'Email'],
    ['location', 'Location'],
    ['service_name', 'Service'],
    ['service_price', 'Price'],
    ['preferred_date', 'Preferred date'],
    ['preferred_time', 'Preferred time'],
    ['contact_method', 'Contact by'],
    ['subject', 'Subject'],
    ['message', 'Message'],
    ['offer_code', 'Offer'],
    ['admin_notes', 'Notes'],
  ];

  // Quote everything and double any quotes inside, so commas and newlines in a
  // message cannot break the column alignment.
  const cell = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`;

  const lines = [columns.map(([, label]) => cell(label)).join(',')];
  for (const row of rows) {
    lines.push(columns.map(([key]) => cell(row[key])).join(','));
  }

  // BOM so Excel opens UTF-8 (₹, –) correctly.
  return `﻿${lines.join('\r\n')}`;
}
