import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Media from './Media';
import { googleRating } from '../data/site';

const AUTO_ADVANCE_MS = 6000;
const SWIPE_THRESHOLD_PX = 48;

/**
 * Home page hero, styled after the Silver Mirror banner: a flat pale-blue
 * panel (#d4eaff sampled from silvermirror.com), a large sans headline and
 * short subtitle on the left, an outlined "BOOK NOW" pill, and the photo
 * blended into the panel colour on the right.
 *
 * Slides sit side by side on one track that slides horizontally, auto-advances,
 * pauses while hovered, and answers to swipes and the dots underneath.
 */
export default function HeroCarousel({ slides }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);

  useEffect(() => {
    if (slides.length <= 1 || paused) return undefined;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length, paused]);

  const go = (index) => setActive((index + slides.length) % slides.length);

  const onTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < SWIPE_THRESHOLD_PX) return;
    go(delta < 0 ? active + 1 : active - 1);
  };

  return (
    <section
      className="hero hero--carousel accent-light-blue"
      aria-roledescription="carousel"
      aria-label="Featured treatments"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero__track" style={{ transform: `translateX(-${active * 100}%)` }}>
        {slides.map((slide, index) => (
          <article
            className="hero__slide"
            key={slide.serviceSlug || slide.title}
            aria-hidden={index !== active}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${slides.length}`}
          >
            <div className="hero__body">
              <div className="hero__inner">
                {index === 0 ? (
                  <h1 className="hero__title">{slide.title}</h1>
                ) : (
                  <h2 className="hero__title">{slide.title}</h2>
                )}
                <p className="hero__text">{slide.text}</p>
                <Link
                  to={`/appointment?service=${slide.serviceSlug || ''}`}
                  className="btn btn--pill-outline hero__cta"
                  tabIndex={index === active ? 0 : -1}
                >
                  Book Now
                </Link>

                <a
                  className="hero__rating"
                  href={googleRating.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  tabIndex={index === active ? 0 : -1}
                  aria-label={`Rated ${googleRating.rating} on Google from ${googleRating.count} reviews`}
                >
                  <span className="hero__rating-stars" aria-hidden="true">★★★★★</span>
                  <strong>{googleRating.rating}</strong>
                  <span>{googleRating.count} Google reviews</span>
                </a>
              </div>
            </div>

            <div className="hero__media" style={{ '--hero-focus': slide.focus || 'center' }}>
              <Media src={slide.image} accent="light-blue" label="ESTEQO" alt={slide.title} />
            </div>
          </article>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="hero__dots" role="tablist" aria-label="Hero slides">
          {slides.map((item, index) => (
            <button
              key={item.serviceSlug || item.title}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show slide ${index + 1}: ${item.title}`}
              className={`hero__dot${index === active ? ' hero__dot--active' : ''}`}
              onClick={() => go(index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
