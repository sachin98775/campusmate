<?php
require_once __DIR__ . '/../vendor/autoload.php';

use CampusMate\Config\Database;

echo "=== Verifying Database Status ===\n\n";

try {
    
    $database = Database::getInstance();
    $db = $database->getDatabase();
    
    echo "DATABASE COLLECTION STATUS:\n";
    echo "==========================\n\n";
    
    // Check users collection
    $usersCollection = $db->selectCollection('users');
    $totalUsers = $usersCollection->countDocuments();
    $teachers = $usersCollection->countDocuments(['role' => 'teacher']);
    $students = $usersCollection->countDocuments(['role' => 'student']);
    $admins = $usersCollection->countDocuments(['role' => 'admin']);
    
    echo "USERS COLLECTION:\n";
    echo "- Total Users: $totalUsers\n";
    echo "- Teachers: $teachers\n";
    echo "- Students: $students\n";
    echo "- Admins: $admins\n\n";
    
    // Check other collections
    $attendance = $db->selectCollection('attendance')->countDocuments();
    $classes = $db->selectCollection('classes')->countDocuments();
    $enrollments = $db->selectCollection('enrollments')->countDocuments();
    
    echo "OTHER COLLECTIONS:\n";
    echo "- Attendance Records: $attendance\n";
    echo "- Classes: $classes\n";
    echo "- Enrollments: $enrollments\n\n";
    
    // Check admin account
    $adminUser = $usersCollection->findOne(['role' => 'admin']);
    if ($adminUser) {
        echo "ADMIN ACCOUNT STATUS:\n";
        echo "Email: " . ($adminUser['email'] ?? 'N/A') . "\n";
        echo "Admin Key: " . ($adminUser['adminKey'] ?? 'N/A') . "\n";
        echo "Status: Active\n\n";
    }
    
    echo "SUMMARY:\n";
    if ($teachers === 0 && $students === 0 && $attendance === 0 && $classes === 0) {
        echo "SUCCESS: Database is clean and ready for fresh setup!\n";
        echo "Only admin account remains for system management.\n";
    } else {
        echo "WARNING: Some data still exists in the database.\n";
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
