import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useApi, usePageMeta } from '../hooks/useApi';
import { useSite } from '../context/SiteContext';
import { PostCard } from '../components/Cards';
import { CtaBand, Marquee } from '../components/Sections';
import Media from '../components/Media';
import Seo from '../seo/Seo';
import HeroCarousel from '../components/HeroCarousel';
import ServiceSlider from '../components/ServiceSlider';
import ReviewSlider from '../components/ReviewSlider';
import SkinQuiz from '../components/SkinQuiz';

const HERO_SLIDES = [
  {
    eyebrow: 'Signature facial',
    title: 'Lift. Define. Glow.',
    text: 'A 90-minute facial designed to firm and refresh the skin, while enhancing the natural contours of your face for a visibly lifted, sculpted look.',
    serviceSlug: 'premier-contour-facial',
    image: '/uploads/facial/premier_contour_facial.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Brows by Seema',
    title: 'Brows that define your look.',
    text: 'Wake up to naturally shaped, fuller-looking brows every day. Our semi-permanent brow service is tailored to your face, creating a balanced and polished look that lasts.',
    serviceSlug: 'hd-brows',
    image: '/uploads/brows/microblading.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Bridal & groom',
    title: 'The Ultimate Wedding Glow-Up for Brides & Grooms',
    text: 'Give yourself the beauty preparation you deserve before your big day. Our personalised wedding treatments help refresh, refine and enhance your look — from radiant, glowing skin to perfectly groomed details — so you can walk down the aisle feeling confident, polished and picture-perfect.',
    serviceSlug: 'bridal-radiance-90-days',
    image: '/uploads/bridal/bridal-radiance-90-days.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Advanced facials',
    title: 'Brighter, clearer, smoother skin',
    text: 'Treat sun-damaged skin, pigmentation and the signs of ageing with our advanced peel and resurfacing protocols.',
    serviceSlug: 'carbon-laser-facial',
    image: '/uploads/advanced-facials/carbon-laser-facial.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Laser hair reduction',
    title: 'Skip the Shave, Stay Smooth',
    text: 'Say goodbye to constant shaving and hello to smooth, hair-free skin. Our professional hair-reduction services are designed to leave your skin feeling soft, clean and beautifully smooth — so you can enjoy confidence that lasts.',
    serviceSlug: 'full-legs-laser',
    image: '/uploads/body-waxing/full-legs.jpg',
    accent: 'light-blue',
  },
];

const SKIN_CARE_CARDS = [
  {
    slug: 'facials',
    label: 'Facials',
    meta: '30–90 minute',
    text: 'From a 30-minute reset to a 90-minute deep-contouring session. Every facial starts with a skin analysis, so the treatment matches what your skin needs that day.',
    to: '/services',
    accent: 'light-blue',
    image: '/uploads/facial/signature_facial.jpg',
    iconPath: 'M12 3.5c.7 2.6 2.4 4.3 5 5-2.6.7-4.3 2.4-5 5-.7-2.6-2.4-4.3-5-5 2.6-.7 4.3-2.4 5-5z',
  },
  {
    slug: 'brows',
    label: 'Brows',
    meta: '20 minute',
    text: 'Precision mapping, tinting, lamination and semi-permanent artistry. We map your ideal shape around your facial structure, not around trends.',
    to: '/services/menu/brows',
    accent: 'light-blue',
    image: '/uploads/brows/brow_shape.jpg',
    iconPath: 'M3 15c2-4 6-6 9-6s7 2 9 6',
  },
  {
    slug: 'laser',
    label: 'Laser',
    meta: '15–90 minute',
    text: 'Medical-grade laser hair reduction, calibrated to your skin tone and hair type. Most areas need six to eight sessions for up to 90% less regrowth.',
    to: '/services/lasers',
    accent: 'light-blue',
    image: '/uploads/body-waxing/full-legs.jpg',
    iconPath: 'M13 2L4 14h6l-1 8 9-12h-6l1-8z',
  },
];

/** The three proof points below the "Expert Care" heading. */
const EXPERT_CARE_CARDS = [
  { label: 'Expert-driven', image: '/uploads/facial/hyperpigmentation_facial.jpg' },
  { label: 'For every skin type', image: '/uploads/facial/sensitive_skin_facial.jpg' },
  { label: 'Schedule friendly', image: '/uploads/facial/signature_facial.jpg' },
];

/**
 * Client reviews, carried over from ESTEQO's own previous site.
 *
 * These are genuine ESTEQO testimonials rather than the placeholder set in
 * src/data/site.js. Pulling live Google reviews needs a Places API key and the
 * clinic's Place ID — see the note in the README before wiring that up.
 */
