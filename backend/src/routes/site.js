'use strict';

const express = require('express');
const db = require('../db');
const { asyncHandler } = require('../middleware/errors');

const router = express.Router();

/**
 * GET /api/settings
 * Contact details, brand copy and social links, grouped by setting_group.
 */
router.get(
  '/settings',
  asyncHandler(async (req, res) => {
    const rows = await db('site_settings').select('setting_key', 'setting_value', 'setting_group');

    const data = {};
    for (const row of rows) {
      data[row.setting_group] = data[row.setting_group] || {};
      data[row.setting_group][row.setting_key] = row.setting_value;
    }

    res.json({ data });
  })
);

/** GET /api/testimonials */
router.get(
  '/testimonials',
  asyncHandler(async (req, res) => {
    const rows = await db('testimonials')
      .select('id', 'author', 'location', 'treatment', 'quote', 'rating')
      .where('is_active', true)
      .orderBy('sort_order', 'asc');

    res.json({ data: rows });
  })
);

/**
 * GET /api/faqs
 * Query: group (defaults to every group, keyed by faq_group)
 */
router.get(
  '/faqs',
  asyncHandler(async (req, res) => {
    const query = db('faqs')
      .select('id', 'faq_group', 'question', 'answer')
      .where('is_active', true)
      .orderBy('faq_group', 'asc')
      .orderBy('sort_order', 'asc');

    if (req.query.group) query.andWhere('faq_group', req.query.group);

    const rows = await query;

    if (req.query.group) return res.json({ data: rows });

    const grouped = rows.reduce((acc, row) => {
      acc[row.faq_group] = acc[row.faq_group] || [];
      acc[row.faq_group].push({ id: row.id, question: row.question, answer: row.answer });
      return acc;
    }, {});

    res.json({ data: grouped });
  })
);

/** GET /api/team */
router.get(
  '/team',
  asyncHandler(async (req, res) => {
    const rows = await db('team_members')
      .select('id', 'slug', 'name', 'role', 'bio', 'photo')
      .where('is_active', true)
      .orderBy('sort_order', 'asc');

    res.json({ data: rows });
  })
);

module.exports = router;
