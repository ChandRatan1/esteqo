'use strict';

/**
 * Seeds every content table.
 *
 * Service categories, services and FAQ answers are the real ESTEQO catalogue.
 * Testimonials in seeds/data/content.json are SAMPLE copy with initials only —
 * replace them with genuine client reviews before the site goes live.
 */

const categories = require('./data/categories.json');
const services = require('./data/services.json');
const faqs = require('./data/faqs.json');
const content = require('./data/content.json');

/** @param {import('knex').Knex} knex */
exports.seed = async function seed(knex) {
  // Children first — FK constraints.
  await knex('newsletter_subscribers').del();
  await knex('contact_messages').del();
  await knex('appointments').del();
  await knex('services').del();
  await knex('service_categories').del();
  await knex('blog_posts').del();
  await knex('blog_categories').del();
  await knex('testimonials').del();
  await knex('faqs').del();
  await knex('team_members').del();
  await knex('site_settings').del();

  // --- Service catalogue -----------------------------------------------
  await knex('service_categories').insert(
    categories.map((c, index) => ({
      slug: c.slug,
      name: c.name,
      tagline: c.tagline,
      intro: c.intro,
      accent: c.accent,
      icon: c.icon,
      sort_order: c.sort_order,
      is_featured: index < 4,
      is_active: true,
    }))
  );

  const categoryIdBySlug = Object.fromEntries(
    (await knex('service_categories').select('id', 'slug')).map((row) => [row.slug, row.id])
  );

  // One flagship service per category is featured on the homepage.
  const featuredSlugs = new Set([
    'hydra-facial',
    'brow-mapping',
    'laser-hair-reduction',
    'japanese-head-spa-ritual',
    'full-body-polish',
    'swedish-massage',
    'eyebrow-threading',
    'glow-peel',
  ]);

  await knex('services').insert(
    services.map((s) => ({
      category_id: categoryIdBySlug[s.category_slug],
      slug: s.slug,
      name: s.name,
      summary: s.summary || null,
      description: s.description || null,
      bullets: JSON.stringify(s.bullets || []),
      what_to_expect: JSON.stringify(s.what_to_expect || []),
      safe_painless: s.safe_painless,
      skin_body_face: s.skin_body_face,
      tests_consulting: s.tests_consulting,
      ideal_for: s.ideal_for,
      sort_order: s.sort_order,
      is_featured: featuredSlugs.has(s.slug),
      is_active: true,
    }))
  );

  // --- Blog -------------------------------------------------------------
  await knex('blog_categories').insert(content.blog_categories);

  const blogCategoryIdBySlug = Object.fromEntries(
    (await knex('blog_categories').select('id', 'slug')).map((row) => [row.slug, row.id])
  );

  await knex('blog_posts').insert(
    content.blog_posts.map((p) => ({
      category_id: blogCategoryIdBySlug[p.category_slug] || null,
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      content: p.content,
      author: p.author,
      read_minutes: p.read_minutes,
      tags: JSON.stringify(p.tags || []),
      is_featured: Boolean(p.is_featured),
      status: 'published',
      published_at: p.published_at,
    }))
  );

  // --- Supporting content ----------------------------------------------
  await knex('faqs').insert(faqs.map((f) => ({ ...f, is_active: true })));

  await knex('team_members').insert(
    content.team.map((m, index) => ({ ...m, sort_order: index + 1, is_active: true }))
  );

  await knex('testimonials').insert(
    content.testimonials.map((t, index) => ({ ...t, sort_order: index + 1, is_active: true }))
  );

  const settingRows = [];
  for (const [group, values] of Object.entries(content.settings)) {
    for (const [key, value] of Object.entries(values)) {
      settingRows.push({ setting_key: key, setting_value: String(value), setting_group: group });
    }
  }
  await knex('site_settings').insert(settingRows);

  console.log(
    `Seeded ${categories.length} categories, ${services.length} services, ` +
      `${content.blog_posts.length} posts, ${faqs.length} FAQs, ` +
      `${content.team.length} team members, ${content.testimonials.length} testimonials.`
  );
};
