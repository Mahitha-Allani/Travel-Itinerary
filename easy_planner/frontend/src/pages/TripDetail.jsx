import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import api from '../api/axios.js'

const defaultImg = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200&q=80'

// 20 unique luxury hotel images — each hotel gets a unique one via name hashing
const hotelImages = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=500&q=80',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=500&q=80',
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=500&q=80',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=500&q=80',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=500&q=80',
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&q=80',
  'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500&q=80',
  'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&q=80',
  'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=500&q=80',
  'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&q=80',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=500&q=80',
  'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&q=80',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&q=80',
  'https://images.unsplash.com/photo-1585255318859-f5c15f4cffe9?w=500&q=80',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?w=500&q=80',
  'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=500&q=80',
  'https://images.unsplash.com/photo-1609602126247-4c5e42e76094?w=500&q=80',
  'https://images.unsplash.com/photo-1587213811864-46e59f6764b4?w=500&q=80',
]

// 20 unique restaurant/food images
const restaurantImages = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&q=80',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=500&q=80',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=500&q=80',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80',
  'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=500&q=80',
  'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500&q=80',
  'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&q=80',
  'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&q=80',
  'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=500&q=80',
  'https://images.unsplash.com/photo-1534080391025-a77af6ec78a0?w=500&q=80',
  'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500&q=80',
  'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=500&q=80',
  'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80',
  'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=500&q=80',
  'https://images.unsplash.com/photo-1585518419759-7fe2e0fbf8a6?w=500&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&q=80',
  'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&q=80',
  'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=500&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&q=80',
]

// Hash a string to a number for deterministic unique image selection
function hashName(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash)
}
function getHotelImage(name) { return hotelImages[hashName(name) % hotelImages.length] }
function getRestaurantImage(name) { return restaurantImages[hashName(name) % restaurantImages.length] }

const tripTypeIcon = { Solo: '🧳', Friends: '👥', Family: '👨‍👩‍👧‍👦', Professional: '💼' }

function DynamicImage({ query, className, alt, fallback }) {
  const [img, setImg] = useState(fallback || defaultImg)

  useEffect(() => {
    if (!query) return
    api.get(`/images/search?q=${encodeURIComponent(query)}`)
      .then(res => {
        if (res.data.imageUrl) setImg(res.data.imageUrl)
      })
      .catch(() => {})
  }, [query])

  return <img src={img} alt={alt} className={className} />
}

