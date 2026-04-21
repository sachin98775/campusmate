<?php

declare(strict_types=1);

require_once __DIR__ . '/../vendor/autoload.php';

use CampusMate\Config\Database;

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->safeLoad();
}

try {
    if (!extension_loaded('mongodb')) {
        throw new \RuntimeException('PHP extension "mongodb" is not loaded.');
    }

    if (!class_exists(\MongoDB\Client::class)) {
        throw new \RuntimeException('mongodb/mongodb composer package is not available.');
    }

    if (empty($_ENV['DB_URI'])) {
        throw new \RuntimeException('DB_URI is missing in .env');
    }

    $db = Database::getInstance()->getDatabase();

    // Lightweight DB health check command.
    $pingResult = $db->command(['ping' => 1])->toArray();

    echo json_encode([
        'success' => true,
        'message' => 'Backend and MongoDB connection successful.',
        'database' => $_ENV['DB_NAME'] ?? 'campusmate',
        'db_uri_host' => parse_url($_ENV['DB_URI'], PHP_URL_HOST) ?: 'unknown',
        'ping' => $pingResult[0] ?? ['ok' => 1],
        'timestamp' => date('c')
    ], JSON_UNESCAPED_SLASHES);
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed.',
        'error' => $e->getMessage(),
        'hints' => [
            'Ensure PHP extension mongodb is enabled',
            'Run composer install in backend directory',
            'Verify DB_URI and DB_NAME in backend/.env',
            'For Atlas, whitelist your current IP in Network Access'
        ],
        'timestamp' => date('c')
    ], JSON_UNESCAPED_SLASHES);
}

<?php

// Simple test file to check if backend is working
header('Content-Type: application/json');

echo json_encode([
    'success' => true,
    'message' => 'Backend is working!',
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
]);
