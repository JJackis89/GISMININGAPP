const functions = require('@google-cloud/functions-framework');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const { addDays, format, parseISO } = require('date-fns');

// Configuration - Set these environment variables in Google Cloud Functions
const CONFIG = {
  // ArcGIS Feature Service URL (replace with your actual service URL)
  FEATURE_SERVICE_URL: process.env.FEATURE_SERVICE_URL || 
    'https://services6.arcgis.com/Av3KhOzUMUMSORVt/arcgis/rest/services/Mining_Concessions/FeatureServer/0',
  
  // Email configuration
  SMTP_HOST: process.env.SMTP_HOST || 'smtp.gmail.com',
  SMTP_PORT: process.env.SMTP_PORT || 587,
  SMTP_USER: process.env.SMTP_USER, // Your Gmail address
  SMTP_PASS: process.env.SMTP_PASS, // Your Gmail app password
  FROM_EMAIL: process.env.FROM_EMAIL || process.env.SMTP_USER,
  FROM_NAME: process.env.FROM_NAME || 'EPA Ghana - Mining Division',
  
  // Alert settings
  ALERT_DAYS_AHEAD: parseInt(process.env.ALERT_DAYS_AHEAD) || 30,
  
  // EPA Logo and branding
  EPA_LOGO_URL: process.env.EPA_LOGO_URL || 'https://your-domain.com/epa-logo.png'
};

/**
 * Cloud Function to send permit expiry alerts
 * Triggered by Cloud Scheduler (Pub/Sub topic)
 */
functions.cloudEvent('sendPermitAlerts', async (cloudEvent) => {
  console.log('🚀 Starting permit expiry alert process...');
  console.log('📅 Current time:', new Date().toISOString());
  
  try {
    // Step 1: Query ArcGIS Feature Service for expiring permits
    const expiringPermits = await queryExpiringPermits();
    console.log(`📋 Found ${expiringPermits.length} permits expiring within ${CONFIG.ALERT_DAYS_AHEAD} days`);
    
    if (expiringPermits.length === 0) {
      console.log('✅ No expiring permits found. Process completed.');
      return { status: 'success', message: 'No expiring permits found', count: 0 };
    }
    
    // Step 2: Send email alerts
    const emailResults = await sendEmailAlerts(expiringPermits);
    
    // Step 3: Log results
    const successCount = emailResults.filter(r => r.success).length;
    const failureCount = emailResults.filter(r => !r.success).length;
    
    console.log(`📧 Email alerts completed:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${failureCount}`);
    
    // Log failures for debugging
    emailResults.filter(r => !r.success).forEach(result => {
      console.error(`❌ Failed to send email to ${result.email}: ${result.error}`);
    });
    
    return {
      status: 'success',
      message: `Processed ${expiringPermits.length} expiring permits`,
      emailsSent: successCount,
      emailsFailed: failureCount,
      results: emailResults
    };
    
  } catch (error) {
    console.error('❌ Error in permit alert process:', error);
    throw error;
  }
});

/**
 * Query ArcGIS Feature Service for permits expiring within the alert window
 */
