import { Router } from 'express'
import { costs, nearbyPlaces } from '../config/data.js'

const router = Router()

// GET /api/cities
router.get('/', (req, res) => {
  res.json(Object.keys(nearbyPlaces))
})

// GET /api/cities/costs?from=X&to=Y
router.get('/costs', (req, res) => {
  const { from, to } = req.query
  res.json(costs[`${from}-${to}`] || costs.default)
})

// GET /api/cities/image?city=X
router.get('/image', async (req, res) => {
  try {
    const { city } = req.query
    if (!city) return res.status(400).json({ error: 'City parameter is required' })

    const googleApiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_MAPS_API_KEY
    if (googleApiKey) {
      try {
        const searchUrl = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(city + ' India')}&inputtype=textquery&fields=photos,place_id&key=${googleApiKey}`
        const searchRes = await fetch(searchUrl)
        const searchData = await searchRes.json()

        if (searchData.candidates && searchData.candidates.length > 0 && searchData.candidates[0].photos && searchData.candidates[0].photos.length > 0) {
          const photoReference = searchData.candidates[0].photos[0].photo_reference
          // Google Places Photo Redirect URL
          const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photoreference=${photoReference}&key=${googleApiKey}`
          return res.json({ imageUrl: photoUrl })
        }
      } catch (err) {
        console.error('Google Places Photo API error:', err)
      }
    }

    // High quality dynamic curated fallbacks
    const fallbackImages = {
      Mumbai:     'https://images.pexels.com/photos/15881476/pexels-photo-15881476.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Delhi:      'https://images.pexels.com/photos/789750/pexels-photo-789750.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Jaipur:     'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Agra:       'https://images.pexels.com/photos/3881104/pexels-photo-3881104.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Goa:        'https://images.pexels.com/photos/4553618/pexels-photo-4553618.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Kolkata:    'https://images.pexels.com/photos/20308056/pexels-photo-20308056.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Hyderabad:  'https://images.pexels.com/photos/11321242/pexels-photo-11321242.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Chennai:    'https://images.pexels.com/photos/10070659/pexels-photo-10070659.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Udaipur:    'https://images.pexels.com/photos/15724594/pexels-photo-15724594.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Shimla:     'https://images.pexels.com/photos/17364132/pexels-photo-17364132.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Darjeeling: 'https://images.pexels.com/photos/13523293/pexels-photo-13523293.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Kochi:      'https://images.pexels.com/photos/20993076/pexels-photo-20993076.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Mysore:     'https://images.pexels.com/photos/18413554/pexels-photo-18413554.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Leh:        'https://images.pexels.com/photos/14389025/pexels-photo-14389025.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Manali:     'https://images.pexels.com/photos/19639599/pexels-photo-19639599.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Rishikesh:  'https://images.pexels.com/photos/18320491/pexels-photo-18320491.jpeg?auto=compress&cs=tinysrgb&w=1200',
      Jodhpur:    'https://images.pexels.com/photos/18051877/pexels-photo-18051877.jpeg?auto=compress&cs=tinysrgb&w=1200',
    }

    const cleanCity = city.trim()
    const imageUrl = fallbackImages[cleanCity] || `https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=1200`
    res.json({ imageUrl })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router

