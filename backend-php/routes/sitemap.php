<?php
/**
 * Live sitemap.xml and robots.txt, built from the same tables the admin
 * screens write to. A service or blog post created, edited or deleted through
 * /admin is reflected here immediately — no rebuild, no redeploy.
 *
 * This complements (does not replace) react-app/scripts/generate-sitemap.mjs,
 * which still produces a build-time public/sitemap.xml for sites that run
 * with no backend at all. Submit THIS url to Search Console once the backend
 * is live, since it is always current.
 */

const SITEMAP_STATIC_PAGES = [
    ['/', 1.0, 'weekly'],
    ['/services', 0.9, 'weekly'],
    ['/appointment', 0.9, 'monthly'],
    ['/contact', 0.8, 'monthly'],
    ['/blog', 0.8, 'weekly'],
    ['/services/menu/brows', 0.9, 'weekly'],
    ['/services/menu/bridal', 0.9, 'weekly'],
    ['/values', 0.7, 'monthly'],
    ['/gift-cards', 0.6, 'monthly'],
    ['/referral-program', 0.5, 'monthly'],
];

function sitemap_escape(string $value): string
{
    return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
}

/** GET /api/sitemap.xml */
function route_sitemap_xml(array $config): void
{
    $siteUrl = rtrim((string) ($config['site_url'] ?? ''), '/');
    if ($siteUrl === '') {
        json_error('Set site_url in config.php to generate the sitemap.', 503);
    }

    $today = date('Y-m-d');
    $urls = [];

    foreach (SITEMAP_STATIC_PAGES as [$path, $priority, $freq]) {
        $urls[] = [$siteUrl . $path, $today, $freq, $priority];
    }

    $categories = db_all(
        'SELECT slug, sitemap_priority, sitemap_changefreq, updated_at
         FROM service_categories WHERE is_active = 1 AND noindex = 0 ORDER BY sort_order'
    );
    foreach ($categories as $c) {
        $urls[] = [
            "$siteUrl/services/{$c['slug']}",
            substr((string) $c['updated_at'], 0, 10) ?: $today,
            $c['sitemap_changefreq'],
            (float) $c['sitemap_priority'],
        ];
    }

    $posts = db_all(
        "SELECT slug, sitemap_priority, sitemap_changefreq, published_at, updated_at
         FROM blog_posts WHERE status = 'published' AND noindex = 0 ORDER BY published_at DESC"
    );
    foreach ($posts as $p) {
        $date = $p['published_at'] ?: $p['updated_at'];
        $urls[] = [
            "$siteUrl/blog/{$p['slug']}",
            substr((string) $date, 0, 10) ?: $today,
            $p['sitemap_changefreq'],
            (float) $p['sitemap_priority'],
        ];
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
    foreach ($urls as [$loc, $lastmod, $changefreq, $priority]) {
        $xml .= "  <url>\n";
        $xml .= '    <loc>' . sitemap_escape($loc) . "</loc>\n";
        $xml .= "    <lastmod>$lastmod</lastmod>\n";
        $xml .= '    <changefreq>' . sitemap_escape((string) $changefreq) . "</changefreq>\n";
        $xml .= '    <priority>' . number_format((float) $priority, 1) . "</priority>\n";
        $xml .= "  </url>\n";
    }
    $xml .= '</urlset>';

    header('Content-Type: application/xml; charset=utf-8');
    header('Cache-Control: public, max-age=1800');
    echo $xml;
    exit;
}

const ROBOTS_DEFAULT = <<<'TXT'
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /*?service=
Disallow: /*?page=
TXT;

/**
 * GET /api/robots.txt
 *
 * Serves the site_settings.robots_txt override written from /admin/services
 * when one has been saved, otherwise a sensible default. Either way the
 * Sitemap: line is appended automatically and always points at the live
 * sitemap above, so it cannot go stale.
 */
function route_robots_txt(array $config): void
{
    $siteUrl = rtrim((string) ($config['site_url'] ?? ''), '/');

    $row = db_one("SELECT setting_value FROM site_settings WHERE setting_key = 'robots_txt'");
    $body = trim((string) ($row['setting_value'] ?? ''));
    if ($body === '') {
        $body = ROBOTS_DEFAULT;
    }

    if ($siteUrl !== '' && !preg_match('/^Sitemap:/mi', $body)) {
        // The pretty root URL, not /api/sitemap.xml — .htaccess rewrites
        // /sitemap.xml to the live PHP version, so that's the one that
        // should actually be advertised to crawlers.
        $body .= "\n\nSitemap: $siteUrl/sitemap.xml";
    }

    header('Content-Type: text/plain; charset=utf-8');
    header('Cache-Control: public, max-age=1800');
    echo $body . "\n";
    exit;
}
