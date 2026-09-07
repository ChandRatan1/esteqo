import { Link } from 'react-router-dom';
import Media from './Media';
import SliderArrows from './SliderArrows';
import { useSlider } from '../hooks/useSlider';

/**
 * Horizontally sliding row of treatment cards, driven by the round arrow
 * buttons in the section header. Each card carries the photo, its duration,
 * the price line and a short description.
 */
export default function ServiceSlider({ title, text, ctaLabel, ctaTo, cards }) {
  const { trackRef, atStart, atEnd, sync, slide } = useSlider('.slider-card');

  return (
    <section className="slider-section">
      <div className="container slider-section__head">
        <div>
          <h2>{title}</h2>
          <SliderArrows
            onPrev={() => slide(-1)}
            onNext={() => slide(1)}
            atStart={atStart}
            atEnd={atEnd}
            label="treatments"
          />
        </div>

        <div className="slider-section__intro">
          <p>{text}</p>
          <Link to={ctaTo} className="btn-stacked">
            {ctaLabel}
          </Link>
        </div>
      </div>

      <div className="slider-track" ref={trackRef} onScroll={sync}>
        {cards.map((card) => (
          <article className={`slider-card accent-${card.accent}`} key={card.slug}>
            <div className="slider-card__media">
              <span className="slider-card__badge" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                  <path d={card.iconPath} stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>

              <Media src={card.image} alt={card.label} accent={card.accent} label={card.label} />

              {card.meta && (
                <span className="slider-card__pill">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" aria-hidden="true">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                  </svg>
                  {card.meta}
                </span>
              )}
            </div>

            <div className="slider-card__body">
              <h3 className="slider-card__title">
                {card.label}
                {card.price && <span className="slider-card__price">{card.price}</span>}
              </h3>
              {card.text && <p className="slider-card__text">{card.text}</p>}
              <Link to={card.to} className="slider-card__more">
                {card.linkLabel || 'Learn more'}
                <span className="slider-card__more-icon" aria-hidden="true">
                  <svg viewBox="0 0 20 12" width="14" height="9" fill="none">
                    <path d="M1 6h17M12 1l6 5-6 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
