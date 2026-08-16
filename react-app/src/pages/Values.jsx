import { useMemo, useState } from 'react';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import { useSite } from '../context/SiteContext';
import Accordion from '../components/Accordion';
import { CtaBand, PageHero } from '../components/Sections';
import { Loading, ErrorState } from '../components/States';
import Seo, { faqSchema } from '../seo/Seo';

const PRINCIPLES = [
  {
    title: 'Analysis first',
    text: 'Nothing is booked before your skin is assessed. If a treatment is not right for you, we will say so.',
  },
  {
    title: 'Realistic timelines',
    text: 'We tell you how many sessions a result takes. One appointment is a good day; a course is what changes skin.',
  },
  {
    title: 'Comfort and safety',
    text: 'Patch tests where needed, dermatologically approved formulas, and cooling technology on every laser session.',
  },
  {
    title: 'No upselling',
    text: 'Add-ons are recommended when they will genuinely improve your result — not to lengthen the bill.',
  },
];

export default function Values() {
  const { categories } = useSite();
  const [group, setGroup] = useState('general');

  usePageMeta(
    'Our Values',
    'How ESTEQO works — analysis before treatment, realistic timelines, and answers to the questions we are asked most.'
  );

  const { data: faqs, loading, error, reload } = useApi((opts) => api.getFaqs(undefined, opts), []);

  const groupOptions = useMemo(() => {
    const options = [{ slug: 'general', name: 'General' }];
    for (const category of categories) {
      if (faqs?.[category.slug]?.length) options.push({ slug: category.slug, name: category.name });
    }
    return options;
  }, [categories, faqs]);

  const items = faqs?.[group] || [];

  return (
    <>
      <Seo
        title="Our Values & FAQ"
        description="How ESTEQO works — analysis before treatment, realistic timelines, and answers to the questions we are asked most."
        breadcrumbs={[{ name: 'Values', path: '/values' }]}
        schema={faqSchema(faqs?.general || [])}
      />

      <PageHero
        eyebrow="Our values"
        title="What you can expect from us"
        text="Beauty is personal — every skin deserves tailored care. These are the standards we hold ourselves to, and the answers to what we are asked most."
        accent="light-green"
      />

      <section className="section">
        <div className="container">
          <div className="values">
            {PRINCIPLES.map((item, index) => (
              <div className="value" key={item.title}>
                <span className="value__num">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container container--narrow">
          <div className="section-head section-head--center">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>

          {loading && <Loading />}
          {error && <ErrorState error={error} onRetry={reload} />}

          {faqs && (
            <>
              <div className="chips" style={{ justifyContent: 'center', marginBottom: 36 }}>
                {groupOptions.map((option) => (
                  <button
                    type="button"
                    key={option.slug}
                    className={`chip${group === option.slug ? ' chip--active' : ''}`}
                    onClick={() => setGroup(option.slug)}
                  >
                    {option.name}
                  </button>
                ))}
              </div>

              <Accordion key={group} items={items} defaultOpen={items[0]?.id} />
            </>
          )}
        </div>
      </section>

      <CtaBand
        title="Still have a question?"
        text="Call or WhatsApp us and we will answer honestly — including when the answer is that you do not need the treatment."
      />
    </>
  );
}
