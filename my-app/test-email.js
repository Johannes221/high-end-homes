// Simple test script to verify email sending
const { sendEmail } = require('./lib/email.ts')

async function testEmail() {
  console.log('Testing email sending...')
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET')
  
  const result = await sendEmail({
    to: 'test@example.com',
    subject: 'Test Email from High-End Homes',
    html: '<h1>Test Email</h1><p>This is a test email to verify email sending works.</p>',
  })
  
  console.log('Email result:', result)
}

testEmail().catch(console.error)
