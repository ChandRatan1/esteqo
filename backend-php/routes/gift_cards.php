<?php
/**
 * Gift card requests.
 *
 * A visitor picks services and leaves their details — no payment happens on
 * the site. The request lands in `gift_card_requests` with status 'pending';
 * a staff member calls the buyer to take payment, emails the gift code by
 * hand, then marks it issued in /admin/gift-cards. (A payment screenshot is
 * still accepted if ever sent, but the public form no longer asks for one.)
 */

/** POST /api/gift-cards (public) */
function route_gift_card_create(array $config): void
{
    $input = request_body();

    if (!empty($input['website'])) {
        // Honeypot — accept quietly, store nothing.
        json_response(['data' => ['stored' => true]], 201);
    }

    $limit = $config['rate_limit'] ?? ['max' => 30, 'window_minutes' => 15];
    rate_limit('gift_cards', (int) $limit['max'], (int) $limit['window_minutes']);

    $v = new Validator($input);
    $v->name('buyerName');
    $v->phone('buyerPhone');
    $v->email('buyerEmail', false);
    $v->maxLength('recipientName', 160, 'Recipient name');
    $v->maxLength('recipientContact', 200, 'Recipient contact');
    $v->maxLength('amountNote', 200, 'Amount');
    $v->message('message', false);
    $v->assert();

    $services = $input['services'] ?? [];
    if (!is_array($services) || count($services) === 0) {
        json_error('Choose at least one service.', 422, [
            ['field' => 'services', 'message' => 'Choose at least one service.'],
        ]);
    }
    $serviceNames = array_values(array_filter(array_map(
        static fn ($s) => is_string($s) ? trim($s) : '',
        $services
    )));
    if (!$serviceNames) {
        json_error('Choose at least one service.', 422);
    }

    $screenshotPath = null;
    $dataUrl = (string) ($input['screenshot'] ?? '');
    if ($dataUrl !== '') {
        $screenshotPath = gift_card_save_screenshot($dataUrl, $config);
    }

    $row = [
        'buyer_name'         => trim((string) $input['buyerName']),
        'buyer_email'        => nullable(strtolower((string) ($input['buyerEmail'] ?? ''))),
        'buyer_phone'        => trim((string) $input['buyerPhone']),
        'recipient_name'     => nullable((string) ($input['recipientName'] ?? '')),
        'recipient_contact'  => nullable((string) ($input['recipientContact'] ?? '')),
        'services'           => json_encode($serviceNames, JSON_UNESCAPED_UNICODE),
        'amount_note'        => nullable((string) ($input['amountNote'] ?? '')),
        'payment_screenshot' => $screenshotPath,
        'message'            => nullable((string) ($input['message'] ?? '')),
        'status'             => 'pending',
        'ip_address'         => client_ip(),
    ];

    $id = db_insert('gift_card_requests', $row);

    json_response([
        'data' => [
            'id'         => $id,
            'stored'     => true,
            // Public path of the saved screenshot so the front end can link it
            // in the notification email.
            'screenshot' => $screenshotPath,
            'message'    => 'Thank you — we will call you shortly to arrange payment, and email your gift code once it is confirmed.',
        ],
    ], 201);
}

/** Decodes and saves a base64 payment-screenshot data URL, returns its public path. */
function gift_card_save_screenshot(string $dataUrl, array $config): string
{
    if (!preg_match('/^data:([a-zA-Z0-9\/+.-]+);base64,(.+)$/s', $dataUrl, $matches)) {
        json_error('The payment screenshot could not be read.', 422);
    }

    $mime = strtolower($matches[1]);
    if (!isset(UPLOAD_EXTENSIONS[$mime])) {
        json_error('Unsupported image type for the screenshot. Use JPG, PNG or WebP.', 422);
    }

    $binary = base64_decode($matches[2], true);
    if ($binary === false || $binary === '') {
        json_error('The payment screenshot could not be read.', 422);
    }

    $maxBytes = (int) ($config['upload_max_bytes'] ?? 8 * 1024 * 1024);
    if (strlen($binary) > $maxBytes) {
        json_error('That screenshot is too large.', 413);
    }

    if (@getimagesizefromstring($binary) === false) {
        json_error('That file is not a readable image.', 422);
    }

    $directory = rtrim((string) ($config['upload_dir'] ?? (__DIR__ . '/../../uploads')), '/') . '/gift-cards';
    if (!is_dir($directory) && !@mkdir($directory, 0755, true) && !is_dir($directory)) {
        json_error('The uploads directory could not be created.', 500);
    }

    $name = 'payment-' . date('Ymd-His') . '-' . bin2hex(random_bytes(4)) . UPLOAD_EXTENSIONS[$mime];
    if (file_put_contents($directory . '/' . $name, $binary) === false) {
        json_error('The screenshot could not be saved.', 500);
    }

    return '/uploads/gift-cards/' . $name;
}

/** GET /api/admin/gift-cards?status= */
function route_admin_gift_cards_list(array $config): void
{
    require_admin($config);

    [$page, $limit, $offset] = pagination(25, 200);

    $where = [];
    $params = [];
    if (!empty($_GET['status'])) {
        $where[] = 'status = :status';
        $params['status'] = $_GET['status'];
    }
    $clause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

    $total = (int) (db_one("SELECT COUNT(*) AS n FROM gift_card_requests $clause", $params)['n'] ?? 0);
    $rows = db_all(
        "SELECT * FROM gift_card_requests $clause ORDER BY created_at DESC LIMIT $limit OFFSET $offset",
        $params
    );

    foreach ($rows as &$row) {
        $decoded = json_decode((string) $row['services'], true);
        $row['services'] = is_array($decoded) ? $decoded : [];
    }
    unset($row);

    json_response([
        'data' => $rows,
        'meta' => [
            'page' => $page, 'limit' => $limit, 'total' => $total,
            'pages' => max(1, (int) ceil($total / $limit)),
        ],
    ]);
}

/** PUT /api/admin/gift-cards/{id} — status, gift_code, admin_note only. */
function route_admin_gift_card_update(array $config, int $id): void
{
    require_admin($config);

    $existing = db_one('SELECT id FROM gift_card_requests WHERE id = :id', ['id' => $id]);
    if (!$existing) {
        json_error('Gift card request not found', 404);
    }

    $input = request_body();
    $changes = [];

    if (array_key_exists('status', $input)) {
        $allowed = ['pending', 'verified', 'issued', 'rejected'];
        if (!in_array($input['status'], $allowed, true)) {
            json_error('Invalid status', 422, [
                ['field' => 'status', 'message' => 'Use one of: ' . implode(', ', $allowed)],
            ]);
        }
        $changes['status'] = $input['status'];
    }
    if (array_key_exists('giftCode', $input)) {
        $changes['gift_code'] = nullable((string) $input['giftCode']);
    }
    if (array_key_exists('adminNote', $input)) {
        $changes['admin_note'] = nullable((string) $input['adminNote']);
    }

    if (!$changes) {
        json_error('Nothing to update. Send status, giftCode and/or adminNote.', 422);
    }

    $assignments = implode(', ', array_map(
        static fn ($c) => sprintf('`%s` = :%s', $c, $c),
        array_keys($changes)
    ));
    db_run("UPDATE gift_card_requests SET $assignments WHERE id = :id", $changes + ['id' => $id]);

    $row = db_one('SELECT * FROM gift_card_requests WHERE id = :id', ['id' => $id]);
    $decoded = json_decode((string) $row['services'], true);
    $row['services'] = is_array($decoded) ? $decoded : [];

    json_response(['data' => $row]);
}
