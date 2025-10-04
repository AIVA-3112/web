# Proxy Configuration

This document explains how the proxy configuration works in this application to connect to the backend API hosted at `web-production-50913.up.railway.app`.

## Vite Development Server Proxy

The Vite development server is configured to proxy API requests to the Railway backend. This configuration is found in [vite.config.ts](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/vite.config.ts):

```javascript
server: {
  host: "::",
  port: 5173,
  strictPort: true,
  proxy: {
    "/api": {
      target: "https://web-production-50913.up.railway.app",
      changeOrigin: true,
      secure: true,
    },
  },
},
```

This configuration means that during development:
- Requests to `/api/*` paths will be proxied to `https://web-production-50913.up.railway.app`
- The `changeOrigin: true` option ensures the correct Host header is sent to the target server
- The `secure: true` option enables SSL verification for HTTPS targets

## Production API Configuration

In production, the application uses environment variables to determine the API endpoint:

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://web-production-50913.up.railway.app/api';
```

This is configured in:
- [.env](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/.env) - Development environment variables
- [.env.production](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/.env.production) - Production environment variables

## Environment Variables

The following environment variables control the API connection:

```
VITE_API_URL=https://web-production-50913.up.railway.app/api
VITE_APP_URL=https://web-production-50913.up.railway.app
```

## How It Works

1. **Development Mode**: When running `npm run dev`, the Vite development server proxies `/api` requests to the Railway backend
2. **Production Mode**: When running the built application, API calls use the `VITE_API_URL` environment variable

## Testing the Configuration

To test that the proxy configuration is working correctly:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser to `http://localhost:5173`

3. Try to access a protected route that requires API calls (like login or chat)

4. Check the browser's developer tools Network tab to see if API requests are being made to `/api/*` paths

5. The Vite proxy should forward these requests to `https://web-production-50913.up.railway.app`

## Troubleshooting

### Common Issues

1. **CORS Errors**: If you see CORS errors, ensure the backend is configured to accept requests from your frontend origin

2. **404 Errors**: If API requests return 404, verify that the endpoint paths are correct and the backend is running

3. **SSL Issues**: If you encounter SSL errors, you might need to set `secure: false` in the proxy configuration (not recommended for production)

### Debugging Proxy Issues

To debug proxy issues, you can add logging to the Vite configuration:

```javascript
proxy: {
  "/api": {
    target: "https://web-production-50913.up.railway.app",
    changeOrigin: true,
    secure: true,
    configure: (proxy, options) => {
      proxy.on('error', (err, req, res) => {
        console.log('Proxy error:', err);
      });
      proxy.on('proxyReq', (proxyReq, req, res) => {
        console.log('Proxying request:', req.method, req.url);
      });
      proxy.on('proxyRes', (proxyRes, req, res) => {
        console.log('Received response:', proxyRes.statusCode, req.url);
      });
    }
  },
}
```

## Railway Deployment

When deploying to Railway, make sure to set the environment variables in the Railway project settings:

```
VITE_API_URL=https://web-production-50913.up.railway.app/api
VITE_APP_URL=https://your-frontend-app.up.railway.app
```

This ensures that the frontend knows how to communicate with the backend API.