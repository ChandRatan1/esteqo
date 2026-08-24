<?php
/**
 * Public services & departments endpoints.
 *
 * Reads the `service_categories` and `services` tables — the same tables the
 * admin screen at /admin/services writes to. Shapes match what the bundled
 * src/data/menu.js produces, so ServiceCategory and ServiceDetail render the
 * same whichever source is active.
 */

function shape_service_category(array $row, ?int $serviceCount = null): array
{
    return [
        'id'              => (int) $row['id'],
        'slug'            => $row['slug'],
        'name'            => $row['name'],
        'tagline'         => $row['tagline'],
        'intro'           => $row['intro'],
        'accent'          => $row['accent'],
        'heroImage'       => $row['hero_image'],
        'imageAlt'        => $row['image_alt'] ?? null,
        'metaTitle'       => $row['meta_title'] ?? null,
        'metaDescription' => $row['meta_description'] ?? null,
        'canonicalUrl'    => $row['canonical_url'] ?? null,
        'noindex'         => (bool) ($row['noindex'] ?? false),
        'serviceCount'    => $serviceCount ?? (int) ($row['service_count'] ?? 0),
    ];
}

function shape_service(array $row): array
{
    $bullets = [];
    if (!empty($row['bullets'])) {
        $decoded = json_decode((string) $row['bullets'], true);
        if (is_array($decoded)) {
            $bullets = $decoded;
        }
    }

    $whatToExpect = [];
    if (!empty($row['what_to_expect'])) {
        $decoded = json_decode((string) $row['what_to_expect'], true);
        if (is_array($decoded)) {
            $whatToExpect = $decoded;
        }
    }

    return [
        'id'              => (int) $row['id'],
        'slug'            => $row['slug'],
        'name'            => $row['name'],
        'summary'         => $row['summary'],
        'description'     => $row['description'],
        'bullets'         => $bullets,
        'whatToExpect'    => $whatToExpect,
        'durationMinutes' => $row['duration_minutes'] !== null ? (int) $row['duration_minutes'] : null,
        'price'           => $row['price'] !== null ? (float) $row['price'] : null,
        // These live only on the hand-authored bundled services (brows, bridal
        // packages) — the DB schema has no columns for them yet, so API-backed
        // services render without this optional detail rather than fail.
        'priceNote'       => null,
        'variants'        => [],
        'isNew'           => false,
        'process'         => [],
        'idealForList'    => [],
        'idealFor'        => $row['ideal_for'] ?: null,
        'aftercare'       => [],
        'resultsLast'     => null,
        'note'            => null,
        'needsContent'    => false,
        'isFeatured'      => (bool) $row['is_featured'],
        'image'           => $row['image'],
        'imageAlt'        => $row['image_alt'] ?? null,
        // SEO overrides set in the admin screen — falsy/blank when unset, so
        // the front end's `metaTitle || name` fallback pattern works as-is.
        'metaTitle'       => $row['meta_title'] ?? null,
        'metaDescription' => $row['meta_description'] ?? null,
        'canonicalUrl'    => $row['canonical_url'] ?? null,
        'noindex'         => (bool) ($row['noindex'] ?? false),
        'category'        => isset($row['category_slug']) ? [
            'slug'   => $row['category_slug'],
            'name'   => $row['category_name'],
            'accent' => $row['category_accent'] ?? 'cream',
        ] : null,
    ];
}

/** FAQs are grouped by department slug, same as the bundled faqs object. */
function faqs_for_group(string $group): array
{
    $rows = db_all(
        'SELECT id, question, answer FROM faqs
         WHERE faq_group = :g AND is_active = 1
         ORDER BY sort_order ASC, id ASC',
        ['g' => $group]
    );

    return array_map(static fn ($r) => [
        'id'       => (int) $r['id'],
        'question' => $r['question'],
        'answer'   => $r['answer'],
    ], $rows);
}

const SERVICE_COLUMNS = 's.*, c.slug AS category_slug, c.name AS category_name, c.accent AS category_accent';

