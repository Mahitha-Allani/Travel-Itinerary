import { Router } from 'express'
import Trip from '../models/Trip.js'
import protect from '../middleware/auth.js'
import { costs, nearbyPlaces, activities } from '../config/data.js'

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
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user._id })
    if (!trip) return res.status(404).json({ error: 'Trip not found' })

    const destination = trip.destination
    const groqKey = process.env.GROQ_API_KEY
    const openAIKey = process.env.OPENAI_API_KEY

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

    // Fallback if no keys are provided
    if (!groqKey && !openAIKey) {
      const generateDynamicFallback = (city) => ({
        hotels: [
          { name: `${city} Taj Palace`, rating: 4.9, basePrice: 12500, address: `1 Apollo Bunder, Colaba, ${city}`, description: "An iconic luxury heritage hotel featuring breathtaking views and world-class hospitality." },
          { name: `The Oberoi ${city}`, rating: 4.8, basePrice: 9800, address: `Nariman Point, ${city}`, description: "Sophisticated luxury with magnificent panoramic views of the city skyline." },
          { name: `Hyatt Regency ${city}`, rating: 4.4, basePrice: 6200, address: `Sahar Airport Road, ${city}`, description: "Modern upscale business hotel offering contemporary rooms and exquisite dining." },
          { name: `Ginger Hotel ${city}`, rating: 4.1, basePrice: 3100, address: `Near Main Station, ${city}`, description: "Comfortable and vibrant budget-friendly rooms designed for the modern smart traveler." },
          { name: `Bloom Boutique ${city}`, rating: 4.3, basePrice: 4400, address: `Tourist District, ${city}`, description: "A chic boutique property with bright yellow accents and cozy minimalist interiors." }
        ],
        restaurants: [
          { name: `${city} Spice Kitchen`, rating: 4.7, cuisine: "North Indian & Mughlai", address: `High Street, ${city}`, description: "Famous for its buttery dal makhani, rich curries, and warm clay-oven tandoori tikkas." },
          { name: `Coastal Curries`, rating: 4.5, cuisine: "South Indian & Seafood", address: `Beachside Promenade, ${city}`, description: "Savor authentic regional coastal specialties, coconut-infused fish curries, and appams." },
          { name: `The Golden Dragon`, rating: 4.6, cuisine: "Indo-Chinese Fusion", address: `Market Galleria, ${city}`, description: "A trendy dining destination offering delicious fiery chili paneer, hakka noodles, and steamed dim sums." },
          { name: `Pure Veg Bistro`, rating: 4.3, cuisine: "Pure Vegetarian Thali", address: `Heritage Square, ${city}`, description: "A popular family joint serving massive traditional unlimited regional thalis with local ghee." },
          { name: `Cafe Nirvana`, rating: 4.4, cuisine: "Continental & Italian Cafe", address: `Art District, ${city}`, description: "Cozy bohemian hideout serving artisanal espresso, wood-fired sourdough pizzas, and house pastas." }
        ]
      })
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
    // Dynamic fallback in case of API failure
    const generateDynamicFallback = (city) => ({
      hotels: [
        { name: `${city} Taj Palace`, rating: 4.9, basePrice: 12500, address: `1 Apollo Bunder, Colaba, ${city}`, description: "An iconic luxury heritage hotel featuring breathtaking views and world-class hospitality." },
        { name: `The Oberoi ${city}`, rating: 4.8, basePrice: 9800, address: `Nariman Point, ${city}`, description: "Sophisticated luxury with magnificent panoramic views of the city skyline." },
        { name: `Hyatt Regency ${city}`, rating: 4.4, basePrice: 6200, address: `Sahar Airport Road, ${city}`, description: "Modern upscale business hotel offering contemporary rooms and exquisite dining." },
        { name: `Ginger Hotel ${city}`, rating: 4.1, basePrice: 3100, address: `Near Main Station, ${city}`, description: "Comfortable and vibrant budget-friendly rooms designed for the modern smart traveler." },
        { name: `Bloom Boutique ${city}`, rating: 4.3, basePrice: 4400, address: `Tourist District, ${city}`, description: "A chic boutique property with bright yellow accents and cozy minimalist interiors." }
      ],
      restaurants: [
        { name: `${city} Spice Kitchen`, rating: 4.7, cuisine: "North Indian & Mughlai", address: `High Street, ${city}`, description: "Famous for its buttery dal makhani, rich curries, and warm clay-oven tandoori tikkas." },
        { name: `Coastal Curries`, rating: 4.5, cuisine: "South Indian & Seafood", address: `Beachside Promenade, ${city}`, description: "Savor authentic regional coastal specialties, coconut-infused fish curries, and appams." },
        { name: `The Golden Dragon`, rating: 4.6, cuisine: "Indo-Chinese Fusion", address: `Market Galleria, ${city}`, description: "A trendy dining destination offering delicious fiery chili paneer, hakka noodles, and steamed dim sums." },
        { name: `Pure Veg Bistro`, rating: 4.3, cuisine: "Pure Vegetarian Thali", address: `Heritage Square, ${city}`, description: "A popular family joint serving massive traditional unlimited regional thalis with local ghee." },
        { name: `Cafe Nirvana`, rating: 4.4, cuisine: "Continental & Italian Cafe", address: `Art District, ${city}`, description: "Cozy bohemian hideout serving artisanal espresso, wood-fired sourdough pizzas, and house pastas." }
      ]
    })
    res.json(generateDynamicFallback(req.params.id ? 'Local' : 'Selected'))
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
