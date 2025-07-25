@echo off
echo 🚀 EPA Mining Concessions - Supabase Setup
echo ==========================================

REM Check if we're in the right directory
if not exist "supabase-schema.sql" (
    echo ❌ supabase-schema.sql not found. Please run this script from the project root.
    pause
    exit /b 1
)

echo 📋 Found database schema file

echo.
echo 🔗 To set up real Supabase authentication:
echo.
echo 1. Open your Supabase Dashboard:
echo    https://supabase.com/dashboard
echo.
echo 2. Go to your project: GISMININGAPP
echo.
echo 3. Navigate to SQL Editor
echo.
echo 4. Copy and paste the contents of supabase-schema.sql
echo.
echo 5. Run the SQL to create tables and policies
echo.
echo 6. Configure Authentication settings:
echo    - Go to Authentication ^> Settings
echo    - Enable email confirmations (optional)
echo    - Configure email templates (optional)
echo    - Set up OAuth providers if needed (optional)
echo.
echo 7. Test authentication:
echo    - Build and deploy your app: npm run build
echo    - Try registering a new user
echo    - Check the auth.users and profiles tables
echo.
echo 🔍 Environment Check:
if exist ".env" (
    findstr /C:"VITE_SUPABASE_URL" .env >nul 2>&1
    if %errorlevel% == 0 (
        findstr /C:"VITE_SUPABASE_ANON_KEY" .env >nul 2>&1
        if %errorlevel% == 0 (
            echo ✅ Supabase environment variables found in .env
        ) else (
            echo ⚠️  Missing VITE_SUPABASE_ANON_KEY in .env
        )
    ) else (
        echo ⚠️  Missing VITE_SUPABASE_URL in .env
    )
) else (
    echo ⚠️  .env file not found. Please create one with your Supabase credentials.
)

echo.
echo 🎉 After running the SQL schema, your app will have real authentication!
echo.
echo 📚 Useful links:
echo    - Supabase Docs: https://supabase.com/docs
echo    - Authentication Guide: https://supabase.com/docs/guides/auth
echo    - Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
echo.
pause
