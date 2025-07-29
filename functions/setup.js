#!/usr/bin/env node

/**
 * Interactive setup script for EPA Mining Permit Alerts
 * Run with: node setup.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setup() {
  console.log('🏛️ EPA Mining Permit Alerts - Setup Configuration');
  console.log('=' .repeat(60));
  console.log('This script will help you configure the Cloud Function for permit expiry alerts.\n');

  try {
    // Collect configuration
    const config = {};

    console.log('📡 ArcGIS Feature Service Configuration');
    console.log('-' .repeat(40));
    config.FEATURE_SERVICE_URL = await question('Enter your Mining Concessions Feature Service URL: ');

    console.log('\n📧 Email Configuration');
    console.log('-' .repeat(40));
    config.SMTP_USER = await question('Enter your Gmail address: ');
    config.SMTP_PASS = await question('Enter your Gmail app password: ');
    config.FROM_EMAIL = await question(`From email (press Enter for ${config.SMTP_USER}): `) || config.SMTP_USER;
    config.FROM_NAME = await question('From name (press Enter for "EPA Ghana - Mining Division"): ') || 'EPA Ghana - Mining Division';

    console.log('\n⚙️ Alert Configuration');
    console.log('-' .repeat(40));
    const alertDays = await question('Days ahead to send alerts (press Enter for 30): ');
    config.ALERT_DAYS_AHEAD = alertDays || '30';

    console.log('\n🎨 Branding');
    console.log('-' .repeat(40));
    config.EPA_LOGO_URL = await question('EPA logo URL (optional, press Enter to skip): ') || '';

    // Write .env file
    const envContent = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync('.env', envContent);

    console.log('\n✅ Configuration saved to .env file');
    console.log('\n📋 Configuration Summary:');
    console.log('-' .repeat(40));
    console.log(`Feature Service: ${config.FEATURE_SERVICE_URL}`);
    console.log(`Email: ${config.SMTP_USER}`);
    console.log(`From: ${config.FROM_NAME} <${config.FROM_EMAIL}>`);
    console.log(`Alert Days: ${config.ALERT_DAYS_AHEAD}`);

    console.log('\n🚀 Next Steps:');
    console.log('1. Run: npm install');
    console.log('2. Test: npm test');
    console.log('3. Deploy: ./deploy.sh (or follow manual deployment steps in README)');

    // Generate deployment command
    const envVars = Object.entries(config)
      .map(([key, value]) => `${key}=${value}`)
      .join(',');

    console.log('\n📋 Manual Deployment Command:');
    console.log(`gcloud functions deploy sendPermitAlerts --gen2 --runtime=nodejs18 --region=us-central1 --source=. --entry-point=sendPermitAlerts --trigger-topic=permit-alerts-scheduler --memory=256MB --timeout=540s --set-env-vars="${envVars}"`);

    console.log('\n🎉 Setup completed successfully!');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  setup();
}

module.exports = { setup };
