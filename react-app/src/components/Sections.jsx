import { Link } from 'react-router-dom';
import Media from './Media';
import { useContactLinks } from '../context/SiteContext';

/** Inner-page banner. */
export function PageHero({ eyebrow, title, text, accent = 'cream', center = false, children }) {
  return (
    <section className={`page-hero accent-${accent}${center ? ' page-hero--center' : ''}`}>
      <div className="container">
        <div className="page-hero__inner">
          {eyebrow && <span className="eyebrow">{eyebrow}</span>}
          <h1 className="page-hero__title">{title}</h1>
          {text && <p className="lede">{text}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

export function Breadcrumbs({ trail = [] }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <Link to="/">Home</Link>
      {trail.map((item) =>
        item.to ? (
          <span key={item.label}>
            <Link to={item.to}>{item.label}</Link>
          </span>
        ) : (
          <span key={item.label} aria-current="page">
            {item.label}
          </span>
        )
      )}
    </nav>
  );
}

/** Auto-scrolling strip. The list is duplicated so the loop is seamless. */
export function Marquee({ items = [] }) {
  if (!items.length) return null;
  const track = (
    <div className="marquee__track" aria-hidden="false">
      {items.map((item, index) => (
        <span className="marquee__item" key={`${item}-${index}`}>
          {item}
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee">
      {track}
      <div className="marquee__track" aria-hidden="true">
        {items.map((item, index) => (
          <span className="marquee__item" key={`dup-${item}-${index}`}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Text + image row. Category pages stack these, alternating sides, which is
 * how the original ESTEQO treatment pages are laid out.
 */
export function Split({ title, children, accent = 'cream', flip = false, image, imageAlt }) {
  return (
    <article className={`split${flip ? ' split--flip' : ''} split--tinted accent-${accent}`}>
      <div className="split__body">
        {title && <h3 className="split__title">{title}</h3>}
        <div className="split__text">{children}</div>
      </div>
      <div className="split__media">
        <Media src={image} alt={imageAlt || title} accent={accent} label={title} />
      </div>
    </article>
  );
}

/** Labelled fact rows: Safe & Painless / Skin, Body & Face / Tests & Consulting. */
export function FactList({ facts = [] }) {
  const rows = facts.filter((fact) => fact.value);
  if (!rows.length) return null;

  return (
    <dl className="facts">
      {rows.map((fact) => (
        <div className="fact" key={fact.label}>
          <dt className="fact__label">{fact.label}</dt>
          <dd className="fact__value">{fact.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TickList({ items = [] }) {
  if (!items.length) return null;
  return (
    <ul className="ticks">
      {items.map((item, index) => (
        <li key={`${item}-${index}`}>{item}</li>
      ))}
    </ul>
  );
}

export function CtaBand({
  title = 'Contact us to schedule your treatment today',
  text = 'Every service begins with a detailed skin consultation, so we can recommend what your skin actually needs.',
}) {
  const links = useContactLinks();
  return (
    <section className="cta-band">
      <div className="container">
        <h2>{title}</h2>
        <p>{text}</p>
        <div className="btn-row">
          <Link to="/appointment" className="btn btn--light">
            Book an appointment
          </Link>
          <a href={links.whatsapp} className="btn btn--secondary" style={{ color: 'var(--cream)', borderColor: 'var(--cream)' }} target="_blank" rel="noreferrer">
            WhatsApp us
          </a>
        </div>
      </div>
    </section>
  );
}

/**
 * Numbered "Treatment process" list — the consultation-to-aftercare walkthrough
 * described in the ESTEQO content document.
 */
export function ProcessSteps({ steps = [], title = 'Treatment process' }) {
  if (!steps.length) return null;

  return (
    <section className="process">
      <h2 className="process__title">{title}</h2>
      <ol className="process__list">
        {steps.map((step, index) => (
          <li className="process__step" key={step.title}>
            <span className="process__num">{String(index + 1).padStart(2, '0')}</span>
            <div className="process__body">
              <h3 className="process__step-title">{step.title}</h3>
              <p className="process__text">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** "Ideal for" checklist. */
export function IdealFor({ items = [], title = 'Ideal for' }) {
  if (!items.length) return null;
  return (
    <div className="idealfor">
      <h2 className="idealfor__title">{title}</h2>
      <p className="idealfor__lead">This treatment suits clients who:</p>
      <TickList items={items} />
    </div>
  );
}
