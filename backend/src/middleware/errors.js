'use strict';

const { ZodError } = require('zod');
const config = require('../config');

class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const notFound = (req, res, next) => {
  next(new ApiError(404, `No route matches ${req.method} ${req.originalUrl}`));
};

/** Wraps an async handler so rejected promises reach the error middleware. */
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity.
const errorHandler = (err, req, res, next) => {
  if (err instanceof ZodError) {
    return res.status(422).json({
      error: 'Validation failed',
      details: err.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const status = err.status || 500;
  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({
    error: status >= 500 && config.env === 'production' ? 'Internal server error' : err.message,
    ...(err.details ? { details: err.details } : {}),
  });
};

module.exports = { ApiError, asyncHandler, notFound, errorHandler };
