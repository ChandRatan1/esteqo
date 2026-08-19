import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApiConfigured, blogAdmin, clearKey, getKey, setKey } from '../api/blogAdmin';
import { categoriesAdmin, servicesAdmin, servicesApiConfigured, settingsAdmin } from '../api/servicesAdmin';
import Field from '../components/Field';
import Seo from '../seo/Seo';

/**
 * Services & departments authoring screen at /admin/services.
 *
 * Same pattern as /admin/blog: sign in with the shared admin password (stored
 * in sessionStorage, sent as the `x-admin-key` header), then create, edit and
 * delete departments and treatments directly against the `service_categories`
 * and `services` tables. Every change is live on the site immediately — no
 * rebuild, no redeploy. Marked noindex so it never appears in search results.
 */

const EMPTY_SERVICE = {
  name: '',
  slug: '',
  categorySlug: '',
  summary: '',
  description: '',
  bullets: '',
  whatToExpect: '',
  idealFor: '',
  durationMinutes: '',
  price: '',
  image: '',
  imageAlt: '',
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
  noindex: false,
};

const EMPTY_CATEGORY = {
  name: '',
  slug: '',
  tagline: '',
  intro: '',
  accent: 'cream',
  heroImage: '',
  sortOrder: 0,
  isFeatured: false,
  isActive: true,
  metaTitle: '',
  metaDescription: '',
};

