import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api/axios.js'

// Curated fallback images — specific, verified photos of each city
const CITY_FALLBACKS = {
  Mumbai:   'https://wsrv.nl/?url=images.unsplash.com/photo-1529253355930-ddbe423a2ac7%3Fw%3D600%26q%3D80', // Gateway of India
  Jaipur:   'https://wsrv.nl/?url=images.unsplash.com/photo-1599661046827-dacff0c0f09a%3Fw%3D600%26q%3D80', // Hawa Mahal
  Agra:     'https://wsrv.nl/?url=images.unsplash.com/photo-1564507592333-c60657eea523%3Fw%3D600%26q%3D80', // Taj Mahal
  Goa:      'https://wsrv.nl/?url=images.unsplash.com/photo-1512343879784-a960bf40e7f2%3Fw%3D600%26q%3D80', // Goa beach
  Kerala:   'https://wsrv.nl/?url=images.unsplash.com/photo-1602216056096-3b40cc0c9944%3Fw%3D600%26q%3D80', // Backwaters
  Delhi:    'https://wsrv.nl/?url=images.unsplash.com/photo-1587474260584-136574528ed5%3Fw%3D600%26q%3D80', // India Gate
  Udaipur:  'https://wsrv.nl/?url=images.unsplash.com/photo-1477587458883-47145ed94245%3Fw%3D600%26q%3D80', // Lake Palace
  Leh:      'https://wsrv.nl/?url=images.unsplash.com/photo-1626621341517-bbf3d9990a23%3Fw%3D600%26q%3D80', // Ladakh mountains
}

const featuredCities = ['Mumbai', 'Jaipur', 'Agra', 'Goa', 'Kerala', 'Delhi', 'Udaipur', 'Leh']

