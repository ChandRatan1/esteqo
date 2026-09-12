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
 *     email to provadoindia@gmail.com. Click the link in it once and all
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

const CONTACT_LINE = 'Please call us on +91 8010135135 or WhatsApp +91 9958066388 instead.';

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
  giftCard: 'New Gift Card Request - ESTEQO Website',
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

/** Transport 1 (generic) — Web3Forms. Delivers to enquirySender, copies enquiryCc. */
async function sendFieldsViaWeb3Forms(subject, fields, replyToEmail) {
  const { response, result } = await postJson(WEB3FORMS_URL, {
    access_key: WEB3FORMS_KEY,
    subject,
    from_name: 'ESTEQO website',
    ccemail: enquiryCc.join(','),
    ...fields,
    // Reply-To only — does not change where the email is delivered.
    ...(replyToEmail ? { replyto: replyToEmail } : {}),
  });

  if (!response.ok || result.success === false) {
    throw new FormError(result.message || `We could not send this. ${CONTACT_LINE}`);
  }
}

/** Transport 2 (generic) — FormSubmit. Delivers to enquirySender, copies enquiryCc. */
async function sendFieldsViaFormSubmit(subject, fields, replyToEmail) {
  const { response, result } = await postJson(FORMSUBMIT_URL, {
    _subject: subject,
    _cc: enquiryCc.join(','),
    _template: 'table',
    // Required for a pure AJAX submission — otherwise the service redirects to
    // a captcha page, which would take the visitor off the site.
    _captcha: 'false',
    ...(replyToEmail ? { _replyto: replyToEmail } : {}),
    ...fields,
  });

  // FormSubmit returns success as the string "true".
  const ok = response.ok && String(result.success) === 'true';
  if (!ok) {
    throw new FormError(result.message || `We could not send this. ${CONTACT_LINE}`);
  }
}

/**
 * Sends an arbitrary labelled field map by whichever transport is configured.
 * Delivers to every address in `enquiryRecipients` (site.js): the sender inbox
 * plus the CC list. Exported so other forms (gift cards) can email the same
 * inboxes without duplicating the transport.
 */
export async function sendFields(subject, fields, replyToEmail) {
  if (WEB3FORMS_KEY) {
    await sendFieldsViaWeb3Forms(subject, fields, replyToEmail);
  } else {
    await sendFieldsViaFormSubmit(subject, fields, replyToEmail);
  }
}

async function sendViaWeb3Forms(kind, values, ref) {
  await sendFieldsViaWeb3Forms(
    `${SUBJECTS[kind]}${ref ? ` (${ref})` : ''}`,
    toFields(kind, values, ref),
    values.email
  );
}

async function sendViaFormSubmit(kind, values, ref) {
  await sendFieldsViaFormSubmit(
    `${SUBJECTS[kind]}${ref ? ` (${ref})` : ''}`,
    toFields(kind, values, ref),
    values.email
  );
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

/** Subject line for a gift card request email. */
export const GIFT_CARD_SUBJECT = SUBJECTS.giftCard;

/**
 * Skin quiz submission — emails every answer to ESTEQO and stores the row in
 * the `quiz_submissions` table via the backend, mirroring submitEnquiry's
 * email-plus-store pattern but with a dynamic field map instead of the fixed
 * appointment/contact shape.
 *
 * @param {{firstName: string, lastName: string, email: string, answers: Array<{label: string, value: string}>, recommendedService: string}} data
 */
export async function submitQuiz(data) {
  const fullName = `${data.firstName} ${data.lastName}`.trim();

  const fields = {
    Name: fullName,
    Email: data.email,
    'Recommended facial': data.recommendedService,
    ...Object.fromEntries(data.answers.map((a) => [a.label, a.value])),
    'Submitted from': window.location.href,
  };

  let emailSent = false;
  let emailError = null;
  try {
    await sendFields('New Skin Quiz Result - ESTEQO Website', fields, data.email);
    emailSent = true;
  } catch (error) {
    emailError = error;
  }

  let stored = false;
  if (CONTACT_API) {
    try {
      const response = await fetch(`${CONTACT_API}/api/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          answers: data.answers,
          recommendedService: data.recommendedService,
          emailSent,
        }),
      });
      stored = response.ok;
      if (!stored) {
        console.warn(`[esteqo] Quiz result emailed but NOT saved. ${CONTACT_API}/api/quiz returned ${response.status}.`);
      }
    } catch (error) {
      console.warn(`[esteqo] Quiz result emailed but NOT saved. Could not reach ${CONTACT_API}/api/quiz — ${error.message}.`);
    }
  }

  if (!emailSent && !stored) throw emailError || new FormError(`We could not save your quiz result. ${CONTACT_LINE}`);

  return { data: { stored, emailSent } };
}
