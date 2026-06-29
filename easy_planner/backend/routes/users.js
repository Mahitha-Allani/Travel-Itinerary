import { Router } from 'express'
import User from '../models/User.js'
import protect from '../middleware/auth.js'
import cloudinary from '../utils/cloudinary.js'

const router = Router()

// Protect all user routes
router.use(protect)

// PUT /api/users/profile-picture
router.put('/profile-picture', async (req, res) => {
  try {
    const { profilePicture } = req.body
    if (!profilePicture) {
      return res.status(400).json({ error: 'Profile picture is required' })
    }

    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ error: 'User not found' })

    // Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(profilePicture, {
      folder: 'voyara/profiles',
      width: 400,
      crop: "scale"
    })

    user.profilePicture = uploadRes.secure_url
    await user.save()

    res.json({ success: true, profilePicture: user.profilePicture })
  } catch (err) {
    console.error('Profile Picture Upload Error:', err)
    res.status(500).json({ error: 'Failed to upload profile picture' })
  }
})

// GET /api/users/me (Fetch user profile including picture)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
