#!/bin/bash

# Nixpacks Deployment Script for AIVA Frontend

# Exit on any error
set -e

echo "🚀 Starting Nixpacks deployment for AIVA Frontend..."

# Check if nixpacks is installed
if ! command -v nixpacks &> /dev/null
then
    echo "❌ Nixpacks could not be found. Please install it first:"
    echo "   curl -L https://nixpacks.com/install.sh | bash"
    exit 1
fi

# Get the application name from the first argument or use default
APP_NAME=${1:-aiva-frontend}

echo "📦 Building application with Nixpacks..."
nixpacks build . -n $APP_NAME

echo "✅ Build completed successfully!"

echo "🔧 To run the application locally:"
echo "   docker run -p 5173:5173 $APP_NAME"

echo "☁️  To deploy to a container registry, use:"
echo "   docker tag $APP_NAME <registry>/$APP_NAME"
echo "   docker push <registry>/$APP_NAME"

echo "📄 For more deployment options, see NIXPACKS_DEPLOYMENT.md"

echo "🎉 Deployment preparation completed!"