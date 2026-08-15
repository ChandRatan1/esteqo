'use strict';

const express = require('express');
const db = require('../db');
const { ApiError, asyncHandler } = require('../middleware/errors');
const { toArray, toBool, parsePagination } = require('../utils');

const router = express.Router();

const SERVICE_COLUMNS = [
  'services.id',
  'services.slug',
  'services.name',
  'services.summary',
  'services.description',
  'services.bullets',
  'services.what_to_expect',
  'services.safe_painless',
  'services.skin_body_face',
  'services.tests_consulting',
  'services.ideal_for',
  'services.duration_minutes',
  'services.price',
  'services.image',
  'services.sort_order',
  'services.is_featured',
  'service_categories.slug as category_slug',
  'service_categories.name as category_name',
  'service_categories.accent as category_accent',
];

const shapeService = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  summary: row.summary,
  description: row.description,
  bullets: toArray(row.bullets),
  whatToExpect: toArray(row.what_to_expect),
  safePainless: row.safe_painless,
  skinBodyFace: row.skin_body_face,
  testsConsulting: row.tests_consulting,
  idealFor: row.ideal_for,
  durationMinutes: row.duration_minutes,
  price: row.price === null ? null : Number(row.price),
  image: row.image,
  isFeatured: toBool(row.is_featured),
  category: {
    slug: row.category_slug,
    name: row.category_name,
    accent: row.category_accent,
  },
});

const shapeCategory = (row) => ({
  id: row.id,
  slug: row.slug,
  name: row.name,
  tagline: row.tagline,
  intro: row.intro,
  accent: row.accent,
  icon: row.icon,
  heroImage: row.hero_image,
  isFeatured: toBool(row.is_featured),
  serviceCount: row.service_count === undefined ? undefined : Number(row.service_count),
});

/**
 * GET /api/categories
 * All active service categories with a live service count.
 */
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const rows = await db('service_categories')
      .select(
        'service_categories.*',
        db.raw(
          '(SELECT COUNT(*) FROM services WHERE services.category_id = service_categories.id ' +
            'AND services.is_active = 1) AS service_count'
        )
      )
      .where('service_categories.is_active', true)
      .orderBy('service_categories.sort_order', 'asc');

    res.json({ data: rows.map(shapeCategory) });
  })
);

/**
 * GET /api/categories/:slug
 * One category plus its full treatment menu and category FAQs.
 */
router.get(
  '/categories/:slug',
  asyncHandler(async (req, res) => {
    const category = await db('service_categories')
      .where({ slug: req.params.slug, is_active: true })
      .first();

    if (!category) throw new ApiError(404, 'Service category not found');

    const [services, faqs] = await Promise.all([
      db('services')
        .join('service_categories', 'services.category_id', 'service_categories.id')
        .select(SERVICE_COLUMNS)
        .where({ 'services.category_id': category.id, 'services.is_active': true })
        .orderBy('services.sort_order', 'asc'),
      db('faqs')
        .select('id', 'question', 'answer')
        .where({ faq_group: category.slug, is_active: true })
        .orderBy('sort_order', 'asc'),
    ]);

    res.json({
      data: {
        ...shapeCategory(category),
        serviceCount: services.length,
        services: services.map(shapeService),
        faqs,
      },
    });
  })
);

/**
 * GET /api/services
 * Query: category, q, featured, page, limit, grouped
 * `grouped=true` returns categories with nested services — used by /services.
 */
router.get(
  '/services',
  asyncHandler(async (req, res) => {
    const { category, q, featured, grouped } = req.query;

    const baseQuery = () => {
      const builder = db('services')
        .join('service_categories', 'services.category_id', 'service_categories.id')
        .where('services.is_active', true)
        .andWhere('service_categories.is_active', true);

      if (category) builder.andWhere('service_categories.slug', category);
      if (featured === 'true') builder.andWhere('services.is_featured', true);
      if (q) {
        const term = `%${q}%`;
        builder.andWhere((sub) => {
          sub.where('services.name', 'like', term).orWhere('services.summary', 'like', term);
        });
      }
      return builder;
    };

    if (grouped === 'true') {
      const [categories, services] = await Promise.all([
        db('service_categories').where('is_active', true).orderBy('sort_order', 'asc'),
        baseQuery()
          .select(SERVICE_COLUMNS)
          .orderBy('service_categories.sort_order', 'asc')
          .orderBy('services.sort_order', 'asc'),
      ]);

      const shaped = services.map(shapeService);
      const data = categories
        .map((cat) => ({
          ...shapeCategory(cat),
          services: shaped.filter((s) => s.category.slug === cat.slug),
        }))
        .filter((cat) => cat.services.length > 0);

      return res.json({ data, meta: { total: shaped.length, categories: data.length } });
    }

    const { page, limit, offset } = parsePagination(req.query, { defaultLimit: 100 });

    const [rows, [{ count }]] = await Promise.all([
      baseQuery()
        .select(SERVICE_COLUMNS)
        .orderBy('service_categories.sort_order', 'asc')
        .orderBy('services.sort_order', 'asc')
        .limit(limit)
        .offset(offset),
      baseQuery().count({ count: 'services.id' }),
    ]);

    res.json({
      data: rows.map(shapeService),
      meta: { page, limit, total: Number(count), pages: Math.ceil(Number(count) / limit) },
    });
  })
);

/**
 * GET /api/services/:slug
 * One treatment, its category FAQs, and sibling treatments for cross-linking.
 */
router.get(
  '/services/:slug',
  asyncHandler(async (req, res) => {
    const row = await db('services')
      .join('service_categories', 'services.category_id', 'service_categories.id')
      .select([...SERVICE_COLUMNS, 'services.category_id'])
      .where({ 'services.slug': req.params.slug, 'services.is_active': true })
      .first();

    if (!row) throw new ApiError(404, 'Service not found');

    const [related, faqs] = await Promise.all([
      db('services')
        .join('service_categories', 'services.category_id', 'service_categories.id')
        .select(SERVICE_COLUMNS)
        .where({ 'services.category_id': row.category_id, 'services.is_active': true })
        .andWhereNot('services.id', row.id)
        .orderBy('services.sort_order', 'asc')
        .limit(4),
      db('faqs')
        .select('id', 'question', 'answer')
        .where({ faq_group: row.category_slug, is_active: true })
        .orderBy('sort_order', 'asc'),
    ]);

    res.json({
      data: { ...shapeService(row), related: related.map(shapeService), faqs },
    });
  })
);

module.exports = router;
