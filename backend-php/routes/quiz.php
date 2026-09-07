<?php
/**
 * Skin quiz submissions.
 *
 * The quiz itself is emailed to the clinic by the browser (see
 * react-app/src/api/forms.js -> submitQuiz), the same way every other
 * enquiry form on the site is delivered — there is no SMTP configured on
 * this backend. This endpoint's only job is to persist a durable copy of
 * every submission, since a lost or spam-filtered email would otherwise be
 * the only record of it.
 */

/** POST /api/quiz (public) */
function route_quiz_create(array $config): void
{
    $input = request_body();

    $limit = $config['rate_limit'] ?? ['max' => 30, 'window_minutes' => 15];
    rate_limit('quiz', (int) $limit['max'], (int) $limit['window_minutes']);

    $v = new Validator($input);
    $v->name('firstName');
    $v->email('email');
    $v->assert();

    $answers = $input['answers'] ?? [];
    if (!is_array($answers)) {
        $answers = [];
    }

    $row = [
        'first_name'           => trim((string) $input['firstName']),
        'last_name'            => nullable((string) ($input['lastName'] ?? '')),
        'email'                => strtolower(trim((string) $input['email'])),
        'answers'              => json_encode($answers, JSON_UNESCAPED_UNICODE),
        'recommended_service'  => nullable((string) ($input['recommendedService'] ?? '')),
        'email_sent'           => !empty($input['emailSent']) ? 1 : 0,
        'ip_address'           => client_ip(),
    ];

    $id = db_insert('quiz_submissions', $row);

    json_response(['data' => ['id' => $id, 'stored' => true]], 201);
}

/** GET /api/admin/quiz?page=&limit= */
function route_admin_quiz_list(array $config): void
{
    require_admin($config);

    [$page, $limit, $offset] = pagination(25, 200);

    $total = (int) (db_one('SELECT COUNT(*) AS n FROM quiz_submissions')['n'] ?? 0);
    $rows = db_all(
        "SELECT * FROM quiz_submissions ORDER BY created_at DESC LIMIT $limit OFFSET $offset"
    );

    foreach ($rows as &$row) {
        $decoded = json_decode((string) $row['answers'], true);
        $row['answers'] = is_array($decoded) ? $decoded : [];
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
