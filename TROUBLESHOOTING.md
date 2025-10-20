# Troubleshooting Guide

This guide provides solutions to common issues encountered when developing, testing, and deploying the Kiro e-commerce demonstration application.

## 🚨 Quick Diagnostics

### Health Check Commands
```bash
# Check application status
curl -f http://localhost:3000/ || echo "Application not responding"

# Check Docker container status
docker ps | grep kiro

# Check Node.js and npm versions
node --version && npm --version

# Check port availability
lsof -i :3000 || echo "Port 3000 is available"
```

## 🔧 Development Issues

### Node.js and npm Problems

#### Issue: "node: command not found"
**Cause**: Node.js not installed or not in PATH

**Solutions**:
```bash
# Install Node.js using nvm (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Verify installation
node --version
npm --version
```

#### Issue: "npm ERR! peer dep missing"
**Cause**: Peer dependency conflicts

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Install with legacy peer deps flag
npm install --legacy-peer-deps
```

#### Issue: "EACCES: permission denied"
**Cause**: npm permission issues

**Solutions**:
```bash
# Fix npm permissions (Linux/macOS)
sudo chown -R $(whoami) ~/.npm

# Use npx instead of global install
npx create-react-app my-app

# Configure npm to use different directory
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Application Runtime Issues

#### Issue: "Error: listen EADDRINUSE :::3000"
**Cause**: Port 3000 already in use

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep :3000

# Kill process by PID
kill -9 <PID>

# Use different port
PORT=3001 npm start

# Kill all Node.js processes (use with caution)
pkill -f node
```

#### Issue: "Cannot GET /"
**Cause**: Express server not serving static files correctly

**Solutions**:
1. Check `app.js` static middleware configuration:
```javascript
app.use(express.static(path.join(__dirname, 'public')));
```

2. Verify `public/index.html` exists and is readable:
```bash
ls -la public/index.html
cat public/index.html | head -10
```

3. Check file permissions:
```bash
chmod 644 public/index.html
chmod 755 public/
```

#### Issue: "Module not found" errors
**Cause**: Missing dependencies or incorrect imports

**Solutions**:
```bash
# Install missing dependencies
npm install express

# Check package.json dependencies
cat package.json | grep -A 10 "dependencies"

# Verify module exists
ls node_modules/express

# Clear require cache (development)
rm -rf node_modules/.cache
```

## 🐳 Docker Issues

### Docker Build Problems

#### Issue: "docker: command not found"
**Cause**: Docker not installed or not running

**Solutions**:
```bash
# Install Docker (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify installation
docker --version
docker run hello-world
```

#### Issue: "COPY failed: no such file or directory"
**Cause**: Files not found during Docker build

**Solutions**:
1. Check `.dockerignore` file:
```bash
cat .dockerignore
```

2. Verify files exist in build context:
```bash
ls -la package*.json
ls -la app.js
ls -la public/
```

3. Build with verbose output:
```bash
docker build --no-cache --progress=plain -t kiro-app .
```

#### Issue: "npm ERR! network timeout"
**Cause**: Network issues during Docker build

**Solutions**:
```bash
# Build with different DNS
docker build --dns 8.8.8.8 -t kiro-app .

# Use npm registry mirror
docker build --build-arg NPM_REGISTRY=https://registry.npmjs.org/ -t kiro-app .

# Build with no cache
docker build --no-cache -t kiro-app .
```

### Docker Runtime Problems

#### Issue: Container exits immediately
**Cause**: Application crashes on startup

**Solutions**:
```bash
# Check container logs
docker logs <container-id>

# Run container interactively
docker run -it kiro-app /bin/sh

# Check if app.js has syntax errors
node -c app.js

# Run with environment variables
docker run -e NODE_ENV=development kiro-app
```

#### Issue: "bind: address already in use"
**Cause**: Port mapping conflict

**Solutions**:
```bash
# Use different host port
docker run -p 3001:3000 kiro-app

# Stop conflicting containers
docker ps
docker stop <container-id>

