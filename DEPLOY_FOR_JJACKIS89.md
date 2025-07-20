# Quick Deployment Guide for JJackis89

## Your GitHub Repository Details
- **Username**: JJackis89
- **Repository**: GISMININGAPP
- **Live URL**: https://JJackis89.github.io/GISMININGAPP/

## Step 1: Create GitHub Repository

1. Go to https://github.com/JJackis89
2. Click "New" repository (green button)
3. Repository name: `GISMININGAPP`
4. Make it **Public**
5. ✅ Check "Add a README file"
6. Click "Create repository"

## Step 2: Upload Your Code

### Easy Method (GitHub Website):
1. In your new repository, click "uploading an existing file"
2. Upload ALL files from your GISMININGAPP folder
3. Commit message: "Initial EPA Mining Dashboard"
4. Click "Commit changes"

### Command Line Method:
```bash
cd "c:\Users\justi\Downloads\GISMININGAPP"
git init
git add .
git commit -m "Initial EPA Mining Dashboard"
git branch -M main
git remote add origin https://github.com/JJackis89/GISMININGAPP.git
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to repository **Settings** tab
2. Click **Pages** in left sidebar
3. Source: "Deploy from a branch"
4. Branch: select **gh-pages** (will appear after first deployment)
5. Click **Save**

## Step 4: Add Supabase Secrets

1. In Settings, go to **Secrets and variables** → **Actions**
2. Click "New repository secret"
3. Add these two secrets:

**Secret 1:**
- Name: `VITE_SUPABASE_URL`
- Value: `https://iyxffzusjqehxkfbksev.supabase.co`

**Secret 2:**
- Name: `VITE_SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5eGZmenVzanFlaHhrZmJrc2V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3MDY5MzQsImV4cCI6MjA2ODI4MjkzNH0.dVdkR9St5_ev1kMFE5xkaovw70sHPVFa0LS88MCunmc`

## Step 5: Deploy

1. Go to **Actions** tab in your repository
2. You'll see "Deploy EPA Mining Dashboard to GitHub Pages" workflow
3. It will run automatically after uploading files
4. Wait for green checkmark (2-3 minutes)

## Step 6: Access Your Live App

Your EPA Mining Dashboard will be live at:
**https://JJackis89.github.io/GISMININGAPP/**

## Troubleshooting

If the build fails:
1. Check the Actions tab for error details
2. Ensure all files were uploaded correctly
3. Verify secrets are added properly

## Next Steps

- Test your live application
- Share the URL with EPA staff
- Make updates by pushing to the main branch

Your professional EPA Mining Dashboard will be live on the internet! 🌍