const linesToList = (value) =>
  (value || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

const listToLines = (value) => (Array.isArray(value) ? value.join('\n') : '');

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
        <h1 className="admin-login__title">Services admin</h1>
        <p className="admin-login__text">Enter the admin password to manage departments and treatments.</p>

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

function CategoryForm({ category, onChange, onSubmit, onCancel, saving, error, fieldErrors }) {
  const isEdit = Boolean(category.id);
  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onChange({ ...category, [key]: value });
  };

  return (
    <form className="form admin-form" onSubmit={onSubmit}>
      <h2 className="admin-form__title">{isEdit ? `Editing department: ${category.name}` : 'New department'}</h2>

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

      <div className="form__row">
        <Field id="c-name" label="Name" error={fieldErrors.name}>
          <input id="c-name" type="text" required value={category.name} onChange={set('name')} />
        </Field>
        <Field
          id="c-slug"
          label="URL slug"
          hint={category.slug ? `/services/${category.slug}` : 'Left blank, it is built from the name'}
          error={fieldErrors.slug}
        >
          <input id="c-slug" type="text" value={category.slug} onChange={set('slug')} />
        </Field>
      </div>

      <Field id="c-tagline" label="Tagline" hint="One short line, shown under the name.">
        <input id="c-tagline" type="text" maxLength={255} value={category.tagline} onChange={set('tagline')} />
      </Field>

      <Field id="c-intro" label="Intro" hint="A paragraph shown at the top of the department page.">
        <textarea id="c-intro" rows={3} value={category.intro} onChange={set('intro')} />
      </Field>

      <div className="form__row">
        <Field
          id="c-accent"
          label="Accent colour"
          hint="e.g. cream, light-pink, light-blue, light-brown, light-green, light-yellow, off-white"
        >
          <input id="c-accent" type="text" value={category.accent} onChange={set('accent')} />
        </Field>
        <Field id="c-sort" label="Sort order" hint="Lower numbers come first.">
          <input id="c-sort" type="number" min={0} value={category.sortOrder} onChange={set('sortOrder')} />
        </Field>
      </div>

      <Field id="c-hero" label="Hero image" hint="Path or URL, optional.">
        <input id="c-hero" type="text" value={category.heroImage} onChange={set('heroImage')} />
      </Field>

      <label className="admin-form__check">
        <input type="checkbox" checked={category.isFeatured} onChange={set('isFeatured')} />
        Featured department
      </label>
      <label className="admin-form__check" style={{ marginTop: 10 }}>
        <input type="checkbox" checked={category.isActive} onChange={set('isActive')} />
        Active — visible on the site
      </label>

      <details className="admin-form__seo" style={{ marginTop: 20 }}>
        <summary>SEO overrides (optional)</summary>
        <Field id="c-metatitle" label="Meta title" hint="Max 70 characters.">
          <input id="c-metatitle" type="text" maxLength={70} value={category.metaTitle} onChange={set('metaTitle')} />
        </Field>
        <Field id="c-metadesc" label="Meta description" hint="Max 160 characters.">
          <textarea id="c-metadesc" rows={2} maxLength={160} value={category.metaDescription} onChange={set('metaDescription')} />
        </Field>
      </details>

      <div className="btn-row" style={{ marginTop: 20 }}>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add department'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ServiceForm({
  service,
  categories,
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
  const isEdit = Boolean(service.id);
  const set = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onChange({ ...service, [key]: value });
  };

  return (
    <form className="form admin-form" onSubmit={onSubmit}>
      <h2 className="admin-form__title">{isEdit ? `Editing: ${service.name}` : 'New service'}</h2>

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

      <Field id="s-name" label="Name" error={fieldErrors.name}>
        <input id="s-name" type="text" required value={service.name} onChange={set('name')} />
      </Field>

      <div className="form__row">
        <Field
          id="s-slug"
          label="URL slug"
          hint={service.slug ? `/treatments/${service.slug}` : 'Left blank, it is built from the name'}
          error={fieldErrors.slug}
        >
          <input id="s-slug" type="text" value={service.slug} onChange={set('slug')} />
        </Field>

        <Field id="s-category" label="Department" error={fieldErrors.categorySlug}>
          <select id="s-category" required value={service.categorySlug} onChange={set('categorySlug')}>
            <option value="">Choose a department</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="s-summary" label="Summary" hint="One or two sentences, shown on cards and search results." error={fieldErrors.summary}>
        <textarea id="s-summary" rows={2} maxLength={600} value={service.summary} onChange={set('summary')} />
      </Field>

      <Field id="s-description" label="Description" hint="Longer description shown on the treatment page (optional).">
        <textarea id="s-description" rows={4} value={service.description} onChange={set('description')} />
      </Field>

      <div className="form__row">
        <Field id="s-bullets" label="What this treatment does" hint="One point per line.">
          <textarea id="s-bullets" rows={4} value={service.bullets} onChange={set('bullets')} />
        </Field>
        <Field id="s-expect" label="What to expect" hint="One point per line.">
          <textarea id="s-expect" rows={4} value={service.whatToExpect} onChange={set('whatToExpect')} />
        </Field>
      </div>

      <Field id="s-idealfor" label="Ideal for" hint="Short sentence describing who this suits." error={fieldErrors.idealFor}>
        <input id="s-idealfor" type="text" maxLength={500} value={service.idealFor} onChange={set('idealFor')} />
      </Field>

      <div className="admin-form__image">
        <Field id="s-image" label="Image" error={fieldErrors.image} hint="Choose a file, or paste a path such as /services/21324.jpg">
          <input id="s-image" type="text" value={service.image} onChange={set('image')} placeholder="No image" />
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
          {service.image && !uploadError && <img className="admin-upload__preview" src={service.image} alt="" />}
        </div>

        <Field id="s-imagealt" label="Image description" error={fieldErrors.imageAlt} hint="Describes the photo for SEO and screen readers.">
          <input id="s-imagealt" type="text" value={service.imageAlt} onChange={set('imageAlt')} />
        </Field>
      </div>

      <div className="form__row">
        <Field id="s-duration" label="Duration (minutes)" hint="Leave blank if it varies.">
          <input id="s-duration" type="number" min={1} max={600} value={service.durationMinutes} onChange={set('durationMinutes')} />
        </Field>
        <Field id="s-price" label="Price (₹)" hint="Leave blank for 'On consultation'.">
          <input id="s-price" type="number" min={0} step="1" value={service.price} onChange={set('price')} />
        </Field>
        <Field id="s-sort" label="Sort order" hint="Lower numbers come first.">
          <input id="s-sort" type="number" min={0} value={service.sortOrder} onChange={set('sortOrder')} />
        </Field>
      </div>

      <label className="admin-form__check">
        <input type="checkbox" checked={service.isFeatured} onChange={set('isFeatured')} />
        Feature this service (★ Most booked)
      </label>
      <label className="admin-form__check" style={{ marginTop: 10 }}>
        <input type="checkbox" checked={service.isActive} onChange={set('isActive')} />
        Active — visible on the site
      </label>

      <details className="admin-form__seo" style={{ marginTop: 20 }}>
        <summary>SEO overrides (optional)</summary>
        <Field id="s-metatitle" label="Meta title" hint="Max 70 characters. Defaults to the name.">
          <input id="s-metatitle" type="text" maxLength={70} value={service.metaTitle} onChange={set('metaTitle')} />
        </Field>
        <Field id="s-metadesc" label="Meta description" hint="Max 160 characters. Defaults to the summary.">
          <textarea id="s-metadesc" rows={2} maxLength={160} value={service.metaDescription} onChange={set('metaDescription')} />
        </Field>
        <label className="admin-form__check">
          <input type="checkbox" checked={service.noindex} onChange={set('noindex')} />
          Hide from search engines (noindex)
        </label>
      </details>

      <div className="btn-row" style={{ marginTop: 20 }}>
        <button type="submit" className="btn btn--primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add service'}
        </button>
        <button type="button" className="btn btn--secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function RobotsPanel() {
  const [value, setValue] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    settingsAdmin
      .get('robots_txt')
      .then((response) => setValue(response.data?.value || ''))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setNotice('');
    try {
      await settingsAdmin.update('robots_txt', value);
      setNotice('robots.txt updated. Live at /api/robots.txt.');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return null;

  return (
    <form className="form admin-form" onSubmit={save}>
      <h2 className="admin-form__title">robots.txt</h2>
      <p className="form__note" style={{ marginBottom: 16 }}>
        Leave blank to use the built-in default. The Sitemap: line pointing at{' '}
        <code>/api/sitemap.xml</code> is added automatically.
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
          rows={8}
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
  );
}

export default function ServicesAdmin() {
  const [signedIn, setSignedIn] = useState(() => Boolean(getKey()));

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [notice, setNotice] = useState('');

  const [editingCategory, setEditingCategory] = useState(null);
  const [categorySaving, setCategorySaving] = useState(false);
  const [categoryError, setCategoryError] = useState('');
  const [categoryFieldErrors, setCategoryFieldErrors] = useState({});

  const [editingService, setEditingService] = useState(null);
  const [serviceSaving, setServiceSaving] = useState(false);
  const [serviceError, setServiceError] = useState('');
  const [serviceFieldErrors, setServiceFieldErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setListError('');
    try {
      const [categoriesResponse, servicesResponse] = await Promise.all([
        categoriesAdmin.list(),
        servicesAdmin.list(),
      ]);
      setCategories(categoriesResponse.data || []);
      setServices(servicesResponse.data || []);
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

  const uploadImage = async (file) => {
    setUploading(true);
    setUploadError('');
    try {
      const response = await servicesAdmin.upload(file);
      setEditingService((current) => ({ ...current, image: response.data.url }));
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setUploading(false);
    }
  };

  /* -------------------------------- Departments -------------------------------- */

  const startNewCategory = () => {
    setEditingCategory({ ...EMPTY_CATEGORY });
    setCategoryError('');
    setCategoryFieldErrors({});
  };

  const startEditCategory = (row) => {
    setEditingCategory({
      id: row.id,
      name: row.name || '',
      slug: row.slug || '',
      tagline: row.tagline || '',
      intro: row.intro || '',
      accent: row.accent || 'cream',
      heroImage: row.hero_image || '',
      sortOrder: row.sort_order ?? 0,
      isFeatured: Boolean(row.is_featured),
      isActive: Boolean(row.is_active),
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
    });
    setCategoryError('');
    setCategoryFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveCategory = async (event) => {
    event.preventDefault();
    setCategorySaving(true);
    setCategoryError('');
    setCategoryFieldErrors({});

    const body = {
      name: editingCategory.name,
      slug: editingCategory.slug || undefined,
      tagline: editingCategory.tagline,
      intro: editingCategory.intro,
      accent: editingCategory.accent,
      heroImage: editingCategory.heroImage,
      sortOrder: editingCategory.sortOrder,
      isFeatured: editingCategory.isFeatured,
      isActive: editingCategory.isActive,
      metaTitle: editingCategory.metaTitle,
      metaDescription: editingCategory.metaDescription,
    };

    try {
      if (editingCategory.id) {
        await categoriesAdmin.update(editingCategory.id, body);
        setNotice('Department updated.');
      } else {
        await categoriesAdmin.create(body);
        setNotice('Department added.');
      }
      setEditingCategory(null);
      await load();
    } catch (error) {
      setCategoryFieldErrors((error.details || []).reduce((acc, d) => ({ ...acc, [d.field]: d.message }), {}));
      setCategoryError(error.message);
    } finally {
      setCategorySaving(false);
    }
  };

  const removeCategory = async (row) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete the "${row.name}" department? It must be empty of services first.`)) return;
    try {
      await categoriesAdmin.remove(row.id);
      setNotice('Department deleted.');
      await load();
    } catch (error) {
      setListError(error.message);
    }
  };

  /* -------------------------------- Services -------------------------------- */

  const startNewService = () => {
    setEditingService({ ...EMPTY_SERVICE, categorySlug: categories[0]?.slug || '' });
    setServiceError('');
    setServiceFieldErrors({});
  };

  const startEditService = (row) => {
    setEditingService({
      id: row.id,
      name: row.name || '',
      slug: row.slug || '',
      categorySlug: row.category_slug || '',
      summary: row.summary || '',
      description: row.description || '',
      bullets: listToLines(parseJsonArray(row.bullets)),
      whatToExpect: listToLines(parseJsonArray(row.what_to_expect)),
      idealFor: row.ideal_for || '',
      durationMinutes: row.duration_minutes ?? '',
      price: row.price ?? '',
      image: row.image || '',
      imageAlt: row.image_alt || '',
      sortOrder: row.sort_order ?? 0,
      isFeatured: Boolean(row.is_featured),
      isActive: Boolean(row.is_active),
      metaTitle: row.meta_title || '',
      metaDescription: row.meta_description || '',
      noindex: Boolean(row.noindex),
    });
    setServiceError('');
    setServiceFieldErrors({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveService = async (event) => {
    event.preventDefault();
    setServiceSaving(true);
    setServiceError('');
    setServiceFieldErrors({});

    const body = {
      name: editingService.name,
      slug: editingService.slug || undefined,
      categorySlug: editingService.categorySlug,
      summary: editingService.summary,
      description: editingService.description,
      bullets: linesToList(editingService.bullets),
      whatToExpect: linesToList(editingService.whatToExpect),
      idealFor: editingService.idealFor,
      durationMinutes: editingService.durationMinutes === '' ? null : editingService.durationMinutes,
      price: editingService.price === '' ? null : editingService.price,
      image: editingService.image,
      imageAlt: editingService.imageAlt,
      sortOrder: editingService.sortOrder,
      isFeatured: editingService.isFeatured,
      isActive: editingService.isActive,
      metaTitle: editingService.metaTitle,
      metaDescription: editingService.metaDescription,
      noindex: editingService.noindex,
    };

    try {
      if (editingService.id) {
        await servicesAdmin.update(editingService.id, body);
        setNotice('Service updated.');
      } else {
        await servicesAdmin.create(body);
        setNotice('Service added.');
      }
      setEditingService(null);
      await load();
    } catch (error) {
      setServiceFieldErrors((error.details || []).reduce((acc, d) => ({ ...acc, [d.field]: d.message }), {}));
      setServiceError(error.message);
    } finally {
      setServiceSaving(false);
    }
  };

  const removeService = async (row) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${row.name}"? This cannot be undone.`)) return;
    try {
      await servicesAdmin.remove(row.id);
      setNotice('Service deleted.');
      await load();
    } catch (error) {
      setListError(error.message);
    }
  };

  const signOut = () => {
    clearKey();
    setSignedIn(false);
    setCategories([]);
    setServices([]);
    setEditingCategory(null);
    setEditingService(null);
  };

  const counts = useMemo(
    () => ({
      departments: categories.length,
      services: services.length,
      active: services.filter((s) => s.is_active).length,
    }),
    [categories, services]
  );

  if (!adminApiConfigured || !servicesApiConfigured) {
    return (
      <div className="container section">
        <Seo title="Services admin" noindex />
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
        <Seo title="Services admin" noindex />
        <Login onSignedIn={() => setSignedIn(true)} />
      </>
    );
  }

  return (
    <>
      <Seo title="Services admin" noindex />

      <div className="container section admin">
        <header className="admin__head">
          <div>
            <h1>Services admin</h1>
            <p className="muted">
              {counts.departments} departments · {counts.services} services · {counts.active} active
            </p>
          </div>
          <div className="btn-row">
            <Link to="/admin/blog" className="btn btn--secondary">
              Blog admin
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
        {loading && <p className="muted">Loading…</p>}

        {/* ---------------------------- Departments ---------------------------- */}

        <div className="admin__head" style={{ borderBottom: 'none', marginBottom: 10, paddingBottom: 0 }}>
          <h2 className="admin__subtitle" style={{ margin: 0 }}>
            Departments
          </h2>
          {!editingCategory && (
            <button type="button" className="btn btn--secondary" onClick={startNewCategory}>
              New department
            </button>
          )}
        </div>

        {editingCategory && (
          <CategoryForm
            category={editingCategory}
            onChange={setEditingCategory}
            onSubmit={saveCategory}
            onCancel={() => setEditingCategory(null)}
            saving={categorySaving}
            error={categoryError}
            fieldErrors={categoryFieldErrors}
          />
        )}

        {!loading && categories.length > 0 && (
          <div className="admin-table-wrap" style={{ marginBottom: 40 }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Services</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.name}</strong>
                      <span className="admin-table__slug">/services/{row.slug}</span>
                    </td>
                    <td>{row.service_count ?? 0}</td>
                    <td>
                      <span className={`admin-pill admin-pill--${row.is_active ? 'published' : 'draft'}`}>
                        {row.is_active ? 'active' : 'hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" onClick={() => startEditCategory(row)}>
                          Edit
                        </button>
                        {Boolean(row.is_active) && (
                          <Link to={`/services/${row.slug}`} target="_blank" rel="noreferrer">
                            View
                          </Link>
                        )}
                        <button type="button" className="admin-table__delete" onClick={() => removeCategory(row)}>
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

        {/* ------------------------------ Services ------------------------------ */}

        <div className="admin__head" style={{ borderBottom: 'none', marginBottom: 10, paddingBottom: 0 }}>
          <h2 className="admin__subtitle" style={{ margin: 0 }}>
            Services
          </h2>
          {!editingService && categories.length > 0 && (
            <button type="button" className="btn btn--primary" onClick={startNewService}>
              New service
            </button>
          )}
        </div>

        {categories.length === 0 && !loading && (
          <p className="muted">Add a department first, then services can be added to it.</p>
        )}

        {editingService && (
          <ServiceForm
            service={editingService}
            categories={categories}
            onChange={setEditingService}
            onSubmit={saveService}
            onCancel={() => setEditingService(null)}
            saving={serviceSaving}
            error={serviceError}
            fieldErrors={serviceFieldErrors}
            onUpload={uploadImage}
            uploading={uploading}
            uploadError={uploadError}
          />
        )}

        {!loading && services.length === 0 && categories.length > 0 && <p className="muted">No services yet.</p>}

        {services.length > 0 && (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.name}</strong>
                      <span className="admin-table__slug">/treatments/{row.slug}</span>
                    </td>
                    <td>{row.category_name || '—'}</td>
                    <td>{row.price != null ? `₹${Number(row.price).toLocaleString('en-IN')}` : 'On consultation'}</td>
                    <td>
                      <span className={`admin-pill admin-pill--${row.is_active ? 'published' : 'draft'}`}>
                        {row.is_active ? 'active' : 'hidden'}
                      </span>
                    </td>
                    <td>
                      <div className="admin-table__actions">
                        <button type="button" onClick={() => startEditService(row)}>
                          Edit
                        </button>
                        {Boolean(row.is_active) && (
                          <Link to={`/treatments/${row.slug}`} target="_blank" rel="noreferrer">
                            View
                          </Link>
                        )}
                        <button type="button" className="admin-table__delete" onClick={() => removeService(row)}>
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

        {/* ------------------------------ robots.txt ------------------------------ */}

        <h2 className="admin__subtitle">SEO files</h2>
        <p className="muted" style={{ marginTop: -10, marginBottom: 20 }}>
          Sitemap: <code>/api/sitemap.xml</code> — regenerated live from the departments, services and blog
          posts above, no action needed here.
        </p>
        <RobotsPanel />
      </div>
    </>
  );
}

/** MySQL JSON columns can arrive as a string. */
function parseJsonArray(value) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
