# Firebase Authentication Setup Guide

This guide will help you set up Firebase Authentication for the EPA Mining Concessions Dashboard.

## Your Firebase Project Details

- **Email**: gismining025@gmail.com
- **Project ID**: mining-login
- **Project URL**: https://console.firebase.google.com/project/mining-login

## Step 1: Access Your Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Sign in with your account: **gismining025@gmail.com**
3. Select your project: **mining-login**
   - If the project doesn't exist, create it with the name "mining-login"

## Step 2: Enable Authentication

1. In your Firebase project console, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Click on "Email/Password"
5. Toggle "Enable" to ON
6. Click "Save"

## Step 3: Get Your Firebase Configuration

1. In your **mining-login** project console, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you don't have a web app yet:
   - Click on the web icon (`</>`) to add a web app
   - Enter app nickname: `EPA Mining Dashboard`
   - Check "Also set up Firebase Hosting" (optional)
   - Click "Register app"
5. Copy the Firebase configuration object from the SDK setup

## Step 4: Configure Environment Variables

Create a `.env.local` file in your project root with your Firebase configuration:

```env
# Firebase Configuration for mining-login project
VITE_FIREBASE_API_KEY=your_actual_api_key_from_firebase
VITE_FIREBASE_AUTH_DOMAIN=mining-login.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mining-login
VITE_FIREBASE_STORAGE_BUCKET=mining-login.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_actual_sender_id
VITE_FIREBASE_APP_ID=your_actual_app_id
```

**Important**: Replace the placeholder values with your actual Firebase configuration values from the Firebase Console.

## Step 5: Create Test Users (Optional)

You can create test users in the Firebase Console:

1. Go to Authentication > Users
2. Click "Add user"
3. Enter email and password
4. Click "Add user"

## Step 6: Test the Application

1. Start the development server: `npm run dev`
2. Open http://localhost:5173
3. Try logging in with your test credentials

## Authentication Features

The application supports:

- ✅ **Email/Password Sign In**: Secure authentication with Firebase
- ✅ **User Registration**: New users can create accounts
- ✅ **Password Reset**: Users can reset forgotten passwords
- ✅ **Session Management**: Persistent login sessions
- ✅ **Role-based Access**: Admin, Staff, and Guest roles
- ✅ **Local Demo Mode**: Fallback when Firebase is not configured

## User Roles

The application assigns roles based on email domains:

- **Admin**: `admin@epa.gov.gh`, `administrator@*`
- **Staff**: `staff@epa.gov.gh`, `*.staff@*`, `worker@*`
- **Guest**: All other users

## Fallback Mode

If Firebase is not configured (missing environment variables), the application automatically falls back to local demo mode with these test accounts:

- **Admin**: `admin@epa.gov.gh` / `admin123`
- **Staff**: `staff@epa.gov.gh` / `staff123`
- **Guest**: `guest@example.com` / `guest123`

## Security Notes

- Never commit your `.env.local` file to version control
- Use Firebase Security Rules to protect your data
- Consider enabling multi-factor authentication for production
- Regular audit user access and permissions

## Troubleshooting

### Common Issues:

1. **"Firebase configuration missing"**: Check your environment variables
2. **"Auth domain not authorized"**: Add your domain to Firebase Console > Authentication > Settings > Authorized domains
3. **"Network error"**: Check your internet connection and Firebase project status
4. **"User not found"**: Ensure the user exists in Firebase Authentication

### Getting Help:

- Check the browser console for detailed error messages
- Verify your Firebase configuration
- Ensure all environment variables are set correctly
- Test with the local demo mode first

## Production Deployment

For production deployment:

1. Set up your environment variables in your hosting platform
2. Configure Firebase Security Rules
3. Set up proper domain authorization in Firebase
4. Enable additional security features as needed

The application is now ready to use with Firebase Authentication!
