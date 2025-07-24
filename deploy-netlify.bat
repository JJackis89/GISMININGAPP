@echo off
echo Starting Netlify deployment for EPA Mining Concessions Management System...
echo.

REM Check if Netlify CLI is installed
netlify --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Netlify CLI not found. Installing...
    npm install -g netlify-cli
)

echo.
echo Building project...
call npm run build

echo.
echo Deploying to Netlify...
netlify deploy --prod --dir=dist

echo.
echo Deployment complete!
echo Your EPA Mining Concessions Management System is now live on Netlify.
pause
