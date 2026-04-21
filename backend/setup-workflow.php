<?php

require_once '../vendor/autoload.php';

use CampusMate\Config\Database;

echo "Initializing CampusMate Database with Complete Workflow...\n";

try {
    $database = Database::getInstance();
    
    // Initialize database (create collections and indexes)
    $database->initialize();
    echo "✓ Database initialized successfully\n";
    
    // Clear existing data for fresh setup
    $db = $database->getDatabase();
    $db->dropCollection('users');
    $db->dropCollection('classes');
    $db->dropCollection('subjects');
    $db->dropCollection('attendance');
    $db->dropCollection('enrollments');
    echo "✓ Cleared existing data\n";
    
    // Re-initialize collections
    $database->initialize();
    
    // Seed admin user
    $db->selectCollection('users')->insertOne([
        'name' => 'Admin User',
        'email' => 'admin@campusmate.com',
        'password' => password_hash('Kcpadmin123', PASSWORD_DEFAULT),
        'role' => 'admin',
        'created_at' => new \MongoDB\BSON\UTCDateTime(),
        'updated_at' => new \MongoDB\BSON\UTCDateTime()
    ]);

    // Seed subjects
    $subjects = [
        ['name' => 'Data Structures', 'code' => 'CS201', 'credits' => 4, 'description' => 'Study of data organization and management'],
        ['name' => 'Algorithms', 'code' => 'CS202', 'credits' => 4, 'description' => 'Design and analysis of algorithms'],
        ['name' => 'Database Systems', 'code' => 'CS203', 'credits' => 3, 'description' => 'Database design and implementation'],
        ['name' => 'Web Development', 'code' => 'CS204', 'credits' => 3, 'description' => 'Modern web development practices'],
        ['name' => 'Computer Fundamentals', 'code' => 'CS101', 'credits' => 3, 'description' => 'Introduction to computer science'],
        ['name' => 'Mathematics', 'code' => 'MATH101', 'credits' => 4, 'description' => 'Mathematical foundations'],
        ['name' => 'Physics', 'code' => 'PHY101', 'credits' => 3, 'description' => 'Physics for computer science'],
        ['name' => 'English Communication', 'code' => 'ENG101', 'credits' => 2, 'description' => 'English communication skills']
    ];

    $subjectIds = [];
    foreach ($subjects as $subject) {
        $result = $db->selectCollection('subjects')->insertOne([
            'name' => $subject['name'],
            'code' => $subject['code'],
            'credits' => $subject['credits'],
            'description' => $subject['description'],
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ]);
        $subjectIds[$subject['code']] = $result->getInsertedId();
    }

    // Seed teachers (predefined by admin)
    $teachers = [
        [
            'name' => 'John Doe',
            'email' => 'john.doe@campus.com',
            'password' => password_hash('teacher123', PASSWORD_DEFAULT),
            'role' => 'teacher',
            'employee_id' => 'TCH001',
            'department' => 'Computer Science',
            'specialization' => 'Data Structures & Algorithms',
            'phone' => '+1234567890',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ],
        [
            'name' => 'Sarah Smith',
            'email' => 'sarah.smith@campus.com',
            'password' => password_hash('teacher123', PASSWORD_DEFAULT),
            'role' => 'teacher',
            'employee_id' => 'TCH002',
            'department' => 'Computer Science',
            'specialization' => 'Database Systems',
            'phone' => '+1234567891',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ],
        [
            'name' => 'Michael Johnson',
            'email' => 'michael.j@campus.com',
            'password' => password_hash('teacher123', PASSWORD_DEFAULT),
            'role' => 'teacher',
            'employee_id' => 'TCH003',
            'department' => 'Computer Science',
            'specialization' => 'Web Development',
            'phone' => '+1234567892',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ]
    ];

    $teacherIds = [];
    foreach ($teachers as $teacher) {
        $result = $db->selectCollection('users')->insertOne($teacher);
        $teacherIds[$teacher['email']] = $result->getInsertedId();
    }

    // Create sample classes (BCA 1, BCA 2, BCA 3)
    $classes = [
        [
            'name' => 'BCA 1',
            'description' => 'Bachelor of Computer Applications - First Year',
            'subjects' => [
                ['subject_id' => $subjectIds['CS101'], 'teacher_id' => $teacherIds['michael.j@campus.com']],
                ['subject_id' => $subjectIds['MATH101'], 'teacher_id' => $teacherIds['john.doe@campus.com']],
                ['subject_id' => $subjectIds['PHY101'], 'teacher_id' => $teacherIds['sarah.smith@campus.com']],
                ['subject_id' => $subjectIds['ENG101'], 'teacher_id' => $teacherIds['sarah.smith@campus.com']]
            ],
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ],
        [
            'name' => 'BCA 2',
            'description' => 'Bachelor of Computer Applications - Second Year',
            'subjects' => [
                ['subject_id' => $subjectIds['CS201'], 'teacher_id' => $teacherIds['john.doe@campus.com']],
                ['subject_id' => $subjectIds['CS202'], 'teacher_id' => $teacherIds['john.doe@campus.com']],
                ['subject_id' => $subjectIds['MATH101'], 'teacher_id' => $teacherIds['john.doe@campus.com']]
            ],
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ],
        [
            'name' => 'BCA 3',
            'description' => 'Bachelor of Computer Applications - Third Year',
            'subjects' => [
                ['subject_id' => $subjectIds['CS203'], 'teacher_id' => $teacherIds['sarah.smith@campus.com']],
                ['subject_id' => $subjectIds['CS204'], 'teacher_id' => $teacherIds['michael.j@campus.com']],
                ['subject_id' => $subjectIds['CS201'], 'teacher_id' => $teacherIds['john.doe@campus.com']]
            ],
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ]
    ];

    $classIds = [];
    foreach ($classes as $class) {
        $result = $db->selectCollection('classes')->insertOne($class);
        $classIds[$class['name']] = $result->getInsertedId();
    }

    // Create sample students for each class
    $studentsData = [
        'BCA 1' => [
            ['name' => 'Alice Johnson', 'roll_number' => 'BCA101001', 'dob' => '2005-01-15'],
            ['name' => 'Bob Smith', 'roll_number' => 'BCA101002', 'dob' => '2005-02-20'],
            ['name' => 'Charlie Brown', 'roll_number' => 'BCA101003', 'dob' => '2005-03-10'],
            ['name' => 'Diana Prince', 'roll_number' => 'BCA101004', 'dob' => '2005-04-25'],
            ['name' => 'Edward Norton', 'roll_number' => 'BCA101005', 'dob' => '2005-05-30']
        ],
        'BCA 2' => [
            ['name' => 'Frank Miller', 'roll_number' => 'BCA102001', 'dob' => '2004-01-10'],
            ['name' => 'Grace Kelly', 'roll_number' => 'BCA102002', 'dob' => '2004-02-15'],
            ['name' => 'Henry Ford', 'roll_number' => 'BCA102003', 'dob' => '2004-03-20'],
            ['name' => 'Iris Watson', 'roll_number' => 'BCA102004', 'dob' => '2004-04-05'],
            ['name' => 'Jack Wilson', 'roll_number' => 'BCA102005', 'dob' => '2004-06-12']
        ],
        'BCA 3' => [
            ['name' => 'Kate Middleton', 'roll_number' => 'BCA103001', 'dob' => '2003-01-08'],
            ['name' => 'Liam Neeson', 'roll_number' => 'BCA103002', 'dob' => '2003-02-14'],
            ['name' => 'Mona Lisa', 'roll_number' => 'BCA103003', 'dob' => '2003-03-22'],
            ['name' => 'Nathan Drake', 'roll_number' => 'BCA103004', 'dob' => '2003-04-30'],
            ['name' => 'Olivia Wilde', 'roll_number' => 'BCA103005', 'dob' => '2003-05-18']
        ]
    ];

    foreach ($studentsData as $className => $students) {
        foreach ($students as $studentData) {
            $studentResult = $db->selectCollection('users')->insertOne([
                'name' => $studentData['name'],
                'email' => strtolower(str_replace(' ', '.', $studentData['name'])) . '@campus.com',
                'password' => password_hash('password', PASSWORD_DEFAULT), // Default password
                'role' => 'student',
                'roll_number' => $studentData['roll_number'],
                'dob' => $studentData['dob'],
                'class_id' => $classIds[$className],
                'created_at' => new \MongoDB\BSON\UTCDateTime(),
                'updated_at' => new \MongoDB\BSON\UTCDateTime()
            ]);

            // Enroll student in class
            $db->selectCollection('enrollments')->insertOne([
                'student_id' => $studentResult->getInsertedId(),
                'class_id' => $classIds[$className],
                'enrolled_at' => new \MongoDB\BSON\UTCDateTime()
            ]);
        }
    }

    echo "✓ Complete workflow data seeded successfully\n";
    echo "\n=== CampusMate System Ready ===\n";
    echo "\n📋 Login Credentials:\n";
    echo "🔑 Admin: admin@campusmate.com / Kcpadmin123\n";
    echo "👨‍🏫 Teachers:\n";
    echo "   - john.doe@campus.com / teacher123\n";
    echo "   - sarah.smith@campus.com / teacher123\n";
    echo "   - michael.j@campus.com / teacher123\n";
    echo "👨‍🎓 Students (Login with Roll Number + DOB):\n";
    echo "   - BCA101001 / 2005-01-15 (Alice Johnson)\n";
    echo "   - BCA101002 / 2005-02-20 (Bob Smith)\n";
    echo "   - BCA102001 / 2004-01-10 (Frank Miller)\n";
    echo "   - BCA103001 / 2003-01-08 (Kate Middleton)\n";
    echo "\n📚 Classes Created:\n";
    echo "   - BCA 1 (4 subjects, 5 students)\n";
    echo "   - BCA 2 (3 subjects, 5 students)\n";
    echo "   - BCA 3 (3 subjects, 5 students)\n";
    echo "\n🎯 Workflow Ready:\n";
    echo "   1. Admin creates classes, adds subjects, assigns teachers\n";
    echo "   2. Admin adds students with roll numbers and DOB\n";
    echo "   3. Students login with roll number + DOB\n";
    echo "   4. Teachers login with email + password\n";
    echo "   5. Teachers mark attendance for their classes\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB is running and accessible.\n";
}
