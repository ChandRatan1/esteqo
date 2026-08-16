/**
 * Generates public/sitemap.xml from the site's own data.
 *
 *   npm run sitemap        # regenerate on demand
 *   npm run build          # runs automatically before every build
 *
 * Every route the router serves is covered: static pages, the 15 department
 * pages, all treatment pages and every blog post. Because it reads the same
 * data files the app renders from, adding a treatment or a post automatically
 * adds it to the sitemap — nothing to remember.
 *
 * Set SITE_URL (or VITE_SITE_URL) to change the domain.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, '..');

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://esteqo.co.in')
  .replace(/\/$/, '');

// The data modules are plain ESM with no browser dependencies.
const load = async (rel) => import(pathToFileURL(path.join(root, rel)).href);

const { categories, services } = await load('src/data/menu.js');
const { blogPosts } = await load('src/data/site.js');

const today = new Date().toISOString().slice(0, 10);

const STATIC = [
  ['/', 1.0, 'weekly'],
  ['/services', 0.9, 'weekly'],
  ['/appointment', 0.9, 'monthly'],
  ['/contact', 0.8, 'monthly'],
  ['/blog', 0.8, 'weekly'],
  ['/about', 0.7, 'monthly'],
  ['/values', 0.6, 'monthly'],
];

const urls = [];
const push = (loc, priority, changefreq, lastmod = today) =>
  urls.push({ loc: `${SITE_URL}${loc}`, priority, changefreq, lastmod });

for (const [loc, priority, changefreq] of STATIC) push(loc, priority, changefreq);
for (const c of categories) push(`/services/${c.slug}`, 0.8, 'monthly');
for (const s of services) push(`/treatments/${s.slug}`, 0.7, 'monthly');
for (const p of blogPosts) push(`/blog/${p.slug}`, 0.6, 'yearly', p.publishedAt || today);

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
  `sitemap.xml: ${urls.length} URLs ` +
    `(${STATIC.length} pages, ${categories.length} departments, ${services.length} treatments, ${blogPosts.length} posts) -> ${SITE_URL}`
);
