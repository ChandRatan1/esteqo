<?php
/**
 * Services & departments authoring endpoints, gated by the same `x-admin-key`
 * as the blog (require_admin() lives in blog_admin.php, loaded first).
 *
 *   GET    /api/admin/services
 *   GET    /api/admin/services/{id}
 *   POST   /api/admin/services
 *   PUT    /api/admin/services/{id}
 *   DELETE /api/admin/services/{id}
 *
 *   GET    /api/admin/categories
 *   POST   /api/admin/categories
 *   PUT    /api/admin/categories/{id}
 *   DELETE /api/admin/categories/{id}
 *
 *   GET    /api/admin/settings/{key}
 *   PUT    /api/admin/settings/{key}
 *
 * Admin responses return raw snake_case rows, matching the blog admin screen.
 */

/** Maps the API's camelCase body onto `services` columns. */
function service_columns(array $input, bool $partial): array
{
    $row = [];
    $has = static fn (string $key) => array_key_exists($key, $input);

    if ($has('name')) {
        $row['name'] = trim((string) $input['name']);
    }

    if ($has('slug') && trim((string) $input['slug']) !== '') {
        $row['slug'] = slugify((string) $input['slug']);
    } elseif (!$partial && $has('name')) {
        $row['slug'] = slugify((string) $input['name']);
    }

    $map = [
        'summary'         => 'summary',
        'description'     => 'description',
        'idealFor'        => 'ideal_for',
        'image'           => 'image',
        'imageAlt'        => 'image_alt',
        'metaTitle'       => 'meta_title',
        'metaDescription' => 'meta_description',
        'canonicalUrl'    => 'canonical_url',
    ];
    foreach ($map as $from => $column) {
        if ($has($from)) {
            $row[$column] = nullable((string) $input[$from]);
        }
    }

    if ($has('bullets')) {
        $row['bullets'] = json_encode(array_values(array_filter(array_map(
            static fn ($b) => trim((string) $b),
            is_array($input['bullets']) ? $input['bullets'] : []
        ))));
    }
    if ($has('whatToExpect')) {
        $row['what_to_expect'] = json_encode(array_values(array_filter(array_map(
            static fn ($b) => trim((string) $b),
            is_array($input['whatToExpect']) ? $input['whatToExpect'] : []
        ))));
    }
    if ($has('durationMinutes')) {
        $row['duration_minutes'] = $input['durationMinutes'] === '' || $input['durationMinutes'] === null
            ? null
            : max(1, min(600, (int) $input['durationMinutes']));
    }
    if ($has('price')) {
        $row['price'] = $input['price'] === '' || $input['price'] === null ? null : (float) $input['price'];
    }
    if ($has('sortOrder')) {
        $row['sort_order'] = max(0, (int) $input['sortOrder']);
    }
    if ($has('isFeatured')) {
        $row['is_featured'] = $input['isFeatured'] ? 1 : 0;
    }
    if ($has('isActive')) {
        $row['is_active'] = $input['isActive'] ? 1 : 0;
    }
    if ($has('noindex')) {
        $row['noindex'] = $input['noindex'] ? 1 : 0;
    }

    // Department arrives as a slug; resolve it to an id.
    if ($has('categorySlug')) {
        $slug = trim((string) $input['categorySlug']);
        $category = $slug === '' ? null : db_one(
            'SELECT id FROM service_categories WHERE slug = :slug',
            ['slug' => $slug]
        );
        if ($slug !== '' && !$category) {
            json_error('Unknown service department: ' . $slug, 422, [
                ['field' => 'categorySlug', 'message' => 'That department does not exist'],
            ]);
        }
        if ($category) {
            $row['category_id'] = (int) $category['id'];
        } elseif (!$partial) {
            json_error('Validation failed', 422, [
                ['field' => 'categorySlug', 'message' => 'Choose a department'],
            ]);
        }
    }

    return $row;
}

function validate_service(array $input, bool $partial): void
{
    $v = new Validator($input);

    if (!$partial || array_key_exists('name', $input)) {
        $name = (string) $v->value('name', '');
        if (mb_strlen($name) < 2) {
            $v->add('name', 'Name must be at least 2 characters');
        } elseif (mb_strlen($name) > 200) {
            $v->add('name', 'Name cannot exceed 200 characters');
        }
    }

    $v->maxLength('summary', 600, 'Summary');
    $v->maxLength('image', 255, 'Image URL');
    $v->maxLength('imageAlt', 255, 'Image description');
    $v->maxLength('idealFor', 500, 'Ideal for');
    $v->maxLength('metaTitle', 70, 'Meta title');
    $v->maxLength('metaDescription', 160, 'Meta description');

    $v->assert();
}

