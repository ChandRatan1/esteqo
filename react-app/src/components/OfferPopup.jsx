import { useCallback, useEffect, useRef, useState } from 'react';
import EnquiryForm from './EnquiryForm';
import { offer } from '../data/site';

/**
 * ₹500-off offer badge and its enquiry popup.
 *
 * Behaviour:
 *  - A fixed badge sits on the LEFT edge of every page. Clicking it always
 *    opens the form, whatever happened earlier.
 *  - The popup also opens by itself once, after TEN SECONDS OF ACTIVE TIME on
 *    the site. "Active" means the tab is visible — time spent on a background
 *    tab does not count, and the timer carries across page navigations.
 *  - It auto-opens at most once, ever. Closing it (or submitting) means it
 *    never auto-opens again on that device; the badge is the way back in.
 *
 * The decision is stored in localStorage, so it survives reloads and return
 * visits. Clear `esteqo.offerPopup` in devtools to test the popup again.
 */

const STORAGE_KEY = 'esteqo.offerPopup';
const ACTIVE_MS = 10 * 1000; // ten seconds of active time
const TICK_MS = 1000;

const alreadyHandled = () => {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    // Private mode / storage disabled — treat as "not shown yet".
    return false;
  }
};

const remember = (value) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* storage unavailable — the popup simply may reappear next visit */
  }
};

function OfferIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true">
      <path
        d="M21 11.5V5a1 1 0 0 0-1-1h-6.5L3 14.5 9.5 21 20 10.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16.5" cy="8.5" r="1.4" fill="currentColor" />
    </svg>
  );
}

export default function OfferPopup({ onOpenChange }) {
  const [open, setOpen] = useState(false);
  const [source, setSource] = useState('badge');
  const activeMs = useRef(0);
  const autoShown = useRef(alreadyHandled());
  const closeButton = useRef(null);

  const openForm = useCallback((from) => {
    setSource(from);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Any dismissal — from the popup or the badge — stops the auto-open.
    autoShown.current = true;
    remember('dismissed');
  }, []);

  // The phone action bar (Layout.jsx) opens the form through this event.
  useEffect(() => {
    const onOpen = () => openForm('bar');
    window.addEventListener('esteqo:open-offer', onOpen);
    return () => window.removeEventListener('esteqo:open-offer', onOpen);
  }, [openForm]);

  // Count only the time the tab is actually visible.
  useEffect(() => {
    if (autoShown.current) return undefined;

    const timer = setInterval(() => {
      if (document.hidden || autoShown.current) return;

      activeMs.current += TICK_MS;
      if (activeMs.current >= ACTIVE_MS) {
        autoShown.current = true;
        remember('shown');
        openForm('popup');
        clearInterval(timer);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [openForm]);

  // Tell the layout whether this dialog is currently showing.
  useEffect(() => {
    onOpenChange?.(open);
  }, [open, onOpenChange]);

  // Escape closes; lock the page behind the dialog.
  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className="offer-badge"
        onClick={() => openForm('badge')}
        aria-haspopup="dialog"
        aria-label={`${offer.label} — open the enquiry form`}
      >
        <span className="offer-badge__icon">
          <OfferIcon />
        </span>
        <span className="offer-badge__text">
          <strong>₹{offer.amount} OFF</strong>
          <span>Claim now</span>
        </span>
      </button>

      {open && (
        <div className="offer-modal" role="presentation" onClick={close}>
          <div
            className="offer-modal__panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="offer-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="offer-modal__close"
              onClick={close}
              aria-label="Close"
              ref={closeButton}
            >
              &times;
            </button>

            <div className="offer-modal__head">
              <span className="offer-modal__flag">Limited offer</span>
              <h2 id="offer-modal-title" className="offer-modal__title">
                ₹{offer.amount} off your first treatment
              </h2>
              <p className="offer-modal__text">
                Send us your details and we will apply the discount when we confirm your
                appointment. Every treatment still begins with a consultation.
              </p>
            </div>

            <div className="offer-modal__body">
              <EnquiryForm variant="appointment" offer={offer} offerSource={source} onSuccess={() => remember('submitted')} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
