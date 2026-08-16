'use strict';

/**
 * Blog authoring endpoints.
 *
 *   GET    /api/admin/blog/posts        list every post, drafts included
 *   GET    /api/admin/blog/posts/:id    one post with all columns
 *   POST   /api/admin/blog/posts        create
 *   PUT    /api/admin/blog/posts/:id    update (send only what changes)
 *   DELETE /api/admin/blog/posts/:id    remove
 *   POST   /api/admin/blog/categories   create a category
 *
 * These write to the database, so they are gated behind a shared secret: send
 * `x-admin-key: <ADMIN_API_KEY>`. Set ADMIN_API_KEY in backend/.env. If it is
 * left blank the routes refuse every request rather than defaulting to open —
 * safer than silently exposing writes.
 *
 * The public, read-only blog endpoints stay in routes/blog.js.
 */

const express = require('express');
const { z } = require('zod');
const db = require('../db');
const { ApiError, asyncHandler } = require('../middleware/errors');

const router = express.Router();

const ADMIN_KEY = process.env.ADMIN_API_KEY || '';

/** Shared-secret gate. */
function requireAdmin(req, res, next) {
  if (!ADMIN_KEY) {
    return next(
      new ApiError(
        503,
        'Authoring API disabled: set ADMIN_API_KEY in backend/.env and restart.'
      )
    );
  }
  if (req.get('x-admin-key') !== ADMIN_KEY) {
    return next(new ApiError(401, 'Invalid or missing x-admin-key header.'));
  }
  return next();
}

router.use('/admin/blog', requireAdmin);

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 200);

const postSchema = z.object({
  title: z.string().trim().min(3).max(255),
  slug: z.string().trim().max(200).optional(),
  excerpt: z.string().trim().max(600).optional().or(z.literal('')),
  content: z.string().optional().or(z.literal('')),
  imageUrl: z.string().trim().max(255).optional().or(z.literal('')),
  imageAlt: z.string().trim().max(255).optional().or(z.literal('')),
  ogImage: z.string().trim().max(255).optional().or(z.literal('')),
  author: z.string().trim().max(120).optional(),
  categorySlug: z.string().trim().max(120).optional().or(z.literal('')),
  readMinutes: z.coerce.number().int().min(1).max(120).optional(),
  tags: z.array(z.string().max(60)).optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['draft', 'published']).optional(),
  publishedAt: z.string().optional().or(z.literal('')),
  metaTitle: z.string().trim().max(70).optional().or(z.literal('')),
  metaDescription: z.string().trim().max(160).optional().or(z.literal('')),
  focusKeyword: z.string().trim().max(120).optional().or(z.literal('')),
  canonicalUrl: z.string().trim().max(255).optional().or(z.literal('')),
  noindex: z.boolean().optional(),
});

const blank = (v) => (v === '' || v === undefined ? null : v);

/** Maps the API's camelCase body onto the table's snake_case columns. */
async function toRow(input, { partial = false } = {}) {
  const row = {};
  const set = (col, value) => {
    if (value !== undefined) row[col] = value;
  };

  set('title', input.title);
  set('slug', input.slug ? slugify(input.slug) : input.title ? slugify(input.title) : undefined);
  set('excerpt', blank(input.excerpt));
  set('content', blank(input.content));
  set('image_url', blank(input.imageUrl));
  set('cover_image', blank(input.imageUrl));
  set('image_alt', blank(input.imageAlt));
  set('og_image', blank(input.ogImage));
  set('author', input.author);
  set('read_minutes', input.readMinutes);
  set('is_featured', input.isFeatured);
  set('status', input.status);
  set('meta_title', blank(input.metaTitle));
  set('meta_description', blank(input.metaDescription));
  set('focus_keyword', blank(input.focusKeyword));
  set('canonical_url', blank(input.canonicalUrl));
  set('noindex', input.noindex);

  if (input.tags !== undefined) row.tags = JSON.stringify(input.tags);
  if (input.publishedAt !== undefined) row.published_at = blank(input.publishedAt);

  if (input.categorySlug !== undefined) {
    if (!input.categorySlug) {
      row.category_id = null;
    } else {
      const category = await db('blog_categories').where('slug', input.categorySlug).first();
      if (!category) throw new ApiError(422, `Unknown blog category "${input.categorySlug}"`);
      row.category_id = category.id;
    }
  }

  // A post published without an explicit date gets one now.
  if (!partial && row.status !== 'draft' && !row.published_at) {
    row.published_at = db.fn.now();
  }

  return row;
}

