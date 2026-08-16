import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { CtaBand } from '../components/Sections';
import { EmptyState, ErrorState, Loading } from '../components/States';
import Seo from '../seo/Seo';

/**
 * The full treatment menu.
 *
 * Layout follows the reference services page: a sticky "Treatment category"
 * jump list on the left, and on the right one section per department whose
 * treatments are collapsible rows showing the price up front and opening to
 * reveal what the treatment includes plus a booking button.
 */

const formatPrice = (service) => {
  if (service.price == null) return 'On consultation';
  return `₹${service.price.toLocaleString('en-IN')}`;
};

function Caret() {
  return (
    <svg className="acc-row__caret" viewBox="0 0 20 12" aria-hidden="true">
      <path d="M1 1l9 9 9-9" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function TreatmentRow({ service, open, onToggle }) {
  const panelId = `treatment-${service.slug}`;

  return (
    <li className={`acc-row${open ? ' acc-row--open' : ''}`}>
      <h4 className="acc-row__head">
        <button
          type="button"
          className="acc-row__button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <span className="acc-row__name">
            {service.name}
            {service.isNew && <span className="tag-new">New</span>}
            {service.isFeatured && <span className="tag-best">Most booked</span>}
          </span>
          <span className="acc-row__meta">
            <span className="acc-row__price">{formatPrice(service)}</span>
            {service.durationMinutes && (
              <span className="acc-row__mins">{service.durationMinutes} min</span>
            )}
          </span>
          <Caret />
        </button>
      </h4>

      {open && (
        <div className="acc-row__panel" id={panelId}>
          <div className="acc-row__left">
            <p>{service.summary}</p>

            {service.priceNote && service.price != null && (
              <p className="acc-row__note">{service.priceNote}</p>
            )}

            {service.variants?.length > 0 && (
              <div className="variants">
                {service.variants.map((variant) => (
                  <span className="variant" key={variant.label}>
                    <strong>{variant.label}</strong> · ₹{variant.price.toLocaleString('en-IN')}
                  </span>
                ))}
              </div>
            )}

            <div className="btn-row" style={{ marginTop: 24 }}>
              <Link to={`/appointment?service=${service.slug}`} className="btn btn--primary">
                Book now
              </Link>
              <Link to={`/treatments/${service.slug}`} className="link-underline">
                Full details
              </Link>
            </div>
          </div>

          {(service.bullets?.length > 0 || service.idealForList?.length > 0) && (
            <div className="acc-row__right">
              {service.bullets?.length > 0 && (
                <>
                  <h5 className="acc-row__label">Includes</h5>
                  <p className="acc-row__list">{service.bullets.join(' • ')}</p>
                </>
              )}
              {service.idealForList?.length > 0 && (
                <>
                  <h5 className="acc-row__label">Ideal for</h5>
                  <p className="acc-row__list">{service.idealForList.slice(0, 3).join(' • ')}</p>
                </>
              )}
              <h5 className="acc-row__label">Department</h5>
              <p className="acc-row__list">{service.category.name}</p>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function Services() {
  const [query, setQuery] = useState('');
  const [openSlug, setOpenSlug] = useState(null);

  const { data: groups, loading, error, reload } = useApi(
    (opts) => api.getServices({ grouped: 'true' }, opts),
    []
  );

  const filtered = useMemo(() => {
    if (!groups) return [];
    const term = query.trim().toLowerCase();
    if (!term) return groups;

    return groups
      .map((group) => ({
        ...group,
        services: group.services.filter(
          (service) =>
            service.name.toLowerCase().includes(term) ||
            (service.summary || '').toLowerCase().includes(term)
        ),
      }))
      .filter((group) => group.services.length > 0);
  }, [groups, query]);

  const total = useMemo(
    () => filtered.reduce((sum, group) => sum + group.services.length, 0),
    [filtered]
  );

  return (
    <>
      <Seo
        title="Treatments & Prices"
        description="The full ESTEQO treatment menu with prices — brows, medi-facials, advanced facials, peels, body polish, manicure, pedicure, threading, waxing and massages in Noida."
        breadcrumbs={[{ name: 'Services', path: '/services' }]}
      />

      {/* Hero */}
      <section className="svc-hero">
        <div className="container svc-hero__inner">
          <article>
            <span className="eyebrow">Treatment menu</span>
            <h1>Our Treatments</h1>
            <ul className="svc-hero__points">
              <li>Custom-planned treatments for your skin, not a template</li>
              <li>Medical-grade technology and professional formulations</li>
              <li>Every service begins with a detailed consultation</li>
            </ul>
            <div className="btn-row" style={{ marginTop: 30 }}>
              <Link to="/appointment" className="btn btn--primary">
                Book an appointment
              </Link>
            </div>
          </article>
          <div className="svc-hero__media" aria-hidden="true">
            <span>E</span>
          </div>
        </div>
      </section>

      {loading && <Loading label="Loading the menu…" />}
      {error && (
        <div className="container section">
          <ErrorState error={error} onRetry={reload} />
        </div>
      )}

      {groups && (
        <section className="section">
          <div className="container svc-layout">
            {/* Sticky jump links */}
            <aside className="svc-aside">
              <h2 className="svc-aside__title">Treatment category</h2>
              <ul className="svc-aside__menu">
                {groups.map((group) => (
                  <li key={group.slug}>
                    <a href={`#${group.slug}`}>
                      {group.name}
                      <span>{group.services.length}</span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="field svc-aside__search">
                <label htmlFor="svc-search">Search treatments</label>
                <input
                  id="svc-search"
                  type="search"
                  value={query}
                  placeholder="Hydra, brow, peel…"
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query && (
                  <p className="form__note" style={{ marginTop: 8 }}>
                    {total} {total === 1 ? 'match' : 'matches'}
                  </p>
                )}
              </div>
            </aside>

            {/* Department sections */}
            <div className="svc-sections">
              {filtered.length === 0 && (
                <EmptyState>
                  <p>No treatments match “{query}”.</p>
                  <p style={{ marginTop: 16 }}>
                    <button type="button" className="btn btn--secondary" onClick={() => setQuery('')}>
                      Clear search
                    </button>
                  </p>
                </EmptyState>
              )}

              {filtered.map((group) => (
                <section className="svc-dept" id={group.slug} key={group.slug}>
                  <header className="svc-dept__head">
                    <h2>
                      <Link to={`/services/${group.slug}`}>{group.name}</Link>
                    </h2>
                    <p>{group.intro || group.tagline}</p>
                  </header>

                  <ul className="acc-rows">
                    {group.services.map((service) => (
                      <TreatmentRow
                        key={service.slug}
                        service={service}
                        open={openSlug === service.slug}
                        onToggle={() =>
                          setOpenSlug((current) => (current === service.slug ? null : service.slug))
                        }
                      />
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
