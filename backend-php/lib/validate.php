<?php
/**
 * Validation rules.
 *
 * These mirror react-app/src/utils/validation.js exactly, so a request posted
 * directly to the API cannot bypass what the browser enforces.
 *
 *   Name     letters only, max 40
 *   Mobile   digits (optional leading +), 10-13
 *   Email    must contain @ and a dotted domain, max 50
 *   Subject  letters only, max 50
 *   Message  max 350
 */

const NAME_PATTERN    = "/^[A-Za-z\s.'-]+$/";
const SUBJECT_PATTERN = '/^[A-Za-z\s]+$/';
const EMAIL_PATTERN   = '/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/';
const PHONE_PATTERN   = '/^\+?\d{10,13}$/';

/** Collects {field, message} pairs the same shape the Node API returned. */
class Validator
{
    private array $errors = [];
    private array $input;

    public function __construct(array $input)
    {
        $this->input = $input;
    }

    public function value(string $field, $default = null)
    {
        $value = $this->input[$field] ?? $default;
        return is_string($value) ? trim($value) : $value;
    }

    public function add(string $field, string $message): void
    {
        if (!isset($this->errors[$field])) {
            $this->errors[$field] = ['field' => $field, 'message' => $message];
        }
    }

    public function errors(): array
    {
        return array_values($this->errors);
    }

    public function failed(): bool
    {
        return $this->errors !== [];
    }

    /** Stops with 422 and the full list when anything failed. */
    public function assert(): void
    {
        if ($this->failed()) {
            json_error('Validation failed', 422, $this->errors());
        }
    }

    public function name(string $field, bool $required = true): void
    {
        $value = (string) $this->value($field, '');
        if ($value === '') {
            if ($required) {
                $this->add($field, 'Please enter your name');
            }
            return;
        }
        if (mb_strlen($value) < 2) {
            $this->add($field, 'Please enter your full name');
        } elseif (mb_strlen($value) > 40) {
            $this->add($field, 'Name cannot exceed 40 characters');
        } elseif (preg_match('/\d/', $value)) {
            $this->add($field, 'Name cannot contain numbers');
        } elseif (!preg_match(NAME_PATTERN, $value)) {
            $this->add($field, 'Name can only contain letters');
        }
    }

    public function email(string $field, bool $required = true): void
    {
        $value = (string) $this->value($field, '');
        if ($value === '') {
            if ($required) {
                $this->add($field, 'Please enter your email address');
            }
            return;
        }
        if (mb_strlen($value) > 50) {
            $this->add($field, 'Email cannot exceed 50 characters');
        } elseif (!str_contains($value, '@')) {
            $this->add($field, 'Email must contain @');
        } elseif (!preg_match(EMAIL_PATTERN, $value)) {
            $this->add($field, 'Enter a valid email address, e.g. name@gmail.com');
        }
    }

    public function phone(string $field, bool $required = true): void
    {
        $value = (string) $this->value($field, '');
        if ($value === '') {
            if ($required) {
                $this->add($field, 'Please enter your mobile number');
            }
            return;
        }
        if (mb_strlen($value) > 13) {
            $this->add($field, 'Mobile number cannot exceed 13 characters');
        } elseif (!preg_match(PHONE_PATTERN, $value)) {
            $this->add($field, 'Mobile number can only contain numbers');
        }
    }

    public function subject(string $field, bool $required = false): void
    {
        $value = (string) $this->value($field, '');
        if ($value === '') {
            if ($required) {
                $this->add($field, 'Please enter a subject');
            }
            return;
        }
        if (mb_strlen($value) > 50) {
            $this->add($field, 'Subject cannot exceed 50 characters');
        } elseif (!preg_match(SUBJECT_PATTERN, $value)) {
            $this->add($field, 'Subject can only contain letters');
        }
    }

    public function message(string $field, bool $required = false): void
    {
        $value = (string) $this->value($field, '');
        if ($value === '') {
            if ($required) {
                $this->add($field, 'Please add a short message');
            }
            return;
        }
        if ($required && mb_strlen($value) < 5) {
            $this->add($field, 'Please add a short message');
        } elseif (mb_strlen($value) > 350) {
            $this->add($field, 'Message cannot exceed 350 characters');
        }
    }

    public function required(string $field, string $message): void
    {
        if ((string) $this->value($field, '') === '') {
            $this->add($field, $message);
        }
    }

    public function date(string $field, bool $required = false): void
    {
        $value = (string) $this->value($field, '');
        if ($value === '') {
            if ($required) {
                $this->add($field, 'Please choose a date');
            }
            return;
        }
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            $this->add($field, 'Use YYYY-MM-DD');
        }
    }

    public function maxLength(string $field, int $max, string $label): void
    {
        $value = (string) $this->value($field, '');
        if ($value !== '' && mb_strlen($value) > $max) {
            $this->add($field, "$label cannot exceed $max characters");
        }
    }

    public function oneOf(string $field, array $allowed, string $default): string
    {
        $value = (string) $this->value($field, '');
        return in_array($value, $allowed, true) ? $value : $default;
    }
}

/** Empty string becomes NULL, so optional columns stay clean. */
function nullable(?string $value): ?string
{
    if ($value === null) {
        return null;
    }
    $value = trim($value);
    return $value === '' ? null : $value;
}

/**
 * Simple per-IP rate limit backed by the filesystem, since shared hosting has
 * no Redis. Good enough to stop form spam floods.
 */
function rate_limit(string $bucket, int $max, int $windowMinutes): void
{
    $ip = client_ip() ?? 'unknown';
    $file = sys_get_temp_dir() . '/esteqo_rl_' . $bucket . '_' . md5($ip) . '.json';
    $now = time();
    $window = $windowMinutes * 60;

    $hits = [];
    if (is_readable($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $hits = $decoded;
        }
    }

    $hits = array_values(array_filter($hits, static fn ($t) => ($now - (int) $t) < $window));

    if (count($hits) >= $max) {
        json_error('Too many requests. Please try again later.', 429);
    }

    $hits[] = $now;
    @file_put_contents($file, json_encode($hits), LOCK_EX);
}
