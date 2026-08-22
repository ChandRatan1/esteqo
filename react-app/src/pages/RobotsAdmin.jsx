import { useEffect, useState } from 'react';
import { blogAdmin, clearKey, getKey, setKey } from '../api/blogAdmin';
import { servicesApiConfigured, settingsAdmin } from '../api/servicesAdmin';
import AdminNav from '../components/AdminNav';
import Field from '../components/Field';
import Seo from '../seo/Seo';

/**
 * robots.txt editor at /admin/robots.
 *
 * Writes to the same site_settings row that backend-php/routes/sitemap.php
 * reads on every request to /api/robots.txt — so a save here is live
 * immediately, no rebuild or redeploy. Same shared admin password as the rest
 * of /admin.
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
        <h1 className="admin-login__title">robots.txt</h1>
        <p className="admin-login__text">Enter the admin password to edit robots.txt.</p>

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

export default function RobotsAdmin() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getKey()));
  const [value, setValue] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!signedIn) return;
    settingsAdmin
      .get('robots_txt')
      .then((response) => setValue(response.data?.value || ''))
      .catch((err) => {
        if (err.status === 401) {
          clearKey();
          setSignedIn(false);
        }
      })
      .finally(() => setLoaded(true));
  }, [signedIn]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await settingsAdmin.update('robots_txt', value);
      setNotice('robots.txt updated. Live now at /api/robots.txt.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!servicesApiConfigured) {
    return (
      <div className="container section">
        <Seo title="robots.txt" noindex />
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
        <Seo title="robots.txt" noindex />
        <Login onSignedIn={() => setSignedIn(true)} />
      </>
    );
  }

  return (
    <>
      <Seo title="robots.txt" noindex />

      <div className="container section admin">
        <AdminNav />

        {!loaded && <p className="muted">Loading…</p>}

        {loaded && (
          <form className="form admin-form" onSubmit={save} style={{ maxWidth: 720 }}>
            <h2 className="admin-form__title">robots.txt</h2>
            <p className="form__note" style={{ marginBottom: 16 }}>
              Leave blank to use the built-in default. The <code>Sitemap:</code> line pointing at{' '}
              <code>/api/sitemap.xml</code> is added automatically — you never need to type it.
            </p>

            {notice && (
              <div className="alert alert--success" role="status" style={{ marginBottom: 16 }}>
                {notice}
              </div>
            )}
            {error && (
              <div className="alert alert--error" role="alert" style={{ marginBottom: 16 }}>
                {error}
              </div>
            )}

            <Field id="robots-body" label="Contents">
              <textarea
                id="robots-body"
                rows={12}
                className="admin-form__editor"
                placeholder={'User-agent: *\nAllow: /'}
                value={value}
                onChange={(event) => setValue(event.target.value)}
              />
            </Field>

            <div className="btn-row">
              <button type="submit" className="btn btn--primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save robots.txt'}
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
