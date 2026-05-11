import { sendEmail } from './lib/email.ts'

async function testEmail() {
  console.log('=== Testing Email Function ===')
  console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'SET' : 'NOT SET')
  console.log('SMTP_FROM:', process.env.SMTP_FROM)
  
  const result = await sendEmail({
    to: 'test@example.com',
    subject: 'Test Email from High-End Homes',
    html: '<h1>Test Email</h1><p>This is a test email to verify email sending works.</p>',
  })
  
  console.log('Email result:', result)
  if (result.success) {
    console.log('✓ Email sent successfully')
  } else {
    console.log('✗ Email failed:', result.error)
  }
}

testEmail().catch(console.error)
