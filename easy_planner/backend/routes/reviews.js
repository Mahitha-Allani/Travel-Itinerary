import { Router } from 'express'
import Review from '../models/Review.js'
import protect from '../middleware/auth.js'
import mongoose from 'mongoose'
const router = Router()

// Seed default reviews if none exist
const seedReviews = async () => {
  const count = await Review.countDocuments()
  if (count === 0) {
    await Review.insertMany([
      { userName: 'Priya Sharma', userInitial: 'P', rating: 5, text: 'Voyara completely transformed how I plan my trips! The live pricing and interactive map saved me hours. Absolutely love it!', tripType: 'Family Traveller' },
      { userName: 'Arjun Mehta', userInitial: 'A', rating: 5, text: 'The best Indian travel planning app I have ever used. Found amazing destinations I never knew about through the map explorer!', tripType: 'Solo Traveller' },
      { userName: 'Sneha Patel', userInitial: 'S', rating: 5, text: 'Planning a Goa trip with friends was so effortless. The booking links directly to RedBus and IRCTC are a game changer.', tripType: 'Friends Trip' },
      { userName: 'Rahul Verma', userInitial: 'R', rating: 4, text: 'Really impressed with the real-time cost estimates. The AI travel assistant gave me great suggestions for my Rajasthan tour!', tripType: 'Solo Traveller' },
      { userName: 'Kavya Nair', userInitial: 'K', rating: 5, text: 'Used Voyara for our honeymoon to Kerala. The itinerary was perfect and the nearby spots feature helped us discover hidden gems!', tripType: 'Couple' },
      { userName: 'Vikram Singh', userInitial: 'V', rating: 5, text: 'Organized a corporate retreat to Shimla using Voyara. The Professional trip type and detailed itinerary cards made coordination a breeze!', tripType: 'Professional' },
    ])
  }
}
mongoose.connection.once('open', seedReviews) 
// GET /api/reviews — public
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 })
    res.json(reviews)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/reviews — protected
router.post('/', protect, async (req, res) => {
  try {
    const { rating, text, tripType } = req.body
    if (!rating || !text) return res.status(400).json({ error: 'Rating and review text are required' })
    const review = await Review.create({
      userName: req.user.name || req.user.email.split('@')[0],
      userInitial: (req.user.name || req.user.email)[0].toUpperCase(),
      rating: parseInt(rating),
      text,
      tripType: tripType || 'Traveller'
    })
    res.status(201).json(review)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
