'use strict';

/**
 * Image uploads for the blog admin.
 *
 *   POST /api/admin/blog/upload   { dataUrl, filename }
 *
 * The browser reads the chosen file as a data URL and posts it here. We decode
 * it, write a real file into backend/uploads/, and return the public URL to
 * store against the post — the blog_posts.image_url column is only 255
 * characters, so the image itself can never live in the database.
 *
 * Files are served back by Express at /uploads/<name> (see app.js).
 */

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const express = require('express');
const { z } = require('zod');
const { ApiError, asyncHandler } = require('../middleware/errors');

const router = express.Router();

const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads');
const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

const EXTENSIONS = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const uploadSchema = z.object({
  dataUrl: z.string().min(20),
  filename: z.string().trim().max(200).optional(),
});

/** "my Photo.JPG" -> "my-photo" */
const slugifyName = (name) =>
  path
    .parse(name || 'image')
    .name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

router.post(
  '/admin/blog/upload',
  asyncHandler(async (req, res) => {
    const { dataUrl, filename } = uploadSchema.parse(req.body);

    const match = /^data:([a-zA-Z0-9/+.-]+);base64,(.+)$/s.exec(dataUrl);
    if (!match) throw new ApiError(422, 'Expected a base64 data URL.');

    const [, mime, base64] = match;
    const extension = EXTENSIONS[mime.toLowerCase()];
    if (!extension) {
      throw new ApiError(
        422,
        `Unsupported image type "${mime}". Use JPG, PNG, WebP, GIF or AVIF.`
      );
    }

    const buffer = Buffer.from(base64, 'base64');
    if (!buffer.length) throw new ApiError(422, 'The image data could not be read.');
    if (buffer.length > MAX_BYTES) {
      throw new ApiError(
        413,
        `That image is ${(buffer.length / 1024 / 1024).toFixed(1)} MB. The limit is 8 MB.`
      );
    }

    fs.mkdirSync(UPLOAD_DIR, { recursive: true });

    // Random suffix keeps same-named uploads from overwriting each other.
    const name = `${slugifyName(filename)}-${crypto.randomBytes(4).toString('hex')}${extension}`;
    fs.writeFileSync(path.join(UPLOAD_DIR, name), buffer);

    // Absolute URL, so it resolves whichever origin the site is served from.
    const origin = process.env.PUBLIC_API_URL || `${req.protocol}://${req.get('host')}`;

    res.status(201).json({
      data: {
        url: `${origin}/uploads/${name}`,
        path: `/uploads/${name}`,
        bytes: buffer.length,
        type: mime,
      },
    });
  })
);

module.exports = router;
