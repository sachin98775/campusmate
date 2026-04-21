<?php

require_once __DIR__ . '/vendor/autoload.php';

use CampusMate\Config\Database;

echo "🚀 Setting up CampusMate Backend...\n\n";

try {
    // Initialize database connection
    $db = Database::getInstance()->getDatabase();
    echo "✅ Database connection established\n";
    
    // Create collections with indexes
    $collections = [
        'users' => [
            'indexes' => [
                ['email' => 1],
                ['role' => 1],
                ['teacherKey' => 1],
                ['roll_number' => 1, 'classId' => 1]
            ]
        ],
        'classes' => [
            'indexes' => [
                ['className' => 1],
                ['teacherId' => 1],
                ['course' => 1],
                ['semester' => 1]
            ]
        ],
        'subjects' => [
            'indexes' => [
                ['name' => 1, 'classId' => 1],
                ['classId' => 1],
                ['teacherId' => 1]
            ]
        ],
        'attendance' => [
            'indexes' => [
                ['studentId' => 1, 'date' => 1],
                ['classId' => 1, 'date' => 1],
                ['subjectId' => 1, 'date' => 1],
                ['teacherId' => 1, 'date' => 1]
            ]
        ],
        'enrollments' => [
            'indexes' => [
                ['studentId' => 1, 'classId' => 1],
                ['classId' => 1],
                ['studentId' => 1]
            ]
        ]
    ];
    
    // Create collections and indexes
    foreach ($collections as $collectionName => $config) {
        echo "📁 Creating collection: $collectionName\n";
        
        // Create collection if it doesn't exist
        if (!$db->listCollectionNames(['$in' => [$collectionName]])) {
            $db->createCollection($collectionName);
            echo "   ✅ Collection created\n";
        } else {
            echo "   ℹ️  Collection already exists\n";
        }
        
        // Create indexes
        $collection = $db->selectCollection($collectionName);
        foreach ($config['indexes'] as $index) {
            try {
                $collection->createIndex($index, ['unique' => isset($index['unique'])]);
                echo "   📊 Index created: " . json_encode($index) . "\n";
            } catch (Exception $e) {
                echo "   ⚠️  Index already exists or error: " . $e->getMessage() . "\n";
            }
        }
    }
    
    // Seed initial data
    echo "\n🌱 Seeding initial data...\n";
    
    // Check if admin user exists
    $adminCollection = $db->selectCollection('users');
    $existingAdmin = $adminCollection->findOne(['role' => 'admin']);
    
    if (!$existingAdmin) {
        // Create default admin
        $adminData = [
            'name' => 'Admin User',
            'email' => 'admin@campusmate.com',
            'password' => password_hash('Kcpadmin123', PASSWORD_DEFAULT),
            'role' => 'admin',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $adminCollection->insertOne($adminData);
        echo "   👤 Default admin created: admin@campusmate.com / Kcpadmin123\n";
    } else {
        echo "   ℹ️  Admin user already exists\n";
    }
    
    // Create sample teacher
    $teacherCollection = $db->selectCollection('users');
    $existingTeacher = $teacherCollection->findOne(['role' => 'teacher']);
    
    if (!$existingTeacher) {
        $teacherKey = generateTeacherKey($teacherCollection);
        
        $teacherData = [
            'name' => 'John Doe',
            'email' => 'john@campusmate.com',
            'password' => password_hash($teacherKey, PASSWORD_DEFAULT),
            'role' => 'teacher',
            'teacherKey' => $teacherKey,
            'department' => 'Computer Science',
            'subjects' => ['Data Structures', 'Algorithms'],
            'phone' => '+1234567890',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $teacherCollection->insertOne($teacherData);
        echo "   👨‍🏫 Sample teacher created\n";
        echo "      Name: John Doe\n";
        echo "      Department: Computer Science\n";
        echo "      Teacher Key: $teacherKey\n";
        echo "      Login with: $teacherKey\n";
    } else {
        echo "   ℹ️  Teacher user already exists\n";
    }
    
    // Create sample class
    $classesCollection = $db->selectCollection('classes');
    $existingClass = $classesCollection->findOne(['className' => 'BCA 3A']);
    
    if (!$existingClass) {
        $classData = [
            'className' => 'BCA 3A',
            'course' => 'BCA',
            'semester' => '3',
            'description' => 'Bachelor of Computer Applications 3rd Semester',
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $result = $classesCollection->insertOne($classData);
        $classId = $result->getInsertedId();
        
        echo "   📚 Sample class created: BCA 3A\n";
        
        // Create sample subject
        $subjectsCollection = $db->selectCollection('subjects');
        $subjectData = [
            'name' => 'Data Structures',
            'classId' => $classId,
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $subjectsCollection->insertOne($subjectData);
        echo "   📖 Sample subject created: Data Structures\n";
        
        // Create sample student
        $studentCollection = $db->selectCollection('users');
        $studentData = [
            'name' => 'Alice Johnson',
            'email' => 'alice@campusmate.com',
            'password' => password_hash('2000-01-01', PASSWORD_DEFAULT),
            'role' => 'student',
            'roll_number' => 'BCA202001',
            'dob' => '2000-01-01',
            'classId' => $classId,
            'created_at' => new \MongoDB\BSON\UTCDateTime(),
            'updated_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $studentResult = $studentCollection->insertOne($studentData);
        $studentId = $studentResult->getInsertedId();
        
        // Create enrollment
        $enrollmentsCollection = $db->selectCollection('enrollments');
        $enrollmentData = [
            'studentId' => $studentId,
            'classId' => $classId,
            'enrolled_at' => new \MongoDB\BSON\UTCDateTime()
        ];
        
        $enrollmentsCollection->insertOne($enrollmentData);
        echo "   👨‍🎓 Sample student created: BCA202001\n";
        
    } else {
        echo "   ℹ️  Sample data already exists\n";
    }
    
    echo "\n🎉 Setup completed successfully!\n";
    echo "\n📋 Next steps:\n";
    echo "   1. Start the server: php -S localhost:8000 -t public/\n";
    echo "   2. Test with Postman collection\n";
    echo "   3. Default admin: admin@campusmate.com / Kcpadmin123\n";
    
} catch (Exception $e) {
    echo "❌ Setup failed: " . $e->getMessage() . "\n";
    echo "Please check your MongoDB connection and configuration.\n";
    exit(1);
}

function generateTeacherKey($collection) {
    do {
        $key = 'KcpT' . str_pad(rand(1, 999), 3, '0', STR_PAD_LEFT);
        $existing = $collection->findOne(['teacherKey' => $key]);
    } while ($existing !== null);
    
    return $key;
}