# Remove stopped containers
docker container prune
```

#### Issue: Health check failing
**Cause**: Application not responding to health check

**Solutions**:
1. Test health check manually:
```bash
# Inside container
wget --spider http://localhost:3000/

# From host
curl -f http://localhost:3000/
```

2. Modify Dockerfile health check:
```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:3000/ || exit 1
```

## 🔄 CI/CD Pipeline Issues

### GitHub Actions Problems

#### Issue: "Workflow not triggering"
**Cause**: Workflow configuration or branch issues

**Solutions**:
1. Check workflow file location:
```bash
ls -la .github/workflows/main.yml
```

2. Verify workflow syntax:
```bash
# Use GitHub CLI to validate
gh workflow list
gh workflow view
```

3. Check branch configuration:
```yaml
on:
  push:
    branches: [ main, master ]  # Include both common branch names
```

#### Issue: "secrets.DOCKERHUB_USERNAME not found"
**Cause**: GitHub secrets not configured

**Solutions**:
1. Navigate to repository Settings → Secrets and variables → Actions
2. Add required secrets:
   - `DOCKERHUB_USERNAME`: Your DockerHub username
   - `DOCKERHUB_TOKEN`: DockerHub access token (not password)

3. Verify secret names in workflow file:
```yaml
username: ${{ secrets.DOCKERHUB_USERNAME }}
password: ${{ secrets.DOCKERHUB_TOKEN }}
```

#### Issue: "Docker login failed"
**Cause**: Invalid DockerHub credentials

**Solutions**:
1. Generate new DockerHub access token:
   - Go to DockerHub → Account Settings → Security
   - Create new access token with appropriate permissions

2. Test credentials locally:
```bash
echo $DOCKERHUB_TOKEN | docker login -u $DOCKERHUB_USERNAME --password-stdin
```

3. Update GitHub secrets with new token

#### Issue: "Tests failing in CI but passing locally"
**Cause**: Environment differences

**Solutions**:
1. Check Node.js versions:
```yaml
# In workflow file
- uses: actions/setup-node@v4
  with:
    node-version: '18'  # Match local version
```

2. Use exact dependency versions:
```bash
# Use npm ci instead of npm install
npm ci
```

3. Set environment variables:
```yaml
env:
  NODE_ENV: test
  CI: true
```

## 🧪 Testing Issues

### Jest Configuration Problems

#### Issue: "Jest encountered an unexpected token"
**Cause**: ES6 modules or JSX not configured

**Solutions**:
1. Add Jest configuration to `package.json`:
```json
{
  "jest": {
    "testEnvironment": "node",
    "transform": {
      "^.+\\.js$": "babel-jest"
    }
  }
}
```

2. Install Babel if needed:
```bash
npm install --save-dev @babel/core @babel/preset-env babel-jest
```

#### Issue: "Cannot find module" in tests
**Cause**: Module resolution issues

**Solutions**:
1. Check test file imports:
```javascript
// Use relative paths
const app = require('../app.js');

// Or absolute paths with proper configuration
const app = require('../../app.js');
```

2. Add module paths to Jest config:
```json
{
  "jest": {
    "moduleDirectories": ["node_modules", "src"]
  }
}
```

#### Issue: "Tests timeout"
**Cause**: Async operations not handled properly

**Solutions**:
1. Increase timeout:
```javascript
// In test file
jest.setTimeout(10000);

// Or in package.json
{
  "jest": {
    "testTimeout": 10000
  }
}
```

2. Properly handle async operations:
```javascript
// Use async/await
test('async test', async () => {
  const response = await request(app).get('/');
  expect(response.status).toBe(200);
});

// Or return promise
test('promise test', () => {
  return request(app)
    .get('/')
    .expect(200);
});
```

## 🌐 Network and Connectivity Issues

### Local Development

#### Issue: "Cannot access localhost:3000"
**Cause**: Firewall or network configuration

**Solutions**:
```bash
# Check if application is listening
netstat -tulpn | grep :3000

# Test with curl
curl -v http://localhost:3000/

