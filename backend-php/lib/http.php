<?php
/** Request/response helpers shared by every route. */

/**
 * Not every PHP build ships the mbstring extension, and without it the whole
 * validation layer would fatal. This counts UTF-8 characters using PCRE, which
 * gives the same answer as mb_strlen for the length limits we enforce.
 */
if (!function_exists('mb_strlen')) {
    function mb_strlen(string $value, ?string $encoding = null): int
    {
        $count = preg_match_all('/./us', $value);
        return $count === false ? strlen($value) : $count;
    }
}

/** Sends a JSON response and stops. */
function json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * Error shape matches the Node API exactly, so the React client's error
 * handling works unchanged: { error, details? }
 */
function json_error(string $message, int $status = 400, array $details = []): void
{
    $body = ['error' => $message];
    if ($details) {
        $body['details'] = $details;
    }
    json_response($body, $status);
}

/** Decoded JSON body, or an empty array. */
function request_body(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

/**
 * Reads a request header case-insensitively.
 *
 * Custom headers arrive differently depending on whether PHP runs as an Apache
 * module, CGI or FastCGI, so all the usual spellings are checked.
 */
function request_header(string $name): string
{
    $normalised = strtoupper(str_replace('-', '_', $name));

    foreach (["HTTP_$normalised", $normalised, "REDIRECT_HTTP_$normalised"] as $key) {
        if (!empty($_SERVER[$key])) {
            return trim($_SERVER[$key]);
        }
    }

    if (function_exists('getallheaders')) {
        foreach (getallheaders() as $key => $value) {
            if (strcasecmp($key, $name) === 0) {
                return trim($value);
            }
        }
    }

    return '';
}

/** Applies CORS for the allowed origins and answers preflight requests. */
function apply_cors(array $allowed): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, x-admin-key, Accept');
    header('Access-Control-Max-Age: 86400');

    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(204);
        exit;
    }
}

/** The visitor's IP, honouring a proxy header when present. */
function client_ip(): ?string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded !== '') {
        $first = trim(explode(',', $forwarded)[0]);
        if ($first !== '') {
            return substr($first, 0, 45);
        }
    }
    return isset($_SERVER['REMOTE_ADDR']) ? substr($_SERVER['REMOTE_ADDR'], 0, 45) : null;
}

/** Human-readable booking reference, e.g. ESQ-8F3K2Q. */
function make_reference(): string
{
    $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    $code = '';
    for ($i = 0; $i < 6; $i++) {
        $code .= $alphabet[random_int(0, strlen($alphabet) - 1)];
    }
    return "ESQ-$code";
}

/** "My Post Title!" -> "my-post-title" */
function slugify(string $value, int $max = 200): string
{
    $slug = strtolower(trim($value));
    $slug = str_replace('&', ' and ', $slug);
    $slug = preg_replace('/[^a-z0-9]+/', '-', $slug) ?? '';
    $slug = trim($slug, '-');
    return substr($slug, 0, $max);
}

/** Page/limit/offset from the query string. */
function pagination(int $defaultLimit = 12, int $maxLimit = 500): array
{
    $page = max(1, (int) ($_GET['page'] ?? 1));
    $limit = (int) ($_GET['limit'] ?? $defaultLimit);
    if ($limit < 1) {
        $limit = $defaultLimit;
    }
    $limit = min($limit, $maxLimit);
    return [$page, $limit, ($page - 1) * $limit];
}