const REVIEWS = [
  {
    id: 1,
    author: 'Aditi S.',
    treatment: 'Hydra Facial',
    rating: 5,
    quote:
      'ESTEQO is my go-to place for facials and brows. Seema is truly a magician when it comes to understanding skin. My Hydra Facial results were amazing — I walked out glowing.',
  },
  {
    id: 2,
    author: 'Ritika M.',
    treatment: 'Korean PDRN Glowlift',
    rating: 5,
    quote:
      'I tried the Korean PDRN Glowlift for the first time, and my skin has never looked this hydrated and firm. The ambiance, hygiene and attention to detail are unmatched.',
  },
  {
    id: 3,
    author: 'Neha K.',
    treatment: 'Brow Shape',
    rating: 5,
    quote:
      "I got my brows done by Seema and I can't stop getting compliments. The shape is perfect and looks so natural. I finally found someone who understands symmetry.",
  },
  {
    id: 4,
    author: 'Priya R.',
    treatment: 'Carbon Laser Facial',
    rating: 5,
    quote:
      'ESTEQO blends luxury and science beautifully. The Carbon Laser Facial reduced my pigmentation drastically in just a few sessions. Highly recommend for anyone serious about skin care.',
  },
];

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

  const { data: categories } = useApi((opts) => api.getCategories(opts), []);
  const { data: posts } = useApi((opts) => api.getPosts({ limit: 3 }, opts), []);

  const totalTreatments = (categories || []).reduce((sum, c) => sum + (c.serviceCount || 0), 0);

  const [quizOpen, setQuizOpen] = useState(false);

  return (
    <>
      <Seo
        description="Clinically planned skin, brow and laser treatments in Sector 25, Noida. Hydra facials, carbon laser, peels, body polish, threading, waxing and massages."
      />

      {/* Hero */}
      <HeroCarousel slides={HERO_SLIDES} stats={[
        { value: '10+', label: 'Years of experience' },
        { value: totalTreatments, label: 'Treatments on the menu' },
        { value: categories?.length || 8, label: 'Specialist departments' },
      ]} />

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

      {/* Smarter skincare */}
      <ServiceSlider
        title="Smarter skincare for your busy life"
        text="Get the skin you want with quick, effective treatments that fit around your schedule. Choose from a menu built to deliver real results without the wait, bringing out your natural glow."
        ctaLabel="View all services"
        ctaTo="/services"
        cards={SKIN_CARE_CARDS}
      />

      {/* Skin quiz */}
      <section className="quiz-banner">
        <div className="quiz-banner__text">
          <span className="quiz-banner__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M12 3.5c.7 2.6 2.4 4.3 5 5-2.6.7-4.3 2.4-5 5-.7-2.6-2.4-4.3-5-5 2.6-.7 4.3-2.4 5-5z"
                fill="#fff"
              />
            </svg>
          </span>
          <span className="eyebrow">Made just for your skin</span>
          <h2>Not Sure Where to Begin? Take Our Quiz to Find Your Perfect Facial</h2>
          <button type="button" className="quiz-banner__link" onClick={() => setQuizOpen(true)}>
            Take the facial quiz
            <span className="quiz-banner__arrow">
              <svg viewBox="0 0 20 12" width="16" height="10" fill="none">
                <path d="M1 6h17M12 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>

        <div className="quiz-banner__media">
          <Media src="/uploads/facial/facialfront.jfif" alt="ESTEQO facial" accent="light-blue" label="ESTEQO" />
        </div>

        {/* Sits outside the photo panel: that panel clips its own rounded
            corners, which would slice this circle in half. */}
        <button type="button" className="quiz-banner__badge" onClick={() => setQuizOpen(true)}>
          <svg viewBox="0 0 120 120" className="quiz-banner__badge-text" aria-hidden="true">
            <path id="quizBadgeCircle" fill="none" d="M60,10 a50,50 0 1,1 -0.1,0" />
            <text>
              <textPath href="#quizBadgeCircle" startOffset="0%">
                TAKE OUR QUIZ — WHICH FACIAL SUITS YOU? —
              </textPath>
            </text>
          </svg>
          <svg viewBox="0 0 20 12" width="18" height="11" fill="none" className="quiz-banner__badge-arrow">
            <path d="M1 6h17M12 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </section>

      {quizOpen && <SkinQuiz onClose={() => setQuizOpen(false)} />}

      {/* Expert care */}
      <section className="section expert-care">
        <div className="container">
          <div className="expert-care__head">
            <h2>Expert Care. Visible Results. Glowing Confidence.</h2>
            <p className="lede">
              Skincare tailored just for you. Using advanced technology and pioneering esthetic
              techniques, our 30, 50 and 90-minute treatments deliver real results. Let our skilled
              therapists focus on your unique skin needs and guide you towards the skin you've
              always wanted.
            </p>
          </div>

          <div className="expert-care__grid">
            {EXPERT_CARE_CARDS.map((card) => (
              <figure className="expert-card" key={card.label}>
                <figcaption className="expert-card__label">{card.label}</figcaption>
                <Media src={card.image} alt={card.label} accent="light-blue" label={card.label} />
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Client reviews */}
      <ReviewSlider
        title="Our Guests' Results Speak for Themselves"
        reviews={REVIEWS}
        footnote="Reviews from ESTEQO clients in Sector 25, Noida."
      />

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
                <Link to="/values" className="btn btn--secondary">
                  Our story
                </Link>
              </div>
            </div>
            <div className="feature__media">
              <Media accent="light-brown" label={brand.founder_name} alt={brand.founder_name} variant="tall" />
            </div>
          </div>
        </div>
      </section>

      {/* New to ESTEQO */}
      <section className="section new-here">
        <div className="container">
          <div className="section-head section-head--center">
            <h2>New to ESTEQO?</h2>
            <p className="lede">
              Every visit starts with a consultation, so your treatment is planned around your skin
              rather than a fixed menu. These three are where most people begin.
            </p>
          </div>

          <div className="grid grid--3">
            {SKIN_CARE_CARDS.map((card) => (
              <Link to={card.to} key={card.slug} className="new-here__card">
                <div className="new-here__media">
                  <Media src={card.image} alt={card.label} accent={card.accent} label={card.label} />
                  <span className="new-here__badge" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path d={card.iconPath} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
                <h3>{card.label}</h3>
                <p>{card.text}</p>
              </Link>
            ))}
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
