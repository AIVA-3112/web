@echo on

REM Azure App Service deployment script

REM Set environment variables
set NODE_ENV=production
if "%PORT%"=="" (
  set PORT=8080
)

REM Install all dependencies
echo Installing dependencies...
npm ci --production

REM Check if installation was successful
if %errorlevel% neq 0 (
  echo Failed to install dependencies
  exit /b 1
)

REM Build the frontend application
echo Building frontend...
npm run build

REM Check if build was successful
if %errorlevel% neq 0 (
  echo Failed to build application
  exit /b 1
)

REM List files in dist directory to verify build
echo Listing dist directory contents:
dir dist\

REM Start the custom Express server
echo Starting Express server on port %PORT%...
node server.js