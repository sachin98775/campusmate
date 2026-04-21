<?php

namespace CampusMate\Middleware;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use CampusMate\Config\Database;

class AuthMiddleware {
    private static $secretKey;

    public static function init() {
        $dotenv = \Dotenv\Dotenv::createImmutable(dirname(__DIR__, 3));
        $dotenv->load();
        self::$secretKey = $_ENV['JWT_SECRET'] ?? 'fallback-secret-key';
    }

    public static function authenticate(): ?array {
        self::init();
        
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (!$authHeader) {
            return null;
        }

        // Extract token from "Bearer <token>"
        $token = str_replace('Bearer ', '', $authHeader);
        
        try {
            $decoded = JWT::decode($token, new Key(self::$secretKey, 'HS256'));
            return (array) $decoded;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function requireAuth(): array {
        $user = self::authenticate();
        if (!$user) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            exit;
        }
        return $user;
    }

    public static function requireRole(string $role): array {
        $user = self::requireAuth();
        
        if ($user['role'] !== $role) {
            http_response_code(403);
            echo json_encode(['error' => 'Forbidden - Insufficient permissions']);
            exit;
        }
        
        return $user;
    }

    public static function generateToken(array $user): string {
        self::init();
        
        $payload = [
            'user_id' => $user['_id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'name' => $user['name'],
            'iat' => time(),
            'exp' => time() + (24 * 60 * 60) // 24 hours
        ];
        
        return JWT::encode($payload, self::$secretKey, 'HS256');
    }

    public static function validateUser(string $email, string $password): ?array {
        $db = Database::getInstance()->getDatabase();
        $user = $db->selectCollection('users')->findOne(['email' => $email]);
        
        if ($user && password_verify($password, $user['password'])) {
            return (array) $user;
        }
        
        return null;
    }

    public static function getUserById(string $userId): ?array {
        $db = Database::getInstance()->getDatabase();
        $user = $db->selectCollection('users')->findOne(['_id' => new \MongoDB\BSON\ObjectId($userId)]);
        
        return $user ? (array) $user : null;
    }
}
