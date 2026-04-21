<?php
require_once __DIR__ . '/../vendor/autoload.php';

use CampusMate\Controllers\AdminController;
use CampusMate\Config\Database;

header('Content-Type: application/json');

try {
    // Initialize database
    $database = Database::getInstance();
    $database->initialize();
    
    $admin = new AdminController();
    
    // Test 1: Create a test student
    echo "=== Testing Student Deletion ===\n";
    
    $testStudentData = [
        'name' => 'Test Student for Deletion',
        'roll_number' => 'TEST999',
        'date_of_birth' => '2000-01-01',
        'class_id' => '507f1f77bcf86cd799439011' // Assuming this class exists
    ];
    
    echo "Creating test student...\n";
    $createResult = $admin->addStudent($testStudentData);
    echo json_encode($createResult, JSON_PRETTY_PRINT) . "\n\n";
    
    if ($createResult['success']) {
        $studentId = $createResult['student']['id'];
        echo "Created student with ID: $studentId\n\n";
        
        // Test 2: Delete the student
        echo "Deleting student permanently...\n";
        $deleteResult = $admin->deleteStudent($studentId);
        echo json_encode($deleteResult, JSON_PRETTY_PRINT) . "\n\n";
        
        // Test 3: Verify student is deleted
        echo "Verifying student deletion...\n";
        $db = Database::getInstance()->getDatabase();
        $usersCollection = $db->selectCollection('users');
        $attendanceCollection = $db->selectCollection('attendance');
        
        $deletedStudent = $usersCollection->findOne(['_id' => new MongoDB\BSON\ObjectId($studentId)]);
        $attendanceRecords = $attendanceCollection->countDocuments(['studentId' => $studentId]);
        
        echo "Student still in database: " . ($deletedStudent ? "YES (ERROR!)" : "NO (Correct)") . "\n";
        echo "Attendance records remaining: $attendanceRecords\n\n";
        
        if (!$deletedStudent && $attendanceRecords === 0) {
            echo "✅ SUCCESS: Student and all related data permanently deleted!\n";
        } else {
            echo "❌ FAILURE: Student deletion incomplete!\n";
        }
    }
    
} catch (Exception $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}
?>
