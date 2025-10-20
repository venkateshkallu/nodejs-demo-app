# Contributing to Kiro E-commerce Demo

Thank you for your interest in contributing to the Kiro e-commerce demonstration project! This document provides detailed information about the project structure, configuration files, and guidelines for contributors.

## 📁 Detailed Project Structure

### Root Directory Files

```
kiro-ecommerce-demo/
├── app.js                   # Main Express server application
├── package.json             # Node.js project configuration and dependencies
├── package-lock.json        # Locked dependency versions for reproducible builds
├── Dockerfile              # Docker container configuration
├── .dockerignore           # Files excluded from Docker build context
├── .gitignore              # Files excluded from Git version control
├── README.md               # Main project documentation
├── CONTRIBUTING.md         # This file - detailed contribution guidelines
└── LICENSE                 # MIT license file
```

### Directory Structure

#### `.github/workflows/`
Contains GitHub Actions CI/CD pipeline configurations.

```
.github/
└── workflows/
    └── main.yml            # Primary CI/CD pipeline workflow
```

#### `public/`
Static frontend assets served by Express.js.

```
public/
├── index.html              # Main HTML page with Kiro branding
├── style.css               # Responsive CSS with Grid/Flexbox layouts
├── script.js               # Interactive JavaScript for cart functionality
└── images/                 # Product images and assets
    ├── laptop.jpg          # Example product images
    ├── smartphone.jpg
    └── headphones.jpg
```

#### `test/`
Comprehensive test suite covering all application functionality.

```
test/
├── app.test.js             # Express server and API endpoint tests
├── frontend.test.js        # Frontend JavaScript functionality tests
└── ui-behavior.test.js     # User interface interaction tests
```

## ⚙️ Configuration Files Explained

### `package.json`
**Purpose**: Defines project metadata, dependencies, and npm scripts.

**Key Sections**:
- `dependencies`: Runtime dependencies (Express.js)
- `devDependencies`: Development and testing tools (Jest, Supertest)
- `scripts`: Automation commands for development and testing
- `engines`: Node.js version requirements (18+)

**Important Scripts**:
```json
{
  "start": "node app.js",        # Production server start
  "dev": "node app.js",          # Development server start
  "test": "jest",                # Run test suite
  "test:watch": "jest --watch",  # Run tests in watch mode
  "test:coverage": "jest --coverage"  # Generate coverage report
}
```

### `Dockerfile`
**Purpose**: Defines Docker container build instructions for production deployment.

**Key Features**:
- **Base Image**: `node:18-alpine` for minimal size and security
- **Multi-layer Optimization**: Package files copied first for better caching
- **Security**: Non-root user (`nodejs`) for container execution
- **Health Check**: Built-in health monitoring for container orchestration
- **Production Dependencies**: Only production npm packages included

**Build Process**:
1. Set up Node.js 18 Alpine environment
2. Copy package files and install dependencies
3. Copy application code
4. Create non-root user for security
5. Configure health check endpoint
6. Set startup command

### `.dockerignore`
**Purpose**: Excludes unnecessary files from Docker build context.

**Excluded Items**:
- `node_modules/` - Dependencies installed during build
- `npm-debug.log` - Debug logs not needed in container
- `.git/` - Version control history
- `test/` - Test files not needed in production
- `README.md` - Documentation files

### `.github/workflows/main.yml`
**Purpose**: Defines automated CI/CD pipeline using GitHub Actions.

**Workflow Stages**:

1. **Trigger Configuration**:
   ```yaml
   on:
     push:
       branches: [ main ]     # Deploy on main branch pushes
     pull_request:
       branches: [ main ]     # Test on pull requests
   ```

2. **Environment Setup**:
   - Ubuntu latest runner
   - Node.js 18 with npm caching
   - Dependency installation with `npm ci`

3. **Testing Phase**:
   - Execute complete test suite
   - Fail pipeline if tests don't pass

4. **Docker Build & Deploy** (main branch only):
   - Login to DockerHub using secrets
   - Build Docker image with latest tag
   - Push to DockerHub repository

**Required Secrets**:
- `DOCKERHUB_USERNAME`: DockerHub account username
- `DOCKERHUB_TOKEN`: DockerHub access token (not password)

### `.gitignore`
**Purpose**: Prevents sensitive and generated files from being committed to Git.

**Key Exclusions**:
- `node_modules/` - Dependencies (managed by package.json)
- `.env` - Environment variables with sensitive data
- `npm-debug.log*` - Debug and error logs
- `.DS_Store` - macOS system files
- `coverage/` - Test coverage reports

## 🔧 Development Guidelines

### Code Style Standards

#### JavaScript (ES6+)
- Use `const` and `let` instead of `var`
- Prefer arrow functions for callbacks
- Use template literals for string interpolation
- Follow semicolon usage consistently
- Use meaningful variable and function names

#### HTML
- Use semantic HTML5 elements
- Include proper `alt` attributes for images
- Maintain proper indentation (2 spaces)
- Use lowercase for element names and attributes

