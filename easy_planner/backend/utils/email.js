import { Resend } from 'resend'

export async function sendWelcomeEmail(toEmail, userName) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('⚠️ Welcome email skipped: RESEND_API_KEY not set.')
    return
  }

  try {
    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'Voyara Travel <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Welcome to Voyara - Your Indian Travel Companion! ✈️',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f3e8e8; border-radius: 16px; background-color: #fffaf7;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #8b3434; margin: 0; font-size: 28px; font-weight: bold;">Voyara</h1>
            <p style="color: #a27b7b; margin: 5px 0 0 0; font-size: 14px;">Explore India Beautifully</p>
          </div>
          <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; border: 1px solid #f1e4e4;">
            <h2 style="color: #2d3748; margin-top: 0;">Namaste ${userName}! 🙏</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              Thank you for joining <strong>Voyara</strong>! We are thrilled to welcome you on board as you plan your journeys across India.
            </p>
            <p style="color: #4a5568; line-height: 1.6;">
              Whether you want to explore the historic corridors of Delhi, the sunny beaches of Goa, or the toy trains of Darjeeling — Voyara guides you with smart AI itineraries, live travel costs, and photo scrapbooks.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://travel-itinerary-flame.vercel.app" style="background-color: #8b3434; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: bold; border-radius: 10px; font-size: 15px; display: inline-block;">
                🗺️ Start Planning Your Trip
              </a>
            </div>
            <p style="color: #718096; font-size: 13px; line-height: 1.5; border-top: 1px solid #edf2f7; padding-top: 15px; margin-top: 25px;">
              Voyara gives you live booking links for AirIndia flights, IRCTC trains and RedBus tickets. Save your trip photos to build a permanent travel memories scrapbook!
            </p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #a0aec0; font-size: 12px;">
            <p>&copy; 2026 Voyara Itinerary Planner. Built for Indian Domestic Travel.</p>
          </div>
        </div>
      `
    })

    console.log(`✉️ Welcome email sent to ${toEmail}`)
  } catch (err) {
    console.error('❌ Failed to send welcome email:', err)
  }
}
