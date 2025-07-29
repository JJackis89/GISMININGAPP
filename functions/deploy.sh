#!/bin/bash

# Deployment script for EPA Mining Permit Alerts Cloud Function
# Make sure you have gcloud CLI installed and authenticated

# Set variables
FUNCTION_NAME="sendPermitAlerts"
REGION="us-central1"
RUNTIME="nodejs18"
MEMORY="256MB"
TIMEOUT="540s"
TOPIC_NAME="permit-alerts-scheduler"

echo "🚀 Deploying EPA Mining Permit Alerts Cloud Function..."

# Create Pub/Sub topic if it doesn't exist
echo "📡 Creating Pub/Sub topic: $TOPIC_NAME"
gcloud pubsub topics create $TOPIC_NAME --quiet || echo "Topic already exists"

# Deploy the Cloud Function
echo "☁️ Deploying Cloud Function: $FUNCTION_NAME"
gcloud functions deploy $FUNCTION_NAME \
  --gen2 \
  --runtime=$RUNTIME \
  --region=$REGION \
  --source=. \
  --entry-point=$FUNCTION_NAME \
  --trigger-topic=$TOPIC_NAME \
  --memory=$MEMORY \
  --timeout=$TIMEOUT \
  --set-env-vars="FEATURE_SERVICE_URL=$FEATURE_SERVICE_URL,SMTP_HOST=$SMTP_HOST,SMTP_PORT=$SMTP_PORT,SMTP_USER=$SMTP_USER,SMTP_PASS=$SMTP_PASS,FROM_EMAIL=$FROM_EMAIL,FROM_NAME=$FROM_NAME,ALERT_DAYS_AHEAD=$ALERT_DAYS_AHEAD,EPA_LOGO_URL=$EPA_LOGO_URL"

if [ $? -eq 0 ]; then
  echo "✅ Cloud Function deployed successfully!"
  
  # Create Cloud Scheduler job to run daily
  echo "⏰ Creating Cloud Scheduler job..."
  gcloud scheduler jobs create pubsub epa-permit-alerts-daily \
    --schedule="0 9 * * *" \
    --topic=$TOPIC_NAME \
    --message-body='{"trigger":"daily-permit-check"}' \
    --time-zone="Africa/Accra" \
    --description="Daily EPA mining permit expiry alerts" \
    --quiet || echo "Scheduler job already exists"
  
  echo "🎉 Deployment completed!"
  echo "📅 Scheduled to run daily at 9:00 AM Ghana time"
  echo "🔗 Function URL: https://$REGION-$(gcloud config get-value project).cloudfunctions.net/$FUNCTION_NAME"
else
  echo "❌ Deployment failed!"
  exit 1
fi
