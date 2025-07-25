# Quick Setup for mining-login Firebase Project

## Your Project Information
- **Firebase Account**: gismining025@gmail.com
- **Project ID**: mining-login
- **Project Console**: https://console.firebase.google.com/project/mining-login

## Step 1: Access Your Project
1. Go to https://console.firebase.google.com/project/mining-login
2. Sign in with gismining025@gmail.com

## Step 2: Enable Authentication (if not already done)
1. In the left sidebar, click "Authentication"
2. Click "Get started" if it's your first time
3. Go to "Sign-in method" tab
4. Click "Email/Password"
5. Toggle "Enable" to ON
6. Click "Save"

## Step 3: Get Your Web App Configuration
1. Click the gear icon ⚙️ next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. If you see a web app already configured, click on it
5. If no web app exists, click the `</>` icon to create one:
   - App nickname: "EPA Mining Dashboard"
   - Click "Register app"
6. Copy the firebaseConfig object

## Step 4: Create .env.local File
Create a file named `.env.local` in your project root with this content:

```env
# Replace these values with your actual Firebase config values
VITE_FIREBASE_API_KEY=AIza...your_api_key
VITE_FIREBASE_AUTH_DOMAIN=mining-login.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mining-login
VITE_FIREBASE_STORAGE_BUCKET=mining-login.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123...your_sender_id
VITE_FIREBASE_APP_ID=1:123...your_app_id
```

## Step 5: Test the Connection
1. Restart your development server: `npm run dev`
2. Open http://localhost:5173
3. Try to register a new user with your email
4. Check the Firebase Console > Authentication > Users to see if the user was created

## Troubleshooting

### If you see "Firebase configuration missing":
- Check that your `.env.local` file exists in the project root
- Verify all environment variables are set correctly
- Restart the development server

### If authentication fails:
- Verify Email/Password is enabled in Firebase Console
- Check browser console for detailed error messages
- Ensure your domain is authorized in Firebase Console > Authentication > Settings > Authorized domains

### Expected Behavior:
- **With .env.local configured**: Login uses Firebase Authentication
- **Without .env.local**: Automatically falls back to local demo mode

The application is pre-configured to work with your **mining-login** project!
