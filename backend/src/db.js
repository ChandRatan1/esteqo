'use strict';

const knexFactory = require('knex');
const config = require('./config');
const knexConfig = require('../knexfile');

const db = knexFactory(knexConfig[config.env] || knexConfig.development);

module.exports = db;
