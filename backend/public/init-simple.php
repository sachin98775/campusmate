<?php

// Simple database initialization
require_once __DIR__ . '/../vendor/autoload.php';

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

try {
    // Load environment
    $dotenv = \Dotenv\Dotenv::createImmutable(__DIR__ . '/../');
    $dotenv->load();
    
    // Connect to MongoDB
    $client = new MongoDB\Client($_ENV['DB_URI']);
    $database = $client->selectDatabase($_ENV['DB_NAME']);
    
    // Create collections by inserting documents
    $collections = ['users', 'classes', 'subjects', 'attendance'];
    $status = [];
    
    // Insert admin user if not exists
    $adminCollection = $database->users;
    $adminExists = $adminCollection->findOne(['role' => 'admin']);
    
    if (!$adminExists) {
        $adminCollection->insertOne([
            'name' => 'Admin User',
            'email' => 'admin@campusmate.com',
            'role' => 'admin',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'adminKey' => 'Kcpadmin123',
            'createdAt' => new DateTime()
        ]);
        $status['admin'] = 'created';
    } else {
        $status['admin'] = 'exists';
    }
    
    // Insert sample teachers if none exist
    $teacherCount = $database->users->countDocuments(['role' => 'teacher']);
    
    if ($teacherCount === 0) {
        $teachers = [
            [
                'name' => 'John Smith',
                'email' => 'john.smith@campusmate.com',
                'phone' => '9876543210',
                'department' => 'Computer Science',
                'role' => 'teacher',
                'teacherKey' => 'KCPT001',
                'teacher_code' => 'KCPT001',
                'password' => password_hash('teacher123', PASSWORD_DEFAULT),
                'createdAt' => new DateTime()
            ],
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah.johnson@campusmate.com',
                'phone' => '9876543211',
                'department' => 'Mathematics',
                'role' => 'teacher',
                'teacherKey' => 'KCPT002',
                'teacher_code' => 'KCPT002',
                'password' => password_hash('teacher123', PASSWORD_DEFAULT),
                'createdAt' => new DateTime()
            ]
        ];
        
        foreach ($teachers as $teacher) {
            $database->users->insertOne($teacher);
        }
        $status['teachers'] = '2 sample teachers created';
    } else {
        $status['teachers'] = $teacherCount . ' teachers exist';
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Database initialized successfully!',
        'status' => $status,
        'database' => $_ENV['DB_NAME'],
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Database initialization failed'
    ]);
}
