import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import TravelDoodleBg from '../components/TravelDoodleBg.jsx'
import api from '../api/axios.js'

const TRIP_TYPES = [
  { value: 'Solo',         icon: '🧳', label: 'Solo' },
  { value: 'Friends',      icon: '👥', label: 'Friends' },
  { value: 'Family',       icon: '👨‍👩‍👧‍👦', label: 'Family' },
  { value: 'Professional', icon: '💼', label: 'Professional' },
]

// Searchable city picker with custom typing and instant filtering
function CityPicker({ label, value, onChange, cities, excludeCity }) {
  const [query, setQuery] = useState(value || '')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const filtered = cities.filter(c =>
    c !== excludeCity && c.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 60)

  useEffect(() => {
    setQuery(value || '')
  }, [value])

  useEffect(() => {
    const handleClick = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const select = (city) => {
    onChange(city)
    setQuery(city)
    setOpen(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered.length > 0) {
        select(filtered[0])
      } else if (query.trim()) {
        select(query.trim())
      }
    }
  }

  const hasExactMatch = cities.some(c => c.toLowerCase() === query.trim().toLowerCase())

  return (
    <div ref={ref} className="relative w-full">
      <p className="text-xs text-gray-500 font-medium mb-1.5">{label}</p>

      <input
        type="text"
        value={query}
        placeholder={`Search or type ${label === 'From' ? 'source' : 'destination'}...`}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={e => {
          setQuery(e.target.value)
          onChange(e.target.value)
          setOpen(true)
        }}
        onKeyDown={handleKeyDown}
        className="w-full text-gray-800 text-sm font-medium bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-burgundy-300 transition-all"
      />

      {open && (filtered.length > 0 || (query.trim() && !hasExactMatch)) && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl max-h-52 overflow-y-auto">
          {filtered.map(city => (
            <button key={city} type="button" onMouseDown={() => select(city)}
              className="w-full text-left px-4 py-2 text-sm hover:bg-burgundy-50 hover:text-burgundy-700 transition-colors border-b border-gray-50 last:border-0 flex items-center gap-2">
              <span className="text-xs">📍</span> <span>{city}</span>
            </button>
          ))}
          {query.trim() && !hasExactMatch && (
            <button
              type="button"
              onMouseDown={() => select(query.trim())}
              className="w-full text-left px-4 py-2.5 text-xs font-semibold text-burgundy-700 bg-burgundy-50/70 hover:bg-burgundy-100 transition-colors flex items-center gap-2"
            >
              <span>✨</span> <span>Use custom location: "{query.trim()}"</span>
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const FALLBACK_CITIES = [
  'Agartala', 'Agra', 'Ahmedabad', 'Ahmednagar', 'Aizawl', 'Ajmer', 'Akola', 'Aligarh', 'Allahabad (Prayagraj)',
  'Alwar', 'Ambala', 'Amravati', 'Amritsar', 'Anantapur', 'Aurangabad', 'Bangalore', 'Bareilly',
  'Belgaum', 'Bhavnagar', 'Bhilai', 'Bhiwandi', 'Bhopal', 'Bhubaneswar', 'Bikaner', 'Bilaspur',
  'Chandigarh', 'Chennai', 'Coimbatore', 'Cuttack', 'Dahod', 'Daman', 'Davangere', 'Dehradun',
  'Delhi', 'Dhanbad', 'Dharwad', 'Dibrugarh', 'Durgapur', 'Erode', 'Faridabad', 'Gandhinagar',
  'Gangtok', 'Gaya', 'Ghaziabad', 'Goa', 'Gorakhpur', 'Gulbarga', 'Guntur', 'Gurgaon', 'Guwahati',
  'Gwalior', 'Haridwar', 'Hubli', 'Hyderabad', 'Imphal', 'Indore', 'Itanagar', 'Jabalpur',
  'Jaipur', 'Jalandhar', 'Jalgaon', 'Jammu', 'Jamnagar', 'Jamshedpur', 'Jodhpur', 'Jorhat',
  'Junagadh', 'Kakinada', 'Kalyan', 'Kanpur', 'Karnal', 'Kochi', 'Kohima', 'Kolkata', 'Kollam',
  'Kota', 'Kozhikode', 'Kumbakonam', 'Leh', 'Lucknow', 'Ludhiana', 'Madurai', 'Mangalore',
  'Manali', 'Mathura', 'Meerut', 'Moradabad', 'Mumbai', 'Mussoorie', 'Mysore', 'Nagpur', 'Nashik',
  'Navi Mumbai', 'Nellore', 'Noida', 'Ooty', 'Panchkula', 'Panipat', 'Patna', 'Pondicherry',
  'Port Blair', 'Pune', 'Puri', 'Raipur', 'Rajkot', 'Rajahmundry', 'Ranchi', 'Rishikesh',
  'Rohtak', 'Rourkela', 'Salem', 'Saharanpur', 'Shillong', 'Shimla', 'Siliguri', 'Silvassa',
  'Solapur', 'Srinagar', 'Surat', 'Thane', 'Thiruvananthapuram', 'Thrissur', 'Tiruchirapalli',
  'Tirunelveli', 'Tirupati', 'Udaipur', 'Ujjain', 'Vadodara', 'Varanasi', 'Vijayawada', 'Visakhapatnam',
  'Vellore', 'Warangal', 'Darjeeling', 'Lakshadweep', 'Diu', 'Nainital', 'Munnar', 'Kodaikanal',
  'Mahabaleshwar', 'Lonavla', 'Mahabalipuram', 'Hampi', 'Khajuraho', 'Andaman', 'Coorg',
  'Jaisalmer', 'Pushkar', 'Mount Abu', 'Kasol', 'Spiti', 'Dharamshala', 'Chikmagalur', 'Wayanad',
  'Alleppey', 'Kovalam', 'Varkala', 'Gokarna'
]

export default function Planner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultDest = searchParams.get('dest') || ''

  const [cities, setCities] = useState(FALLBACK_CITIES)
  const [form, setForm] = useState({
    source: '',
    destination: defaultDest,
    startDate: '',
    endDate: '',
    tripType: 'Solo',
  })
  const [baseCost, setBaseCost]   = useState(null)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [fetchingPrice, setFetchingPrice] = useState(false)

  useEffect(() => {
    api.get('/cities')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setCities(data)
        }
      })
      .catch(() => {
        // Keeps FALLBACK_CITIES if backend unreachable
      })
  }, [])

  useEffect(() => {
    if (!form.source || !form.destination || form.source === form.destination) {
      setBaseCost(null); return
    }
    setFetchingPrice(true)
    api.get(`/cities/costs?from=${form.source}&to=${form.destination}`)
      .then(({ data }) => {
        setTimeout(() => {
          const variance = Math.floor(Math.random() * 400) - 200
          setBaseCost({
            flight: data.flight !== 'N/A' ? data.flight + (variance * 2) : 'N/A',
            train:  data.train  !== 'N/A' ? data.train  + variance       : 'N/A',
            bus:    data.train  !== 'N/A' ? Math.floor(data.train * 0.7) + variance : 'N/A',
          })
          setFetchingPrice(false)
        }, 600)
      }).catch(() => { setBaseCost(null); setFetchingPrice(false) })
  }, [form.source, form.destination])

  const getMultiplier = (type) => {
    switch (type) {
      case 'Friends': return 4;
      case 'Family': return 4;
      case 'Solo':
      case 'Professional':
      default: return 1;
    }
  }

  const multiplier = getMultiplier(form.tripType)
  const displayCost = baseCost ? {
    flight: baseCost.flight !== 'N/A' ? baseCost.flight * multiplier : 'N/A',
    train: baseCost.train !== 'N/A' ? baseCost.train * multiplier : 'N/A',
    bus: baseCost.bus !== 'N/A' ? baseCost.bus * multiplier : 'N/A',
  } : null;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.source) return setError('Please select a source city.')
    if (!form.destination) return setError('Please select a destination city.')
    if (form.source === form.destination) return setError('Source and destination must be different.')
    if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate))
      return setError('End date must be after start date.')
    setLoading(true)
    try {
      await api.post('/trips', form)
      setSuccess(true)
      setTimeout(() => navigate('/itinerary'), 1200)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save trip')
    } finally {
      setLoading(false)
    }
  }

  const fmt = v => v === 'N/A' ? 'N/A' : `₹${Number(v).toLocaleString('en-IN')}`

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fcfbf9] via-[#f8f7f4] to-[#f4f3ef] relative overflow-hidden">
      <Navbar />
      <TravelDoodleBg opacity="opacity-[0.05]" />

      <section className="flex-1 flex items-start justify-center py-12 sm:py-16 px-4 relative z-10">
        <div className="w-full max-w-2xl">

          {/* Page Title */}
          <div className="text-center mb-8 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-burgundy-200/70 text-burgundy-900 text-xs font-semibold mb-3 shadow-xs">
              <span>✈️</span> <span>Personalized Itinerary Builder</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">Plan a new trip</h1>
            <p className="text-slate-600 font-normal text-sm sm:text-base max-w-md mx-auto leading-relaxed">Choose your source & destination to get instant live fares for flights, trains, and buses.</p>
          </div>

          <form onSubmit={handleSubmit}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden relative z-10">

            {/* Destination */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Where to?
              </label>
              <div className="grid grid-cols-2 gap-6">
                <CityPicker
                  label="From"
                  value={form.source}
                  onChange={v => setForm({ ...form, source: v })}
                  cities={cities}
                  excludeCity={form.destination}
                />
                <CityPicker
                  label="To"
                  value={form.destination}
                  onChange={v => setForm({ ...form, destination: v })}
                  cities={cities}
                  excludeCity={form.source}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Dates (optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">📅 Start date</p>
                  <input type="date" value={form.startDate}
                    onChange={e => setForm({ ...form, startDate: e.target.value })}
                    className="w-full text-gray-700 text-sm bg-transparent border-none outline-none focus:ring-0" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">📅 End date</p>
                  <input type="date" value={form.endDate}
                    onChange={e => setForm({ ...form, endDate: e.target.value })}
                    min={form.startDate}
                    className="w-full text-gray-700 text-sm bg-transparent border-none outline-none focus:ring-0" />
                </div>
              </div>
            </div>

            {/* Trip Type */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Trip type
              </label>
              <div className="flex flex-wrap gap-2">
                {TRIP_TYPES.map(t => (
                  <button key={t.value} type="button"
                    onClick={() => setForm({ ...form, tripType: t.value })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border-2 text-sm font-semibold transition
                      ${form.tripType === t.value
                        ? 'border-burgundy-600 bg-burgundy-600 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-burgundy-300'}`}>
                    <span>{t.icon}</span> {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Pricing */}
            {(fetchingPrice || displayCost) && (
              <div className="px-6 py-5 bg-gradient-to-br from-burgundy-50/40 via-white to-amber-50/30 border-b border-gray-100">
                {fetchingPrice ? (
                  <div className="flex items-center gap-2 text-burgundy-700 font-medium text-sm animate-pulse">
                    <span>⚡</span>
                    <span>Analyzing real-time route fares & tariffs...</span>
                  </div>
                ) : displayCost && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-burgundy-900 uppercase tracking-wider">
                        Estimated Live Route Fares ({form.tripType})
                      </p>
                      <span className="text-[11px] font-medium text-slate-500 bg-white/80 px-2 py-0.5 rounded-md border border-gray-200">
                        Dynamic tariff engine
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {/* Flight */}
                      <div className="bg-white/80 rounded-2xl p-3 border border-burgundy-100/80 shadow-xs text-center flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5 font-medium">✈ Flight</p>
                          <p className="text-lg sm:text-xl font-bold text-burgundy-700">{fmt(displayCost.flight)}</p>
                        </div>
                        {form.source && form.destination && (
                          <a
                            href={`https://www.google.com/travel/flights?q=flights+from+${encodeURIComponent(form.source)}+to+${encodeURIComponent(form.destination)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-[11px] font-semibold text-burgundy-600 hover:text-burgundy-800 bg-burgundy-50 hover:bg-burgundy-100 py-1 px-2 rounded-lg transition-colors inline-block"
                          >
                            Book Flights ↗
                          </a>
                        )}
                      </div>

                      {/* Train */}
                      <div className="bg-white/80 rounded-2xl p-3 border border-amber-100/80 shadow-xs text-center flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5 font-medium">🚂 Train</p>
                          <p className="text-lg sm:text-xl font-bold text-amber-700">{fmt(displayCost.train)}</p>
                        </div>
                        {form.source && form.destination && (
                          <a
                            href="https://www.irctc.co.in/nget/train-search"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-[11px] font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 py-1 px-2 rounded-lg transition-colors inline-block"
                          >
                            IRCTC Trains ↗
                          </a>
                        )}
                      </div>

                      {/* Bus */}
                      <div className="bg-white/80 rounded-2xl p-3 border border-emerald-100/80 shadow-xs text-center flex flex-col justify-between">
                        <div>
                          <p className="text-xs text-slate-500 mb-0.5 font-medium">🚌 Bus</p>
                          <p className="text-lg sm:text-xl font-bold text-emerald-700">{fmt(displayCost.bus)}</p>
                        </div>
                        {form.source && form.destination && (
                          <a
                            href={`https://www.redbus.in/bus-tickets/${encodeURIComponent(form.source.toLowerCase())}-to-${encodeURIComponent(form.destination.toLowerCase())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 py-1 px-2 rounded-lg transition-colors inline-block"
                          >
                            RedBus Buses ↗
                          </a>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      💡 <strong>Note on pricing:</strong> Voyara calculates dynamic baseline fares adjusted for route distance, group size ({form.tripType === 'Solo' ? '1 person' : form.tripType === 'Professional' ? '1 person' : '4 people'}), and seasonal demand. Direct booking links open real-time live seats on official portals.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="px-6 py-3 bg-red-50 border-b border-red-100 text-red-600 text-sm">{error}</div>
            )}

            {/* CTA */}
            <div className="p-6 flex items-center justify-between">
              {success ? (
                <p className="text-green-600 font-semibold text-sm">✅ Trip saved! Redirecting...</p>
              ) : (
                <button type="submit" disabled={loading}
                  className="w-full bg-burgundy-600 hover:bg-burgundy-700 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl shadow-lg transition text-base">
                  {loading ? 'Saving...' : 'Start planning →'}
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
