@echo off
echo Deploying to Vercel...
echo Current directory: %CD%
echo.

echo Step 1: Building the app...
call npm run build:vercel
if %ERRORLEVEL% neq 0 (
    echo Build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Deploying to Vercel...
call npx vercel --prod
if %ERRORLEVEL% neq 0 (
    echo Deployment failed!
    pause
    exit /b 1
)

echo.
echo Deployment completed successfully!
pause
