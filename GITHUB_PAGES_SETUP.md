# GitHub Pages Deployment Guide

## 📋 Prerequisites

1. **GitHub Account**: Create account at [github.com](https://github.com)
2. **Git Installed**: Download from [git-scm.com](https://git-scm.com/)
3. **Node.js**: Version 18+ from [nodejs.org](https://nodejs.org/)

## 🚀 Step-by-Step Deployment

### Step 1: Create GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click "New repository" (green button)
3. Repository name: `GISMININGAPP` (or your preferred name)
4. Make it **Public** (required for free GitHub Pages)
5. ✅ Check "Add a README file"
6. Click "Create repository"

### Step 2: Configure Repository for GitHub Pages

1. In your new repository, go to **Settings** tab
2. Scroll down to **Pages** section (left sidebar)
3. Source: Select "**Deploy from a branch**"
4. Branch: Will show `gh-pages` after first deployment
5. Click **Save**

### Step 3: Add Supabase Secrets

1. In repository Settings, go to **Secrets and variables** → **Actions**
2. Click "**New repository secret**"
3. Add these secrets:
   - Name: `VITE_SUPABASE_URL`
     Value: `https://iyxffzusjqehxkfbksev.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key)

### Step 4: Upload Your Code

#### Option A: Using GitHub Website (Easiest)
1. Download your project as ZIP file
2. Extract all files
3. In your GitHub repository, click "**uploading an existing file**"
4. Drag and drop ALL files from your project
5. Scroll down, add commit message: "Initial EPA Mining Dashboard"
6. Click "**Commit changes**"

#### Option B: Using Git Commands
1. Open Command Prompt in your project folder
2. Run these commands:
```bash
git init
git add .
git commit -m "Initial EPA Mining Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/GISMININGAPP.git
git push -u origin main
```

### Step 5: Wait for Deployment

1. Go to your repository **Actions** tab
2. You'll see "Deploy EPA Mining Dashboard to GitHub Pages" running
3. Wait for green checkmark (usually 2-3 minutes)
4. If red X appears, click on it to see error details

### Step 6: Access Your Live App

Your app will be available at:
**https://YOUR_USERNAME.github.io/GISMININGAPP/**

Example: `https://johndoe.github.io/GISMININGAPP/`

## 🔧 Important Configuration Notes

### Update Repository Name
If you use a different repository name, update `vite.config.ts`:
```typescript
base: '/YOUR_REPO_NAME/',  // Change this line
```

### Custom Domain (Optional)
1. In repository Settings → Pages
2. Add your custom domain
3. Enable "Enforce HTTPS"

## 🐛 Troubleshooting

### Deployment Fails
- Check **Actions** tab for error details
- Ensure secrets are added correctly
- Verify repository is public

### App Shows Blank Page
- Check browser console for errors
- Verify `base` path in `vite.config.ts` matches repository name
- Ensure all files were uploaded properly

### Supabase Not Working
- Verify secrets are added to repository
- Check Supabase dashboard for any issues
- Ensure URLs don't have trailing slashes

## 📱 Testing Your Deployment

1. Open your GitHub Pages URL
2. Try creating a new account
3. Test login functionality
4. Verify map loads with mining data
5. Check all navigation links work

## 🔄 Making Updates

After initial deployment, any push to `main` branch will automatically redeploy:

1. Make changes to your code
2. Push to GitHub (or upload files via website)
3. GitHub Actions will automatically build and deploy
4. Changes appear in 2-3 minutes

## 📞 Support

- **GitHub Issues**: Use repository issues for technical problems
- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **GitHub Pages Docs**: [docs.github.com/pages](https://docs.github.com/pages)

---

**Environmental Protection Authority of Ghana**  
*Your EPA Mining Dashboard will be live on the internet!* 🌍
