import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAdmin, clearKey, getKey, setKey } from '../api/blogAdmin';
import { giftCardsAdmin, GIFT_CARD_STATUSES } from '../api/giftCardsAdmin';
import AdminNav from '../components/AdminNav';
import Field from '../components/Field';
import Seo from '../seo/Seo';

/**
 * Gift card request queue at /admin/gift-cards.
 *
 * There is no payment on the public /gift-cards page — the visitor only
 * leaves their details. This screen is the follow-up: open a request, call the
 * buyer to take payment, mark it verified, then type in the gift code you
 * emailed them and mark it issued.
 */

const formatDate = (value) => {
  if (!value) return '—';
  const date = new Date(value.replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

function Login({ onSignedIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    setKey(password);
    try {
      await blogAdmin.verify();
      onSignedIn();
    } catch (err) {
      clearKey();
      setError(err.status === 401 ? 'That password is not correct.' : err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card form" onSubmit={submit}>
        <h1 className="admin-login__title">Gift Cards</h1>
        <p className="admin-login__text">Enter the admin password to see gift card requests.</p>
        {error && (
          <div className="alert alert--error" role="alert">
            {error}
          </div>
        )}
        <Field id="admin-password" label="Admin password">
          <input
            id="admin-password"
            type="password"
            autoComplete="current-password"
            autoFocus
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </Field>
        <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
          {busy ? 'Checking…' : 'Sign in'}
        </button>
        <p className="form__note" style={{ marginTop: 16 }}>
          <Link to="/" className="link-underline">
            Back to the website
          </Link>
        </p>
      </form>
    </div>
  );
}

function Detail({ row, onSaved }) {
  const [status, setStatus] = useState(row.status);
  const [giftCode, setGiftCode] = useState(row.gift_code || '');
  const [adminNote, setAdminNote] = useState(row.admin_note || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(row.status);
    setGiftCode(row.gift_code || '');
    setAdminNote(row.admin_note || '');
    setSaved(false);
    setError('');
  }, [row.id, row.status, row.gift_code, row.admin_note]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await giftCardsAdmin.update(row.id, { status, giftCode, adminNote });
      onSaved(response.data);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const facts = [
    ['Requested', formatDate(row.created_at)],
    ['Buyer', row.buyer_name],
    ['Buyer mobile', row.buyer_phone],
    ['Buyer email', row.buyer_email],
    ['Recipient', row.recipient_name],
    ['Recipient contact', row.recipient_contact],
    ['Services', (row.services || []).join(', ')],
    ['Amount', row.amount_note],
  ].filter(([, value]) => value !== null && value !== undefined && value !== '');

  return (
    <div className="enq-detail">
      <div className="enq-detail__grid">
        <dl className="enq-facts">
          {facts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{String(value)}</dd>
            </div>
          ))}
        </dl>

        <div className="enq-actions">
          {row.payment_screenshot && (
            <div className="enq-message">
              <h4>Payment screenshot</h4>
              <a href={row.payment_screenshot} target="_blank" rel="noreferrer">
                <img src={row.payment_screenshot} alt="Payment proof" className="admin-upload__preview" />
              </a>
            </div>
          )}

          {row.message && (
            <div className="enq-message">
              <h4>Message</h4>
              <p>{row.message}</p>
            </div>
          )}

          <div className="enq-contact-buttons">
            {row.buyer_phone && (
              <>
                <a className="btn btn--primary" href={`tel:${row.buyer_phone}`}>
                  Call buyer
                </a>
                <a
                  className="btn btn--secondary"
                  href={`https://wa.me/${String(row.buyer_phone).replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </>
            )}
          </div>

          <Field id={`status-${row.id}`} label="Status">
            <select id={`status-${row.id}`} value={status} onChange={(e) => setStatus(e.target.value)}>
              {GIFT_CARD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field id={`code-${row.id}`} label="Gift code" hint="What you send the buyer once the payment is verified.">
            <input id={`code-${row.id}`} type="text" value={giftCode} onChange={(e) => setGiftCode(e.target.value)} />
          </Field>

          <Field id={`note-${row.id}`} label="Private notes" hint="Only visible here.">
            <textarea id={`note-${row.id}`} rows={3} value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
          </Field>

          {error && (
            <div className="alert alert--error" role="alert">
              {error}
            </div>
          )}

          <div className="btn-row">
            <button type="button" className="btn btn--primary" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GiftCardsAdmin() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getKey()));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await giftCardsAdmin.list({ limit: 200, status: statusFilter || undefined });
      setRows(response.data || []);
    } catch (err) {
      if (err.status === 401) {
        clearKey();
        setSignedIn(false);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (signedIn) load();
  }, [signedIn, load]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      pending: rows.filter((r) => r.status === 'pending').length,
    }),
    [rows]
  );

  if (!signedIn) {
    return (
      <>
        <Seo title="Gift Cards" noindex />
        <Login onSignedIn={() => setSignedIn(true)} />
      </>
    );
  }

  return (
    <>
      <Seo title="Gift Cards" noindex />

      <div className="container section admin">
        <AdminNav />

        <header className="admin__head">
          <div>
            <h1>Gift Card Requests</h1>
            <p className="muted">
              {counts.total} total · <strong>{counts.pending} pending</strong>
            </p>
          </div>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                clearKey();
                setSignedIn(false);
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        <div className="enq-filters">
          <div className="field">
            <label htmlFor="f-status">Status</label>
            <select id="f-status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All</option>
              {GIFT_CARD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="btn btn--secondary enq-filters__refresh" onClick={load}>
            Refresh
          </button>
        </div>

        {error && (
          <div className="alert alert--error" role="alert" style={{ marginBottom: 20 }}>
            {error}
          </div>
        )}
        {loading && <p className="muted">Loading…</p>}
        {!loading && rows.length === 0 && <p className="muted">No gift card requests yet.</p>}

        {rows.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table enq-table">
              <thead>
                <tr>
                  <th>Requested</th>
                  <th>Buyer</th>
                  <th>Mobile</th>
                  <th>Services</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <>
                    <tr key={row.id} className={row.status === 'pending' ? 'enq-row--new' : undefined}>
                      <td>{formatDate(row.created_at)}</td>
                      <td>
                        <strong>{row.buyer_name}</strong>
                        <span className="admin-table__slug">{row.buyer_email}</span>
                      </td>
                      <td>{row.buyer_phone}</td>
                      <td>{(row.services || []).join(', ') || '—'}</td>
                      <td>{row.amount_note || '—'}</td>
                      <td>
                        <span className={`admin-pill enq-pill--${row.status}`}>{row.status}</span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="enq-toggle"
                          onClick={() => setOpenId(openId === row.id ? null : row.id)}
                        >
                          {openId === row.id ? 'Close' : 'View'}
                        </button>
                      </td>
                    </tr>
                    {openId === row.id && (
                      <tr key={`${row.id}-detail`}>
                        <td colSpan={7} className="enq-detail-cell">
                          <Detail
                            row={row}
                            onSaved={(updated) =>
                              setRows((current) => current.map((r) => (r.id === updated.id ? updated : r)))
                            }
                          />
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
