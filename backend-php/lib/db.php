<?php
/** PDO connection, created once per request. */

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = require __DIR__ . '/../config.php';
    $db = $config['db'];

    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $db['host'],
        $db['port'] ?? 3306,
        $db['name'],
        $db['charset'] ?? 'utf8mb4'
    );

    try {
        $pdo = new PDO($dsn, $db['user'], $db['password'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            // Real prepared statements, so user input can never be parsed as SQL.
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        error_log('ESTEQO DB connection failed: ' . $e->getMessage());
        json_error('Database unavailable.', 503);
    }

    return $pdo;
}

/** Runs a query and returns every row. */
function db_all(string $sql, array $params = []): array
{
    $statement = db()->prepare($sql);
    $statement->execute($params);
    return $statement->fetchAll();
}

/** Runs a query and returns the first row, or null. */
function db_one(string $sql, array $params = []): ?array
{
    $statement = db()->prepare($sql);
    $statement->execute($params);
    $row = $statement->fetch();
    return $row === false ? null : $row;
}

/** Runs a write and returns the number of affected rows. */
function db_run(string $sql, array $params = []): int
{
    $statement = db()->prepare($sql);
    $statement->execute($params);
    return $statement->rowCount();
}

/** Inserts a row and returns its new id. */
function db_insert(string $table, array $data): int
{
    $columns = array_keys($data);
    $placeholders = array_map(static fn ($c) => ":$c", $columns);

    $sql = sprintf(
        'INSERT INTO `%s` (%s) VALUES (%s)',
        $table,
        '`' . implode('`, `', $columns) . '`',
        implode(', ', $placeholders)
    );

    db_run($sql, $data);
    return (int) db()->lastInsertId();
}
