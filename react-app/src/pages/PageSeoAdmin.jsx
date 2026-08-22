import { useState } from 'react';
import { blogAdmin, clearKey, getKey, setKey } from '../api/blogAdmin';
import { pageSeoAdmin, pageSeoApiConfigured } from '../api/pageSeo';
import AdminNav from '../components/AdminNav';
import Field from '../components/Field';
import Seo from '../seo/Seo';

/**
 * Page SEO screen at /admin/seo.
 *
 * Lets an SEO person override the meta title and description of any page by
 * its path, without touching code — the same shared admin password as the
 * rest of /admin. A blank field falls back to that page's own default
 * (Seo.jsx applies the override on every page load).
 */

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
      setError(err.status === 401 ? 'That password is not correct.' : err.message || 'Could not sign in.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card form" onSubmit={submit}>
        <h1 className="admin-login__title">Page SEO</h1>
        <p className="admin-login__text">Enter the admin password to edit page meta tags.</p>

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
      </form>
    </div>
  );
}

export default function PageSeoAdmin() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getKey()));
  const [pathInput, setPathInput] = useState('');
  const [loaded, setLoaded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState('');

  const load = async (event) => {
    event.preventDefault();
    if (!pathInput.trim()) return;
    setLoading(true);
    setLoadError('');
    setNotice('');
    try {
      const response = await pageSeoAdmin.load(pathInput);
      setLoaded({
        path: response.data.path,
        metaTitle: response.data.metaTitle || '',
        metaDescription: response.data.metaDescription || '',
      });
    } catch (error) {
      if (error.status === 401) {
        clearKey();
        setSignedIn(false);
      } else {
        setLoadError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setSaveError('');
    setFieldErrors({});
    setNotice('');
    try {
      const response = await pageSeoAdmin.save(loaded.path, loaded.metaTitle, loaded.metaDescription);
      setLoaded({
        path: response.data.path,
        metaTitle: response.data.metaTitle || '',
        metaDescription: response.data.metaDescription || '',
      });
      setNotice(`Saved. This is now live for ${response.data.path}.`);
    } catch (error) {
      setFieldErrors((error.details || []).reduce((acc, d) => ({ ...acc, [d.field]: d.message }), {}));
      setSaveError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (!pageSeoApiConfigured) {
    return (
      <div className="container section">
        <Seo title="Page SEO" noindex />
        <div className="alert alert--error">
          The authoring API is not configured. Set <code>VITE_BLOG_API</code> in{' '}
          <code>react-app/.env</code> and restart the dev server.
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <>
        <Seo title="Page SEO" noindex />
        <Login onSignedIn={() => setSignedIn(true)} />
      </>
    );
  }

  return (
    <>
      <Seo title="Page SEO" noindex />

      <div className="container section admin">
        <AdminNav />

        <p className="form__note" style={{ marginBottom: 24, maxWidth: '60ch' }}>
          Override a page's meta title/description without touching code. Leave a field blank to
          fall back to the page's default.
        </p>

        <form className="form" onSubmit={load} style={{ marginBottom: 30 }}>
          <Field id="seo-path" label="Page path (e.g. /about-us, /treatments/hydra-facial, /)">
            <input
              id="seo-path"
              type="text"
              placeholder="/about-us"
              value={pathInput}
              onChange={(event) => setPathInput(event.target.value)}
            />
          </Field>
          <button type="submit" className="btn btn--primary" disabled={loading || !pathInput.trim()}>
            {loading ? 'Loading…' : 'Load'}
          </button>
        </form>

        {loadError && (
          <div className="alert alert--error" role="alert" style={{ marginBottom: 24 }}>
            {loadError}
          </div>
        )}

        {loaded && (
          <form className="form admin-form" onSubmit={save} style={{ maxWidth: 640 }}>
            <h2 className="admin-form__title">{loaded.path}</h2>

            {notice && (
              <div className="alert alert--success" role="status" style={{ marginBottom: 16 }}>
                {notice}
              </div>
            )}
            {saveError && (
              <div className="alert alert--error" role="alert" style={{ marginBottom: 16 }}>
                {saveError}
              </div>
            )}

            <Field id="seo-title" label="Meta title" hint="Max 70 characters. Blank uses the page's default." error={fieldErrors.metaTitle}>
              <input
                id="seo-title"
                type="text"
                maxLength={70}
                value={loaded.metaTitle}
                onChange={(event) => setLoaded({ ...loaded, metaTitle: event.target.value })}
              />
            </Field>

            <Field
              id="seo-desc"
              label="Meta description"
              hint="Max 160 characters. Blank uses the page's default."
              error={fieldErrors.metaDescription}
            >
              <textarea
                id="seo-desc"
                rows={3}
                maxLength={160}
                value={loaded.metaDescription}
                onChange={(event) => setLoaded({ ...loaded, metaDescription: event.target.value })}
              />
            </Field>

            <div className="btn-row">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
              <button type="button" className="btn btn--secondary" onClick={() => setLoaded(null)}>
                Close
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
