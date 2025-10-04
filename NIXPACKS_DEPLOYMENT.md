# Deploying with Nixpacks

This document provides instructions for deploying the frontend application using Nixpacks.

## What is Nixpacks?

Nixpacks is a tool that automatically generates optimized Docker images for applications. It detects your project type and creates a production-ready container image without requiring a Dockerfile.

## Prerequisites

1. Install Nixpacks: See [INSTALL_NIXPACKS.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/INSTALL_NIXPACKS.md) for detailed installation instructions
2. Docker (for local testing)
3. An account with a container registry (Docker Hub, GitHub Container Registry, etc.)

## Installing Nixpacks

For quick installation, see [INSTALL_NIXPACKS.md](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/INSTALL_NIXPACKS.md). Here are the most common installation methods:

### Windows (PowerShell as Administrator)
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm https://nixpacks.com/install.ps1 | iex
```

### macOS (with Homebrew)
```bash
brew tap railwayapp/nixpacks
brew install nixpacks
```

### Linux/macOS (curl)
```bash
curl -L https://nixpacks.com/install.sh | bash
```

Verify installation:
```bash
nixpacks --version
```

## Building with Nixpacks

### Local Build

To build the application locally using Nixpacks:

```bash
nixpacks build . -n my-app
```

### Run the Built Image

```bash
docker run -p 5173:5173 my-app
```

## Deploying to Container Registries

### Deploy to Docker Hub

```bash
# Login to Docker Hub
docker login

# Build and push to Docker Hub
nixpacks build . -n username/app-name --push
```

### Deploy to GitHub Container Registry (GHCR)

```bash
# Login to GHCR
echo $CR_PAT | docker login ghcr.io -u USERNAME --password-stdin

# Build and push to GHCR
nixpacks build . -n ghcr.io/username/app-name --push
```

## Configuration

Nixpacks automatically detects that this is a Vite + React application based on:
- package.json dependencies
- The presence of a vite.config.ts file
- The build scripts in package.json

The configuration is defined in:
- [nixpacks.toml](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/nixpacks.toml) - Main configuration file
- [vite.config.ts](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/vite.config.ts) - Vite configuration
- package.json scripts

## Customization

### Environment Variables

You can set environment variables during build time:

```bash
nixpacks build . -n my-app --env NODE_ENV=production
```

### Build Arguments

To customize the build process:

```bash
# Specify a different Node.js version
nixpacks build . -n my-app --env NODE_VERSION=18

# Install additional packages
nixpacks build . -n my-app --install-tool python3
```

## Optimization

The Vite configuration has been optimized for production with:
- Code splitting for vendor and UI libraries
- Asset optimization
- Proper output directory structure

## Troubleshooting

### Common Issues

1. **Build fails due to missing dependencies**:
   - Ensure all dependencies are in package.json
   - Check that devDependencies are properly separated

2. **Application not accessible after deployment**:
   - Verify the PORT environment variable (default: 5173)
   - Check that the preview command binds to 0.0.0.0

3. **Slow build times**:
   - Use .nixpacks/cache to cache dependencies between builds
   - Optimize package.json dependencies

### Debugging Builds

To debug the build process:

```bash
nixpacks build . --dry-run
```

This will show you the generated Dockerfile without building the image.

## Advanced Configuration

### Customizing the Build Process

You can customize the build process by modifying [nixpacks.toml](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/nixpacks.toml):

```toml
[phases.setup]
  [phases.setup.packages]
    node = "18.x"
    python = "3.9"

[phases.install]
  cmds = ["npm ci"]

[phases.build]
  cmds = ["npm run build"]

[phases.start]
  cmd = "npm run preview"
  ports = ["5173"]
```

### Multi-stage Builds

Nixpacks automatically creates optimized multi-stage builds, but you can customize this by providing your own Dockerfile in the [.nixpacks](file:///c%3A/Users/chint/Downloads/webapp_1%20-%20Copy/.nixpacks) directory.

## Standalone Frontend Application

This is now a standalone frontend application that can be deployed independently. The backend services that this frontend previously communicated with should be deployed separately. The frontend application is configured to:

- Build with Vite for optimal performance
- Serve on port 5173
- Bind to all interfaces (0.0.0.0) for container compatibility
- Work as a static single-page application