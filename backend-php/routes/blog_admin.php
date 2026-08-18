<?php
/**
 * Blog authoring endpoints, gated by the `x-admin-key` header.
 *
 *   GET    /api/admin/blog/posts
 *   GET    /api/admin/blog/posts/{id}
 *   POST   /api/admin/blog/posts
 *   PUT    /api/admin/blog/posts/{id}
 *   DELETE /api/admin/blog/posts/{id}
 *   POST   /api/admin/blog/categories
 *
 * Admin responses return raw snake_case rows, which is what the admin screen
 * reads. The public endpoints do the camelCase shaping instead.
 */

/** Stops unless the request carries the configured admin key. */
function require_admin(array $config): void
{
    $expected = (string) ($config['admin_key'] ?? '');

    if ($expected === '') {
        json_error('Authoring API disabled: set admin_key in config.php.', 503);
    }

    $provided = request_header('x-admin-key');

    // Constant-time compare, so the key cannot be recovered by timing.
    if ($provided === '' || !hash_equals($expected, $provided)) {
        json_error('Invalid or missing x-admin-key header.', 401);
    }
}

/** Maps the API's camelCase body onto table columns. */
function post_columns(array $input, bool $partial): array
{
    $row = [];
    $has = static fn (string $key) => array_key_exists($key, $input);

    if ($has('title')) {
        $row['title'] = trim((string) $input['title']);
    }

    // Slug: an explicit value wins, otherwise it is derived from the title.
    if ($has('slug') && trim((string) $input['slug']) !== '') {
        $row['slug'] = slugify((string) $input['slug']);
    } elseif (!$partial && $has('title')) {
        $row['slug'] = slugify((string) $input['title']);
    }

    $map = [
        'excerpt'         => 'excerpt',
        'content'         => 'content',
        'imageAlt'        => 'image_alt',
        'ogImage'         => 'og_image',
        'author'          => 'author',
        'metaTitle'       => 'meta_title',
        'metaDescription' => 'meta_description',
        'focusKeyword'    => 'focus_keyword',
        'canonicalUrl'    => 'canonical_url',
    ];
    foreach ($map as $from => $column) {
        if ($has($from)) {
            $row[$column] = nullable((string) $input[$from]);
        }
    }

    // The cover is stored in both columns so old and new readers agree.
    if ($has('imageUrl')) {
        $row['image_url'] = nullable((string) $input['imageUrl']);
        $row['cover_image'] = $row['image_url'];
    }

    if ($has('readMinutes')) {
        $row['read_minutes'] = max(1, min(120, (int) $input['readMinutes']));
    }
    if ($has('isFeatured')) {
        $row['is_featured'] = $input['isFeatured'] ? 1 : 0;
    }
    if ($has('noindex')) {
        $row['noindex'] = $input['noindex'] ? 1 : 0;
    }
    if ($has('status')) {
        $row['status'] = $input['status'] === 'draft' ? 'draft' : 'published';
    }
    if ($has('tags')) {
        $tags = is_array($input['tags'])
            ? array_values(array_filter(array_map(
                static fn ($t) => substr(trim((string) $t), 0, 60),
                $input['tags']
            )))
            : [];
        $row['tags'] = json_encode($tags);
    }
    if ($has('publishedAt')) {
        $row['published_at'] = nullable((string) $input['publishedAt']);
    }

    // Category arrives as a slug; resolve it to an id.
    if ($has('categorySlug')) {
        $slug = trim((string) $input['categorySlug']);
        if ($slug === '') {
            $row['category_id'] = null;
        } else {
            $category = db_one('SELECT id FROM blog_categories WHERE slug = :slug', ['slug' => $slug]);
            if (!$category) {
                json_error('Unknown blog category: ' . $slug, 422, [
                    ['field' => 'categorySlug', 'message' => 'That category does not exist'],
                ]);
            }
            $row['category_id'] = (int) $category['id'];
        }
    }

    return $row;
}

/** Field checks shared by create and update. */
function validate_post(array $input, bool $partial): void
{
    $v = new Validator($input);

    if (!$partial || array_key_exists('title', $input)) {
        $title = (string) $v->value('title', '');
        if (mb_strlen($title) < 3) {
            $v->add('title', 'Title must be at least 3 characters');
        } elseif (mb_strlen($title) > 255) {
            $v->add('title', 'Title cannot exceed 255 characters');
        }
    }

    $v->maxLength('excerpt', 600, 'Excerpt');
    $v->maxLength('imageUrl', 255, 'Image URL');
    $v->maxLength('imageAlt', 255, 'Image description');
    $v->maxLength('metaTitle', 70, 'Meta title');
    $v->maxLength('metaDescription', 160, 'Meta description');
    $v->maxLength('author', 120, 'Author');

    if (!empty($input['publishedAt'])) {
        $v->date('publishedAt');
    }

    $v->assert();
}

