<?php
/**
 * Per-page meta title/description overrides — "Page SEO" in the admin.
 *
 *   GET /api/page-seo?path=/about-us         — public, read (Seo.jsx calls this
 *                                               on every page load)
 *   PUT /api/admin/page-seo                  — admin, upsert { path, metaTitle,
 *                                               metaDescription }
 *
 * There is one row per path, keyed on the normalised path itself rather than
 * an id — an SEO person types the URL they want to change, not a database key.
 * A blank field is stored as NULL, and the front end falls back to that page's
 * own default title/description whenever the override is empty.
 */

/** "About-Us" / "about-us/" / "" -> "/about-us", "/" stays "/". */
function normalise_page_path(string $path): string
{
    $path = trim($path);
    if ($path === '') {
        return '/';
    }
    $path = '/' . ltrim($path, '/');
    if (strlen($path) > 1) {
        $path = rtrim($path, '/');
    }
    return substr($path, 0, 255);
}

/** GET /api/page-seo?path=... */
function route_page_seo_get(): void
{
    $path = normalise_page_path((string) ($_GET['path'] ?? ''));
    $row = db_one('SELECT * FROM page_seo_overrides WHERE path = :path', ['path' => $path]);

    json_response([
        'data' => [
            'path'            => $path,
            'metaTitle'       => $row['meta_title'] ?? '',
            'metaDescription' => $row['meta_description'] ?? '',
        ],
    ]);
}

/** PUT /api/admin/page-seo — body: { path, metaTitle, metaDescription } */
function route_admin_page_seo_update(): void
{
    $input = request_body();
    $path = normalise_page_path((string) ($input['path'] ?? ''));
    if ($path === '') {
        json_error('Validation failed', 422, [
            ['field' => 'path', 'message' => 'Enter a page path, e.g. /about-us'],
        ]);
    }

    $v = new Validator($input);
    $v->maxLength('metaTitle', 70, 'Meta title');
    $v->maxLength('metaDescription', 160, 'Meta description');
    $v->assert();

    $metaTitle = nullable((string) ($input['metaTitle'] ?? ''));
    $metaDescription = nullable((string) ($input['metaDescription'] ?? ''));

    db_run(
        'INSERT INTO page_seo_overrides (path, meta_title, meta_description)
         VALUES (:path, :title, :description)
         ON DUPLICATE KEY UPDATE meta_title = :title2, meta_description = :description2',
        [
            'path' => $path,
            'title' => $metaTitle,
            'description' => $metaDescription,
            'title2' => $metaTitle,
            'description2' => $metaDescription,
        ]
    );

    json_response([
        'data' => [
            'path'            => $path,
            'metaTitle'       => $metaTitle ?? '',
            'metaDescription' => $metaDescription ?? '',
        ],
    ]);
}
