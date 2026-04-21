<?php

// Test MongoDB Atlas connection
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Load environment
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    // Test connection
    $uri = $_ENV['DB_URI'];
    $dbName = $_ENV['DB_NAME'];
    
    echo json_encode([
        'status' => 'testing',
        'uri' => $uri,
        'dbName' => $dbName,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
    // Connect to MongoDB
    $client = new MongoDB\Client($uri);
    $database = $client->selectDatabase($dbName);
    
    // Test basic operation
    $collections = $database->listCollectionNames();
    
    echo json_encode([
        'success' => true,
        'message' => 'MongoDB Atlas connection successful!',
        'database' => $dbName,
        'collections' => $collections,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'MongoDB connection failed'
    ]);
}
