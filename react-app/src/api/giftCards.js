/**
 * Public gift card request submission.
 *
 * The visitor picks services and leaves their details. No payment happens on
 * the site: the clinic calls the buyer to take payment, then emails the gift
 * code by hand and marks the request issued in /admin/gift-cards.
 */

import { API_ORIGIN } from './apiOrigin';
import { GIFT_CARD_SUBJECT, sendFields } from './forms';

const GIFT_CARDS_API = API_ORIGIN;

export class GiftCardError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'GiftCardError';
    this.details = details;
  }
}

/**
 * Emails the request to the clinic inboxes (`enquiryRecipients` in site.js)
 * through the same transport the contact and appointment forms use.
 */
async function emailGiftCardRequest(payload) {
  const fields = {
    'Buyer name': payload.buyerName,
    'Buyer mobile': payload.buyerPhone,
    ...(payload.buyerEmail ? { 'Buyer email': payload.buyerEmail } : {}),
    ...(payload.recipientName ? { 'Gift for': payload.recipientName } : {}),
    ...(payload.recipientContact ? { "Recipient's phone or email": payload.recipientContact } : {}),
    Services: payload.services.join('; '),
    ...(payload.amountNote ? { Amount: payload.amountNote } : {}),
    ...(payload.message ? { Message: payload.message } : {}),
    'Next step': 'Call the buyer to take payment, then email the gift code',
    'Submitted from': window.location.href,
  };

  await sendFields(GIFT_CARD_SUBJECT, fields, payload.buyerEmail || undefined);
}

/**
 * Stores the request via the backend and emails it to the clinic. Either destination alone counts as success; the visitor only
 * sees an error when both failed. Validation errors from the backend are
 * surfaced immediately so the highlighted fields can be fixed.
 */
export async function submitGiftCardRequest(payload) {
  if (!GIFT_CARDS_API) {
    throw new GiftCardError(
      'Gift card requests need the backend to be configured. Please call or WhatsApp us instead.'
    );
  }

  let stored = null;
  let storeError = null;
  try {
    stored = await storeGiftCardRequest(payload);
  } catch (error) {
    // A validation rejection means the data is wrong — do not email it either.
    if (error instanceof GiftCardError && error.details) throw error;
    storeError = error;
  }

  let emailSent = false;
  try {
    await emailGiftCardRequest(payload);
    emailSent = true;
  } catch (error) {
    console.warn(`[esteqo] Gift card request was not emailed — ${error.message}`);
  }

  if (!stored && !emailSent) throw storeError;

  return (
    stored || {
      data: {
        id: null,
        stored: false,
        emailSent,
        message: 'Thank you — we will verify your payment and send the gift code to you shortly.',
      },
    }
  );
}

async function storeGiftCardRequest(payload) {
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

