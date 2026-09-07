import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Media from './Media';

const AUTO_ADVANCE_MS = 6000;

/**
 * Home page hero: a rotating set of slides (one per department highlight),
 * each with its own photo, headline and call to action. Auto-advances, with
 * dot navigation so a visitor can jump straight to what they came for.
 */
export default function HeroCarousel({ slides, stats }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[active];

  return (
    <section className={`hero hero--carousel accent-${slide.accent}`}>
      <div className="hero__body">
        <div className="hero__inner">
          <span className="eyebrow">{slide.eyebrow}</span>
          <h1 className="hero__title">{slide.title}</h1>
          <p className="lede hero__text">{slide.text}</p>
          <div className="btn-row">
            <Link to={`/appointment?service=${slide.serviceSlug || ''}`} className="btn btn--pill">
              Book Now
            </Link>
          </div>

          {stats?.length > 0 && (
            <div className="hero__stats">
              {stats.map((stat) => (
                <div className="hero__stat" key={stat.label}>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hero__media">
        <Media src={slide.image} accent={slide.accent} label="ESTEQO" alt={slide.title} />

        {slides.length > 1 && (
          <div className="hero__dots" role="tablist" aria-label="Hero slides">
            {slides.map((item, index) => (
              <button
                key={item.eyebrow}
                type="button"
                role="tab"
                aria-selected={index === active}
                aria-label={`Show slide: ${item.eyebrow}`}
                className={`hero__dot${index === active ? ' hero__dot--active' : ''}`}
                onClick={() => setActive(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
