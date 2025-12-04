# Fraud Detection System - Deployment Guide

## Overview
This guide covers deploying the full-stack fraud detection application using Docker and monitoring with Prometheus/Grafana.

## Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for development)
- PostgreSQL 15+ (for local development)
- Environment variables configured

## Local Development

### Setup
\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npm run db:migrate

# Start development server
npm run dev
\`\`\`

## Docker Deployment

### Build and Run with Docker Compose
\`\`\`bash
# Copy environment template
cp .env.example .env

# Update .env with your configuration
nano .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
\`\`\`

### Service URLs
- Application: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Database: localhost:5432
- Redis: localhost:6379

## Monitoring & Observability

### Grafana Setup
1. Access Grafana at http://localhost:3001
2. Login with admin/your_password
3. Add Prometheus as data source
4. Import pre-built dashboards
5. Create custom alerts

### Key Metrics to Monitor
- Request rate and latency
- Error rate
- Fraud detection rate
- Database connections
- API response times
- Cache hit ratio

### Prometheus Queries
\`\`\`
# Fraud detection rate
rate(fraud_detection_frauds_total[5m])

# Request latency (95th percentile)
histogram_quantile(0.95, api_request_duration_seconds)

# Error rate
rate(fraud_detection_errors_total[5m])
\`\`\`

## Production Deployment

### AWS ECS/Fargate
\`\`\`bash
# Build image
docker build -t fraud-detection:latest .

# Tag for ECR
docker tag fraud-detection:latest YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/fraud-detection:latest

# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com
docker push YOUR_ACCOUNT.dkr.ecr.YOUR_REGION.amazonaws.com/fraud-detection:latest
\`\`\`

### Vercel Deployment
\`\`\`bash
# Connect repository to Vercel
vercel link

# Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# Deploy
vercel deploy --prod
\`\`\`

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (ELB, ALB)
- Scale app instances independently
- Configure sticky sessions if needed
- Use RDS/managed PostgreSQL for high availability

### Database Optimization
- Enable connection pooling (PgBouncer)
- Create indexes on frequently queried columns
- Monitor slow queries
- Set up read replicas for reporting

### Caching Strategy
- Redis for session management
- Cache ML model predictions
- Cache frequently accessed merchant data
- Implement cache invalidation strategy

## Backup & Recovery

### Database Backups
\`\`\`bash
# Daily automated backups
0 2 * * * pg_dump -h localhost -U postgres fraud_detection > /backups/fraud_detection_\$(date +\%Y\%m\%d).sql

# Restore from backup
psql -h localhost -U postgres fraud_detection < /backups/fraud_detection_20231201.sql
\`\`\`

## Security Checklist
- [ ] Change default database password
- [ ] Update Grafana admin password
- [ ] Enable HTTPS/SSL
- [ ] Configure firewall rules
- [ ] Set up VPN/bastion host access
- [ ] Enable database encryption
- [ ] Rotate API keys regularly
- [ ] Enable audit logging
- [ ] Configure rate limiting
- [ ] Set up DDoS protection

## Troubleshooting

### Services won't start
\`\`\`bash
# Check logs
docker-compose logs app
docker-compose logs postgres

# Rebuild containers
docker-compose down -v
docker-compose up -d --build
\`\`\`

### Database connection errors
\`\`\`bash
# Check database health
docker-compose exec postgres pg_isready

# Verify environment variables
docker-compose exec app env | grep DATABASE_URL
\`\`\`

### High memory usage
\`\`\`bash
# Check container stats
docker stats

# Adjust memory limits in docker-compose.yml
# Set deploy.resources.limits.memory
\`\`\`

## Maintenance

### Regular Tasks
- Monitor metrics dashboard daily
- Review error logs weekly
- Run database maintenance (vacuum, analyze)
- Update dependencies monthly
- Test disaster recovery quarterly
- Audit security access semi-annually
\`\`\`
</parameter>
