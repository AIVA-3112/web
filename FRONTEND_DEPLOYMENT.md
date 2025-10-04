# AIVA Chat Application - Frontend Deployment

This document provides instructions for deploying the AIVA Chat Application frontend to various platforms.

## Overview

This is now a standalone frontend application that communicates with backend services via REST APIs. The frontend is built with:

- **React** - UI library
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **shadcn/ui** - UI components

## Deployment Options

### 1. Azure App Services Deployment

See [AZURE_APP_SERVICES_DEPLOYMENT.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/AZURE_APP_SERVICES_DEPLOYMENT.md) for detailed instructions.

#### Quick Start for Azure App Services:

1. **Startup Command for Linux App Services:**
   ```bash
   ./startup.sh
   ```

2. **Startup Command for Windows App Services:**
   ```cmd
   startup.cmd
   ```

3. **Required Environment Variables:**
   ```env
   VITE_API_URL=https://web-production-50913.up.railway.app/api
   VITE_APP_URL=https://your-app-name.azurewebsites.net
   PORT=8080
   NODE_ENV=production
   ```

### 2. Nixpacks Deployment

See [NIXPACKS_DEPLOYMENT.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/NIXPACKS_DEPLOYMENT.md) for detailed instructions.

#### Quick Start for Nixpacks:
```bash
nixpacks build . -n aiva-frontend
docker run -p 8080:8080 aiva-frontend
```

### 3. Traditional Node.js Server Deployment

The frontend can be served using the built-in Vite preview server:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the application:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm run preview
   ```

### 4. Static File Deployment

After building the application, you can deploy the contents of the `dist` folder to any static file hosting service:

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder contents to your hosting service**

## Environment Variables

The application requires the following environment variables for proper operation:

```env
# API Configuration
VITE_API_URL=https://web-production-50913.up.railway.app/api
VITE_APP_URL=https://your-deployment-url.com

# Authentication settings (if using Microsoft Entra ID)
VITE_MICROSOFT_CLIENT_ID=your-client-id
VITE_MICROSOFT_TENANT_ID=your-tenant-id

# Other OAuth providers (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_YAHOO_CLIENT_ID=your-yahoo-client-id

# Node.js Configuration (for Azure App Services)
PORT=8080
NODE_ENV=production
```

## Configuration Files

This deployment uses the following configuration files:

1. **[web.config](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/web.config)** - IIS configuration for Windows hosting
2. **[azure-staticwebapp.config.json](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/azure-staticwebapp.config.json)** - Configuration for Azure Static Web Apps
3. **[startup.sh](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/startup.sh)** - Linux startup script
4. **[startup.cmd](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/startup.cmd)** - Windows startup script
5. **[nixpacks.toml](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/nixpacks.toml)** - Nixpacks configuration

## API Communication

The frontend communicates with backend services at `https://web-production-50913.up.railway.app` for all API requests.

For detailed information about the proxy configuration, see [PROXY_CONFIGURATION.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/PROXY_CONFIGURATION.md).

## Troubleshooting

### Common Issues

1. **Blank Page**: Verify that the build process completed successfully
2. **API Connection Errors**: Check environment variables and network settings
3. **Authentication Issues**: Verify OAuth configuration settings

### Build Issues

If you encounter build errors:

1. **Clean install dependencies:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Check Node.js version compatibility:**
   Ensure you're using Node.js 18.x or later

### Runtime Issues

1. **Port configuration**: The application runs on port 8080 by default (changed from 5173 to match Azure App Service default)
2. **Environment variables**: Ensure all required environment variables are set
3. **CORS issues**: Verify that the backend is configured to accept requests from your frontend origin

## Scaling Considerations

For high-traffic deployments:

1. **Use a CDN** to serve static assets
2. **Enable compression** on your web server
3. **Configure caching headers** for static assets
4. **Consider using a dedicated reverse proxy** like Nginx or Apache

## Security Best Practices

1. **Always use HTTPS** in production
2. **Store secrets securely** using platform-specific secret management
3. **Regularly update dependencies** to address security vulnerabilities
4. **Implement proper authentication and authorization** in your backend services