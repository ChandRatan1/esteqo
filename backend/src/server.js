'use strict';

const app = require('./app');
const config = require('./config');
const db = require('./db');

const server = app.listen(config.port, () => {
  console.log(`ESTEQO API listening on http://localhost:${config.port} (${config.env})`);
  console.log(`Allowed origins: ${config.corsOrigins.join(', ')}`);
});

const shutdown = (signal) => async () => {
  console.log(`\n${signal} received, shutting down.`);
  server.close(async () => {
    await db.destroy();
    process.exit(0);
  });
};

process.on('SIGINT', shutdown('SIGINT'));
process.on('SIGTERM', shutdown('SIGTERM'));
