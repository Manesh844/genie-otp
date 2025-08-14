import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, service, country, virtual_phone_number, otp, status } = body

    // Validate required fields
    if (!email || !service || !otp || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Insert into OTP log table
    const { data, error } = await supabase
      .from('otp_log')
      .insert([
        {
          email,
          service,
          country: country || null,
          virtual_phone_number: virtual_phone_number || null,
          otp,
          status,
          created_at: new Date().toISOString()
        }
      ])

    if (error) {
      console.error('Error logging OTP event:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to log OTP event' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in OTP log route:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