/** GET /api/admin/blog/posts — everything, drafts included. */
router.get(
  '/admin/blog/posts',
  asyncHandler(async (req, res) => {
    const rows = await db('blog_posts')
      .leftJoin('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
      .select('blog_posts.*', 'blog_categories.slug as category_slug')
      .orderBy('blog_posts.created_at', 'desc');

    res.json({ data: rows, meta: { total: rows.length } });
  })
);

/** GET /api/admin/blog/posts/:id */
router.get(
  '/admin/blog/posts/:id',
  asyncHandler(async (req, res) => {
    const row = await db('blog_posts').where('id', req.params.id).first();
    if (!row) throw new ApiError(404, 'Post not found');
    res.json({ data: row });
  })
);

/** POST /api/admin/blog/posts */
router.post(
  '/admin/blog/posts',
  asyncHandler(async (req, res) => {
    const input = postSchema.parse(req.body);
    const row = await toRow(input);

    const clash = await db('blog_posts').where('slug', row.slug).first();
    if (clash) throw new ApiError(409, `A post with the slug "${row.slug}" already exists.`);

    const [id] = await db('blog_posts').insert(row);
    const created = await db('blog_posts').where('id', id).first();

    res.status(201).json({ data: created });
  })
);

/** PUT /api/admin/blog/posts/:id — send only the fields that change. */
router.put(
  '/admin/blog/posts/:id',
  asyncHandler(async (req, res) => {
    const existing = await db('blog_posts').where('id', req.params.id).first();
    if (!existing) throw new ApiError(404, 'Post not found');

    const input = postSchema.partial().parse(req.body);
    const row = await toRow(input, { partial: true });

    if (row.slug && row.slug !== existing.slug) {
      const clash = await db('blog_posts').where('slug', row.slug).first();
      if (clash) throw new ApiError(409, `A post with the slug "${row.slug}" already exists.`);
    }

    if (Object.keys(row).length) await db('blog_posts').where('id', existing.id).update(row);
    const updated = await db('blog_posts').where('id', existing.id).first();

    res.json({ data: updated });
  })
);

/** DELETE /api/admin/blog/posts/:id */
router.delete(
  '/admin/blog/posts/:id',
  asyncHandler(async (req, res) => {
    const deleted = await db('blog_posts').where('id', req.params.id).del();
    if (!deleted) throw new ApiError(404, 'Post not found');
    res.json({ data: { id: Number(req.params.id), deleted: true } });
  })
);

/** POST /api/admin/blog/categories */
router.post(
  '/admin/blog/categories',
  asyncHandler(async (req, res) => {
    const input = z
      .object({
        name: z.string().trim().min(2).max(160),
        slug: z.string().trim().max(120).optional(),
        description: z.string().trim().max(500).optional().or(z.literal('')),
      })
      .parse(req.body);

    const slug = slugify(input.slug || input.name);
    const clash = await db('blog_categories').where('slug', slug).first();
    if (clash) throw new ApiError(409, `A category with the slug "${slug}" already exists.`);

    const [id] = await db('blog_categories').insert({
      slug,
      name: input.name,
      description: blank(input.description),
    });

    res.status(201).json({ data: await db('blog_categories').where('id', id).first() });
  })
);

module.exports = router;