# Try different interfaces
curl -v http://127.0.0.1:3000/
curl -v http://0.0.0.0:3000/

# Check firewall (Ubuntu)
sudo ufw status
sudo ufw allow 3000
```

#### Issue: "CORS errors in browser"
**Cause**: Cross-origin request restrictions

**Solutions**:
1. Add CORS middleware to Express:
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
```

2. Or install cors package:
```bash
npm install cors
```

```javascript
const cors = require('cors');
app.use(cors());
```

### Production Deployment

#### Issue: "502 Bad Gateway"
**Cause**: Application not responding or wrong port

**Solutions**:
1. Check application logs:
```bash
docker logs container-name
```

2. Verify port configuration:
```bash
# Check if app listens on correct port
docker exec -it container-name netstat -tulpn
```

3. Test internal connectivity:
```bash
# Test from within container
docker exec -it container-name curl localhost:3000
```

## 📊 Performance Issues

### Memory Problems

#### Issue: "JavaScript heap out of memory"
**Cause**: Memory limit exceeded

**Solutions**:
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 app.js

# Or set environment variable
export NODE_OPTIONS="--max-old-space-size=4096"

# For Docker
docker run -e NODE_OPTIONS="--max-old-space-size=4096" kiro-app
```

#### Issue: "Container killed (OOMKilled)"
**Cause**: Container memory limit exceeded

**Solutions**:
```bash
# Run with more memory
docker run -m 1g kiro-app

# Check memory usage
docker stats container-name

# Monitor memory in container
docker exec -it container-name free -h
```

### CPU Performance

#### Issue: High CPU usage
**Cause**: Inefficient code or infinite loops

**Solutions**:
1. Profile application:
```bash
# Use Node.js profiler
node --prof app.js

# Analyze profile
node --prof-process isolate-*.log > processed.txt
```

2. Monitor CPU usage:
```bash
# System monitoring
top -p $(pgrep node)

# Docker monitoring
docker stats container-name
```

## 🔍 Debugging Techniques

### Application Debugging

#### Enable Debug Logging
```bash
# Set debug environment
DEBUG=* npm start

# Or specific modules
DEBUG=express:* npm start
```

#### Use Node.js Debugger
```bash
# Start with debugger
node --inspect app.js

# Connect with Chrome DevTools
# Open chrome://inspect in Chrome browser
```

#### Add Console Logging
```javascript
// Temporary debugging
console.log('Server starting on port:', PORT);
console.error('Error occurred:', error);

// Use debug module
const debug = require('debug')('app');
debug('Debug message');
```

### Docker Debugging

#### Interactive Container Access
```bash
# Run container with shell
docker run -it kiro-app /bin/sh

# Execute shell in running container
docker exec -it container-name /bin/sh

# Check container filesystem
docker exec container-name ls -la /app
```

#### Container Inspection
```bash
# Inspect container configuration
docker inspect container-name

# Check container processes
docker exec container-name ps aux

# Monitor container resources
docker stats container-name
```

## 📞 Getting Additional Help

### Log Collection
When reporting issues, include:

1. **Application logs**:
```bash
npm start > app.log 2>&1
```

2. **Docker logs**:
```bash
docker logs container-name > docker.log 2>&1
```

3. **System information**:
```bash
# System info
uname -a
node --version
npm --version
docker --version

# Save to file
{
  echo "System: $(uname -a)"
  echo "Node: $(node --version)"
  echo "npm: $(npm --version)"
  echo "Docker: $(docker --version)"
} > system-info.txt
```

### Community Resources
- **GitHub Issues**: Report bugs with logs and reproduction steps
- **Stack Overflow**: Tag questions with `nodejs`, `express`, `docker`
- **Docker Community**: [Docker Community Forums](https://forums.docker.com/)
- **Node.js Community**: [Node.js Help](https://nodejs.org/en/get-help/)

---

**Remember**: When troubleshooting, always start with the simplest solution and work your way up to more complex fixes. Document any solutions that work for future reference!