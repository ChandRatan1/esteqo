import { Link, useOutletContext } from 'react-router-dom';
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

const HERO_SLIDES = [
  {
    eyebrow: 'Signature facial',
    title: 'Lift. Define. Glow.',
    text: 'A 90-minute facial designed to firm and refresh the skin, while enhancing the natural contours of your face for a visibly lifted, sculpted look.',
    serviceSlug: 'premier-contour-facial',
    focus: 'center',
    image: '/uploads/facial/premier_contour_facial.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Brows by Seema',
    title: 'Brows that define your look.',
    text: 'Wake up to naturally shaped, fuller-looking brows every day. Our semi-permanent brow service is tailored to your face, creating a balanced and polished look that lasts.',
    serviceSlug: 'hd-brows',
    focus: 'center 30%',
    image: '/uploads/brows/brow-hero.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Bridal & groom',
    title: 'The Ultimate Wedding Glow-Up for Brides & Grooms',
    text: 'Give yourself the beauty preparation you deserve before your big day. Our personalised wedding treatments help refresh, refine and enhance your look — from radiant, glowing skin to perfectly groomed details — so you can walk down the aisle feeling confident, polished and picture-perfect.',
    serviceSlug: 'bridal-radiance-90-days',
    focus: 'center 25%',
    image: '/uploads/bridal/bridal-radiance-90-days.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Advanced facials',
    title: 'Brighter, clearer, smoother skin',
    text: 'Treat sun-damaged skin, pigmentation and the signs of ageing with our advanced peel and resurfacing protocols.',
    serviceSlug: 'carbon-laser-facial',
    focus: 'center 30%',
    image: '/uploads/advanced-facials/carbon-laser-facial.jpg',
    accent: 'light-blue',
  },
  {
    eyebrow: 'Laser hair reduction',
    title: 'Skip the Shave, Stay Smooth',
    text: 'Say goodbye to constant shaving and hello to smooth, hair-free skin. Our professional hair-reduction services are designed to leave your skin feeling soft, clean and beautifully smooth — so you can enjoy confidence that lasts.',
    serviceSlug: 'full-legs-laser',
    focus: 'center',
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
    focus: 'center 20%',
    iconPath: 'M12 3.5c.7 2.6 2.4 4.3 5 5-2.6.7-4.3 2.4-5 5-.7-2.6-2.4-4.3-5-5 2.6-.7 4.3-2.4 5-5z',
  },
  {
    slug: 'brows',
    label: 'Brows',
    meta: '20 minute',
    text: 'Precision mapping, tinting, lamination and semi-permanent artistry. We map your ideal shape around your facial structure, not around trends.',
    to: '/services/menu/brows',
    accent: 'light-blue',
    image: '/uploads/brows/brow-hero.jpg',
    focus: 'center 30%',
    iconPath: 'M3 15c2-4 6-6 9-6s7 2 9 6',
  },
  {
    slug: 'laser',
    label: 'Laser',
    meta: '15–90 minute',
    text: 'Medical-grade laser hair reduction, calibrated to your skin tone and hair type. Most areas need six to eight sessions for up to 90% less regrowth.',
    to: '/services/lasers',
    accent: 'light-blue',
    image: '/uploads/advanced-facials/carbon-laser-facial.jpg',
    focus: 'center 28%',
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
 * Client reviews from ESTEQO's Google Business Profile (5.0 from 501 reviews,
 * https://maps.google.com/?cid=185292525259873671), copied on 12 Sep 2026.
 * Names are shown exactly as the reviewers appear on Google. Some quotes are
 * the preview Google shows before "More" — the sentence is cut where Google
 * cut it. To refresh, paste new reviews here; nothing else needs changing.
 */
const GOOGLE_REVIEWS_URL = 'https://maps.google.com/?cid=185292525259873671';

const REVIEWS = [
  {
    id: 1,
    author: 'Tanisha Awasthi',
    treatment: 'Ombré Brows',
    rating: 5,
    quote:
      "I recently got my Ombré Brows done by Seema Nanda, and I couldn't be happier with the results. Seema is a highly skilled Senior Brow Artist who truly understands facial features and brow design.",
  },
  {
    id: 2,
    author: 'Sneha Diaries',
    treatment: 'Laser Hair Reduction',
    rating: 5,
    quote:
      "Had a great experience with laser hair reduction at Seema Nanda's clinic. I have taken 4 to 5 sessions. The service was professional, hygienic, and effective. I'm already seeing visible results. Highly recommend her for laser hair removal, skincare treatments, and cosmetology services in Noida.",
  },
  {
    id: 3,
    author: 'Nidhi Dadheech',
    treatment: 'Permanent Brows, HydraFacial & Dermaplaning',
    rating: 5,
    quote:
      "Absolutely loved my permanent eyebrows, Hydrafacial, and dermaplaning treatment with Seema Nanda. She is knowledgeable, skilled, and makes you feel comfortable throughout the process. If you're looking for the best Hydrafacial and permanent makeup services in Noida, I highly recommend her.",
  },
  {
    id: 4,
    author: 'Riya Maurya',
    treatment: 'Pre-Bridal Package',
    rating: 5,
    quote:
      "Got my pre-bridal treatment hydra facial, body polish, permanent eyebrows and laser hair reduction done at Esteqo and honestly didn't expect to feel this good about my skin before the wedding. Seema ma'am really understood what I needed. My skin looked so calm and glowy on the day. No filter needed. Would recommend to every bride.",
  },
  {
    id: 5,
    author: 'Sanjana Saxena',
    treatment: 'Hydra Clean Up',
    rating: 5,
    quote:
      'Seema is incredibly professional and suggested me all the right treatments focussing on my needs and not a higher charge. I really appreciated that. I had a hydra clean up done too, which was an amazing experience.',
  },
  {
    id: 6,
    author: 'Deependrakumar Deep',
    treatment: 'Laser Hair Reduction',
    rating: 5,
    quote:
      'I had a wonderful experience at esteqo by Seema nanda. I like how it is clean and everything is done with maintaining hygiene. The sessions were smooth and I can already see noticeable results. I highly recommend laser by Seema Nanda to anyone looking for safe and effective laser treatments in Noida NCR.',
  },
  {
    id: 7,
    author: 'Vandana Pandey',
    treatment: 'Hydra Facial',
    rating: 5,
    quote:
      'Had a really good experience at Esteqo. The hydra facial was very relaxing and the staff was polite and professional. My skin feels fresh, soft, and glowing after the treatment. They maintained hygiene properly and made the whole experience comfortable. Definitely worth it.',
  },
  {
    id: 8,
    author: 'Agsyy466',
    treatment: 'Microneedling',
    rating: 5,
    quote:
      "Got microneedling done by Seema Nanda and I'm genuinely impressed with the results. My skin feels firmer, smoother, and much more refined. The treatment was tailored to my skin concerns and carried out with great care. Highly recommend for microneedling, collagen induction therapy, and skin renewal treatments in Noida.",
  },
  {
    id: 9,
    author: 'Shreya Sachan',
    treatment: 'Hydra Facial & Laser Hair Reduction',
    rating: 5,
    quote:
      'I had a great experience at Esteqo The Facial Brow and Laser Bar. I visited for a Hydra Facial in Noida NCR and laser hair reduction in Noida NCR, and the results were excellent. The Hydra Facial gave my skin instant glow and deep cleansing.',
  },
  {
    id: 10,
    author: 'Sumit Kumar',
    treatment: 'Nano Microblading',
    rating: 5,
    quote:
      'I got nano microblading done by Seema Nanda and I felt very comfortable throughout. She was very patient and extremely careful with every step.',
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

  const { data: posts } = useApi((opts) => api.getPosts({ limit: 3 }, opts), []);


  const { openQuiz } = useOutletContext();

  return (
    <>
      <Seo
        description="Clinically planned skin, brow and laser treatments in Sector 25, Noida. Hydra facials, carbon laser, peels, body polish, threading, waxing and massages."
      />

      {/* Hero */}
      <HeroCarousel slides={HERO_SLIDES} />

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
          <button type="button" className="quiz-banner__link" onClick={openQuiz}>
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
        <button type="button" className="quiz-banner__badge" onClick={openQuiz}>
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
        footnote="Google reviews of ESTEQO, Sector 25, Noida — rated 5.0 from 501 reviews."
        footnoteHref={GOOGLE_REVIEWS_URL}
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
                <div className="new-here__media" style={{ '--card-focus': card.focus || 'center' }}>
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
        text={`Call ${contact.phone} or book online. ${contact.hours}.`}
      />
    </>
  );
}
