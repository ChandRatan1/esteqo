'use strict';

const express = require('express');
const db = require('../db');
const { ApiError, asyncHandler } = require('../middleware/errors');
const { toArray, toBool, parsePagination } = require('../utils');

const router = express.Router();

const POST_COLUMNS = [
  'blog_posts.id',
  'blog_posts.slug',
  'blog_posts.title',
  'blog_posts.excerpt',
  'blog_posts.cover_image',
  'blog_posts.author',
  'blog_posts.read_minutes',
  'blog_posts.tags',
  'blog_posts.is_featured',
  'blog_posts.published_at',
  'blog_categories.slug as category_slug',
  'blog_categories.name as category_name',
];

const shapePost = (row, { withContent = false } = {}) => ({
  id: row.id,
  slug: row.slug,
  title: row.title,
  excerpt: row.excerpt,
  ...(withContent ? { content: row.content } : {}),
  coverImage: row.cover_image,
  author: row.author,
  readMinutes: row.read_minutes,
  tags: toArray(row.tags),
  isFeatured: toBool(row.is_featured),
  publishedAt: row.published_at,
  category: row.category_slug ? { slug: row.category_slug, name: row.category_name } : null,
});

/** GET /api/blog/categories */
router.get(
  '/blog/categories',
  asyncHandler(async (req, res) => {
    const rows = await db('blog_categories')
      .select(
        'blog_categories.id',
        'blog_categories.slug',
        'blog_categories.name',
        'blog_categories.description',
        db.raw(
          "(SELECT COUNT(*) FROM blog_posts WHERE blog_posts.category_id = blog_categories.id " +
            "AND blog_posts.status = 'published') AS post_count"
        )
      )
      .orderBy('blog_categories.name', 'asc');

    res.json({
      data: rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        postCount: Number(r.post_count),
      })),
    });
  })
);

/**
 * GET /api/blog/posts
 * Query: category, q, featured, page, limit
 */
router.get(
  '/blog/posts',
  asyncHandler(async (req, res) => {
    const { category, q, featured } = req.query;
    const { page, limit, offset } = parsePagination(req.query, { defaultLimit: 9 });

    const baseQuery = () => {
      const builder = db('blog_posts')
        .leftJoin('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
        .where('blog_posts.status', 'published');

      if (category) builder.andWhere('blog_categories.slug', category);
      if (featured === 'true') builder.andWhere('blog_posts.is_featured', true);
      if (q) {
        const term = `%${q}%`;
        builder.andWhere((sub) => {
          sub
            .where('blog_posts.title', 'like', term)
            .orWhere('blog_posts.excerpt', 'like', term);
        });
      }
      return builder;
    };

    const [rows, [{ count }]] = await Promise.all([
      baseQuery()
        .select(POST_COLUMNS)
        .orderBy('blog_posts.published_at', 'desc')
        .limit(limit)
        .offset(offset),
      baseQuery().count({ count: 'blog_posts.id' }),
    ]);

    res.json({
      data: rows.map((row) => shapePost(row)),
      meta: { page, limit, total: Number(count), pages: Math.ceil(Number(count) / limit) },
    });
  })
);

/** GET /api/blog/posts/:slug — post with body plus three recent siblings. */
router.get(
  '/blog/posts/:slug',
  asyncHandler(async (req, res) => {
    const row = await db('blog_posts')
      .leftJoin('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
      .select([...POST_COLUMNS, 'blog_posts.content'])
      .where({ 'blog_posts.slug': req.params.slug, 'blog_posts.status': 'published' })
      .first();

    if (!row) throw new ApiError(404, 'Post not found');

    const related = await db('blog_posts')
      .leftJoin('blog_categories', 'blog_posts.category_id', 'blog_categories.id')
      .select(POST_COLUMNS)
      .where('blog_posts.status', 'published')
      .andWhereNot('blog_posts.id', row.id)
      .orderBy('blog_posts.published_at', 'desc')
      .limit(3);

    res.json({
      data: {
        ...shapePost(row, { withContent: true }),
        related: related.map((r) => shapePost(r)),
      },
    });
  })
);

module.exports = router;
