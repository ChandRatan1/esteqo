import { useMemo, useState } from 'react';
import { categoryBySlug, menuGroups, servicesWithCategory, UNGROUPED_DEPARTMENTS } from '../data/menu';
import { PageHero } from '../components/Sections';
import Field from '../components/Field';
import Seo from '../seo/Seo';
import { fileToDataUrl, submitGiftCardRequest, GiftCardError } from '../api/giftCards';
import { sanitizeEmail, sanitizeName, sanitizePhone } from '../utils/validation';

// Dummy for now — no live UPI merchant integration. Replace with the
// clinic's real UPI ID (and swap in a real QR code image) before go-live.
const UPI_ID = 'esteqo@upi';

const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

/**
 * The dropdown is grouped the same way the menu is: Facials, Brows and Bridal
 * each collect their own departments, and everything else falls into Others.
 */
const SERVICE_GROUPS = [
  ...menuGroups.map((group) => ({
    label: group.name,
    services: group.departments.flatMap((slug) =>
      servicesWithCategory.filter((s) => s.categorySlug === slug)
    ),
  })),
  {
    label: 'Other treatments',
    services: UNGROUPED_DEPARTMENTS.flatMap((slug) =>
      servicesWithCategory.filter((s) => s.categorySlug === slug)
    ),
  },
].filter((group) => group.services.length > 0);

const EMPTY = {
  buyerName: '',
  buyerEmail: '',
  buyerPhone: '',
  recipientName: '',
  recipientContact: '',
  message: '',
  website: '', // honeypot
};

