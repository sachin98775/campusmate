<?php
require_once __DIR__ . '/../vendor/autoload.php';

if (file_exists(__DIR__ . '/../.env')) {
    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->safeLoad();
}

$cors_origin = $_ENV['CORS_ORIGIN'] ?? 'https://campusmate-9clon2r64-sachinrawat8872-4277s-projects.vercel.app';

// Allow from Vercel domain or any explicitly configured origin
if (isset($_SERVER['HTTP_ORIGIN']) && (
    $_SERVER['HTTP_ORIGIN'] === $cors_origin || 
    strpos($_SERVER['HTTP_ORIGIN'], 'https://campusmate-') === 0 // Allow all Vercel previews temporarily
)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
} else {
    // Fallback for development if needed, or strict production
    header('Access-Control-Allow-Origin: *'); 
}

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$method = $_SERVER['REQUEST_METHOD'];
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = strtok($_SERVER['REQUEST_URI'] ?? '/', '?');
$path = preg_replace('#^/api#', '', $uri);
$input = json_decode(file_get_contents('php://input'), true) ?? [];

$admin = new CampusMate\Controllers\AdminController();
$auth = new CampusMate\Controllers\AuthController();
$teacher = new CampusMate\Controllers\TeacherController();
$student = new CampusMate\Controllers\StudentController();

try {
    if ($path === '/temp-login.php' && $method === 'POST') {
        // Temporary login bypass for MongoDB issues
        $role = $input['role'] ?? '';
        
        if ($role === 'teacher') {
            $teacherKey = $input['teacherKey'] ?? '';
            $validKeys = ['KCPT001', 'KCPT002', 'KCPT003', 'TEACHER1', 'TEACHER2'];
            
            if (in_array(strtoupper($teacherKey), $validKeys)) {
                echo json_encode([
                    'success' => true,
                    'token' => 'temp-token-' . time(),
                    'user' => [
                        'id' => 'temp-teacher-' . $teacherKey,
                        'name' => 'Teacher ' . $teacherKey,
                        'teacherKey' => $teacherKey,
                        'role' => 'teacher',
                        'phone' => '9876543210'
                    ]
                ]);
                exit;
            } else {
                echo json_encode([
                    'success' => false,
                    'message' => 'Invalid teacher key. Try: KCPT001, KCPT002, KCPT003'
                ]);
                exit;
            }
        }
        
        echo json_encode(['success' => false, 'message' => 'Invalid role']);
        exit;
    }
    
    if ($path === '/auth/login' && $method === 'POST') {
        echo json_encode($auth->login($input));
        exit;
    }
    if ($path === '/admin/dashboard' && $method === 'GET') {
        echo json_encode($admin->getDashboard());
        exit;
    }
    if ($path === '/classes' && $method === 'GET') {
        echo json_encode($admin->getClasses());
        exit;
    }
    if (preg_match('#^/admin/classes/([a-f0-9]{24})$#', $path, $m) && $method === 'GET') {
        echo json_encode($admin->getClassById($m[1]));
        exit;
    }
    if ($path === '/admin/classes' && $method === 'POST') {
        echo json_encode($admin->createClass($input));
        exit;
    }
    if ($path === '/admin/teachers' && $method === 'GET') {
        echo json_encode($admin->getTeachers());
        exit;
    }
    if ($path === '/admin/teachers' && $method === 'POST') {
        echo json_encode($admin->createTeacher($input));
        exit;
    }
    if (preg_match('#^/admin/teachers/([a-f0-9]{24})$#', $path, $m) && $method === 'DELETE') {
        echo json_encode($admin->deleteTeacher($m[1]));
        exit;
    }
    if (preg_match('#^/admin/students/([a-f0-9]{24})$#', $path, $m) && $method === 'DELETE') {
        echo json_encode($admin->deleteStudent($m[1]));
        exit;
    }
    if ($path === '/admin/add-subject-to-class' && $method === 'POST') {
        echo json_encode($admin->addSubjectToClass($input));
        exit;
    }
    if ($path === '/admin/students' && $method === 'GET') {
        echo json_encode($admin->getStudents());
        exit;
    }
    if ($path === '/admin/add-student' && $method === 'POST') {
        echo json_encode($admin->addStudent($input));
        exit;
    }
    if ($path === '/subjects/assign-teacher' && $method === 'POST') {
        echo json_encode($admin->assignTeacherToSubject($input));
        exit;
    }
    if ($path === '/teacher/subjects' && $method === 'GET') {
        echo json_encode($teacher->getSubjectsByTeacher($_GET['teacherId'] ?? null));
        exit;
    }
    if (preg_match('#^/teacher/attendance-context/([^/]+)$#', $path, $m) && $method === 'GET') {
        echo json_encode($teacher->getAttendanceContext(urldecode($m[1])));
        exit;
    }
    if ($path === '/teacher/attendance' && $method === 'POST') {
        echo json_encode($teacher->submitAttendance($input));
        exit;
    }
    if ($path === '/subjects' && $method === 'GET') {
        echo json_encode($student->getSubjectsByClass((string) ($_GET['classId'] ?? '')));
        exit;
    }
    if (preg_match('#^/student/attendance-summary/([^/]+)$#', $path, $m) && $method === 'GET') {
        echo json_encode($student->getAttendanceSummary($m[1]));
        exit;
    }
    if (preg_match('#^/student/attendance-details/([^/]+)$#', $path, $m) && $method === 'GET') {
        echo json_encode($student->getAttendanceDetails($m[1]));
        exit;
    }

    http_response_code(404);
    echo json_encode(['success' => false, 'message' => 'Endpoint not found']);
} catch (\Throwable $e) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