// Smart city card: tries API first, falls back to verified curated image
function SmartCityCard({ name, onClick }) {
  const fallback = CITY_FALLBACKS[name] || 'https://wsrv.nl/?url=images.unsplash.com/photo-1476514525535-07fb3b4ae5f1%3Fw%3D600%26q%3D80'
  const [img, setImg] = useState(fallback)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    api.get(`/images/search?q=${encodeURIComponent(name + ' India landmark')}`)
      .then(res => {
        if (!cancelled && res.data?.imageUrl) {
          setImg(res.data.imageUrl)
        }
      })
      .catch(() => {}) // silently keep the verified fallback
    return () => { cancelled = true }
  }, [name])

  return (
    <div onClick={onClick} className="cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative group bg-gray-200" style={{ minHeight: '160px' }}>
      <img
        src={img}
        alt={name}
        onLoad={() => setLoaded(true)}
        onError={() => setImg(fallback)}
        className={`w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-all duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-white text-base font-bold drop-shadow">{name}</span>
      </div>
    </div>
  )
}

function StarRating({ rating, onClick }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <button key={s} type={onClick ? 'button' : undefined}
          onClick={() => onClick && onClick(s)}
          className={`text-lg transition ${s <= rating ? 'text-yellow-400' : 'text-gray-200'} ${onClick ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newReview, setNewReview] = useState({ rating: 5, text: '', tripType: 'Traveller' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    api.get('/reviews').then(({ data }) => setReviews(data)).catch(() => {})
  }, [])

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (!newReview.text.trim()) return
    setSubmitting(true)
    try {
      const { data } = await api.post('/reviews', newReview)
      setReviews(prev => [data, ...prev])
      setShowModal(false)
      setNewReview({ rating: 5, text: '', tripType: 'Traveller' })
    } catch { alert('Could not post review. Please log in first.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero — Idea 4: Gliding Paper Airplane & 3D Travel Badges (No Photos) */}
      <section className="relative py-24 sm:py-32 px-6 text-center text-white overflow-hidden bg-gradient-to-br from-[#3b0a13] via-[#52101c] to-[#2c060d]">
        {/* Soft Ambient Radial Glows */}
        <div className="absolute -top-32 -left-32 w-[550px] h-[550px] rounded-full bg-gradient-to-br from-amber-400/15 via-rose-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-burgundy-400/20 via-pink-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 left-1/3 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-amber-500/10 via-rose-600/10 to-transparent blur-3xl pointer-events-none" />

        {/* Subtle geometric dot grid pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

        {/* Animated Flight Trajectory & SVG Paper Airplane */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <svg className="w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 1200 600">
            <path d="M -100 450 Q 300 200 600 350 T 1300 150" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeDasharray="8 8" />
            <path d="M 100 550 Q 500 450 850 200" fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" strokeDasharray="5 5" />
          </svg>

          {/* Gliding Origami 3D Paper Airplane */}
          <div className="absolute top-14 right-1/4 sm:right-1/3 animate-plane-glide select-none">
            <svg width="84" height="84" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
              {/* Paper airplane body facets with 3D origami shading */}
              <polygon points="10,50 90,20 45,65" fill="#fef08a" />
              <polygon points="45,65 90,20 55,85" fill="#fde047" />
              <polygon points="55,85 50,60 45,65" fill="#eab308" />
              <polygon points="10,50 45,65 50,60" fill="#ca8a04" opacity="0.4" />
            </svg>
          </div>
        </div>

        {/* Floating Travel Badges orbiting around Hero (Desktop / Tablet) */}
        <div className="absolute top-28 left-6 sm:left-12 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-float-slow rotate-[-5deg]">
          <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-xl">
            🧳
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white">Smart Fare Estimator</p>
            <p className="text-[10px] text-white/70">Flights · Trains · Buses</p>
          </div>
        </div>

        <div className="absolute top-24 right-6 sm:right-12 hidden lg:flex items-center gap-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl animate-float-slow rotate-[5deg]" style={{ animationDelay: '1.5s' }}>
          <div className="w-10 h-10 rounded-xl bg-pink-400/20 border border-pink-300/40 flex items-center justify-center text-xl">
            🤖
          </div>
          <div className="text-left">
            <p className="text-xs font-bold text-white">Voyara AI Assistant</p>
            <p className="text-[10px] text-white/70">Day-by-day plans in seconds</p>
          </div>
        </div>

        <div className="absolute bottom-16 left-16 hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/15 text-white/90 text-xs shadow-xl animate-float-slow" style={{ animationDelay: '2.5s' }}>
          <span className="text-sm">📍</span>
          <span className="font-semibold text-xs">50+ Destinations Across India</span>
        </div>

        <div className="absolute bottom-16 right-16 hidden xl:flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/15 text-white/90 text-xs shadow-xl animate-float-slow" style={{ animationDelay: '3.5s' }}>
          <span className="text-amber-300 text-sm">★★★★★</span>
          <span className="font-semibold text-xs">4.9 / 5 Traveler Rating</span>
        </div>

        {/* Content Container */}
        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white/90 text-xs font-semibold tracking-wider uppercase mb-6 shadow-sm">
            <span>✈</span>
            <span>Welcome to Voyara</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight tracking-tight drop-shadow-lg">
            Plan Your Perfect<br />
            <span className="bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
              Indian Journey
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/85 max-w-2xl mx-auto mb-10 leading-relaxed font-normal drop-shadow">
            Real-time pricing, interactive maps, AI trip assistant — everything you need for your next adventure.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <button 
              onClick={() => navigate('/planner')}
              className="bg-white text-burgundy-900 font-bold px-8 py-3.5 rounded-2xl hover:bg-yellow-50 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl">
              Start Planning →
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="bg-white/15 backdrop-blur-md border border-white/30 text-white font-bold px-8 py-3.5 rounded-2xl hover:bg-white/25 hover:border-white/50 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg">
              🗺 Explore Map
            </button>
          </div>
        </div>
      </section>

      {/* Animated Feature Showcase */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <p className="text-burgundy-600 text-sm font-semibold uppercase tracking-widest mb-2">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Plan smarter, travel better</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Animated Mock UI */}
            <div className="relative h-80 sm:h-96">
              {/* Background card */}
              <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-creme-100 rounded-3xl" />

              {/* Floating trip card 1 */}
              <div className="absolute top-6 left-6 right-6 bg-white rounded-2xl shadow-lg p-4 animate-float-slow border border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center text-lg">✈</div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">Delhi → Goa</p>
                    <p className="text-xs text-gray-400">3 days · Solo · Friends</p>
                  </div>
                  <span className="ml-auto text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">Live ⚡</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-xs bg-burgundy-50 text-burgundy-700 px-2.5 py-1 rounded-full font-semibold">✈ ₹8,200</span>
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-semibold">🚂 ₹4,500</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold">🚌 ₹2,100</span>
                </div>
              </div>

              {/* Floating place card */}
              <div className="absolute bottom-16 left-4 w-40 bg-white rounded-xl shadow-md overflow-hidden animate-float-medium border border-gray-100">
                <img src="https://wsrv.nl/?url=images.unsplash.com/photo-1512343879784-a960bf40e7f2%3Fw%3D200%26q%3D80" alt="Goa" className="w-full h-20 object-cover" />
                <div className="p-2">
                  <p className="text-xs font-bold text-gray-800">Baga Beach, Goa</p>
                  <p className="text-xs text-gray-400">Top attraction</p>
                </div>
              </div>

              {/* Floating booking card */}
              <div className="absolute bottom-6 right-4 w-44 bg-white rounded-xl shadow-md p-3 animate-float-fast border border-gray-100">
                <p className="text-xs font-bold text-gray-700 mb-2">Book instantly</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 bg-burgundy-50 rounded-lg px-2 py-1.5">
                    <span className="text-xs">✈</span><span className="text-xs font-medium text-burgundy-700">AirIndia Flights</span>
                  </div>
                  <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-2 py-1.5">
                    <span className="text-xs">🚂</span><span className="text-xs font-medium text-blue-700">IRCTC Trains</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature list */}
            <div className="space-y-8">
              {[
                { icon: '⚡', title: 'Live Price Engine', desc: 'Get real-time estimates for flights, trains, and buses — updated every time you select a route. Includes food and accommodation costs by day.' },
                { icon: '🗺️', title: 'Interactive India Map', desc: 'Explore the entire map of India with 40+ cities. Click any city to instantly start planning a trip to it.' },
                { icon: '🤖', title: 'AI Travel Assistant', desc: "Chat with Voyara's AI travel assistant powered by Groq Llama. Get destination suggestions, packing tips, and more." },
                { icon: '📍', title: 'Nearby Attractions', desc: 'Every itinerary auto-populates with curated nearby places and day-by-day activities for your destination.' },
              ].map(f => (
                <div key={f.title} className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-2xl bg-burgundy-50 flex items-center justify-center text-xl shrink-0">{f.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-burgundy-600 text-sm font-semibold uppercase tracking-widest mb-1">Destinations</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular Indian Cities</h2>
            </div>
            <button onClick={() => navigate('/map')} className="text-burgundy-600 font-semibold text-sm hover:text-burgundy-800 transition">
              View all →
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredCities.map(c => (
              <SmartCityCard key={c} name={c} onClick={() => navigate(`/planner?dest=${c}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* Community Reviews */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-burgundy-600 text-sm font-semibold uppercase tracking-widest mb-1">Community</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">What travellers say</h2>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-burgundy-600 hover:bg-burgundy-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm">
              ✍ Write a Review
            </button>
          </div>

          {/* Masonry Grid */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
            {reviews.map((r, i) => (
              <div key={r._id || i} className="break-inside-avoid bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-burgundy-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    {r.userInitial || r.userName?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{r.userName}</p>
                    <p className="text-xs text-gray-400">{r.tripType}</p>
                  </div>
                </div>
                <StarRating rating={r.rating} />
                <p className="text-gray-600 text-sm leading-relaxed mt-2">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Write Review Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">Write a Review</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
            </div>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Your Rating</label>
                <StarRating rating={newReview.rating} onClick={s => setNewReview(p => ({ ...p, rating: s }))} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Trip Type</label>
                <select value={newReview.tripType} onChange={e => setNewReview(p => ({ ...p, tripType: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-300">
                  <option>Traveller</option>
                  <option>Solo Traveller</option>
                  <option>Family Traveller</option>
                  <option>Friends Trip</option>
                  <option>Professional</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Your Review</label>
                <textarea required rows={4} value={newReview.text}
                  onChange={e => setNewReview(p => ({ ...p, text: e.target.value }))}
                  placeholder="Share your experience with Voyara..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-burgundy-300" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-burgundy-600 hover:bg-burgundy-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition">
                {submitting ? 'Posting...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}