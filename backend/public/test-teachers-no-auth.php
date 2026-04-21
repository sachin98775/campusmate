<?php

// Test teachers endpoint without authentication
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Load environment
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    // Connect to database
    $db = CampusMate\Config\Database::getInstance()->getDatabase();
    
    // Get teachers
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
        'data' => $teacherList,
        'count' => count($teacherList),
        'message' => 'Teachers retrieved successfully!',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Failed to retrieve teachers'
    ]);
}
