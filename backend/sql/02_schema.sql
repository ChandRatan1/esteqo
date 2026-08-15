-- ESTEQO — full schema (MySQL 8)
--
-- This is the same structure the Knex migration produces, kept as plain SQL for
-- DBAs and for environments where you would rather not run Node migrations.
-- If you use `npm run migrate`, you do NOT need this file.
--
--   mysql -u root -p esteqo < sql/02_schema.sql

USE `esteqo`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `newsletter_subscribers`;
DROP TABLE IF EXISTS `contact_messages`;
DROP TABLE IF EXISTS `appointments`;
DROP TABLE IF EXISTS `site_settings`;
DROP TABLE IF EXISTS `team_members`;
DROP TABLE IF EXISTS `faqs`;
DROP TABLE IF EXISTS `testimonials`;
DROP TABLE IF EXISTS `blog_posts`;
DROP TABLE IF EXISTS `blog_categories`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `service_categories`;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------------------------------------------------------------------
-- Service catalogue
-- ---------------------------------------------------------------------------

CREATE TABLE `service_categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`        VARCHAR(120) NOT NULL,
  `name`        VARCHAR(160) NOT NULL,
  `tagline`     VARCHAR(255) DEFAULT NULL,
  `intro`       TEXT DEFAULT NULL,
  `accent`      VARCHAR(40)  NOT NULL DEFAULT 'cream',
  `icon`        VARCHAR(40)  DEFAULT NULL,
  `hero_image`  VARCHAR(255) DEFAULT NULL,
  `sort_order`  INT UNSIGNED NOT NULL DEFAULT 0,
  `is_featured` TINYINT(1)   NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_categories_slug_unique` (`slug`),
  KEY `idx_categories_active_sort` (`is_active`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id`               INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id`      INT UNSIGNED NOT NULL,
  `slug`             VARCHAR(160) NOT NULL,
  `name`             VARCHAR(200) NOT NULL,
  `summary`          TEXT DEFAULT NULL,
  `description`      TEXT DEFAULT NULL,
  `bullets`          JSON DEFAULT NULL,
  `what_to_expect`   JSON DEFAULT NULL,
  `safe_painless`    VARCHAR(500) DEFAULT NULL,
  `skin_body_face`   VARCHAR(500) DEFAULT NULL,
  `tests_consulting` VARCHAR(500) DEFAULT NULL,
  `ideal_for`        VARCHAR(500) DEFAULT NULL,
  `duration_minutes` INT UNSIGNED DEFAULT NULL,
  `price`            DECIMAL(10,2) DEFAULT NULL,
  `image`            VARCHAR(255) DEFAULT NULL,
  `sort_order`       INT UNSIGNED NOT NULL DEFAULT 0,
  `is_featured`      TINYINT(1)   NOT NULL DEFAULT 0,
  `is_active`        TINYINT(1)   NOT NULL DEFAULT 1,
  `created_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `services_slug_unique` (`slug`),
  KEY `idx_services_category_sort` (`category_id`, `sort_order`),
  KEY `idx_services_active_featured` (`is_active`, `is_featured`),
  CONSTRAINT `services_category_id_foreign` FOREIGN KEY (`category_id`)
    REFERENCES `service_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Blog
-- ---------------------------------------------------------------------------

CREATE TABLE `blog_categories` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`        VARCHAR(120) NOT NULL,
  `name`        VARCHAR(160) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `created_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `blog_posts` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id`   INT UNSIGNED DEFAULT NULL,
  `slug`          VARCHAR(200) NOT NULL,
  `title`         VARCHAR(255) NOT NULL,
  `excerpt`       VARCHAR(600) DEFAULT NULL,
  `content`       LONGTEXT DEFAULT NULL,
  `cover_image`   VARCHAR(255) DEFAULT NULL,
  `author`        VARCHAR(120) NOT NULL DEFAULT 'ESTEQO',
  `read_minutes`  INT UNSIGNED NOT NULL DEFAULT 4,
  `tags`          JSON DEFAULT NULL,
  `is_featured`   TINYINT(1) NOT NULL DEFAULT 0,
  `status`        ENUM('draft','published') NOT NULL DEFAULT 'published',
  `published_at`  DATETIME DEFAULT NULL,
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  KEY `idx_posts_status_published` (`status`, `published_at`),
  CONSTRAINT `blog_posts_category_id_foreign` FOREIGN KEY (`category_id`)
    REFERENCES `blog_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Supporting content
-- ---------------------------------------------------------------------------

CREATE TABLE `testimonials` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `author`     VARCHAR(160) NOT NULL,
  `location`   VARCHAR(160) DEFAULT NULL,
  `treatment`  VARCHAR(200) DEFAULT NULL,
  `quote`      TEXT NOT NULL,
  `rating`     TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `faqs` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `faq_group`  VARCHAR(80) NOT NULL DEFAULT 'general',
  `question`   VARCHAR(400) NOT NULL,
  `answer`     TEXT NOT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_faqs_group_sort` (`faq_group`, `sort_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `team_members` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug`       VARCHAR(120) NOT NULL,
  `name`       VARCHAR(160) NOT NULL,
  `role`       VARCHAR(200) DEFAULT NULL,
  `bio`        TEXT DEFAULT NULL,
  `photo`      VARCHAR(255) DEFAULT NULL,
  `sort_order` INT UNSIGNED NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `team_members_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `site_settings` (
  `setting_key`   VARCHAR(120) NOT NULL,
  `setting_value` TEXT DEFAULT NULL,
  `setting_group` VARCHAR(60) NOT NULL DEFAULT 'general',
  `created_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Visitor submissions
-- ---------------------------------------------------------------------------

CREATE TABLE `appointments` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `reference`      VARCHAR(20)  NOT NULL,
  `full_name`      VARCHAR(160) NOT NULL,
  `email`          VARCHAR(200) DEFAULT NULL,
  `phone`          VARCHAR(40)  NOT NULL,
  `service_id`     INT UNSIGNED DEFAULT NULL,
  `category_id`    INT UNSIGNED DEFAULT NULL,
  `preferred_date` DATE DEFAULT NULL,
  `preferred_time` VARCHAR(20) DEFAULT NULL,
  `contact_method` ENUM('call','whatsapp','email','sms') NOT NULL DEFAULT 'call',
  `message`        TEXT DEFAULT NULL,
  `status`         ENUM('new','confirmed','completed','cancelled') NOT NULL DEFAULT 'new',
  `source`         VARCHAR(60) NOT NULL DEFAULT 'website',
  `ip_address`     VARCHAR(45) DEFAULT NULL,
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `appointments_reference_unique` (`reference`),
  KEY `idx_appointments_status_date` (`status`, `preferred_date`),
  CONSTRAINT `appointments_service_id_foreign` FOREIGN KEY (`service_id`)
    REFERENCES `services` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `appointments_category_id_foreign` FOREIGN KEY (`category_id`)
    REFERENCES `service_categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `contact_messages` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `full_name`      VARCHAR(160) NOT NULL,
  `email`          VARCHAR(200) DEFAULT NULL,
  `phone`          VARCHAR(40)  DEFAULT NULL,
  `subject`        VARCHAR(255) DEFAULT NULL,
  `message`        TEXT NOT NULL,
  `contact_method` ENUM('call','whatsapp','email','sms') NOT NULL DEFAULT 'email',
  `is_handled`     TINYINT(1) NOT NULL DEFAULT 0,
  `ip_address`     VARCHAR(45) DEFAULT NULL,
  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `newsletter_subscribers` (
  `id`         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`      VARCHAR(200) NOT NULL,
  `is_active`  TINYINT(1) NOT NULL DEFAULT 1,
  `source`     VARCHAR(60) NOT NULL DEFAULT 'footer',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `newsletter_subscribers_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
