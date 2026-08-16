import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BUSINESS,
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  SITE_NAME,
  absoluteUrl,
} from './config';

/**
 * Per-page SEO: title, meta description, canonical, Open Graph, Twitter cards
 * and JSON-LD structured data.
 *
 * Implemented by writing to document.head directly rather than pulling in a
 * helmet library — the site is small and this keeps the bundle lean. Every tag
 * it creates is marked data-seo so it can be cleaned up on navigation.
 */

const upsertMeta = (attr, key, content) => {
  if (!content) return;
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    tag.setAttribute('data-seo', 'true');
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const upsertLink = (rel, href) => {
  if (!href) return;
  let tag = document.head.querySelector(`link[rel="${rel}"]`);
  if (!tag) {
    tag = document.createElement('link');
    tag.setAttribute('rel', rel);
    tag.setAttribute('data-seo', 'true');
    document.head.appendChild(tag);
  }
  tag.setAttribute('href', href);
};

const setJsonLd = (id, data) => {
  const existing = document.getElementById(id);
  if (existing) existing.remove();
  if (!data) return;
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.setAttribute('data-seo', 'true');
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};

/** LocalBusiness block — emitted on every page. */
export function businessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': ['HealthAndBeautyBusiness', 'BeautySalon'],
    '@id': `${absoluteUrl('/')}#business`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    description: BUSINESS.description,
    url: absoluteUrl('/'),
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    priceRange: BUSINESS.priceRange,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.street,
      addressLocality: BUSINESS.locality,
      addressRegion: BUSINESS.region,
      postalCode: BUSINESS.postalCode,
      addressCountry: BUSINESS.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: BUSINESS.latitude,
      longitude: BUSINESS.longitude,
    },
    openingHoursSpecification: BUSINESS.openingHours,
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
    sameAs: BUSINESS.sameAs,
    founder: { '@type': 'Person', name: 'Seema Nanda' },
  };
}

/**
 * @param {object} props
 * @param {string} [props.title]        page title, without the brand suffix
 * @param {string} [props.description]  meta description
 * @param {string} [props.image]        social share image (site-relative)
 * @param {string} [props.type]         og:type — "website" or "article"
 * @param {boolean} [props.noindex]
 * @param {Array}  [props.breadcrumbs]  [{ name, path }]
 * @param {object} [props.schema]       extra JSON-LD for this page
 */
export default function Seo({
  title,
  description,
  image,
  type = 'website',
  noindex = false,
  breadcrumbs = [],
  schema = null,
}) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = (description || DEFAULT_DESCRIPTION).slice(0, 160);
    const canonical = absoluteUrl(pathname);
    const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);

    document.title = fullTitle;

    upsertMeta('name', 'description', desc);
    upsertMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');
    upsertLink('canonical', canonical);

    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', type);
    upsertMeta('property', 'og:url', canonical);
    upsertMeta('property', 'og:image', ogImage);
    upsertMeta('property', 'og:locale', 'en_IN');

    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', ogImage);

    setJsonLd('ld-business', businessSchema());

    setJsonLd(
      'ld-breadcrumbs',
      breadcrumbs.length
        ? {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [{ name: 'Home', path: '/' }, ...breadcrumbs].map((crumb, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: crumb.name,
              item: absoluteUrl(crumb.path),
            })),
          }
        : null
    );

    setJsonLd('ld-page', schema);
  }, [pathname, title, description, image, type, noindex, JSON.stringify(breadcrumbs), JSON.stringify(schema)]);

  return null;
}

/** Service / treatment page schema. */
export function serviceSchema(service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.summary,
    serviceType: service.category?.name,
    url: absoluteUrl(`/treatments/${service.slug}`),
    provider: { '@id': `${absoluteUrl('/')}#business` },
    areaServed: BUSINESS.areaServed.map((name) => ({ '@type': 'Place', name })),
    ...(service.image ? { image: absoluteUrl(service.image) } : {}),
    ...(service.price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: service.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            url: absoluteUrl(`/appointment?service=${service.slug}`),
          },
        }
      : {}),
  };
}

/** Blog article schema. */
export function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@type': 'Person', name: post.author || 'ESTEQO' },
    publisher: { '@id': `${absoluteUrl('/')}#business` },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    ...(post.coverImage ? { image: absoluteUrl(post.coverImage) } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(', ') } : {}),
  };
}

/** FAQ rich-result schema. */
export function faqSchema(faqs = []) {
  if (!faqs.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
}
