# Installing Nixpacks

This document provides instructions for installing Nixpacks on different operating systems.

## Windows Installation

### Option 1: Using PowerShell (Recommended)

Open PowerShell as Administrator and run:

```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
irm https://nixpacks.com/install.ps1 | iex
```

### Option 2: Manual Installation

1. Download the latest release from https://github.com/railwayapp/nixpacks/releases
2. Extract the archive
3. Add the extracted directory to your PATH environment variable

## macOS Installation

### Using Homebrew

```bash
brew tap railwayapp/nixpacks
brew install nixpacks
```

### Using curl

```bash
curl -L https://nixpacks.com/install.sh | bash
```

## Linux Installation

### Using curl

```bash
curl -L https://nixpacks.com/install.sh | bash
```

## Verifying Installation

After installation, verify that Nixpacks is installed correctly:

```bash
nixpacks --version
```

## Using Nixpacks with This Project

Once Nixpacks is installed, you can build and deploy this frontend application:

```bash
# Build the application
nixpacks build . -n aiva-frontend

# Run locally
docker run -p 5173:5173 aiva-frontend
```

## Troubleshooting

### Common Issues

1. **Permission denied**: Run the installation command with appropriate privileges
2. **Command not found**: Ensure the installation directory is in your PATH
3. **Docker not running**: Make sure Docker is installed and running

### Windows-Specific Issues

1. **Execution policy errors**: Run PowerShell as Administrator and set execution policy:
   ```powershell
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **Antivirus blocking**: Add an exception for the Nixpacks installer if blocked by antivirus

## Alternative: Using Nixpacks with Docker

If you prefer not to install Nixpacks directly, you can use it via Docker:

```bash
# Build using Docker
docker run -v $PWD:/app ghcr.io/railwayapp/nixpacks:latest nixpacks build /app -n aiva-frontend
```