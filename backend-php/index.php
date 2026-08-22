<?php
/**
 * ESTEQO API — front controller.
 *
 * Every /api/* request lands here via .htaccess and is dispatched below. The
 * routes and JSON shapes match the previous Node/Express backend exactly, so
 * the React front end works against either one without changes.
 *
 * Runs on PHP 8 with PDO MySQL — i.e. standard Hostinger shared hosting.
 */

declare(strict_types=1);

// Never print warnings into a JSON response; log them instead.
ini_set('display_errors', '0');
error_reporting(E_ALL);

require __DIR__ . '/lib/http.php';

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    json_error('API not configured: copy config.example.php to config.php.', 503);
}
$config = require $configPath;

require __DIR__ . '/lib/db.php';
require __DIR__ . '/lib/validate.php';
require __DIR__ . '/routes/blog.php';
require __DIR__ . '/routes/blog_admin.php';
require __DIR__ . '/routes/services.php';
require __DIR__ . '/routes/services_admin.php';
require __DIR__ . '/routes/sitemap.php';
require __DIR__ . '/routes/page_seo.php';
require __DIR__ . '/routes/contacts.php';
require __DIR__ . '/routes/uploads.php';

apply_cors($config['cors_origins'] ?? []);

// Anything uncaught becomes a clean 500 rather than an HTML error page.
set_exception_handler(static function (Throwable $e): void {
    error_log('ESTEQO API error: ' . $e->getMessage() . ' @ ' . $e->getFile() . ':' . $e->getLine());
    json_error('Internal server error', 500);
});

/* ------------------------------------------------------------------ */
/* Work out the path                                                   */
/* ------------------------------------------------------------------ */

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';

// Strip everything up to and including /api, so the app works whether it is
// mounted at /api or at the domain root.
$path = preg_replace('#^.*?/api#', '', $uri) ?? '';
$path = '/' . trim((string) $path, '/');

$segments = $path === '/' ? [] : explode('/', trim($path, '/'));

/** True when the path matches the given segments; '*' matches anything. */
$matches = static function (array $pattern) use ($segments): bool {
    if (count($pattern) !== count($segments)) {
        return false;
    }
    foreach ($pattern as $i => $expected) {
        if ($expected !== '*' && $expected !== $segments[$i]) {
            return false;
        }
    }
    return true;
};

/* ------------------------------------------------------------------ */
/* Routes                                                              */
/* ------------------------------------------------------------------ */

// GET /api/health
//
// Also reports whether the live database has every table the code expects, so
// after a deploy you can confirm the schema in one request instead of guessing
// whether install.sql still needs importing.
if ($method === 'GET' && $matches(['health'])) {
    $expected = [
        'service_categories', 'services', 'blog_categories', 'blog_posts',
        'testimonials', 'faqs', 'team_members', 'site_settings', 'page_seo_overrides',
        'contacts', 'appointments', 'contact_messages', 'newsletter_subscribers',
    ];

    try {
        $present = [];
        foreach (db()->query('SHOW TABLES')->fetchAll(PDO::FETCH_NUM) as $row) {
            $present[] = $row[0];
        }

        $missing = array_values(array_diff($expected, $present));

        $counts = [];
        foreach (['services', 'blog_posts', 'contacts'] as $table) {
            if (in_array($table, $present, true)) {
                $counts[$table] = (int) db()->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
            }
        }

        json_response([
            'status'   => $missing ? 'schema-incomplete' : 'ok',
            'database' => 'connected',
            'php'      => PHP_VERSION,
            'tables'   => ['expected' => count($expected), 'present' => count($expected) - count($missing)],
            'missing'  => $missing,
            'rows'     => $counts,
            'action'   => $missing
                ? 'Import install.sql (and seed.sql if this is a new database).'
                : null,
        ], $missing ? 200 : 200);
    } catch (Throwable $e) {
        json_error('Database unavailable.', 503);
    }
}

// GET /uploads/{...} — dev-only static passthrough, see route_serve_upload().
if ($method === 'GET' && $segments !== [] && $segments[0] === 'uploads') {
    route_serve_upload(array_slice($segments, 1), $config);
}

// ---- Public blog ---------------------------------------------------

// GET /api/blog/posts
if ($method === 'GET' && $matches(['blog', 'posts'])) {
    route_blog_posts();
}

// GET /api/blog/posts/{slug}
if ($method === 'GET' && $matches(['blog', 'posts', '*'])) {
    route_blog_post($segments[2]);
}

// GET /api/blog/categories
if ($method === 'GET' && $matches(['blog', 'categories'])) {
    route_blog_categories();
}

// ---- Blog authoring (admin key required) ---------------------------

// POST /api/admin/blog/upload
if ($method === 'POST' && $matches(['admin', 'blog', 'upload'])) {
    require_admin($config);
    route_admin_upload($config);
}

// GET|POST /api/admin/blog/posts
if ($matches(['admin', 'blog', 'posts'])) {
    require_admin($config);
    if ($method === 'GET') {
        route_admin_posts_list();
    }
    if ($method === 'POST') {
        route_admin_post_create();
    }
    json_error('Method not allowed', 405);
}

