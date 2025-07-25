#!/bin/bash

# EPA Mining Concessions Management System
# Supabase Setup Script

echo "🚀 EPA Mining Concessions - Supabase Setup"
echo "=========================================="

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Please install it first:"
    echo "   npm install -g supabase"
    echo "   OR"
    echo "   Visit: https://supabase.com/docs/guides/cli"
    exit 1
fi

echo "✅ Supabase CLI found"

# Check if we're in the right directory
if [ ! -f "supabase-schema.sql" ]; then
    echo "❌ supabase-schema.sql not found. Please run this script from the project root."
    exit 1
fi

echo "📋 Found database schema file"

# Initialize Supabase project (if not already done)
if [ ! -d "supabase" ]; then
    echo "🔧 Initializing Supabase project..."
    supabase init
else
    echo "✅ Supabase project already initialized"
fi

# Link to your Supabase project
echo ""
echo "🔗 Next steps:"
echo "1. Link to your Supabase project:"
echo "   supabase link --project-ref YOUR_PROJECT_REF"
echo ""
echo "2. Apply the database schema:"
echo "   supabase db push"
echo ""
echo "3. Or manually run the SQL in your Supabase dashboard:"
echo "   - Open https://supabase.com/dashboard"
echo "   - Go to your project"
echo "   - Navigate to SQL Editor"
echo "   - Copy and paste the contents of supabase-schema.sql"
echo "   - Run the SQL"
echo ""
echo "4. Configure authentication in Supabase dashboard:"
echo "   - Go to Authentication > Settings"
echo "   - Enable email confirmations (optional)"
echo "   - Configure email templates (optional)"
echo "   - Set up any OAuth providers you want (optional)"
echo ""
echo "5. Create your first admin user:"
echo "   - Use the registration form in your app"
echo "   - Or manually insert into the profiles table with role='admin'"
echo ""
echo "🎉 Your EPA Mining Concessions system will then be ready with real authentication!"

# Check if environment variables are set
echo ""
echo "🔍 Environment Check:"
if [ -f ".env" ]; then
    if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
        echo "✅ Supabase environment variables found in .env"
    else
        echo "⚠️  Please make sure your .env file contains:"
        echo "   VITE_SUPABASE_URL=your_project_url"
        echo "   VITE_SUPABASE_ANON_KEY=your_anon_key"
    fi
else
    echo "⚠️  .env file not found. Please create one with your Supabase credentials."
fi

echo ""
echo "📚 Documentation:"
echo "   - Supabase Docs: https://supabase.com/docs"
echo "   - Authentication: https://supabase.com/docs/guides/auth"
echo "   - Row Level Security: https://supabase.com/docs/guides/auth/row-level-security"