export default function GiftCards() {
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [screenshot, setScreenshot] = useState(null);
  const [screenshotName, setScreenshotName] = useState('');
  const [status, setStatus] = useState({ state: 'idle' });
  const [errors, setErrors] = useState({});

  const set = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const chosen = useMemo(
    () => selected.map((slug) => servicesWithCategory.find((s) => s.slug === slug)).filter(Boolean),
    [selected]
  );

  // The total is derived from the menu, never typed in — so a gift card can
  // never be requested at a price the clinic does not actually charge.
  const priced = chosen.filter((s) => s.price != null);
  const onConsultation = chosen.filter((s) => s.price == null);
  const total = priced.reduce((sum, s) => sum + s.price, 0);

  const amountNote = chosen.length === 0
    ? ''
    : onConsultation.length === 0
      ? formatPrice(total)
      : priced.length === 0
        ? 'On consultation'
        : `${formatPrice(total)} + ${onConsultation.length} on consultation`;

  const addService = (slug) => {
    if (!slug || selected.includes(slug)) return;
    setSelected((prev) => [...prev, slug]);
    setErrors((prev) => (prev.services ? { ...prev, services: undefined } : prev));
  };

  const removeService = (slug) => setSelected((prev) => prev.filter((s) => s !== slug));

  const onScreenshot = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await fileToDataUrl(file);
      setScreenshot(dataUrl);
      setScreenshotName(file.name);
    } catch {
      setStatus({ state: 'error', message: 'Could not read that file. Try a different image.' });
    }
  };

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});

    if (form.website) return; // honeypot — silently drop

    const nextErrors = {};
    if (!sanitizeName(form.buyerName).trim()) nextErrors.buyerName = 'Please enter your name';
    if (!sanitizePhone(form.buyerPhone)) nextErrors.buyerPhone = 'Please enter your mobile number';
    if (selected.length === 0) nextErrors.services = 'Choose at least one treatment';
    if (!screenshot) nextErrors.screenshot = 'Upload a screenshot of your UPI payment';

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setStatus({ state: 'error', message: 'Please check the highlighted fields.' });
      return;
    }

    setStatus({ state: 'sending' });
    try {
      const serviceNames = chosen.map((s) =>
        s.price != null ? `${s.name} (${formatPrice(s.price)})` : `${s.name} (on consultation)`
      );

      const response = await submitGiftCardRequest({
        buyerName: form.buyerName,
        buyerEmail: form.buyerEmail,
        buyerPhone: form.buyerPhone,
        recipientName: form.recipientName,
        recipientContact: form.recipientContact,
        services: serviceNames,
        amountNote,
        message: form.message,
        screenshot,
        website: form.website,
      });
      setStatus({ state: 'done', message: response.data.message });
      setForm(EMPTY);
      setSelected([]);
      setScreenshot(null);
      setScreenshotName('');
    } catch (error) {
      if (error instanceof GiftCardError) {
        const fieldErrors = (error.details || []).reduce((acc, detail) => {
          if (!acc[detail.field]) acc[detail.field] = detail.message;
          return acc;
        }, {});
        setErrors(fieldErrors);
        setStatus({
          state: 'error',
          message: Object.keys(fieldErrors).length ? 'Please check the highlighted fields.' : error.message,
        });
      } else {
        setStatus({ state: 'error', message: 'Something went wrong. Please try again.' });
      }
    }
  };

  return (
    <>
      <Seo
        title="Gift Cards"
        description="Send a friend or family member the gift of ESTEQO — choose services, pay by UPI, and we'll issue a gift code you can share."
        breadcrumbs={[{ name: 'Gift Cards', path: '/gift-cards' }]}
      />

      <PageHero
        eyebrow="Give the gift of great skin"
        title="Gift Cards"
        text="Choose the treatments, pay by UPI, upload your payment screenshot — we'll verify it and send you a gift code to pass on."
      />

      <section className="section">
        <div className="container container--narrow">
          {status.state === 'done' ? (
            <div className="alert alert--success" role="status">
              <p>{status.message}</p>
            </div>
          ) : (
            <form className="form" onSubmit={submit} noValidate>
              {status.state === 'error' && (
                <div className="alert alert--error" role="alert">
                  {status.message}
                </div>
              )}

              <h2 style={{ marginTop: 0 }}>1. Choose services</h2>

              <Field
                id="gc-service"
                label="Add a treatment"
                hint="Pick from the menu — the price is filled in for you."
                error={errors.services}
              >
                <select
                  id="gc-service"
                  value=""
                  onChange={(event) => addService(event.target.value)}
                >
                  <option value="">Choose a treatment…</option>
                  {SERVICE_GROUPS.map((group) => (
                    <optgroup key={group.label} label={group.label}>
                      {group.services.map((service) => (
                        <option
                          key={service.slug}
                          value={service.slug}
                          disabled={selected.includes(service.slug)}
                        >
                          {service.name}
                          {service.price != null ? ` — ${formatPrice(service.price)}` : ' — on consultation'}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </Field>

              {chosen.length > 0 && (
                <ul className="gift-picks">
                  {chosen.map((service) => (
                    <li className="gift-picks__row" key={service.slug}>
                      <span className="gift-picks__name">
                        {service.name}
                        <small>{categoryBySlug[service.categorySlug]?.name}</small>
                      </span>
                      <span className="gift-picks__price">
                        {service.price != null ? formatPrice(service.price) : 'On consultation'}
                      </span>
                      <button
                        type="button"
                        className="gift-picks__remove"
                        onClick={() => removeService(service.slug)}
                        aria-label={`Remove ${service.name}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}

                  <li className="gift-picks__row gift-picks__row--total">
                    <span className="gift-picks__name">Total</span>
                    <span className="gift-picks__price">{amountNote}</span>
                    <span />
                  </li>
                </ul>
              )}

              {onConsultation.length > 0 && (
                <p className="form__note">
                  {onConsultation.length === 1 ? 'One treatment is' : `${onConsultation.length} treatments are`}{' '}
                  priced on consultation — we will confirm that amount with you before issuing the card.
                </p>
              )}

              <h2>2. Pay by UPI</h2>
              <div className="alert" style={{ background: 'var(--light-yellow)', borderColor: 'var(--gold)' }}>
                <p>
                  Pay <strong>{amountNote || 'the amount above'}</strong> to our UPI ID:{' '}
                  <strong>{UPI_ID}</strong>
                </p>
                <p style={{ marginTop: 8 }}>Then upload a screenshot of the successful payment below.</p>
              </div>

              <Field id="gc-screenshot" label="Payment screenshot" error={errors.screenshot}>
                <input id="gc-screenshot" type="file" accept="image/*" onChange={onScreenshot} />
                {screenshotName && <p className="form__note" style={{ marginTop: 8 }}>{screenshotName}</p>}
              </Field>

              <h2>3. Your details</h2>
              <div className="form__row">
                <Field id="gc-name" label="Your name" error={errors.buyerName}>
                  <input id="gc-name" type="text" required value={form.buyerName} onChange={(e) => setForm((p) => ({ ...p, buyerName: sanitizeName(e.target.value) }))} />
                </Field>
                <Field id="gc-phone" label="Your mobile number" error={errors.buyerPhone}>
                  <input id="gc-phone" type="tel" required value={form.buyerPhone} onChange={(e) => setForm((p) => ({ ...p, buyerPhone: sanitizePhone(e.target.value) }))} />
                </Field>
              </div>
              <Field id="gc-email" label="Your email (optional)">
                <input id="gc-email" type="email" value={form.buyerEmail} onChange={(e) => setForm((p) => ({ ...p, buyerEmail: sanitizeEmail(e.target.value) }))} />
              </Field>

              <h2>4. Who is this gift for? (optional)</h2>
              <div className="form__row">
                <Field id="gc-recipient-name" label="Friend's name">
                  <input id="gc-recipient-name" type="text" value={form.recipientName} onChange={set('recipientName')} />
                </Field>
                <Field id="gc-recipient-contact" label="Friend's phone or email">
                  <input id="gc-recipient-contact" type="text" value={form.recipientContact} onChange={set('recipientContact')} />
                </Field>
              </div>

              <Field id="gc-message" label="Anything else we should know? (optional)">
                <textarea id="gc-message" rows={3} value={form.message} onChange={set('message')} />
              </Field>

              <div className="field field--honey" aria-hidden="true">
                <label htmlFor="gc-website">Leave this empty</label>
                <input id="gc-website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} />
              </div>

              <button type="submit" className="btn btn--primary" disabled={status.state === 'sending'}>
                {status.state === 'sending' ? 'Sending…' : 'Submit gift card request'}
              </button>
              <p className="form__note" style={{ marginTop: 14 }}>
                This is a request, not an instant gift code — we verify the payment and send your code by hand.
              </p>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
