import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api/axios.js'

const featuredCities = ['Mumbai', 'Jaipur', 'Agra', 'Goa', 'Kerala', 'Delhi', 'Udaipur', 'Leh']


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

function DynamicCityCard({ name, onClick }) {
  const [img, setImg] = useState('https://wsrv.nl/?url=images.unsplash.com/photo-1436491865332-7a61a109cc05%3Fw%3D600%26q%3D80')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/images/search?q=${name}`)
      .then(res => {
        if (res.data.imageUrl) setImg(res.data.imageUrl)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [name])

  return (
    <div onClick={onClick} className="cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all relative group bg-gray-200" style={{ minHeight: '160px' }}>
      {!loading && <img src={img} alt={name} className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500" />}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <span className="text-white text-base font-bold drop-shadow">{name}</span>
      </div>
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

      {/* Hero */}
      <section className="bg-linear-to-br from-burgundy-800 via-burgundy-700 to-pink-700 text-white py-20 sm:py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px'}} />
        <p className="text-white/60 text-xs tracking-widest uppercase mb-4">✈ Welcome to Voyara</p>
        <h1 className="text-4xl sm:text-6xl font-bold mb-5 leading-tight">
          Plan Your Perfect<br /><span className="text-yellow-300">Indian Journey</span>
        </h1>
        <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto mb-10">
          Real-time pricing, interactive maps, AI trip assistant — everything you need for your next adventure.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate('/planner')}
            className="bg-white text-burgundy-700 font-bold px-8 py-3.5 rounded-xl hover:bg-yellow-50 shadow-xl transition">
            Start Planning →
          </button>
          <button onClick={() => navigate('/map')}
            className="border-2 border-white/40 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/10 transition">
            🗺 Explore Map
          </button>
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
                <img src="https://images.unsplash.com/photo-1587922546307-776227941871?w=200&q=80" alt="Goa" className="w-full h-20 object-cover" />
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
                { icon: '🤖', title: 'AI Travel Assistant', desc: 'Chat with Voyara\'s AI travel assistant powered by Groq Llama. Get destination suggestions, packing tips, and more.' },
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
              <DynamicCityCard key={c} name={c} onClick={() => navigate(`/planner?dest=${c}`)} />
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