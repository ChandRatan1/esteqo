import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { locationGroups } from '../data/site';
import { categories, servicesWithCategory } from '../data/menu';
import { formatTime, hoursForDate, hoursLabel, isTimeWithinHours, slotsForDate } from '../utils/hours';
import Field from './Field';
import Captcha from './Captcha';
import {
  LIMITS,
  makeCaptchaCode,
  sanitizeEmail,
  sanitizeMessage,
  sanitizeName,
  sanitizePhone,
  sanitizeSubject,
  validateEnquiry,
} from '../utils/validation';

/**
 * The enquiry form used by both /appointment and /contact.
 *
 * Fields: name, email, mobile, service (grouped dropdown showing the price),
 * location (Noida sectors, Greater Noida, Ghaziabad, New Delhi and nearby),
 * preferred date via the native calendar picker, and preferred time — chosen
 * from a slot list or typed in manually.
 *
 * `variant="contact"` swaps the date/time block for a subject + message.
 */

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;

const priceLabel = (service) => {
  if (service.price == null) return 'On consultation';
  if (service.priceNote) return service.priceNote;
  return formatPrice(service.price);
};

const EMPTY = {
  fullName: '',
  email: '',
  phone: '',
  serviceSlug: '',
  location: '',
  preferredDate: '',
  preferredTime: '',
  contactMethod: 'call',
  subject: '',
  message: '',
  captcha: '',
  website: '', // honeypot
};

