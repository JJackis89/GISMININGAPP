@echo off
echo ========================================
echo   EPA MINING DATABASE - Build Script
echo   Environmental Protection Authority
echo ========================================
echo.

cd /d "%~dp0"

echo Building production version...
echo.

npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD SUCCESSFUL!
echo ========================================
echo.
echo Production files created in 'dist' folder
echo.
echo To preview the production build, run:
echo   npm run preview
echo.
echo To deploy, upload the contents of the 'dist' folder
echo to your web server.
echo.
pause