function route_admin_services_list(): void
{
    $rows = db_all(
        'SELECT s.*, c.slug AS category_slug, c.name AS category_name
         FROM services s
         LEFT JOIN service_categories c ON c.id = s.category_id
         ORDER BY c.sort_order ASC, s.sort_order ASC, s.id DESC'
    );

    json_response(['data' => $rows, 'meta' => ['total' => count($rows)]]);
}

function route_admin_service_get(int $id): void
{
    $row = db_one('SELECT * FROM services WHERE id = :id', ['id' => $id]);
    if (!$row) {
        json_error('Service not found', 404);
    }
    json_response(['data' => $row]);
}

function route_admin_service_create(): void
{
    $input = request_body();
    validate_service($input, false);

    $row = service_columns($input, false);

    if (empty($row['slug'])) {
        json_error('Validation failed', 422, [
            ['field' => 'name', 'message' => 'Could not build a URL from this name'],
        ]);
    }
    if (empty($row['category_id'])) {
        json_error('Validation failed', 422, [
            ['field' => 'categorySlug', 'message' => 'Choose a department'],
        ]);
    }

    if (db_one('SELECT id FROM services WHERE slug = :slug', ['slug' => $row['slug']])) {
        json_error('A service with this URL already exists: ' . $row['slug'], 409, [
            ['field' => 'slug', 'message' => 'This URL is already in use'],
        ]);
    }

    $id = db_insert('services', $row);
    json_response(['data' => db_one('SELECT * FROM services WHERE id = :id', ['id' => $id])], 201);
}

function route_admin_service_update(int $id): void
{
    $existing = db_one('SELECT * FROM services WHERE id = :id', ['id' => $id]);
    if (!$existing) {
        json_error('Service not found', 404);
    }

    $input = request_body();
    validate_service($input, true);
    $row = service_columns($input, true);

    if (!empty($row['slug']) && $row['slug'] !== $existing['slug']) {
        $clash = db_one(
            'SELECT id FROM services WHERE slug = :slug AND id <> :id',
            ['slug' => $row['slug'], 'id' => $id]
        );
        if ($clash) {
            json_error('A service with this URL already exists: ' . $row['slug'], 409, [
                ['field' => 'slug', 'message' => 'This URL is already in use'],
            ]);
        }
    }

    if ($row) {
        $assignments = implode(', ', array_map(
            static fn ($c) => sprintf('`%s` = :%s', $c, $c),
            array_keys($row)
        ));
        db_run("UPDATE services SET $assignments WHERE id = :id", $row + ['id' => $id]);
    }

    json_response(['data' => db_one('SELECT * FROM services WHERE id = :id', ['id' => $id])]);
}

function route_admin_service_delete(int $id): void
{
    $deleted = db_run('DELETE FROM services WHERE id = :id', ['id' => $id]);
    if (!$deleted) {
        json_error('Service not found', 404);
    }
    json_response(['data' => ['id' => $id, 'deleted' => true]]);
}

/* ------------------------------------------------------------------ */
/* Departments (service_categories)                                    */
/* ------------------------------------------------------------------ */

function category_columns(array $input, bool $partial): array
{
    $row = [];
    $has = static fn (string $key) => array_key_exists($key, $input);

    if ($has('name')) {
        $row['name'] = trim((string) $input['name']);
    }
    if ($has('slug') && trim((string) $input['slug']) !== '') {
        $row['slug'] = slugify((string) $input['slug'], 120);
    } elseif (!$partial && $has('name')) {
        $row['slug'] = slugify((string) $input['name'], 120);
    }

    $map = [
        'tagline'         => 'tagline',
        'intro'           => 'intro',
        'accent'          => 'accent',
        'heroImage'       => 'hero_image',
        'metaTitle'       => 'meta_title',
        'metaDescription' => 'meta_description',
        'canonicalUrl'    => 'canonical_url',
        'imageAlt'        => 'image_alt',
    ];
    foreach ($map as $from => $column) {
        if ($has($from)) {
            $row[$column] = nullable((string) $input[$from]);
        }
    }

    if ($has('sortOrder')) {
        $row['sort_order'] = max(0, (int) $input['sortOrder']);
    }
    if ($has('isFeatured')) {
        $row['is_featured'] = $input['isFeatured'] ? 1 : 0;
    }
    if ($has('isActive')) {
        $row['is_active'] = $input['isActive'] ? 1 : 0;
    }
    if ($has('noindex')) {
        $row['noindex'] = $input['noindex'] ? 1 : 0;
    }

    return $row;
}

function route_admin_categories_list(): void
{
    $rows = db_all(
        'SELECT c.*, (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id) AS service_count
         FROM service_categories c
         ORDER BY c.sort_order ASC, c.name ASC'
    );

    json_response(['data' => $rows, 'meta' => ['total' => count($rows)]]);
}

