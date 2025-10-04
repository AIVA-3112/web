@echo off
REM Nixpacks Deployment Script for AIVA Frontend

echo 🚀 Starting Nixpacks deployment for AIVA Frontend...

REM Check if nixpacks is installed
where nixpacks >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Nixpacks could not be found. Please install it first:
    echo    Visit https://nixpacks.com/docs/installation for installation instructions
    exit /b 1
)

REM Get the application name from the first argument or use default
set APP_NAME=%1
if "%APP_NAME%"=="" set APP_NAME=aiva-frontend

echo 📦 Building application with Nixpacks...
nixpacks build . -n %APP_NAME%

echo ✅ Build completed successfully!

echo 🔧 To run the application locally:
echo    docker run -p 5173:5173 %APP_NAME%

echo ☁️  To deploy to a container registry, use:
echo    docker tag %APP_NAME% ^<registry^>/%APP_NAME%
echo    docker push ^<registry^>/%APP_NAME%

echo 📄 For more deployment options, see NIXPACKS_DEPLOYMENT.md

echo 🎉 Deployment preparation completed!