'use strict';

/**
 * MySQL JSON columns come back as parsed values on some driver versions and as
 * strings on others. Normalise to an array either way.
 */
const toArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

/** Booleans are stored as TINYINT(1). */
const toBool = (value) => Boolean(value);

const parsePagination = (query, { defaultLimit = 12, maxLimit = 100 } = {}) => {
  const page = Math.max(1, Number.parseInt(query.page, 10) || 1);
  const requested = Number.parseInt(query.limit, 10) || defaultLimit;
  const limit = Math.min(Math.max(1, requested), maxLimit);
  return { page, limit, offset: (page - 1) * limit };
};

/** Human-readable booking reference, e.g. ESQ-8F3K2Q. */
const generateReference = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `ESQ-${code}`;
};

const clientIp = (req) =>
  (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || null;

module.exports = { toArray, toBool, parsePagination, generateReference, clientIp };
