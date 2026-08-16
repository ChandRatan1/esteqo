'use strict';

/**
 * Adds the `contacts` table and the SEO columns.
 *
 * `contacts` is the single destination for every website form — the contact
 * form, the appointment request and the newsletter signup. Each field the
 * visitor can fill in has its own column, so the data is queryable rather than
 * buried in a blob, and the same row records where the enquiry came from.
 *
 * The SEO columns let each page carry its own title/description/canonical and
 * feed the sitemap without code changes.
 */

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.createTable('contacts', (t) => {
    t.increments('id').primary();

    // Which form produced this row.
    t.enu('form_type', ['contact', 'appointment', 'newsletter']).notNullable().defaultTo('contact');
    t.string('reference', 20).nullable().index();

    // --- Visitor details -------------------------------------------------
    t.string('full_name', 40).nullable();
    t.string('email', 50).nullable();
    t.string('phone', 13).nullable();
    t.string('location', 120).nullable();

    // --- What they want --------------------------------------------------
    t.string('service_slug', 160).nullable();
    t.string('service_name', 200).nullable();
    t.string('service_price', 60).nullable();
    t.string('category_slug', 120).nullable();
    t.date('preferred_date').nullable();
    t.string('preferred_time', 40).nullable();
    t.enu('contact_method', ['call', 'whatsapp', 'email', 'sms']).notNullable().defaultTo('call');

    // --- Free text -------------------------------------------------------
    t.string('subject', 50).nullable();
    t.string('message', 350).nullable();

    // --- Provenance and workflow ----------------------------------------
    t.string('source_page', 255).nullable();
    t.string('referrer', 255).nullable();
    t.string('ip_address', 45).nullable();
    t.string('user_agent', 255).nullable();
    t.boolean('captcha_passed').notNullable().defaultTo(true);
    t.boolean('is_spam').notNullable().defaultTo(false);
    t.boolean('email_sent').notNullable().defaultTo(false);
    t.enu('status', ['new', 'read', 'responded', 'booked', 'closed'])
      .notNullable()
      .defaultTo('new');
    t.text('admin_notes').nullable();

    t.timestamps(true, true);

    t.index(['form_type', 'status'], 'idx_contacts_type_status');
    t.index(['created_at'], 'idx_contacts_created');
    t.index(['email'], 'idx_contacts_email');
    t.index(['phone'], 'idx_contacts_phone');
  });

  // --- SEO columns -------------------------------------------------------
  await knex.schema.alterTable('blog_posts', (t) => {
    t.string('image_url', 255).nullable();
    t.string('image_alt', 255).nullable();
    t.string('meta_title', 70).nullable();
    t.string('meta_description', 160).nullable();
    t.string('focus_keyword', 120).nullable();
    t.string('canonical_url', 255).nullable();
    t.string('og_image', 255).nullable();
    t.decimal('sitemap_priority', 2, 1).notNullable().defaultTo(0.7);
    t.string('sitemap_changefreq', 20).notNullable().defaultTo('monthly');
    t.boolean('noindex').notNullable().defaultTo(false);
  });

  for (const table of ['services', 'service_categories']) {
    // eslint-disable-next-line no-await-in-loop
    await knex.schema.alterTable(table, (t) => {
      t.string('meta_title', 70).nullable();
      t.string('meta_description', 160).nullable();
      t.string('canonical_url', 255).nullable();
      t.string('image_alt', 255).nullable();
      t.decimal('sitemap_priority', 2, 1).notNullable().defaultTo(0.8);
      t.string('sitemap_changefreq', 20).notNullable().defaultTo('monthly');
      t.boolean('noindex').notNullable().defaultTo(false);
    });
  }

  // Existing cover_image values become the canonical image_url.
  await knex.raw('UPDATE blog_posts SET image_url = cover_image WHERE cover_image IS NOT NULL');
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  for (const table of ['services', 'service_categories']) {
    // eslint-disable-next-line no-await-in-loop
    await knex.schema.alterTable(table, (t) => {
      t.dropColumn('meta_title');
      t.dropColumn('meta_description');
      t.dropColumn('canonical_url');
      t.dropColumn('image_alt');
      t.dropColumn('sitemap_priority');
      t.dropColumn('sitemap_changefreq');
      t.dropColumn('noindex');
    });
  }

  await knex.schema.alterTable('blog_posts', (t) => {
    t.dropColumn('image_url');
    t.dropColumn('image_alt');
    t.dropColumn('meta_title');
    t.dropColumn('meta_description');
    t.dropColumn('focus_keyword');
    t.dropColumn('canonical_url');
    t.dropColumn('og_image');
    t.dropColumn('sitemap_priority');
    t.dropColumn('sitemap_changefreq');
    t.dropColumn('noindex');
  });

  await knex.schema.dropTableIfExists('contacts');
};
