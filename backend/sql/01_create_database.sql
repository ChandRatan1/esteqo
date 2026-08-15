-- ESTEQO — database creation (MySQL 8)
-- Run this first, then 02_schema.sql, then start the API.
--
--   mysql -u root -p < sql/01_create_database.sql

CREATE DATABASE IF NOT EXISTS `esteqo`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Optional: a least-privilege application user.
-- CREATE USER IF NOT EXISTS 'esteqo_app'@'localhost' IDENTIFIED BY 'change-me';
-- GRANT SELECT, INSERT, UPDATE, DELETE ON `esteqo`.* TO 'esteqo_app'@'localhost';
-- FLUSH PRIVILEGES;

USE `esteqo`;
