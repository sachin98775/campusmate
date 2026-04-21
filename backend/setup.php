<?php

require_once 'vendor/autoload.php';

use CampusMate\Config\Database;

echo "Initializing CampusMate Database...\n";

try {
    $database = Database::getInstance();
    
    // Initialize database (create collections and indexes)
    $database->initialize();
    echo "✓ Database initialized successfully\n";
    
    // Seed initial data
    $database->seed();
    echo "✓ Initial data seeded successfully\n";
    
    echo "\nDatabase setup complete!\n";
    echo "Default credentials:\n";
    echo "Admin: admin@campusmate.com / Kcpadmin123\n";
    echo "Teacher: teacher@campus.com / teacher123\n";
    echo "Teacher: sarah@campus.com / sarah123\n";
    echo "Student: Use any roll number with DOB 2000-01-01\n";
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo "Make sure MongoDB is running and accessible.\n";
}
