# Deployment Guide

This document provides comprehensive deployment instructions for the Kiro e-commerce demonstration application across different environments.

## 🚀 Deployment Options

### 1. Local Development Deployment

#### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control

#### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd kiro-ecommerce-demo

# Install dependencies
npm install

# Start development server
npm run dev

# Access application
open http://localhost:3000
```

#### Development Environment Variables
Create `.env` file in project root:
```env
NODE_ENV=development
PORT=3000
DEBUG=true
```

### 2. Docker Local Deployment

#### Prerequisites
- Docker installed and running
- Docker Compose (optional)

#### Build and Run
```bash
# Build Docker image
docker build -t kiro-ecommerce-demo .

# Run container
docker run -d -p 3000:3000 --name kiro-app kiro-ecommerce-demo

# View logs
docker logs kiro-app

# Stop container
docker stop kiro-app
```

#### Docker Compose Deployment
Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  kiro-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
```

Run with Docker Compose:
```bash
# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 3. Production Deployment via CI/CD

#### Automated Deployment Process
The application uses GitHub Actions for automated deployment:

1. **Trigger**: Push to main branch
2. **Testing**: Run complete test suite
3. **Build**: Create optimized Docker image
4. **Deploy**: Push to DockerHub registry

#### GitHub Secrets Configuration
Required secrets in repository settings:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DOCKERHUB_USERNAME` | DockerHub account username | `your-username` |
| `DOCKERHUB_TOKEN` | DockerHub access token | `dckr_pat_...` |

#### Setting Up Secrets
1. Navigate to GitHub repository
2. Go to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add required secrets

### 4. Cloud Platform Deployments

#### AWS ECS Deployment

**Prerequisites**:
- AWS CLI configured
- ECS cluster created
- ECR repository (optional)

**Task Definition** (`task-definition.json`):
```json
{
  "family": "kiro-ecommerce-demo",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "kiro-app",
      "image": "your-dockerhub-username/nodejs-demo-app:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "essential": true,
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/kiro-ecommerce-demo",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

**Deployment Commands**:
```bash
# Register task definition
aws ecs register-task-definition --cli-input-json file://task-definition.json

# Create service
aws ecs create-service \
  --cluster your-cluster \
  --service-name kiro-ecommerce-demo \
  --task-definition kiro-ecommerce-demo:1 \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-12345],securityGroups=[sg-12345],assignPublicIp=ENABLED}"
```

#### Google Cloud Run Deployment

**Prerequisites**:
- Google Cloud SDK installed
- Project created and billing enabled
- Container Registry or Artifact Registry access

**Deployment Commands**:
```bash
# Authenticate with Google Cloud
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID

# Deploy to Cloud Run
gcloud run deploy kiro-ecommerce-demo \
  --image docker.io/your-dockerhub-username/nodejs-demo-app:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 3000
```

#### Azure Container Instances

**Prerequisites**:
- Azure CLI installed
- Resource group created

**Deployment Commands**:
```bash
# Login to Azure
az login

# Create container instance
az container create \
  --resource-group myResourceGroup \
  --name kiro-ecommerce-demo \
  --image your-dockerhub-username/nodejs-demo-app:latest \
  --dns-name-label kiro-demo \
  --ports 3000
```

#### Heroku Deployment

**Prerequisites**:
- Heroku CLI installed
- Heroku account created

**Deployment Steps**:
```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create kiro-ecommerce-demo

# Set stack to container
heroku stack:set container -a kiro-ecommerce-demo

# Deploy using Git
git push heroku main
```

Create `heroku.yml` in project root:
```yaml
build:
  docker:
    web: Dockerfile
run:
  web: node app.js
```

## 🔧 Environment Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Application environment | `development` | No |
| `PORT` | Server port number | `3000` | No |
| `DEBUG` | Enable debug logging | `false` | No |

### Production Environment Setup
```env
NODE_ENV=production
PORT=3000
DEBUG=false
```

### Staging Environment Setup
```env
NODE_ENV=staging
PORT=3000
DEBUG=true
```

## 📊 Monitoring and Health Checks

### Application Health Check
The application includes a built-in health check endpoint:

**Endpoint**: `GET /`
**Expected Response**: HTML page with status 200
**Timeout**: 3 seconds
**Interval**: 30 seconds

### Docker Health Check
Configured in Dockerfile:
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
```

### Monitoring Setup

#### Basic Monitoring
```bash
# Check container status
docker ps

# View container logs
docker logs kiro-app

# Monitor resource usage
docker stats kiro-app
```

#### Advanced Monitoring with Prometheus
Create `prometheus.yml`:
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'kiro-app'
    static_configs:
      - targets: ['localhost:3000']
```

## 🔒 Security Considerations

### Production Security Checklist

- [ ] Use non-root user in Docker container
- [ ] Enable HTTPS/TLS encryption
- [ ] Implement rate limiting
- [ ] Set security headers
- [ ] Regular dependency updates
- [ ] Container image scanning
- [ ] Network security groups configuration
- [ ] Secrets management (not in code)

### Security Headers
Add to Express.js application:
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

## 🚨 Troubleshooting Deployment Issues

### Common Deployment Problems

#### Container Won't Start
**Symptoms**: Container exits immediately
**Solutions**:
```bash
# Check logs
docker logs container-name

# Run interactively
docker run -it image-name /bin/sh

# Check port binding
netstat -tulpn | grep :3000
```

#### Memory Issues
**Symptoms**: Container killed by OOM
**Solutions**:
- Increase container memory limits
- Optimize application memory usage
- Check for memory leaks

#### Network Connectivity
**Symptoms**: Cannot access application
**Solutions**:
- Verify port mapping: `-p 3000:3000`
- Check firewall rules
- Verify security group settings (cloud deployments)

#### CI/CD Pipeline Failures
**Symptoms**: Deployment pipeline fails
**Solutions**:
- Check GitHub Actions logs
- Verify secrets configuration
- Test Docker build locally
- Validate DockerHub credentials

### Rollback Procedures

#### Docker Rollback
```bash
# List available images
docker images

# Run previous version
docker run -d -p 3000:3000 your-username/nodejs-demo-app:previous-tag
```

#### Cloud Platform Rollback
```bash
# AWS ECS
aws ecs update-service --cluster cluster-name --service service-name --task-definition previous-task-def

# Google Cloud Run
gcloud run deploy --image previous-image-url

# Azure Container Instances
az container create --image previous-image-url
```

## 📈 Performance Optimization

### Production Optimizations

#### Docker Image Optimization
- Use multi-stage builds
- Minimize layer count
- Use .dockerignore effectively
- Choose appropriate base image

#### Application Performance
- Enable gzip compression
- Implement caching headers
- Optimize static asset delivery
- Use CDN for static files

#### Resource Allocation
- **CPU**: 0.25-0.5 vCPU for light traffic
- **Memory**: 512MB-1GB recommended
- **Storage**: Minimal (stateless application)

### Load Testing
```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Run load test
ab -n 1000 -c 10 http://localhost:3000/

# Install and use wrk
wrk -t12 -c400 -d30s http://localhost:3000/
```

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Docker build successful
- [ ] Environment variables configured
- [ ] Secrets properly set
- [ ] Health checks implemented
- [ ] Monitoring configured

### Post-Deployment
- [ ] Application accessible
- [ ] Health checks passing
- [ ] Logs are clean
- [ ] Performance metrics normal
- [ ] Security scan completed
- [ ] Backup procedures verified

---

**For additional support, please refer to the main README.md or create an issue in the GitHub repository.**