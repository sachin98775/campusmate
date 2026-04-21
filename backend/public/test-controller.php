<?php

// Test AdminController directly
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Load environment
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    // Create AdminController instance and test getTeachers
    $controller = new CampusMate\Controllers\AdminController();
    
    // Test the getTeachers method
    $result = $controller->getTeachers();
    
    echo $result;
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Controller test failed'
    ]);
}
