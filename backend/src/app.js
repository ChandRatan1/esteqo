'use strict';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const config = require('./config');
const db = require('./db');
const { notFound, errorHandler, asyncHandler } = require('./middleware/errors');

const servicesRouter = require('./routes/services');
const blogRouter = require('./routes/blog');
const siteRouter = require('./routes/site');
const enquiriesRouter = require('./routes/enquiries');

const app = express();

app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin(origin, callback) {
      // Same-origin requests and tools like curl send no Origin header.
      if (!origin || config.corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
  })
);

if (config.env !== 'test') {
  app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
}

app.get(
  '/api/health',
  asyncHandler(async (req, res) => {
    await db.raw('SELECT 1');
    res.json({ status: 'ok', env: config.env, database: 'connected' });
  })
);

app.use('/api', servicesRouter);
app.use('/api', blogRouter);
app.use('/api', siteRouter);
app.use('/api', enquiriesRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
