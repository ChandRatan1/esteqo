import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi } from '../hooks/useApi';
import { useSite } from '../context/SiteContext';
import Accordion from '../components/Accordion';
import Media from '../components/Media';
import PipelineStrip from '../components/PipelineStrip';
import ScrollSwapImage from '../components/ScrollSwapImage';
import { CtaBand } from '../components/Sections';
import { Loading, ErrorState } from '../components/States';
import Seo, { faqSchema, founderSchema } from '../seo/Seo';
import { ESTEQO_FAQS } from '../data/faqs';

/** The four areas of care, carried over from the old About page. */
const OFFERINGS = [
  {
    title: 'Face',
    text: 'Hydra facials, carbon laser therapy, PRP and mesotherapy — advanced skin treatments planned after analysis, not trends.',
  },
  {
    title: 'Body',
    text: 'Polish and bleach treatments plus glow-enhancing therapies that complement your clinical work.',
  },
  {
    title: 'Men',
    text: 'Grooming, facials, relaxation sessions, PRP and scalp rejuvenation.',
  },
  {
    title: 'Hair & Brows',
    text: 'Wellness programmes, precision brow shaping, lamination and microblading led by Seema Nanda.',
  },
];

/** How a facial actually runs, start to finish. */
const TREATMENT_STAGES = [
  {
    title: 'Consultation',
    text: 'A skin analysis before anything else — oiliness, sensitivity, pigmentation, and the concern you actually came in for.',
    image: '/uploads/facial/esthetician_choice.jpg',
  },
  {
    title: 'Cleanse & exfoliate',
    text: 'Double cleansing and gentle exfoliation clear the way, so the treatment step can actually absorb.',
    image: '/uploads/facial/dermaplaning.jpg',
  },
  {
    title: 'Targeted treatment',
    text: 'Dermabrasion, a peel, LED light or micro-needling — whichever addresses your specific concern.',
    image: '/uploads/facial/hyperpigmentation_facial.jpg',
  },
  {
    title: 'Finish & protect',
    text: 'A hydrating mask, serum and aftercare guidance, so results keep building after you leave.',
    image: '/uploads/facial/seasonal_hydrating_facial.jpg',
  },
];

const BELIEF_IMAGES = [
  '/uploads/facial/lymphatic_facial.jpg',
  '/uploads/facial/anti_aging_facial.jpg',
];

export default function Values() {
  const { brand, contact, categories } = useSite();
  const [group, setGroup] = useState('general');


  const { data: faqs, loading, error, reload } = useApi((opts) => api.getFaqs(undefined, opts), []);

  const groupOptions = useMemo(() => {
    const options = [{ slug: 'general', name: 'General' }, { slug: 'brows', name: 'Brows & PMU' }];
    for (const category of categories) {
      if (category.slug === 'brows') continue;
      if (faqs?.[category.slug]?.length) options.push({ slug: category.slug, name: category.name });
    }
    return options;
  }, [categories, faqs]);

  // The brow and PMU answers are written from ESTEQO's own service document,
  // so they are held in the app rather than the FAQ table.
  const items = group === 'brows' ? ESTEQO_FAQS : faqs?.[group] || [];

  return (
    <>
      <Seo
        title="Our Story & FAQ"
        description="ESTEQO was founded by Seema Nanda, Clinical Cosmetologist and Senior Brow Artist, in Sector 25, Noida. How we work, plus answers to the questions we are asked most."
        breadcrumbs={[{ name: 'Our Story', path: '/values' }]}
        schema={[founderSchema(), faqSchema(ESTEQO_FAQS)].filter(Boolean)}
      />

      {/* ---------------------------------------------------- Our story */}

      <section className="story-hero">
        <div className="container">
          <span className="eyebrow">Our story</span>
          <h1>
            ESTEQO was founded to make clinical skin care personal — treatments planned around you,
            not around a trend.
          </h1>
        </div>
      </section>

      <section className="story-intro">
        <div className="container story-intro__inner">
          <div className="story-intro__media">
            <Media
              src="/uploads/Seema/seema-nanda-1.jpg"
              alt={brand.founder_name}
              accent="light-blue"
              label={brand.founder_name}
            />
          </div>

          <div className="story-intro__card">
            <span className="eyebrow">A decade in…</span>
            <h2>Founded by {brand.founder_name}</h2>
            <p>
              {brand.founder_name} is a Clinical Cosmetologist and Senior Brow Artist with more than
              ten years of hands-on practice. She opened ESTEQO at Modi Mall, Sector 25, Noida to
              offer what she could not find nearby: medi-facials, dermaplaning, peels and laser
              treatments delivered under clinical supervision, with honest advice about how many
              sessions a result really takes.
            </p>
            <p>
              Brows are her signature. Every ombré brow, powder brow and microblading appointment
              is mapped to the face and carried out by Seema herself, with pigments chosen for how
              they settle and fade over time — not just how they look on day one. Over 500 Google
              reviews, rated 5.0, come from clients across Noida, Greater Noida, Ghaziabad and Delhi
              NCR who trusted her with their skin and brows.
            </p>
          </div>
        </div>
      </section>

      <section className="section story-belief">
        <div className="container story-belief__inner">
          <div>
            <span className="eyebrow">We believe that…</span>
            <h2>
              <em>Beauty is personal.</em> Every skin deserves tailored care.
            </h2>
            <p>
              Every service begins with a detailed skin consultation, so our specialists can
              recommend what your skin actually needs rather than what is most popular. If a
              treatment is not right for you, we will say so.
            </p>
            <p>
              We tell you how many sessions a result honestly takes. One appointment is a good day;
              a course is what changes skin. Add-ons are recommended when they will genuinely
              improve your result — never to lengthen the bill.
            </p>
            <div className="btn-row" style={{ marginTop: 28 }}>
              <Link to="/services" className="btn btn--secondary">
                Browse all treatments
              </Link>
            </div>
          </div>

          <ScrollSwapImage images={BELIEF_IMAGES} alt="Treatments at ESTEQO" />
        </div>
      </section>

      <PipelineStrip
        titleLead="Healthy skin takes work,"
        titleRest="but that's where we step in to make the journey worth it."
        text="Like the gym or a regular manicure, lasting results come from keeping it up. Short on time? Every appointment is built to be efficient without feeling rushed."
        stages={TREATMENT_STAGES}
      />

      <section className="section section--cream">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we offer</span>
            <h2>Four areas of care, one standard</h2>
          </div>
          <div className="values">
            {OFFERINGS.map((item, index) => (
              <div className="value" key={item.title}>
                <span className="value__num">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section story-visit">
        <div className="container">
          <div className="section-head section-head--center">
            <span className="eyebrow">Visit us</span>
            <h2>Sector 25, Noida</h2>
            <p className="lede">
              {contact.address_line1} {contact.address_line2}. {contact.hours}.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- FAQ */}

      <section className="section section--cream" id="faq">
        <div className="container container--narrow">
          <div className="section-head section-head--center">
            <span className="eyebrow">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>

          {loading && <Loading />}
          {error && <ErrorState error={error} onRetry={reload} />}

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

          {items.length > 0 ? (
            <Accordion key={group} items={items} defaultOpen={items[0]?.id} />
          ) : (
            !loading && <p className="muted">No questions in this section yet.</p>
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
