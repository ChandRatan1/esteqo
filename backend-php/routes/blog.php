<?php
/**
 * Public blog endpoints.
 *
 * Response shapes match the Node API exactly (camelCase, data/meta envelope),
 * so the React client works against either backend unchanged.
 */

/** Row -> the JSON shape the front end expects. */
function shape_post(array $row, bool $withContent = false): array
{
    $tags = [];
    if (!empty($row['tags'])) {
        $decoded = json_decode((string) $row['tags'], true);
        if (is_array($decoded)) {
            $tags = $decoded;
        }
    }

    $post = [
        'slug'            => $row['slug'],
        'title'           => $row['title'],
        'excerpt'         => $row['excerpt'],
        'coverImage'      => $row['image_url'] ?: ($row['cover_image'] ?? null),
        'imageAlt'        => $row['image_alt'] ?? null,
        'author'          => $row['author'],
        'readMinutes'     => (int) $row['read_minutes'],
        'tags'            => $tags,
        'isFeatured'      => (bool) $row['is_featured'],
        'publishedAt'     => $row['published_at'],
        // SEO overrides set in the admin screen — falsy/blank when unset, so
        // the front end's `metaTitle || title` fallback pattern works as-is.
        'metaTitle'       => $row['meta_title'] ?? null,
        'metaDescription' => $row['meta_description'] ?? null,
        'canonicalUrl'    => $row['canonical_url'] ?? null,
        'ogImage'         => $row['og_image'] ?? null,
        'noindex'         => (bool) ($row['noindex'] ?? false),
        'category'        => $row['category_slug']
            ? ['slug' => $row['category_slug'], 'name' => $row['category_name']]
            : null,
    ];

    if ($withContent) {
        $post['content'] = $row['content'];
    }

    return $post;
}

const POST_COLUMNS = "
    p.id, p.slug, p.title, p.excerpt, p.content, p.image_url, p.cover_image, p.image_alt,
    p.author, p.read_minutes, p.tags, p.is_featured, p.published_at,
    p.meta_title, p.meta_description, p.canonical_url, p.og_image, p.noindex,
    c.slug AS category_slug, c.name AS category_name
";

/** GET /api/blog/posts?category=&featured=&page=&limit= */
function route_blog_posts(): void
{
    [$page, $limit, $offset] = pagination(9);

    $where = ["p.status = 'published'"];
    $params = [];

    if (!empty($_GET['category'])) {
        $where[] = 'c.slug = :category';
        $params['category'] = $_GET['category'];
    }
    if (($_GET['featured'] ?? '') === 'true') {
        $where[] = 'p.is_featured = 1';
    }

    $clause = implode(' AND ', $where);

    $total = (int) (db_one(
        "SELECT COUNT(*) AS n FROM blog_posts p
         LEFT JOIN blog_categories c ON c.id = p.category_id
         WHERE $clause",
        $params
    )['n'] ?? 0);

    // LIMIT/OFFSET are cast to int above, so they are safe to interpolate.
    $rows = db_all(
        'SELECT ' . POST_COLUMNS . "
         FROM blog_posts p
         LEFT JOIN blog_categories c ON c.id = p.category_id
         WHERE $clause
         ORDER BY p.published_at DESC, p.id DESC
         LIMIT $limit OFFSET $offset",
        $params
    );

    json_response([
        'data' => array_map(static fn ($r) => shape_post($r), $rows),
        'meta' => [
            'page'  => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => max(1, (int) ceil($total / $limit)),
        ],
    ]);
}

/** GET /api/blog/posts/{slug} — the post plus three recent siblings. */
function route_blog_post(string $slug): void
{
    $row = db_one(
        'SELECT ' . POST_COLUMNS . "
         FROM blog_posts p
         LEFT JOIN blog_categories c ON c.id = p.category_id
         WHERE p.slug = :slug AND p.status = 'published'
         LIMIT 1",
        ['slug' => $slug]
    );

    if (!$row) {
        json_error('Post not found', 404);
    }

    $related = db_all(
        'SELECT ' . POST_COLUMNS . "
         FROM blog_posts p
         LEFT JOIN blog_categories c ON c.id = p.category_id
         WHERE p.status = 'published' AND p.id <> :id
         ORDER BY p.published_at DESC
         LIMIT 3",
        ['id' => $row['id']]
    );

    $post = shape_post($row, true);
    $post['related'] = array_map(static fn ($r) => shape_post($r), $related);

    json_response(['data' => $post]);
}

/** GET /api/blog/categories */
function route_blog_categories(): void
{
    $rows = db_all(
        "SELECT c.id, c.slug, c.name, c.description,
                (SELECT COUNT(*) FROM blog_posts p
                  WHERE p.category_id = c.id AND p.status = 'published') AS post_count
         FROM blog_categories c
         ORDER BY c.name ASC"
    );

    json_response([
        'data' => array_map(static fn ($r) => [
            'id'          => (int) $r['id'],
            'slug'        => $r['slug'],
            'name'        => $r['name'],
            'description' => $r['description'],
            'postCount'   => (int) $r['post_count'],
        ], $rows),
    ]);
}
