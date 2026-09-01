/**
 * Enquiry delivery — direct AJAX, no backend, no mail client.
 *
 * The form posts straight from the browser to a hosted form service, which
 * emails the enquiry to the clinic inboxes. The visitor stays on the page and
 * sees a success message; their mail app is never opened.
 *
 * Two transports, tried in order:
 *
 *  1. Web3Forms — used when VITE_WEB3FORMS_KEY is set. Most reliable option.
 *     Create the free key at https://web3forms.com against `enquirySender`.
 *
 *  2. FormSubmit — the default, no signup and no key in the code. Posts to
 *     https://formsubmit.co/ajax/<endpoint>, which emails `enquirySender` and
 *     copies `enquiryCc`.
 *
 *     ONE-TIME ACTIVATION: the very first submission triggers a confirmation
 *     email to ratanchandbind4056@gmail.com. Click the link in it once and all
 *     later submissions arrive automatically.
 *
 *     Once activated, FormSubmit shows a random alias for the address. Put it
 *     in VITE_FORMSUBMIT_ID so the inbox is not exposed in the page source.
 *
 * Delivery addresses are hardcoded here and in src/data/site.js. They are never
 * taken from anything the visitor types — the address a visitor enters is
 * carried as a data field and as Reply-To only.
 *
 * If VITE_USE_API=true the Express backend handles submissions instead and this
 * module is not used.
 */

import { enquiryCc, enquirySender } from '../data/site';
import { API_ORIGIN } from './apiOrigin';

const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';
const WEB3FORMS_URL = 'https://api.web3forms.com/submit';

// The FormSubmit alias, or the sending address until one is issued.
const FORMSUBMIT_ID = import.meta.env.VITE_FORMSUBMIT_ID || enquirySender;
const FORMSUBMIT_URL = `https://formsubmit.co/ajax/${encodeURIComponent(FORMSUBMIT_ID)}`;

// Backend origin for saving submissions to the `contacts` table. Defaults to
// the page's own origin (see apiOrigin.js) — set VITE_CONTACT_API only if the
// backend truly lives elsewhere, or blank it in a build meant to run with no
// backend at all (see storeInDatabase below, which degrades to email-only).
const CONTACT_API = API_ORIGIN;

const CONTACT_LINE = 'Please call or WhatsApp us on +91 8010135135 instead.';

const LABELS = {
  fullName: 'Name',
  email: 'Email',
  phone: 'Mobile number',
  serviceName: 'Service',
  servicePrice: 'Price',
  location: 'Location',
  preferredDate: 'Preferred date',
  preferredTime: 'Preferred time',
  contactMethod: 'Preferred contact method',
  subject: 'Subject',
  message: 'Message',
  offerPrice: 'Offer applied',
};

const SUBJECTS = {
  appointment: 'New Appointment Request - ESTEQO Website',
  contact: 'New Contact Enquiry - ESTEQO Website',
  newsletter: 'New Newsletter Subscriber - ESTEQO Website',
};

export class FormError extends Error {
  constructor(message, details) {
    super(message);
    this.name = 'FormError';
    this.details = details;
  }
}

