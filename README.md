# AIVA Chat Application - Frontend

This is the frontend application for the AIVA Chat Application, built with React, Vite, and TypeScript.

## Overview

This frontend application provides a modern chat interface with the following features:
- User authentication
- Chat history management
- Message actions (like, dislike, bookmark)
- Workspace management
- Responsive design

## Deployment Options

### Nixpacks Deployment
This frontend application can be easily deployed using Nixpacks, which automatically generates optimized Docker images.

#### Prerequisites
1. Install Nixpacks: See [INSTALL_NIXPACKS.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/INSTALL_NIXPACKS.md) for installation instructions
2. Docker (for local testing)

#### Building with Nixpacks
```bash
nixpacks build . -n aiva-frontend
```

#### Running the Built Image
```bash
docker run -p 5173:5173 aiva-frontend
```

For detailed deployment instructions, see [NIXPACKS_DEPLOYMENT.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/NIXPACKS_DEPLOYMENT.md).

### Azure App Services Deployment
The application can also be deployed to Azure App Services. For detailed instructions, see [AZURE_APP_SERVICES_DEPLOYMENT.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/AZURE_APP_SERVICES_DEPLOYMENT.md).

#### Startup Command for Azure App Services
For Azure App Services deployment, use one of the following startup commands:

**Linux App Services:**
```bash
./startup.sh
```

**Windows App Services:**
```cmd
startup.cmd
```

## API Proxy Configuration

The application is configured to communicate with a backend API hosted at `web-production-50913.up.railway.app`.

### Development Proxy
During development, the Vite server proxies API requests to the backend:
- Requests to `/api/*` are forwarded to `https://web-production-50913.up.railway.app`

### Production Configuration
In production, the application uses environment variables:
- `VITE_API_URL`: The base URL for API requests
- `VITE_APP_URL`: The application's public URL

For detailed proxy configuration information, see [PROXY_CONFIGURATION.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/PROXY_CONFIGURATION.md).

## Development

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
```bash
npm install
```

### Running Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Previewing Production Build
```bash
npm run preview
```

## Configuration

The application can be configured using environment variables. Create a `.env` file in the root directory with the following variables:

```env
# API endpoint
VITE_API_URL=https://web-production-50913.up.railway.app/api
VITE_APP_URL=https://web-production-50913.up.railway.app

# Authentication settings
VITE_AUTH_CLIENT_ID=your-client-id
VITE_AUTH_TENANT_ID=your-tenant-id
```

## Architecture

This is a standalone frontend application that communicates with backend services via REST APIs. The application is built with:

- **React** - UI library
- **Vite** - Build tool and development server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **shadcn/ui** - UI components

## Backend Services

This frontend application is designed to work with separate backend services. The backend should provide REST APIs for:

1. User authentication
2. Chat management
3. Message handling
4. Workspace management
5. User preferences

## Deployment Architecture

For a complete deployment, you'll need to deploy:

1. This frontend application (using Nixpacks or Azure App Services as described above)
2. Backend services (API server, database, etc.)
3. Authentication service (Azure AD, Auth0, etc.)

## Troubleshooting

### Common Issues

1. **API Connection Errors**: Verify that the backend services are running and accessible
2. **Authentication Issues**: Check that the authentication configuration is correct
3. **Build Failures**: Ensure all dependencies are properly installed

### Getting Help

For detailed information about the original database integration fixes, see the previous version of this README.