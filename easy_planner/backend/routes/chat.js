import { Router } from 'express'
import protect from '../middleware/auth.js'

const router = Router()

const systemPrompt = `You are Voyara, a professional, helpful, and highly intelligent travel assistant for an Indian travel planning app called Voyara.
You help users plan trips, give suggestions for cities, and provide estimated costs.
CRITICAL RULES:
1. Keep your responses EXTREMELY short and conversational (maximum 2-3 sentences).
2. Do NOT use markdown formatting (no bold **, no asterisks, no lists). Use plain text only.
3. If the user asks about booking, tell them they can book flights, trains, and buses directly from their saved itineraries.
`

function getFallbackResponse(message) {
  const msg = message.toLowerCase()
  if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
    return "Hello there! I am Voyara's smart travel assistant. Which Indian city are you planning to visit?"
  }
  if (msg.includes('price') || msg.includes('cost') || msg.includes('money')) {
    return "You can get live estimated pricing including travel, stay, and food by using our Planner! The costs vary dynamically based on the number of days you select."
  }
  if (msg.includes('book') || msg.includes('flight') || msg.includes('train') || msg.includes('bus')) {
    return "Once you create an itinerary in the Planner, we generate direct booking links for AirIndia flights, IRCTC trains, and RedBus tickets!"
  }
  if (msg.includes('goa') || msg.includes('beach')) {
    return "Goa is a fantastic choice! You can explore Fort Aguada, Baga Beach, and more. Use our map to plan your Goa itinerary instantly."
  }
  if (msg.includes('delhi') || msg.includes('agra') || msg.includes('taj')) {
    return "The Golden Triangle is beautiful. We have detailed attractions for Delhi and Agra built right into the app."
  }
  if (msg.includes('help') || msg.includes('how')) {
    return "I can help you decide where to go! Just tell me what kind of vacation you like (e.g., beaches, mountains, historical), or use the interactive Map to explore."
  }
  return "That sounds exciting! I am currently running in offline fallback mode because no AI API key was provided. Add an OPENAI_API_KEY or GROQ_API_KEY to the backend .env file to unlock my full brain!"
}

// POST /api/chat
router.post('/', async (req, res) => {
  try {
    const { message, history } = req.body
    if (!message) return res.status(400).json({ error: 'Message is required' })

    const groqKey = process.env.GROQ_API_KEY
    const openAIKey = process.env.OPENAI_API_KEY

    // Fallback if no keys are provided
    if (!groqKey && !openAIKey) {
      // Simulate slight delay
      await new Promise(r => setTimeout(r, 1000))
      return res.json({ reply: getFallbackResponse(message) })
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(m => ({ role: m.role, content: m.text })),
      { role: 'user', content: message }
    ]

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
        messages: messages,
        temperature: 0.7,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      throw new Error(`AI API Error: ${errorData}`)
    }

    const data = await response.json()
    const reply = data.choices[0].message.content

    res.json({ reply })
  } catch (err) {
    console.error('Chat Error:', err)
    res.status(500).json({ error: err.message || 'Failed to process chat' })
  }
})

export default router
