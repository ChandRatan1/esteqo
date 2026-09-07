/** The paired round prev/next buttons used by the home page sliders. */
export default function SliderArrows({ onPrev, onNext, atStart, atEnd, label = 'items' }) {
  return (
    <div className="slider-arrows">
      <button
        type="button"
        className="slider-arrow"
        aria-label={`Previous ${label}`}
        onClick={onPrev}
        disabled={atStart}
      >
        <svg viewBox="0 0 20 12" width="17" height="11" fill="none" aria-hidden="true">
          <path d="M19 6H2M8 1L2 6l6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className="slider-arrow"
        aria-label={`Next ${label}`}
        onClick={onNext}
        disabled={atEnd}
      >
        <svg viewBox="0 0 20 12" width="17" height="11" fill="none" aria-hidden="true">
          <path d="M1 6h17M12 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
}
