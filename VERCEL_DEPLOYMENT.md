# Vercel Deployment Guide

## Overview

This guide documents the fixes applied to make the backend work correctly on Vercel serverless functions.

## Problems Fixed

### 1. Database Connection (Serverless Optimization)
- **Issue**: Direct `pg` pool connection didn't work well with serverless functions
- **Fix**: 
  - Added error handling and logging to database connection
  - Implemented connection timeout and idle timeout configuration
  - Added pool error event listeners for better debugging

### 2. Missing Environment Variables Validation
- **Issue**: API failed silently when required env vars were missing on Vercel
- **Fix**:
  - Added environment validation in `auth.js` (JWT_SECRET)
  - Added validation in `db.js` (DATABASE_URL)
  - Added validation in `supabase.js` (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
  - Created health check endpoint (`/api/v1/health`) to verify configuration

### 3. Broken Import Paths
- **Issue**: `/api/v1/auth/admin-login.js` had incorrect import paths (`../../../_lib/` instead of `../../_lib/`)
- **Fix**: Corrected all import paths to use proper relative paths

### 4. Error Handling & Logging
- **Issue**: No structured error handling or logging for production debugging
- **Fix**:
  - Created `api/_lib/logger.js` for structured JSON logging (sends to Vercel logs)
  - Created `api/_lib/errors.js` with custom error classes and response helpers
  - Updated all API endpoints to use consistent error handling and logging
  - Added detailed error context for debugging on Vercel

### 5. Vercel Configuration
- **Issue**: `vercel.json` lacked proper build settings and security headers
- **Fix**:
  - Added explicit build command configuration
  - Added output directory specification
  - Added security headers (X-Content-Type-Options, X-Frame-Options)
  - Added CORS headers for API endpoints
  - Added function timeout and memory configuration
  - Added health check endpoint to rewrites

## Required Environment Variables

Set these in Vercel Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key
FRONTEND_URL=https://your-domain.com
```

**Important**: 
- `SUPABASE_SERVICE_ROLE_KEY` should be Production & Preview only (never expose to browser)
- Use `openssl rand -base64 32` to generate a strong JWT_SECRET

## Local Development

1. Copy `.env.example` to `.env.development.local`
2. Fill in your local database and Supabase credentials
3. Run `npm run dev`
4. Test API endpoints locally

## Testing Health Check

```bash
# Local
curl http://localhost:3000/api/v1/health

# Production
curl https://your-domain.com/api/v1/health
```

Response:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2025-06-25T10:30:00Z",
    "checks": {
      "database": { "status": "up", "responseTime": "12ms" },
      "environment": { "status": "configured", "missingVariables": [] }
    }
  }
}
```

## API Response Format

All API endpoints now return consistent response format:

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { /* optional */ }
  }
}
```

## Debugging on Vercel

1. **View Logs**: 
   - Go to Vercel dashboard → Deployments → View logs
   - Check Function Logs tab for serverless function output

2. **Structured Logging**:
   - All logs are in JSON format for easy parsing
   - Look for `timestamp`, `level`, `message`, and `data` fields

3. **Common Issues**:
   - Check environment variables are set in Vercel project settings
   - Verify database connection string includes SSL settings
   - Check health endpoint: `/api/v1/health`

## Deployment Steps

1. Ensure all environment variables are set in Vercel project settings
2. Push changes to Git repository
3. Vercel will auto-deploy on push
4. Check build logs in Vercel dashboard
5. Verify deployment by testing API endpoints
6. Check health endpoint for any issues

## New Files Added

- `api/_lib/logger.js` - Structured logging utility
- `api/_lib/errors.js` - Error handling and response helpers
- `api/v1/health.js` - Health check endpoint
- `.env.example` - Environment variables template
- `VERCEL_DEPLOYMENT.md` - This file

## Modified Files

- `api/_lib/db.js` - Added error handling and logging
- `api/_lib/auth.js` - Added env validation and logging
- `api/v1/auth/admin-login.js` - Fixed imports, added logging and error handling
- `api/v1/clients.js` - Added logging and error handling
- `api/v1/portfolios.js` - Added logging and error handling
- `vercel.json` - Updated configuration for production deployment

## Next Steps

After deployment, monitor:
1. Vercel Function Logs for any errors
2. Health check endpoint performance
3. Database connection stability
4. JWT token validation issues
5. CORS errors from frontend

For additional help, check Vercel documentation: https://vercel.com/docs/serverless-functions
