import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Add comprehensive CORS headers for all requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key, X-Client-ID');
  res.header('Access-Control-Expose-Headers', 'X-Total-Count, X-Page-Count');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Proxy API requests to the backend service with CORS handling
const API_BASE_URL = process.env.VITE_API_URL || 'https://web-production-50913.up.railway.app/api';
app.use('/api', createProxyMiddleware({
  target: API_BASE_URL.replace('/api', ''), // Remove /api from the target as it's in the base URL
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // Rewrite path
  },
  secure: true,
  onProxyRes: function (proxyRes, req, res) {
    // Add CORS headers to proxied responses
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key, X-Client-ID';
    proxyRes.headers['Access-Control-Expose-Headers'] = 'X-Total-Count, X-Page-Count';
    proxyRes.headers['Access-Control-Allow-Credentials'] = 'true';
    
    // Specifically handle image responses
    if (proxyRes.headers['content-type'] && proxyRes.headers['content-type'].includes('image')) {
      proxyRes.headers['Cache-Control'] = 'public, max-age=31536000'; // Cache images for 1 year
    }
  }
}));

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing - serve index.html for all non-API routes
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get port from environment variable or default to 8080
const PORT = process.env.PORT || 8080;

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check endpoint: http://localhost:${PORT}/health`);
  console.log(`API Base URL: ${API_BASE_URL}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});