async function queryExpiringPermits() {
  console.log('🔍 Querying ArcGIS Feature Service for expiring permits...');
  
  const today = new Date();
  const alertDate = addDays(today, CONFIG.ALERT_DAYS_AHEAD);
  
  // Format dates for ArcGIS query (timestamp in milliseconds)
  const todayTimestamp = today.getTime();
  const alertTimestamp = alertDate.getTime();
  
  console.log(`📅 Alert window: ${format(today, 'yyyy-MM-dd')} to ${format(alertDate, 'yyyy-MM-dd')}`);
  
  // Build ArcGIS REST query
  const queryParams = new URLSearchParams({
    where: `permit_expiry_date >= ${todayTimestamp} AND permit_expiry_date <= ${alertTimestamp} AND email IS NOT NULL AND email <> ''`,
    outFields: 'name,email,permit_expiry_date,ContactPerson,PermitNumber,LicenseStatus',
    returnGeometry: 'false',
    f: 'json'
  });
  
  const queryUrl = `${CONFIG.FEATURE_SERVICE_URL}/query?${queryParams}`;
  console.log('🌐 Query URL:', queryUrl);
  
  try {
    const response = await fetch(queryUrl);
    const data = await response.json();
    
    if (!response.ok || data.error) {
      throw new Error(`ArcGIS query failed: ${data.error?.message || response.statusText}`);
    }
    
    console.log(`📊 ArcGIS query returned ${data.features?.length || 0} features`);
    
    if (!data.features || data.features.length === 0) {
      return [];
    }
    
    // Process and validate the results
    const permits = data.features
      .map(feature => ({
        name: feature.attributes.name || feature.attributes.Name || 'Unknown Concession',
        email: feature.attributes.email || feature.attributes.Email,
        permitExpiryDate: new Date(feature.attributes.permit_expiry_date || feature.attributes.permit_expiry_date),
        contactPerson: feature.attributes.ContactPerson || feature.attributes.contact_person || 'Unknown',
        permitNumber: feature.attributes.PermitNumber || feature.attributes.permit_number || 'Unknown',
        licenseStatus: feature.attributes.LicenseStatus || feature.attributes.license_status || 'Unknown'
      }))
      .filter(permit => {
        // Validate email and date
        const hasValidEmail = permit.email && permit.email.includes('@');
        const hasValidDate = permit.permitExpiryDate && !isNaN(permit.permitExpiryDate.getTime());
        
        if (!hasValidEmail) {
          console.warn(`⚠️ Skipping permit ${permit.name}: Invalid or missing email`);
        }
        if (!hasValidDate) {
          console.warn(`⚠️ Skipping permit ${permit.name}: Invalid or missing expiry date`);
        }
        
        return hasValidEmail && hasValidDate;
      });
    
    console.log(`✅ Processed ${permits.length} valid permits for alerts`);
    return permits;
    
  } catch (error) {
    console.error('❌ Error querying ArcGIS Feature Service:', error);
    throw new Error(`Failed to query permits: ${error.message}`);
  }
}

/**
 * Send email alerts to all expiring permits
 */
