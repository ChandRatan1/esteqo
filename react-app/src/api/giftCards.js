/**
 * Public gift card request submission — dummy payment flow.
 *
 * The visitor picks services, pays the clinic's UPI ID manually, and uploads
 * a screenshot as proof. There is no live payment gateway wired up: this just
 * stores the request (with the screenshot) so a staff member can verify the
 * payment and issue the gift code by hand via /admin/gift-cards.
 */

import { API_ORIGIN } from './apiOrigin';

const GIFT_CARDS_API = API_ORIGIN;

export class GiftCardError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'GiftCardError';
    this.details = details;
  }
}

export async function submitGiftCardRequest(payload) {
  if (!GIFT_CARDS_API) {
    throw new GiftCardError(
      'Gift card requests need the backend to be configured. Please call or WhatsApp us instead.'
    );
  }

  let response;
  try {
    response = await fetch(`${GIFT_CARDS_API}/api/gift-cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new GiftCardError('Could not reach the server. Please check your connection.');
  }

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new GiftCardError(result.error || 'Something went wrong. Please try again.', result.details);
  }

  return result;
}

/** Reads a File as a base64 data URL, for the payment screenshot. */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new GiftCardError('Could not read that file.'));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}
