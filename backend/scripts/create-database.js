'use strict';

/**
 * Creates the ESTEQO database if it does not exist.
 * Connects without a database selected, so it works on a fresh MySQL install.
 *
 *   npm run db:create
 */

const mysql = require('mysql2/promise');
const config = require('../src/config');

async function main() {
  const { host, port, user, password, database } = config.db;

  if (!/^[A-Za-z0-9_]+$/.test(database)) {
    throw new Error(`Unsafe database name in DB_NAME: "${database}"`);
  }

  const connection = await mysql.createConnection({ host, port, user, password });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${database}\` ` +
        'CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci'
    );
    console.log(`Database "${database}" is ready on ${host}:${port}.`);
  } finally {
    await connection.end();
  }
}

main().catch((error) => {
  console.error('Failed to create database:', error.message);
  process.exit(1);
});
