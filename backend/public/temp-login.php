<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true) ?? [];
if (empty($input) && !empty($_POST)) {
    $input = $_POST;
}
$role = $input['role'] ?? '';

// Temporary bypass for MongoDB issues
if ($role === 'teacher') {
    $teacherKey = $input['teacherKey'] ?? '';
    
    // Simple validation - accept common teacher keys for testing
    $validKeys = ['KCPT001', 'KCPT002', 'KCPT003', 'TEACHER1', 'TEACHER2'];
    
    if (in_array(strtoupper($teacherKey), $validKeys)) {
        // Create mock teacher data
        $teacherData = [
            'success' => true,
            'token' => 'temp-token-' . time(),
            'user' => [
                'id' => 'temp-teacher-' . $teacherKey,
                'name' => 'Teacher ' . $teacherKey,
                'teacherKey' => $teacherKey,
                'role' => 'teacher',
                'phone' => '9876543210'
            ]
        ];
        echo json_encode($teacherData);
        exit;
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid teacher key. Try: KCPT001, KCPT002, KCPT003'
        ]);
        exit;
    }
}

// Handle other roles with simple responses
if ($role === 'admin') {
    $adminKey = $input['adminKey'] ?? '';
    if ($adminKey === 'Kcpadmin123') {
        echo json_encode([
            'success' => true,
            'token' => 'temp-admin-token-' . time(),
            'user' => ['id' => 'admin-1', 'name' => 'Admin User', 'role' => 'admin']
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid admin key']);
    }
    exit;
}

if ($role === 'student') {
    echo json_encode(['success' => false, 'message' => 'Student login temporarily disabled']);
    exit;
}

echo json_encode(['success' => false, 'message' => 'Invalid role']);
?>
