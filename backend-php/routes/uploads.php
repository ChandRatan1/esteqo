<?php
/**
 * Image uploads for the blog admin.
 *
 *   POST /api/admin/blog/upload   { dataUrl, filename }
 *
 * The browser reads the chosen file as a data URL and posts it here. We decode
 * it, write a real file into the uploads directory, and return the public URL
 * to store against the post — blog_posts.image_url is only 255 characters, so
 * the image itself can never live in the database.
 */

const UPLOAD_EXTENSIONS = [
    'image/jpeg' => '.jpg',
    'image/jpg'  => '.jpg',
    'image/png'  => '.png',
    'image/webp' => '.webp',
    'image/gif'  => '.gif',
    'image/avif' => '.avif',
];

/** "my Photo.JPG" -> "my-photo" */
function upload_basename(string $filename): string
{
    $name = pathinfo($filename, PATHINFO_FILENAME);
    $slug = slugify($name !== '' ? $name : 'image', 60);
    return $slug !== '' ? $slug : 'image';
}

function route_admin_upload(array $config): void
{
    $input = request_body();
    $dataUrl = (string) ($input['dataUrl'] ?? '');

    if (strlen($dataUrl) < 20) {
        json_error('No image data was received.', 422);
    }

    if (!preg_match('/^data:([a-zA-Z0-9\/+.-]+);base64,(.+)$/s', $dataUrl, $matches)) {
        json_error('Expected a base64 data URL.', 422);
    }

    $mime = strtolower($matches[1]);
    if (!isset(UPLOAD_EXTENSIONS[$mime])) {
        json_error(
            'Unsupported image type: ' . $mime . '. Use JPG, PNG, WebP, GIF or AVIF.',
            422
        );
    }

    $binary = base64_decode($matches[2], true);
    if ($binary === false || $binary === '') {
        json_error('The image data could not be read.', 422);
    }

    $maxBytes = (int) ($config['upload_max_bytes'] ?? 8 * 1024 * 1024);
    if (strlen($binary) > $maxBytes) {
        json_error(sprintf(
            'That image is %.1f MB. The limit is %.0f MB.',
            strlen($binary) / 1024 / 1024,
            $maxBytes / 1024 / 1024
        ), 413);
    }

    // Confirm the bytes really are an image, rather than trusting the MIME
    // string the client sent.
    $info = @getimagesizefromstring($binary);
    if ($info === false) {
        json_error('That file is not a readable image.', 422);
    }

    $directory = $config['upload_dir'] ?? (__DIR__ . '/../../uploads');
    if (!is_dir($directory) && !@mkdir($directory, 0755, true) && !is_dir($directory)) {
        json_error('The uploads directory could not be created. Check folder permissions.', 500);
    }
    if (!is_writable($directory)) {
        json_error('The uploads directory is not writable. Set it to 755.', 500);
    }

    // Random suffix keeps same-named uploads from overwriting each other.
    $name = upload_basename((string) ($input['filename'] ?? 'image'))
        . '-' . bin2hex(random_bytes(4))
        . UPLOAD_EXTENSIONS[$mime];

    if (file_put_contents($directory . '/' . $name, $binary) === false) {
        json_error('The image could not be saved.', 500);
    }

    $baseUrl = rtrim((string) ($config['upload_url'] ?? '/uploads'), '/');

    json_response([
        'data' => [
            'url'   => $baseUrl . '/' . $name,
            'path'  => '/uploads/' . $name,
            'bytes' => strlen($binary),
            'type'  => $mime,
        ],
    ], 201);
}
