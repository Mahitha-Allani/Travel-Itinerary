import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import TravelDoodleBg from '../components/TravelDoodleBg.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../api/axios.js'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [trips, setTrips] = useState(null)
  const [loaded, setLoaded] = useState(false)

  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const loadStats = async () => {
    try {
      const { data } = await api.get('/trips')
      setTrips(data)
      setLoaded(true)
    } catch (err) {
      console.error('Failed to load trips for profile', err)
      setTrips([])
      setLoaded(true)
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const handleLogout = () => { logout() }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Convert to Base64
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = async () => {
      try {
        setUploading(true)
        const base64Image = reader.result
        await api.put('/users/profile-picture', { profilePicture: base64Image })
        window.location.reload()
      } catch (err) {
        console.error('Upload failed', err)
        alert('Failed to upload profile picture. Image might be too large.')
      } finally {
        setUploading(false)
      }
    }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const destinations = trips ? [...new Set(trips.map(t => t.destination))] : []
  const totalDays    = trips ? trips.reduce((s, t) => s + (t.days || 1), 0) : 0

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#fcfbf9] via-[#f8f7f4] to-[#f4f3ef] relative overflow-hidden">
      <Navbar />
      <TravelDoodleBg opacity="opacity-[0.05]" />

      <section className="flex-1 py-10 px-4 relative z-10">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Profile card */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden border border-white/80">
            <div className="bg-gradient-to-r from-pink-500 to-burgundy-700 h-28 sm:h-36 relative" />
            <div className="px-6 pb-6">
              <div className="-mt-10 mb-4 flex items-end justify-between">
                
                {/* Avatar with Upload */}
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white shadow-xl flex items-center justify-center text-4xl font-bold text-burgundy-700 border-4 border-white relative group cursor-pointer overflow-hidden z-10"
                >
                  {user?.profilePicture ? (
                    <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-bold text-center">
                      {uploading ? 'Uploading...' : 'Change\nPhoto'}
                    </span>
                  </div>
                </div>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileChange}
                />

                <button onClick={handleLogout}
                  className="text-xs sm:text-sm font-semibold text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 bg-white/80 px-4 py-2 rounded-2xl transition z-10 shadow-xs">
                  🚪 Logout
                </button>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{user?.name}</h2>
              <p className="text-slate-500 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3.5 sm:gap-4">
            {[
              { label: 'Trips Planned', value: trips?.length ?? '—', icon: '🗺️' },
              { label: 'Cities Visited', value: destinations.length || '—', icon: '📍' },
              { label: 'Days Travelled', value: totalDays || '—', icon: '📅' },
            ].map(s => (
              <div key={s.label} className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-md p-4 sm:p-5 text-center border border-white/80">
                <div className="text-2xl sm:text-3xl mb-1.5">{s.icon}</div>
                <div className="text-xl sm:text-2xl font-black text-burgundy-700 font-brand">{s.value}</div>
                <div className="text-[11px] sm:text-xs text-slate-500 font-medium mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Destinations visited */}
          {destinations.length > 0 && (
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-md p-6 border border-white/80">
              <h3 className="font-extrabold text-slate-900 text-base mb-3.5">Cities You've Planned For</h3>
              <div className="flex flex-wrap gap-2">
                {destinations.map(d => (
                  <span key={d} className="px-3 py-1.5 bg-burgundy-50 text-burgundy-700 border border-burgundy-100 rounded-full text-xs sm:text-sm font-semibold">
                    📍 {d}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick actions */}
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-md p-6 border border-white/80">
            <h3 className="font-extrabold text-slate-900 text-base mb-3.5">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <button onClick={() => navigate('/planner')}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 hover:border-burgundy-300 hover:bg-rose-50/40 transition text-left group">
                <span className="text-2xl">✈️</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-burgundy-700">Plan New Trip</p>
                  <p className="text-xs text-slate-400">Add a new destination</p>
                </div>
              </button>
              <button onClick={() => navigate('/itinerary')}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200/80 hover:border-burgundy-300 hover:bg-rose-50/40 transition text-left group">
                <span className="text-2xl">📋</span>
                <div>
                  <p className="font-bold text-slate-800 text-sm group-hover:text-burgundy-700">View Itineraries</p>
                  <p className="text-xs text-slate-400">See all your trips</p>
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
