import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const router = Router()

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' })

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields are required' })

    if (await User.findOne({ email }))
      return res.status(409).json({ error: 'Email already registered' })

    const hashed = await bcrypt.hash(password, 10)
    const user   = await User.create({ name, email, password: hashed })

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

// POST /api/auth/google
router.post('/google', async (req, res) => {
  try {
    const { name, email } = req.body
    if (!name || !email)
      return res.status(400).json({ error: 'Name and email are required' })

    let user = await User.findOne({ email })
    if (!user) {
      // Create user with a random/mock password since they are signing in with Google
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

