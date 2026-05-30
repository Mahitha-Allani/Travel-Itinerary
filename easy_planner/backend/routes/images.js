import { Router } from 'express'
import ImageCache from '../models/ImageCache.js'

const router = Router()

// Curated fallbacks to prevent repeating the Taj Mahal image everywhere
const hotelFallbacks = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', // Luxury hotel facade
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', // Modern cozy bedroom
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', // Poolside hotel resort
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80', // Resort bedroom
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', // Luxury hotel lobby
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80', // Cozy bed/interior
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600&q=80', // Classic hotel room
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', // Resort pool view
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80', // Hotel room interior
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80'  // Seating area/modern lobby
]

const restaurantFallbacks = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80', // Restaurant interior
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80', // Gourmet dish
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&q=80', // Biryani table
  'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&q=80', // Indian samosa/snacks
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80', // Indian Tandoori chicken
  'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&q=80', // Cafe/drinks
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&q=80', // Indian Thali meal
  'https://images.unsplash.com/photo-1534080391025-a77af6ec78a0?w=600&q=80', // Table setting
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80', // Plated gourmet
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80'  // Dining interior
]

const landmarkFallbacks = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', // Taj Mahal
  'https://images.unsplash.com/photo-1506461883276-594a12b11cc3?w=600&q=80', // Indian Temple
  'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&q=80', // Palace facade
  'https://images.unsplash.com/photo-1548013146-72479768bada?w=600&q=80', // Fort
  'https://images.unsplash.com/photo-1598305372100-877abba771ca?w=600&q=80', // India Gate
  'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?w=600&q=80', // Ghats Varanasi
  'https://images.unsplash.com/photo-1561361513-2d000a50f0db?w=600&q=80', // Indian street
  'https://images.unsplash.com/photo-1477584305590-38772bfc1e3d?w=600&q=80', // Hawa Mahal
  'https://images.unsplash.com/photo-1585135497273-1a86b09fe707?w=600&q=80', // Kerala backwaters
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80'  // Goa Beach
]

function getHash(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}

function getFallbackImage(query, type) {
  const hash = getHash(query)
  if (type === 'hotel') {
    return hotelFallbacks[hash % hotelFallbacks.length]
  } else if (type === 'restaurant') {
    return restaurantFallbacks[hash % restaurantFallbacks.length]
  } else {
    return landmarkFallbacks[hash % landmarkFallbacks.length]
  }
}

// GET /api/images/search?q=cityName
router.get('/search', async (req, res) => {
  try {
    const { q, type } = req.query
    if (!q) return res.status(400).json({ error: 'Search query is required' })

    const query = q.trim().toLowerCase()

    // 1. Check Database Cache First
    const cachedImage = await ImageCache.findOne({ query })
    if (cachedImage) {
      return res.json({ imageUrl: cachedImage.imageUrl })
    }

    // Auto-detect type if not provided
    let queryType = type || 'landmark'
    if (!type) {
      if (query.includes('hotel') || query.includes('resort') || query.includes('stay') || query.includes('inn') || query.includes('hostel') || query.includes('lodging') || query.includes('palace') || query.includes('villa')) {
        queryType = 'hotel'
      } else if (query.includes('restaurant') || query.includes('dining') || query.includes('cafe') || query.includes('food') || query.includes('bar') || query.includes('bistro') || query.includes('dhaba') || query.includes('kitchen') || query.includes('eatery')) {
        queryType = 'restaurant'
      }
    }

    // Clean up query for Wikipedia Search to make it more matching-friendly:
    // Remove parentheses and anything inside them (e.g. "(also serves Pune)")
    const cleanedQuery = query
      .replace(/\([^)]*\)/g, '')
      .replace(/hotel|restaurant|cafe|resort/gi, '') // remove redundant keywords for Wikipedia matching
      .replace(/\s+/g, ' ')
      .trim()

    // 2. Try Fetch from Google Custom Search API
    let imageUrl = null
    try {
      const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&searchType=image&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CX_ID}&num=1`
      const googleRes = await fetch(googleUrl, { signal: AbortSignal.timeout(3000) })
      const googleData = await googleRes.json()

      if (googleRes.ok && googleData.items && googleData.items.length > 0) {
        imageUrl = googleData.items[0].link
      }
    } catch (e) {
      console.log('Google API failed, falling back to Wikipedia...')
    }

    // 3. If Google API failed (e.g. 403 blocked) or no items, fallback to Wikipedia API
    if (!imageUrl) {
      try {
        const searchQuery = encodeURIComponent(`${cleanedQuery} India`)
        const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchQuery}&prop=pageimages&format=json&pithumbsize=600&gsrlimit=1`
        
        const wikiRes = await fetch(wikiUrl, { signal: AbortSignal.timeout(3000) })
        const wikiData = await wikiRes.json()

        if (wikiRes.ok && wikiData.query?.pages) {
          const pages = wikiData.query.pages
          const pageId = Object.keys(pages)[0]
          const wikiImage = pages[pageId]?.thumbnail?.source

          const isNoiseImage = wikiImage && wikiImage.toLowerCase().match(/(logo|map|flag|emblem|icon|shield|symbol|\.svg)/i)
          if (wikiImage && !isNoiseImage) {
            imageUrl = wikiImage.replace('http://', 'https://')
          }
        }
      } catch (e) {
        console.log('Wikipedia API failed too...')
      }
    }

    if (imageUrl) {
      // Save successful image to Cache
      await ImageCache.create({ query, imageUrl })
      return res.json({ imageUrl })
    }

    // 3. Fallback if no image found on Wikipedia or search failed
    // Use the hashing method based on query type to pick a premium image
    let fallbackUrl = getFallbackImage(query, queryType)
    
    // Proxy Unsplash images to prevent client-side hotlinking blocks (403 Forbidden)
    if (fallbackUrl.includes('unsplash.com')) {
      fallbackUrl = `https://wsrv.nl/?url=${encodeURIComponent(fallbackUrl.replace('https://', ''))}`
    }
    
    // Cache the fallback URL to database so we don't hit Wikipedia or recalculate hash next time
    await ImageCache.create({ query, imageUrl: fallbackUrl })
    
    return res.json({ imageUrl: fallbackUrl })
  } catch (err) {
    console.error('Image search error:', err)
    // Return fallback on error
    const query = (req.query.q || '').trim().toLowerCase()
    const type = req.query.type || 'landmark'
    let fallbackUrl = getFallbackImage(query, type)
    if (fallbackUrl.includes('unsplash.com')) {
      fallbackUrl = `https://wsrv.nl/?url=${encodeURIComponent(fallbackUrl.replace('https://', ''))}`
    }
    res.json({ imageUrl: fallbackUrl })
  }
})

export default router
