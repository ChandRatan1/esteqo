/**
 * SEO configuration.
 *
 * SITE_URL is the canonical origin. It drives canonical tags, Open Graph URLs,
 * the sitemap and every structured-data block, so set it once here (or via
 * VITE_SITE_URL) and everything follows.
 */

export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://esteqo.com').replace(/\/$/, '');

export const SITE_NAME = 'ESTEQO';
export const DEFAULT_OG_IMAGE = '/services/21324.jpg';

export const DEFAULT_TITLE = 'ESTEQO | Skin, Brows & Laser Clinic in Sector 25, Noida';
export const DEFAULT_DESCRIPTION =
  'Clinically planned skin, brow and laser treatments in Sector 25, Noida. Hydra facials, carbon laser, peels, body polish, threading, waxing and massages by Seema Nanda.';

/** Absolute URL for a site-relative path. */
export const absoluteUrl = (path = '/') =>
  `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;

/** Static routes and how important each is in the sitemap. */
export const STATIC_ROUTES = [
  { path: '/', priority: 1.0, changefreq: 'weekly' },
  { path: '/services', priority: 0.9, changefreq: 'weekly' },
  { path: '/about', priority: 0.7, changefreq: 'monthly' },
  { path: '/values', priority: 0.6, changefreq: 'monthly' },
  { path: '/blog', priority: 0.8, changefreq: 'weekly' },
  { path: '/contact', priority: 0.8, changefreq: 'monthly' },
  { path: '/appointment', priority: 0.9, changefreq: 'monthly' },
];

/** Business details reused across the structured-data blocks. */
export const BUSINESS = {
  name: 'ESTEQO',
  legalName: 'ESTEQO — Brows | Lasers | Skin',
  description: DEFAULT_DESCRIPTION,
  telephone: '+91-8010135135',
  email: 'Info.esteqo@gmail.com',
  street: 'Shop No. 209, First Floor, Modi Mall, Sector 25',
  locality: 'Noida',
  region: 'Uttar Pradesh',
  postalCode: '201301',
  country: 'IN',
  latitude: 28.5823,
  longitude: 77.3245,
  priceRange: '₹₹',
  sameAs: [
    'https://www.instagram.com/esteqo_care/',
    'https://www.youtube.com/@cosmetologistseemanandaest4431',
  ],
  /** The same hours every day: 10:00 am – 8:30 pm. */
  openingHours: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '10:00',
      closes: '20:30',
    },
  ],
  areaServed: [
    'Noida',
    'Greater Noida',
    'Ghaziabad',
    'Indirapuram',
    'Vaishali',
    'New Delhi',
    'Delhi NCR',
  ],
};
