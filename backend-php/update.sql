-- ESTEQO - update an existing database
--
-- USE THIS when the database already exists and needs bringing up to date --
-- for example a live site installed before the SEO or offer columns were added.
--
-- WHAT IT DOES
--   1. Creates any table that is missing.
--   2. Adds any column that is missing from a table that already exists.
--
-- WHAT IT NEVER DOES
--   No DROP, no DELETE, no TRUNCATE. Existing rows, blog posts and enquiries
--   are untouched, and no column is modified or removed.
--
-- SAFE TO RUN ANY NUMBER OF TIMES. Every change is checked first, so running it
-- against an already-current database does nothing at all.
--
-- HOW TO USE
--   hPanel -> phpMyAdmin -> select your database -> Import -> this file.
--
-- Safe alongside WordPress: none of these names collide with wp_*.

SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------------
-- 1. Create any missing tables (identical to install.sql)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `appointments` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `reference` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  `service_id` int unsigned DEFAULT NULL,
  `category_id` int unsigned DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `preferred_time` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_method` enum('call','whatsapp','email','sms') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'call',
  `message` text COLLATE utf8mb4_unicode_ci,
  `status` enum('new','confirmed','completed','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `source` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'website',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointments_reference_unique` (`reference`),
  KEY `idx_appointments_status_date` (`status`,`preferred_date`),
  KEY `appointments_service_id_foreign` (`service_id`),
  KEY `appointments_category_id_foreign` (`category_id`),
  CONSTRAINT `appointments_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `appointments_service_id_foreign` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned DEFAULT NULL,
  `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `excerpt` varchar(600) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `content` longtext COLLATE utf8mb4_unicode_ci,
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `author` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ESTEQO',
  `read_minutes` int unsigned NOT NULL DEFAULT '4',
  `tags` json DEFAULT NULL,
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('draft','published') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'published',
  `published_at` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_title` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `focus_keyword` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `og_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sitemap_priority` decimal(2,1) NOT NULL DEFAULT '0.7',
  `sitemap_changefreq` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `noindex` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  KEY `idx_posts_status_published` (`status`,`published_at`),
  KEY `blog_posts_category_id_foreign` (`category_id`),
  CONSTRAINT `blog_posts_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contact_messages` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `full_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_method` enum('call','whatsapp','email','sms') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'email',
  `is_handled` tinyint(1) NOT NULL DEFAULT '0',
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `contacts` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `form_type` enum('contact','appointment','newsletter') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'contact',
  `reference` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `full_name` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_slug` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `service_price` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_slug` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `preferred_time` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contact_method` enum('call','whatsapp','email','sms') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'call',
  `subject` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `message` varchar(350) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `source_page` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `referrer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `captcha_passed` tinyint(1) NOT NULL DEFAULT '1',
  `is_spam` tinyint(1) NOT NULL DEFAULT '0',
  `email_sent` tinyint(1) NOT NULL DEFAULT '0',
  `status` enum('new','read','responded','booked','closed') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new',
  `admin_notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `offer_price` decimal(10,2) DEFAULT NULL,
  `offer_code` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `offer_label` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `offer_source` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_contacts_reference` (`reference`),
  KEY `idx_contacts_type_status` (`form_type`,`status`),
  KEY `idx_contacts_created` (`created_at`),
  KEY `idx_contacts_email` (`email`),
  KEY `idx_contacts_phone` (`phone`),
  KEY `idx_contacts_offer_code` (`offer_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `faqs` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `faq_group` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `question` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `answer` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_faqs_group_sort` (`faq_group`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `source` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'footer',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_subscribers_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `service_categories` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intro` text COLLATE utf8mb4_unicode_ci,
  `accent` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'cream',
  `icon` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hero_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `meta_title` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sitemap_priority` decimal(2,1) NOT NULL DEFAULT '0.8',
  `sitemap_changefreq` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `noindex` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_categories_slug_unique` (`slug`),
  KEY `idx_categories_active_sort` (`is_active`,`sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `services` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int unsigned NOT NULL,
  `slug` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `summary` text COLLATE utf8mb4_unicode_ci,
  `description` text COLLATE utf8mb4_unicode_ci,
  `bullets` json DEFAULT NULL,
  `what_to_expect` json DEFAULT NULL,
  `safe_painless` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `skin_body_face` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tests_consulting` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ideal_for` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `duration_minutes` int unsigned DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_featured` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `meta_title` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `meta_description` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sitemap_priority` decimal(2,1) NOT NULL DEFAULT '0.8',
  `sitemap_changefreq` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'monthly',
  `noindex` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_unique` (`slug`),
  KEY `idx_services_category_sort` (`category_id`,`sort_order`),
  KEY `idx_services_active_featured` (`is_active`,`is_featured`),
  CONSTRAINT `services_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `site_settings` (
  `setting_key` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_group` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'general',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `team_members` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_unicode_ci,
  `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_members_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `author` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL,
  `location` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `treatment` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `quote` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `rating` tinyint unsigned NOT NULL DEFAULT '5',
  `sort_order` int unsigned NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- 2. Add any column missing from a table that already exists
--
-- Each block asks information_schema whether the column is there, and only
-- builds an ALTER when it is not. Running this twice is harmless.
-- ---------------------------------------------------------------------------

-- appointments
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'reference') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `reference` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'full_name') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `full_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'email') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'phone') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `phone` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'service_id') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `service_id` int unsigned DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'category_id') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `category_id` int unsigned DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'preferred_date') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `preferred_date` date DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'preferred_time') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `preferred_time` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'contact_method') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `contact_method` enum(''call'',''whatsapp'',''email'',''sms'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''call''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'message') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `message` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'status') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `status` enum(''new'',''confirmed'',''completed'',''cancelled'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''new''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'source') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `source` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''website''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'ip_address') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'appointments'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `appointments` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- blog_categories
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_categories'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `blog_categories` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_categories'
       AND COLUMN_NAME  = 'slug') = 0,
  'ALTER TABLE `blog_categories` ADD COLUMN `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_categories'
       AND COLUMN_NAME  = 'name') = 0,
  'ALTER TABLE `blog_categories` ADD COLUMN `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_categories'
       AND COLUMN_NAME  = 'description') = 0,
  'ALTER TABLE `blog_categories` ADD COLUMN `description` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_categories'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `blog_categories` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_categories'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `blog_categories` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- blog_posts
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'category_id') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `category_id` int unsigned DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'slug') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `slug` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'title') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'excerpt') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `excerpt` varchar(600) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'content') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `content` longtext COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'cover_image') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'author') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `author` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''ESTEQO''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'read_minutes') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `read_minutes` int unsigned NOT NULL DEFAULT ''4''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'tags') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `tags` json DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'is_featured') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `is_featured` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'status') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `status` enum(''draft'',''published'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''published''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'published_at') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `published_at` datetime DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'image_url') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `image_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'image_alt') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'meta_title') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `meta_title` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'meta_description') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `meta_description` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'focus_keyword') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `focus_keyword` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'canonical_url') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'og_image') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `og_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'sitemap_priority') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `sitemap_priority` decimal(2,1) NOT NULL DEFAULT ''0.7''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'sitemap_changefreq') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `sitemap_changefreq` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''monthly''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'blog_posts'
       AND COLUMN_NAME  = 'noindex') = 0,
  'ALTER TABLE `blog_posts` ADD COLUMN `noindex` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- contact_messages
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'full_name') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `full_name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'email') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `email` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'phone') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `phone` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'subject') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `subject` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'message') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `message` text COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'contact_method') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `contact_method` enum(''call'',''whatsapp'',''email'',''sms'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''email''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'is_handled') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `is_handled` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'ip_address') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contact_messages'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `contact_messages` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- contacts
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'form_type') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `form_type` enum(''contact'',''appointment'',''newsletter'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''contact''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'reference') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `reference` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'full_name') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `full_name` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'email') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `email` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'phone') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `phone` varchar(13) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'location') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `location` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'service_slug') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `service_slug` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'service_name') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `service_name` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'service_price') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `service_price` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'category_slug') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `category_slug` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'preferred_date') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `preferred_date` date DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'preferred_time') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `preferred_time` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'contact_method') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `contact_method` enum(''call'',''whatsapp'',''email'',''sms'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''call''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'subject') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `subject` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'message') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `message` varchar(350) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'source_page') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `source_page` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'referrer') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `referrer` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'ip_address') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'user_agent') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `user_agent` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'captcha_passed') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `captcha_passed` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'is_spam') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `is_spam` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'email_sent') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `email_sent` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'status') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `status` enum(''new'',''read'',''responded'',''booked'',''closed'') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''new''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'admin_notes') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `admin_notes` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'offer_price') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `offer_price` decimal(10,2) DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'offer_code') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `offer_code` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'offer_label') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `offer_label` varchar(120) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'contacts'
       AND COLUMN_NAME  = 'offer_source') = 0,
  'ALTER TABLE `contacts` ADD COLUMN `offer_source` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- faqs
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'faq_group') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `faq_group` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''general''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'question') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `question` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'answer') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `answer` text COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'sort_order') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `sort_order` int unsigned NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'is_active') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'faqs'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `faqs` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- newsletter_subscribers
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'newsletter_subscribers'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `newsletter_subscribers` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'newsletter_subscribers'
       AND COLUMN_NAME  = 'email') = 0,
  'ALTER TABLE `newsletter_subscribers` ADD COLUMN `email` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'newsletter_subscribers'
       AND COLUMN_NAME  = 'is_active') = 0,
  'ALTER TABLE `newsletter_subscribers` ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'newsletter_subscribers'
       AND COLUMN_NAME  = 'source') = 0,
  'ALTER TABLE `newsletter_subscribers` ADD COLUMN `source` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''footer''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'newsletter_subscribers'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `newsletter_subscribers` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'newsletter_subscribers'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `newsletter_subscribers` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- service_categories
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'slug') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'name') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'tagline') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `tagline` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'intro') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `intro` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'accent') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `accent` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''cream''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'icon') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `icon` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'hero_image') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `hero_image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'sort_order') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `sort_order` int unsigned NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'is_featured') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `is_featured` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'is_active') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'meta_title') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `meta_title` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'meta_description') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `meta_description` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'canonical_url') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'image_alt') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'sitemap_priority') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `sitemap_priority` decimal(2,1) NOT NULL DEFAULT ''0.8''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'sitemap_changefreq') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `sitemap_changefreq` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''monthly''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'service_categories'
       AND COLUMN_NAME  = 'noindex') = 0,
  'ALTER TABLE `service_categories` ADD COLUMN `noindex` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- services
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `services` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'category_id') = 0,
  'ALTER TABLE `services` ADD COLUMN `category_id` int unsigned NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'slug') = 0,
  'ALTER TABLE `services` ADD COLUMN `slug` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'name') = 0,
  'ALTER TABLE `services` ADD COLUMN `name` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'summary') = 0,
  'ALTER TABLE `services` ADD COLUMN `summary` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'description') = 0,
  'ALTER TABLE `services` ADD COLUMN `description` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'bullets') = 0,
  'ALTER TABLE `services` ADD COLUMN `bullets` json DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'what_to_expect') = 0,
  'ALTER TABLE `services` ADD COLUMN `what_to_expect` json DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'safe_painless') = 0,
  'ALTER TABLE `services` ADD COLUMN `safe_painless` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'skin_body_face') = 0,
  'ALTER TABLE `services` ADD COLUMN `skin_body_face` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'tests_consulting') = 0,
  'ALTER TABLE `services` ADD COLUMN `tests_consulting` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'ideal_for') = 0,
  'ALTER TABLE `services` ADD COLUMN `ideal_for` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'duration_minutes') = 0,
  'ALTER TABLE `services` ADD COLUMN `duration_minutes` int unsigned DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'price') = 0,
  'ALTER TABLE `services` ADD COLUMN `price` decimal(10,2) DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'image') = 0,
  'ALTER TABLE `services` ADD COLUMN `image` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'sort_order') = 0,
  'ALTER TABLE `services` ADD COLUMN `sort_order` int unsigned NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'is_featured') = 0,
  'ALTER TABLE `services` ADD COLUMN `is_featured` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'is_active') = 0,
  'ALTER TABLE `services` ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `services` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `services` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'meta_title') = 0,
  'ALTER TABLE `services` ADD COLUMN `meta_title` varchar(70) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'meta_description') = 0,
  'ALTER TABLE `services` ADD COLUMN `meta_description` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'canonical_url') = 0,
  'ALTER TABLE `services` ADD COLUMN `canonical_url` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'image_alt') = 0,
  'ALTER TABLE `services` ADD COLUMN `image_alt` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'sitemap_priority') = 0,
  'ALTER TABLE `services` ADD COLUMN `sitemap_priority` decimal(2,1) NOT NULL DEFAULT ''0.8''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'sitemap_changefreq') = 0,
  'ALTER TABLE `services` ADD COLUMN `sitemap_changefreq` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''monthly''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'services'
       AND COLUMN_NAME  = 'noindex') = 0,
  'ALTER TABLE `services` ADD COLUMN `noindex` tinyint(1) NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- site_settings
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'site_settings'
       AND COLUMN_NAME  = 'setting_key') = 0,
  'ALTER TABLE `site_settings` ADD COLUMN `setting_key` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'site_settings'
       AND COLUMN_NAME  = 'setting_value') = 0,
  'ALTER TABLE `site_settings` ADD COLUMN `setting_value` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'site_settings'
       AND COLUMN_NAME  = 'setting_group') = 0,
  'ALTER TABLE `site_settings` ADD COLUMN `setting_group` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''general''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'site_settings'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `site_settings` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'site_settings'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `site_settings` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- team_members
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'slug') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `slug` varchar(120) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'name') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `name` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'role') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `role` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'bio') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `bio` text COLLATE utf8mb4_unicode_ci',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'photo') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `photo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'sort_order') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `sort_order` int unsigned NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'is_active') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'team_members'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `team_members` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- testimonials
SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'id') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `id` int unsigned NOT NULL AUTO_INCREMENT',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'author') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `author` varchar(160) COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'location') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `location` varchar(160) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'treatment') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `treatment` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'quote') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `quote` text COLLATE utf8mb4_unicode_ci NOT NULL',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'rating') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `rating` tinyint unsigned NOT NULL DEFAULT ''5''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'sort_order') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `sort_order` int unsigned NOT NULL DEFAULT ''0''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'is_active') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `is_active` tinyint(1) NOT NULL DEFAULT ''1''',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'created_at') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @sql := (SELECT IF(
  (SELECT COUNT(*) FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME   = 'testimonials'
       AND COLUMN_NAME  = 'updated_at') = 0,
  'ALTER TABLE `testimonials` ADD COLUMN `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
  'DO 0'));
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = 1;
