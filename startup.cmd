@echo off

REM Install dependencies
echo Installing dependencies...
npm install

REM Build the frontend application
echo Building frontend...
npm run build

REM Start the preview server (this will serve the built files)
echo Starting application on port 8080...
npm run preview