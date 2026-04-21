<?php

// Test teacher assignment API
require_once __DIR__ . '/../vendor/autoload.php';

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
    // Load environment
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    // Simple MongoDB connection test
    $client = new MongoDB\Client($_ENV['DB_URI']);
    $database = $client->selectDatabase($_ENV['DB_NAME']);
    
    // Parse request
    $uri = $_SERVER['REQUEST_URI'];
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Remove query string and base path
    $uri = strtok($uri, '?');
    $basePath = '/api';
    if (strpos($uri, $basePath) === 0) {
        $uri = substr($uri, strlen($basePath));
    }
    
    // Get input data
    $input = [];
    if ($method === 'POST' || $method === 'PUT') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
    }
    
    switch ($uri) {
        case '/subjects/assign-teacher':
            if ($method === 'POST') {
                echo json_encode([
                    'success' => true,
                    'message' => 'Teacher assignment test successful!',
                    'input' => $input,
                    'teacher' => [
                        'id' => $input['teacherId'] ?? 'test-teacher-id',
                        'name' => 'Test Teacher',
                        'teacherKey' => 'KCPT001'
                    ],
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            }
            break;
            
        case '/classes':
            if ($method === 'GET') {
                echo json_encode([
                    'success' => true,
                    'data' => [
                        [
                            'id' => 'class-001',
                            'name' => 'BCA 3A',
                            'grade' => '3',
                            'section' => 'A',
                            'subjects' => [
                                [
                                    'id' => 'subj-001',
                                    'name' => 'Data Structures',
                                    'teacherId' => '',
                                    'teacherName' => 'Not assigned',
                                    'teacherKey' => ''
                                ],
                                [
                                    'id' => 'subj-002',
                                    'name' => 'Algorithms',
                                    'teacherId' => '',
                                    'teacherName' => 'Not assigned',
                                    'teacherKey' => ''
                                ]
                            ]
                        ]
                    ],
                    'count' => 1,
                    'message' => 'Classes retrieved successfully (test data)!',
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            }
            break;
            
        case '/admin/teachers':
            if ($method === 'GET') {
                echo json_encode([
                    'success' => true,
                    'data' => [
                        [
                            'id' => 'teacher-001',
                            'name' => 'John Smith',
                            'email' => 'john.smith@campusmate.com',
                            'phone' => '9876543210',
                            'department' => 'Computer Science',
                            'teacherKey' => 'KCPT001',
                            'teacher_code' => 'KCPT001'
                        ],
                        [
                            'id' => 'teacher-002',
                            'name' => 'Sarah Johnson',
                            'email' => 'sarah.johnson@campusmate.com',
                            'phone' => '9876543211',
                            'department' => 'Mathematics',
                            'teacherKey' => 'KCPT002',
                            'teacher_code' => 'KCPT002'
                        ]
                    ],
                    'count' => 2,
                    'message' => 'Teachers retrieved successfully (test data)!',
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => true,
                'message' => 'Test assignment server is running!',
                'available_routes' => [
                    'GET /api/classes' => 'Get classes with subjects (test data)',
                    'GET /api/admin/teachers' => 'Get teachers (test data)',
                    'POST /api/subjects/assign-teacher' => 'Assign teacher to subject (test)'
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Test assignment error occurred'
    ]);
}