function route_admin_posts_list(): void
{
    $rows = db_all(
        'SELECT p.*, c.slug AS category_slug
         FROM blog_posts p
         LEFT JOIN blog_categories c ON c.id = p.category_id
         ORDER BY p.created_at DESC, p.id DESC'
    );

    json_response(['data' => $rows, 'meta' => ['total' => count($rows)]]);
}

function route_admin_post_get(int $id): void
{
    $row = db_one('SELECT * FROM blog_posts WHERE id = :id', ['id' => $id]);
    if (!$row) {
        json_error('Post not found', 404);
    }
    json_response(['data' => $row]);
}

function route_admin_post_create(): void
{
    $input = request_body();
    validate_post($input, false);

    $row = post_columns($input, false);

    if (empty($row['slug'])) {
        json_error('Validation failed', 422, [
            ['field' => 'title', 'message' => 'Could not build a URL from this title'],
        ]);
    }

    if (db_one('SELECT id FROM blog_posts WHERE slug = :slug', ['slug' => $row['slug']])) {
        json_error('A post with this URL already exists: ' . $row['slug'], 409, [
            ['field' => 'slug', 'message' => 'This URL is already in use'],
        ]);
    }

    // A published post without an explicit date gets today's.
    if (($row['status'] ?? 'published') !== 'draft' && empty($row['published_at'])) {
        $row['published_at'] = date('Y-m-d H:i:s');
    }

    $id = db_insert('blog_posts', $row);
    json_response(['data' => db_one('SELECT * FROM blog_posts WHERE id = :id', ['id' => $id])], 201);
}

function route_admin_post_update(int $id): void
{
    $existing = db_one('SELECT * FROM blog_posts WHERE id = :id', ['id' => $id]);
    if (!$existing) {
        json_error('Post not found', 404);
    }

    $input = request_body();
    validate_post($input, true);
    $row = post_columns($input, true);

    if (!empty($row['slug']) && $row['slug'] !== $existing['slug']) {
        $clash = db_one(
            'SELECT id FROM blog_posts WHERE slug = :slug AND id <> :id',
            ['slug' => $row['slug'], 'id' => $id]
        );
        if ($clash) {
            json_error('A post with this URL already exists: ' . $row['slug'], 409, [
                ['field' => 'slug', 'message' => 'This URL is already in use'],
            ]);
        }
    }

    if ($row) {
        $assignments = implode(', ', array_map(
            static fn ($c) => sprintf('`%s` = :%s', $c, $c),
            array_keys($row)
        ));
        db_run("UPDATE blog_posts SET $assignments WHERE id = :id", $row + ['id' => $id]);
    }

    json_response(['data' => db_one('SELECT * FROM blog_posts WHERE id = :id', ['id' => $id])]);
}

function route_admin_post_delete(int $id): void
{
    $deleted = db_run('DELETE FROM blog_posts WHERE id = :id', ['id' => $id]);
    if (!$deleted) {
        json_error('Post not found', 404);
    }
    json_response(['data' => ['id' => $id, 'deleted' => true]]);
}

function route_admin_category_create(): void
{
    $input = request_body();
    $v = new Validator($input);

    $name = (string) $v->value('name', '');
    if (mb_strlen($name) < 2 || mb_strlen($name) > 160) {
        $v->add('name', 'Name must be between 2 and 160 characters');
    }
    $v->maxLength('description', 500, 'Description');
    $v->assert();

    $source = trim((string) ($input['slug'] ?? ''));
    $slug = slugify($source !== '' ? $source : $name, 120);

    if (db_one('SELECT id FROM blog_categories WHERE slug = :slug', ['slug' => $slug])) {
        json_error('A category with this URL already exists: ' . $slug, 409);
    }

    $id = db_insert('blog_categories', [
        'slug'        => $slug,
        'name'        => $name,
        'description' => nullable((string) ($input['description'] ?? '')),
    ]);

    json_response(['data' => db_one('SELECT * FROM blog_categories WHERE id = :id', ['id' => $id])], 201);
}
