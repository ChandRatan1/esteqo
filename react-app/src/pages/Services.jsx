import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categoryBySlug, menuGroups, servicesWithCategory } from '../data/menu';
import { CtaBand } from '../components/Sections';
import { EmptyState } from '../components/States';
import Seo from '../seo/Seo';

/**
 * The treatment menu, organised into four top-level categories:
 * Facials, Brows, Bridal Services and Other Services.
 *
 * Layout follows the reference services page — a category rail on the left
 * that switches the panel on the right, each panel holding sub-category
 * headings and a card per treatment that expands to show what it includes.
 */

const formatPrice = (service) =>
  service.price == null ? 'On consultation' : `₹${service.price.toLocaleString('en-IN')}`;

function Caret({ open }) {
  return (
    <span className={`tcard__toggle${open ? ' tcard__toggle--open' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 20 12">
        <path d="M1 1l9 9 9-9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  );
}

function TreatmentCard({ service, open, onToggle }) {
  const panelId = `t-${service.slug}`;

  return (
    <li className={`tcard${open ? ' tcard--open' : ''}`}>
      <h4 className="tcard__head">
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
          <span className="tcard__name">
            {service.name}
            {service.isFeatured && <span className="tag-best">★ Most booked</span>}
            {service.isNew && <span className="tag-new">New</span>}
          </span>
          <span className="tcard__price">{formatPrice(service)}</span>
          <Caret open={open} />
        </button>
      </h4>

      {open && (
        <div className="tcard__panel" id={panelId}>
          <div className="tcard__left">
            <p>{service.summary}</p>

            {service.componentsTotal && service.price && (
              <p className="tcard__saving">
                Booked separately{' '}
                <s>₹{service.componentsTotal.toLocaleString('en-IN')}</s> — you save{' '}
                <strong>₹{(service.componentsTotal - service.price).toLocaleString('en-IN')}</strong>
              </p>
            )}

            {service.priceNote && <p className="tcard__note">{service.priceNote}</p>}

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

          <div className="tcard__right">
            {service.bullets?.length > 0 && (
              <>
                <h5 className="tcard__label">Includes</h5>
                <p className="tcard__meta">{service.bullets.join(' • ')}</p>
              </>
            )}
            {service.idealFor?.length > 0 && (
              <>
                <h5 className="tcard__label">Ideal for</h5>
                <p className="tcard__meta">{service.idealFor.slice(0, 3).join(' • ')}</p>
              </>
            )}
            <h5 className="tcard__label">Duration</h5>
            <p className="tcard__meta">
              {service.durationMinutes ? `${service.durationMinutes} minutes` : 'Confirmed at consultation'}
            </p>
          </div>
        </div>
      )}
    </li>
  );
}

export default function Services() {
  const [searchParams, setSearchParams] = useSearchParams();

  // ?c=<group> lets the header dropdown open a specific category directly,
  // and keeps that choice in the URL so it can be linked and shared.
  const requested = searchParams.get('c');
  const activeGroup = menuGroups.some((g) => g.slug === requested)
    ? requested
    : menuGroups[0].slug;

  const setActiveGroup = (slug) => {
    setSearchParams(slug === menuGroups[0].slug ? {} : { c: slug }, { replace: true });
  };
  const [query, setQuery] = useState('');
  const [openSlug, setOpenSlug] = useState(null);

  const group = menuGroups.find((g) => g.slug === activeGroup) || menuGroups[0];

  // Departments in this group, each with its treatments, filtered by the search.
  const sections = useMemo(() => {
    const term = query.trim().toLowerCase();

    return group.departments
      .map((slug) => {
        const department = categoryBySlug[slug];
        if (!department) return null;

        let items = servicesWithCategory.filter((s) => s.categorySlug === slug);
        if (term) {
          items = items.filter(
            (s) =>
              s.name.toLowerCase().includes(term) ||
              (s.summary || '').toLowerCase().includes(term)
          );
        }
        if (!items.length) return null;

        // Bridal treatments carry their own sub-grouping (bride / groom / family).
        const subGroups = [...new Set(items.map((s) => s.subGroup).filter(Boolean))];

        return { department, items, subGroups };
      })
      .filter(Boolean);
  }, [group, query]);

  const total = sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <>
      <Seo
        title="Treatments & Prices"
        description="The full ESTEQO treatment menu with prices — facials, brows, bridal packages, body care, threading, waxing and massages in Sector 25, Noida."
        breadcrumbs={[{ name: 'Services', path: '/services' }]}
      />

      <section className="svc-hero">
        <div className="container svc-hero__inner">
          <article>
            <span className="eyebrow">Treatment menu</span>
            <h1>Our Services</h1>
            <ul className="svc-hero__points">
              <li>Custom-planned treatments for your skin, not a template</li>
              <li>Medical-grade technology and professional formulations</li>
              <li>Every service begins with a detailed consultation</li>
            </ul>
          </article>
          <div className="svc-hero__media" aria-hidden="true">
            <span>E</span>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container svc-layout">
          {/* Category rail */}
          <aside className="svc-rail">
            <h2 className="svc-rail__title">Treatment category</h2>
            <ul className="svc-rail__menu">
              {menuGroups.map((item) => {
                const count = item.departments.reduce(
                  (sum, slug) =>
                    sum + servicesWithCategory.filter((s) => s.categorySlug === slug).length,
                  0
                );
                const isActive = item.slug === activeGroup;

                return (
                  <li key={item.slug} className={isActive ? 'is-active' : ''}>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveGroup(item.slug);
                        setOpenSlug(null);
                      }}
                      aria-current={isActive ? 'true' : undefined}
                    >
                      <span className="svc-rail__arrow" aria-hidden="true">
                        <svg viewBox="0 0 16 12">
                          <path
                            d="M1 6h13M9 1l5 5-5 5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="svc-rail__label">{item.name}</span>
                      <span className="svc-rail__count">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="field svc-rail__search">
              <label htmlFor="svc-search">Search treatments</label>
              <input
                id="svc-search"
                type="search"
                value={query}
                placeholder="Hydra, brow, bridal…"
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <p className="form__note" style={{ marginTop: 8 }}>
                  {total} {total === 1 ? 'match' : 'matches'} in {group.name}
                </p>
              )}
            </div>
          </aside>

          {/* Panel */}
          <div className="svc-panel">
            <h2 className="svc-panel__title">{group.name}</h2>
            <p className="svc-panel__intro">{group.intro}</p>

            {sections.length === 0 && (
              <EmptyState>
                <p>No treatments in {group.name} match “{query}”.</p>
                <p style={{ marginTop: 16 }}>
                  <button type="button" className="btn btn--secondary" onClick={() => setQuery('')}>
                    Clear search
                  </button>
                </p>
              </EmptyState>
            )}

            {sections.map(({ department, items, subGroups }) => (
              <section className="svc-sub" key={department.slug}>
                {/* Groups with a single department (Brows, Bridal) are already
                    titled and introduced by the panel heading above — repeating
                    it here just duplicates the same paragraph. */}
                {group.departments.length > 1 && (
                  <>
                    <h3 className="svc-sub__title">{department.name}</h3>
                    {department.intro && <p className="svc-sub__intro">{department.intro}</p>}
                  </>
                )}

                {subGroups.length > 0 ? (
                  subGroups.map((subGroup) => (
                    <div key={subGroup}>
                      <h4 className="svc-sub__group">{subGroup}</h4>
                      <ul className="tcards">
                        {items
                          .filter((s) => s.subGroup === subGroup)
                          .map((service) => (
                            <TreatmentCard
                              key={service.slug}
                              service={service}
                              open={openSlug === service.slug}
                              onToggle={() =>
                                setOpenSlug((cur) => (cur === service.slug ? null : service.slug))
                              }
                            />
                          ))}
                      </ul>
                    </div>
                  ))
                ) : (
                  <ul className="tcards">
                    {items.map((service) => (
                      <TreatmentCard
                        key={service.slug}
                        service={service}
                        open={openSlug === service.slug}
                        onToggle={() =>
                          setOpenSlug((cur) => (cur === service.slug ? null : service.slug))
                        }
                      />
                    ))}
                  </ul>
                )}

                <Link to={`/services/${department.slug}`} className="link-underline svc-sub__more">
                  More about {department.name}
                </Link>
              </section>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
