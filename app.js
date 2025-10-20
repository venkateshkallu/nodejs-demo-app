const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for serving static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Root route handler - serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server only if this file is run directly (not when required for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Kiro server running on port ${PORT}`);
  });
}

module.exports = app;