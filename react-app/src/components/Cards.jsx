import { Link } from 'react-router-dom';
import Media from './Media';
import { formatDate } from '../utils/format';

/**
 * Both cards below flip on hover: the front is just the photo, the back
 * (revealed on hover/focus) carries the details. Touch devices — which have
 * no real hover — get the two faces stacked instead (see the `hover: none`
 * rule in components.css), so nothing is ever hidden behind an interaction
 * a touchscreen can't perform.
 */

export function CategoryCard({ category }) {
  return (
    <Link to={`/services/${category.slug}`} className={`cat-card flip-card accent-${category.accent}`}>
      <div className="flip-card__inner">
        <div className="flip-card__face flip-card__face--front">
          <div className="flip-card__front-media">
            <Media
              src={category.heroImage}
              alt={category.imageAlt || category.name}
              accent={category.accent}
              label={category.name}
              variant="square"
            />
          </div>
          <div className="flip-card__front-label">{category.name}</div>
        </div>
        <div className="flip-card__face flip-card__face--back">
          <div className="cat-card__body">
            <span className="cat-card__count">
              {category.serviceCount} {category.serviceCount === 1 ? 'treatment' : 'treatments'}
            </span>
            <h3 className="cat-card__title">{category.name}</h3>
            <p className="cat-card__text">{category.tagline}</p>
            <span className="link-underline">Explore</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ServiceCard({ service, showCategory = false }) {
  const accent = service.category?.accent || 'cream';
  return (
    <Link to={`/services/${service.category?.slug}`} className={`svc-card flip-card accent-${accent}`}>
      <div className="flip-card__inner">
        <div className="flip-card__face flip-card__face--front">
          <div className="flip-card__front-media">
            <Media src={service.image} alt={service.imageAlt || service.name} accent={accent} label={service.name} />
            {service.isNew && <span className="tag-new svc-card__badge">New</span>}
          </div>
          <div className="flip-card__front-label">{service.name}</div>
        </div>
        <div className="flip-card__face flip-card__face--back">
          <div className="svc-card__body">
            {showCategory && <span className="svc-card__kicker">{service.category?.name}</span>}
            <h3 className="svc-card__title">{service.name}</h3>
            <p className="svc-card__text">{service.summary}</p>
            {(service.durationMinutes || service.priceNote) && (
              <p className="svc-card__meta">
                {service.durationMinutes ? `${service.durationMinutes} mins` : null}
                {service.durationMinutes && service.priceNote ? ' · ' : null}
                {service.priceNote}
              </p>
            )}
            <span className="svc-card__foot">
              {service.price != null ? (
                <span className="svc-card__price">₹{service.price.toLocaleString('en-IN')}</span>
              ) : (
                <span className="svc-card__price muted">On consultation</span>
              )}
              <span className="link-underline">View</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PostCard({ post }) {
  return (
    <article className="post-card">
      <Link to={`/blog/${post.slug}`}>
        <Media
          src={post.coverImage}
          alt={post.title}
          accent="cream"
          label={post.title}
          variant="wide"
        />
      </Link>
      <div className="post-card__body">
        <div className="post-card__meta">
          {post.category && <span>{post.category.name}</span>}
          <span>{formatDate(post.publishedAt)}</span>
          <span>{post.readMinutes} min read</span>
        </div>
        <h3 className="post-card__title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="post-card__excerpt">{post.excerpt}</p>
        <Link className="link-underline post-card__more" to={`/blog/${post.slug}`}>
          Read article
        </Link>
      </div>
    </article>
  );
}

export function TeamCard({ member }) {
  return (
    <article className="team-card">
      <Media
        src={member.photo}
        alt={member.name}
        accent="light-brown"
        label={member.name}
        variant="tall"
      />
      <h3 className="team-card__name">{member.name}</h3>
      <p className="team-card__role">{member.role}</p>
      <p className="team-card__bio">{member.bio}</p>
    </article>
  );
}
