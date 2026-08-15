import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import { ServiceCard } from '../components/Cards';
import { CtaBand, PageHero } from '../components/Sections';
import { CardSkeletons, EmptyState, ErrorState } from '../components/States';

/**
 * The full treatment menu — every category with all of its treatments,
 * plus a sticky category jump bar and a text filter.
 */
export default function Services() {
  const [query, setQuery] = useState('');
  usePageMeta(
    'Treatments',
    'The full ESTEQO treatment menu with prices — medi-facials, advanced facials, peels and add-ons, body bleach and polish, manicure and pedicure, threading, waxing and massages in Sector 25, Noida.'
  );

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
      <PageHero
        eyebrow="Treatment menu"
        title="Every treatment we offer"
        text="Every treatment on the ESTEQO menu, with duration and pricing. Browse below, or jump straight to a department."
      />

      {groups && (
        <div className="svc-toc">
          <div className="container svc-toc__inner">
            {groups.map((group) => (
              <a key={group.slug} href={`#${group.slug}`} className="chip">
                {group.name}
              </a>
            ))}
          </div>
        </div>
      )}

      <section className="section">
        <div className="container">
          <div
            className="field"
            style={{ maxWidth: 420, marginBottom: 'var(--module-spacing-medium)' }}
          >
            <label htmlFor="svc-search">Search treatments</label>
            <input
              id="svc-search"
              type="search"
              value={query}
              placeholder="Hydra, brow, peel, massage…"
              onChange={(event) => setQuery(event.target.value)}
            />
            {query && (
              <p className="form__note" style={{ marginTop: 8 }}>
                {total} {total === 1 ? 'match' : 'matches'}
              </p>
            )}
          </div>

          {loading && <CardSkeletons count={8} />}
          {error && <ErrorState error={error} onRetry={reload} />}

          {!loading && !error && filtered.length === 0 && (
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
            <section className="svc-group" id={group.slug} key={group.slug}>
              <div className="svc-group__head">
                <div>
                  <h2>
                    <Link to={`/services/${group.slug}`}>{group.name}</Link>
                  </h2>
                  <p>{group.tagline}</p>
                </div>
                <span className="svc-group__count">
                  {group.services.length}{' '}
                  {group.services.length === 1 ? 'treatment' : 'treatments'}
                </span>
              </div>

              <div className="grid grid--3">
                {group.services.map((service) => (
                  <ServiceCard key={service.slug} service={service} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
