@echo off
echo ========================================
echo   EPA Mining Dashboard - GitHub Pages
echo   Environmental Protection Authority
echo ========================================
echo.

cd /d "%~dp0"

echo Building for GitHub Pages deployment...
echo.

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Git is not installed or not in PATH
    echo Please install Git from https://git-scm.com/
    pause
    exit /b 1
)

REM Check if we're in a git repository
if not exist ".git" (
    echo Initializing Git repository...
    git init
    git branch -M main
)

echo Building production version...
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
echo   DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo 1. Create a new repository on GitHub named "GISMININGAPP"
echo    Repository URL: https://github.com/JJackis89/GISMININGAPP
echo.
echo 2. Add your files to git:
echo    git add .
echo    git commit -m "Initial EPA Mining Dashboard"
echo.
echo 3. Connect to your GitHub repository:
echo    git remote add origin https://github.com/JJackis89/GISMININGAPP.git
echo    git push -u origin main
echo.
echo 4. In your GitHub repository settings:
echo    - Go to Settings ^> Pages
echo    - Source: Deploy from a branch
echo    - Branch: gh-pages (will be created automatically)
echo.
echo 5. Add your Supabase secrets to GitHub:
echo    - Go to Settings ^> Secrets and variables ^> Actions
echo    - Add: VITE_SUPABASE_URL
echo    - Add: VITE_SUPABASE_ANON_KEY
echo.
echo 6. The GitHub Action will automatically deploy on push
echo.
echo Your app will be available at:
echo https://JJackis89.github.io/GISMININGAPP/
echo.
pause
