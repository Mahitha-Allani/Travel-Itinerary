import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { sendWelcomeEmail } from '../utils/email.js'

const router = Router()

// GET /api/auth/test-email (For diagnostic testing)
router.get('/test-email', async (req, res) => {
  try {
    const { email } = req.query
    if (!email) return res.status(400).json({ error: 'Email query parameter is required' })

    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASS

    if (!user || !pass) {
      return res.status(500).json({ 
        error: 'Environment variables EMAIL_USER or EMAIL_PASS are missing on the server.',
        EMAIL_USER_PRESENT: !!user,
        EMAIL_PASS_PRESENT: !!pass
      })
    }

    const nodemailer = (await import('nodemailer')).default
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      family: 4,           // force IPv4
      auth: { user, pass }
    })

    await transporter.verify() // Verify connection configuration

    const mailOptions = {
      from: `"Voyara Diagnostic" <${user}>`,
      to: email,
      subject: 'Voyara SMTP Diagnostic Test 🛡️',
      text: 'If you are reading this, your Voyara SMTP email connection is configured 100% correctly!'
    }

    const info = await transporter.sendMail(mailOptions)
    res.json({ success: true, message: 'SMTP is working perfectly! Email sent.', info })
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      error: err.message, 
      details: err,
      EMAIL_USER: process.env.EMAIL_USER ? `${process.env.EMAIL_USER.slice(0, 3)}...` : 'not set',
      EMAIL_PASS_LENGTH: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0
    })
  }
})

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' })

    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters long' })

    if (await User.findOne({ email }))
      return res.status(409).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({ name, email, password: hashed })

    // Send welcome email asynchronously in the background
    sendWelcomeEmail(user.email, user.name).catch(console.error)

    res.status(201).json({
      token: generateToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ error: 'Invalid email or password' })

    res.json({
      token: generateToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─── REAL GOOGLE OAUTH ────────────────────────────────────────────────────────

// GET /api/auth/google  →  redirect user to Google's account picker
router.get('/google', (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.GOOGLE_CLIENT_ID,
    redirect_uri:  process.env.GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'select_account',   // always show account chooser
  })
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
})

// GET /api/auth/google/callback  →  Google redirects here after user picks account
router.get('/google/callback', async (req, res) => {
  const { code, error } = req.query

  if (error || !code) {
    return res.redirect(`${process.env.FRONTEND_URL}/?error=google_cancelled`)
  }

  try {
    // 1. Exchange authorization code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id:     process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri:  process.env.GOOGLE_REDIRECT_URI,
        grant_type:    'authorization_code',
      }),
    })
    const tokens = await tokenRes.json()

    if (!tokens.access_token) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=token_exchange_failed`)
    }

    // 2. Fetch user's Google profile
    const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })
    const profile = await profileRes.json()

    if (!profile.email) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=no_email`)
    }

    // 3. Find or create user in DB
    let user = await User.findOne({ email: profile.email })
    if (!user) {
      const hashed = await bcrypt.hash(Math.random().toString(36) + Date.now(), 10)
      user = await User.create({
        name:  profile.name || profile.email.split('@')[0],
        email: profile.email,
        password: hashed,
      })
      // Send welcome email asynchronously in the background
      sendWelcomeEmail(user.email, user.name).catch(console.error)
    } else if (!user.name && profile.name) {
      user.name = profile.name
      await user.save()
    }

    // 4. Generate JWT and redirect to frontend
    const jwtToken = generateToken(user._id)
    const params = new URLSearchParams({
      token: jwtToken,
      id:    user._id.toString(),
      name:  user.name,
      email: user.email,
    })
    res.redirect(`${process.env.FRONTEND_URL}/auth-callback?${params}`)

  } catch (err) {
    console.error('Google OAuth callback error:', err)
    res.redirect(`${process.env.FRONTEND_URL}/?error=server_error`)
  }
})

// POST /api/auth/google  (kept for backward compatibility)
router.post('/google', async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email)
      return res.status(400).json({ error: 'Name and email are required' })

    let user = await User.findOne({ email })
    if (!user) {
      const hashed = await bcrypt.hash(Math.random().toString(36), 10)
      user = await User.create({ name, email, password: hashed })
    }

    res.json({
      token: generateToken(user._id),
      user:  { id: user._id, name: user.name, email: user.email },
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
