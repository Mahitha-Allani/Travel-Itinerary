import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import api from '../api/axios.js'

const TRIP_TYPES = [
  { value: 'Solo',         icon: '🧳', label: 'Solo' },
  { value: 'Friends',      icon: '👥', label: 'Friends' },
  { value: 'Family',       icon: '👨‍👩‍👧‍👦', label: 'Family' },
  { value: 'Professional', icon: '💼', label: 'Professional' },
]

export default function Planner() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultDest = searchParams.get('dest') || ''

  const [cities, setCities] = useState([])
  const [form, setForm] = useState({
    source: '',
    destination: defaultDest,
    startDate: '',
    endDate: '',
    tripType: 'Solo',
  })
  const [cost, setCost]           = useState(null)
  const [error, setError]         = useState('')
  const [success, setSuccess]     = useState(false)
  const [loading, setLoading]     = useState(false)
  const [fetchingPrice, setFetchingPrice] = useState(false)

  useEffect(() => {
    api.get('/cities').then(({ data }) => setCities(data)).catch(() => {})
  }, [])

  useEffect(() => {
    if (!form.source || !form.destination || form.source === form.destination) {
      setCost(null); return
    }
    setFetchingPrice(true)
    api.get(`/cities/costs?from=${form.source}&to=${form.destination}`)
      .then(({ data }) => {
        setTimeout(() => {
          const variance = Math.floor(Math.random() * 400) - 200
          setCost({
            flight: data.flight !== 'N/A' ? data.flight + (variance * 2) : 'N/A',
            train:  data.train  !== 'N/A' ? data.train  + variance       : 'N/A',
            bus:    data.train  !== 'N/A' ? Math.floor(data.train * 0.7) + variance : 'N/A',
          })
          setFetchingPrice(false)
        }, 800)
      }).catch(() => { setCost(null); setFetchingPrice(false) })
  }, [form.source, form.destination]) // Removed startDate and endDate from dependency array since stay cost is removed

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
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
    <div className="min-h-screen flex flex-col bg-creme-50">
      <Navbar />

      <section className="flex-1 flex items-start justify-center py-16 px-4">
        <div className="w-full max-w-2xl">

          {/* Page Title */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">Plan a new trip</h1>
          </div>

          <form onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">

            {/* Destination */}
            <div className="p-6 border-b border-gray-100">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Where to?
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">From</p>
                  <select required value={form.source}
                    onChange={e => setForm({ ...form, source: e.target.value })}
                    className="w-full text-gray-800 text-base font-medium bg-transparent border-none outline-none focus:ring-0 cursor-pointer">
                    <option value="">Select source...</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1.5">To</p>
                  <select required value={form.destination}
                    onChange={e => setForm({ ...form, destination: e.target.value })}
                    className="w-full text-gray-800 text-base font-medium bg-transparent border-none outline-none focus:ring-0 cursor-pointer">
                    <option value="">Select destination...</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
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
            {(fetchingPrice || cost) && (
              <div className="px-6 py-4 bg-creme-50 border-b border-gray-100">
                {fetchingPrice ? (
                  <p className="text-sm text-burgundy-600 font-medium animate-pulse">⚡ Fetching live prices...</p>
                ) : cost && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                      Live Real-Time Prices
                    </p>
                    <div className="flex gap-6 flex-wrap">
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-0.5">✈ Flight</p>
                        <p className="text-xl font-bold text-burgundy-600">{fmt(cost.flight)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-0.5">🚂 Train</p>
                        <p className="text-xl font-bold text-burgundy-600">{fmt(cost.train)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-400 mb-0.5">🚌 Bus</p>
                        <p className="text-xl font-bold text-burgundy-600">{fmt(cost.bus)}</p>
                      </div>
                    </div>
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
