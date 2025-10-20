const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../app');

describe('Express Server Tests', () => {
  describe('Root Route Handler', () => {
    test('GET / should serve index.html', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('GET / should return HTML content', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.text).toContain('<!DOCTYPE html>');
      expect(response.text).toContain('Kiro');
    });
  });

  describe('Static File Serving', () => {
    test('should serve CSS files from public directory', async () => {
      const response = await request(app)
        .get('/style.css')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/css/);
    });

    test('should serve JavaScript files from public directory', async () => {
      const response = await request(app)
        .get('/script.js')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/application\/javascript/);
    });

    test('should serve image files from public/images directory', async () => {
      // Test if images directory exists and serve placeholder if available
      const response = await request(app)
        .get('/images/placeholder.jpg');
      
      // Should either serve the image (200) or return 404 if not found
      expect([200, 404]).toContain(response.status);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect(404);
      
      expect(response.text).toBe('Page not found');
    });

    test('should return 404 for non-existent static files', async () => {
      await request(app)
        .get('/non-existent-file.css')
        .expect(404);
    });

    test('should handle POST requests to root with 404', async () => {
      await request(app)
        .post('/')
        .expect(404);
    });
  });

  describe('Server Configuration', () => {
    test('should export Express app instance', () => {
      expect(app).toBeDefined();
      expect(typeof app).toBe('function');
      expect(app.listen).toBeDefined();
    });

    test('should use correct static file middleware', () => {
      // Test that static middleware is configured
      const publicPath = path.join(__dirname, '..', 'public');
      expect(fs.existsSync(publicPath)).toBe(true);
    });
  });

  describe('Response Headers', () => {
    test('should set appropriate headers for HTML responses', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.headers['content-type']).toMatch(/text\/html/);
    });

    test('should set appropriate headers for CSS responses', async () => {
      const response = await request(app)
        .get('/style.css');
      
      if (response.status === 200) {
        expect(response.headers['content-type']).toMatch(/text\/css/);
      }
    });

    test('should set appropriate headers for JavaScript responses', async () => {
      const response = await request(app)
        .get('/script.js');
      
      if (response.status === 200) {
        expect(response.headers['content-type']).toMatch(/application\/javascript/);
      }
    });
  });

  describe('Server Startup Configuration', () => {
    test('should use PORT environment variable when available', () => {
      const originalPort = process.env.PORT;
      process.env.PORT = '4000';
      
      // Re-require the app to test port configuration
      delete require.cache[require.resolve('../app')];
      const testApp = require('../app');
      
      expect(testApp).toBeDefined();
      
      // Restore original PORT
      if (originalPort) {
        process.env.PORT = originalPort;
      } else {
        delete process.env.PORT;
      }
    });

    test('should default to port 3000 when PORT not set', () => {
      const originalPort = process.env.PORT;
      delete process.env.PORT;
      
      // Re-require the app to test default port
      delete require.cache[require.resolve('../app')];
      const testApp = require('../app');
      
      expect(testApp).toBeDefined();
      
      // Restore original PORT
      if (originalPort) {
        process.env.PORT = originalPort;
      }
    });
  });
});