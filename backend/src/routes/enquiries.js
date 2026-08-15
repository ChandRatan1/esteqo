'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const db = require('../db');
const config = require('../config');
const { ApiError, asyncHandler } = require('../middleware/errors');
const { generateReference, clientIp } = require('../utils');

const router = express.Router();

// Public write endpoints are the only abuse surface on this API.
const writeLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

const phone = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number')
  .max(40)
  .regex(/^[+]?[0-9\s()-]{7,40}$/, 'Enter a valid phone number');

const appointmentSchema = z.object({
  fullName: z.string().trim().min(2, 'Please tell us your name').max(160),
  email: z.string().trim().email('Enter a valid email address').max(200).optional().or(z.literal('')),
  phone,
  serviceSlug: z.string().trim().max(160).optional().or(z.literal('')),
  categorySlug: z.string().trim().max(120).optional().or(z.literal('')),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD').optional().or(z.literal('')),
  preferredTime: z.string().trim().max(20).optional().or(z.literal('')),
  contactMethod: z.enum(['call', 'whatsapp', 'email', 'sms']).default('call'),
  message: z.string().trim().max(2000).optional().or(z.literal('')),
  // Honeypot: real visitors never fill this in.
  website: z.string().max(0).optional(),
});

const contactSchema = z.object({
  fullName: z.string().trim().min(2, 'Please tell us your name').max(160),
  email: z.string().trim().email('Enter a valid email address').max(200).optional().or(z.literal('')),
  phone: phone.optional().or(z.literal('')),
  subject: z.string().trim().max(255).optional().or(z.literal('')),
  message: z.string().trim().min(5, 'Please add a short message').max(2000),
  contactMethod: z.enum(['call', 'whatsapp', 'email', 'sms']).default('email'),
  website: z.string().max(0).optional(),
});

const newsletterSchema = z.object({
  email: z.string().trim().email('Enter a valid email address').max(200),
  source: z.string().trim().max(60).optional(),
});

const blank = (value) => (value === '' || value === undefined ? null : value);

/** POST /api/appointments — books an enquiry and returns a reference. */
router.post(
  '/appointments',
  writeLimiter,
  asyncHandler(async (req, res) => {
    const input = appointmentSchema.parse(req.body);

    if (!input.email && input.contactMethod === 'email') {
      throw new ApiError(422, 'An email address is required when you ask to be contacted by email.');
    }

    const [service, category] = await Promise.all([
      input.serviceSlug ? db('services').select('id', 'category_id').where('slug', input.serviceSlug).first() : null,
      input.categorySlug ? db('service_categories').select('id').where('slug', input.categorySlug).first() : null,
    ]);

    if (input.serviceSlug && !service) throw new ApiError(422, 'That service is no longer available.');

    const reference = generateReference();

    const [id] = await db('appointments').insert({
      reference,
      full_name: input.fullName,
      email: blank(input.email),
      phone: input.phone,
      service_id: service ? service.id : null,
      category_id: category ? category.id : service ? service.category_id : null,
      preferred_date: blank(input.preferredDate),
      preferred_time: blank(input.preferredTime),
      contact_method: input.contactMethod,
      message: blank(input.message),
      status: 'new',
      ip_address: clientIp(req),
    });

    res.status(201).json({
      data: {
        id,
        reference,
        message: `Thank you, ${input.fullName.split(' ')[0]}. We will confirm your slot shortly.`,
      },
    });
  })
);

/** POST /api/contact */
router.post(
  '/contact',
  writeLimiter,
  asyncHandler(async (req, res) => {
    const input = contactSchema.parse(req.body);

    if (!input.email && !input.phone) {
      throw new ApiError(422, 'Please leave either an email address or a phone number.');
    }

    const [id] = await db('contact_messages').insert({
      full_name: input.fullName,
      email: blank(input.email),
      phone: blank(input.phone),
      subject: blank(input.subject),
      message: input.message,
      contact_method: input.contactMethod,
      ip_address: clientIp(req),
    });

    res.status(201).json({ data: { id, message: 'Thank you — we will be in touch soon.' } });
  })
);

/** POST /api/newsletter — idempotent; re-subscribing reactivates the row. */
router.post(
  '/newsletter',
  writeLimiter,
  asyncHandler(async (req, res) => {
    const input = newsletterSchema.parse(req.body);
    const email = input.email.toLowerCase();

    const existing = await db('newsletter_subscribers').where('email', email).first();

    if (existing) {
      if (!existing.is_active) {
        await db('newsletter_subscribers').where('id', existing.id).update({ is_active: true });
      }
      return res.status(200).json({ data: { message: 'You are on the list.' } });
    }

    await db('newsletter_subscribers').insert({
      email,
      source: input.source || 'footer',
    });

    res.status(201).json({ data: { message: 'Thank you for subscribing.' } });
  })
);

module.exports = router;
