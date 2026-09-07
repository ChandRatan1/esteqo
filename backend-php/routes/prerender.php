<?php
/**
 * Server-rendered title/meta/OG tags for crawlers that never run JavaScript.
 *
 * The React app injects <meta property="og:..."> tags client-side (see
 * react-app/src/seo/Seo.jsx). That works for real visitors and for Googlebot,
 * which does render JS — but link-preview bots (WhatsApp, Facebook,
 * Twitter/X, LinkedIn, Slack, Telegram, Discord) fetch only the raw HTML.
 * Without this, sharing any page link on WhatsApp shows a blank preview.
 *
 * .htaccess detects those user agents and routes them to this endpoint
 * instead of the SPA shell; every other visitor gets the normal React app,
 * completely unaffected.
 */

const PRERENDER_SITE_NAME = 'ESTEQO';
const PRERENDER_DEFAULT_TITLE = 'ESTEQO | Skin, Brows & Laser Clinic in Sector 25, Noida';
const PRERENDER_DEFAULT_DESCRIPTION = 'Clinically planned skin, brow and laser treatments in Sector 25, Noida. Hydra facials, carbon laser, peels, body polish, threading, waxing and massages by Seema Nanda.';
const PRERENDER_DEFAULT_IMAGE = '/services/21324.jpg';

/** Copy mirrors what each React page passes to <Seo>, kept in sync by hand. */
const PRERENDER_STATIC_PAGES = [
    '/' => [
        'title'       => null,
        'description' => null,
    ],
    '/services' => [
        'title'       => 'Treatments & Prices',
        'description' => 'The full ESTEQO treatment menu with prices — facials, brows, bridal packages, body care, threading, waxing and massages in Sector 25, Noida.',
    ],
    '/values' => [
        'title'       => 'Our Story & FAQ',
        'description' => 'ESTEQO blends advanced dermatological science with the artistry of beauty. Founded by Seema Nanda in Sector 25, Noida — plus answers to the questions we are asked most.',
    ],
    '/blog' => [
        'title'       => 'Blog',
        'description' => 'Treatment guides, skin science and aftercare from the ESTEQO team in Noida.',
    ],
    '/contact' => [
        'title'       => 'Contact',
        'description' => 'ESTEQO, Shop No. 209, First Floor, Modi Mall, Sector 25, Noida. Call +91 8010135135 or send us a message.',
    ],
    '/appointment' => [
        'title'       => 'Book an Appointment',
        'description' => 'Request an appointment at ESTEQO, Sector 25 Noida. Every service begins with a detailed skin consultation.',
    ],
];

function prerender_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}

/** Resolves a site path to title/description/image/type, live from the database. */
function prerender_meta_for(string $path): array
{
    $path = '/' . trim($path, '/');
    if ($path === '') {
        $path = '/';
    }
    $segments = $path === '/' ? [] : explode('/', trim($path, '/'));

    if (count($segments) === 2 && $segments[0] === 'services') {
        $row = db_one(
            'SELECT name, tagline, hero_image, meta_title, meta_description, noindex
             FROM service_categories WHERE slug = :slug AND is_active = 1',
            ['slug' => $segments[1]]
        );
        if ($row) {
            return [
                'title'       => $row['meta_title'] ?: ($row['name'] . ' in Noida'),
                'description' => $row['meta_description'] ?: $row['tagline'],
                'image'       => $row['hero_image'],
                'type'        => 'website',
                'noindex'     => (bool) $row['noindex'],
            ];
        }
    }

    if (count($segments) === 2 && $segments[0] === 'blog') {
        $row = db_one(
            "SELECT title, excerpt, image_url, cover_image, og_image, meta_title, meta_description, noindex
             FROM blog_posts WHERE slug = :slug AND status = 'published'",
            ['slug' => $segments[1]]
        );
        if ($row) {
            return [
                'title'       => $row['meta_title'] ?: $row['title'],
                'description' => $row['meta_description'] ?: $row['excerpt'],
                'image'       => $row['og_image'] ?: ($row['image_url'] ?: $row['cover_image']),
                'type'        => 'article',
                'noindex'     => (bool) $row['noindex'],
            ];
        }
    }

    if (isset(PRERENDER_STATIC_PAGES[$path])) {
        return PRERENDER_STATIC_PAGES[$path] + ['image' => null, 'type' => 'website', 'noindex' => false];
    }

    return ['title' => null, 'description' => null, 'image' => null, 'type' => 'website', 'noindex' => false];
}

