<?php

namespace CampusMate\Controllers;

use CampusMate\Config\Database;
use MongoDB\BSON\ObjectId;
use MongoDB\BSON\UTCDateTime;

class AdminController {
    private $db;
    private $users;
    private $classes;

    public function __construct() {
        $this->db = Database::getInstance()->getDatabase();
        $this->users = $this->db->selectCollection('users');
        $this->classes = $this->db->selectCollection('classes');
    }

    public function getDashboard(): array {
        $totalSubjects = 0;
        foreach ($this->classes->find() as $class) {
            $totalSubjects += count($class['subjects'] ?? []);
        }
        return [
            'success' => true,
            'stats' => [
                'total_students' => $this->users->countDocuments(['role' => 'student']),
                'total_teachers' => $this->users->countDocuments(['role' => 'teacher']),
                'total_classes' => $this->classes->countDocuments(),
                'total_subjects' => $totalSubjects
            ]
        ];
    }

    public function getTeachers(): array {
        $rows = $this->users->find(['role' => 'teacher'])->toArray();
        return [
            'success' => true,
            'data' => array_map(fn($t) => [
                'id' => (string) $t['_id'],
                'name' => $t['name'] ?? '',
                'phone' => $t['phone'] ?? '',
                'department' => $t['department'] ?? '',
                'teacherKey' => $t['teacherKey'] ?? ''
            ], $rows)
        ];
    }

    public function createTeacher(array $data): array {
        $name = trim((string) ($data['name'] ?? ''));
        $phone = preg_replace('/\D+/', '', (string) ($data['phone'] ?? ''));
        $department = trim((string) ($data['department'] ?? 'General'));

        if ($name === '' || strlen($phone) !== 10) {
            throw new \Exception('Name, phone and department are required');
        }
        if ($this->users->findOne(['phone' => $phone, 'role' => 'teacher'])) {
            throw new \Exception('A teacher with this phone number already exists');
        }

        $teacherKey = $this->generateTeacherKey();
        $now = new UTCDateTime();
        $insert = $this->users->insertOne([
            'name' => $name,
            'phone' => $phone,
            'department' => $department,
            'teacherKey' => $teacherKey,
            'role' => 'teacher',
            'created_at' => $now,
            'updated_at' => $now
        ]);
        return [
            'success' => true,
            'message' => 'Teacher added successfully',
            'teacher' => [
                'id' => (string) $insert->getInsertedId(),
                'name' => $name,
                'phone' => $phone,
                'department' => $department,
                'teacherKey' => $teacherKey
            ]
        ];
    }

    public function deleteTeacher(string $teacherId): array {
        $id = new ObjectId($teacherId);
        $res = $this->users->deleteOne(['_id' => $id, 'role' => 'teacher']);
        if ($res->getDeletedCount() === 0) {
            throw new \Exception('Teacher not found');
        }
        return ['success' => true, 'message' => 'Teacher deleted successfully'];
    }

    public function deleteStudent(string $studentId): array {
        $id = new ObjectId($studentId);
        
        // First, delete the student permanently from users collection
        $res = $this->users->deleteOne(['_id' => $id, 'role' => 'student']);
        if ($res->getDeletedCount() === 0) {
            throw new \Exception('Student not found');
        }
        
        // Also delete any attendance records for this student to ensure complete removal
        $attendanceCollection = $this->db->selectCollection('attendance');
        $attendanceCollection->deleteMany(['studentId' => (string) $id]);
        
        return ['success' => true, 'message' => 'Student deleted permanently from database'];
    }

    public function getClasses(): array {
        $classes = $this->classes->find()->toArray();
        return [
            'success' => true,
            'data' => array_map(fn($c) => [
                'id' => (string) $c['_id'],
                'name' => $c['name'] ?? '',
                'subjects' => $c['subjects'] ?? [],
                'student_count' => $this->users->countDocuments(['role' => 'student', 'class_id' => (string) $c['_id']])
            ], $classes)
        ];
    }

    public function getClassById(string $classId): array {
        $class = $this->classes->findOne(['_id' => new ObjectId($classId)]);
        if (!$class) {
            throw new \Exception('Class not found');
        }
        $students = $this->users->find(['role' => 'student', 'class_id' => $classId])->toArray();
        return [
            'success' => true,
            'data' => [
                'id' => (string) $class['_id'],
                'name' => $class['name'] ?? '',
                'subjects' => $class['subjects'] ?? [],
                'students' => array_map(fn($s) => [
                    'id' => (string) $s['_id'],
                    'name' => $s['name'] ?? '',
                    'roll_number' => $s['roll_number'] ?? '',
                    'date_of_birth' => $s['dob'] ?? ''
                ], $students)
            ]
        ];
    }

    public function createClass(array $data): array {
        $name = trim((string) ($data['className'] ?? ''));
        if ($name === '') {
            throw new \Exception('Class name is required');
        }
        if ($this->classes->findOne(['name' => $name])) {
            throw new \Exception('Class with this name already exists');
        }
        $now = new UTCDateTime();
        $insert = $this->classes->insertOne(['name' => $name, 'subjects' => [], 'created_at' => $now, 'updated_at' => $now]);
        return ['success' => true, 'class_id' => (string) $insert->getInsertedId()];
    }

