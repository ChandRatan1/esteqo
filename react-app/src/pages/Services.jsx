import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { categoryBySlug, groupPath, menuGroups, servicesWithCategory } from '../data/menu';
import { CtaBand } from '../components/Sections';
import { EmptyState } from '../components/States';
import Media from '../components/Media';
import EnquiryForm from '../components/EnquiryForm';
import ConcernIcon from '../components/ConcernIcon';
import Seo from '../seo/Seo';
import { absoluteUrl } from '../seo/config';

/**
 * The banner at the top of each menu group: a title, three points, and one
 * representative photo. Same layout and colour for every group — only the
 * copy and the photo change.
 *
 * The banner is a wide panel (roughly 3:2), so a landscape photo is used
 * wherever one exists. `focus` sets object-position for the photos that are
 * portrait, keeping the face in frame instead of cropping to the middle.
 */
const GROUP_HERO = {
  facials: {
    title: 'Facial Services',
    image: '/uploads/facial/premier_contour_facial.jpg',
    focus: 'center',
    points: [
      'Every facial built around your skin, not a fixed script',
      'Clinical-grade technology behind every session',
      'Honest guidance to shape a routine that lasts',
    ],
  },
  brows: {
    title: 'Brow Services',
    // Portrait (1080x1440) — framed on the upper third so the brows stay in shot.
    image: '/uploads/brows/brow_shape.jpg',
    focus: 'center 28%',
    points: [
      'Brow mapping designed around your facial structure, not trends',
      'Tinting, lamination and semi-permanent artistry',
      'Definition that lasts, with zero downtime',
    ],
  },
  bridal: {
    title: 'Bridal Services',
    image: '/uploads/bridal/bridal-party-group-booking.jpg',
    focus: 'center',
    points: [
      'Packages planned backwards from your wedding date',
      'Skin, brows and grooming scheduled across 90, 30 or 7 days',
      'Programmes for the bride, the groom and the family',
    ],
  },
};

/**
 * The treatment menu, organised into three top-level groups: Facials, Brows
 * and Bridal Services. Other departments (body, hands, feet, waxing, massage
 * — see UNGROUPED_DEPARTMENTS in data/menu.js) are deliberately not grouped
 * under a tab here; they're still fully live pages, just reached via the
 * homepage's full department grid or a direct link rather than this menu.
 *
 * Layout follows the reference services page — a category rail on the left
 * that switches the panel on the right, each panel holding sub-category
 * headings and a card per treatment that expands to show what it includes.
 */

const formatPrice = (service) =>
  service.price == null ? 'On consultation' : `₹${service.price.toLocaleString('en-IN')}`;

// idealFor comes as a '•'-separated string on most services, but as an array
// on a few older entries — normalise to an array before rendering either way.
const idealForItems = (service) =>
  Array.isArray(service.idealFor)
    ? service.idealFor
    : typeof service.idealFor === 'string'
      ? service.idealFor.split('•').map((s) => s.trim()).filter(Boolean)
      : [];

