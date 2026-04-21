# MongoDB Setup Instructions

## 1. Download MongoDB Community Server
- Go to: https://www.mongodb.com/try/download/community
- Select: Windows
- Download: MongoDB Community Server (MSI package)
- Version: Latest stable (7.0.x recommended)

## 2. Install MongoDB
1. Run the downloaded MSI file
2. Choose "Complete" installation
3. Install MongoDB Compass (GUI tool) - optional but recommended
4. Install as a Windows Service - recommended
5. Leave default settings (port 27017)

## 3. Start MongoDB Service
### Method A: Using Services (Recommended)
1. Open Windows Services (Win + R, type "services.msc")
2. Find "MongoDB" service
3. Right-click -> Start

### Method B: Using Command Line
```cmd
# Open Command Prompt as Administrator
net start MongoDB
```

### Method C: Manual Start
```cmd
# Navigate to MongoDB installation directory
cd "C:\Program Files\MongoDB\Server\7.0\bin"
mongod --dbpath "C:\data\db"
```

## 4. Verify Installation
```cmd
# Check MongoDB version
mongod --version

# Connect to MongoDB
mongo
# or
mongosh
```

## 5. Create Database for CampusMate
```javascript
// In MongoDB Shell
use campusmate
db.createCollection("users")
db.createCollection("classes")
db.createCollection("subjects")
db.createCollection("attendance")

// Insert sample admin user
db.users.insertOne({
  name: "Admin User",
  email: "admin@campusmate.com",
  role: "admin",
  password: "hashed_password_here",
  adminKey: "Kcpadmin123",
  createdAt: new Date()
})
```

## 6. Update Backend Configuration
Update your `.env` file in backend:
```
DB_URI=mongodb://localhost:27017
DB_NAME=campusmate
```

## 7. Test Backend Connection
```bash
cd backend/public
php -S localhost:8000
```

Then test: http://localhost:8000/api/admin/teachers

## Troubleshooting

### Port Already in Use
```cmd
# Check what's using port 27017
netstat -ano | findstr :27017

# Kill process if needed
taskkill /PID <PID> /F
```

### Service Won't Start
1. Check Windows Event Viewer
2. Ensure MongoDB data directory exists: C:\data\db
3. Run as Administrator

### Connection Issues
1. Check firewall settings
2. Verify MongoDB service is running
3. Test with MongoDB Compass
```

## Alternative: Docker Setup (Advanced)
```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo

# Connect to container
docker exec -it mongodb mongosh
```

## Quick Test Commands
```bash
# Test connection
mongosh --eval "db.adminCommand('ismaster')"

# List databases
mongosh --eval "show dbs"

# Test campusmate database
mongosh --eval "use campusmate; show collections"
```
