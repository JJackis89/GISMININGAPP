# Supabase Setup Guide for EPA Mining Dashboard

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
4. Choose a project name (e.g., "epa-mining-dashboard")
5. Set a strong database password
6. Choose your region (preferably closest to Ghana)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

## Step 3: Update Environment Variables

1. Open the `.env` file in your project root
2. Replace the placeholder values:

```env
VITE_SUPABASE_URL=https://your-actual-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

## Step 4: Configure Authentication

1. In Supabase dashboard, go to **Authentication** > **Settings**
2. Enable **Email** provider (should be enabled by default)
3. Optional: Configure email templates under **Auth** > **Templates**
4. Optional: Set up custom SMTP if needed (for production)

## Step 5: Create User Profiles Table (Optional)

If you want to store additional user information, create a profiles table:

1. Go to **Table Editor** in Supabase
2. Create a new table called `profiles`
3. Add these columns:
   - `id` (uuid, primary key, references auth.users.id)
   - `full_name` (text)
   - `role` (text, default 'staff')
   - `department` (text, nullable)
   - `created_at` (timestamptz, default now())
   - `updated_at` (timestamptz, default now())

## Step 6: Set Up Row Level Security (RLS)

1. Enable RLS on the profiles table
2. Create policies for read/write access
3. Example policy for users to read their own profile:
   ```sql
   CREATE POLICY "Users can view own profile" ON profiles
   FOR SELECT USING (auth.uid() = id);
   ```

## Step 7: Test Authentication

1. Start your development server: `npm run dev`
2. Try creating a new account with the signup form
3. Check your email for verification (if email confirmation is enabled)
4. Test login with your credentials

## Step 8: Production Considerations

For production deployment:

1. **Custom Domain**: Set up a custom domain for your Supabase project
2. **Email Configuration**: Configure custom SMTP for email delivery
3. **Rate Limiting**: Configure rate limiting for auth endpoints
4. **User Roles**: Implement proper role-based access control
5. **Database Backup**: Set up automated backups
6. **Monitoring**: Enable logging and monitoring

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**: Check that your VITE_SUPABASE_ANON_KEY is correct
2. **"Project not found"**: Verify your VITE_SUPABASE_URL is correct
3. **Email not sending**: Check email provider settings in Auth > Settings
4. **User not created**: Check if email confirmation is required

### Environment Variables Not Loading:

1. Make sure `.env` file is in the project root
2. Restart your development server after changing .env
3. Check that variable names start with `VITE_`

## Security Notes

- Never commit your `.env` file to version control
- Use different projects for development and production
- Regularly rotate API keys
- Monitor authentication logs for suspicious activity
- Implement proper role-based access control

## Next Steps

Once Supabase is configured:

1. Test user registration and login
2. Implement user roles and permissions
3. Connect mining data to user permissions
4. Set up database triggers for audit logging
5. Configure email notifications
