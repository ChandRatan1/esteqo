/**
 * Enquiry form rules, shared by the form UI and the submit handler so both
 * enforce exactly the same limits.
 *
 *   Name     letters only (no digits), max 40
 *   Mobile   digits only, 10–13
 *   Email    must contain "@" and a dot domain, max 50
 *   Subject  letters only, max 50
 *   Message  max 350
 */

export const LIMITS = {
  fullName: 40,
  phone: 13,
  email: 50,
  subject: 50,
  message: 350,
  captcha: 6,
};

const NAME_ALLOWED = /^[A-Za-z\s.'-]+$/;
const SUBJECT_ALLOWED = /^[A-Za-z\s]+$/;
// Requires "@" and a dotted domain, so .com, .in and .co.in all pass.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

/* ------------------------------------------------------------------ */
/* Input sanitisers — applied as the visitor types                     */
/* ------------------------------------------------------------------ */

/** Strips digits and anything that is not part of a name; caps the length. */
export const sanitizeName = (value) =>
  value.replace(/[^A-Za-z\s.'-]/g, '').slice(0, LIMITS.fullName);

/** Digits only, plus a single leading "+" for the country code. */
export const sanitizePhone = (value) => {
  const plus = value.trim().startsWith('+');
  const digits = value.replace(/\D/g, '').slice(0, LIMITS.phone);
  return plus ? `+${digits}` : digits;
};

export const sanitizeSubject = (value) =>
  value.replace(/[^A-Za-z\s]/g, '').slice(0, LIMITS.subject);

export const sanitizeEmail = (value) => value.replace(/\s/g, '').slice(0, LIMITS.email);

export const sanitizeMessage = (value) => value.slice(0, LIMITS.message);

/* ------------------------------------------------------------------ */
/* Field validators                                                    */
/* ------------------------------------------------------------------ */

export function validateName(value) {
  const name = (value || '').trim();
  if (!name) return 'Please enter your name';
  if (name.length < 2) return 'Please enter your full name';
  if (name.length > LIMITS.fullName) return `Name cannot exceed ${LIMITS.fullName} characters`;
  if (/\d/.test(name)) return 'Name cannot contain numbers';
  if (!NAME_ALLOWED.test(name)) return 'Name can only contain letters';
  return null;
}

export function validatePhone(value) {
  const raw = (value || '').trim();
  if (!raw) return 'Please enter your mobile number';
  if (raw.length > LIMITS.phone) return `Mobile number cannot exceed ${LIMITS.phone} characters`;
  if (!/^\+?\d+$/.test(raw)) return 'Mobile number can only contain numbers';

  const digits = raw.replace(/\D/g, '');
  if (digits.length < 10) return 'Mobile number must be at least 10 digits';
  if (digits.length > LIMITS.phone) return `Mobile number cannot exceed ${LIMITS.phone} digits`;
  return null;
}

export function validateEmail(value) {
  const email = (value || '').trim();
  if (!email) return 'Please enter your email address';
  if (email.length > LIMITS.email) return `Email cannot exceed ${LIMITS.email} characters`;
  if (!email.includes('@')) return 'Email must contain @';
  if (!EMAIL_PATTERN.test(email)) return 'Enter a valid email address, e.g. name@gmail.com';
  return null;
}

export function validateSubject(value, { required = false } = {}) {
  const subject = (value || '').trim();
  if (!subject) return required ? 'Please enter a subject' : null;
  if (subject.length > LIMITS.subject) return `Subject cannot exceed ${LIMITS.subject} characters`;
  if (/\d/.test(subject)) return 'Subject cannot contain numbers';
  if (!SUBJECT_ALLOWED.test(subject)) return 'Subject can only contain letters';
  return null;
}

export function validateMessage(value, { required = false } = {}) {
  const message = (value || '').trim();
  if (!message) return required ? 'Please add a short message' : null;
  if (required && message.length < 5) return 'Please add a short message';
  if (message.length > LIMITS.message)
    return `Message cannot exceed ${LIMITS.message} characters`;
  return null;
}

/* ------------------------------------------------------------------ */
/* Captcha                                                             */
/* ------------------------------------------------------------------ */

// Characters that cannot be confused with each other (no 0/O, 1/I/l).
const CAPTCHA_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function makeCaptchaCode(length = 5) {
  let code = '';
  for (let i = 0; i < length; i += 1) {
    code += CAPTCHA_ALPHABET[Math.floor(Math.random() * CAPTCHA_ALPHABET.length)];
  }
  return code;
}

/** Case-insensitive, and forgiving about stray spaces. */
export function validateCaptcha(input, code) {
  const entered = (input || '').replace(/\s/g, '').toUpperCase();
  if (!entered) return 'Please enter the verification code';
  if (entered !== code.toUpperCase()) return 'The code does not match. Please try again.';
  return null;
}

/**
 * Runs every rule for a form.
 * @returns {Record<string, string>} field -> message, empty when valid
 */
export function validateEnquiry(values, { variant = 'appointment', captchaCode } = {}) {
  const errors = {};
  const put = (field, message) => {
    if (message) errors[field] = message;
  };

  put('fullName', validateName(values.fullName));
  put('phone', validatePhone(values.phone));
  put('email', validateEmail(values.email));

  if (variant === 'contact') {
    put('subject', validateSubject(values.subject));
    put('message', validateMessage(values.message, { required: true }));
  } else {
    put('message', validateMessage(values.message));
    if (!values.location) put('location', 'Please choose your location');
    if (!values.preferredDate) put('preferredDate', 'Please choose a date');
    if (!values.preferredTime) put('preferredTime', 'Please choose or type a time');
  }

  if (captchaCode !== undefined) {
    put('captcha', validateCaptcha(values.captcha, captchaCode));
  }

  return errors;
}
