import SliderArrows from './SliderArrows';
import { useSlider } from '../hooks/useSlider';

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

/** "Our guests' results" — a sliding row of client reviews. */
export default function ReviewSlider({ title, reviews, footnote }) {
  const { trackRef, atStart, atEnd, sync, slide } = useSlider('.review-card');

  if (!reviews?.length) return null;

  return (
    <section className="review-section">
      <div className="container review-section__head">
        <h2>
          <span className="review-section__quote" aria-hidden="true">
            &ldquo;
          </span>
          {title}
        </h2>
        <SliderArrows
          onPrev={() => slide(-1)}
          onNext={() => slide(1)}
          atStart={atStart}
          atEnd={atEnd}
          label="reviews"
        />
      </div>

      <div className="review-track" ref={trackRef} onScroll={sync}>
        {reviews.map((review) => (
          <figure className="review-card" key={review.id}>
            <Stars rating={review.rating} />
            <blockquote className="review-card__quote">&ldquo;{review.quote}&rdquo;</blockquote>
            <figcaption className="review-card__author">
              {review.author}
              {review.treatment && <span>{review.treatment}</span>}
            </figcaption>
          </figure>
        ))}
      </div>

      {footnote && (
        <div className="container">
          <p className="review-section__footnote">{footnote}</p>
        </div>
      )}
    </section>
  );
}
