/**
 * Generates public/sitemap.xml.
 *
 *   npm run sitemap        # regenerate on demand
 *   npm run build          # runs automatically before every build
 *
 * Services and static pages come from the bundled data in src/data, which is
 * what the site renders from.
 *
 * Blog posts come from the LIVE API when it is reachable, because posts are
 * written through /admin/blog into MySQL — the bundled file only holds the
 * original seed content. Reading the bundle for posts would list URLs that no
 * longer exist and omit everything published since. If the API cannot be
 * reached the bundled posts are used as a fallback and a warning is printed,
 * so a stale sitemap is never produced silently.
 *
 * Set SITE_URL for the public domain and BLOG_API for the API origin.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

/** Read a var out of .env so `npm run sitemap` needs no shell exports. */
function fromEnv(name) {
  try {
    const env = fs.readFileSync(path.join(root, '.env'), 'utf8');
    const match = new RegExp(`^\\s*${name}\\s*=\\s*(.+)$`, 'm').exec(env);
    if (match) return match[1].trim();
  } catch {
    /* no .env — fall through */
  }
  return '';
}

const SITE_URL = (
  process.env.SITE_URL ||
  process.env.VITE_SITE_URL ||
  fromEnv('VITE_SITE_URL') ||
  'https://esteqo.com'
).replace(/\/$/, '');

const BLOG_API = (process.env.BLOG_API || fromEnv('VITE_BLOG_API')).replace(/\/$/, '');

const load = async (rel) => import(pathToFileURL(path.join(root, rel)).href);

const { categories } = await load('src/data/menu.js');
const { blogPosts: bundledPosts } = await load('src/data/site.js');

/** Published posts from the API, or null when it is unreachable. */
async function fetchLivePosts() {
  if (!BLOG_API) return null;
  try {
    const response = await fetch(`${BLOG_API}/api/blog/posts?limit=500`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
}

/** Active departments from the API, or null when it is unreachable — the
 * bundled menu still lists departments that were switched off in the DB. */
async function fetchLiveCategories() {
  if (!BLOG_API) return null;
  try {
    const response = await fetch(`${BLOG_API}/api/categories`, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) return null;
    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : null;
  } catch {
    return null;
  }
}

const liveCategories = await fetchLiveCategories();
const departments = liveCategories ?? categories;

const livePosts = await fetchLivePosts();
const posts = livePosts ?? bundledPosts;
const postSource = livePosts ? `live API (${BLOG_API})` : 'bundled fallback';

if (!livePosts && BLOG_API) {
  console.warn(
    `\n  WARNING: could not reach ${BLOG_API}. Blog URLs came from the bundled\n` +
      '  seed data, which may not match what is published. Start the backend and\n' +
      '  re-run `npm run sitemap` before deploying.\n'
  );
}

const today = new Date().toISOString().slice(0, 10);

const STATIC = [
  ['/', 1.0, 'weekly'],
  ['/services', 0.9, 'weekly'],
  ['/appointment', 0.9, 'monthly'],
  ['/contact', 0.8, 'monthly'],
  ['/blog', 0.8, 'weekly'],
  ['/services/menu/brows', 0.9, 'weekly'],
  ['/services/menu/bridal', 0.9, 'weekly'],
  ['/values', 0.7, 'monthly'],
  ['/gift-cards', 0.6, 'monthly'],
  ['/referral-program', 0.5, 'monthly'],
];

const urls = [];
const push = (loc, priority, changefreq, lastmod = today) =>
  urls.push({ loc: `${SITE_URL}${loc}`, priority, changefreq, lastmod });

for (const [loc, priority, changefreq] of STATIC) push(loc, priority, changefreq);
for (const c of departments) push(`/services/${c.slug}`, 0.8, 'monthly');

for (const p of posts) {
  // The API returns publishedAt; the bundled file uses the same key.
  const date = (p.publishedAt || p.published_at || today).toString().slice(0, 10);
  push(`/blog/${p.slug}`, 0.6, 'yearly', date);
}

const escape = (value) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${escape(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority.toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(root, 'public', 'sitemap.xml'), xml);

// Keep robots.txt pointing at the same domain.
const robotsPath = path.join(root, 'public', 'robots.txt');
if (fs.existsSync(robotsPath)) {
  const robots = fs
    .readFileSync(robotsPath, 'utf8')
    .replace(/^Sitemap: .*$/m, `Sitemap: ${SITE_URL}/sitemap.xml`);
  fs.writeFileSync(robotsPath, robots);
}

console.log(
  `sitemap.xml: ${urls.length} URLs — ${STATIC.length} pages, ${departments.length} departments, ` +
    `${posts.length} posts [${postSource}] -> ${SITE_URL}`
);
