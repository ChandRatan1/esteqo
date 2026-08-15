import { Link } from 'react-router-dom';
import Media from './Media';
import { formatDate } from '../utils/format';

export function CategoryCard({ category }) {
  return (
    <Link to={`/services/${category.slug}`} className={`cat-card accent-${category.accent}`}>
      <Media
        src={category.heroImage}
        alt={category.name}
        accent={category.accent}
        label={category.name}
        variant="square"
      />
      <div className="cat-card__body">
        <span className="cat-card__count">
          {category.serviceCount} {category.serviceCount === 1 ? 'treatment' : 'treatments'}
        </span>
        <h3 className="cat-card__title">{category.name}</h3>
        <p className="cat-card__text">{category.tagline}</p>
        <span className="link-underline">Explore</span>
      </div>
    </Link>
  );
}

export function ServiceCard({ service, showCategory = false }) {
  return (
    <Link
      to={`/treatments/${service.slug}`}
      className={`svc-card accent-${service.category?.accent || 'cream'}`}
    >
      {showCategory && <span className="svc-card__kicker">{service.category?.name}</span>}
      <h3 className="svc-card__title">
        {service.name}
        {service.isNew && <span className="tag-new">New</span>}
      </h3>
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