/** Resolves everything a <head> needs for $path, from the live database. */
function prerender_resolve(string $path, array $config): array
{
    $meta = prerender_meta_for($path);
    $siteUrl = rtrim((string) ($config['site_url'] ?? ''), '/');

    $fullTitle = $meta['title'] ? $meta['title'] . ' | ' . PRERENDER_SITE_NAME : PRERENDER_DEFAULT_TITLE;
    $description = substr((string) ($meta['description'] ?: PRERENDER_DEFAULT_DESCRIPTION), 0, 160);
    $image = $meta['image'] ?: PRERENDER_DEFAULT_IMAGE;
    $imageUrl = str_starts_with($image, 'http') ? $image : $siteUrl . $image;

    return [
        'title'       => $fullTitle,
        'description' => $description,
        'image'       => $imageUrl,
        'type'        => (string) $meta['type'],
        'canonical'   => $siteUrl . $path,
        'noindex'     => (bool) $meta['noindex'],
        'rawTitle'    => $meta['title'],
    ];
}

/** The <head> tags themselves, shared by both the bot fallback and the real shell. */
function prerender_tags_html(array $r): string
{
    $html = '<title>' . prerender_escape($r['title']) . '</title>';
    $html .= '<meta name="description" content="' . prerender_escape($r['description']) . '">';
    $html .= '<meta name="robots" content="' . ($r['noindex'] ? 'noindex, nofollow' : 'index, follow') . '">';
    $html .= '<link rel="canonical" href="' . prerender_escape($r['canonical']) . '">';
    $html .= '<meta property="og:site_name" content="' . PRERENDER_SITE_NAME . '">';
    $html .= '<meta property="og:title" content="' . prerender_escape($r['title']) . '">';
    $html .= '<meta property="og:description" content="' . prerender_escape($r['description']) . '">';
    $html .= '<meta property="og:type" content="' . prerender_escape($r['type']) . '">';
    $html .= '<meta property="og:url" content="' . prerender_escape($r['canonical']) . '">';
    $html .= '<meta property="og:image" content="' . prerender_escape($r['image']) . '">';
    $html .= '<meta property="og:locale" content="en_IN">';
    $html .= '<meta name="twitter:card" content="summary_large_image">';
    $html .= '<meta name="twitter:title" content="' . prerender_escape($r['title']) . '">';
    $html .= '<meta name="twitter:description" content="' . prerender_escape($r['description']) . '">';
    $html .= '<meta name="twitter:image" content="' . prerender_escape($r['image']) . '">';
    return $html;
}

/**
 * GET /api/prerender?path=/services/facials — a minimal standalone
 * page, used only as a fallback when the real built index.html can't be
 * found (see route_render_shell for the version real visitors get).
 */
function route_prerender(array $config): void
{
    $path = (string) ($_GET['path'] ?? '/');
    $r = prerender_resolve($path, $config);

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: public, max-age=1800');

    echo '<!doctype html><html lang="en"><head><meta charset="utf-8">';
    echo prerender_tags_html($r);
    echo '</head><body>';
    echo '<h1>' . prerender_escape($r['rawTitle'] ?: PRERENDER_SITE_NAME) . '</h1>';
    echo '<p>' . prerender_escape($r['description']) . '</p>';
    echo '</body></html>';
    exit;
}

/**
 * GET /api/render-shell?path=... — the real React build's index.html, with
 * this path's title/meta/OG/canonical injected into its actual <head>.
 *
 * This is what EVERY visitor gets in production (see .htaccess) — not just
 * bots — so "View Source" on any page shows correct, page-specific tags
 * immediately, with no JavaScript required. The React app then boots exactly
 * as it always did; nothing about how the site behaves or looks changes.
 */
function route_render_shell(array $config, ?string $path = null): void
{
    $path = $path ?? (string) ($_GET['path'] ?? '/');
    // Production layout: this file deploys to public_html/api/routes/, and
    // index.html sits at public_html/index.html — two levels up. Override
    // with config.php's spa_index_path for any other layout (e.g. local dev,
    // where backend-php/ and react-app/dist/ are siblings instead).
    $indexPath = (string) ($config['spa_index_path'] ?? (__DIR__ . '/../../index.html'));

    if (!is_file($indexPath)) {
        // No build to enhance (e.g. a bare API-only checkout) — fall back to
        // the standalone page rather than a 500.
        route_prerender($config);
        return;
    }

    $r = prerender_resolve($path, $config);
    $html = (string) file_get_contents($indexPath);

    // Drop the plain <title> the build shipped with (react-app/index.html's
    // static default) so it isn't left duplicated alongside the real one.
    $html = (string) preg_replace('#<title>.*?</title>#is', '', $html, 1);

    $injected = str_ireplace('</head>', prerender_tags_html($r) . '</head>', $html);

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: public, max-age=1800');
    echo $injected;
    exit;
}
