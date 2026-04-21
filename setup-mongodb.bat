@echo off
echo MongoDB Setup Script for CampusMate
echo =====================================
echo.

echo Step 1: Checking if MongoDB is installed...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB is NOT installed.
    echo.
    echo Please download MongoDB from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo Choose Windows version and run the installer.
    echo After installation, run this script again.
    pause
    exit /b 1
)

echo MongoDB is installed!
echo.

echo Step 2: Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo Starting MongoDB manually...
    mkdir "C:\data\db" 2>nul
    cd /d "C:\Program Files\MongoDB\Server\7.0\bin"
    start /B mongod --dbpath "C:\data\db"
    timeout /t 3 >nul
)

echo.
echo Step 3: Testing MongoDB connection...
mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo MongoDB connection failed. Please check:
    echo 1. MongoDB service is running
    echo 2. Port 27017 is available
    echo 3. Firewall is not blocking MongoDB
    pause
    exit /b 1
)

echo MongoDB is running and accessible!
echo.

echo Step 4: Setting up CampusMate database...
mongosh campusmate --eval "
db.createCollection('users');
db.createCollection('classes');
db.createCollection('subjects');
db.createCollection('attendance');
print('Database collections created successfully');
"

echo.
echo MongoDB setup completed successfully!
echo Your backend should now work properly.
echo.
echo Next steps:
echo 1. Start your backend: cd backend\public && php -S localhost:8000
echo 2. Test API: http://localhost:8000/api/admin/teachers
echo.
pause
