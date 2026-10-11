import { Router } from 'express'
import protect from '../middleware/auth.js'

const router = Router()

const systemPrompt = `You are Voyara, a professional, helpful, and highly intelligent travel assistant for an Indian travel planning app called Voyara.
You help users plan trips, give suggestions for cities, and provide estimated costs.
CRITICAL RULES:
1. Keep your responses EXTREMELY short and conversational (maximum 2-3 sentences).
2. Do NOT use markdown formatting (no bold **, no asterisks, no lists). Use plain text only.
3. If the user asks about booking, tell them they can book flights, trains, and buses directly from their saved itineraries.
4. TRIP CREATION & SAVING (MANDATORY):
Whenever:
- The user asks to create, plan, or save an itinerary (e.g., "create an itinerary for hyd to delhi for 3 days", "save a trip to Goa", "plan a trip to Delhi"), OR
- You ask "Want me to save this itinerary for you?" and the user answers "yes", "sure", "yeah", "ok", "please", "confirm", "save it",
YOU MUST ALWAYS confirm friendly AND append EXACTLY this JSON block on a new line at the very end of your response:
{"action": "save_trip", "source": "Source City", "destination": "Destination City", "days": Number}
Example:
{"action": "save_trip", "source": "Hyderabad", "destination": "Delhi", "days": 3}
Never forget this JSON block when saving or creating a trip!`

function ensureActionBlock(reply, message, history) {
  if (reply.includes('"action": "save_trip"') || reply.includes('"action":"save_trip"')) {
    return reply
  }

  const msgLower = (message || '').toLowerCase()
  const replyLower = reply.toLowerCase()
  const fullConvo = [...(history || []).map(h => h.text || h.content || ''), message].join(' ').toLowerCase()

  const isSavingIntent = 
    msgLower.includes('yes') || msgLower.includes('save') || msgLower.includes('add') || msgLower.includes('create') || msgLower.includes('sure') || msgLower.includes('please') ||
    replyLower.includes('saved') || replyLower.includes('saved your trip') || replyLower.includes('itinerary is saved')

  if (!isSavingIntent) return reply

  const knownCities = ['Delhi', 'Mumbai', 'Goa', 'Jaipur', 'Agra', 'Hyderabad', 'Kerala', 'Kolkata', 'Chennai', 'Bangalore', 'Udaipur', 'Manali', 'Leh', 'Shimla', 'Rishikesh', 'Pune', 'Ahmedabad', 'Varanasi']
  let destination = ''
  let source = 'Mumbai'

  for (const city of knownCities) {
    const reg = new RegExp(`\\b${city}\\b`, 'i')
    if (reg.test(fullConvo)) {
      if (!destination) {
        destination = city
      } else if (!source || source === 'Mumbai') {
        source = destination
        destination = city
      }
    }
  }

  if (fullConvo.includes('hyd') && destination !== 'Hyderabad') source = 'Hyderabad'
  if (fullConvo.includes('delhi')) destination = 'Delhi'
  if (fullConvo.includes('hyd') && !destination) destination = 'Hyderabad'

  if (!destination) return reply

  let days = 3
  const daysMatch = fullConvo.match(/(\d+)\s*(?:day|days)/)
  if (daysMatch) days = parseInt(daysMatch[1]) || 3

  return `${reply}\n{"action": "save_trip", "source": "${source}", "destination": "${destination}", "days": ${days}}`
}

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
  return "That sounds exciting! I am ready to help you plan your journey across India. Which city would you like to explore?"
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
      await new Promise(r => setTimeout(r, 800))
      const fallbackReply = ensureActionBlock(getFallbackResponse(message), message, history)
      return res.json({ reply: fallbackReply })
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map(m => ({ role: m.role, content: m.text })),
      { role: 'user', content: message }
    ]

    let apiUrl = ''
    let apiKey = ''
    let modelsToTry = []

    if (groqKey) {
      apiUrl = 'https://api.groq.com/openai/v1/chat/completions'
      apiKey = groqKey
      modelsToTry = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b']
    } else {
      apiUrl = 'https://api.openai.com/v1/chat/completions'
      apiKey = openAIKey
      modelsToTry = ['gpt-3.5-turbo', 'gpt-4o-mini']
    }

    let reply = ''
    let success = false

    for (const model of modelsToTry) {
      try {
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

        if (response.ok) {
          const data = await response.json()
          reply = data.choices[0]?.message?.content
          if (reply) {
            success = true
            break
          }
        }
      } catch (err) {
        console.warn(`Model ${model} failed, trying fallback:`, err.message)
      }
    }

    if (!success || !reply) {
      reply = getFallbackResponse(message)
    }

    reply = ensureActionBlock(reply, message, history)

    res.json({ reply })
  } catch (err) {
    console.error('Chat Error:', err)
    const safeFallback = ensureActionBlock(getFallbackResponse(req.body.message || ''), req.body.message, req.body.history)
    res.json({ reply: safeFallback })
  }
})

export default router
