# EPA Mining Permit Alerts Cloud Function

This Cloud Function automatically sends email alerts for mining permits that are about to expire within the next 30 days.

## Features

- 🕘 **Daily Automation**: Runs every day at 9:00 AM Ghana time
- 📧 **Professional Emails**: EPA-branded HTML emails with concession details
- 🎯 **Smart Targeting**: Only sends to records with valid email addresses
- ⚡ **ArcGIS Integration**: Queries your Mining Concessions Feature Service
- 🔔 **Urgent Alerts**: Special formatting for permits expiring within 7 days
- 📊 **Detailed Logging**: Comprehensive logs for monitoring and debugging

## Setup Instructions

### 1. Prerequisites

- Google Cloud Project with billing enabled
- ArcGIS Feature Service with mining concessions data
- Gmail account with app password (or SendGrid account)

### 2. Configure Your Feature Service

Make sure your ArcGIS Feature Service has these fields:
- `permit_expiry_date` (Date/Timestamp)
- `email` (String)
- `name` (String - concession name)
- `ContactPerson` (String - optional)
- `PermitNumber` (String - optional)
- `LicenseStatus` (String - optional)

### 3. Set Up Email Authentication

#### Option A: Gmail with App Password
1. Enable 2-factor authentication on your Gmail account
2. Generate an app password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use this app password (not your regular password) in the configuration

#### Option B: SendGrid (Alternative)
1. Sign up for SendGrid
2. Generate an API key
3. Modify the SMTP configuration in `index.js`

### 4. Deploy to Google Cloud

#### Install Dependencies
```bash
cd functions
npm install
```

#### Set Environment Variables
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your actual values
# FEATURE_SERVICE_URL=https://services6.arcgis.com/your-org/arcgis/rest/services/Mining_Concessions/FeatureServer/0
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# FROM_EMAIL=mining@epa.gov.gh
# FROM_NAME=EPA Ghana - Mining Division
```

#### Deploy the Function
```bash
# Make the deploy script executable (Linux/Mac)
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

Or deploy manually:
```bash
# Create Pub/Sub topic
gcloud pubsub topics create permit-alerts-scheduler

# Deploy function
gcloud functions deploy sendPermitAlerts \
  --gen2 \
  --runtime=nodejs18 \
  --region=us-central1 \
  --source=. \
  --entry-point=sendPermitAlerts \
  --trigger-topic=permit-alerts-scheduler \
  --memory=256MB \
  --timeout=540s \
  --set-env-vars="FEATURE_SERVICE_URL=your-url,SMTP_USER=your-email,SMTP_PASS=your-password"

# Create daily scheduler
gcloud scheduler jobs create pubsub epa-permit-alerts-daily \
  --schedule="0 9 * * *" \
  --topic=permit-alerts-scheduler \
  --message-body='{"trigger":"daily-permit-check"}' \
  --time-zone="Africa/Accra" \
  --description="Daily EPA mining permit expiry alerts"
```

### 5. Test the Function

```bash
# Test locally
npm test

# Test deployed function
gcloud pubsub topics publish permit-alerts-scheduler --message='{"test":true}'
```

## Configuration Options

| Environment Variable | Description | Default |
|---------------------|-------------|---------|
| `FEATURE_SERVICE_URL` | Your ArcGIS Feature Service URL | Required |
| `SMTP_USER` | Email address for sending | Required |
| `SMTP_PASS` | Email password/app password | Required |
| `FROM_EMAIL` | From email address | Same as SMTP_USER |
| `FROM_NAME` | From name in emails | "EPA Ghana - Mining Division" |
| `ALERT_DAYS_AHEAD` | Days before expiry to send alerts | 30 |
| `EPA_LOGO_URL` | URL to EPA logo for emails | Optional |

## Email Template

The function sends professional HTML emails with:

- 🏛️ EPA Ghana branding and logo
- 📋 Complete concession details
- ⏰ Days until expiry countdown
- 🚨 Urgent styling for permits expiring within 7 days
- 📝 Clear action items for permit renewal
- 📞 Contact information for EPA Mining Division

## Monitoring

### View Logs
```bash
# View function logs
gcloud functions logs read sendPermitAlerts --limit=50

# View scheduler logs
gcloud logging read "resource.type=cloud_scheduler_job"
```

### Check Status
```bash
# Check function status
gcloud functions describe sendPermitAlerts --region=us-central1

# Check scheduler status
gcloud scheduler jobs describe epa-permit-alerts-daily
```

## Query Logic

The function queries for records where:
- `permit_expiry_date` is between today and 30 days from now
- `email` field is not null or empty
- All other records are skipped

## Rate Limiting

- 1-second delay between emails to avoid spam detection
- Suitable for hundreds of permits per day
- For larger volumes, consider batch processing

## Troubleshooting

### Common Issues

1. **SMTP Authentication Failed**
   - Ensure 2FA is enabled on Gmail
   - Use app password, not regular password
   - Check SMTP_USER and SMTP_PASS environment variables

2. **ArcGIS Query Failed**
   - Verify FEATURE_SERVICE_URL is correct
   - Check if feature service is publicly accessible
   - Ensure field names match your schema

3. **No Emails Sent**
   - Check if any permits are actually expiring
   - Verify email addresses in your data are valid
   - Check Cloud Function logs for errors

4. **Scheduler Not Running**
   - Verify time zone is correct (Africa/Accra)
   - Check scheduler job status
   - Ensure Pub/Sub topic exists

### Debug Mode

Add this to your environment variables to enable debug logging:
```bash
DEBUG=true
```

## Security Notes

- Store sensitive credentials as environment variables, never in code
- Use service accounts with minimal required permissions
- Enable Cloud Function authentication if needed
- Consider using Secret Manager for credentials

## Cost Estimation

For typical usage:
- Cloud Function: ~$0.10/month (1 execution/day)
- Cloud Scheduler: Free (up to 3 jobs)
- Pub/Sub: Minimal (~$0.01/month)
- **Total: ~$0.11/month**

## Support

For issues or questions:
1. Check the function logs
2. Verify your configuration
3. Test with a single record first
4. Contact your GIS administrator
