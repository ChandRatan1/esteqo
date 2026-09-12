import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Media from './Media';
import SliderArrows from './SliderArrows';

const SWIPE_THRESHOLD = 50; // px of horizontal drag before it counts as a swipe
const SLIDE_MS = 450; // must match the transform transition in pages.css

/**
 * Looping row of treatment cards.
 *
 * The same cards cycle round for ever — step past the last one and the first
 * comes back around, so the row only ever shows these treatments and they
 * simply trade places.
 *
 * The set is rendered three times and the track parks on the middle copy, so
 * there is always a full set of runway on both sides — going backwards never
 * runs into empty space. Sliding moves one card at a time; once a whole set
 * has gone past, the track jumps back to the middle with the transition
 * switched off, which is invisible because the copy sitting there is identical.
 *
 * Dragging or swiping horizontally moves it too, not just the arrows.
 */
export default function ServiceSlider({ title, text, ctaLabel, ctaTo, cards }) {
  const count = cards.length;
  // Start on the middle copy of the set.
  const [index, setIndex] = useState(count);
  const [animate, setAnimate] = useState(true);
  const [step, setStep] = useState(0);
  const trackRef = useRef(null);
  const drag = useRef(null);
  // Ignores input while a slide is still running, so the index can never run
  // past the rendered sets and leave the track translated into empty space.
  const sliding = useRef(false);

  // Measure one card plus its gap, so a step always lands cleanly.
  useLayoutEffect(() => {
    const measure = () => {
      const card = trackRef.current?.querySelector('.slider-card');
      if (!card) return;
      const gap = parseFloat(getComputedStyle(trackRef.current).columnGap || '24') || 24;
      setStep(card.offsetWidth + gap);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Once a whole set has gone past, drop back onto the matching card in the
  // middle copy without animating — what you see does not change. The bounds
  // test is a range and the reset is a modulo, so however far the index has
  // drifted it always comes home; an equality test stopped matching as soon as
  // a fast click overshot, which left the track stranded off the end.
  useEffect(() => {
    if (!count || (index >= count && index < count * 2)) return undefined;
    const timer = setTimeout(() => {
      setAnimate(false);
      setIndex((i) => count + ((((i - count) % count) + count) % count));
    }, SLIDE_MS);
    return () => clearTimeout(timer);
  }, [index, count]);

  // Re-enable animation on the frame after a silent jump.
  useEffect(() => {
    if (animate) return undefined;
    const frame = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(frame);
  }, [animate]);

  const move = useCallback((direction) => {
    if (sliding.current) return;
    sliding.current = true;
    setIndex((i) => i + direction);
    // A timer rather than transitionend: with reduced motion there is no
    // transition to listen for, and the lock would never release.
    setTimeout(() => {
      sliding.current = false;
    }, SLIDE_MS);
  }, []);

  const onPointerDown = (event) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    drag.current = { x: event.clientX, moved: false };
  };

  const onPointerUp = (event) => {
    const start = drag.current;
    drag.current = null;
    if (!start) return;
    const delta = event.clientX - start.x;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    move(delta < 0 ? 1 : -1);
  };

  const loop = [...cards, ...cards, ...cards];

  return (
    <section className="slider-section">
      <div className="container slider-section__head">
        <div>
          <h2>{title}</h2>
          <SliderArrows
            onPrev={() => move(-1)}
            onNext={() => move(1)}
            atStart={false}
            atEnd={false}
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

      <div
        className="slider-viewport"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          drag.current = null;
        }}
      >
        <div
          className={`slider-track${animate ? '' : ' slider-track--instant'}`}
          ref={trackRef}
          style={{ transform: `translateX(${-index * step}px)` }}
        >
          {loop.map((card, i) => (
            <article
              className={`slider-card accent-${card.accent}`}
              key={`${card.slug}-${i}`}
              aria-hidden={i < count || i >= count * 2 ? 'true' : undefined}
            >
              <div className="slider-card__media" style={{ '--card-focus': card.focus || 'center' }}>
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
                <Link to={card.to} className="slider-card__more" draggable={false}>
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
      </div>
    </section>
  );
}
