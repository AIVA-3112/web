#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the frontend application
echo "Building frontend..."
npm run build

# Start the preview server (this will serve the built files)
echo "Starting application on port 8080..."
npm run preview