// GET|PUT|DELETE /api/admin/blog/posts/{id}
if ($matches(['admin', 'blog', 'posts', '*'])) {
    require_admin($config);
    $id = (int) $segments[3];
    if ($id < 1) {
        json_error('Invalid post id', 400);
    }
    if ($method === 'GET') {
        route_admin_post_get($id);
    }
    if ($method === 'PUT' || $method === 'PATCH') {
        route_admin_post_update($id);
    }
    if ($method === 'DELETE') {
        route_admin_post_delete($id);
    }
    json_error('Method not allowed', 405);
}

// POST /api/admin/blog/categories
if ($method === 'POST' && $matches(['admin', 'blog', 'categories'])) {
    require_admin($config);
    route_admin_category_create();
}

// ---- Public services -------------------------------------------------

// GET /api/categories
if ($method === 'GET' && $matches(['categories'])) {
    route_service_categories();
}

// GET /api/categories/{slug}
if ($method === 'GET' && $matches(['categories', '*'])) {
    route_service_category($segments[1]);
}

// GET /api/services
if ($method === 'GET' && $matches(['services'])) {
    route_services();
}

// GET /api/services/{slug}
if ($method === 'GET' && $matches(['services', '*'])) {
    route_service($segments[1]);
}

// ---- Services authoring (admin key required) ------------------------

// GET|POST /api/admin/services
if ($matches(['admin', 'services'])) {
    require_admin($config);
    if ($method === 'GET') {
        route_admin_services_list();
    }
    if ($method === 'POST') {
        route_admin_service_create();
    }
    json_error('Method not allowed', 405);
}

// GET|PUT|DELETE /api/admin/services/{id}
if ($matches(['admin', 'services', '*'])) {
    require_admin($config);
    $id = (int) $segments[2];
    if ($id < 1) {
        json_error('Invalid service id', 400);
    }
    if ($method === 'GET') {
        route_admin_service_get($id);
    }
    if ($method === 'PUT' || $method === 'PATCH') {
        route_admin_service_update($id);
    }
    if ($method === 'DELETE') {
        route_admin_service_delete($id);
    }
    json_error('Method not allowed', 405);
}

// GET|POST /api/admin/categories
if ($matches(['admin', 'categories'])) {
    require_admin($config);
    if ($method === 'GET') {
        route_admin_categories_list();
    }
    if ($method === 'POST') {
        route_admin_service_category_create();
    }
    json_error('Method not allowed', 405);
}

// PUT|DELETE /api/admin/categories/{id}
if ($matches(['admin', 'categories', '*'])) {
    require_admin($config);
    $id = (int) $segments[2];
    if ($id < 1) {
        json_error('Invalid department id', 400);
    }
    if ($method === 'PUT' || $method === 'PATCH') {
        route_admin_service_category_update($id);
    }
    if ($method === 'DELETE') {
        route_admin_service_category_delete($id);
    }
    json_error('Method not allowed', 405);
}

// GET|PUT /api/admin/settings/{key}
if ($matches(['admin', 'settings', '*'])) {
    require_admin($config);
    if ($method === 'GET') {
        route_admin_setting_get($segments[2]);
    }
    if ($method === 'PUT') {
        route_admin_setting_update($segments[2]);
    }
    json_error('Method not allowed', 405);
}

// ---- Page SEO overrides ----------------------------------------------

// GET /api/page-seo?path=
if ($method === 'GET' && $matches(['page-seo'])) {
    route_page_seo_get();
}

// PUT /api/admin/page-seo
if ($matches(['admin', 'page-seo'])) {
    require_admin($config);
    if ($method === 'PUT' || $method === 'PATCH') {
        route_admin_page_seo_update();
    }
    json_error('Method not allowed', 405);
}

// ---- Live SEO files --------------------------------------------------

// GET /api/sitemap.xml
if ($method === 'GET' && $matches(['sitemap.xml'])) {
    route_sitemap_xml($config);
}

// GET /api/robots.txt
if ($method === 'GET' && $matches(['robots.txt'])) {
    route_robots_txt($config);
}

// ---- Enquiry forms -------------------------------------------------

// POST /api/contacts  (public)   GET /api/contacts (admin)
if ($matches(['contacts'])) {
    if ($method === 'POST') {
        route_contacts_create($config);
    }
    if ($method === 'GET') {
        route_contacts_list($config);
    }
    json_error('Method not allowed', 405);
}

// GET /api/contacts/stats  — must be tested before /contacts/{id}, or "stats"
// would be read as an id.
if ($method === 'GET' && $matches(['contacts', 'stats'])) {
    route_contacts_stats($config);
}

// GET|PUT|DELETE /api/contacts/{id}
if ($matches(['contacts', '*'])) {
    $id = (int) $segments[1];
    if ($id < 1) {
        json_error('Invalid enquiry id', 400);
    }
    if ($method === 'GET') {
        route_contacts_get($config, $id);
    }
    if ($method === 'PUT' || $method === 'PATCH') {
        route_contacts_update($config, $id);
    }
    if ($method === 'DELETE') {
        route_contacts_delete($config, $id);
    }
    json_error('Method not allowed', 405);
}

// The React app also posts appointments and newsletter signups; both are
// contacts rows, so accept the old paths too rather than breaking them.
if ($method === 'POST' && ($matches(['appointments']) || $matches(['newsletter']) || $matches(['contact']))) {
    route_contacts_create($config);
}

/* ------------------------------------------------------------------ */

json_error('No route matches ' . $method . ' ' . $path, 404);
