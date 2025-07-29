# Quick Start Guide - EPA Mining Permit Alerts

## 🚀 5-Minute Setup

### 1. Prerequisites Check
- [ ] Google Cloud account with billing enabled
- [ ] Gmail account with 2FA enabled
- [ ] ArcGIS Feature Service with mining concessions data
- [ ] Node.js 18+ installed
- [ ] Google Cloud CLI installed

### 2. Gmail App Password Setup
1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable 2-Factor Authentication
3. Generate App Password: [App Passwords](https://myaccount.google.com/apppasswords)
4. Select "Mail" and generate password
5. **Save this password - you'll need it in step 4**

### 3. Install Dependencies
```bash
cd functions
npm install
```

### 4. Configuration
```bash
# Run interactive setup
npm run setup
```

Enter when prompted:
- **Feature Service URL**: Your ArcGIS Mining Concessions service URL
- **Gmail Address**: your-email@gmail.com
- **App Password**: The 16-character password from step 2
- **From Email**: mining@epa.gov.gh (or your preferred sender)
- **From Name**: EPA Ghana - Mining Division
- **Alert Days**: 30 (days before expiry to send alerts)

### 5. Test Locally
```bash
npm test
```

### 6. Deploy to Google Cloud
```bash
# Windows
npm run deploy-win

# Linux/Mac
./deploy.sh
```

### 7. Verify Deployment
```bash
# Check function status
gcloud functions describe sendPermitAlerts --region=us-central1

# Test manually
gcloud pubsub topics publish permit-alerts-scheduler --message='{"test":true}'

# View logs
npm run logs
```

## 📋 Data Requirements

Your ArcGIS Feature Service must have these fields:

| Field Name | Type | Required | Description |
|------------|------|----------|-------------|
| `permit_expiry_date` | Date/Timestamp | ✅ | When permit expires |
| `email` | String | ✅ | Contact email address |
| `name` | String | ✅ | Concession name |
| `ContactPerson` | String | ⚪ | Contact person name |
| `PermitNumber` | String | ⚪ | Permit reference number |
| `LicenseStatus` | String | ⚪ | Current permit status |

## ⏰ Schedule

The function runs automatically every day at **9:00 AM Ghana time** and:
1. Queries permits expiring in the next 30 days
2. Sends professional email alerts
3. Logs all activities for monitoring

## 📧 Email Preview

Recipients receive professional HTML emails with:
- EPA Ghana branding and logo
- Concession details and expiry date
- Urgent styling for permits expiring within 7 days
- Clear action items for renewal
- Contact information

## 🔍 Troubleshooting

### Function not deploying?
```bash
# Check authentication
gcloud auth list

# Set project
gcloud config set project YOUR-PROJECT-ID

# Enable APIs
gcloud services enable cloudfunctions.googleapis.com cloudscheduler.googleapis.com pubsub.googleapis.com
```

### Emails not sending?
1. Verify Gmail app password (not regular password)
2. Check function logs: `npm run logs`
3. Test with single record first

### No permits found?
1. Verify Feature Service URL is accessible
2. Check field names match your data schema
3. Ensure dates are in correct format

## 💰 Cost Estimate

- **Cloud Function**: ~$0.10/month (1 execution/day)
- **Cloud Scheduler**: Free (up to 3 jobs)
- **Pub/Sub**: ~$0.01/month
- **Total**: ~$0.11/month

## 📞 Support

Need help? Check:
1. Function logs: `gcloud functions logs read sendPermitAlerts --limit=50`
2. Scheduler status: `gcloud scheduler jobs describe epa-permit-alerts-daily`
3. Test configuration: `npm test`

---

🎉 **You're all set!** Your EPA Mining Permit Alert system is now running automatically.
