# 🚀 ApplyTrack Deployment Guide

## Environment Setup

### 1. Create Environment File

Copy the example and fill in your values:
```bash
cp .env.example .env
```

Edit `.env` with your production values:
```bash
# JWT Configuration (REQUIRED - 32+ characters)
JWTSECRET=your-super-secure-32-character-secret-key-here

# Database Configuration
DB_NAME=applytrack
DB_USER=postgres
DB_PASSWORD=your-secure-database-password

# CORS Configuration (your frontend domain)
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com

# Environment
GO_ENV=production
```

### 2. Deployment Commands

#### Start Services
```bash
docker compose up -d --build
```

#### Check Status
```bash
docker compose ps
docker compose logs api
docker compose logs db
```

#### Stop Services
```bash
docker compose down
```

#### Update Application
```bash
git pull origin main
docker compose up -d --build
```

## Security Features ✅

- **Database isolation**: PostgreSQL not exposed to internet
- **Health checks**: API waits for database to be ready
- **Secure restart policy**: Services restart unless manually stopped
- **Fixed PostgreSQL version**: No surprise updates
- **Environment variables**: All secrets configurable

## Troubleshooting

### Database Connection Issues
```bash
# Check database health
docker compose exec db pg_isready -U postgres

# View database logs
docker compose logs db

# Reset database (WARNING: deletes all data)
docker compose down
docker volume rm applytrack_pgdata
docker compose up -d
```

### API Issues
```bash
# Check API logs
docker compose logs api

# Restart API only
docker compose restart api

# Check environment variables
docker compose exec api env | grep -E "(JWT|DB|CORS)"
```

## Production Checklist

- [ ] Set strong JWTSECRET (32+ characters)
- [ ] Configure proper CORS_ALLOWED_ORIGINS
- [ ] Set secure DB_PASSWORD
- [ ] Verify GO_ENV=production
- [ ] Test deployment with `docker compose up`
- [ ] Check logs for errors
- [ ] Test API endpoints
- [ ] Verify database connectivity