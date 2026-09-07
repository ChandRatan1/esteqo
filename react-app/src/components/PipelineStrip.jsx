import Media from './Media';

/**
 * The stages of a treatment, shown as a strip that scrolls continuously from
 * right to left.
 *
 * The row is rendered twice — the second copy is aria-hidden — and each track
 * slides a full width before looping, so the join is seamless and the strip
 * animates whether or not the cards happen to overflow the viewport. Motion
 * pauses on hover and is disabled entirely for reduced-motion users (see the
 * media query in pages.css).
 */
function Track({ stages, clone = false }) {
  return (
    <div className="pipeline__track" aria-hidden={clone || undefined}>
      {stages.map((stage, index) => (
        <figure className="pipeline__stage" key={`${clone ? 'clone-' : ''}${stage.title}`}>
          <Media src={stage.image} alt={clone ? '' : stage.title} accent="cream" label={stage.title} />
          <figcaption>
            <span className="pipeline__step">Step {index + 1}</span>
            <strong>{stage.title}</strong>
            <span className="pipeline__stage-text">{stage.text}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export default function PipelineStrip({ titleLead, titleRest, text, stages }) {
  return (
    <section className="pipeline">
      <div className="container pipeline__head">
        <h2 className="pipeline__title">
          {titleLead}
          <br />
          {titleRest}
        </h2>
        {text && <p className="pipeline__text">{text}</p>}
      </div>

      <div className="pipeline__viewport">
        <Track stages={stages} />
        <Track stages={stages} clone />
      </div>
    </section>
  );
}
