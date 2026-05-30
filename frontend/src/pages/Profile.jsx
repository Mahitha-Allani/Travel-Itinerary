import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const loadStats = async () => {
    if (loaded) return
    const { data } = await api.get('/trips')
    setTrips(data)
    setLoaded(true)
  }

  useState(() => { loadStats() }, [])

  const handleLogout = () => { logout(); navigate('/') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const destinations = trips ? [...new Set(trips.map(t => t.destination))] : []
  const totalDays    = trips ? trips.reduce((s, t) => s + t.days, 0) : 0

  return (
    <div className="min-h-screen flex flex-col bg-creme-50">
      <Navbar />

      <section className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Profile card */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-linear-to-r from-pink-500 to-burgundy-600 h-28 sm:h-36" />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center text-3xl font-bold text-burgundy-600 border-4 border-white">
                  {initials}
                </div>
                <button onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-4 py-1.5 rounded-xl transition">
                  Logout
                </button>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Trips Planned', value: trips?.length ?? '—', icon: '🗺️' },
              { label: 'Cities Visited', value: destinations.length || '—', icon: '📍' },
              { label: 'Days Travelled', value: totalDays || '—', icon: '📅' },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 text-center">
                <div className="text-3xl mb-2">{s.icon}</div>
                <div className="text-2xl font-bold text-burgundy-600">{s.value}</div>
                <div className="text-xs text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Destinations visited */}
          {destinations.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="font-bold text-gray-700 mb-4">Cities You've Planned For</h3>
              <div className="flex flex-wrap gap-2">
                {destinations.map(d => (
                  <span key={d} className="px-3 py-1.5 bg-burgundy-50 text-burgundy-600 border border-burgundy-200 rounded-full text-sm font-medium">
                    📍 {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-gray-700 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button onClick={() => navigate('/planner')}
                className="flex items-center gap-3 p-4 rounded-xl border border-creme-200 hover:border-pink-300 hover:bg-creme-50 transition text-left">
                <span className="text-2xl">✈️</span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">Plan New Trip</p>
                  <p className="text-xs text-gray-400">Add a new destination</p>
                </div>
              </button>
              <button onClick={() => navigate('/itinerary')}
                className="flex items-center gap-3 p-4 rounded-xl border border-burgundy-100 hover:border-burgundy-300 hover:bg-burgundy-50 transition text-left">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-semibold text-gray-700 text-sm">View Itineraries</p>
                  <p className="text-xs text-gray-400">See all your trips</p>
                </div>
              </button>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  )
}
