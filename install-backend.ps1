# Backend Dependencies Installation Script
# Run this in PowerShell as Administrator

Write-Host "🚀 Installing Backend Dependencies for PostgreSQL API" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow

# Navigate to backend directory
$backendPath = "C:\Users\justi\Downloads\GISMININGAPP\backend"
Set-Location $backendPath
Write-Host "📍 Current directory: $(Get-Location)" -ForegroundColor Cyan

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js first." -ForegroundColor Red
    Write-Host "Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not available" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`n📦 Installing backend dependencies..." -ForegroundColor Yellow

# Install main dependencies
Write-Host "Installing express..." -ForegroundColor Cyan
npm install express

Write-Host "Installing pg (PostgreSQL client)..." -ForegroundColor Cyan
npm install pg

Write-Host "Installing cors..." -ForegroundColor Cyan
npm install cors

# Install development dependencies
Write-Host "Installing nodemon (dev dependency)..." -ForegroundColor Cyan
npm install nodemon --save-dev

# Verify installation
Write-Host "`n🔍 Verifying installation..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ node_modules directory created" -ForegroundColor Green
} else {
    Write-Host "❌ node_modules directory not found" -ForegroundColor Red
}

if (Test-Path "package-lock.json") {
    Write-Host "✅ package-lock.json created" -ForegroundColor Green
} else {
    Write-Host "❌ package-lock.json not found" -ForegroundColor Red
}

# List installed packages
Write-Host "`n📋 Installed packages:" -ForegroundColor Yellow
npm list --depth=0

Write-Host "`n🎉 Backend installation complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Yellow
Write-Host "To start the backend server:" -ForegroundColor Cyan
Write-Host "  npm start" -ForegroundColor White
Write-Host "`nFor development with auto-restart:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host "`nServer will run on: http://localhost:3001" -ForegroundColor Yellow
