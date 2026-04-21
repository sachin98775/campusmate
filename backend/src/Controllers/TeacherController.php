<?php

namespace CampusMate\Controllers;

use CampusMate\Config\Database;
use MongoDB\BSON\UTCDateTime;

class TeacherController {
    private $db;
    private $users;
    private $classes;
    private $attendance;
    
    public function __construct() {
        $this->db = Database::getInstance()->getDatabase();
        $this->users = $this->db->selectCollection('users');
        $this->classes = $this->db->selectCollection('classes');
        $this->attendance = $this->db->selectCollection('attendance');
    }

    public function getSubjectsByTeacher(?string $teacherId): array {
        $subjects = [];
        foreach ($this->classes->find() as $class) {
            foreach (($class['subjects'] ?? []) as $subject) {
                if ($teacherId && ($subject['teacherId'] ?? '') !== $teacherId) {
                    continue;
                }
                if (($subject['teacherId'] ?? '') === '') {
                    continue;
                }
                $subjects[] = [
                    'id' => $subject['id'] ?? '',
                    'name' => $subject['name'] ?? '',
                    'code' => $subject['code'] ?? '',
                    'credits' => $subject['credits'] ?? 0,
                    'classId' => (string) $class['_id'],
                    'className' => $class['name'] ?? '',
                    'students' => $this->users->countDocuments([
                        'role' => 'student',
                        'class_id' => (string) $class['_id']
                    ])
                ];
            }
        }
        return ['success' => true, 'subjects' => $subjects];
    }

    public function getAttendanceContext(string $subjectId): array {
        foreach ($this->classes->find() as $class) {
            foreach (($class['subjects'] ?? []) as $subject) {
                if (($subject['id'] ?? '') !== $subjectId) {
                    continue;
                }
                $students = $this->users->find([
                    'role' => 'student',
                    'class_id' => (string) $class['_id']
                ])->toArray();
                return [
                    'success' => true,
                    'data' => [
                        'subject' => [
                            'subjectId' => $subject['id'] ?? '',
                            'subjectName' => $subject['name'] ?? '',
                            'classId' => (string) $class['_id'],
                            'className' => $class['name'] ?? ''
                        ],
                        'students' => array_map(fn($s) => [
                            'id' => (string) $s['_id'],
                            'name' => $s['name'] ?? '',
                            'roll_number' => $s['roll_number'] ?? ''
                        ], $students)
                    ]
                ];
            }
        }
        throw new \Exception('Subject not found');
    }

    public function submitAttendance(array $rows): array {
        if (!is_array($rows) || count($rows) === 0) {
            throw new \Exception('Attendance data is required');
        }
        $first = $rows[0];
        $subjectId = (string) ($first['subjectId'] ?? '');
        $date = (string) ($first['date'] ?? '');
        if ($subjectId === '' || $date === '') {
            throw new \Exception('Invalid attendance payload');
        }
        $alreadyExists = $this->attendance->countDocuments(['subjectId' => $subjectId, 'date' => $date]) > 0;
        if ($alreadyExists) {
            throw new \Exception('Attendance already submitted for this subject today');
        }
        $docs = [];
        $now = new UTCDateTime();
        foreach ($rows as $row) {
            $docs[] = [
                'subjectId' => (string) ($row['subjectId'] ?? ''),
                'classId' => (string) ($row['classId'] ?? ''),
                'studentId' => (string) ($row['studentId'] ?? ''),
                'status' => (($row['status'] ?? 'absent') === 'present') ? 'present' : 'absent',
                'date' => (string) ($row['date'] ?? ''),
                'created_at' => $now
            ];
        }
        $this->attendance->insertMany($docs);
        return ['success' => true, 'message' => 'Attendance submitted successfully', 'count' => count($docs)];
    }
}
