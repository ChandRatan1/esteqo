import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApiConfigured, blogAdmin, clearKey, getKey, setKey } from '../api/blogAdmin';
import { blogCategories } from '../data/site';
import Field from '../components/Field';
import Seo from '../seo/Seo';

/**
 * Blog authoring screen at /admin/blog.
 *
 * Anyone with the admin password can sign in and publish. The password is the
 * admin_key from backend-php/config.php. It is held in sessionStorage for the
 * tab and sent as the `x-admin-key` header on every request.
 *
 * The page is marked noindex so it never appears in search results.
 */

const EMPTY_POST = {
  title: '',
  slug: '',
  categorySlug: '',
  excerpt: '',
  content: '',
  imageUrl: '',
  imageAlt: '',
  author: 'ESTEQO',
  readMinutes: 4,
  tags: '',
  status: 'published',
  publishedAt: '',
  isFeatured: false,
  metaTitle: '',
  metaDescription: '',
};

/** Rough reading time, so the author does not have to guess. */
const estimateReadMinutes = (content) =>
  Math.max(1, Math.round((content || '').trim().split(/\s+/).filter(Boolean).length / 200));

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
      setError(
        err.status === 401
          ? 'That password is not correct.'
          : err.message || 'Could not sign in.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-login">
      <form className="admin-login__card form" onSubmit={submit}>
        <h1 className="admin-login__title">Blog admin</h1>
        <p className="admin-login__text">
          Enter the admin password to write and publish posts.
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

function PostForm({
  post,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
  fieldErrors,
  onUpload,
  uploading,
  uploadError,
}) {
  const isEdit = Boolean(post.id);
  const set = (key) => (event) => {
    const value =
      event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onChange({ ...post, [key]: value });
  };

  return (
    <form className="form admin-form" onSubmit={onSubmit}>
      <h2 className="admin-form__title">{isEdit ? `Editing: ${post.title}` : 'New post'}</h2>

      {error && (
        <div className="alert alert--error" role="alert">
          <p>{error}</p>
          {Object.keys(fieldErrors).length > 0 && (
            <ul style={{ marginTop: 8 }}>
              {Object.entries(fieldErrors).map(([field, message]) => (
                <li key={field}>
                  <strong>{field}</strong>: {message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <Field id="p-title" label="Title" error={fieldErrors.title}>
        <input id="p-title" type="text" required value={post.title} onChange={set('title')} />
      </Field>

      <div className="form__row">
        <Field
          id="p-slug"
          label="URL slug"
          hint={post.slug ? `/blog/${post.slug}` : 'Left blank, it is built from the title'}
          error={fieldErrors.slug}
        >
          <input id="p-slug" type="text" value={post.slug} onChange={set('slug')} />
        </Field>

        <Field id="p-category" label="Category" error={fieldErrors.categorySlug}>
          <select id="p-category" value={post.categorySlug} onChange={set('categorySlug')}>
            <option value="">No category</option>
            {blogCategories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id="p-excerpt"
        label="Excerpt"
        hint="One or two sentences. Shown on the blog cards and in Google results."
        error={fieldErrors.excerpt}
      >
        <textarea
          id="p-excerpt"
          rows={2}
          maxLength={600}
          value={post.excerpt}
          onChange={set('excerpt')}
        />
      </Field>

      <Field
        id="p-content"
        label="Content"
        hint="Markdown: ## for headings, - for bullets, **bold**. Blank line between paragraphs."
        error={fieldErrors.content}
      >
        <textarea
          id="p-content"
          className="admin-form__editor"
          rows={16}
          value={post.content}
          onChange={set('content')}
        />
      </Field>

      <div className="admin-form__image">
        <Field
          id="p-image"
          label="Cover image"
          error={fieldErrors.imageUrl}
          hint="Choose a file, or paste a path such as /services/21324.jpg"
        >
          <input
            id="p-image"
            type="text"
            value={post.imageUrl}
            onChange={set('imageUrl')}
            placeholder="No image"
          />
        </Field>

        <div className="admin-upload">
          <label className="btn btn--secondary admin-upload__button">
            {uploading ? 'Uploading…' : 'Choose image'}
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) onUpload(file);
                event.target.value = '';
              }}
            />
          </label>
          {uploadError && <p className="field__error">{uploadError}</p>}
          {post.imageUrl && !uploadError && (
            <img className="admin-upload__preview" src={post.imageUrl} alt="" />
          )}
        </div>

        <Field
          id="p-alt"
          label="Image description"
          error={fieldErrors.imageAlt}
          hint="Describes the photo for SEO and screen readers."
        >
          <input id="p-alt" type="text" value={post.imageAlt} onChange={set('imageAlt')} />
        </Field>
      </div>

      <div className="form__row">
        <Field id="p-author" label="Author" error={fieldErrors.author}>
          <input id="p-author" type="text" value={post.author} onChange={set('author')} />
        </Field>
        <Field id="p-tags" label="Tags" hint="Comma separated" error={fieldErrors.tags}>
          <input id="p-tags" type="text" value={post.tags} onChange={set('tags')} />
        </Field>
      </div>

      <div className="form__row">
        <Field id="p-status" label="Status" error={fieldErrors.status}>
          <select id="p-status" value={post.status} onChange={set('status')}>
            <option value="published">Published — live on the site</option>
            <option value="draft">Draft — only visible here</option>
          </select>
        </Field>
        <Field id="p-date" label="Publish date" hint="Leave blank for today" error={fieldErrors.publishedAt}>
          <input id="p-date" type="date" value={post.publishedAt} onChange={set('publishedAt')} />
        </Field>
      </div>

      <label className="admin-form__check">
        <input type="checkbox" checked={post.isFeatured} onChange={set('isFeatured')} />
        Feature this post on the homepage
      </label>

      <details className="admin-form__seo">
        <summary>SEO overrides (optional)</summary>
        <Field id="p-metatitle" label="Meta title" hint="Max 70 characters. Defaults to the title.">
          <input
            id="p-metatitle"
            type="text"
            maxLength={70}
            value={post.metaTitle}
            onChange={set('metaTitle')}
          />
        </Field>
        <Field
          id="p-metadesc"
          label="Meta description"
          hint="Max 160 characters. Defaults to the excerpt."
        >
          <textarea
            id="p-metadesc"
            rows={2}
            maxLength={160}
            value={post.metaDescription}
            onChange={set('metaDescription')}
          />
        </Field>
      </details>

      <div className="btn-row">
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Publish post'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function BlogAdmin() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getKey()));
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');

  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [notice, setNotice] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const uploadImage = async (file) => {
    setUploading(true);
    setUploadError('');
    try {
      const response = await blogAdmin.upload(file);
      // Store the URL the server gives back — never the file data itself.
      setEditing((current) => ({ ...current, imageUrl: response.data.url }));
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  const load = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const response = await blogAdmin.list();
      setPosts(response.data || []);
    } catch (error) {
      if (error.status === 401) {
        clearKey();
        setSignedIn(false);
      } else {
        setListError(error.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (signedIn) load();
  }, [signedIn, load]);

  const startNew = () => {
    setEditing({ ...EMPTY_POST });
    setFormError('');
    setFieldErrors({});
  };

  const startEdit = (row) => {
    setEditing({
      id: row.id,
      title: row.title || '',
      slug: row.slug || '',
      categorySlug: row.category_slug || '',
      excerpt: row.excerpt || '',
      content: row.content || '',
      imageUrl: row.image_url || row.cover_image || '',
      imageAlt: row.image_alt || '',
      author: row.author || 'ESTEQO',
      readMinutes: row.read_minutes || 4,
      tags: Array.isArray(row.tags) ? row.tags.join(', ') : parseTags(row.tags),
      status: row.status || 'published',
      publishedAt: (row.published_at || '').slice(0, 10),
      isFeatured: Boolean(row.is_featured),
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
    });
    setFormError('');
    setFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError('');
    setFieldErrors({});

    const body = {
      title: editing.title,
      slug: editing.slug || undefined,
      categorySlug: editing.categorySlug,
      excerpt: editing.excerpt,
      content: editing.content,
      imageUrl: editing.imageUrl,
      imageAlt: editing.imageAlt,
      author: editing.author,
      readMinutes: estimateReadMinutes(editing.content),
      tags: editing.tags
        ? editing.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      status: editing.status,
      publishedAt: editing.publishedAt || undefined,
      isFeatured: editing.isFeatured,
      metaTitle: editing.metaTitle,
      metaDescription: editing.metaDescription,
    };

    try {
      if (editing.id) {
        await blogAdmin.update(editing.id, body);
        setNotice('Post updated.');
      } else {
        await blogAdmin.create(body);
        setNotice('Post published.');
      }
      setEditing(null);
      await load();
    } catch (error) {
      setFieldErrors(
        (error.details || []).reduce((acc, d) => ({ ...acc, [d.field]: d.message }), {})
      );
      setFormError(error.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    try {
      await blogAdmin.remove(row.id);
      setNotice('Post deleted.');
      await load();
    } catch (error) {
      setListError(error.message);
    }
  };

  const signOut = () => {
    clearKey();
    setSignedIn(false);
    setPosts([]);
    setEditing(null);
  };

  const counts = useMemo(
    () => ({
      published: posts.filter((p) => p.status === 'published').length,
      draft: posts.filter((p) => p.status === 'draft').length,
    }),
    [posts]
  );

  if (!adminApiConfigured) {
    return (
      <div className="container section">
        <Seo title="Blog admin" noindex />
        <div className="alert alert--error">
          The authoring API is not configured. Set <code>VITE_BLOG_API</code> in{' '}
          <code>react-app/.env</code> to the backend origin (for example{' '}
          <code>http://localhost:4143</code>) and restart the dev server.
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <>
        <Seo title="Blog admin" noindex />
        <Login onSignedIn={() => setSignedIn(true)} />
      </>
    );
  }

  return (
    <>
      <Seo title="Blog admin" noindex />

      <div className="container section admin">
        <header className="admin__head">
          <div>
            <h1>Blog admin</h1>
            <p className="muted">
              {counts.published} published · {counts.draft} draft
            </p>
          </div>
          <div className="btn-row">
            {!editing && (
              <button type="button" className="btn btn--primary" onClick={startNew}>
                New post
              </button>
            )}
            <Link to="/admin/services" className="btn btn--secondary">
              Services
            </Link>
            <Link to="/admin/contacts" className="btn btn--secondary">
              Enquiries
            </Link>
            <button type="button" className="btn btn--secondary" onClick={signOut}>
              Sign out
            </button>
          </div>
        </header>

        {notice && (
          <div className="alert alert--success" role="status" style={{ marginBottom: 24 }}>
            {notice}
          </div>
        )}
        {listError && (
          <div className="alert alert--error" role="alert" style={{ marginBottom: 24 }}>
            {listError}
          </div>
        )}

        {editing && (
          <PostForm
            post={editing}
            onChange={setEditing}
            onSubmit={save}
            onCancel={() => setEditing(null)}
            saving={saving}
            error={formError}
            fieldErrors={fieldErrors}
            onUpload={uploadImage}
            uploading={uploading}
            uploadError={uploadError}
          />
        )}

        <h2 className="admin__subtitle">All posts</h2>

        {loading && <p className="muted">Loading…</p>}

        {!loading && posts.length === 0 && <p className="muted">No posts yet.</p>}

        {posts.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Published</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.title}</strong>
                      <span className="admin-table__slug">/blog/{row.slug}</span>
                    </td>
                    <td>
                      <span className={`admin-pill admin-pill--${row.status}`}>{row.status}</span>
                    </td>
                    <td>{(row.published_at || '').slice(0, 10) || '—'}</td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" onClick={() => startEdit(row)}>
                          Edit
                        </button>
                        {row.status === 'published' && (
                          <Link to={`/blog/${row.slug}`} target="_blank" rel="noreferrer">
                            View
                          </Link>
                        )}
                        <button
                          type="button"
                          className="admin-table__delete"
                          onClick={() => remove(row)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

/** MySQL JSON columns can arrive as a string. */
function parseTags(value) {
  if (!value) return '';
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.join(', ') : '';
  } catch {
    return '';
  }
}
