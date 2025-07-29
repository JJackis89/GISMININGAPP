# PowerShell deployment script for EPA Mining Permit Alerts Cloud Function
# Run with: .\deploy.ps1

param(
    [string]$ProjectId = $env:GOOGLE_CLOUD_PROJECT,
    [string]$Region = "us-central1"
)

Write-Host "🚀 Deploying EPA Mining Permit Alerts Cloud Function..." -ForegroundColor Green

# Check if gcloud is installed
try {
    $gcloudVersion = gcloud version --quiet
    Write-Host "✅ Google Cloud CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Google Cloud CLI not found. Please install it first." -ForegroundColor Red
    Write-Host "Download from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found. Please run setup first:" -ForegroundColor Red
    Write-Host "   node setup.js" -ForegroundColor Yellow
    exit 1
}

# Load environment variables from .env file
Write-Host "📖 Loading configuration from .env file..." -ForegroundColor Cyan
$envVars = @{}
Get-Content ".env" | ForEach-Object {
    if ($_ -match "^([^=]+)=(.*)$") {
        $envVars[$matches[1]] = $matches[2]
    }
}

# Validate required variables
$requiredVars = @("FEATURE_SERVICE_URL", "SMTP_USER", "SMTP_PASS")
foreach ($var in $requiredVars) {
    if (-not $envVars.ContainsKey($var) -or [string]::IsNullOrEmpty($envVars[$var])) {
        Write-Host "❌ Required environment variable missing: $var" -ForegroundColor Red
        exit 1
    }
}

# Set variables
$FunctionName = "sendPermitAlerts"
$Runtime = "nodejs18"
$Memory = "256MB"
$Timeout = "540s"
$TopicName = "permit-alerts-scheduler"

Write-Host "📊 Configuration:" -ForegroundColor Cyan
Write-Host "  Function: $FunctionName" -ForegroundColor White
Write-Host "  Region: $Region" -ForegroundColor White
Write-Host "  Runtime: $Runtime" -ForegroundColor White
Write-Host "  Topic: $TopicName" -ForegroundColor White

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ npm install failed" -ForegroundColor Red
    exit 1
}

# Create Pub/Sub topic if it doesn't exist
Write-Host "📡 Creating Pub/Sub topic: $TopicName" -ForegroundColor Cyan
gcloud pubsub topics create $TopicName --quiet 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Pub/Sub topic created" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Pub/Sub topic already exists" -ForegroundColor Yellow
}

# Build environment variables string for gcloud
$envVarString = ($envVars.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ","

# Deploy the Cloud Function
Write-Host "☁️ Deploying Cloud Function: $FunctionName" -ForegroundColor Cyan
Write-Host "⏳ This may take a few minutes..." -ForegroundColor Yellow

$deployCmd = @(
    "gcloud", "functions", "deploy", $FunctionName,
    "--gen2",
    "--runtime=$Runtime",
    "--region=$Region",
    "--source=.",
    "--entry-point=$FunctionName",
    "--trigger-topic=$TopicName",
    "--memory=$Memory",
    "--timeout=$Timeout",
    "--set-env-vars=$envVarString",
    "--quiet"
)

& $deployCmd[0] $deployCmd[1..($deployCmd.Length-1)]

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cloud Function deployed successfully!" -ForegroundColor Green
    
    # Create Cloud Scheduler job to run daily
    Write-Host "⏰ Creating Cloud Scheduler job..." -ForegroundColor Cyan
    
    $schedulerCmd = @(
        "gcloud", "scheduler", "jobs", "create", "pubsub", "epa-permit-alerts-daily",
        "--schedule=0 9 * * *",
        "--topic=$TopicName",
        "--message-body={`"trigger`":`"daily-permit-check`"}",
        "--time-zone=Africa/Accra",
        "--description=Daily EPA mining permit expiry alerts",
        "--quiet"
    )
    
    & $schedulerCmd[0] $schedulerCmd[1..($schedulerCmd.Length-1)] 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Scheduler job created" -ForegroundColor Green
    } else {
        Write-Host "ℹ️ Scheduler job already exists" -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green -BackgroundColor Black
    Write-Host "📅 Scheduled to run daily at 9:00 AM Ghana time" -ForegroundColor Cyan
    Write-Host "🔗 Function URL: https://$Region-$(gcloud config get-value project --quiet).cloudfunctions.net/$FunctionName" -ForegroundColor Cyan
    
    Write-Host ""
    Write-Host "📋 Next Steps:" -ForegroundColor Yellow
    Write-Host "1. Test the function: gcloud pubsub topics publish $TopicName --message='{`"test`":true}'" -ForegroundColor White
    Write-Host "2. View logs: gcloud functions logs read $FunctionName --region=$Region --limit=50" -ForegroundColor White
    Write-Host "3. Monitor scheduler: gcloud scheduler jobs describe epa-permit-alerts-daily" -ForegroundColor White
    
} else {
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "💡 Troubleshooting tips:" -ForegroundColor Yellow
    Write-Host "1. Check your gcloud authentication: gcloud auth list" -ForegroundColor White
    Write-Host "2. Verify project ID: gcloud config get-value project" -ForegroundColor White
    Write-Host "3. Enable required APIs: gcloud services enable cloudfunctions.googleapis.com cloudscheduler.googleapis.com pubsub.googleapis.com" -ForegroundColor White
    exit 1
}
