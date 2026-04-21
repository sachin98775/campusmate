<?php

require_once 'vendor/autoload.php';

use CampusMate\Config\Database;

echo "Clearing all mock students and teachers...\n";

try {
    $database = Database::getInstance();
    $db = $database->getDatabase();
    
    // Delete all teachers
    $teacherResult = $db->selectCollection('users')->deleteMany(['role' => 'teacher']);
    echo "✓ Deleted {$teacherResult->getDeletedCount()} teachers\n";
    
    // Delete all students
    $studentResult = $db->selectCollection('users')->deleteMany(['role' => 'student']);
    echo "✓ Deleted {$studentResult->getDeletedCount()} students\n";
    
    // Clear enrollments
    $enrollmentResult = $db->selectCollection('enrollments')->deleteMany([]);
    echo "✓ Cleared {$enrollmentResult->getDeletedCount()} enrollments\n";
    
    // Clear attendance
    $attendanceResult = $db->selectCollection('attendance')->deleteMany([]);
    echo "✓ Cleared {$attendanceResult->getDeletedCount()} attendance records\n";
    
    // Clear classes (keep subjects)
    $classResult = $db->selectCollection('classes')->deleteMany([]);
    echo "✓ Cleared {$classResult->getDeletedCount()} classes\n";
    
    echo "\n✅ System cleared successfully!\n";
    echo "📋 Remaining data:\n";
    echo "   - Admin account: admin@campusmate.com / Kcpadmin123\n";
    echo "   - Subjects: All subjects preserved for class creation\n";
    echo "\n🎯 Ready for fresh setup:\n";
    echo "   1. Admin can now create new classes\n";
    echo "   2. Admin can add subjects to classes\n";
    echo "   3. Admin can add new students\n";
    echo "   4. Admin can create teacher accounts\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB is running and accessible.\n";
}
