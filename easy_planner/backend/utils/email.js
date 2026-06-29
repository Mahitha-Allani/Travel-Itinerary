import nodemailer from 'nodemailer'

export async function sendWelcomeEmail(toEmail, userName) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    console.log('⚠️ Welcome email skipped: EMAIL_USER and EMAIL_PASS environment variables are not configured.')
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass }
    })

    const mailOptions = {
      from: `"Voyara Travel" <${user}>`,
      to: toEmail,
      subject: 'Welcome to Voyara - Your Indian Travel Companion! ✈️',
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f3e8e8; border-radius: 16px; background-color: #fffaf7;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #8b3434; margin: 0; font-size: 28px; font-weight: bold; letter-spacing: 1px;">Voyara</h1>
            <p style="color: #a27b7b; margin: 5px 0 0 0; font-size: 14px;">Explore India Beautifully</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(139, 52, 52, 0.05); border: 1px solid #f1e4e4;">
            <h2 style="color: #2d3748; margin-top: 0; font-size: 20px;">Namaste ${userName}! 🙏</h2>
            <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
              Thank you for registering with **Voyara**! We are thrilled to welcome you on board as you embark on your travel journeys across India.
            </p>
            <p style="color: #4a5568; line-height: 1.6; font-size: 15px;">
              Whether you are looking to explore the historic corridors of Delhi, the sunny beaches of Goa, or planning an adventure to the toy trains of Darjeeling, Voyara is here to guide you with smart AI itineraries, budgets, and photo scrapbooks.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://travel-itinerary-flame.vercel.app" style="background-color: #8b3434; color: #ffffff; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 8px; font-size: 14px; display: inline-block;">
                Start Planning Your Trip
              </a>
            </div>
            
            <p style="color: #718096; font-size: 13px; line-height: 1.5; border-top: 1px solid #edf2f7; padding-top: 15px; margin-top: 25px;">
              Voyara provides live direct links to book AirIndia flights, IRCTC trains, and RedBus tickets directly from your personalized itinerary. Save photos from your trips to build your own memories scrapbook!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #a0aec0; font-size: 12px;">
            <p>&copy; 2026 Voyara Itinerary Planner. Built for Indian Domestic Travel.</p>
          </div>
        </div>
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✉️ Welcome email sent successfully to ${toEmail}. Message ID: ${info.messageId}`)
  } catch (err) {
    console.error('❌ Failed to send welcome email:', err)
  }
}