    public function addSubjectToClass(array $data): array {
        $classId = (string) ($data['class_id'] ?? '');
        $subjectName = trim((string) ($data['subject_name'] ?? ''));
        if ($classId === '' || $subjectName === '') {
            throw new \Exception('Class and subject are required');
        }
        $class = $this->classes->findOne(['_id' => new ObjectId($classId)]);
        if (!$class) {
            throw new \Exception('Class not found');
        }

        $subjects = $class['subjects'] ?? [];
        foreach ($subjects as $subject) {
            if (strtolower((string) ($subject['name'] ?? '')) === strtolower($subjectName)) {
                throw new \Exception('Subject already added to this class');
            }
        }
        $subjectId = 'SUBJ-' . time() . '-' . random_int(100, 999);
        $subjects[] = [
            'id' => $subjectId,
            'name' => $subjectName,
            'code' => '',
            'credits' => 0,
            'teacherId' => '',
            'teacherName' => 'Not assigned',
            'teacherKey' => ''
        ];
        $this->classes->updateOne(['_id' => new ObjectId($classId)], ['$set' => ['subjects' => $subjects, 'updated_at' => new UTCDateTime()]]);
        return ['success' => true, 'message' => 'Subject added to class successfully'];
    }

    public function getStudents(): array {
        $rows = $this->users->find(['role' => 'student'])->toArray();
        return [
            'success' => true,
            'data' => array_map(function($s) {
                $class = $this->classes->findOne(['_id' => new ObjectId($s['class_id'] ?? '')]);
                return [
                    'id' => (string) $s['_id'],
                    'name' => $s['name'] ?? '',
                    'roll_number' => $s['roll_number'] ?? '',
                    'email' => $s['email'] ?? '',
                    'phone' => $s['phone'] ?? '',
                    'dob' => $s['dob'] ?? '',
                    'class_id' => $s['class_id'] ?? '',
                    'class_name' => $class['name'] ?? 'Unknown'
                ];
            }, $rows)
        ];
    }

    public function addStudent(array $data): array {
        $name = trim((string) ($data['name'] ?? ''));
        $rollNumber = trim((string) ($data['roll_number'] ?? ''));
        $dob = (string) ($data['date_of_birth'] ?? '');
        $classId = (string) ($data['class_id'] ?? '');
        $email = trim((string) ($data['email'] ?? ''));
        $phone = trim((string) ($data['phone'] ?? ''));

        if ($name === '' || $rollNumber === '' || $dob === '' || $classId === '') {
            throw new \Exception('Name, roll number, date of birth and class are required');
        }
        if (!$this->classes->findOne(['_id' => new ObjectId($classId)])) {
            throw new \Exception('Class not found');
        }
        if ($this->users->findOne(['role' => 'student', 'roll_number' => $rollNumber, 'class_id' => $classId])) {
            throw new \Exception('Roll number already exists in this class');
        }
        $now = new UTCDateTime();
        $insert = $this->users->insertOne([
            'name' => $name,
            'roll_number' => $rollNumber,
            'dob' => $dob,
            'class_id' => $classId,
            'email' => $email,
            'phone' => $phone,
            'role' => 'student',
            'created_at' => $now,
            'updated_at' => $now
        ]);
        return [
            'success' => true,
            'message' => 'Student added successfully',
            'student' => [
                'id' => (string) $insert->getInsertedId(),
                'name' => $name,
                'roll_number' => $rollNumber,
                'email' => $email,
                'phone' => $phone,
                'date_of_birth' => $dob,
                'class_id' => $classId
            ]
        ];
    }

    public function assignTeacherToSubject(array $data): array {
        $classId = (string) ($data['classId'] ?? '');
        $subjectId = (string) ($data['subjectId'] ?? '');
        $teacherId = (string) ($data['teacherId'] ?? '');
        if ($classId === '' || $subjectId === '' || $teacherId === '') {
            throw new \Exception('Class, subject and teacher are required');
        }

        $class = $this->classes->findOne(['_id' => new ObjectId($classId)]);
        $teacher = $this->users->findOne(['_id' => new ObjectId($teacherId), 'role' => 'teacher']);
        if (!$class || !$teacher) {
            throw new \Exception('Class or teacher not found');
        }

        $updatedSubjects = [];
        $found = false;
        foreach (($class['subjects'] ?? []) as $subject) {
            if (($subject['id'] ?? '') === $subjectId) {
                $subject['teacherId'] = $teacherId;
                $subject['teacherName'] = $teacher['name'] ?? '';
                $subject['teacherKey'] = $teacher['teacherKey'] ?? '';
                $found = true;
            }
            $updatedSubjects[] = $subject;
        }
        if (!$found) {
            throw new \Exception('Subject not found in class');
        }
        $this->classes->updateOne(['_id' => new ObjectId($classId)], ['$set' => ['subjects' => $updatedSubjects, 'updated_at' => new UTCDateTime()]]);
        return [
            'success' => true,
            'message' => 'Teacher assigned successfully',
            'teacher' => [
                'id' => (string) $teacher['_id'],
                'name' => $teacher['name'] ?? '',
                'teacherKey' => $teacher['teacherKey'] ?? ''
            ]
        ];
    }

    private function generateTeacherKey(): string {
        do {
            $key = 'KCPT' . str_pad((string) random_int(1, 999), 3, '0', STR_PAD_LEFT);
        } while ($this->users->findOne(['teacherKey' => $key]));
        return $key;
    }
}