export default function TripDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)

  // Dynamic Hotel & Restaurant Explore States
  const [exploreData, setExploreData] = useState({ hotels: [], restaurants: [] })
  const [loadingExplore, setLoadingExplore] = useState(true)
  const [activeTab, setActiveTab] = useState('hotels')
  const [stayDays, setStayDays] = useState(1)
  const [guestsCount, setGuestsCount] = useState(2)
  const [roomsCount, setRoomsCount] = useState(1)

  // Fetch Trip Details
  useEffect(() => {
    api.get(`/trips/${id}`)
      .then(({ data }) => {
        setTrip(data)
        if (data.days) setStayDays(data.days)
        setLoading(false)
      })
      .catch(() => navigate('/itinerary'))
  }, [id, navigate])



  // Fetch Hotels and Restaurants dynamically
  useEffect(() => {
    if (!trip) return
    setLoadingExplore(true)
    api.get(`/trips/${id}/explore`)
      .then(({ data }) => {
        setExploreData(data)
      })
      .catch((err) => {
        console.error('Failed to load local explore spots:', err)
      })
      .finally(() => setLoadingExplore(false))
  }, [id, trip])

  // Recommend Rooms count dynamically when guests change
  useEffect(() => {
    setRoomsCount(Math.max(1, Math.ceil(guestsCount / 2)))
  }, [guestsCount])

  const fmt = v => (v === 'N/A' || v == null) ? 'N/A' : `₹${Number(v).toLocaleString('en-IN')}`
  const formatDate = d => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null

  if (loading) return (
    <div className="min-h-screen bg-creme-50 flex items-center justify-center">
      <div className="text-gray-400 text-lg animate-pulse">Loading your trip...</div>
    </div>
  )

  if (!trip) return null

  const dateStr = trip.startDate && trip.endDate
    ? `${formatDate(trip.startDate)} – ${formatDate(trip.endDate)}`
    : `${trip.days} day${trip.days !== 1 ? 's' : ''}`

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-72 sm:h-96 w-full shrink-0">
        <DynamicImage query={trip.destination} alt={trip.destination} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <button onClick={() => navigate('/itinerary')}
          className="absolute top-6 left-6 bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-white/30 transition cursor-pointer">
          ← Back
        </button>
      </div>

      {/* Content */}
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 -mt-20 relative z-10 pb-20 flex-1">

        {/* Floating Title Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                Trip to {trip.destination}
              </h1>
              <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
                <span>📅 {dateStr}</span>
                <span>·</span>
                <span>{tripTypeIcon[trip.tripType] || '🧳'} {trip.tripType || 'Solo'}</span>
                <span>·</span>
                <span>📍 {trip.source} → {trip.destination}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="https://www.airindia.com/" target="_blank" rel="noreferrer"
                className="bg-burgundy-600 hover:bg-burgundy-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center">
                ✈ AirIndia
              </a>
              <a href="https://www.irctc.co.in/nget/" target="_blank" rel="noreferrer"
                className="bg-burgundy-600 hover:bg-burgundy-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center">                
                🚂 IRCTC
              </a>
              <a href={`https://www.redbus.in/bus-tickets/${trip.source?.toLowerCase()}-to-${trip.destination?.toLowerCase()}`} target="_blank" rel="noreferrer"
                className="bg-burgundy-600 hover:bg-burgundy-750 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-xs flex items-center">
                🚌 RedBus
              </a>
            </div>
          </div>

          {/* Cost Pills */}
          <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-gray-100">
            <span className="px-3 py-1.5 bg-burgundy-50 text-burgundy-700 border border-burgundy-100 rounded-full text-xs font-semibold">✈ Flight: {fmt(trip.cost?.flight)}</span>
            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-semibold">🚂 Train: {fmt(trip.cost?.train)}</span>
            <span className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-full text-xs font-semibold">🚌 Bus: {fmt(trip.cost?.bus)}</span>
          </div>
        </div>

        {/* Explore Places */}
        {trip.places?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 border border-gray-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">📍 Explore {trip.destination}</h2>
              <span className="text-xs text-gray-400">{trip.places.length} spots</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2" style={{ scrollSnapType: 'x mandatory' }}>
              {trip.places.map((place, i) => (
                <div key={place} className="shrink-0 w-52 rounded-xl overflow-hidden shadow-xs border border-gray-100"
                  style={{ scrollSnapAlign: 'start' }}>
                  <DynamicImage query={`${place} ${trip.destination}`} alt={place}
                    className="w-full h-32 object-cover" />
                  <div className="p-3">
                    <p className="font-semibold text-sm text-gray-800">{place}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Must-visit attraction</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Day-by-Day Activities */}
        {trip.activities?.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-6 border border-gray-50">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">🗓️ Itinerary</h2>
              <span className="text-xs text-gray-400 font-medium">{trip.activities.length} day{trip.activities.length !== 1 ? 's' : ''} · {trip.destination}</span>
            </div>
            <div className="space-y-0">
              {trip.activities.map((act, i) => (
                <div key={i} className="flex gap-4 items-start py-4 border-b border-gray-50 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-700 font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{act}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Day {i + 1} of {trip.days || trip.activities.length} · {trip.destination}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Accommodations & Dining Tabs */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden mb-8">
          {/* Tab Selector */}
          <div className="flex border-b border-gray-150 bg-gray-50/50">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 cursor-pointer
                ${activeTab === 'hotels'
                  ? 'border-burgundy-600 text-burgundy-700 bg-white'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              🏨 Nearby Hotels
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`flex-1 py-4 text-center font-bold text-sm transition-all border-b-2 cursor-pointer
                ${activeTab === 'restaurants'
                  ? 'border-burgundy-600 text-burgundy-700 bg-white'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
            >
              🍽️ Popular Dinings
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {loadingExplore ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 rounded-full border-4 border-burgundy-200 border-t-burgundy-600 animate-spin" />
                <p className="text-gray-400 text-sm font-medium">Finding spots near {trip.destination}...</p>
              </div>
            ) : (
              <div>
                {/* HOTELS TAB */}
                {activeTab === 'hotels' && (
                  <div>
                    {/* Stay Parameters Control Box */}
                    <div className="bg-creme-50/60 border border-creme-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-wrap gap-4 sm:gap-6 justify-between items-center shadow-xs">
                      <div>
                        <h3 className="font-bold text-burgundy-700 text-sm mb-1">🏨 Customize Your Stay</h3>
                        <p className="text-xs text-gray-400">Calculate prices instantly for bookings</p>
                      </div>
                      <div className="flex flex-wrap gap-3 items-center">
                        <div className="flex flex-col gap-1">
                          <span className="text-3xs uppercase tracking-wider font-bold text-gray-400">Stay (Nights)</span>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            value={stayDays}
                            onChange={(e) => setStayDays(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-3xs uppercase tracking-wider font-bold text-gray-400">Guests</span>
                          <input
                            type="number"
                            min="1"
                            max="50"
                            value={guestsCount}
                            onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-3xs uppercase tracking-wider font-bold text-gray-400">Rooms</span>
                          <input
                            type="number"
                            min="1"
                            max="25"
                            value={roomsCount}
                            onChange={(e) => setRoomsCount(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-16 p-2 text-center text-sm font-bold text-gray-800 bg-white rounded-xl border border-gray-200 focus:outline-none focus:ring-1 focus:ring-burgundy-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Hotel Cards List */}
                    <div className="space-y-4">
                      {exploreData.hotels?.length > 0 ? (
                        exploreData.hotels.map((hotel, i) => {
                          const totalCost = hotel.basePrice * stayDays * roomsCount
                          // Dynamic redirect booking link with filled query parameters
                          const bookingUrl = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name + ' ' + trip.destination)}&group_adults=${guestsCount}&no_rooms=${roomsCount}`

                          return (
                            <div key={hotel.name || i} className="flex flex-col md:flex-row gap-5 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-md transition-all group duration-300">
                              <div className="w-full md:w-44 h-36 rounded-xl overflow-hidden shrink-0 relative bg-gray-200">
                                <img src={getHotelImage(hotel.name)} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                                <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-950 text-2xs font-bold px-2 py-0.5 rounded-md shadow-xs">★ {hotel.rating?.toFixed(1) || '4.5'}</span>
                              </div>
                              <div className="flex-1 flex flex-col justify-between">
                                <div>
                                  <h3 className="font-bold text-gray-800 text-base mb-1">{hotel.name}</h3>
                                  <p className="text-2xs text-gray-400 flex items-center gap-1 mb-2">📍 {hotel.address}</p>
                                  <p className="text-xs text-gray-500 leading-relaxed">{hotel.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
                                  <div>
                                    <p className="text-sm text-gray-600 font-semibold">{fmt(hotel.basePrice)} <span className="text-3xs text-gray-400">/ night</span></p>
                                    <p className="text-xs text-burgundy-600 font-bold mt-0.5">{fmt(totalCost)} <span className="text-3xs text-gray-400 font-normal">total</span></p>
                                  </div>
                                  <a
                                    href={bookingUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-burgundy-600 hover:bg-burgundy-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-sm hover:shadow-md cursor-pointer block text-center"
                                  >
                                    Book Now
                                  </a>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-center text-gray-400 text-sm py-8">No hotels found near this destination.</p>
                      )}
                      {/* See More Hotels */}
                      <div className="mt-6 text-center">
                        <a
                          href={`https://www.google.com/search?q=best+hotels+in+${encodeURIComponent(trip.destination)}+India+booking`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:text-burgundy-600 transition-all group"
                        >
                          <span>🔍</span>
                          <span>See More Hotels in {trip.destination}</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* RESTAURANTS TAB */}
                {activeTab === 'restaurants' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {exploreData.restaurants?.length > 0 ? (
                      exploreData.restaurants.map((rest, i) => {
                        // Dynamic redirect menu explore link with query parameters
                        const exploreUrl = `https://www.google.com/search?q=${encodeURIComponent(rest.name + ' ' + trip.destination + ' restaurant menu reviews')}`

                        return (
                          <div key={rest.name || i} className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-white hover:shadow-md transition-all group duration-300">
                            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-gray-200">
                              <img src={getRestaurantImage(rest.name)} alt={rest.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                              <span className="absolute bottom-1 right-1 bg-black/60 backdrop-blur-xs text-white text-3xs font-medium px-1.5 py-0.5 rounded-md">★ {rest.rating?.toFixed(1) || '4.3'}</span>
                            </div>
                            <div className="flex-1 flex flex-col justify-between min-w-0">
                              <div>
                                <h3 className="font-bold text-gray-800 text-sm truncate">{rest.name}</h3>
                                <p className="text-3xs font-semibold text-burgundy-600 mb-1.5">{rest.cuisine}</p>
                                <p className="text-4xs text-gray-400 truncate mb-2">📍 {rest.address}</p>
                                <p className="text-3xs text-gray-500 leading-snug line-clamp-2">{rest.description}</p>
                              </div>
                              <div className="flex justify-end mt-2 pt-2 border-t border-gray-50">
                                <a
                                  href={exploreUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-3xs font-bold text-burgundy-600 hover:text-burgundy-800 flex items-center gap-1 cursor-pointer"
                                >
                                  Explore & View Menu →
                                </a>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-center text-gray-400 text-sm py-8 col-span-2">No restaurants found near this destination.</p>
                    )}
                    {/* See More Restaurants */}
                    <div className="mt-6 text-center col-span-full">
                      <a
                        href={`https://www.google.com/search?q=best+restaurants+in+${encodeURIComponent(trip.destination)}+India+popular+dining`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:text-burgundy-600 transition-all group"
                      >
                        <span>🔍</span>
                        <span>See More Restaurants in {trip.destination}</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Delete */}
        <div className="text-center">
          <button onClick={async () => {
            if (!confirm('Delete this trip?')) return
            await api.delete(`/trips/${trip._id}`)
            navigate('/itinerary')
          }} className="text-red-400 hover:text-red-650 text-sm font-medium transition cursor-pointer">
            🗑 Delete this trip
          </button>
        </div>
      </div>
    </div>
  )
}
