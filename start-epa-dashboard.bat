@echo off
echo ========================================
echo   EPA Mining Concessions Dashboard
echo   Environmental Protection Authority
echo ========================================
echo.
echo Starting development server...
echo.

cd /d "%~dp0"

echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Checking if npm is available...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not available
    echo Please ensure Node.js is properly installed
    pause
    exit /b 1
)

echo Installing dependencies (if needed)...
if not exist "node_modules" (
    echo Installing npm packages...
    npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo Starting EPA Mining Dashboard...
echo Server will be available at: http://localhost:5173 (or next available port)
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev

echo.
echo Development server stopped.
pause
