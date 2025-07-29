/**
 * Test script for EPA Mining Permit Alerts Cloud Function
 * Run with: node test.js
 */

const { sendPermitAlerts } = require('./index');

// Mock Cloud Event for testing
const mockCloudEvent = {
  data: Buffer.from(JSON.stringify({ message: 'Test trigger' })),
  attributes: {
    foo: 'bar',
  },
  messageId: 'test-message-id',
  publishTime: new Date().toISOString(),
};

async function runTest() {
  console.log('🧪 Testing EPA Mining Permit Alerts Cloud Function...');
  console.log('📅 Test started at:', new Date().toISOString());
  
  try {
    const result = await sendPermitAlerts(mockCloudEvent);
    console.log('✅ Test completed successfully');
    console.log('📊 Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  runTest();
}
