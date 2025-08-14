import { createClient } from '@supabase/supabase-js'

// Client-side Supabase client (for authenticated users only)
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface OtpLogEvent {
  email: string
  service: string
  country?: string
  virtual_phone_number?: string
  otp: string
  status: string
}

/**
 * Server-side OTP logging helper (preferred method)
 * Uses the service role key for secure insertion
 */
export async function logOtpEventServer(event: OtpLogEvent) {
  try {
    const response = await fetch('/api/log-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to log OTP event')
    }

    const result = await response.json()
    return { success: true, data: result.data }
  } catch (error) {
    console.error('Error logging OTP event (server-side):', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Client-side OTP logging helper (fallback method)
 * Only for authenticated users with limited fields
 * Note: This is less secure than server-side logging
 */
export async function logOtpEventClient(event: OtpLogEvent) {
  try {
    // Check if user is authenticated
    const { data: { user } } = await supabaseClient.auth.getUser()
    
    if (!user) {
      throw new Error('User must be authenticated for client-side logging')
    }

    // Limit fields for security in client-side insert
    const limitedEvent = {
      email: event.email,
      service: event.service,
      otp: event.otp,
      status: event.status,
      // Exclude sensitive fields like country and virtual_phone_number
    }

    const { data, error } = await supabaseClient
      .from('otp_log')
      .insert([{
        ...limitedEvent,
        created_at: new Date().toISOString()
      }])

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error('Error logging OTP event (client-side):', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Main OTP logging function that prefers server-side logging
 * Falls back to client-side if server is unavailable
 */
export async function logOtpEvent(event: OtpLogEvent) {
  // Try server-side logging first (preferred)
  const serverResult = await logOtpEventServer(event)
  
  if (serverResult.success) {
    return serverResult
  }

  console.warn('Server-side logging failed, attempting client-side fallback...')
  
  // Fallback to client-side logging
  return await logOtpEventClient(event)
}