async function sendEmailAlerts(permits) {
  console.log(`📧 Starting to send ${permits.length} email alerts...`);
  
  // Create nodemailer transporter
  const transporter = nodemailer.createTransporter({
    host: CONFIG.SMTP_HOST,
    port: CONFIG.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: CONFIG.SMTP_USER,
      pass: CONFIG.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // Verify SMTP connection
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified');
  } catch (error) {
    console.error('❌ SMTP connection failed:', error);
    throw new Error(`SMTP configuration error: ${error.message}`);
  }
  
  // Send emails (with rate limiting to avoid hitting email service limits)
  const results = [];
  
  for (let i = 0; i < permits.length; i++) {
    const permit = permits[i];
    console.log(`📤 Sending email ${i + 1}/${permits.length} to ${permit.email} for ${permit.name}`);
    
    try {
      const emailResult = await sendSingleEmail(transporter, permit);
      results.push({
        email: permit.email,
        concessionName: permit.name,
        success: true,
        messageId: emailResult.messageId
      });
      
      console.log(`✅ Email sent successfully to ${permit.email}`);
      
    } catch (error) {
      console.error(`❌ Failed to send email to ${permit.email}:`, error);
      results.push({
        email: permit.email,
        concessionName: permit.name,
        success: false,
        error: error.message
      });
    }
    
    // Rate limiting: wait 1 second between emails to avoid spam detection
    if (i < permits.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

/**
 * Send a single email alert
 */
async function sendSingleEmail(transporter, permit) {
  const expiryDateFormatted = format(permit.permitExpiryDate, 'MMMM do, yyyy');
  const daysUntilExpiry = Math.ceil((permit.permitExpiryDate - new Date()) / (1000 * 60 * 60 * 24));
  
  const subject = `⏳ Permit Expiry Reminder – Concession ${permit.name}`;
  
  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background-color: #1e7e34; color: white; padding: 20px; text-align: center; }
        .header img { max-width: 80px; margin-bottom: 10px; }
        .content { padding: 30px; background-color: #f8f9fa; }
        .alert-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
        .details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .footer { background-color: #1e7e34; color: white; padding: 20px; text-align: center; font-size: 12px; }
        .urgent { color: #dc3545; font-weight: bold; }
        .warning { color: #ffc107; font-weight: bold; }
        .action-button { background-color: #1e7e34; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="${CONFIG.EPA_LOGO_URL}" alt="EPA Ghana Logo" style="max-width: 80px;">
        <h1>Environmental Protection Authority</h1>
        <p>Republic of Ghana • Mining Division</p>
      </div>
      
      <div class="content">
        <h2>⏳ Permit Expiry Reminder</h2>
        
        <div class="alert-box">
          <h3 class="${daysUntilExpiry <= 7 ? 'urgent' : 'warning'}">
            ${daysUntilExpiry <= 7 ? '🚨 URGENT' : '⚠️ WARNING'}: Your mining permit expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}
          </h3>
        </div>
        
        <div class="details">
          <h3>📋 Concession Details</h3>
          <p><strong>Concession Name:</strong> ${permit.name}</p>
          <p><strong>Permit Number:</strong> ${permit.permitNumber}</p>
          <p><strong>Current Status:</strong> ${permit.licenseStatus}</p>
          <p><strong>Contact Person:</strong> ${permit.contactPerson}</p>
          <p><strong>Expiry Date:</strong> <span class="${daysUntilExpiry <= 7 ? 'urgent' : 'warning'}">${expiryDateFormatted}</span></p>
        </div>
        
        <div class="details">
          <h3>📝 Required Action</h3>
          <p>Your permit for concession <strong>${permit.name}</strong> will expire on <strong>${expiryDateFormatted}</strong>.</p>
          
          <p><strong>Please take immediate action to:</strong></p>
          <ul>
            <li>🔄 Submit permit renewal application if you wish to continue operations</li>
            <li>📄 Complete all required documentation and compliance reports</li>
            <li>💰 Pay all outstanding fees and penalties</li>
            <li>🏭 Or properly close out operations if not renewing</li>
          </ul>
          
          <p><strong>⚠️ Important:</strong> Operations must cease immediately upon permit expiry if not renewed.</p>
          
          <a href="mailto:mining@epa.gov.gh" class="action-button">📧 Contact EPA Mining Division</a>
        </div>
        
        ${daysUntilExpiry <= 7 ? `
        <div style="background-color: #f8d7da; border-left: 4px solid #dc3545; padding: 15px; margin: 20px 0;">
          <h3 style="color: #721c24; margin-top: 0;">🚨 FINAL NOTICE</h3>
          <p style="color: #721c24; margin-bottom: 0;">This is a final reminder. Your permit expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}. Immediate action is required to avoid suspension of operations.</p>
        </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <p><strong>Environmental Protection Authority</strong></p>
        <p>Mining Division • Republic of Ghana</p>
        <p>📧 mining@epa.gov.gh | 📞 +233 XX XXX XXXX</p>
        <p style="margin-top: 10px; font-size: 10px;">
          This is an automated message from the EPA Mining Concessions Management System.<br>
          Generated on ${format(new Date(), 'MMMM do, yyyy \'at\' h:mm a')}
        </p>
      </div>
    </body>
    </html>
  `;
  
  const textBody = `
EPA GHANA - PERMIT EXPIRY REMINDER

Concession: ${permit.name}
Permit Number: ${permit.permitNumber}
Contact Person: ${permit.contactPerson}
Current Status: ${permit.licenseStatus}
Expiry Date: ${expiryDateFormatted}

${daysUntilExpiry <= 7 ? 'URGENT: ' : 'WARNING: '}Your permit expires in ${daysUntilExpiry} day${daysUntilExpiry !== 1 ? 's' : ''}.

REQUIRED ACTION:
Your permit for concession ${permit.name} will expire on ${expiryDateFormatted}. Please renew or close out operations.

Required steps:
- Submit permit renewal application if continuing operations
- Complete all required documentation and compliance reports  
- Pay all outstanding fees and penalties
- Or properly close out operations if not renewing

IMPORTANT: Operations must cease immediately upon permit expiry if not renewed.

Contact EPA Mining Division: mining@epa.gov.gh

---
Environmental Protection Authority
Mining Division • Republic of Ghana
Generated: ${format(new Date(), 'MMMM do, yyyy \'at\' h:mm a')}
  `;
  
  const mailOptions = {
    from: `"${CONFIG.FROM_NAME}" <${CONFIG.FROM_EMAIL}>`,
    to: permit.email,
    subject: subject,
    text: textBody,
    html: htmlBody,
    headers: {
      'X-EPA-Alert-Type': 'permit-expiry',
      'X-EPA-Concession': permit.name,
      'X-EPA-Days-Until-Expiry': daysUntilExpiry.toString()
    }
  };
  
  return await transporter.sendMail(mailOptions);
}

// Export for testing
module.exports = { sendPermitAlerts: functions.getFunction('sendPermitAlerts') };
