import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import Accordion from '../components/Accordion';
import Media from '../components/Media';
import { ServiceCard } from '../components/Cards';
import { Breadcrumbs, CtaBand, FactList, IdealFor, ProcessSteps, TickList } from '../components/Sections';
import { useContactLinks, useSite } from '../context/SiteContext';
import { Loading, ErrorState } from '../components/States';
import Seo, { serviceSchema } from '../seo/Seo';

export default function ServiceDetail() {
  const { serviceSlug } = useParams();
  const { contact } = useSite();
  const links = useContactLinks();

  const { data: service, loading, error, reload } = useApi(
    (opts) => api.getService(serviceSlug, opts),
    [serviceSlug]
  );

  usePageMeta(service?.name, service?.summary);

  if (loading) return <Loading label="Loading treatment…" />;
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

  const accent = service.category?.accent || 'cream';

  return (
    <>
      <Seo
        title={service.name}
        description={service.summary}
        image={service.image}
        breadcrumbs={[
          { name: 'Services', path: '/services' },
          { name: service.category.name, path: `/services/${service.category.slug}` },
          { name: service.name, path: `/treatments/${service.slug}` },
        ]}
        schema={serviceSchema(service)}
      />

      <section className={`page-hero accent-${accent}`}>
        <div className="container">
          <Breadcrumbs
            trail={[
              { label: 'Services', to: '/services' },
              { label: service.category.name, to: `/services/${service.category.slug}` },
              { label: service.name },
            ]}
          />
          <div className="page-hero__inner">
            <span className="eyebrow">{service.category.name}</span>
            <h1 className="page-hero__title">{service.name}</h1>
            <p className="lede">{service.summary}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="detail">
            <div>
              <Media
                src={service.image}
                alt={service.name}
                accent={accent}
                label={service.name}
                variant="natural"
              />

              <div style={{ marginTop: 'var(--module-spacing-small)' }}>
                {service.description && <p className="lede">{service.description}</p>}

                {service.bullets?.length > 0 && (
                  <>
                    <h2 style={{ margin: '0 0 20px' }}>What this treatment does</h2>
                    <TickList items={service.bullets} />
                  </>
                )}

                {service.whatToExpect?.length > 0 && (
                  <>
                    <h2 style={{ margin: '44px 0 20px' }}>What to expect</h2>
                    <TickList items={service.whatToExpect} />
                  </>
                )}

                <IdealFor items={service.idealForList} />

                <ProcessSteps steps={service.process} />

                {service.aftercare?.length > 0 && (
                  <>
                    <h2 style={{ margin: '44px 0 20px' }}>Aftercare</h2>
                    <TickList items={service.aftercare} />
                  </>
                )}

                {service.note && (
                  <p className="alert" style={{ marginTop: 28, background: 'var(--light-yellow)', borderColor: 'var(--gold)' }}>
                    {service.note}
                  </p>
                )}

                <h2 style={{ margin: '44px 0 8px' }}>Duration &amp; pricing</h2>
                <FactList
                  facts={[
                    {
                      label: 'Duration',
                      value: service.durationMinutes ? `${service.durationMinutes} minutes` : null,
                    },
                    {
                      label: 'Price',
                      value:
                        service.priceNote ||
                        (service.price != null
                          ? `₹${service.price.toLocaleString('en-IN')}`
                          : 'On consultation'),
                    },
                    { label: 'Results last', value: service.resultsLast },
                    { label: 'Department', value: service.category.name },
                  ]}
                />

                {service.variants?.length > 0 && (
                  <div className="variants">
                    {service.variants.map((variant) => (
                      <span className="variant" key={variant.label}>
                        <strong>{variant.label}</strong> · ₹{variant.price.toLocaleString('en-IN')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <aside className="detail__aside">
              <h3>Book this treatment</h3>
              <p>
                Every service begins with a detailed skin consultation, so we can confirm this is the
                right protocol for you.
              </p>
              <Link
                to={`/appointment?service=${service.slug}`}
                className="btn btn--primary btn--block"
              >
                Request an appointment
              </Link>
              <a
                href={links.whatsapp}
                className="btn btn--secondary btn--block"
                style={{ marginTop: 12 }}
                target="_blank"
                rel="noreferrer"
              >
                Ask on WhatsApp
              </a>

              <dl className="detail__aside-list">
                <div>
                  <dt>Department</dt>
                  <dd>
                    <Link to={`/services/${service.category.slug}`} className="link-underline">
                      {service.category.name}
                    </Link>
                  </dd>
                </div>
                {service.durationMinutes && (
                  <div>
                    <dt>Duration</dt>
                    <dd>{service.durationMinutes} min</dd>
                  </div>
                )}
                <div>
                  <dt>Price</dt>
                  <dd>
                    {service.price != null
                      ? `₹${service.price.toLocaleString('en-IN')}`
                      : 'On consultation'}
                  </dd>
                </div>
                <div>
                  <dt>Call</dt>
                  <dd>
                    <a href={links.tel}>{contact.phone}</a>
                  </dd>
                </div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      {service.related?.length > 0 && (
        <section className="section section--cream">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Also in {service.category.name}</span>
              <h2>You might also consider</h2>
            </div>
            <div className="grid grid--4">
              {service.related.map((item) => (
                <ServiceCard key={item.slug} service={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      {service.faqs?.length > 0 && (
        <section className="section">
          <div className="container container--narrow">
            <div className="section-head section-head--center">
              <span className="eyebrow">Good to know</span>
              <h2>Frequently asked questions</h2>
            </div>
            <Accordion items={service.faqs} defaultOpen={service.faqs[0].id} />
          </div>
        </section>
      )}

      <CtaBand title={`Contact us to schedule your ${service.name}`} />
    </>
  );
}
