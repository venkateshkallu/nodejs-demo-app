# Kiro — Smart Shopping Made Simple

A Node.js e-commerce demonstration application with automated CI/CD pipeline integration. This project showcases a simple Amazon-like shopping experience with product listings, cart functionality, responsive design, and complete DevOps automation.

![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)
![Docker](https://img.shields.io/badge/Docker-Containerized-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🚀 Live Demo

- **Application**: [Live Demo URL](https://github.com/venkateshkallu/nodejs-demo-app)
- **DockerHub Repository**: [DockerHub Repository Link](https://hub.docker.com/r/venkateshkalluu/nodejs-demo-app)

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Development Setup](#development-setup)
- [Docker Usage](#docker-usage)
- [CI/CD Pipeline](#cicd-pipeline)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

- **Responsive E-commerce Interface**: Modern product showcase with cart functionality
- **Kiro Branding**: Professional, clean interface with custom branding
- **Node.js Backend**: Express.js server with static file serving
- **Docker Containerization**: Production-ready containerized deployment
- **Automated CI/CD**: GitHub Actions pipeline with testing and deployment
- **DockerHub Integration**: Automated image building and publishing
- **Comprehensive Testing**: Unit and integration tests with Jest
- **Mobile-First Design**: Responsive layout using CSS Grid and Flexbox

## 🛠 Technology Stack

### Backend
- **Node.js** (v18+) - JavaScript runtime
- **Express.js** (v4.18+) - Web application framework
- **Path** - File path utilities

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Grid/Flexbox responsive design
- **Vanilla JavaScript** - Interactive cart functionality

### DevOps & Deployment
- **Docker** - Containerization with Alpine Linux
- **GitHub Actions** - CI/CD automation
- **DockerHub** - Container registry
- **Jest** - Testing framework
- **Supertest** - HTTP assertion testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed ([Download here](https://nodejs.org/))
- Docker installed ([Download here](https://www.docker.com/))
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd kiro-ecommerce-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

## 💻 Development Setup

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
```

## 🐳 Docker Usage

### Build and Run Locally

```bash
# Build Docker image
docker build -t kiro-ecommerce-demo .

# Run container
docker run -p 3000:3000 kiro-ecommerce-demo

# Run container in background
docker run -d -p 3000:3000 --name kiro-app kiro-ecommerce-demo
```

### Pull from DockerHub

```bash
# Pull latest image
docker pull [DOCKERHUB_USERNAME]/nodejs-demo-app:latest

# Run pulled image
docker run -p 3000:3000 [DOCKERHUB_USERNAME]/nodejs-demo-app:latest
```

### Docker Compose (Optional)

```yaml
version: '3.8'
services:
  kiro-app:
    image: [DOCKERHUB_USERNAME]/nodejs-demo-app:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that automatically:

### Pipeline Stages

1. **Code Checkout** - Retrieves latest code from repository
2. **Node.js Setup** - Configures Node.js 18 environment with npm caching
3. **Dependency Installation** - Installs project dependencies with `npm ci`
4. **Testing** - Runs complete test suite with `npm test`
5. **Docker Build** - Creates optimized Docker image
6. **DockerHub Deployment** - Pushes image to DockerHub registry

### Workflow Triggers

- **Push to main branch** - Full pipeline execution
- **Pull requests** - Testing and validation only

### Required Secrets

Configure these secrets in your GitHub repository settings:

```
DOCKERHUB_USERNAME - Your DockerHub username
DOCKERHUB_TOKEN - Your DockerHub access token
```

### Pipeline Status
![alt text](<Screenshot from 2025-10-20 21-53-06.png>)
![Pipeline Status](https://github.com/venkateshkallu/nodejs-demo-app/actions/runs/18657944262/job/53192537563)

## 🧪 Testing

### Test Structure

```bash
test/
├── app.test.js           # Server and API tests
├── frontend.test.js      # Frontend functionality tests
└── ui-behavior.test.js   # UI interaction tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode for development
npm run test:watch

# Run specific test file
npm test -- app.test.js
```

### Test Coverage

The project maintains high test coverage across:
- Express server routes and middleware
- Static file serving functionality
- Cart management operations
- UI component interactions
- Error handling scenarios

## 📁 Project Structure

```
kiro-ecommerce-demo/
├── .github/
│   └── workflows/
│       └── main.yml          # CI/CD pipeline configuration
├── public/                   # Static frontend assets
│   ├── index.html           # Main HTML page with Kiro branding
│   ├── style.css            # Responsive CSS with Grid/Flexbox
│   ├── script.js            # Interactive cart functionality
│   └── images/              # Product images and assets
├── test/                    # Comprehensive test suite
│   ├── app.test.js          # Express server and API tests
│   ├── frontend.test.js     # Frontend JavaScript tests
│   └── ui-behavior.test.js  # UI interaction tests
├── .dockerignore            # Docker build exclusions
├── .gitignore              # Git version control exclusions
├── Dockerfile              # Production container configuration
├── app.js                  # Main Express server application
├── package.json            # Project metadata and dependencies
├── README.md               # Main project documentation (this file)
├── CONTRIBUTING.md         # Detailed contribution guidelines
└── DEPLOYMENT.md           # Comprehensive deployment guide
```

### Configuration Files

| File | Purpose | Key Features |
|------|---------|--------------|
| `package.json` | Project configuration | Dependencies, scripts, Node.js version |
| `Dockerfile` | Container definition | Multi-stage build, security, health checks |
| `.dockerignore` | Build optimization | Excludes unnecessary files from build |
| `.github/workflows/main.yml` | CI/CD pipeline | Automated testing, building, deployment |
| `.gitignore` | Version control | Excludes generated and sensitive files |

## 📚 API Documentation

### Endpoints

#### GET /
- **Description**: Serves the main application page
- **Response**: HTML page with product showcase
- **Status Codes**: 200 (Success), 404 (Not Found)

#### Static Files
- **Route**: `/public/*`
- **Description**: Serves static assets (CSS, JS, images)
- **Examples**:
  - `/style.css` - Application styles
  - `/script.js` - Interactive functionality
  - `/images/laptop.jpg` - Product images

### Error Handling

- **404 Errors**: Custom "Page not found" response
- **500 Errors**: Generic error message with server logging
- **Static File Errors**: Graceful fallback handling

## 📚 Documentation

This project includes comprehensive documentation to help developers understand, contribute to, and deploy the application:

### Core Documentation
- **[README.md](README.md)** - Main project overview and quick start guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Detailed contribution guidelines and project structure
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide for various platforms
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Common issues and solutions guide

### Additional Resources
- **[GitHub Issues](https://github.com/[USERNAME]/[REPOSITORY]/issues)** - Bug reports and feature requests
- **[GitHub Discussions](https://github.com/[USERNAME]/[REPOSITORY]/discussions)** - Community discussions and Q&A
- **[Wiki](https://github.com/[USERNAME]/[REPOSITORY]/wiki)** - Extended documentation and tutorials

### Documentation Structure

| Document | Purpose | Audience |
|----------|---------|----------|
| README.md | Project overview, quick start | All users |
| CONTRIBUTING.md | Development guidelines, project structure | Contributors, developers |
| DEPLOYMENT.md | Production deployment guide | DevOps, system administrators |
| TROUBLESHOOTING.md | Common issues and solutions | All users, support teams |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments


- Inspired by modern e-commerce platforms
- Powered by open-source technologies

---
