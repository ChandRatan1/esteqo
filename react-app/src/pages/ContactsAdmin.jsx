import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { blogAdmin, clearKey, getKey, setKey } from '../api/blogAdmin';
import { contactsAdmin, contactsApiConfigured, STATUSES, toCsv } from '../api/contactsAdmin';
import Field from '../components/Field';
import Seo from '../seo/Seo';

/**
 * Enquiry inbox at /admin/contacts.
 *
 * Shows every submission from the contact form, the appointment form and the
 * offer popup, so enquiries can be worked through without phpMyAdmin. Uses the
 * same admin password as the blog screen.
 *
 * What the visitor submitted is read-only. Only `status` and the private notes
 * can be edited, so the record of what was actually sent stays truthful.
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
        <h1 className="admin-login__title">Enquiries</h1>
        <p className="admin-login__text">
          Enter the admin password to see form submissions.
        </p>

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

/** One enquiry, expanded. Everything the visitor sent, plus the workflow fields. */
function Detail({ row, onSaved, onDeleted }) {
  const [status, setStatus] = useState(row.status);
  const [notes, setNotes] = useState(row.admin_notes || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setStatus(row.status);
    setNotes(row.admin_notes || '');
    setSaved(false);
    setError('');
  }, [row.id, row.status, row.admin_notes]);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await contactsAdmin.update(row.id, { status, adminNotes: notes });
      onSaved(response.data);
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete the enquiry from ${row.full_name || 'this visitor'}?`)) return;
    try {
      await contactsAdmin.remove(row.id);
      onDeleted(row.id);
    } catch (err) {
      setError(err.message);
    }
  };

  const facts = [
    ['Reference', row.reference],
    ['Received', formatDate(row.created_at)],
    ['Type', row.form_type],
    ['Name', row.full_name],
    ['Mobile', row.phone],
    ['Email', row.email],
    ['Location', row.location],
    ['Service', row.service_name],
    ['Price quoted', row.service_price],
    ['Preferred date', row.preferred_date],
    ['Preferred time', row.preferred_time],
    ['Contact by', row.contact_method],
    ['Subject', row.subject],
    ['Offer claimed', row.offer_code ? `${row.offer_code} (₹${row.offer_price})` : null],
    ['Offer from', row.offer_source],
    ['Submitted from', row.source_page],
    ['Emailed', row.email_sent ? 'yes' : 'no'],
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
          {row.message && (
            <div className="enq-message">
              <h4>Message</h4>
              <p>{row.message}</p>
            </div>
          )}

          <div className="enq-contact-buttons">
            {row.phone && (
              <>
                <a className="btn btn--primary" href={`tel:${row.phone}`}>
                  Call
                </a>
                <a
                  className="btn btn--secondary"
                  href={`https://wa.me/${String(row.phone).replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              </>
            )}
            {row.email && (
              <a className="btn btn--secondary" href={`mailto:${row.email}`}>
                Email
              </a>
            )}
          </div>

          <Field id={`status-${row.id}`} label="Status">
            <select
              id={`status-${row.id}`}
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>

          <Field
            id={`notes-${row.id}`}
            label="Private notes"
            hint="Only visible here. The visitor never sees this."
          >
            <textarea
              id={`notes-${row.id}`}
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
            />
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
            <button type="button" className="enq-delete" onClick={remove}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContactsAdmin() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getKey()));
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await contactsAdmin.list({ limit: 200 });
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
  }, []);

  useEffect(() => {
    if (signedIn) load();
  }, [signedIn, load]);

  const visible = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter((row) => {
      if (typeFilter && row.form_type !== typeFilter) return false;
      if (statusFilter && row.status !== statusFilter) return false;
      if (!term) return true;
      return [row.full_name, row.phone, row.email, row.service_name, row.reference]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [rows, typeFilter, statusFilter, search]);

  const counts = useMemo(
    () => ({
      total: rows.length,
      appointments: rows.filter((r) => r.form_type === 'appointment').length,
      contacts: rows.filter((r) => r.form_type === 'contact').length,
      unread: rows.filter((r) => r.status === 'new').length,
    }),
    [rows]
  );

  const download = () => {
    const blob = new Blob([toCsv(visible)], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `esteqo-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!contactsApiConfigured) {
    return (
      <div className="container section">
        <Seo title="Enquiries" noindex />
        <div className="alert alert--error">
          The API is not configured. Set <code>VITE_BLOG_API</code> in{' '}
          <code>react-app/.env</code> and restart the dev server.
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <>
        <Seo title="Enquiries" noindex />
        <Login onSignedIn={() => setSignedIn(true)} />
      </>
    );
  }

  return (
    <>
      <Seo title="Enquiries" noindex />

      <div className="container section admin">
        <header className="admin__head">
          <div>
            <h1>Enquiries</h1>
            <p className="muted">
              {counts.total} total · {counts.appointments} bookings · {counts.contacts} messages ·{' '}
              <strong>{counts.unread} new</strong>
            </p>
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn--secondary" onClick={download}>
              Export CSV
            </button>
            <Link to="/admin/blog" className="btn btn--secondary">
              Blog admin
            </Link>
            <Link to="/admin/services" className="btn btn--secondary">
              Services
            </Link>
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
            <label htmlFor="f-type">Type</label>
            <select id="f-type" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option value="">All</option>
              <option value="appointment">Bookings</option>
              <option value="contact">Messages</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-status">Status</label>
            <select
              id="f-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field enq-filters__search">
            <label htmlFor="f-search">Search</label>
            <input
              id="f-search"
              type="search"
              placeholder="Name, mobile, email, service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
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
        {!loading && visible.length === 0 && (
          <p className="muted">No enquiries match these filters.</p>
        )}

        {visible.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table enq-table">
              <thead>
                <tr>
                  <th>Received</th>
                  <th>Name</th>
                  <th>Mobile</th>
                  <th>Service</th>
                  <th>When</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => (
                  <>
                    <tr key={row.id} className={row.status === 'new' ? 'enq-row--new' : undefined}>
                      <td>
                        {formatDate(row.created_at)}
                        <span className="admin-table__slug">{row.reference}</span>
                      </td>
                      <td>
                        <strong>{row.full_name || '—'}</strong>
                        <span className="admin-table__slug">{row.email}</span>
                      </td>
                      <td>{row.phone || '—'}</td>
                      <td>
                        {row.service_name || (row.form_type === 'contact' ? 'Message' : '—')}
                        {row.offer_code && <span className="tag-best">₹{row.offer_price} off</span>}
                      </td>
                      <td>
                        {row.preferred_date
                          ? `${row.preferred_date}${row.preferred_time ? ` · ${row.preferred_time}` : ''}`
                          : '—'}
                      </td>
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
                              setRows((current) =>
                                current.map((r) => (r.id === updated.id ? updated : r))
                              )
                            }
                            onDeleted={(id) => {
                              setRows((current) => current.filter((r) => r.id !== id));
                              setOpenId(null);
                            }}
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
