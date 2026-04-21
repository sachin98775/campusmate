<?php

namespace CampusMate\Controllers;

use CampusMate\Config\Database;
use MongoDB\BSON\ObjectId;

class StudentController {
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

    public function getSubjectsByClass(string $classId): array {
        $class = $this->classes->findOne(['_id' => new ObjectId($classId)]);
        if (!$class) {
            throw new \Exception('Class not found');
        }
        $subjects = $class['subjects'] ?? [];
        $rows = array_map(function ($subject) use ($classId) {
            $subjectId = $subject['id'] ?? '';
            $total = $this->attendance->countDocuments(['classId' => $classId, 'subjectId' => $subjectId]);
            $present = $this->attendance->countDocuments(['classId' => $classId, 'subjectId' => $subjectId, 'status' => 'present']);
            $pct = $total > 0 ? round(($present / $total) * 100) : 0;
            return [
                'id' => $subjectId,
                'name' => $subject['name'] ?? '',
                'code' => $subject['code'] ?? '',
                'credits' => $subject['credits'] ?? 0,
                'attendancePct' => $pct
            ];
        }, $subjects);
        return ['success' => true, 'data' => $rows];
    }

    public function getAttendanceSummary(string $studentId): array {
        $rows = $this->attendance->find(['studentId' => $studentId])->toArray();
        $total = count($rows);
        $present = 0;
        foreach ($rows as $row) {
            if (($row['status'] ?? '') === 'present') {
                $present++;
            }
        }
        $absent = $total - $present;
        return [
            'success' => true,
            'data' => [
                'overallAttendance' => [
                    'totalClasses' => $total,
                    'presentClasses' => $present,
                    'absentClasses' => $absent,
                    'percentage' => $total > 0 ? round(($present / $total) * 100, 2) : 0
                ]
            ]
        ];
    }

    public function getAttendanceDetails(string $studentId): array {
        $rows = $this->attendance->find(['studentId' => $studentId])->toArray();
        $details = array_map(fn($row) => [
            'date' => $row['date'] ?? '',
            'subjectId' => $row['subjectId'] ?? '',
            'status' => $row['status'] ?? 'absent'
        ], $rows);
        return ['success' => true, 'data' => $details];
    }
}
