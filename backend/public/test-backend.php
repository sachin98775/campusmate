<?php

// Simple backend test without authentication
require_once __DIR__ . '/../vendor/autoload.php';

// Set CORS headers
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Test database connection
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    $db = CampusMate\Config\Database::getInstance()->getDatabase();
    
    // Get teachers without authentication
    $teachers = $db->selectCollection('users')->find(['role' => 'teacher'])->toArray();
    
    $teacherList = [];
    foreach ($teachers as $teacher) {
        $teacherList[] = [
            'id' => (string) $teacher['_id'],
            'name' => $teacher['name'],
            'phone' => $teacher['phone'],
            'teacherKey' => $teacher['teacherKey'] ?? '',
            'department' => $teacher['department'] ?? 'Not assigned',
            'email' => $teacher['email'] ?? ''
        ];
    }

    echo json_encode([
        'success' => true,
        'message' => 'Backend is working!',
        'data' => $teacherList,
        'count' => count($teacherList),
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Backend error occurred'
    ]);
}
