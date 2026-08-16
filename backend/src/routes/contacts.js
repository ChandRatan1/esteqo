'use strict';

/**
 * Website form intake.
 *
 * POST /api/contacts stores one row per submission in `contacts`, with a column
 * for every field the visitor can fill in. The contact form, the appointment
 * request and the newsletter signup all land here, distinguished by form_type.
 *
 * GET routes are read-only reporting helpers for whoever manages enquiries.
 */

const express = require('express');
const rateLimit = require('express-rate-limit');
const { z } = require('zod');
const db = require('../db');
const config = require('../config');
const { ApiError, asyncHandler } = require('../middleware/errors');
const { generateReference, clientIp, parsePagination } = require('../utils');

const router = express.Router();

const writeLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
});

// Mirrors the browser-side rules in react-app/src/utils/validation.js so a
// direct POST cannot bypass them.
const NAME = /^[A-Za-z\s.'-]+$/;
const SUBJECT = /^[A-Za-z\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

const optionalText = (max) => z.string().trim().max(max).optional().or(z.literal(''));

const contactSchema = z.object({
  formType: z.enum(['contact', 'appointment', 'newsletter']).default('contact'),

  fullName: z
    .string()
    .trim()
    .min(2, 'Please enter your name')
    .max(40, 'Name cannot exceed 40 characters')
    .regex(NAME, 'Name can only contain letters')
    .optional()
    .or(z.literal('')),

  email: z
    .string()
    .trim()
    .max(50, 'Email cannot exceed 50 characters')
    .regex(EMAIL, 'Enter a valid email address')
    .optional()
    .or(z.literal('')),

  phone: z
    .string()
    .trim()
    .max(13, 'Mobile number cannot exceed 13 characters')
    .regex(/^\+?\d{10,13}$/, 'Mobile number can only contain numbers')
    .optional()
    .or(z.literal('')),

  location: optionalText(120),
  serviceSlug: optionalText(160),
  serviceName: optionalText(200),
  servicePrice: optionalText(60),
  categorySlug: optionalText(120),

  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD')
    .optional()
    .or(z.literal('')),
  preferredTime: optionalText(40),

  contactMethod: z.enum(['call', 'whatsapp', 'email', 'sms']).default('call'),

  subject: z
    .string()
    .trim()
    .max(50, 'Subject cannot exceed 50 characters')
    .regex(SUBJECT, 'Subject can only contain letters')
    .optional()
    .or(z.literal('')),

  message: optionalText(350),

  sourcePage: optionalText(255),

  // Offer badge / one-time popup. Amount is fixed server-side below, so a
  // crafted request cannot claim an arbitrary discount.
  offerCode: optionalText(40),
  offerSource: z.enum(['badge', 'popup', 'page']).optional(),
  emailSent: z.boolean().optional(),

  // Honeypot — real visitors never fill this in.
  website: z.string().max(0).optional(),
});

/**
 * Active offers, keyed by code. The value here is authoritative — the browser
 * sends only the code.
 */
const OFFERS = {
  WELCOME500: { code: 'WELCOME500', price: 500, label: '₹500 off your first treatment' },
};

const blank = (value) => (value === '' || value === undefined ? null : value);

/** Per-form required fields, beyond the shared rules above. */
function assertRequired(input) {
  const missing = [];

  if (input.formType === 'newsletter') {
    if (!input.email) missing.push({ field: 'email', message: 'Please enter your email address' });
  } else {
    if (!input.fullName) missing.push({ field: 'fullName', message: 'Please enter your name' });
    if (!input.email) missing.push({ field: 'email', message: 'Please enter your email address' });
    if (!input.phone) missing.push({ field: 'phone', message: 'Please enter your mobile number' });
  }

  if (input.formType === 'appointment') {
    if (!input.location) missing.push({ field: 'location', message: 'Please choose your location' });
    if (!input.preferredDate) missing.push({ field: 'preferredDate', message: 'Please choose a date' });
    if (!input.preferredTime) missing.push({ field: 'preferredTime', message: 'Please choose a time' });
  }

  if (input.formType === 'contact' && !input.message) {
    missing.push({ field: 'message', message: 'Please add a short message' });
  }

  if (missing.length) throw new ApiError(422, 'Validation failed', missing);
}

/** POST /api/contacts — stores a submission. */
router.post(
  '/contacts',
  writeLimiter,
  asyncHandler(async (req, res) => {
    const input = contactSchema.parse(req.body);

    // Honeypot tripped: accept quietly so the bot sees success, flag the row.
    const isSpam = Boolean(req.body.website);

    if (!isSpam) assertRequired(input);

    const reference = generateReference();

    // The discount is looked up from the server's own table — never taken from
    // the request body.
    const offer = OFFERS[input.offerCode] || null;
    const offerColumns = offer
      ? {
          offer_price: offer.price,
          offer_code: offer.code,
          offer_label: offer.label,
          offer_source: input.offerSource || 'page',
        }
      : {};

    const [id] = await db('contacts').insert({
      form_type: input.formType,
      reference,
      full_name: blank(input.fullName),
      email: blank(input.email) ? input.email.toLowerCase() : null,
      phone: blank(input.phone),
      location: blank(input.location),
      service_slug: blank(input.serviceSlug),
      service_name: blank(input.serviceName),
      service_price: blank(input.servicePrice),
      category_slug: blank(input.categorySlug),
      preferred_date: blank(input.preferredDate),
      preferred_time: blank(input.preferredTime),
      contact_method: input.contactMethod,
      subject: blank(input.subject),
      message: blank(input.message),
      source_page: blank(input.sourcePage) || req.get('referer') || null,
      referrer: req.get('referer') || null,
      ip_address: clientIp(req),
      user_agent: (req.get('user-agent') || '').slice(0, 255) || null,
      captcha_passed: true,
      is_spam: isSpam,
      email_sent: Boolean(input.emailSent),
      status: 'new',
      ...offerColumns,
    });

    res.status(201).json({
      data: {
        id,
        reference,
        stored: true,
        message: input.fullName
          ? `Thank you, ${input.fullName.split(' ')[0]}. We have received your enquiry and will be in touch shortly.`
          : 'Thank you — we have received your enquiry.',
      },
    });
  })
);

/**
 * GET /api/contacts — recent submissions.
 * Query: formType, status, page, limit
 */
router.get(
  '/contacts',
  asyncHandler(async (req, res) => {
    const { page, limit, offset } = parsePagination(req.query, { defaultLimit: 25 });

    const base = () => {
      const q = db('contacts').where('is_spam', false);
      if (req.query.formType) q.andWhere('form_type', req.query.formType);
      if (req.query.status) q.andWhere('status', req.query.status);
      return q;
    };

    const [rows, [{ count }]] = await Promise.all([
      base().select('*').orderBy('created_at', 'desc').limit(limit).offset(offset),
      base().count({ count: 'id' }),
    ]);

    res.json({
      data: rows,
      meta: { page, limit, total: Number(count), pages: Math.ceil(Number(count) / limit) },
    });
  })
);

/** GET /api/contacts/stats — counts by form type and status. */
router.get(
  '/contacts/stats',
  asyncHandler(async (req, res) => {
    const rows = await db('contacts')
      .select('form_type', 'status')
      .count({ count: 'id' })
      .where('is_spam', false)
      .groupBy('form_type', 'status');

    res.json({ data: rows.map((r) => ({ ...r, count: Number(r.count) })) });
  })
);

module.exports = router;
