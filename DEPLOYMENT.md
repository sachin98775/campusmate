# CampusMate Deployment Guide

## 🚀 Quick Deployment Options

### Option 1: Railway (Recommended - Full Stack)
1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Deploy Backend**
   ```bash
   cd backend
   railway login
   railway init
   railway up
   ```

3. **Set Environment Variables in Railway Dashboard**
   - Copy from `.env.production`
   - Update `APP_URL` and `CORS_ALLOWED_ORIGINS`

### Option 2: Vercel + Render (Frontend + Backend Separated)

**Frontend (Vercel):**
```bash
cd ..  # Root directory
npm install -g vercel
vercel --prod
```

**Backend (Render):**
1. Push code to GitHub
2. Connect GitHub to Render
3. Set environment variables
4. Deploy

### Option 3: DigitalOcean App Platform
1. Create Dockerfile for backend
2. Push to GitHub
3. Connect to DigitalOcean
4. Deploy with environment variables

## 📋 Pre-Deployment Checklist

### ✅ Database
- [x] MongoDB Atlas configured
- [x] Connection string ready
- [ ] Test production connection

### ✅ Backend
- [x] PHP dependencies installed
- [x] Environment variables configured
- [x] Production .env file created
- [ ] API endpoints tested

### ✅ Frontend
- [ ] Build tested: `npm run build`
- [ ] Environment variables updated
- [ ] API URLs pointing to production

### ✅ Security
- [ ] JWT secret changed for production
- [ ] Database credentials secured
- [ ] CORS configured for production domain

## 🔧 Production Configuration

### Environment Variables Required:
```
DB_URI=mongodb+srv://your-connection-string
DB_NAME=campusmate
JWT_SECRET=your-secure-jwt-secret
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Security Notes:
- Change all default passwords and secrets
- Use HTTPS in production
- Configure proper CORS origins
- Enable database authentication
- Set up monitoring and logging

## 🌐 Domain Configuration
After deployment:
1. Point your domain to the deployment platform
2. Update CORS_ALLOWED_ORIGINS
3. Configure SSL certificates (usually automatic)
4. Set up custom email if needed

## 📊 Monitoring
- Set up error tracking (Sentry recommended)
- Monitor database performance
- Check API response times
- Set up uptime monitoring

## 🔄 CI/CD Pipeline (Optional)
Create GitHub Actions for automatic deployment:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: railway up
```
