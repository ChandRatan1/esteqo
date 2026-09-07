import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import Accordion from '../components/Accordion';
import { Breadcrumbs, CtaBand, FactList, PageHero, Split, TickList } from '../components/Sections';
import { Loading, ErrorState } from '../components/States';
import Seo, { faqSchema } from '../seo/Seo';

/**
 * A department page: intro banner, then one alternating text/image row per
 * treatment — the layout the original ESTEQO treatment pages use — followed
 * by that department's FAQs.
 */
export default function ServiceCategory() {
  const { categorySlug } = useParams();
  const { data: category, loading, error, reload } = useApi(
    (opts) => api.getCategory(categorySlug, opts),
    [categorySlug]
  );

  usePageMeta(category?.name, category?.tagline);

  if (loading) return <Loading label="Loading treatments…" />;
  if (error) {
    return (
      <div className="container section">
        <ErrorState error={error} onRetry={reload} />
        <div className="btn-row" style={{ justifyContent: 'center' }}>
          <Link to="/services" className="btn btn--secondary">
            Back to all treatments
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={category.metaTitle || `${category.name} in Noida`}
        description={category.metaDescription || category.tagline}
        image={category.heroImage}
        noindex={category.noindex}
        canonicalUrl={category.canonicalUrl}
        breadcrumbs={[
          { name: 'Services', path: '/services' },
          { name: category.name, path: `/services/${category.slug}` },
        ]}
        schema={faqSchema(category.faqs)}
      />

      <PageHero
        eyebrow={`${category.serviceCount} ${category.serviceCount === 1 ? 'treatment' : 'treatments'}`}
        title={category.name}
        text={category.tagline}
        accent={category.accent}
      />

      <div className="container" style={{ paddingTop: 'var(--module-spacing-medium)' }}>
        <Breadcrumbs trail={[{ label: 'Services', to: '/services' }, { label: category.name }]} />
        {category.intro && (
          <p className="lede" style={{ maxWidth: '68ch' }}>
            {category.intro}
          </p>
        )}
      </div>

      <section className="section">
        <div className="container">
          {category.services.map((service, index) => (
            <Split
              key={service.slug}
              title={service.name}
              accent={index % 2 === 0 ? category.accent : 'off-white'}
              flip={index % 2 === 1}
              image={service.image}
              imageAlt={service.name}
            >
              <p>{service.summary}</p>

              <TickList items={service.bullets} />

              <div className="price-line">
                {service.price != null && (
                  <span className="price-line__amount">
                    ₹{service.price.toLocaleString('en-IN')}
                  </span>
                )}
                {service.durationMinutes && (
                  <span className="price-line__note">{service.durationMinutes} minutes</span>
                )}
                {service.priceNote && <span className="price-line__note">{service.priceNote}</span>}
              </div>

              {service.variants?.length > 0 && (
                <div className="variants">
                  {service.variants.map((variant) => (
                    <span className="variant" key={variant.label}>
                      <strong>{variant.label}</strong> · ₹{variant.price.toLocaleString('en-IN')}
                    </span>
                  ))}
                </div>
              )}

              <div className="btn-row" style={{ marginTop: 30 }}>
                <Link to={`/appointment?service=${service.slug}`} className="btn btn--secondary">
                  Book this
                </Link>
              </div>
            </Split>
          ))}
        </div>
      </section>

      {category.faqs?.length > 0 && (
        <section className="section section--cream">
          <div className="container container--narrow">
            <div className="section-head section-head--center">
              <span className="eyebrow">Good to know</span>
              <h2>Frequently asked questions</h2>
            </div>
            <Accordion items={category.faqs} defaultOpen={category.faqs[0].id} />
          </div>
        </section>
      )}

      <CtaBand
        title={`Contact us to schedule your ${category.name.toLowerCase()} treatment`}
      />
    </>
  );
}
