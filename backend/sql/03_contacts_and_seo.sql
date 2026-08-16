-- ESTEQO — contacts table and SEO columns (MySQL 8)
--
-- Same structure the Knex migration 20260815000002 produces, as plain SQL.
-- If you use `npm run migrate`, you do NOT need this file.
--
--   mysql -u root -p esteqo < sql/03_contacts_and_seo.sql

USE `esteqo`;

-- ---------------------------------------------------------------------------
-- contacts — every website form lands here, one column per field
-- ---------------------------------------------------------------------------

DROP TABLE IF EXISTS `contacts`;

CREATE TABLE `contacts` (
  `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,

  -- Which form produced the row
  `form_type`      ENUM('contact','appointment','newsletter') NOT NULL DEFAULT 'contact',
  `reference`      VARCHAR(20)  DEFAULT NULL,

  -- Visitor details
  `full_name`      VARCHAR(40)  DEFAULT NULL,
  `email`          VARCHAR(50)  DEFAULT NULL,
  `phone`          VARCHAR(13)  DEFAULT NULL,
  `location`       VARCHAR(120) DEFAULT NULL,

  -- What they are asking for
  `service_slug`   VARCHAR(160) DEFAULT NULL,
  `service_name`   VARCHAR(200) DEFAULT NULL,
  `service_price`  VARCHAR(60)  DEFAULT NULL,
  `category_slug`  VARCHAR(120) DEFAULT NULL,
  `preferred_date` DATE         DEFAULT NULL,
  `preferred_time` VARCHAR(40)  DEFAULT NULL,
  `contact_method` ENUM('call','whatsapp','email','sms') NOT NULL DEFAULT 'call',

  -- Free text
  `subject`        VARCHAR(50)  DEFAULT NULL,
  `message`        VARCHAR(350) DEFAULT NULL,

  -- Provenance and workflow
  `source_page`    VARCHAR(255) DEFAULT NULL,
  `referrer`       VARCHAR(255) DEFAULT NULL,
  `ip_address`     VARCHAR(45)  DEFAULT NULL,
  `user_agent`     VARCHAR(255) DEFAULT NULL,
  `captcha_passed` TINYINT(1) NOT NULL DEFAULT 1,
  `is_spam`        TINYINT(1) NOT NULL DEFAULT 0,
  `email_sent`     TINYINT(1) NOT NULL DEFAULT 0,
  `status`         ENUM('new','read','responded','booked','closed') NOT NULL DEFAULT 'new',
  `admin_notes`    TEXT DEFAULT NULL,

  `created_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`),
  KEY `idx_contacts_reference` (`reference`),
  KEY `idx_contacts_type_status` (`form_type`, `status`),
  KEY `idx_contacts_created` (`created_at`),
  KEY `idx_contacts_email` (`email`),
  KEY `idx_contacts_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- SEO columns
-- ---------------------------------------------------------------------------

ALTER TABLE `blog_posts`
  ADD COLUMN `image_url`          VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `image_alt`          VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `meta_title`         VARCHAR(70)  DEFAULT NULL,
  ADD COLUMN `meta_description`   VARCHAR(160) DEFAULT NULL,
  ADD COLUMN `focus_keyword`      VARCHAR(120) DEFAULT NULL,
  ADD COLUMN `canonical_url`      VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `og_image`           VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `sitemap_priority`   DECIMAL(2,1) NOT NULL DEFAULT 0.7,
  ADD COLUMN `sitemap_changefreq` VARCHAR(20)  NOT NULL DEFAULT 'monthly',
  ADD COLUMN `noindex`            TINYINT(1)   NOT NULL DEFAULT 0;

UPDATE `blog_posts` SET `image_url` = `cover_image` WHERE `cover_image` IS NOT NULL;

ALTER TABLE `services`
  ADD COLUMN `meta_title`         VARCHAR(70)  DEFAULT NULL,
  ADD COLUMN `meta_description`   VARCHAR(160) DEFAULT NULL,
  ADD COLUMN `canonical_url`      VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `image_alt`          VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `sitemap_priority`   DECIMAL(2,1) NOT NULL DEFAULT 0.8,
  ADD COLUMN `sitemap_changefreq` VARCHAR(20)  NOT NULL DEFAULT 'monthly',
  ADD COLUMN `noindex`            TINYINT(1)   NOT NULL DEFAULT 0;

ALTER TABLE `service_categories`
  ADD COLUMN `meta_title`         VARCHAR(70)  DEFAULT NULL,
  ADD COLUMN `meta_description`   VARCHAR(160) DEFAULT NULL,
  ADD COLUMN `canonical_url`      VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `image_alt`          VARCHAR(255) DEFAULT NULL,
  ADD COLUMN `sitemap_priority`   DECIMAL(2,1) NOT NULL DEFAULT 0.8,
  ADD COLUMN `sitemap_changefreq` VARCHAR(20)  NOT NULL DEFAULT 'monthly',
  ADD COLUMN `noindex`            TINYINT(1)   NOT NULL DEFAULT 0;

-- ---------------------------------------------------------------------------
-- Offer tracking (migration 20260815000003)
-- The ₹500-off badge and the one-time popup submit the same enquiry form, so
-- they land in `contacts` alongside everything else.
-- ---------------------------------------------------------------------------

ALTER TABLE `contacts`
  ADD COLUMN `offer_price`  DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN `offer_code`   VARCHAR(40)  DEFAULT NULL,
  ADD COLUMN `offer_label`  VARCHAR(120) DEFAULT NULL,
  -- 'badge' | 'popup' | 'page'
  ADD COLUMN `offer_source` VARCHAR(20)  DEFAULT NULL,
  ADD KEY `idx_contacts_offer_code` (`offer_code`);
