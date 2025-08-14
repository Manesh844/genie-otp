import { logOtpEvent } from '@/lib/otpLogger'

/**
 * Example usage of the OTP logging functionality
 * This demonstrates how to use the logOtpEvent helper function
 */

async function exampleOtpLogging() {
  try {
    // Example OTP event data
    const otpEvent = {
      email: 'user@example.com',
      service: 'sms-verification',
      country: 'US',
      virtual_phone_number: '+1234567890',
      otp: '123456',
      status: 'sent'
    }

    // Log the OTP event
    const result = await logOtpEvent(otpEvent)
    
    if (result.success) {
      console.log('OTP event logged successfully:', result.data)
    } else {
      console.error('Failed to log OTP event:', result.error)
    }
  } catch (error) {
    console.error('Error in OTP logging example:', error)
  }
}

// Export for use in other files
export { exampleOtpLogging }
