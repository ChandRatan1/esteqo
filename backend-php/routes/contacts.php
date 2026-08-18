<?php
/**
 * Website form intake.
 *
 * POST /api/contacts stores one row per submission in `contacts`, with a column
 * for every field the visitor can fill in. The contact form, the appointment
 * request and the newsletter signup all land here, told apart by form_type.
 *
 * GET routes are read-only reporting helpers for whoever manages enquiries.
 */

/**
 * Active offers, keyed by code.
 *
 * The amount is authoritative here — the browser only sends the code, so a
 * crafted request cannot claim an arbitrary discount.
 */
const OFFERS = [
    'WELCOME500' => ['code' => 'WELCOME500', 'price' => 500, 'label' => '500 off your first treatment'],
];

/** POST /api/contacts */
function route_contacts_create(array $config): void
{
    $input = request_body();

    // Honeypot: real visitors never fill this in. Accept quietly so the bot
    // sees success, but flag the row instead of storing it as a real enquiry.
    $isSpam = !empty($input['website']);

    if (!$isSpam) {
        $limit = $config['rate_limit'] ?? ['max' => 30, 'window_minutes' => 15];
        rate_limit('contacts', (int) $limit['max'], (int) $limit['window_minutes']);
    }

    $v = new Validator($input);
    $formType = $v->oneOf('formType', ['contact', 'appointment', 'newsletter'], 'contact');

    if (!$isSpam) {
        if ($formType === 'newsletter') {
            $v->email('email');
        } else {
            $v->name('fullName');
            $v->email('email');
            $v->phone('phone');
        }

        if ($formType === 'appointment') {
            $v->required('location', 'Please choose your location');
            $v->date('preferredDate', true);
            $v->required('preferredTime', 'Please choose a time');
        }

        if ($formType === 'contact') {
            $v->message('message', true);
        } else {
            $v->message('message', false);
        }

        $v->subject('subject', false);
        $v->maxLength('serviceName', 200, 'Service');
        $v->maxLength('location', 120, 'Location');
        $v->assert();
    }

    $reference = make_reference();

    // The discount comes from the server's own table, never the request body.
    $offerCode = (string) ($input['offerCode'] ?? '');
    $offer = OFFERS[$offerCode] ?? null;

    $row = [
        'form_type'      => $formType,
        'reference'      => $reference,
        'full_name'      => nullable((string) ($input['fullName'] ?? '')),
        'email'          => nullable(strtolower((string) ($input['email'] ?? ''))),
        'phone'          => nullable((string) ($input['phone'] ?? '')),
        'location'       => nullable((string) ($input['location'] ?? '')),
        'service_slug'   => nullable((string) ($input['serviceSlug'] ?? '')),
        'service_name'   => nullable((string) ($input['serviceName'] ?? '')),
        'service_price'  => nullable((string) ($input['servicePrice'] ?? '')),
        'category_slug'  => nullable((string) ($input['categorySlug'] ?? '')),
        'preferred_date' => nullable((string) ($input['preferredDate'] ?? '')),
        'preferred_time' => nullable((string) ($input['preferredTime'] ?? '')),
        'contact_method' => in_array($input['contactMethod'] ?? '', ['call', 'whatsapp', 'email', 'sms'], true)
            ? $input['contactMethod']
            : 'call',
        'subject'        => nullable((string) ($input['subject'] ?? '')),
        'message'        => nullable((string) ($input['message'] ?? '')),
        'source_page'    => nullable((string) ($input['sourcePage'] ?? ($_SERVER['HTTP_REFERER'] ?? ''))),
        'referrer'       => nullable((string) ($_SERVER['HTTP_REFERER'] ?? '')),
        'ip_address'     => client_ip(),
        'user_agent'     => substr((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255) ?: null,
        'captcha_passed' => 1,
        'is_spam'        => $isSpam ? 1 : 0,
        'email_sent'     => !empty($input['emailSent']) ? 1 : 0,
        'status'         => 'new',
    ];

    if ($offer) {
        $row['offer_price']  = $offer['price'];
        $row['offer_code']   = $offer['code'];
        $row['offer_label']  = $offer['label'];
        $row['offer_source'] = in_array($input['offerSource'] ?? '', ['badge', 'popup', 'page'], true)
            ? $input['offerSource']
            : 'page';
    }

    $id = db_insert('contacts', $row);

    $firstName = '';
    if (!empty($row['full_name'])) {
        $firstName = explode(' ', trim($row['full_name']))[0];
    }

    json_response([
        'data' => [
            'id'        => $id,
            'reference' => $reference,
            'stored'    => true,
            'message'   => $firstName !== ''
                ? "Thank you, $firstName. We have received your enquiry and will be in touch shortly."
                : 'Thank you - we have received your enquiry.',
        ],
    ], 201);
}

/** GET /api/contacts?formType=&status=&page=&limit= — admin only. */
function route_contacts_list(array $config): void
{
    require_admin($config);

    [$page, $limit, $offset] = pagination(25, 200);

    $where = ['is_spam = 0'];
    $params = [];

    if (!empty($_GET['formType'])) {
        $where[] = 'form_type = :form_type';
        $params['form_type'] = $_GET['formType'];
    }
    if (!empty($_GET['status'])) {
        $where[] = 'status = :status';
        $params['status'] = $_GET['status'];
    }

    $clause = implode(' AND ', $where);

    $total = (int) (db_one("SELECT COUNT(*) AS n FROM contacts WHERE $clause", $params)['n'] ?? 0);

    $rows = db_all(
        "SELECT * FROM contacts WHERE $clause ORDER BY created_at DESC LIMIT $limit OFFSET $offset",
        $params
    );

    json_response([
        'data' => $rows,
        'meta' => [
            'page'  => $page,
            'limit' => $limit,
            'total' => $total,
            'pages' => max(1, (int) ceil($total / $limit)),
        ],
    ]);
}

/** GET /api/contacts/stats — counts by form type and status. */
function route_contacts_stats(array $config): void
{
    require_admin($config);

    $rows = db_all(
        'SELECT form_type, status, COUNT(*) AS count
         FROM contacts WHERE is_spam = 0
         GROUP BY form_type, status'
    );

    json_response([
        'data' => array_map(static fn ($r) => [
            'form_type' => $r['form_type'],
            'status'    => $r['status'],
            'count'     => (int) $r['count'],
        ], $rows),
    ]);
}

/**
 * GET /api/contacts/{id} - one enquiry with every field.
 */
function route_contacts_get(array $config, int $id): void
{
    require_admin($config);

    $row = db_one('SELECT * FROM contacts WHERE id = :id', ['id' => $id]);
    if (!$row) {
        json_error('Enquiry not found', 404);
    }

    json_response(['data' => $row]);
}

/**
 * PUT /api/contacts/{id} - update the workflow fields only.
 *
 * Only `status` and `admin_notes` can be changed. What the visitor actually
 * submitted is never editable, so the record of the enquiry stays truthful.
 */
function route_contacts_update(array $config, int $id): void
{
    require_admin($config);

    $existing = db_one('SELECT id FROM contacts WHERE id = :id', ['id' => $id]);
    if (!$existing) {
        json_error('Enquiry not found', 404);
    }

    $input = request_body();
    $changes = [];

    if (array_key_exists('status', $input)) {
        $allowed = ['new', 'read', 'responded', 'booked', 'closed'];
        if (!in_array($input['status'], $allowed, true)) {
            json_error('Invalid status', 422, [
                ['field' => 'status', 'message' => 'Use one of: ' . implode(', ', $allowed)],
            ]);
        }
        $changes['status'] = $input['status'];
    }

    if (array_key_exists('adminNotes', $input)) {
        $changes['admin_notes'] = nullable((string) $input['adminNotes']);
    }

    if (!$changes) {
        json_error('Nothing to update. Send status and/or adminNotes.', 422);
    }

    $assignments = implode(', ', array_map(
        static fn ($c) => sprintf('`%s` = :%s', $c, $c),
        array_keys($changes)
    ));
    db_run("UPDATE contacts SET $assignments WHERE id = :id", $changes + ['id' => $id]);

    json_response(['data' => db_one('SELECT * FROM contacts WHERE id = :id', ['id' => $id])]);
}

/**
 * DELETE /api/contacts/{id} - remove an enquiry (spam clean-up).
 */
function route_contacts_delete(array $config, int $id): void
{
    require_admin($config);

    if (!db_run('DELETE FROM contacts WHERE id = :id', ['id' => $id])) {
        json_error('Enquiry not found', 404);
    }

    json_response(['data' => ['id' => $id, 'deleted' => true]]);
}
