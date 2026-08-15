import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import { useSite } from '../context/SiteContext';
import { CategoryCard, PostCard, ServiceCard } from '../components/Cards';
import { CtaBand, Marquee } from '../components/Sections';
import Media from '../components/Media';
import { CardSkeletons } from '../components/States';

const VALUES = [
  {
    num: '01',
    title: 'Analysis before treatment',
    text: 'Every service begins with a detailed skin consultation. We plan protocols after analysis — not around trends.',
  },
  {
    num: '02',
    title: 'Medical-grade technology',
    text: 'Hydra-dermabrasion, carbon laser, meso needling and medical-grade hair reduction, delivered by trained specialists.',
  },
  {
    num: '03',
    title: 'Honest timelines',
    text: 'We tell you how many sessions a result actually takes, and what a single appointment can and cannot do.',
  },
  {
    num: '04',
    title: 'Comfort throughout',
    text: 'Patch tests where needed, cooling technology, and gentle formulas chosen for your skin type.',
  },
];

export default function Home() {
  const { brand, contact } = useSite();
  usePageMeta(
    null,
    'Clinically planned skin, brow and laser treatments in Sector 25, Noida. Medi-facials, PMU brows, laser hair reduction and body care by Seema Nanda.'
  );

  const { data: categories, loading: categoriesLoading } = useApi((opts) => api.getCategories(opts), []);
  const { data: featured } = useApi((opts) => api.getServices({ featured: 'true' }, opts), []);
  const { data: testimonials } = useApi((opts) => api.getTestimonials(opts), []);
  const { data: posts } = useApi((opts) => api.getPosts({ limit: 3 }, opts), []);

  const totalTreatments = (categories || []).reduce((sum, c) => sum + (c.serviceCount || 0), 0);

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <div className="hero__body">
          <div className="hero__inner">
            <span className="eyebrow">Noida · Sector 25</span>
            <h1 className="hero__title">
              Skin. Brows. Lasers. <em>Done with precision.</em>
            </h1>
            <p className="lede hero__text">{brand.hero_subtitle}</p>
            <div className="btn-row">
              <Link to="/appointment" className="btn btn--primary">
                Book an appointment
              </Link>
              <Link to="/services" className="btn btn--secondary">
                View treatments
              </Link>
            </div>

            <div className="hero__stats">
              <div className="hero__stat">
                <strong>10+</strong>
                <span>Years of experience</span>
              </div>
              <div className="hero__stat">
                <strong>{totalTreatments}</strong>
                <span>Treatments on the menu</span>
              </div>
              <div className="hero__stat">
                <strong>{categories?.length || 8}</strong>
                <span>Specialist departments</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero__media">
          <Media accent="sand" label="Esteqo" alt="ESTEQO clinic" />
        </div>
      </section>

      <Marquee
        items={[
          'Medi-Facials',
          'Hydra Facial',
          'Carbon Laser Facial',
          'Korean PDRN Glowlift',
          'Body Bleach & Polish',
          'Threading & Waxing',
          'Relaxing Massages',
        ]}
      />

      {/* Categories */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">What we do</span>
            <h2>Treatments planned around your skin, not a menu</h2>
            <hr className="rule" />
            <p className="lede">
              From advanced medi-facials and laser work to threading, body care and massage — every
              department led by a specialist, and every treatment starting with a consultation.
            </p>
          </div>

          {categoriesLoading ? (
            <CardSkeletons count={4} />
          ) : (
            <div className="grid grid--4">
              {(categories || []).map((category) => (
                <CategoryCard key={category.slug} category={category} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Founder */}
      <section className="section section--cream">
        <div className="container">
          <div className="feature">
            <div>
              <span className="eyebrow">Led by {brand.founder_name}</span>
              <h2>Beauty is personal — every skin deserves tailored care</h2>
              <hr className="rule" />
              <p className="lede">
                Founded by {brand.founder_name}, ESTEQO blends advanced dermatological science with
                the artistry of beauty — a space where innovation meets indulgence, with results that
                go beyond the surface.
              </p>
              <p>
                With over a decade of hands-on experience, {brand.founder_name} personally leads our
                brow department, where precision PMU is designed around facial balance and pigment
                stability.
              </p>
              <div className="btn-row" style={{ marginTop: 28 }}>
                <Link to="/about" className="btn btn--secondary">
                  About the clinic
                </Link>
              </div>
            </div>
            <div className="feature__media">
              <Media accent="light-brown" label={brand.founder_name} alt={brand.founder_name} variant="tall" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured treatments */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Signature treatments</span>
            <h2>Where most people start</h2>
            <hr className="rule" />
          </div>

          {featured ? (
            <div className="grid grid--4">
              {featured.map((service) => (
                <ServiceCard key={service.slug} service={service} showCategory />
              ))}
            </div>
          ) : (
            <CardSkeletons count={4} />
          )}

          <div className="btn-row" style={{ marginTop: 'var(--module-spacing-medium)' }}>
            <Link to="/services" className="btn btn--secondary">
              See all treatments
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--sand">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">How we work</span>
            <h2>Clinical planning, not guesswork</h2>
          </div>
          <div className="values">
            {VALUES.map((value) => (
              <div className="value" key={value.num}>
                <span className="value__num">{value.num}</span>
                <h3>{value.title}</h3>
                <p>{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials?.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">In their words</span>
              <h2>What our clients say</h2>
            </div>
          </div>
          <div className="container">
            <div className="testimonials">
              {testimonials.map((item) => (
                <figure className="testimonial" key={item.id}>
                  <div className="testimonial__stars" aria-label={`${item.rating} out of 5`}>
                    {'★'.repeat(item.rating)}
                  </div>
                  <blockquote className="testimonial__quote">“{item.quote}”</blockquote>
                  <figcaption className="testimonial__meta">
                    <strong>{item.author}</strong>
                    {item.treatment}
                    {item.location ? ` · ${item.location}` : ''}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog */}
      {posts?.length > 0 && (
        <section className="section section--cream">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">From the journal</span>
              <h2>Treatment guides and skin science</h2>
            </div>
            <div className="grid grid--3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="btn-row" style={{ marginTop: 'var(--module-spacing-medium)' }}>
              <Link to="/blog" className="btn btn--secondary">
                Read the blog
              </Link>
            </div>
          </div>
        </section>
      )}

      <CtaBand
        title="Book your consultation"
        text={`Call ${contact.phone} or book online. ${contact.hours_weekday}.`}
      />
    </>
  );
}