export default function EnquiryForm({
  variant = 'appointment',
  presetService = '',
  onSuccess,
  // When present, a read-only "Offer applied" field is shown and the code is
  // sent with the enquiry. See src/data/site.js -> offer.
  offer = null,
  offerSource = 'page',
}) {
  const [form, setForm] = useState(EMPTY);
  const [timeMode, setTimeMode] = useState('slot'); // 'slot' | 'manual'
  const [status, setStatus] = useState({ state: 'idle' });
  const [errors, setErrors] = useState({});
  const [captchaCode, setCaptchaCode] = useState(() => makeCaptchaCode());

  const refreshCaptcha = () => {
    setCaptchaCode(makeCaptchaCode());
    setForm((prev) => ({ ...prev, captcha: '' }));
    setErrors((prev) => ({ ...prev, captcha: undefined }));
  };

  useEffect(() => {
    if (presetService) setForm((prev) => ({ ...prev, serviceSlug: presetService }));
  }, [presetService]);

  // Each field is cleaned as it is typed, so an invalid character never lands
  // in the input in the first place.
  const SANITIZERS = {
    fullName: sanitizeName,
    phone: sanitizePhone,
    email: sanitizeEmail,
    subject: sanitizeSubject,
    message: sanitizeMessage,
  };

  const set = (key) => (event) => {
    const raw = event.target.value;
    const value = SANITIZERS[key] ? SANITIZERS[key](raw) : raw;
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const selected = useMemo(
    () => servicesWithCategory.find((s) => s.slug === form.serviceSlug) || null,
    [form.serviceSlug]
  );

  const grouped = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        services: servicesWithCategory.filter((s) => s.categorySlug === category.slug),
      })),
    []
  );

  const today = new Date().toISOString().slice(0, 10);

  // Slots follow the opening hours of whichever date is chosen:
  // The same hours every day: 10am–8:30pm.
  const daySlots = useMemo(() => slotsForDate(form.preferredDate), [form.preferredDate]);
  const dayHours = useMemo(() => hoursForDate(form.preferredDate), [form.preferredDate]);
  const dayLabel = useMemo(() => hoursLabel(form.preferredDate), [form.preferredDate]);

  // Changing the date can invalidate an already-picked time — clear it.
  useEffect(() => {
    if (!form.preferredDate || !form.preferredTime) return;
    if (!isTimeWithinHours(form.preferredDate, form.preferredTime)) {
      setForm((prev) => ({ ...prev, preferredTime: '' }));
    }
  }, [form.preferredDate, form.preferredTime]);

  const submit = async (event) => {
    event.preventDefault();
    setStatus({ state: 'sending' });
    setErrors({});

    // Every rule runs here, including the captcha, before anything is sent.
    const validationErrors = validateEnquiry(form, { variant, captchaCode });
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      setStatus({ state: 'error', message: 'Please check the highlighted fields.' });
      return;
    }

    // A manually typed time must still fall inside that day's opening hours.
    if (
      variant === 'appointment' &&
      form.preferredDate &&
      form.preferredTime &&
      !isTimeWithinHours(form.preferredDate, form.preferredTime)
    ) {
      setErrors({ preferredTime: `We are open ${dayLabel}. Please choose a time in that window.` });
      setStatus({ state: 'error', message: 'Please check the highlighted fields.' });
      return;
    }

    const payload = {
      ...form,
      serviceName: selected ? selected.name : 'Not sure yet — please advise',
      ...(offer
        ? { offerCode: offer.code, offerSource, offerPrice: `₹${offer.amount} off (${offer.code})` }
        : {}),
      servicePrice: selected ? priceLabel(selected) : '',
      // Send "2:00 pm" rather than "14:00", and note the day's hours.
      preferredTime: form.preferredTime
        ? `${formatTime(form.preferredTime)}${dayLabel ? ` (open ${dayLabel})` : ''}`
        : '',
    };

    try {
      const response =
        variant === 'contact'
          ? await api.createContactMessage(payload)
          : await api.createAppointment(payload);

      setStatus({ state: 'done', ...response.data });
      setForm(EMPTY);
      setCaptchaCode(makeCaptchaCode());
      if (onSuccess) onSuccess(response.data);
    } catch (error) {
      const fieldErrors = (error.details || []).reduce((acc, detail) => {
        if (!acc[detail.field]) acc[detail.field] = detail.message;
        return acc;
      }, {});
      setErrors(fieldErrors);
      setStatus({
        state: 'error',
        message: Object.keys(fieldErrors).length
          ? 'Please check the highlighted fields.'
          : error.message,
      });
      refreshCaptcha();
    }
  };

  if (status.state === 'done' && variant === 'contact') {
    return (
      <div className="alert alert--success" role="status">
        <p>{status.message}</p>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={submit} noValidate>
      {status.state === 'error' && (
        <div className="alert alert--error" role="alert">
          {status.message}
        </div>
      )}
      {status.state === 'done' && (
        <div className="alert alert--success" role="status">
          <p>{status.message}</p>
          {status.reference && (
            <p style={{ marginTop: 8 }}>
              Your reference is <strong>{status.reference}</strong>.
            </p>
          )}
        </div>
      )}

      <div className="form__row">
        <Field id={`${variant}-name`} label="Name" error={errors.fullName}>
          <input
            id={`${variant}-name`}
            type="text"
            autoComplete="name"
            required
            maxLength={LIMITS.fullName}
            value={form.fullName}
            onChange={set('fullName')}
          />
        </Field>
        <Field id={`${variant}-phone`} label="Mobile number" error={errors.phone}>
          <input
            id={`${variant}-phone`}
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="+91 98xxxxxxxx"
            required
            maxLength={LIMITS.phone}
            value={form.phone}
            onChange={set('phone')}
          />
        </Field>
      </div>

      <Field id={`${variant}-email`} label="Email" error={errors.email}>
        <input
          id={`${variant}-email`}
          type="email"
          autoComplete="email"
          required
          maxLength={LIMITS.email}
          value={form.email}
          onChange={set('email')}
        />
      </Field>

      <Field
        id={`${variant}-service`}
        label="Service"
        error={errors.serviceSlug}
        hint={selected ? `${priceLabel(selected)}${selected.durationMinutes ? ` · ${selected.durationMinutes} mins` : ''}` : undefined}
      >
        <select id={`${variant}-service`} value={form.serviceSlug} onChange={set('serviceSlug')}>
          <option value="">Not sure yet — please advise</option>
          {grouped.map((group) => (
            <optgroup key={group.slug} label={group.name}>
              {group.services.map((service) => (
                <option key={service.slug} value={service.slug}>
                  {service.name} — {priceLabel(service)}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>

      <Field id={`${variant}-location`} label="Your location" error={errors.location}>
        <select id={`${variant}-location`} value={form.location} onChange={set('location')}>
          <option value="">Select your area</option>
          {locationGroups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </Field>

      {variant === 'appointment' ? (
        <>
          <div className="form__row">
            <Field
              id={`${variant}-date`}
              label="Preferred date"
              error={errors.preferredDate}
              hint="Pick from the calendar or type dd/mm/yyyy"
            >
              <input
                id={`${variant}-date`}
                type="date"
                min={today}
                value={form.preferredDate}
                onChange={set('preferredDate')}
              />
            </Field>

            <Field
              id={`${variant}-time`}
              label="Preferred time"
              error={errors.preferredTime}
              hint={dayLabel || 'Choose a date first to see available times'}
            >
              {timeMode === 'slot' ? (
                <select
                  id={`${variant}-time`}
                  value={form.preferredTime}
                  onChange={set('preferredTime')}
                  disabled={!form.preferredDate}
                >
                  <option value="">
                    {form.preferredDate ? 'Select a time' : 'Choose a date first'}
                  </option>
                  {daySlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={`${variant}-time`}
                  type="time"
                  value={form.preferredTime}
                  onChange={set('preferredTime')}
                  disabled={!form.preferredDate}
                  min={dayHours?.open}
                  // Last start time that still finishes before closing.
                  max={dayHours ? `${String(Number(dayHours.close.slice(0, 2)) - 1).padStart(2, '0')}:00` : undefined}
                />
              )}
              <button
                type="button"
                className="link-underline"
                style={{ marginTop: 10 }}
                onClick={() => {
                  setTimeMode((mode) => (mode === 'slot' ? 'manual' : 'slot'));
                  setForm((prev) => ({ ...prev, preferredTime: '' }));
                }}
              >
                {timeMode === 'slot' ? 'Enter a time manually' : 'Choose from time slots'}
              </button>
            </Field>
          </div>

          <Field id={`${variant}-method`} label="How should we confirm?" error={errors.contactMethod}>
            <select id={`${variant}-method`} value={form.contactMethod} onChange={set('contactMethod')}>
              <option value="call">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </Field>

          <Field
            id={`${variant}-message`}
            label="Anything we should know? (optional)"
            error={errors.message}
            hint={`Skin concerns, allergies, recent treatments, medication. ${form.message.length}/${LIMITS.message}`}
          >
            <textarea
              id={`${variant}-message`}
              maxLength={LIMITS.message}
              value={form.message}
              onChange={set('message')}
            />
          </Field>
        </>
      ) : (
        <>
          <Field id={`${variant}-subject`} label="Subject" error={errors.subject}>
            <input
              id={`${variant}-subject`}
              type="text"
              maxLength={LIMITS.subject}
              value={form.subject}
              onChange={set('subject')}
            />
          </Field>

          <Field id={`${variant}-method`} label="Preferred reply method" error={errors.contactMethod}>
            <select id={`${variant}-method`} value={form.contactMethod} onChange={set('contactMethod')}>
              <option value="call">Phone call</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </Field>

          <Field
            id={`${variant}-message`}
            label="Message"
            error={errors.message}
            hint={`${form.message.length}/${LIMITS.message} characters`}
          >
            <textarea
              id={`${variant}-message`}
              required
              maxLength={LIMITS.message}
              value={form.message}
              onChange={set('message')}
            />
          </Field>
        </>
      )}

      {offer && (
        <Field
          id={`${variant}-offer`}
          label="Offer applied"
          hint="Applied automatically when we confirm your appointment."
        >
          <input
            id={`${variant}-offer`}
            type="text"
            readOnly
            className="field__readonly"
            value={`₹${offer.amount} OFF — ${offer.code}`}
            tabIndex={-1}
            aria-readonly="true"
          />
        </Field>
      )}

      <Captcha
        code={captchaCode}
        value={form.captcha}
        onChange={(value) => {
          setForm((prev) => ({ ...prev, captcha: value }));
          setErrors((prev) => (prev.captcha ? { ...prev, captcha: undefined } : prev));
        }}
        onRefresh={refreshCaptcha}
        error={errors.captcha}
      />

      <div className="field field--honey" aria-hidden="true">
        <label htmlFor={`${variant}-website`}>Leave this empty</label>
        <input
          id={`${variant}-website`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={set('website')}
        />
      </div>

      <div>
        <button type="submit" className="btn btn--primary" disabled={status.state === 'sending'}>
          {status.state === 'sending'
            ? 'Sending…'
            : variant === 'contact'
              ? 'Send message'
              : 'Request appointment'}
        </button>
        {variant === 'appointment' && (
          <p className="form__note" style={{ marginTop: 14 }}>
            This is a request, not a confirmed booking — we will get back to you to confirm the slot.
          </p>
        )}
      </div>
    </form>
  );
}
