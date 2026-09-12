import { useEffect, useRef, useState } from 'react';
import SliderArrows from './SliderArrows';

/** How fast the row drifts on its own, in pixels per second. */
const SPEED_PX_PER_S = 28;
/** Must match the flex gap on .review-track in pages.css. */
const GAP_PX = 24;

function Stars({ rating = 5 }) {
  return (
    <span className="review-card__stars" aria-label={`${rating} out of 5`}>
      {Array.from({ length: rating }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" width="21" height="21" aria-hidden="true">
          <path
            d="M12 2.6l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.5 6.1 20.6l1.2-6.5L2.5 9.5l6.6-.9z"
            fill="currentColor"
          />
        </svg>
      ))}
    </span>
  );
}

function ReviewBody({ review }) {
  return (
    <>
      <Stars rating={review.rating} />
      <blockquote className="review-card__quote">&ldquo;{review.quote}&rdquo;</blockquote>
      <figcaption className="review-card__author">
        {review.author}
        {review.treatment && <span>{review.treatment}</span>}
      </figcaption>
    </>
  );
}

/**
 * "Our guests' results" — client reviews on a row that slides on its own,
 * the same continuous motion as the treatment images above it.
 *
 * The list is rendered twice back to back and the track is translated left
 * every frame; once a full copy has passed, the offset wraps, so the loop
 * never runs out. Hovering (or focusing) any card stops the row and opens
 * that review in a floating panel with its full text; moving the cursor
 * away closes it and the row moves again. The arrows nudge the row one
 * card at a time and keep working while it is paused.
 */
export default function ReviewSlider({ title, reviews, footnote, footnoteHref }) {
  const trackRef = useRef(null);
  const offsetRef = useRef(0); // how far the track has moved left, in px
  const pendingRef = useRef(0); // arrow nudge still to be eased through
  const pausedRef = useRef(false);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || !reviews?.length) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frame = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(now - last, 64);
      last = now;

      // The track holds two copies, so one copy is half its layout width.
      const loop = track.offsetWidth / 2;
      let offset = offsetRef.current;

      if (!pausedRef.current && !reduceMotion) offset += (SPEED_PX_PER_S * dt) / 1000;

      if (pendingRef.current !== 0) {
        let step = pendingRef.current * 0.14;
        if (Math.abs(pendingRef.current) < 0.5) step = pendingRef.current;
        pendingRef.current -= step;
        offset += step;
      }

      if (loop > 0) offset = ((offset % loop) + loop) % loop;
      offsetRef.current = offset;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reviews?.length]);

  if (!reviews?.length) return null;

  const nudge = (direction) => {
    const card = trackRef.current?.querySelector('.review-card');
    const step = card ? card.offsetWidth + GAP_PX : 320;
    pendingRef.current += direction * step;
  };

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
    setOpen(null);
  };

  const copies = [reviews, reviews];

  return (
    <section className="review-section">
      <div className="container review-section__head">
        <h2>
          <span className="review-section__quote" aria-hidden="true">
            &ldquo;
          </span>
          {title}
        </h2>
        <SliderArrows onPrev={() => nudge(-1)} onNext={() => nudge(1)} label="reviews" />
      </div>

      <div
        className="review-viewport"
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={() => setTimeout(resume, 2500)}
      >
        <div className="review-track" ref={trackRef}>
          {copies.map((list, copy) =>
            list.map((review) => {
              const key = `${copy}-${review.id}`;
              const isOpen = open === key;
              return (
                <figure
                  className={`review-card${isOpen ? ' review-card--open' : ''}`}
                  key={key}
                  aria-hidden={copy === 1 || undefined}
                  tabIndex={copy === 0 ? 0 : -1}
                  onMouseEnter={() => setOpen(key)}
                  onFocus={() => {
                    pause();
                    setOpen(key);
                  }}
                  onBlur={resume}
                >
                  <ReviewBody review={review} />

                  {isOpen && (
                    <div className="review-card__pop" role="presentation">
                      <ReviewBody review={review} />
                    </div>
                  )}
                </figure>
              );
            })
          )}
        </div>
      </div>

      {footnote && (
        <div className="container">
          <p className="review-section__footnote">
            {footnote}
            {footnoteHref && (
              <>
                {' '}
                <a href={footnoteHref} target="_blank" rel="noopener noreferrer">
                  Read all reviews on Google
                </a>
              </>
            )}
          </p>
        </div>
      )}
    </section>
  );
}
