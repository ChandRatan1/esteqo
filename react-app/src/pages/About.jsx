import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import { useSite } from '../context/SiteContext';
import { TeamCard } from '../components/Cards';
import { CtaBand, PageHero } from '../components/Sections';
import Media from '../components/Media';

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

export default function About() {
  const { brand, contact } = useSite();
  const { data: team } = useApi((opts) => api.getTeam(opts), []);

  usePageMeta(
    'About',
    'ESTEQO blends advanced dermatological science with the artistry of beauty. Founded by Seema Nanda in Sector 25, Noida.'
  );

  return (
    <>
      <PageHero
        eyebrow="About ESTEQO"
        title="Where innovation meets indulgence"
        text="At ESTEQO, we believe every individual deserves to look and feel their absolute best."
        accent="light-brown"
      />

      <section className="section">
        <div className="container">
          <div className="feature">
            <div>
              <span className="eyebrow">Our story</span>
              <h2>Founded by {brand.founder_name}</h2>
              <hr className="rule" />
              <p className="lede">
                Our clinic blends advanced dermatological science with the artistry of beauty — a
                space where innovation meets indulgence, ensuring results that go beyond the surface.
              </p>
              <p>
                At ESTEQO, we believe beauty is personal: every skin deserves tailored care. That is
                why every service begins with a detailed skin consultation, allowing our specialists
                to understand your needs and recommend the best solution rather than the most popular
                one.
              </p>
              <p>
                {brand.founder_name} brings over a decade of hands-on experience and personally leads
                the brow department, where precision PMU is designed around facial balance and
                pigment stability.
              </p>
            </div>
            <div className="feature__media">
              <Media accent="light-brown" label={brand.founder_name} alt={brand.founder_name} variant="tall" />
            </div>
          </div>
        </div>
      </section>

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
          <div className="btn-row" style={{ marginTop: 'var(--module-spacing-medium)' }}>
            <Link to="/services" className="btn btn--secondary">
              Browse all treatments
            </Link>
          </div>
        </div>
      </section>

      {team?.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">The team</span>
              <h2>Specialists, not generalists</h2>
              <hr className="rule" />
              <p className="lede">
                Each department is led by someone who does that work every day — which is why the
                consultation matters as much as the treatment.
              </p>
            </div>
            <div className="grid grid--4">
              {team.map((member) => (
                <TeamCard key={member.slug} member={member} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--sand">
        <div className="container">
          <div className="feature feature--flip">
            <div>
              <span className="eyebrow">Visit us</span>
              <h2>Sector 25, Noida</h2>
              <hr className="rule" />
              <p className="lede">
                {contact.address_line1}
                <br />
                {contact.address_line2}
              </p>
              <p>
                {contact.hours_weekday}
                <br />
                {contact.hours_sunday}
              </p>
              <div className="btn-row" style={{ marginTop: 28 }}>
                <Link to="/contact" className="btn btn--secondary">
                  Directions &amp; contact
                </Link>
              </div>
            </div>
            <div className="feature__media">
              <Media accent="cream" label="Clinic" alt="ESTEQO clinic" variant="square" />
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