function Caret({ open }) {
  return (
    <span className={`tcard__toggle${open ? ' tcard__toggle--open' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 20 12">
        <path d="M1 1l9 9 9-9" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    </span>
  );
}

/** Simple line-art glyph per department, shown in the badge next to each treatment name. */
const DEPARTMENT_ICON_PATHS = {
  facials: 'M12 2l1.8 5.6H20l-4.8 3.5 1.8 5.6L12 13.2l-5 3.5 1.8-5.6L4 7.6h6.2z',
  'add-on-treatments': 'M12 2C9 6 6 9.5 6 13a6 6 0 0012 0c0-3.5-3-7-6-11z',
  lasers: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
  brows: 'M3 15c2-4 6-6 9-6s7 2 9 6',
  bridal: 'M12 3l2.2 4.5L19 8l-3.5 3.4L16.3 16 12 13.7 7.7 16l.8-4.6L5 8l4.8-.5z',
};
const DEFAULT_ICON_PATH = 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 4v6l4 2';

function DepartmentIcon({ categorySlug }) {
  const path = DEPARTMENT_ICON_PATHS[categorySlug] || DEFAULT_ICON_PATH;
  return (
    <span className="tcard__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d={path} stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
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
            <DepartmentIcon categorySlug={service.categorySlug} />
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
            </div>
          </div>

          <div className="tcard__right">
            {service.bullets?.length > 0 && (
              <>
                <h5 className="tcard__label">Includes</h5>
                <p className="tcard__meta">{service.bullets.join(' • ')}</p>
              </>
            )}
            {idealForItems(service).length > 0 && (
              <>
                <h5 className="tcard__label">Concerns</h5>
                <ul className="concerns">
                  {idealForItems(service).slice(0, 3).map((concern) => (
                    <li className="concern" key={concern}>
                      <ConcernIcon concern={concern} />
                      <span className="concern__label">{concern}</span>
                    </li>
                  ))}
                </ul>
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

/** Title and description per menu tab — each tab is its own indexed page. */
const GROUP_SEO = {
  facials: {
    title: 'Facials for Women & Men in Noida — Prices',
    description:
      "Facials for women and men in Noida, with prices — HydraFacial, carbon laser, medi-facials, peels, men's facials and laser treatments in Sector 25.",
  },
  brows: {
    title: 'Brow Services & Prices in Noida',
    description:
      'Ombré, powder and microblading brows for women and men, brow mapping, lamination and tinting with prices — by Seema Nanda in Sector 25, Noida.',
  },
  bridal: {
    title: 'Bridal Packages & Prices in Noida',
    description:
      'Pre-bridal and pre-groom skin packages with prices — bride and groom glow courses, brow design and day-before rituals at ESTEQO, Sector 25, Noida.',
  },
};

export default function Services() {
  const { groupSlug } = useParams();
  const navigate = useNavigate();

  // /services/menu/<group> lets the header dropdown open a specific group
  // directly, and keeps that choice in the URL so it can be linked and
  // shared. The default group (menuGroups[0]) lives at plain /services.
  const activeGroup = menuGroups.some((g) => g.slug === groupSlug) ? groupSlug : menuGroups[0].slug;

  const setActiveGroup = (slug) => {
    navigate(groupPath(slug), { replace: true });
  };
  const [query, setQuery] = useState('');
  const [openSlugs, setOpenSlugs] = useState(() => new Set());

  const toggleSlug = (slug) => {
    setOpenSlugs((cur) => {
      const next = new Set(cur);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

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
  const hero = GROUP_HERO[group.slug] || GROUP_HERO.facials;

  return (
    <>
      <Seo
        title={GROUP_SEO[group.slug]?.title || 'Treatments & Prices'}
        description={
          GROUP_SEO[group.slug]?.description ||
          'The full ESTEQO treatment menu with prices — facials, brows, bridal packages, body care, threading, waxing and massages in Sector 25, Noida.'
        }
        // Every group has exactly one canonical URL (groupPath), even when
        // reached via the redundant /services/menu/facials for the default
        // group — this stops that from being counted as duplicate content.
        canonicalUrl={absoluteUrl(groupPath(activeGroup))}
        keywords={
          group.slug === 'bridal'
            ? ['pre-groom facial Noida', 'groom skin package Noida']
            : ["men's facial Noida", 'facial for men Noida', 'skin treatment for men Noida']
        }
        breadcrumbs={
          group.slug === menuGroups[0].slug
            ? [{ name: 'Services', path: '/services' }]
            : [
                { name: 'Services', path: '/services' },
                { name: group.name, path: groupPath(group.slug) },
              ]
        }
      />

      <section className="svc-hero">
        <div className="svc-hero__panel">
          <article className="svc-hero__text">
            <h1>{hero.title}</h1>
            <ul className="svc-hero__points">
              {hero.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>

          <div className="svc-hero__media" style={{ '--hero-focus': hero.focus }}>
            <Media src={hero.image} alt={hero.title} accent="light-yellow" label={group.name} />
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
                        setOpenSlugs(new Set());
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
                              open={openSlugs.has(service.slug)}
                              onToggle={() => toggleSlug(service.slug)}
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
                        open={openSlugs.has(service.slug)}
                        onToggle={() => toggleSlug(service.slug)}
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

      <section className="section section--cream">
        <div className="container container--narrow">
          <div className="section-head section-head--center">
            <span className="eyebrow">Still deciding?</span>
            <h2>Ask us which treatment is right for you</h2>
            <p className="lede">
              Send us your skin concern and we'll suggest the right starting point — no obligation.
            </p>
          </div>
          <EnquiryForm variant="contact" />
        </div>
      </section>

      <CtaBand />
    </>
  );
}