#### CSS
- Use CSS Grid and Flexbox for layouts
- Follow mobile-first responsive design
- Use meaningful class names (BEM methodology preferred)
- Group related properties together
- Include vendor prefixes when necessary

### Testing Requirements

#### Unit Tests
- Test all Express.js routes and middleware
- Test frontend JavaScript functions
- Mock external dependencies
- Achieve minimum 80% code coverage

#### Integration Tests
- Test complete request/response cycles
- Test Docker container functionality
- Test CI/CD pipeline components

#### Test File Naming
- `*.test.js` for unit tests
- `*.integration.test.js` for integration tests
- Place tests in `test/` directory

### Git Workflow

#### Branch Naming
- `feature/description` - New features
- `bugfix/description` - Bug fixes
- `hotfix/description` - Critical fixes
- `docs/description` - Documentation updates

#### Commit Messages
Follow conventional commit format:
```
type(scope): description

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```
feat(cart): add product quantity management
fix(server): resolve static file serving issue
docs(readme): update installation instructions
```

## 🐛 Troubleshooting Guide

### Common Development Issues

#### Port Already in Use
**Problem**: `Error: listen EADDRINUSE :::3000`

**Solutions**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill process by PID
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### Node.js Version Issues
**Problem**: Compatibility errors with Node.js version

**Solutions**:
```bash
# Check current version
node --version

# Install Node.js 18+ using nvm
nvm install 18
nvm use 18

# Or update using package manager
# macOS: brew upgrade node
# Ubuntu: sudo apt update && sudo apt upgrade nodejs
```

#### npm Install Failures
**Problem**: Dependency installation errors

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Use npm ci for clean install
npm ci
```

### Docker Issues

#### Build Failures
**Problem**: Docker build fails with dependency errors

**Solutions**:
```bash
# Build with no cache
docker build --no-cache -t kiro-ecommerce-demo .

# Check Docker daemon status
docker info

# Clean Docker system
docker system prune -a
```

#### Container Won't Start
**Problem**: Container exits immediately

**Solutions**:
```bash
# Check container logs
docker logs <container-id>

# Run container interactively
docker run -it kiro-ecommerce-demo /bin/sh

# Check port mapping
docker run -p 3000:3000 kiro-ecommerce-demo
```

### CI/CD Pipeline Issues

#### GitHub Actions Failures
**Problem**: Pipeline fails at various stages

**Common Solutions**:

1. **Test Failures**:
   ```bash
   # Run tests locally first
   npm test
   
   # Check test output for specific failures
   npm run test:coverage
   ```

2. **Docker Build Failures**:
   - Verify Dockerfile syntax
   - Check .dockerignore exclusions
   - Ensure all dependencies are in package.json

3. **DockerHub Push Failures**:
   - Verify GitHub secrets are set correctly
   - Check DockerHub token permissions
   - Ensure repository exists on DockerHub

#### Secret Configuration
**Problem**: DockerHub authentication fails

**Steps to Fix**:
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add `DOCKERHUB_USERNAME` with your DockerHub username
3. Add `DOCKERHUB_TOKEN` with DockerHub access token (not password)
4. Generate token at: DockerHub → Account Settings → Security → Access Tokens

### Testing Issues

#### Jest Configuration Problems
**Problem**: Tests fail to run or find modules

**Solutions**:
```bash
# Install Jest globally
npm install -g jest

# Run with verbose output
npm test -- --verbose

# Run specific test file
npm test -- app.test.js
```

#### JSDOM Issues
**Problem**: Frontend tests fail with DOM errors

**Solutions**:
- Ensure `jsdom` is installed: `npm install --save-dev jsdom`
- Check test environment configuration in package.json
- Verify HTML structure in test files

## 📋 Contribution Checklist

Before submitting a pull request, ensure:

- [ ] Code follows project style guidelines
- [ ] All tests pass locally (`npm test`)
- [ ] New features include appropriate tests
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventional format
- [ ] No sensitive information is committed
- [ ] Docker build succeeds locally
- [ ] Changes are tested in development environment

## 🚀 Release Process

### Version Management
- Follow semantic versioning (SemVer)
- Update version in `package.json`
- Create Git tags for releases
- Update CHANGELOG.md with release notes

### Deployment Steps
1. Merge approved pull request to main branch
2. GitHub Actions automatically triggers CI/CD pipeline
3. Tests run and Docker image builds
4. Image pushes to DockerHub with latest tag
5. Verify deployment success in pipeline logs

## 📞 Getting Help

### Internal Resources
- Check existing GitHub Issues for similar problems
- Review test files for usage examples
- Examine CI/CD logs for deployment issues

### External Resources
- [Express.js Documentation](https://expressjs.com/)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Jest Testing Framework](https://jestjs.io/)

### Contact
- Create GitHub Issue for bugs or feature requests
- Start GitHub Discussion for questions
- Email: [development@kiro.com] *(Replace with actual contact)*

---

**Happy Contributing! 🎉**