function route_admin_service_category_create(): void
{
    $input = request_body();
    $v = new Validator($input);

    $name = (string) $v->value('name', '');
    if (mb_strlen($name) < 2 || mb_strlen($name) > 160) {
        $v->add('name', 'Name must be between 2 and 160 characters');
    }
    $v->maxLength('tagline', 255, 'Tagline');
    $v->assert();

    $source = trim((string) ($input['slug'] ?? ''));
    $slug = slugify($source !== '' ? $source : $name, 120);

    if (db_one('SELECT id FROM service_categories WHERE slug = :slug', ['slug' => $slug])) {
        json_error('A department with this URL already exists: ' . $slug, 409, [
            ['field' => 'slug', 'message' => 'This URL is already in use'],
        ]);
    }

    $row = category_columns($input, false);
    $row['slug'] = $slug;
    $row['name'] = $name;

    $id = db_insert('service_categories', $row);
    json_response(['data' => db_one('SELECT * FROM service_categories WHERE id = :id', ['id' => $id])], 201);
}

function route_admin_service_category_update(int $id): void
{
    $existing = db_one('SELECT * FROM service_categories WHERE id = :id', ['id' => $id]);
    if (!$existing) {
        json_error('Department not found', 404);
    }

    $input = request_body();
    $v = new Validator($input);
    if (array_key_exists('name', $input)) {
        $name = (string) $v->value('name', '');
        if (mb_strlen($name) < 2 || mb_strlen($name) > 160) {
            $v->add('name', 'Name must be between 2 and 160 characters');
        }
    }
    $v->maxLength('tagline', 255, 'Tagline');
    $v->assert();

    $row = category_columns($input, true);

    if (!empty($row['slug']) && $row['slug'] !== $existing['slug']) {
        $clash = db_one(
            'SELECT id FROM service_categories WHERE slug = :slug AND id <> :id',
            ['slug' => $row['slug'], 'id' => $id]
        );
        if ($clash) {
            json_error('A department with this URL already exists: ' . $row['slug'], 409, [
                ['field' => 'slug', 'message' => 'This URL is already in use'],
            ]);
        }
    }

    if ($row) {
        $assignments = implode(', ', array_map(
            static fn ($c) => sprintf('`%s` = :%s', $c, $c),
            array_keys($row)
        ));
        db_run("UPDATE service_categories SET $assignments WHERE id = :id", $row + ['id' => $id]);
    }

    json_response(['data' => db_one('SELECT * FROM service_categories WHERE id = :id', ['id' => $id])]);
}

/**
 * Deleting a department cascades to every service inside it (see the foreign
 * key in install.sql), so a careless click cannot silently wipe a whole
 * department's treatments — the caller must empty it first.
 */
function route_admin_service_category_delete(int $id): void
{
    $count = (int) (db_one(
        'SELECT COUNT(*) AS n FROM services WHERE category_id = :id',
        ['id' => $id]
    )['n'] ?? 0);

    if ($count > 0) {
        json_error(
            "This department still has $count service(s). Move or delete them first — " .
            'deleting the department would delete them too.',
            409
        );
    }

    $deleted = db_run('DELETE FROM service_categories WHERE id = :id', ['id' => $id]);
    if (!$deleted) {
        json_error('Department not found', 404);
    }
    json_response(['data' => ['id' => $id, 'deleted' => true]]);
}

/* ------------------------------------------------------------------ */
/* Site settings — currently just the robots.txt override              */
/* ------------------------------------------------------------------ */

/** Keys the admin screen is allowed to read/write. */
const EDITABLE_SETTINGS = ['robots_txt'];

function route_admin_setting_get(string $key): void
{
    if (!in_array($key, EDITABLE_SETTINGS, true)) {
        json_error('Unknown setting: ' . $key, 404);
    }
    $row = db_one('SELECT setting_value FROM site_settings WHERE setting_key = :k', ['k' => $key]);
    json_response(['data' => ['key' => $key, 'value' => $row['setting_value'] ?? '']]);
}

function route_admin_setting_update(string $key): void
{
    if (!in_array($key, EDITABLE_SETTINGS, true)) {
        json_error('Unknown setting: ' . $key, 404);
    }
    $input = request_body();
    $value = (string) ($input['value'] ?? '');

    db_run(
        "INSERT INTO site_settings (setting_key, setting_value, setting_group)
         VALUES (:k, :v, 'seo')
         ON DUPLICATE KEY UPDATE setting_value = :v2",
        ['k' => $key, 'v' => $value, 'v2' => $value]
    );

    json_response(['data' => ['key' => $key, 'value' => $value]]);
}
