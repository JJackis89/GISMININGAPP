# Manual Backend Installation Guide

## Prerequisites
- Node.js installed (download from https://nodejs.org/)
- PowerShell or Command Prompt

## Installation Steps

### Option 1: Run the PowerShell Script
```powershell
# Open PowerShell as Administrator
# Navigate to your project directory
cd "C:\Users\justi\Downloads\GISMININGAPP"

# Run the installation script
.\install-backend.ps1
```

### Option 2: Manual Installation
```powershell
# Open PowerShell or Command Prompt
# Navigate to backend directory
cd "C:\Users\justi\Downloads\GISMININGAPP\backend"

# Install all dependencies at once
npm install

# OR install each package individually
npm install express
npm install pg
npm install cors
npm install nodemon --save-dev
```

### Option 3: Using VS Code Terminal
1. Open VS Code in your project directory
2. Open terminal (Ctrl + `)
3. Navigate to backend:
   ```
   cd backend
   ```
4. Install dependencies:
   ```
   npm install
   ```

## Verification
After installation, you should see:
- `node_modules/` folder in backend directory
- `package-lock.json` file created
- No error messages during installation

## Test Installation
```powershell
# Check if packages are installed
npm list

# Start the server
npm start
```

## Dependencies Being Installed
- **express**: Web framework for Node.js API
- **pg**: PostgreSQL client for database connection
- **cors**: Cross-origin resource sharing middleware
- **nodemon**: Development tool for auto-restart (dev dependency)

## Troubleshooting
- If you get permission errors, run PowerShell as Administrator
- If npm is not recognized, restart your terminal after installing Node.js
- If installation fails, try deleting `package-lock.json` and `node_modules/` then retry

## Next Steps
Once dependencies are installed:
1. Start backend: `npm start`
2. Start frontend: `npm run dev` (in main project directory)
3. Access API at: http://localhost:3001
4. Access app at: http://localhost:5173
