# CampusMate Backend API

## Setup Instructions

1. Install PHP 8.0+ and MongoDB
2. Install dependencies: `composer install`
3. Copy `.env.example` to `.env` and configure
4. Start MongoDB service
5. Run: `php -S localhost:8000 public/index.php`

## Environment Variables

```
DB_URI=mongodb://localhost:27017
DB_NAME=campusmate
JWT_SECRET=your-secret-key-here
CORS_ORIGIN=http://localhost:5173
```
