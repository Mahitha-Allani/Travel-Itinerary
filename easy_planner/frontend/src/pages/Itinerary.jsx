import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api/axios.js'

const cityImages = {
  mumbai:     'https://wsrv.nl/?url=images.unsplash.com/photo-1529253355930-ddbe423a2ac7%3Fw%3D600%26q%3D80',
  delhi:      'https://wsrv.nl/?url=images.unsplash.com/photo-1587474260584-136574528ed5%3Fw%3D600%26q%3D80',
  jaipur:     'https://wsrv.nl/?url=images.unsplash.com/photo-1477584305590-38772bfc1e3d%3Fw%3D600%26q%3D80', // Hawa Mahal
  agra:       'https://wsrv.nl/?url=images.unsplash.com/photo-1524492412937-b28074a5d7da%3Fw%3D600%26q%3D80', // Taj Mahal
  goa:        'https://wsrv.nl/?url=images.unsplash.com/photo-1587922546307-776227941871%3Fw%3D600%26q%3D80',
  kolkata:    'https://wsrv.nl/?url=images.unsplash.com/photo-1558431382-27e303142255%3Fw%3D600%26q%3D80',
  hyderabad:  'https://wsrv.nl/?url=images.unsplash.com/photo-1570168007204-dfb528c6958f%3Fw%3D600%26q%3D80', // Charminar, Hyderabad
  chennai:    'https://wsrv.nl/?url=images.unsplash.com/photo-1582510003544-4d00b7f7415e%3Fw%3D600%26q%3D80',
  udaipur:    'https://wsrv.nl/?url=images.unsplash.com/photo-1615861111624-9b55239a5124%3Fw%3D600%26q%3D80',
  shimla:     'https://wsrv.nl/?url=images.unsplash.com/photo-1626621341517-bbf3d9990a23%3Fw%3D600%26q%3D80',
  darjeeling: 'https://wsrv.nl/?url=images.unsplash.com/photo-1544634076-a90160ddf44e%3Fw%3D600%26q%3D80',
  kochi:      'https://wsrv.nl/?url=images.unsplash.com/photo-1602216056096-3b40cc0c9944%3Fw%3D600%26q%3D80',
  mysore:     'https://wsrv.nl/?url=images.unsplash.com/photo-1600100397608-f010f419b9b1%3Fw%3D600%26q%3D80',
  leh:        'https://wsrv.nl/?url=images.unsplash.com/photo-1580210741270-22c608f6d659%3Fw%3D600%26q%3D80',
  manali:     'https://wsrv.nl/?url=images.unsplash.com/photo-1626015365107-39d78616aed5%3Fw%3D600%26q%3D80',
  rishikesh:  'https://wsrv.nl/?url=images.unsplash.com/photo-1590766940554-638c4d29e4b6%3Fw%3D600%26q%3D80',
  jodhpur:    'https://wsrv.nl/?url=images.unsplash.com/photo-1599059588523-28db30f30560%3Fw%3D600%26q%3D80',
  patna:      'https://wsrv.nl/?url=images.unsplash.com/photo-1590050752117-238cb0fb12b1%3Fw%3D600%26q%3D80',
  varanasi:   'https://wsrv.nl/?url=images.unsplash.com/photo-1561361513-2d000a50f0dc%3Fw%3D600%26q%3D80',
  lucknow:    'https://wsrv.nl/?url=images.unsplash.com/photo-1578662996442-48f60103fc96%3Fw%3D600%26q%3D80',
  pune:       'https://wsrv.nl/?url=images.unsplash.com/photo-1572782252655-9c8771392601%3Fw%3D600%26q%3D80',
  ahmedabad:  'https://wsrv.nl/?url=images.unsplash.com/photo-1569245004289-a7197c764f94%3Fw%3D600%26q%3D80',
}
const defaultImg = 'https://wsrv.nl/?url=images.unsplash.com/photo-1436491865332-7a61a109cc05%3Fw%3D600%26q%3D80'
const tripTypeIcon = { Solo: '🧳', Friends: '👥', Family: '👨‍👩‍👧‍👦', Professional: '💼' }

function TripCard({ trip, onDelete }) {
  const navigate = useNavigate()
  const img = cityImages[trip.destination?.toLowerCase()] || defaultImg

  const fmt = v => (v === 'N/A' || v == null) ? 'N/A' : `₹${Number(v).toLocaleString('en-IN')}`

  const formatDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null
  const dateStr = trip.startDate && trip.endDate
    ? `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`
    : `${trip.days} day${trip.days !== 1 ? 's' : ''}`

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
      onClick={() => navigate(`/trip/${trip._id}`)}>
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={img} alt={trip.destination} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <button onClick={e => { e.stopPropagation(); onDelete(trip._id) }}
          className="absolute top-3 right-3 w-7 h-7 bg-white/20 backdrop-blur-sm text-white rounded-full text-xs hover:bg-white/40 transition flex items-center justify-center">
          ✕
        </button>
        <div className="absolute bottom-3 left-4">
          <p className="text-white font-bold text-lg drop-shadow">{trip.destination}</p>
          <p className="text-white/80 text-xs">{trip.source} → {trip.destination}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>📅 {dateStr}</span>
          </div>
          <span className="text-sm">{tripTypeIcon[trip.tripType] || '🧳'} {trip.tripType || 'Solo'}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-semibold bg-burgundy-50 text-burgundy-700 px-2.5 py-1 rounded-full">✈ {fmt(trip.cost?.flight)}</span>
          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">🚂 {fmt(trip.cost?.train)}</span>
          <span className="text-xs font-semibold bg-green-50 text-green-700 px-2.5 py-1 rounded-full">🚌 {fmt(trip.cost?.bus)}</span>
        </div>
      </div>
    </div>
  )
}

export default function Itinerary() {
  const navigate = useNavigate()
  const [trips, setTrips]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get('/trips')
      .then(({ data }) => setTrips(data))
      .catch(() => setError('Failed to load itineraries.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this trip?')) return
    try {
      await api.delete(`/trips/${id}`)
      setTrips(prev => prev.filter(t => t._id !== id))
    } catch { alert('Could not delete trip.') }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <section className="flex-1 py-12 px-4">
        <div className="max-w-5xl mx-auto">

          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Your Trips</h1>
              <p className="text-gray-400 text-sm">{trips.length} {trips.length === 1 ? 'trip' : 'trips'} planned</p>
            </div>
            <button onClick={() => navigate('/planner')}
              className="self-start bg-burgundy-600 hover:bg-burgundy-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-sm">
              + Plan new trip
            </button>
          </div>

          {loading && <div className="text-center py-20 text-gray-400 animate-pulse">Loading your trips...</div>}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {!loading && !error && trips.length === 0 && (
            <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No trips planned yet</h3>
              <p className="text-gray-400 text-sm mb-6">Start exploring India with Voyara!</p>
              <button onClick={() => navigate('/planner')}
                className="bg-burgundy-600 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-burgundy-700 transition">
                Plan Your First Trip
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.map(trip => (
              <TripCard key={trip._id} trip={trip} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
