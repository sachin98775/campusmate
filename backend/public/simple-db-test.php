<?php

// Simple database test without complex operations
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Load environment
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    // Test connection
    $client = new MongoDB\Client($_ENV['DB_URI']);
    $database = $client->selectDatabase($_ENV['DB_NAME']);
    
    // Simple connection test
    echo json_encode([
        'success' => true,
        'message' => 'Database connection successful!',
        'database' => $_ENV['DB_NAME'],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Database connection failed'
    ]);
}
