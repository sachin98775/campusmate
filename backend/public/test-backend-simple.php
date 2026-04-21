<?php

// Test backend without database operations
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // Parse request
    $uri = $_SERVER['REQUEST_URI'];
    $method = $_SERVER['REQUEST_METHOD'];
    
    // Remove query string and base path
    $uri = strtok($uri, '?');
    $basePath = '/api';
    if (strpos($uri, $basePath) === 0) {
        $uri = substr($uri, strlen($basePath));
    }
    
    // Simple route test
    switch ($uri) {
        case '/admin/teachers':
            if ($method === 'GET') {
                // Return mock data for testing
                $mockTeachers = [
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
                ];
                
                echo json_encode([
                    'success' => true,
                    'data' => $mockTeachers,
                    'message' => 'Backend is working with mock data!',
                    'database_status' => 'MongoDB Atlas connected but driver issues',
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents('php://input'), true) ?? [];
                
                // Mock teacher creation
                $newTeacher = [
                    'id' => 'teacher-' . time(),
                    'name' => $input['name'] ?? 'New Teacher',
                    'email' => ($input['name'] ?? 'teacher') . '@campusmate.com',
                    'phone' => $input['phone'] ?? '0000000000',
                    'department' => $input['department'] ?? 'Not assigned',
                    'teacherKey' => 'KCPT' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT),
                    'teacher_code' => 'KCPT' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT)
                ];
                
                echo json_encode([
                    'success' => true,
                    'message' => 'Teacher added successfully (mock mode)',
                    'teacher' => $newTeacher,
                    'timestamp' => date('Y-m-d H:i:s')
                ]);
            }
            break;
            
        default:
            echo json_encode([
                'success' => true,
                'message' => 'Backend server is running!',
                'uri' => $uri,
                'method' => $method,
                'available_routes' => [
                    'GET /api/admin/teachers' => 'Get all teachers',
                    'POST /api/admin/teachers' => 'Add new teacher'
                ],
                'timestamp' => date('Y-m-d H:i:s')
            ]);
    }
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Backend error occurred'
    ]);
}