/** GET /api/categories */
function route_service_categories(): void
{
    $rows = db_all(
        "SELECT c.*, (SELECT COUNT(*) FROM services s WHERE s.category_id = c.id AND s.is_active = 1) AS service_count
         FROM service_categories c
         WHERE c.is_active = 1
         ORDER BY c.sort_order ASC, c.name ASC"
    );

    json_response(['data' => array_map(static fn ($r) => shape_service_category($r), $rows)]);
}

/** GET /api/categories/{slug} */
function route_service_category(string $slug): void
{
    $category = db_one(
        'SELECT * FROM service_categories WHERE slug = :slug AND is_active = 1',
        ['slug' => $slug]
    );
    if (!$category) {
        json_error('Service category not found', 404);
    }

    $rows = db_all(
        'SELECT ' . SERVICE_COLUMNS . '
         FROM services s
         JOIN service_categories c ON c.id = s.category_id
         WHERE s.category_id = :id AND s.is_active = 1
         ORDER BY s.sort_order ASC, s.id ASC',
        ['id' => $category['id']]
    );

    $data = array_merge(shape_service_category($category, count($rows)), [
        'services' => array_map(static fn ($r) => shape_service($r), $rows),
        'faqs'     => faqs_for_group($slug),
    ]);

    json_response(['data' => $data]);
}

/** GET /api/services?category=&featured=&q=&grouped= */
function route_services(): void
{
    $where = ['s.is_active = 1'];
    $params = [];

    if (!empty($_GET['category'])) {
        $where[] = 'c.slug = :category';
        $params['category'] = $_GET['category'];
    }
    if (($_GET['featured'] ?? '') === 'true') {
        $where[] = 's.is_featured = 1';
    }
    if (!empty($_GET['q'])) {
        $where[] = '(s.name LIKE :q OR s.summary LIKE :q)';
        $params['q'] = '%' . $_GET['q'] . '%';
    }

    $clause = implode(' AND ', $where);

    $rows = db_all(
        'SELECT ' . SERVICE_COLUMNS . "
         FROM services s
         JOIN service_categories c ON c.id = s.category_id
         WHERE $clause
         ORDER BY c.sort_order ASC, s.sort_order ASC",
        $params
    );

    $services = array_map(static fn ($r) => shape_service($r), $rows);

    if (($_GET['grouped'] ?? '') === 'true') {
        $categories = db_all('SELECT * FROM service_categories WHERE is_active = 1 ORDER BY sort_order ASC');
        $data = [];
        foreach ($categories as $category) {
            $inGroup = array_values(array_filter(
                $services,
                static fn ($s) => $s['category']['slug'] === $category['slug']
            ));
            if ($inGroup) {
                $data[] = array_merge(shape_service_category($category, count($inGroup)), [
                    'services' => $inGroup,
                ]);
            }
        }
        json_response(['data' => $data, 'meta' => ['total' => count($services), 'categories' => count($data)]]);
    }

    json_response(['data' => $services, 'meta' => ['total' => count($services)]]);
}

/** GET /api/services/{slug} */
function route_service(string $slug): void
{
    $row = db_one(
        'SELECT ' . SERVICE_COLUMNS . '
         FROM services s
         JOIN service_categories c ON c.id = s.category_id
         WHERE s.slug = :slug AND s.is_active = 1',
        ['slug' => $slug]
    );
    if (!$row) {
        json_error('Service not found', 404);
    }

    $related = db_all(
        'SELECT ' . SERVICE_COLUMNS . '
         FROM services s
         JOIN service_categories c ON c.id = s.category_id
         WHERE s.category_id = :cid AND s.id <> :id AND s.is_active = 1
         ORDER BY s.sort_order ASC
         LIMIT 4',
        ['cid' => $row['category_id'], 'id' => $row['id']]
    );

    $service = shape_service($row);
    $service['related'] = array_map(static fn ($r) => shape_service($r), $related);
    $service['faqs'] = faqs_for_group($row['category_slug']);

    json_response(['data' => $service]);
}
