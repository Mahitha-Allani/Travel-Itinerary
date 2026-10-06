import { Router } from 'express'
import Trip from '../models/Trip.js'
import protect from '../middleware/auth.js'
import cloudinary from '../utils/cloudinary.js'
import { costs, nearbyPlaces, activities } from '../config/data.js'
import { generateDynamicFallback } from '../config/fallbackExplore.js'

const router = Router()

router.use(protect)

// POST /api/trips
router.post('/', async (req, res) => {
  try {
    const { source, destination, days, startDate, endDate, tripType } = req.body
    if (!source || !destination)
      return res.status(400).json({ error: 'Missing required fields' })

    if (source === destination)
      return res.status(400).json({ error: 'Source and destination must be different' })

    // Calculate days from dates if provided
    let calculatedDays = parseInt(days) || 1
    if (startDate && endDate) {
      const diff = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24))
      calculatedDays = Math.max(1, diff)
    }

    const transport = costs[`${source}-${destination}`] || costs.default
    const variance = Math.floor(Math.random() * 400) - 200

    // REMOVED totalLivingCost (travel+stay+food) overhead as requested
    const tripCost = {
      flight: transport.flight !== 'N/A' ? transport.flight + (variance * 2) : 'N/A',
      train: transport.train !== 'N/A' ? transport.train + variance : 'N/A',
      bus: transport.train !== 'N/A' ? Math.floor(transport.train * 0.7) + variance : 'N/A'
    }

    // Generate dynamic day-wise activities based on trip duration
    const baseActivities = activities[destination] || []
    const basePlaces = nearbyPlaces[destination] || []

    // Extra activities pool for longer trips
    const extraActivities = [
      `Explore local markets and street food in ${destination}`,
      `Visit nearby temples and historical monuments`,
      `Take a guided walking tour of old ${destination}`,
      `Photography walk through scenic ${destination} neighborhoods`,
      `Try local cuisine at a popular restaurant`,
      `Visit a museum or cultural center in ${destination}`,
      `Enjoy sunset at a popular viewpoint near ${destination}`,
      `Shopping for local handicrafts and souvenirs`,
      `Day trip to a nearby town or village`,
      `Relax at a park or garden in ${destination}`,
    ]

    let tripActivities = []
    for (let day = 0; day < calculatedDays; day++) {
      if (day < baseActivities.length) {
        tripActivities.push(baseActivities[day])
      } else {
        // Pick from extra activities pool for longer trips
        const extraIdx = (day - baseActivities.length) % extraActivities.length
        tripActivities.push(extraActivities[extraIdx])
      }
    }

    // Also scale nearby places — add more for longer trips
    let tripPlaces = [...basePlaces]
    const extraPlaces = [
      `${destination} Local Market`,
      `${destination} Heritage Walk`,
      `${destination} Botanical Garden`,
      `${destination} Lakeside Viewpoint`,
      `${destination} Art Gallery`,
    ]
    const extraPlacesNeeded = Math.max(0, calculatedDays - tripPlaces.length)
    for (let p = 0; p < extraPlacesNeeded && p < extraPlaces.length; p++) {
      tripPlaces.push(extraPlaces[p])
    }

    const trip = await Trip.create({
      userId:     req.user._id,
      source,
      destination,
      days:       calculatedDays,
      startDate:  startDate ? new Date(startDate) : undefined,
      endDate:    endDate ? new Date(endDate) : undefined,
      tripType:   tripType || 'Solo',
      cost:       tripCost,
      places:     tripPlaces,
      activities: tripActivities,
    })

    res.status(201).json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/trips/:id/explore — nearby hotels & restaurants dynamically via API
router.get('/:id/explore', async (req, res) => {
  let destination = null
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })

    destination = trip.destination
    const groqKey = process.env.GROQ_API_KEY
    const openAIKey = process.env.OPENAI_API_KEY

    // Always use local fallback if no AI keys are configured
    if (!groqKey && !openAIKey) {
      return res.json(generateDynamicFallback(destination))
    }

    let apiUrl = ''
    let apiKey = ''
    let model = ''

    if (groqKey) {
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
      apiKey = groqKey
      model = 'llama-3.1-8b-instant'
    } else {
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      apiKey = openAIKey
      model = 'gpt-3.5-turbo'
    }

    const systemPrompt = `You are a professional travel assistant. Return ONLY a raw JSON object and nothing else. Do not wrap in markdown code blocks, do not include any explanatory text. The response must be valid JSON with the following structure:
{
  "hotels": [
    {
      "name": "string (verified real-world popular hotel in the city)",
      "rating": number (between 4.0 and 5.0),
      "basePrice": number (realistic base price per night in INR, e.g., between 2500 and 15000),
      "address": "string",
      "description": "string (short 1-2 sentence description of style, amenities and vibe)"
    }
  ],
  "restaurants": [
    {
      "name": "string (verified real-world popular restaurant/cafe in the city)",
      "rating": number (between 4.0 and 5.0),
      "cuisine": "string (cuisine type, e.g. North Indian, Coastal Seafood, Cafe)",
      "address": "string",
      "description": "string (short 1-2 sentence description of popular dishes and ambience)"
    }
  ]
}
Return 5 high-quality, popular, and diverse options for each. Do not include any hardcoded booking or redirection website links.`

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Provide highly-rated popular hotels and restaurants in ${destination}, India.` }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      })
    })

    if (!response.ok) {
      throw new Error(`AI API failed: ${response.statusText}`)
    }

    const data = await response.json()
    const content = data.choices[0].message.content
    const parsed = JSON.parse(content)
    res.json(parsed)
  } catch (err) {
    console.error('Explore API error:', err)
    // Always fall back to local curated data — destination is declared outside try so it's always in scope
    res.json(generateDynamicFallback(destination || 'Mumbai'))
  }
})

// GET /api/trips/:id — single trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})


// GET /api/trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user._id }).sort({ createdAt: -1 })
    res.json(trips)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/trips/:id/activities
router.put('/:id/activities', async (req, res) => {
  try {
    const { activity, completed } = req.body
    if (!activity) return res.status(400).json({ error: 'Activity is required' })

    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })

    if (completed) {
      if (!trip.completedActivities.includes(activity)) {
        trip.completedActivities.push(activity)
      }
    } else {
      trip.completedActivities = trip.completedActivities.filter(a => a !== activity)
    }

    await trip.save()
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/trips/:id/complete
router.put('/:id/complete', async (req, res) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })

    trip.status = trip.status === 'completed' ? 'planned' : 'completed'
    await trip.save()
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /api/trips/:id/scrapbook
router.put('/:id/scrapbook', async (req, res) => {
  try {
    const { scrapbookPhotos, journalNotes } = req.body
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })

    if (scrapbookPhotos !== undefined) {
      // Upload any new base64 photos to Cloudinary in parallel
      const uploadedPhotos = await Promise.all(
        scrapbookPhotos.map(async (photo) => {
          if (photo.startsWith('data:image/')) {
            const uploadRes = await cloudinary.uploader.upload(photo, {
              folder: 'voyara/scrapbook',
              width: 800,
              crop: "scale"
            })
            return uploadRes.secure_url
          }
          return photo // Already a URL
        })
      )
      trip.scrapbookPhotos = uploadedPhotos
    }
    
    if (journalNotes !== undefined) trip.journalNotes = journalNotes

    await trip.save()
    res.json(trip)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /api/trips/:id
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
