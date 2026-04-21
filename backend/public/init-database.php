<?php

// Initialize database with collections and sample data
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
    
    // Create collections
    $collections = ['users', 'classes', 'subjects', 'attendance'];
    $createdCollections = [];
    
    foreach ($collections as $collectionName) {
        $collection = $database->selectCollection($collectionName);
        $createdCollections[] = $collectionName;
    }
    
    // Insert sample admin user
    $adminExists = $database->selectCollection('users')->findOne(['role' => 'admin']);
    
    if (!$adminExists) {
        $database->selectCollection('users')->insertOne([
            'name' => 'Admin User',
            'email' => 'admin@campusmate.com',
            'role' => 'admin',
            'password' => password_hash('admin123', PASSWORD_DEFAULT),
            'adminKey' => 'Kcpadmin123',
            'createdAt' => new MongoDB\BSON\UTCDateTime()
        ]);
        $adminInserted = true;
    } else {
        $adminInserted = false;
    }
    
    // Insert sample teachers
    $teacherCount = $database->selectCollection('users')->countDocuments(['role' => 'teacher']);
    
    if ($teacherCount === 0) {
        $sampleTeachers = [
            [
                'name' => 'Test Teacher 1',
                'phone' => '1010101010',
                'department' => 'Computer Science',
                'role' => 'teacher',
                'teacherKey' => 'KCPT001',
                'teacher_code' => 'KCPT001',
                'password' => password_hash('teacher123', PASSWORD_DEFAULT),
                'createdAt' => new MongoDB\BSON\UTCDateTime()
            ],
            [
                'name' => 'Test Teacher 2',
                'phone' => '2020202020',
                'department' => 'Mathematics',
                'role' => 'teacher',
                'teacherKey' => 'KCPT002',
                'teacher_code' => 'KCPT002',
                'password' => password_hash('teacher123', PASSWORD_DEFAULT),
                'createdAt' => new MongoDB\BSON\UTCDateTime()
            ]
        ];
        
        foreach ($sampleTeachers as $teacher) {
            $database->selectCollection('users')->insertOne($teacher);
        }
        $teachersInserted = 2;
    } else {
        $teachersInserted = $teacherCount;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'Database initialized successfully!',
        'collections' => $createdCollections,
        'adminInserted' => $adminInserted,
        'teachersCount' => $teachersInserted,
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'message' => 'Database initialization failed'
    ]);
}
