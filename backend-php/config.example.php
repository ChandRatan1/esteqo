<?php
/**
 * ESTEQO API configuration.
 *
 * Copy to config.php on the server and fill in the real values.
 * config.php is git-ignored and blocked from the web by .htaccess.
 */

return [
    // --- Database (Hostinger hPanel -> Databases -> MySQL) -----------------
    // On Hostinger the host is usually 'localhost' and the user/database names
    // are prefixed, e.g. u123456789_esteqo.
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'name'     => 'u000000000_esteqo',
        'user'     => 'u000000000_esteqo',
        'password' => 'change-me',
        'charset'  => 'utf8mb4',
    ],

    // --- Blog authoring ----------------------------------------------------
    // Sent by the admin screen as the `x-admin-key` header.
    // Use a long random string. Blank disables every /admin route.
    'admin_key' => '',

    // --- Browser origins allowed to call this API --------------------------
    'cors_origins' => [
        'https://esteqo.com',
        'https://www.esteqo.com',
        'http://localhost:4142',
    ],

    // --- Uploads -----------------------------------------------------------
    // Directory is relative to this file. Must be writable (755).
    'upload_dir' => __DIR__ . '/../uploads',
    // Public URL of that directory.
    'upload_url' => 'https://esteqo.com/uploads',
    'upload_max_bytes' => 8 * 1024 * 1024,

    // Submissions per IP per window, for the public write endpoints.
    'rate_limit' => ['max' => 30, 'window_minutes' => 15],
];
