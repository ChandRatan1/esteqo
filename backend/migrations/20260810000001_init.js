'use strict';

/**
 * Initial ESTEQO schema.
 *
 * Content tables (service_categories, services, blog_*, testimonials, faqs,
 * team_members, site_settings) are seeded; the rest capture visitor input.
 * There is no products or users table — the site does not sell online and
 * has no customer login.
 */

/** @param {import('knex').Knex} knex */
exports.up = async function up(knex) {
  await knex.schema.createTable('service_categories', (t) => {
    t.increments('id').primary();
    t.string('slug', 120).notNullable().unique();
    t.string('name', 160).notNullable();
    t.string('tagline', 255).nullable();
    t.text('intro').nullable();
    t.string('accent', 40).notNullable().defaultTo('cream');
    t.string('icon', 40).nullable();
    t.string('hero_image', 255).nullable();
    t.integer('sort_order').unsigned().notNullable().defaultTo(0);
    t.boolean('is_featured').notNullable().defaultTo(false);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
    t.index(['is_active', 'sort_order'], 'idx_categories_active_sort');
  });

  await knex.schema.createTable('services', (t) => {
    t.increments('id').primary();
    t.integer('category_id').unsigned().notNullable()
      .references('id').inTable('service_categories')
      .onDelete('CASCADE').onUpdate('CASCADE');
    t.string('slug', 160).notNullable().unique();
    t.string('name', 200).notNullable();
    t.text('summary').nullable();
    t.text('description').nullable();
    // Bullet lists rendered on the detail page.
    t.json('bullets').nullable();
    t.json('what_to_expect').nullable();
    t.string('safe_painless', 500).nullable();
    t.string('skin_body_face', 500).nullable();
    t.string('tests_consulting', 500).nullable();
    t.string('ideal_for', 500).nullable();
    t.integer('duration_minutes').unsigned().nullable();
    t.decimal('price', 10, 2).nullable();
    t.string('image', 255).nullable();
    t.integer('sort_order').unsigned().notNullable().defaultTo(0);
    t.boolean('is_featured').notNullable().defaultTo(false);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
    t.index(['category_id', 'sort_order'], 'idx_services_category_sort');
    t.index(['is_active', 'is_featured'], 'idx_services_active_featured');
  });

  await knex.schema.createTable('blog_categories', (t) => {
    t.increments('id').primary();
    t.string('slug', 120).notNullable().unique();
    t.string('name', 160).notNullable();
    t.string('description', 500).nullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('blog_posts', (t) => {
    t.increments('id').primary();
    t.integer('category_id').unsigned().nullable()
      .references('id').inTable('blog_categories')
      .onDelete('SET NULL').onUpdate('CASCADE');
    t.string('slug', 200).notNullable().unique();
    t.string('title', 255).notNullable();
    t.string('excerpt', 600).nullable();
    t.text('content', 'longtext').nullable();
    t.string('cover_image', 255).nullable();
    t.string('author', 120).notNullable().defaultTo('ESTEQO');
    t.integer('read_minutes').unsigned().notNullable().defaultTo(4);
    t.json('tags').nullable();
    t.boolean('is_featured').notNullable().defaultTo(false);
    t.enu('status', ['draft', 'published']).notNullable().defaultTo('published');
    t.datetime('published_at').nullable();
    t.timestamps(true, true);
    t.index(['status', 'published_at'], 'idx_posts_status_published');
  });

  await knex.schema.createTable('testimonials', (t) => {
    t.increments('id').primary();
    t.string('author', 160).notNullable();
    t.string('location', 160).nullable();
    t.string('treatment', 200).nullable();
    t.text('quote').notNullable();
    t.tinyint('rating').unsigned().notNullable().defaultTo(5);
    t.integer('sort_order').unsigned().notNullable().defaultTo(0);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('faqs', (t) => {
    t.increments('id').primary();
    t.string('faq_group', 80).notNullable().defaultTo('general');
    t.string('question', 400).notNullable();
    t.text('answer').notNullable();
    t.integer('sort_order').unsigned().notNullable().defaultTo(0);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
    t.index(['faq_group', 'sort_order'], 'idx_faqs_group_sort');
  });

  await knex.schema.createTable('team_members', (t) => {
    t.increments('id').primary();
    t.string('slug', 120).notNullable().unique();
    t.string('name', 160).notNullable();
    t.string('role', 200).nullable();
    t.text('bio').nullable();
    t.string('photo', 255).nullable();
    t.integer('sort_order').unsigned().notNullable().defaultTo(0);
    t.boolean('is_active').notNullable().defaultTo(true);
    t.timestamps(true, true);
  });

  await knex.schema.createTable('site_settings', (t) => {
    t.string('setting_key', 120).primary();
    t.text('setting_value').nullable();
    t.string('setting_group', 60).notNullable().defaultTo('general');
    t.timestamps(true, true);
  });

  await knex.schema.createTable('appointments', (t) => {
    t.increments('id').primary();
    t.string('reference', 20).notNullable().unique();
    t.string('full_name', 160).notNullable();
    t.string('email', 200).nullable();
    t.string('phone', 40).notNullable();
    t.integer('service_id').unsigned().nullable()
      .references('id').inTable('services')
      .onDelete('SET NULL').onUpdate('CASCADE');
    t.integer('category_id').unsigned().nullable()
      .references('id').inTable('service_categories')
      .onDelete('SET NULL').onUpdate('CASCADE');
    t.date('preferred_date').nullable();
    t.string('preferred_time', 20).nullable();
    t.enu('contact_method', ['call', 'whatsapp', 'email', 'sms']).notNullable().defaultTo('call');
    t.text('message').nullable();
    t.enu('status', ['new', 'confirmed', 'completed', 'cancelled']).notNullable().defaultTo('new');
    t.string('source', 60).notNullable().defaultTo('website');
    t.string('ip_address', 45).nullable();
    t.timestamps(true, true);
    t.index(['status', 'preferred_date'], 'idx_appointments_status_date');
  });

  await knex.schema.createTable('contact_messages', (t) => {
    t.increments('id').primary();
    t.string('full_name', 160).notNullable();
    t.string('email', 200).nullable();
    t.string('phone', 40).nullable();
    t.string('subject', 255).nullable();
    t.text('message').notNullable();
    t.enu('contact_method', ['call', 'whatsapp', 'email', 'sms']).notNullable().defaultTo('email');
    t.boolean('is_handled').notNullable().defaultTo(false);
    t.string('ip_address', 45).nullable();
    t.timestamps(true, true);
  });

  await knex.schema.createTable('newsletter_subscribers', (t) => {
    t.increments('id').primary();
    t.string('email', 200).notNullable().unique();
    t.boolean('is_active').notNullable().defaultTo(true);
    t.string('source', 60).notNullable().defaultTo('footer');
    t.timestamps(true, true);
  });
};

/** @param {import('knex').Knex} knex */
exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('newsletter_subscribers');
  await knex.schema.dropTableIfExists('contact_messages');
  await knex.schema.dropTableIfExists('appointments');
  await knex.schema.dropTableIfExists('site_settings');
  await knex.schema.dropTableIfExists('team_members');
  await knex.schema.dropTableIfExists('faqs');
  await knex.schema.dropTableIfExists('testimonials');
  await knex.schema.dropTableIfExists('blog_posts');
  await knex.schema.dropTableIfExists('blog_categories');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('service_categories');
};
