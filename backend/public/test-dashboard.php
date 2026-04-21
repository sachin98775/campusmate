<?php

// Simple test for dashboard API
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$uri = $_SERVER['REQUEST_URI'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? '';

// Remove query string and base path
$uri = strtok($uri, '?');
$basePath = '/api';
if (strpos($uri, $basePath) === 0) {
    $uri = substr($uri, strlen($basePath));
}

switch ($uri) {
    case '/admin/dashboard':
        if ($method === 'GET') {
            echo json_encode([
                'success' => true,
                'stats' => [
                    'totalStudents' => 120,
                    'totalTeachers' => 8,
                    'totalClasses' => 6,
                    'totalSubjects' => 24
                ],
                'message' => 'Admin dashboard stats retrieved successfully',
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
                'message' => 'Teachers retrieved successfully',
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
                        'id' => '1',
                        'name' => 'BCA 3A',
                        'grade' => '3',
                        'section' => 'A',
                        'subjects' => [
                            [
                                'id' => 'CS101',
                                'name' => 'Data Structures',
                                'code' => 'CS101',
                                'credits' => 3,
                                'teacherId' => '',
                                'teacherName' => 'Not assigned',
                                'teacherKey' => ''
                            ]
                        ]
                    ]
                ],
                'count' => 1,
                'message' => 'Classes retrieved successfully',
                'timestamp' => date('Y-m-d H:i:s')
            ]);
        }
        break;
        
    default:
        echo json_encode([
            'success' => true,
            'message' => 'Test dashboard server is running!',
            'available_routes' => [
                'GET /api/admin/dashboard' => 'Get admin dashboard stats',
                'GET /api/admin/teachers' => 'Get teachers',
                'GET /api/classes' => 'Get classes'
            ],
            'timestamp' => date('Y-m-d H:i:s')
        ]);
}
