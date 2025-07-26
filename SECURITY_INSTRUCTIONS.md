# 🚨 CRITICAL SECURITY STEPS - COMPLETE IMMEDIATELY

## Your Firebase API key was exposed in GitHub and must be regenerated!

### Step 1: Regenerate Firebase Configuration
1. **Go to Firebase Console**: https://console.firebase.google.com/project/mining-login/settings/general
2. **Scroll to "Your apps"** section
3. **Click the settings/config icon** ⚙️ for your web app
4. **Delete the current app** (this invalidates the exposed keys)
5. **Create a new web app**:
   - App nickname: "EPA Mining Dashboard"
   - ✅ Check "Also set up Firebase Hosting"
   - Click "Register app"
6. **Copy the new config** object that appears

### Step 2: Update Local Environment File
Replace the content in `.env.local` with your NEW Firebase config:

```bash
# NEW Firebase Configuration (regenerated for security)
VITE_FIREBASE_API_KEY=your_new_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=mining-login.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mining-login
VITE_FIREBASE_STORAGE_BUCKET=mining-login.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=736251542602
VITE_FIREBASE_APP_ID=your_new_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=G-9HMEX4HJJR
```

### Step 3: Update Vercel Environment Variables
1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Find your project** (GISMININGAPP)
3. **Go to Settings** → **Environment Variables**
4. **Update** `VITE_FIREBASE_API_KEY` with your NEW key
5. **Redeploy** your application

### Step 4: Verify Security
1. **Test your app locally**: `npm run dev`
2. **Test user registration** with new Firebase config
3. **Deploy to Vercel** and test live app
4. **Check GitHub Security tab** - alert should resolve in 24-48 hours

## ⚠️ IMPORTANT SECURITY NOTES:
- The old API key `AIzaSyCLg2ND14wPDzjjVGUko2vvhbJGosp4gxQ` is COMPROMISED
- Anyone with this key could potentially access your Firebase project
- Complete these steps IMMEDIATELY to secure your application
- Never commit API keys to git repositories again

## ✅ After completing these steps:
- Your GitHub security alert will resolve
- Your app will work with new secure credentials
- Your Firebase project will be protected

**COMPLETE THESE STEPS NOW!**
