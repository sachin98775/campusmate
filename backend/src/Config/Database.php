<?php

namespace CampusMate\Config;

use MongoDB\Client;
use MongoDB\Database as MongoDatabase;
use MongoDB\BSON\UTCDateTime;

class Database {
    private static ?self $instance = null;
    private Client $client;
    private MongoDatabase $database;

    private function __construct() {
        $envPath = dirname(__DIR__, 2);
        if (file_exists($envPath . '/.env')) {
            $dotenv = \Dotenv\Dotenv::createImmutable($envPath);
            $dotenv->safeLoad();
        }
        
        $uri = $_ENV['DB_URI'] ?? 'mongodb://localhost:27017';
        $dbName = $_ENV['DB_NAME'] ?? 'campusmate';
        
        $this->client = new Client($uri);
        $this->database = $this->client->selectDatabase($dbName);
    }

    public static function getInstance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function getDatabase(): MongoDatabase {
        return $this->database;
    }

    public function getCollection(string $name) {
        return $this->database->selectCollection($name);
    }

    public function initialize(): void {
        foreach (['users', 'classes', 'attendance'] as $collection) {
            try {
                $this->database->createCollection($collection);
            } catch (\Throwable $e) {
                // Collection already exists; ignore.
            }
        }
        $this->createIndexes();
    }

    private function createIndexes(): void {
        $this->database->selectCollection('users')->createIndex(['teacherKey' => 1], ['sparse' => true, 'unique' => true]);
        $this->database->selectCollection('users')->createIndex(['roll_number' => 1], ['sparse' => true, 'unique' => true]);
        $this->database->selectCollection('users')->createIndex(['role' => 1]);
        $this->database->selectCollection('classes')->createIndex(['name' => 1]);
        $this->database->selectCollection('attendance')->createIndex(
            ['subjectId' => 1, 'studentId' => 1, 'date' => 1],
            ['unique' => true]
        );
        $this->database->selectCollection('attendance')->createIndex(['classId' => 1, 'date' => 1]);
    }

    public function seed(): void {
        if ($this->database->selectCollection('users')->countDocuments() > 0) {
            return;
        }

        $now = new UTCDateTime();
        $teachers = [
            [
                'name' => 'John Doe',
                'phone' => '9876543210',
                'teacherKey' => 'KCPT001',
                'role' => 'teacher',
                'department' => 'Computer Science',
                'created_at' => $now,
                'updated_at' => $now
            ],
            [
                'name' => 'Sarah Smith',
                'phone' => '9876543211',
                'teacherKey' => 'KCPT002',
                'role' => 'teacher',
                'department' => 'Mathematics',
                'created_at' => $now,
                'updated_at' => $now
            ]
        ];
        $insertTeachers = $this->database->selectCollection('users')->insertMany($teachers);
        $teacherIds = $insertTeachers->getInsertedIds();
        
        $classes = [
            [
                'name' => 'BCA 1A',
                'subjects' => [
                    ['id' => 'CS101', 'name' => 'Computer Fundamentals', 'code' => 'CS101', 'credits' => 3, 'teacherId' => (string) $teacherIds[0]],
                    ['id' => 'MATH101', 'name' => 'Mathematics', 'code' => 'MATH101', 'credits' => 4, 'teacherId' => (string) $teacherIds[1]]
                ],
                'created_at' => $now,
                'updated_at' => $now
            ]
        ];
        $insertClasses = $this->database->selectCollection('classes')->insertMany($classes);
        $classId = (string) $insertClasses->getInsertedIds()[0];

        $this->database->selectCollection('users')->insertOne([
            'name' => 'Sachin',
            'roll_number' => 'BCA2023001',
            'dob' => '2000-01-01',
            'class_id' => $classId,
            'role' => 'student',
            'created_at' => $now,
            'updated_at' => $now
        ]);
    }
}
