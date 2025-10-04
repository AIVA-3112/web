#!/bin/bash

# Azure App Service deployment script

# Set environment variables
export NODE_ENV=production
export PORT=${PORT:-8080}

# Install all dependencies
echo "Installing dependencies..."
npm ci --production

# Check if installation was successful
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies"
  exit 1
fi

# Build the frontend application
echo "Building frontend..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
  echo "Failed to build application"
  exit 1
fi

# List files in dist directory to verify build
echo "Listing dist directory contents:"
ls -la dist/

# Start the custom Express server
echo "Starting Express server on port $PORT..."
node server.js