/** Human-readable booking reference, e.g. ESQ-8F3K2Q. */
function reference() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ESQ-${code}`;
}

/** Client-side validation mirroring what the backend enforces. */
function validate(kind, values) {
  const errors = [];
  const add = (field, message) => errors.push({ field, message });

  if (kind === 'newsletter') {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) {
      add('email', 'Enter a valid email address');
    }
    return errors;
  }

  if (!values.fullName || values.fullName.trim().length < 2) {
    add('fullName', 'Please tell us your name');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email || '')) {
    add('email', 'Enter a valid email address');
  }

  const digits = (values.phone || '').replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    add('phone', 'Enter a valid mobile number');
  }

  if (kind === 'appointment') {
    if (!values.location) add('location', 'Please choose your location');
    if (!values.preferredDate) add('preferredDate', 'Please choose a date');
    if (!values.preferredTime) add('preferredTime', 'Please choose or type a time');
  }

  if (kind === 'contact' && (!values.message || values.message.trim().length < 5)) {
    add('message', 'Please add a short message');
  }

  return errors;
}

/** Visitor input as labelled fields — safe to hand to any form service. */
function toFields(kind, values, ref) {
  return {
    ...Object.fromEntries(
      Object.entries(LABELS)
        .filter(([key]) => values[key])
        .map(([key, label]) => [label, values[key]])
    ),
    ...(ref ? { Reference: ref } : {}),
    'Enquiry type': kind,
    'Submitted from': window.location.href,
  };
}

async function postJson(url, payload) {
  let response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new FormError(`We could not send your enquiry. ${CONTACT_LINE}`);
  }

  const result = await response.json().catch(() => ({}));
  return { response, result };
}

/** Transport 1 — Web3Forms. Delivers to enquirySender, copies enquiryCc. */
async function sendViaWeb3Forms(kind, values, ref) {
  const { response, result } = await postJson(WEB3FORMS_URL, {
    access_key: WEB3FORMS_KEY,
    subject: `${SUBJECTS[kind]}${ref ? ` (${ref})` : ''}`,
    from_name: 'ESTEQO website',
    ccemail: enquiryCc.join(','),
    ...toFields(kind, values, ref),
    // Reply-To only — does not change where the email is delivered.
    ...(values.email ? { replyto: values.email } : {}),
  });

  if (!response.ok || result.success === false) {
    throw new FormError(result.message || `We could not send your enquiry. ${CONTACT_LINE}`);
  }
}

/** Transport 2 — FormSubmit. Delivers to enquirySender, copies enquiryCc. */
async function sendViaFormSubmit(kind, values, ref) {
  const { response, result } = await postJson(FORMSUBMIT_URL, {
    _subject: `${SUBJECTS[kind]}${ref ? ` (${ref})` : ''}`,
    _cc: enquiryCc.join(','),
    _template: 'table',
    // Required for a pure AJAX submission — otherwise the service redirects to
    // a captcha page, which would take the visitor off the site.
    _captcha: 'false',
    ...(values.email ? { _replyto: values.email } : {}),
    ...toFields(kind, values, ref),
  });

  // FormSubmit returns success as the string "true".
  const ok = response.ok && String(result.success) === 'true';
  if (!ok) {
    throw new FormError(result.message || `We could not send your enquiry. ${CONTACT_LINE}`);
  }
}

/**
 * Saves the submission to the `contacts` table via the backend.
 *
 * Set VITE_CONTACT_API to the API origin (e.g. https://api.esteqo.com, or
 * http://localhost:4000 in development) to turn this on. With it unset the site
 * simply emails, exactly as before — nothing breaks.
 *
 * @returns {Promise<boolean>} true when the row was stored
 */
async function storeInDatabase(kind, values, ref, emailSent) {
  if (!CONTACT_API) {
    // Most common cause of "the email arrived but the database is empty":
    // VITE_CONTACT_API was not set when the bundle was built.
    console.warn(
      '[esteqo] Enquiry emailed only. VITE_CONTACT_API is not set in this build, ' +
        'so nothing was saved to the database. Set it in react-app/.env and rebuild.'
    );
    return false;
  }

  try {
    const response = await fetch(`${CONTACT_API}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        formType: kind,
        fullName: values.fullName || '',
        email: values.email || '',
        phone: values.phone || '',
        location: values.location || '',
        serviceSlug: values.serviceSlug || '',
        serviceName: values.serviceName || '',
        servicePrice: values.servicePrice || '',
        preferredDate: values.preferredDate || '',
        preferredTime: values.preferredTime || '',
        contactMethod: values.contactMethod || 'call',
        subject: values.subject || '',
        message: values.message || '',
        sourcePage: window.location.href,
        offerCode: values.offerCode || '',
        offerSource: values.offerSource || 'page',
        reference: ref || '',
        emailSent,
      }),
    });

    if (!response.ok) {
      // A rejected save is still a save that did not happen. Say why, loudly,
      // so a misconfigured deploy is diagnosable from the browser console
      // instead of looking like "the email worked but nothing was stored".
      const detail = await response.text().catch(() => '');
      console.warn(
        `[esteqo] Enquiry emailed but NOT saved to the database. ` +
          `${CONTACT_API}/api/contacts returned ${response.status}. ${detail.slice(0, 200)}`
      );
      return false;
    }

    return true;
  } catch (error) {
    // The database is a bonus destination; never fail the visitor over it.
    // But never hide it either — this is the only trace anyone gets.
    console.warn(
      `[esteqo] Enquiry emailed but NOT saved to the database. ` +
        `Could not reach ${CONTACT_API}/api/contacts — ${error.message}. ` +
        `Check that the API is running and that VITE_CONTACT_API points at it.`
    );
    return false;
  }
}

/**
 * @param {'appointment'|'contact'|'newsletter'} kind
 * @param {object} values
 */
export async function submitEnquiry(kind, values) {
  // Honeypot: bots fill hidden fields. Pretend it worked and drop it.
  if (values.website) {
    return { data: { reference: reference(), message: 'Thank you.' } };
  }

  const errors = validate(kind, values);
  if (errors.length) throw new FormError('Validation failed', errors);

  const ref = kind === 'appointment' ? reference() : null;

  let emailSent = false;
  let emailError = null;
  try {
    if (WEB3FORMS_KEY) {
      await sendViaWeb3Forms(kind, values, ref);
    } else {
      await sendViaFormSubmit(kind, values, ref);
    }
    emailSent = true;
  } catch (error) {
    // Hold the error: if the database save succeeds the enquiry is not lost,
    // so there is no reason to show the visitor a failure.
    emailError = error;
  }

  const stored = await storeInDatabase(kind, values, ref, emailSent);

  // Only surface a failure when the enquiry reached neither destination.
  if (!emailSent && !stored) throw emailError;

  return {
    data: {
      reference: ref,
      message:
        kind === 'newsletter'
          ? 'Thank you for subscribing.'
          : `Thank you${values.fullName ? `, ${values.fullName.split(' ')[0]}` : ''}. We have received your enquiry and will be in touch shortly.`,
    },
  };
}
