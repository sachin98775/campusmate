@echo off
echo Starting CampusMate Backend Server...
echo.

REM Check if vendor directory exists
if not exist "vendor" (
    echo Installing PHP dependencies...
    composer install
    if errorlevel 1 (
        echo Failed to install dependencies. Please ensure Composer is installed.
        pause
        exit /b 1
    )
)

REM Check if .env file exists
if not exist ".env" (
    echo Creating environment file...
    copy .env.example .env
)

REM Initialize database
echo Initializing database...
php setup.php

REM Start the server
echo.
echo Starting PHP server on http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
php -S localhost:8000 public/index.php

pause
