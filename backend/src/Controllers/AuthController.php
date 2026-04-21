<?php

namespace CampusMate\Controllers;

use CampusMate\Config\Database;
use Firebase\JWT\JWT;

class AuthController {
    private $users;
    
    public function __construct() {
        $this->users = Database::getInstance()->getCollection('users');
    }
    
    public function login(array $data): array {
        try {
            $role = $data['role'] ?? '';
            
            switch ($role) {
                case 'admin':
                    return $this->adminLogin($data);
                case 'teacher':
                    return $this->teacherLogin($data);
                case 'student':
                    return $this->studentLogin($data);
                default:
                    throw new \Exception('Invalid role specified');
            }
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    private function adminLogin(array $data): array {
        $adminKey = $data['adminKey'] ?? '';
        if ($adminKey !== 'Kcpadmin123') {
            throw new \Exception('Admin key is required');
        }
        return $this->buildAuthResponse([
            'id' => 'admin-1',
            'name' => 'Admin User',
            'role' => 'admin'
        ]);
    }
    
    private function teacherLogin(array $data): array {
        $teacherKey = $data['teacherKey'] ?? '';

        if ($teacherKey === '') {
            throw new \Exception('Teacher key is required');
        }

        $teacher = $this->users->findOne([
            'teacherKey' => $teacherKey,
            'role' => 'teacher'
        ]);

        if (!$teacher) {
            throw new \Exception('Invalid teacher key');
        }

        return $this->buildAuthResponse([
            'id' => (string) $teacher['_id'],
            'name' => $teacher['name'],
            'phone' => $teacher['phone'] ?? '',
            'teacherKey' => $teacher['teacherKey'],
            'role' => 'teacher'
        ]);
    }
    
    private function studentLogin(array $data): array {
        $rollNumber = $data['roll_number'] ?? '';
        $dob = $data['dob'] ?? '';

        if ($rollNumber === '' || $dob === '') {
            throw new \Exception('Roll number and DOB are required');
        }

        $student = $this->users->findOne([
            'roll_number' => $rollNumber,
            'dob' => $dob,
            'role' => 'student'
        ]);

        if (!$student) {
            throw new \Exception('Invalid student credentials');
        }

        return $this->buildAuthResponse([
            'id' => (string) $student['_id'],
            'name' => $student['name'],
            'roll_number' => $student['roll_number'],
            'class_id' => $student['class_id'] ?? '',
            'role' => 'student'
        ]);
    }

    private function buildAuthResponse(array $user): array {
        $payload = [
            'user_id' => $user['id'],
            'role' => $user['role'],
            'name' => $user['name'],
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60)
        ];
        $token = JWT::encode($payload, $_ENV['JWT_SECRET'] ?? 'campusmate-secret', 'HS256');

        return [
            'success' => true,
            'token' => $token,
            'user' => $user
        ];
    }
}
